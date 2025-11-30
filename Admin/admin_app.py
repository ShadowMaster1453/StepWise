from flask import Flask, render_template, request, redirect, session, flash
from db import get_db_connection
import mysql.connector as mysql

app = Flask(__name__)
app.secret_key = 'fresh_footwear_secret_key'

# Login and dashboard
@app.route('/')
def index():
    return redirect('/admin/login')


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']  
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM admins WHERE username=%s AND password_hash=%s",
            (username, password)
        )
        admin = cursor.fetchone()
        cursor.close()
        conn.close()

        if admin:
            session['admin_id'] = admin['admin_id']
            session['admin_name'] = admin['username']
            return redirect('/admin/dashboard')
        else:
            return render_template('admin_login.html', error="Invalid username or password.")

    return render_template('admin_login.html')


@app.route('/admin/dashboard')
def admin_dashboard():
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS product_count FROM products")
    product_count = cursor.fetchone()['product_count']

    cursor.execute("SELECT COUNT(*) AS order_count FROM orders")
    order_count = cursor.fetchone()['order_count']

    cursor.execute("SELECT COUNT(*) AS user_count FROM users")
    user_count = cursor.fetchone()['user_count']

    cursor.execute("SELECT IFNULL(SUM(total_amount),0) AS total_sales FROM orders WHERE order_status IN ('Paid','Shipped','Delivered')")
    total_sales = float(cursor.fetchone()['total_sales'])

    cursor.close()
    conn.close()

    return render_template(
        'admin_dashboard.html',
        admin_name=session['admin_name'],
        product_count=product_count,
        order_count=order_count,
        user_count=user_count,
        total_sales=total_sales
    )

# Product management
@app.route('/admin/products')
def admin_products():
    if 'admin_id' not in session:
        return redirect('/admin/login')

    # Pagination&search
    per_page = 10
    page = int(request.args.get('page', 1))
    search_query = request.args.get('search', '').strip()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # SQL
    if search_query:
        cursor.execute("""
            SELECT COUNT(*) AS total 
            FROM products 
            WHERE product_name LIKE %s OR brand LIKE %s
        """, (f"%{search_query}%", f"%{search_query}%"))
    else:
        cursor.execute("SELECT COUNT(*) AS total FROM products")
    total_products = cursor.fetchone()['total']

    total_pages = (total_products + per_page - 1) // per_page
    offset = (page - 1) * per_page

    if search_query:
        cursor.execute("""
            SELECT * FROM products 
            WHERE product_name LIKE %s OR brand LIKE %s
            ORDER BY product_id DESC
            LIMIT %s OFFSET %s
        """, (f"%{search_query}%", f"%{search_query}%", per_page, offset))
    else:
        cursor.execute("""
            SELECT * FROM products 
            ORDER BY product_id DESC 
            LIMIT %s OFFSET %s
        """, (per_page, offset))
    
    products = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template(
        'admin_products.html',
        products=products,
        admin_name=session['admin_name'],
        page=page,
        total_pages=total_pages,
        search_query=search_query
    )


@app.route('/admin/products/edit/<int:product_id>', methods=['GET', 'POST'])
def edit_product(product_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT * FROM products WHERE product_id=%s", (product_id,))
        product = cursor.fetchone()
        cursor.close()
        conn.close()
        if not product:
            flash("Product not found.", "danger")
            return redirect('/admin/products')
        return render_template('admin_product_edit.html', product=product, admin_name=session['admin_name'])

    # Post
    product_name = request.form.get('product_name', '').strip()
    brand = request.form.get('brand', '').strip()
    category = request.form.get('category', '').strip()
    size = request.form.get('size', '').strip()
    color = request.form.get('color', '').strip()
    price = request.form.get('price', '').strip()
    stock = request.form.get('stock', '').strip()
    description = request.form.get('description', '').strip() or None  # ✅ allow empty

    if not product_name:
        flash("Product name cannot be empty.", "danger")
        return redirect(f'/admin/products/edit/{product_id}')
    if not price:
        flash("Price cannot be empty.", "danger")
        return redirect(f'/admin/products/edit/{product_id}')
    if not stock:
        flash("Stock cannot be empty.", "danger")
        return redirect(f'/admin/products/edit/{product_id}')

    try:
        price = float(price)
        stock = int(stock)
    except ValueError:
        flash("Price or stock must be a valid number.", "danger")
        return redirect(f'/admin/products/edit/{product_id}')

    cursor.execute("""
        UPDATE products 
        SET product_name=%s, brand=%s, category=%s, size=%s, color=%s, price=%s, stock=%s, product_description=%s
        WHERE product_id=%s
    """, (product_name, brand, category, size, color, price, stock, description, product_id))

    conn.commit()
    cursor.close()
    conn.close()

    flash("Product updated successfully!", "success")
    return redirect('/admin/products')

@app.route('/admin/products/add', methods=['POST'])
def add_product():
    if 'admin_id' not in session:
        return redirect('/admin/login')

    product_name = request.form.get('product_name', '').strip()
    brand = request.form.get('brand', '').strip()
    category = request.form.get('category', '').strip()
    size = request.form.get('size', '').strip()
    color = request.form.get('color', '').strip()
    price = request.form.get('price', '').strip()
    stock = request.form.get('stock', '').strip()

    if not product_name:
        flash("Product name cannot be empty.", "danger")
        return redirect('/admin/products')
    if not price:
        flash("Price cannot be empty.", "danger")
        return redirect('/admin/products')
    if not stock:
        flash("Stock cannot be empty.", "danger")
        return redirect('/admin/products')

    try:
        price = float(price)
        stock = int(stock)
    except ValueError:
        flash("Price or stock must be a valid number.", "danger")
        return redirect('/admin/products')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (product_name, brand, category, size, color, price, stock) VALUES (%s,%s,%s,%s,%s,%s,%s)",
        (product_name, brand, category, size, color, price, stock)
    )
    conn.commit()
    cursor.close()
    conn.close()

    flash("Product added successfully!", "success")
    return redirect('/admin/products')



@app.route('/admin/products/delete/<int:product_id>')
def delete_product(product_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE product_id=%s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/admin/products')

# Order management
@app.route('/admin/orders')
def admin_orders():
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    status_filter = request.args.get('status')
    query = request.args.get('q')

    sql = """
        SELECT 
            o.order_id,
            u.username,
            o.order_date,
            o.total_amount,
            o.order_status,
            s.carrier,
            s.tracking_number
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        LEFT JOIN shipments s ON s.order_id = o.order_id
        WHERE 1=1
    """
    params = []

    # Status filter
    if status_filter:
        sql += " AND o.order_status = %s"
        params.append(status_filter)

    # Key word
    if query:
        sql += " AND (u.username LIKE %s OR o.order_id LIKE %s)"
        like_query = f"%{query}%"
        params.extend([like_query, like_query])

    sql += " ORDER BY o.order_date DESC"

    cursor.execute(sql, tuple(params))
    orders = cursor.fetchall()

    cursor.close()
    conn.close()
    return render_template('admin_orders.html', orders=orders, admin_name=session['admin_name'])


@app.route('/admin/orders/<int:order_id>', methods=['GET', 'POST'])
def order_detail(order_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        new_status = request.form.get('order_status', '').strip()
        carrier = request.form.get('carrier', '').strip()
        tracking_number = request.form.get('tracking_number', '').strip()

        # Update shipping info
        cursor.execute("SELECT shipment_id FROM shipments WHERE order_id=%s", (order_id,))
        shipment = cursor.fetchone()

        if shipment:
            cursor.execute("""
                UPDATE shipments
                SET carrier=%s, tracking_number=%s
                WHERE shipment_id=%s
            """, (carrier or None, tracking_number or None, shipment['shipment_id']))
        else:
            cursor.execute("""
                INSERT INTO shipments (order_id, address_id, admin_id, carrier, tracking_number, ship_date, status)
                VALUES (%s, %s, %s, %s, %s, NOW(), 'Pending')
            """, (order_id, 1, session['admin_id'], carrier or None, tracking_number or None))

        # Update order status
        if new_status:
            cursor.execute("UPDATE orders SET order_status=%s WHERE order_id=%s", (new_status, order_id))
        else:
            flash("Order status is empty.", "warning")

        conn.commit()
        flash("Order updated successfully!", "success")
        cursor.close()
        conn.close()
        return redirect(f'/admin/orders/{order_id}')

    # Query order
    cursor.execute("""
        SELECT o.*, u.username, s.carrier, s.tracking_number
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        LEFT JOIN shipments s ON s.order_id = o.order_id
        WHERE o.order_id=%s
    """, (order_id,))
    order = cursor.fetchone()

    # Query orderitems
    cursor.execute("""
        SELECT oi.order_item_id, p.product_name, oi.quantity, oi.unit_price,
               (oi.quantity * oi.unit_price) AS subtotal
        FROM orderitems oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id=%s
    """, (order_id,))
    items = cursor.fetchall()

    cursor.execute("SELECT product_id, product_name, price FROM products ORDER BY product_name")
    all_products = cursor.fetchall()

    cursor.close()
    conn.close()
    return render_template('admin_order_detail.html',
                           order=order, items=items,
                           all_products=all_products,
                           admin_name=session['admin_name'])


@app.route('/admin/orders/<int:order_id>/add_item', methods=['POST'])
def add_order_item(order_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    product_id = request.form.get('product_id')
    quantity = request.form.get('quantity')

    if not product_id or not quantity:
        flash("Please select a product and quantity.", "danger")
        return redirect(f'/admin/orders/{order_id}')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT price FROM products WHERE product_id=%s", (product_id,))
    product = cursor.fetchone()

    if not product:
        flash("Invalid product.", "danger")
        cursor.close()
        conn.close()
        return redirect(f'/admin/orders/{order_id}')

    unit_price = float(product['price'])
    quantity = int(quantity)

    cursor.execute("""
        INSERT INTO orderitems (order_id, product_id, quantity, unit_price)
        VALUES (%s, %s, %s, %s)
    """, (order_id, product_id, quantity, unit_price))

    cursor.execute("""
        UPDATE orders
        SET total_amount = (
            SELECT IFNULL(SUM(quantity * unit_price), 0)
            FROM orderitems WHERE order_id=%s
        )
        WHERE order_id=%s
    """, (order_id, order_id))

    conn.commit()
    cursor.close()
    conn.close()
    flash("Product added to order successfully!", "success")
    return redirect(f'/admin/orders/{order_id}')


@app.route('/admin/orders/<int:order_id>/delete_item/<int:item_id>')
def delete_order_item(order_id, item_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM orderitems WHERE order_item_id=%s", (item_id,))
    conn.commit()

    cursor.execute("""
        UPDATE orders SET total_amount=(SELECT IFNULL(SUM(subtotal),0) FROM orderitems WHERE order_id=%s)
        WHERE order_id=%s
    """, (order_id, order_id))

    conn.commit()
    cursor.close()
    conn.close()
    flash("Item removed from order.", "warning")
    return redirect(f'/admin/orders/{order_id}')

# Users management
@app.route('/admin/users', methods=['GET', 'POST'])
def admin_users():
    if 'admin_id' not in session:
        return redirect('/admin/login')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Add
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        if not username or not email or not password:
            flash("All fields are required to add a new user.", "danger")
            return redirect('/admin/users')

        try:
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, register_date)
                VALUES (%s, %s, %s, NOW())
            """, (username, email, password))
            conn.commit()
            flash("User added successfully!", "success")
        except mysql.connector.Error as e:
            flash(f"MySQL error: {str(e)}", "danger")
        finally:
            cursor.close()
            conn.close()
            return redirect('/admin/users')

    # Search
    search_query = request.args.get('q', '').strip()
    sql = """
        SELECT 
            u.user_id, 
            u.username, 
            u.email, 
            COALESCE(a.city, '') AS city, 
            COALESCE(a.province, '') AS province,
            COALESCE(a.country, '') AS country,
            u.register_date
        FROM users u
        LEFT JOIN (
            SELECT user_id, MIN(address_id) AS address_id
            FROM addresses
            GROUP BY user_id
        ) addr ON u.user_id = addr.user_id
        LEFT JOIN addresses a ON addr.address_id = a.address_id
    """

    params = ()
    if search_query:
        sql += " WHERE u.username LIKE %s OR u.email LIKE %s"
        params = (f"%{search_query}%", f"%{search_query}%")

    sql += " ORDER BY u.user_id ASC"

    cursor.execute(sql, params)
    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template(
        'admin_users.html',
        users=users,
        admin_name=session['admin_name']
    )

@app.route('/admin/users/edit/<int:user_id>', methods=['GET', 'POST'])
def edit_user(user_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        street = request.form.get('street', '').strip()
        city = request.form.get('city', '').strip()
        province = request.form.get('province', '').strip()
        postal_code = request.form.get('postal_code', '').strip()
        country = request.form.get('country', '').strip()

        try:
            # Update
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE users 
                SET username=%s, email=%s, phone=%s
                WHERE user_id=%s
            """, (username, email, phone, user_id))
            conn.commit()
            cursor.close()
            conn.close()

            # Check address
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT address_id FROM addresses WHERE user_id=%s", (user_id,))
            address = cursor.fetchone()
            cursor.fetchall() 
            cursor.close()
            conn.close()

            # Update
            conn = get_db_connection()
            cursor = conn.cursor()
            if address:
                cursor.execute("""
                    UPDATE addresses
                    SET street=%s, city=%s, province=%s, postal_code=%s, country=%s
                    WHERE user_id=%s
                """, (street, city, province, postal_code, country, user_id))
            else:
                cursor.execute("""
                    INSERT INTO addresses (user_id, street, city, province, postal_code, country)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, street, city, province, postal_code, country))
            conn.commit()
            cursor.close()
            conn.close()

            flash("User information updated successfully!", "success")
        except mysql.connector.Error as e:
            flash(f"Database error: {str(e)}", "danger")
        return redirect('/admin/users')

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                u.*, 
                a.address_id, a.street, a.city, a.province, a.postal_code, a.country
            FROM users u
            LEFT JOIN addresses a ON u.user_id = a.user_id
            WHERE u.user_id = %s
            LIMIT 1
        """, (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            flash("User not found.", "danger")
            return redirect('/admin/users')

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                o.order_id,
                o.order_date,
                o.order_status,
                o.total_amount
            FROM orders o
            WHERE o.user_id = %s
            ORDER BY o.order_date DESC
        """, (user_id,))
        user_orders = cursor.fetchall()
        cursor.close()
        conn.close()

        return render_template(
            'admin_user_edit.html',
            user=user,
            user_orders=user_orders,
            admin_name=session['admin_name']
        )

    except mysql.connector.Error as e:
        flash(f"Error loading user: {str(e)}", "danger")
        return redirect('/admin/users')

@app.route('/admin/users/delete/<int:user_id>')
def delete_user(user_id):
    if 'admin_id' not in session:
        return redirect('/admin/login')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            DELETE oi FROM orderitems oi
            INNER JOIN orders o ON oi.order_id = o.order_id
            WHERE o.user_id = %s
        """, (user_id,))

        # Delete shipment records
        cursor.execute("""
            DELETE s FROM shipments s
            INNER JOIN orders o ON s.order_id = o.order_id
            WHERE o.user_id = %s
        """, (user_id,))

        # Delete orders
        cursor.execute("DELETE FROM orders WHERE user_id = %s", (user_id,))

        # Delete addresses
        cursor.execute("DELETE FROM addresses WHERE user_id = %s", (user_id,))

        # Delete user
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))

        conn.commit()
        cursor.close()
        conn.close()

        flash("User and related records deleted successfully!", "success")
    except mysql.connector.Error as e:
        flash(f"MySQL error: {str(e)}", "danger")

    return redirect('/admin/users')


# Logout
@app.route('/admin/logout')
def logout():
    session.clear()
    return redirect('/admin/login')

if __name__ == '__main__':
    app.run(debug=True)
