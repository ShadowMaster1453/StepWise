import tkinter as tk
from tkinter import ttk, messagebox
import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Shabi2333!",
        database="fresh_footwear"
    )

root = tk.Tk()
root.title("Fresh Footwear - Admin Backend")
root.geometry("700x480")

title = tk.Label(root, text="Fresh Footwear Admin Panel", font=("Arial", 22))
title.pack(pady=20)

# Order Management
def open_orders():
    win = tk.Toplevel(root)
    win.title("Order Management")
    win.geometry("1200x700")

    # Search
    top_frame = tk.Frame(win)
    top_frame.pack(fill="x", padx=10, pady=5)
    tk.Label(top_frame, text="Search (Order ID or User ID):").pack(side="left")
    search_entry = tk.Entry(top_frame)
    search_entry.pack(side="left", padx=5)
    def do_search():
        q = search_entry.get().strip()
        load_orders(q)
    tk.Button(top_frame, text="Search", command=do_search).pack(side="left", padx=5)
    tk.Button(top_frame, text="Clear", command=lambda: (search_entry.delete(0,'end'), load_orders(None))).pack(side="left", padx=5)
    tk.Button(top_frame, text="Add Order", command=lambda: add_order(win, order_tree)).pack(side="right")

    order_tree = ttk.Treeview(win, columns=("ID", "User", "Amount", "Date", "Status"), show="headings")
    order_tree.pack(fill="x", pady=10)
    for col in ("ID", "User", "Amount", "Date", "Status"):
        order_tree.heading(col, text=col)
        order_tree.column(col, width=120)

    # orderitems
    tk.Label(win, text="Order Items", font=("Arial", 14)).pack()
    item_tree = ttk.Treeview(
        win,
        columns=("Product", "Color", "Size", "Quantity", "Unit Price"),
        show="headings",
        height=15
    )
    item_tree.pack(fill="both", expand=True, padx=10, pady=10)
    for col in ("Product", "Color", "Size", "Quantity", "Unit Price"):
        item_tree.heading(col, text=col)
        item_tree.column(col, width=150)

    def load_orders(q=None):
        # clear
        for i in order_tree.get_children():
            order_tree.delete(i)
        conn = get_connection()
        cursor = conn.cursor()
        if q:
            # try match order_id or user_id
            if q.isdigit():
                cursor.execute("""
                    SELECT order_id, user_id, total_amount, order_date, order_status
                    FROM Orders
                    WHERE order_id = %s OR user_id = %s
                    ORDER BY order_date DESC
                """, (q, q))
            else:
                # non-digit -> no matches, clear
                cursor.execute("""
                    SELECT order_id, user_id, total_amount, order_date, order_status
                    FROM Orders
                    WHERE 0
                """)
        else:
            cursor.execute("""
                SELECT order_id, user_id, total_amount, order_date, order_status
                FROM Orders
                ORDER BY order_date DESC
            """)
        for row in cursor.fetchall():
            order_tree.insert("", "end", values=row)
        conn.close()
        # clear items
        for i in item_tree.get_children():
            item_tree.delete(i)

    def load_order_items(event):
        for i in item_tree.get_children():
            item_tree.delete(i)
        selected = order_tree.selection()
        if not selected:
            return
        oid = order_tree.item(selected[0], "values")[0]
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.product_name, p.color, p.size, oi.quantity, oi.unit_price
            FROM OrderItems oi
            JOIN Products p ON p.product_id = oi.product_id
            WHERE oi.order_id = %s
        """, (oid,))
        for row in cursor.fetchall():
            item_tree.insert("", "end", values=row)
        conn.close()

    order_tree.bind("<<TreeviewSelect>>", load_order_items)
    load_orders(None)

# Add Order (with items)
def add_order(parent_win, order_tree_ref):
    win = tk.Toplevel(parent_win)
    win.title("Add New Order")
    win.geometry("800x600")

    frame = tk.Frame(win)
    frame.pack(fill="x", pady=5, padx=10)

    tk.Label(frame, text="User ID:").grid(row=0, column=0, sticky="e")
    user_entry = tk.Entry(frame)
    user_entry.grid(row=0, column=1, sticky="w")

    tk.Label(frame, text="Status:").grid(row=0, column=2, sticky="e")
    status_var = tk.StringVar(value="Pending")
    status_menu = ttk.Combobox(frame, textvariable=status_var, values=["Pending","Paid","Shipped","Delivered","Cancelled"])
    status_menu.grid(row=0, column=3, sticky="w")

    # Order items tree
    tk.Label(win, text="Order Items (add one by one)").pack(pady=8)
    items_tree = ttk.Treeview(win, columns=("ProductID", "Product", "Qty", "UnitPrice"), show="headings", height=8)
    items_tree.pack(fill="x", padx=10)
    for c,w in [("ProductID",80),("Product",300),("Qty",80),("UnitPrice",100)]:
        items_tree.heading(c, text=c)
        items_tree.column(c, width=w)

    # Helper to get products
    def fetch_products():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT product_id, product_name, brand, color, size, price, stock FROM Products ORDER BY product_name")
        prods = cursor.fetchall()
        conn.close()
        return prods

    products_cache = fetch_products()

    # Add item controls
    add_frame = tk.Frame(win)
    add_frame.pack(fill="x", padx=10, pady=8)

    tk.Label(add_frame, text="Product:").grid(row=0, column=0)
    product_names = [f"{p[0]} - {p[1]} ({p[2]}) {p[3]} {p[4]} | stock:{p[6]}" for p in products_cache]
    product_var = tk.StringVar()
    product_combo = ttk.Combobox(add_frame, textvariable=product_var, values=product_names, width=70)
    product_combo.grid(row=0, column=1, columnspan=3, sticky="w")

    tk.Label(add_frame, text="Qty:").grid(row=1, column=0)
    qty_entry = tk.Entry(add_frame, width=10)
    qty_entry.grid(row=1, column=1, sticky="w")

    def add_item_to_tree():
        sel = product_var.get()
        if not sel:
            messagebox.showwarning("Warning", "Select a product")
            return
        try:
            qty = int(qty_entry.get())
            if qty <= 0:
                raise ValueError()
        except:
            messagebox.showerror("Error", "Quantity must be a positive integer")
            return
        
        pid = int(sel.split(" - ")[0])
        # find product details
        prod = next((p for p in products_cache if p[0] == pid), None)
        if not prod:
            messagebox.showerror("Error", "Product not found")
            return
        stock = prod[6]
        if qty > stock:
            if not messagebox.askyesno("Confirm", f"Qty {qty} > stock {stock}. Proceed?"):
                return
            
        unit_price = float(prod[5])
        items_tree.insert("", "end", values=(pid, f"{prod[1]} ({prod[2]})", qty, unit_price))
        product_var.set("")
        qty_entry.delete(0, "end")

    tk.Button(add_frame, text="Add Item", command=add_item_to_tree).grid(row=2, column=1, pady=6)

    def remove_selected_item():
        sel = items_tree.selection()
        for s in sel:
            items_tree.delete(s)
    tk.Button(add_frame, text="Remove Selected Item", command=remove_selected_item).grid(row=2, column=2, pady=6)

    def submit_order():
        user_id = user_entry.get().strip()
        if not user_id.isdigit():
            messagebox.showerror("Error", "User ID must be numeric")
            return
        user_id = int(user_id)
        status = status_var.get()
        items = []
        for r in items_tree.get_children():
            pid, pname, qty, unit_price = items_tree.item(r,"values")
            items.append((int(pid), int(qty), float(unit_price)))
        if not items:
            messagebox.showerror("Error", "Add at least one order item")
            return

        try:
            conn = get_connection()
            cursor = conn.cursor()
            
            cursor.execute(
                "SELECT address_id FROM Addresses WHERE user_id = %s ORDER BY is_default DESC LIMIT 1",
                (user_id,),
            )
            addr_row = cursor.fetchone()
            if not addr_row:
                messagebox.showerror("Error", f"No address found for user {user_id}")
                conn.close()
                return
            address_id = addr_row[0]

            total = sum(q * p for (_, q, p) in items)

            cursor.execute(
                """
                INSERT INTO Orders (user_id, total_amount, order_date, order_status, address_id)
                VALUES (%s, %s, NOW(), %s, %s)
                """,
                (user_id, total, status, address_id),
            )
            order_id = cursor.lastrowid

            for (pid, qty, unit_price) in items:
                cursor.execute(
                    "INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES (%s, %s, %s, %s)",
                    (order_id, pid, qty, unit_price),
                )
                try:
                    cursor.execute(
                        "UPDATE Products SET stock = stock - %s WHERE product_id = %s",
                        (qty, pid),
                    )
                except:
                    pass
            
            conn.commit()
            conn.close()
            messagebox.showinfo("Success", f"Order {order_id} created.")
            win.destroy()

            if order_tree_ref:
                try:
                    order_tree_ref.insert(
                        "", 0, values=(order_id, user_id, total, "NOW()", status)
                    )
                except:
                    pass
        
        except mysql.connector.Error as err:
            messagebox.showerror("DB Error", str(err))

    tk.Button(win, text="Submit Order", bg="#28a745", fg="white", command=submit_order).pack(pady=10)

# Shipment Management
def open_shipments():
    win = tk.Toplevel(root)
    win.title("Shipment Management")
    win.geometry("1000x600")

    top_frame = tk.Frame(win)
    top_frame.pack(fill="x", padx=10, pady=5)
    tk.Button(top_frame, text="Add Shipment", command=lambda: add_shipment(win, tree)).pack(side="right")

    tree = ttk.Treeview(
        win,
        columns=("ID", "Order ID", "Carrier", "Tracking", "Status"),
        show="headings"
    )
    tree.pack(fill="both", expand=True, padx=10, pady=10)

    for col in ("ID", "Order ID", "Carrier", "Tracking", "Status"):
        tree.heading(col, text=col)
        tree.column(col, width=150)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT shipment_id, order_id, carrier, tracking_number, status
        FROM Shipments
        ORDER BY ship_date DESC
    """)
    for row in cursor.fetchall():
        tree.insert("", "end", values=row)
    conn.close()

    # Edit shipment info
    def save_changes():
        selected = tree.selection()
        if not selected:
            messagebox.showwarning("Warning", "Select a shipment first.")
            return
        data = tree.item(selected[0], "values")
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE Shipments
                SET carrier=%s, tracking_number=%s, status=%s
                WHERE shipment_id=%s
            """, (data[2], data[3], data[4], data[0]))
            conn.commit()
            conn.close()
            messagebox.showinfo("Success", "Shipment updated!")
        except mysql.connector.Error as err:
            messagebox.showerror("Error", str(err))

    btn = tk.Button(win, text="Save Changes", command=save_changes)
    btn.pack(pady=6)

# Add Shipment
def add_shipment(parent, tree_ref):
    win = tk.Toplevel(parent)
    win.title("Add Shipment")
    win.geometry("400x300")

    tk.Label(win, text="Order ID:").pack(pady=4)
    order_entry = tk.Entry(win)
    order_entry.pack()

    tk.Label(win, text="Carrier:").pack(pady=4)
    carrier_entry = tk.Entry(win)
    carrier_entry.pack()

    tk.Label(win, text="Tracking Number:").pack(pady=4)
    tracking_entry = tk.Entry(win)
    tracking_entry.pack()

    tk.Label(win, text="Status:").pack(pady=4)
    status_entry = ttk.Combobox(win, values=["Pending","Shipped","In Transit","Delivered","Returned","Cancelled"])
    status_entry.set("Pending")
    status_entry.pack()

    def submit_shipment():
        oid = order_entry.get().strip()
        if not oid.isdigit():
            messagebox.showerror("Error", "Order ID must be numeric")
            return
        oid = int(oid)

        carrier = carrier_entry.get().strip()
        tracking = tracking_entry.get().strip()
        status = status_entry.get().strip()
        
        if not carrier or not tracking or not status:
            messagebox.showerror("Error", "All fields must be filled out")
            return
        
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT address_id FROM Orders WHERE order_id = %s", (oid,))
            addr_row = cursor.fetchone()

            if not addr_row:
                messagebox.showerror("Error", f"No address found for order {oid}")
                conn.close()
                return
            
            address_id = addr_row[0]
            admin_id = 1 

            cursor.execute("""
                INSERT INTO Shipments (order_id, address_id, admin_id, carrier, tracking_number, ship_date, estimated_delivery, delivery_date, status)
                VALUES (%s, %s, %s, %s, %s, NOW(), NULL, NULL, %s)
                """, (oid, address_id, admin_id, carrier, tracking, status))
            conn.commit()
            new_id = cursor.lastrowid
            conn.close()

            messagebox.showinfo("Success", f"Shipment {new_id} added successfully.")
            win.destroy()

            # refresh tree view
            if tree_ref:
                tree_ref.insert("", "end", values=(new_id, oid, carrier, tracking, status))

        except mysql.connector.Error as err:
            messagebox.showerror("DB Error", str(err))

    tk.Button(win, text="Add Shipment", command=submit_shipment, bg="#007bff", fg="white").pack(pady=10)

# Inventory Management (Products as inventory)
def add_new_product(tree):
    win = tk.Toplevel(root)
    win.title("Add New Product")
    win.geometry("420x480")

    labels = ["Product Name", "Brand", "Color", "Size", "Price", "Stock"]
    entries = {}

    for label in labels:
        tk.Label(win, text=label).pack()
        entry = tk.Entry(win)
        entry.pack(pady=5)
        entries[label] = entry

    def save_product():
        name = entries["Product Name"].get().strip()
        brand = entries["Brand"].get().strip()
        color = entries["Color"].get().strip()
        size = entries["Size"].get().strip()
        price = entries["Price"].get().strip()
        stock = entries["Stock"].get().strip()

        if not (name and brand and color and size and price and stock):
            messagebox.showerror("Error", "All fields required!")
            return
        try:
            price_f = float(price)
            stock_i = int(stock)
        except:
            messagebox.showerror("Error", "Price must be number, Stock must be integer")
            return

        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO Products (product_name, brand, color, size, price, stock)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (name, brand, color, size, price_f, stock_i))
            conn.commit()
            new_id = cursor.lastrowid
            conn.close()
            messagebox.showinfo("Success", f"Product {new_id} added!")
            # update tree
            if tree:
                tree.insert("", "end", values=(new_id, name, brand, color, size, price_f, stock_i))
            win.destroy()
        except mysql.connector.Error as err:
            messagebox.showerror("DB Error", str(err))

    tk.Button(win, text="Add Product", command=save_product).pack(pady=20)

def delete_product(tree):
    selected = tree.selection()
    if not selected:
        messagebox.showwarning("Warning", "Please select a product to delete.")
        return

    row = tree.item(selected[0], "values")
    product_id = row[0]

    confirm = messagebox.askyesno("Confirm Delete", f"Delete product ID {product_id}?")
    if not confirm:
        return

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Products WHERE product_id=%s", (product_id,))
        conn.commit()
        conn.close()
        tree.delete(selected[0])
        messagebox.showinfo("Success", "Product deleted successfully!")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Cannot delete product.\n{err}")

def open_inventory():
    win = tk.Toplevel(root)
    win.title("Inventory Management (Products Table)")
    win.geometry("1150x650")

    top_frame = tk.Frame(win)
    top_frame.pack(fill="x", padx=10, pady=6)
    tk.Label(top_frame, text="Search product (name/brand/color/size):").pack(side="left")
    search_entry = tk.Entry(top_frame, width=40)
    search_entry.pack(side="left", padx=6)
    def do_search():
        q = search_entry.get().strip().lower()
        load_products(q)
    tk.Button(top_frame, text="Search", command=do_search).pack(side="left", padx=6)
    tk.Button(top_frame, text="Clear", command=lambda: (search_entry.delete(0,'end'), load_products(None))).pack(side="left", padx=6)
    tk.Button(top_frame, text="Add New Product", command=lambda: add_new_product(tree)).pack(side="right")
    tk.Button(top_frame, text="Delete Selected Product", command=lambda: delete_product(tree)).pack(side="right", padx=6)

    tree = ttk.Treeview(
        win,
        columns=("ID", "Product", "Brand", "Color", "Size", "Price", "Stock"),
        show="headings",
        height=20
    )
    tree.pack(fill="both", expand=True, padx=10, pady=10)

    for col in ("ID", "Product", "Brand", "Color", "Size", "Price", "Stock"):
        tree.heading(col, text=col)
        tree.column(col, width=140)

    def load_products(q=None):
        for i in tree.get_children():
            tree.delete(i)
        conn = get_connection()
        cursor = conn.cursor()
        if q:
            like_q = f"%{q}%"
            cursor.execute("""
                SELECT product_id, product_name, brand, color, size, price, stock
                FROM Products
                WHERE LOWER(product_name) LIKE %s OR LOWER(brand) LIKE %s OR LOWER(color) LIKE %s OR LOWER(size) LIKE %s
                ORDER BY product_name
            """, (like_q, like_q, like_q, like_q))
        else:
            cursor.execute("""
                SELECT product_id, product_name, brand, color, size, price, stock
                FROM Products
                ORDER BY product_name
            """)
        for row in cursor.fetchall():
            tree.insert("", "end", values=row)
        conn.close()

    # double-click to edit stock
    def on_double_click(event):
        selected = tree.selection()
        if not selected:
            return
        row_values = tree.item(selected[0], "values")
        product_id = row_values[0]
        current_stock = row_values[6]

        edit_win = tk.Toplevel(win)
        edit_win.title("Edit Stock")
        edit_win.geometry("320x220")

        tk.Label(edit_win, text=f"Product ID: {product_id}", font=("Arial", 12)).pack(pady=10)
        tk.Label(edit_win, text="New Stock Quantity:").pack()

        entry = tk.Entry(edit_win)
        entry.insert(0, current_stock)
        entry.pack(pady=10)

        def save_stock():
            new_stock = entry.get().strip()
            if not new_stock.isdigit():
                messagebox.showerror("Error", "Stock must be a number!")
                return
            try:
                conn = get_connection()
                cursor = conn.cursor()
                cursor.execute("UPDATE Products SET stock=%s WHERE product_id=%s", (int(new_stock), product_id))
                conn.commit()
                conn.close()
                tree.item(selected[0], values=(
                    row_values[0], row_values[1], row_values[2],
                    row_values[3], row_values[4], row_values[5], new_stock
                ))
                messagebox.showinfo("Success", "Stock updated!")
                edit_win.destroy()
            except mysql.connector.Error as err:
                messagebox.showerror("Error", str(err))

        tk.Button(edit_win, text="Save", command=save_stock).pack(pady=10)

    tree.bind("<Double-1>", on_double_click)
    load_products(None)

# Buttons on main UI
tk.Button(root, text="Orders Management", width=30, height=2, command=open_orders).pack(pady=10)
tk.Button(root, text="Shipments Management", width=30, height=2, command=open_shipments).pack(pady=10)
tk.Button(root, text="Inventory Management", width=30, height=2, command=open_inventory).pack(pady=10)

root.mainloop()
