import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Cp363",
  database: process.env.DB_NAME || "fresh_footwear",
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

// --- DB table check (safer than blindly creating the wrong schema) ---
async function checkTables() {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    const existing = rows.map(r => Object.values(r)[0]);
    const expected = [
  'addresses',
  'admins',
  'inventory',
  'orderitems',
  'orders',
  'paymentmethods',
  'payments',
  'reviews',
  'shipments',
  'shoppingcart',
  'users'
];
    console.log("Existing tables:", existing);
    expected.forEach(t => {
      if (!existing.includes(t)) console.warn(`WARNING: table "${t}" NOT found in DB`);
      else console.log(`table "${t}" OK`);
    });
  } catch (err) {
    console.error("Error checking tables:", err.message || err);
  }
}
checkTables();

// --- Health check ---
app.get("/api/db-health", async (req, res) => {
  try {
    const [r] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, result: r[0] });
  } catch (err) {
    console.error("DB health failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/*
 * ADDRESSES routes
 * columns (from your SQL): address_id, user_id, street, city, province, postal_code, country, is_default
 */
app.post("/api/addresses", async (req, res) => {
  try {
    const { user_id, street, city, province, postal_code, country = "Canada", is_default = 0 } = req.body;
    if (!user_id || !street || !city || !province || !postal_code)
      return res.status(400).json({ success: false, error: "Missing required address fields" });

    const [result] = await pool.query(
      `INSERT INTO addresses (user_id, street, city, province, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, street, city, province, postal_code, country, is_default]
    );
    res.json({ success: true, address_id: result.insertId });
  } catch (err) {
    console.error("Insert address failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/addresses/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const [rows] = await pool.query("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, address_id DESC", [userId]);
    res.json({ success: true, addresses: rows });
  } catch (err) {
    console.error("Fetch addresses failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
 * ADMINS route (basic)
 * columns: admin_id, username, email, password_hash, admin_role
 */
app.post("/api/admins", async (req, res) => {
  try {
    const { username, email, password_hash, admin_role = "Manager" } = req.body;
    if (!username || !email || !password_hash) return res.status(400).json({ error: "Missing fields" });

    const [result] = await pool.query(
      `INSERT INTO admins (username, email, password_hash, admin_role) VALUES (?, ?, ?, ?)`,
      [username, email, password_hash, admin_role]
    );
    res.json({ success: true, admin_id: result.insertId });
  } catch (err) {
    console.error("Insert admin failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
 * INVENTORY route (record a change)
 * columns: inventory_id, product_id, admin_id, change_type, quantity_change, change_date, notes
 */
app.post("/api/inventory", async (req, res) => {
  try {
    const { product_id, admin_id = null, change_type, quantity_change, notes = null } = req.body;
    if (!product_id || !change_type || typeof quantity_change !== "number")
      return res.status(400).json({ error: "Missing inventory fields" });

    const [result] = await pool.query(
      `INSERT INTO inventory (product_id, admin_id, change_type, quantity_change, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [product_id, admin_id, change_type, quantity_change, notes]
    );
    res.json({ success: true, inventory_id: result.insertId });
  } catch (err) {
    console.error("Insert inventory failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
 * ORDERITEMS route
 * columns: order_item_id, order_id, product_id, quantity, price, size, color
 *
 * NOTE: orderitems has a FK to orders(order_id). You MUST have a valid order_id in the orders table when inserting.
 * If you don't have an orders table yet, this endpoint will fail with a FK error. See below for a minimal orders creation SQL.
 */
app.post("/api/orderitems", async (req, res) => {
  try {
    const { order_id, product_id, quantity, price, size = null, color = null } = req.body;
    if (!order_id || !product_id || !quantity || !price) return res.status(400).json({ error: "Missing orderitem fields" });

    // Basic validation
    if (quantity <= 0 || price < 0) return res.status(400).json({ error: "Invalid quantity or price" });

    const [result] = await pool.query(
      `INSERT INTO orderitems (order_id, product_id, quantity, price, size, color)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_id, product_id, quantity, price, size, color]
    );
    res.json({ success: true, order_item_id: result.insertId });
  } catch (err) {
    console.error("Insert orderitem failed:", err);
    // If FK missing, give clear message
    if (err && err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ success: false, error: "Invalid order_id: no matching order in orders table" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/paymentmethods", async (req, res) => {
  try {
    const {
      user_id,
      card_type,
      card_number_last4,
      card_holder_name,
      expiry_month,
      expiry_year,
      billing_address_id,
      is_default
    } = req.body;

    // Validate required fields
    if (!user_id || !card_type || !card_number_last4 || !card_holder_name || !expiry_month || !expiry_year) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Validate month range
    if (expiry_month < 1 || expiry_month > 12) {
      return res.status(400).json({ success: false, error: "expiry_month must be between 1–12" });
    }

    const [result] = await pool.query(
      `INSERT INTO paymentmethods 
       (user_id, card_type, card_number_last4, card_holder_name, expiry_month, expiry_year, billing_address_id, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
       [
         user_id,
         card_type,
         card_number_last4,
         card_holder_name,
         expiry_month,
         expiry_year,
         billing_address_id || null,
         is_default ? 1 : 0
       ]
    );

    res.json({ success: true, payment_id: result.insertId });

  } catch (err) {
    console.error("Error inserting paymentmethod:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/paymentmethods/user/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const [rows] = await pool.query(
      `SELECT * FROM paymentmethods WHERE user_id = ? ORDER BY is_default DESC, payment_id DESC`,
      [user_id]
    );

    res.json({ success: true, paymentmethods: rows });
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/payments", async (req, res) => {
  try {
    const {
      order_id,
      method_id,
      amount,
      payment_status = "Pending",
      transaction_ref
    } = req.body;

    // Validate required input
    if (!order_id || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: order_id, amount"
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be >= 0"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO payments (order_id, method_id, amount, payment_status, transaction_ref)
       VALUES (?, ?, ?, ?, ?)`,
      [
        order_id,
        method_id || null,
        amount,
        payment_status,
        transaction_ref || null
      ]
    );

    res.json({
      success: true,
      payment_id: result.insertId
    });

  } catch (err) {
    console.error("Error creating payment:", err);
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        error: "Foreign key error: order_id or method_id not found"
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get("/api/payments/order/:order_id", async (req, res) => {
  try {
    const order_id = req.params.order_id;

    const [rows] = await pool.query(
      `SELECT *
       FROM payments
       WHERE order_id = ?
       ORDER BY payment_date DESC`,
      [order_id]
    );

    res.json({ success: true, payments: rows });

  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/payments/user/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const [rows] = await pool.query(
      `SELECT p.*, o.total_amount
       FROM payments p
       JOIN orders o ON p.order_id = o.order_id
       WHERE o.user_id = ?
       ORDER BY p.payment_date DESC`,
      [user_id]
    );

    res.json({ success: true, payments: rows });

  } catch (err) {
    console.error("Error fetching user payments:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/payments/:payment_id", async (req, res) => {
  try {
    const payment_id = req.params.payment_id;
    const { payment_status, transaction_ref } = req.body;

    const [result] = await pool.query(
      `UPDATE payments
       SET payment_status = ?, transaction_ref = ?
       WHERE payment_id = ?`,
      [
        payment_status || "Pending",
        transaction_ref || null,
        payment_id
      ]
    );

    res.json({
      success: true,
      updated: result.affectedRows > 0
    });

  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/payments/:payment_id", async (req, res) => {
  try {
    const payment_id = req.params.payment_id;

    const [result] = await pool.query(
      "DELETE FROM payments WHERE payment_id = ?",
      [payment_id]
    );

    res.json({
      success: true,
      deleted: result.affectedRows > 0
    });

  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { user_id, product_id, rating, user_comment } = req.body;

    if (!user_id || !product_id || rating === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: user_id, product_id, rating"
      });
    }

    // Validate rating range
    if (rating < 1.0 || rating > 5.0) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1.0 and 5.0"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, user_comment)
       VALUES (?, ?, ?, ?)`,
      [
        user_id,
        product_id,
        rating,
        user_comment || null
      ]
    );

    res.json({
      success: true,
      review_id: result.insertId
    });

  } catch (err) {
    console.error("Error creating review:", err);
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        error: "Foreign key error: user_id or product_id not found"
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/reviews/product/:product_id", async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const [rows] = await pool.query(
      `SELECT r.*, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.product_id = ?
       ORDER BY r.review_date DESC`,
      [product_id]
    );

    res.json({
      success: true,
      reviews: rows
    });

  } catch (err) {
    console.error("Error fetching product reviews:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all shipments
app.get('/shipments', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM shipments');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Get a single shipment
app.get('/shipments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await connection.execute('SELECT * FROM shipments WHERE shipment_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Shipment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// Create a new shipment
app.post('/shipments', async (req, res) => {
  const { order_id, address_id, carrier, tracking_number, ship_date, estimated_delivery, delivery_date, status } = req.body;
  try {
    const [result] = await connection.execute(
      `INSERT INTO shipments (order_id, address_id, carrier, tracking_number, ship_date, estimated_delivery, delivery_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [order_id, address_id, carrier || null, tracking_number || null, ship_date || null, estimated_delivery || null, delivery_date || null, status || 'Pending']
    );
    res.json({ shipment_id: result.insertId, message: 'Shipment created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Update a shipment
app.put('/shipments/:id', async (req, res) => {
  const { id } = req.params;
  const { carrier, tracking_number, ship_date, estimated_delivery, delivery_date, status } = req.body;
  try {
    const [result] = await connection.execute(
      `UPDATE shipments
       SET carrier = ?, tracking_number = ?, ship_date = ?, estimated_delivery = ?, delivery_date = ?, status = ?
       WHERE shipment_id = ?`,
      [carrier, tracking_number, ship_date, estimated_delivery, delivery_date, status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Shipment not found' });
    res.json({ message: 'Shipment updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

// Delete a shipment
app.delete('/shipments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await connection.execute('DELETE FROM shipments WHERE shipment_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Shipment not found' });
    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

// Get all cart items for a user
app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM shoppingcart WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add an item to cart
app.post('/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const [result] = await connection.execute(
      'INSERT INTO shoppingcart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [user_id, product_id, quantity || 1]
    );
    res.json({ cart_item_id: result.insertId, message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update quantity of a cart item
app.put('/cart/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;
  try {
    const [result] = await connection.execute(
      'UPDATE shoppingcart SET quantity = ? WHERE cart_item_id = ?',
      [quantity, cartItemId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove an item from cart
app.delete('/cart/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;
  try {
    const [result] = await connection.execute(
      'DELETE FROM shoppingcart WHERE cart_item_id = ?',
      [cartItemId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// Clear all items in a user's cart
app.delete('/cart/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await connection.execute('DELETE FROM shoppingcart WHERE user_id = ?', [userId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Register a new user
app.post('/users/register', async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10); // hash password
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, phone || null]
    );
    res.json({ user_id: result.insertId, message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT user_id, username, email, phone, register_date FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await connection.execute(
      'SELECT user_id, username, email, phone, register_date FROM users WHERE user_id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


// Start server
const PORT = process.env.PORT || 4242;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
