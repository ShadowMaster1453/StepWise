from flask import Flask, jsonify, request
from flask_cors import CORS
import catalog_service as catalog

app = Flask(__name__)
CORS(app)

@app.route("/api/health", methods=["GET"])
def health():
    """
    Simple health check endpoint.
    Use this to verify the backend is running.
    """
    return jsonify({"ok": True}), 200

@app.route("/api/products", methods=["GET"])
def list_products():
    """
    Returns a paginated list of products, with optional filters.

    Supported query parameters:
      - brand: filter by brand (e.g., Nike, Adidas)
      - category: Men, Women, Children, All
      - q or search: search text in name or brand
      - limit: number of products per page (default 20)
      - offset: starting index (default 0)
    """
    brand = request.args.get("brand")

    # support either ?category= or ?gender= just in case
    category = (
        request.args.get("category")
        or request.args.get("gender")
        or request.args.get("type")
    )

    # support ?q= or ?search= from frontend
    q = request.args.get("q") or request.args.get("search")

    # Pagination params
    try:
        limit = int(request.args.get("limit", 20))
    except ValueError:
        limit = 20
    try:
        offset = int(request.args.get("offset", 0))
    except ValueError:
        offset = 0

    items = catalog.get_all_products(brand=brand, category=category, q=q)
    total = len(items)
    paged_items = items[offset: offset + limit]

    return jsonify({
        "total": total,
        "limit": limit,
        "offset": offset,
        "products": paged_items
    }), 200

@app.route("/api/products/<int:pid>", methods=["GET"])
def get_product(pid):
    """
    Get details for a single product by id.
    """
    item = catalog.get_product_by_id(pid)
    if not item:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(item), 200

@app.route("/api/brands", methods=["GET"])
def brands():
    """
    Returns a list of brands present in the catalog.
    """
    return jsonify(catalog.get_brands()), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
