from collections import defaultdict
from db import get_connection

def fetch_raw_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT product_id, product_name, brand, category, size, color,
               price, stock, product_description, image_url
        FROM products
        ORDER BY product_name, brand, size, color
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

def get_review_stats():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            p.product_name AS product_name,
            p.brand AS brand,
            ROUND(AVG(r.rating), 1) AS avg_rating,
            COUNT(r.review_id) AS review_count,
            MAX(r.review_date) AS last_review
        FROM Reviews r
        JOIN products p ON r.product_id = p.product_id
        GROUP BY p.product_name, p.brand;
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    stats = {}
    for r in rows:
        key = (r["product_name"], r["brand"])
        stats[key] = {
            "rating": float(r["avg_rating"]) if r["avg_rating"] is not None else 0.0,
            "reviews": int(r["review_count"]),
            "updated": r["last_review"].strftime("%Y-%m-%d") if r["last_review"] else "N/A"
        }
    return stats

def group_products(rows):
    review_stats = get_review_stats()
    grouped = {}
    for r in rows:
        key = (r["product_name"], r["brand"])
        if key not in grouped:
            stats = review_stats.get(key, {"rating": 0.0, "reviews": 0, "updated": "N/A"})
            grouped[key] = {
                "id": r["product_id"],
                "name": r["product_name"],
                "brand": r["brand"],
                "category": (
                    "Children" if r["category"] == "Kids" else r["category"] or "All"
                ),
                "price": float(r["price"]),
                "description": r["product_description"] or "",
                "sizes": set(),
                "colors": set(),
                "rating": stats["rating"],
                "reviews": stats["reviews"],
                "updated": stats["updated"],
                "image_url": r["image_url"],
                "stock": r["stock"],
            }
        grouped[key]["sizes"].add(r["size"])
        if r["color"]:
            grouped[key]["colors"].add(r["color"])
    products = []
    for p in grouped.values():
        p["sizes"] = sorted(list(p["sizes"]))
        p["colors"] = sorted(list(p["colors"])) if p["colors"] else ["Black"]
        products.append(p)
    return products

def get_all_products(brand=None, category=None, q=None):
    rows = fetch_raw_products()
    products = group_products(rows)
    if brand:
        products = [p for p in products if p["brand"].lower() == brand.lower()]
    if category and category != "All":
        products = [p for p in products if p["category"].lower() == category.lower()]
    if q:
        q = q.lower()
        products = [p for p in products if q in p["name"].lower() or q in p["brand"].lower()]
    return products

def get_product_by_id(pid):
    for p in get_all_products():
        if p["id"] == pid:
            return p
    return None

def get_brands():
    rows = fetch_raw_products()
    products = group_products(rows)
    return sorted({p["brand"] for p in products})
