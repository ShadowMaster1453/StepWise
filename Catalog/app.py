from flask import Flask, jsonify, request
from flask_cors import CORS
import catalog_service as catalog

app = Flask(__name__)
CORS(app)

@app.route("/api/products", methods=["GET"])
def list_products():
    brand = request.args.get("brand")
    category = request.args.get("category")
    q = request.args.get("q")
    limit = int(request.args.get("limit", 20)) 
    offset = int(request.args.get("offset", 0)) 
    
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
    item = catalog.get_product_by_id(pid)
    if not item:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(item), 200

@app.route("/api/brands", methods=["GET"])
def brands():
    return jsonify(catalog.get_brands()), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
