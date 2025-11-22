from db import get_connection

# ---------- Low-level DB fetch ----------

def fetch_raw_products():
    """
    Fetches all rows from the products table.
    Each row is a single variant (size, color) of a product.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT
            product_id,
            product_name,
            brand,
            category,
            size,
            color,
            price,
            stock,
            product_description,
            image_url
        FROM products
        ORDER BY product_name, brand, size, color
        """
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

# ---------- Group rows into frontend-friendly products ----------

def group_products(rows):
    """
    Groups DB rows (one per size/color) into product objects that match
    what your React frontend expects:

    {
      "id": ...,
      "name": ...,
      "brand": ...,
      "category": "Men" | "Women" | "Children" | "All",
      "price": ...,
      "description": ...,
      "sizes": [...],
      "colors": [...],
      "rating": ...,
      "reviews": ...,
      "updated": ...,
      "image_url": ...,
      "stock": ...
    }
    """
    grouped = {}

    for r in rows:
        key = (r["product_name"], r["brand"])

        if key not in grouped:
            # Normalize category: DB uses Men/Women/Kids, frontend uses Men/Women/Children/All
            db_cat = (r["category"] or "All")
            if db_cat == "Kids":
                norm_cat = "Children"
            else:
                norm_cat = db_cat

            # Default values for rating/reviews/updated (no review table needed)
            grouped[key] = {
                "id": r["product_id"],    # first variant's id
                "name": r["product_name"],
                "brand": r["brand"],
                "category": norm_cat,
                "price": float(r["price"]),
                "description": r["product_description"] or "",
                "sizes": set(),
                "colors": set(),
                "rating": 4.5,            # placeholder value
                "reviews": 120,           # placeholder value
                "updated": "2025-11-22",  # or "today"/"N/A" if you want
                "image_url": r["image_url"],
                "stock": r["stock"],
            }

        # Collect all sizes/colors for this logical product
        grouped[key]["sizes"].add(str(r["size"]))
        if r["color"]:
            grouped[key]["colors"].add(r["color"])

    # Convert sets to sorted lists for JSON
    products = []
    for p in grouped.values():
        # sizes sorted nicely (e.g., 6, 7, 8, 9, 10...)
        p["sizes"] = sorted(list(p["sizes"]), key=lambda x: (len(x), x))
        p["colors"] = sorted(list(p["colors"])) if p["colors"] else ["Black"]
        products.append(p)

    return products

# ---------- Public API used by Flask ----------

def get_all_products(brand=None, category=None, q=None):
    """
    Returns all products, with optional filtering:
    - brand: exact match, case-insensitive (e.g., Nike)
    - category: Men/Women/Children/All (Children maps from Kids in DB)
    - q: search term in name or brand, case-insensitive
    """
    rows = fetch_raw_products()
    products = group_products(rows)

    # Filter by brand
    if brand:
        products = [
            p for p in products
            if (p["brand"] or "").lower() == brand.lower()
        ]

    # Filter by category
    if category and category != "All":
        # normalize to match how we store it
        norm = category.capitalize()
        if norm == "Kids":
            norm = "Children"
        products = [
            p for p in products
            if (p["category"] or "").lower() == norm.lower()
        ]

    # Search filter (q)
    if q:
        needle = q.lower()
        products = [
            p for p in products
            if needle in p["name"].lower() or needle in p["brand"].lower()
        ]

    return products

def get_product_by_id(pid: int):
    """
    Finds a single product by its id.
    """
    for p in get_all_products():
        if p["id"] == pid:
            return p
    return None

def get_brands():
    """
    Returns a sorted list of all brands in the catalog.
    """
    rows = fetch_raw_products()
    products = group_products(rows)
    return sorted({p["brand"] for p in products if p.get("brand")})
