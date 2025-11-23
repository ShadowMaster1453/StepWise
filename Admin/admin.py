from flask import Blueprint, request, jsonify
from dp import get_connection

admin = Blueprint("admin", __name__)


# Query All Orders 
@admin.route("/orders", methods=["GET"])
def get_orders():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT order_id, user_id, total_amount, order_date, status
        FROM Orders
        ORDER BY order_date DESC
    """)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows), 200


# Query Single Order 
@admin.route("/orders/<int:oid>", methods=["GET"])
def get_order_detail(oid):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Order info
    cursor.execute("""
        SELECT order_id, user_id, total_amount, order_date, status
        FROM Orders
        WHERE order_id = %s
    """, (oid,))
    order = cursor.fetchone()

    if not order:
        return jsonify({"error": "Order not found"}), 404

    # Order product
    cursor.execute("""
        SELECT oi.order_item_id, oi.product_id, oi.quantity, 
               oi.unit_price, p.product_name, p.brand, p.size, p.color
        FROM OrderItems oi
        JOIN Products p ON oi.product_id = p.product_id
        WHERE oi.order_id = %s
    """, (oid,))
    items = cursor.fetchall()

    cursor.close()
    conn.close()

    order["items"] = items
    return jsonify(order), 200


# Upadte Order Status
@admin.route("/orders/<int:oid>/status", methods=["PUT"])
def update_order_status(oid):
    data = request.json
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Missing status"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Orders SET status = %s WHERE order_id = %s
    """, (new_status, oid))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Order status updated"}), 200

# Query all shipment info
@admin.route("/shipments", methods=["GET"])
def get_shipments():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT shipment_id, order_id, carrier, tracking_number, 
               ship_date, estimated_delivery, delivery_date, status
        FROM Shipments
        ORDER BY ship_date DESC
    """)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows), 200


# Update shipment info
@admin.route("/shipments/<int:sid>", methods=["PUT"])
def update_shipment(sid):
    data = request.json
    fields = []
    params = []

    for key in ["carrier", "tracking_number", "ship_date",
                "estimated_delivery", "delivery_date", "status"]:
        if key in data:
            fields.append(f"{key} = %s")
            params.append(data[key])

    if not fields:
        return jsonify({"error": "No fields to update"}), 400

    params.append(sid)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        UPDATE Shipments SET {', '.join(fields)}
        WHERE shipment_id = %s
    """, params)
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Shipment updated"}), 200

# Query inventory
@admin.route("/inventory", methods=["GET"])
def get_inventory():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT i.inventory_id, i.product_id, p.product_name, p.brand,
               p.size, p.color, i.stock_quantity
        FROM Inventory i
        JOIN Products p ON i.product_id = p.product_id
        ORDER BY p.product_name, p.size, p.color
    """)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows), 200


# Update inventory
@admin.route("/inventory/<int:pid>", methods=["PUT"])
def update_inventory(pid):
    data = request.json
    new_stock = data.get("stock_quantity")

    if new_stock is None:
        return jsonify({"error": "Missing stock_quantity"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Inventory
        SET stock_quantity = %s
        WHERE product_id = %s
    """, (new_stock, pid))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Inventory updated"}), 200