-- Drop table if it exists (for reset purposes)
DROP TABLE IF EXISTS products;

-- Main products table used by catalog_service.py
CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  category VARCHAR(20) NOT NULL,           -- 'Men', 'Women', 'Children', etc.
  size VARCHAR(10) NOT NULL,               -- e.g. '7', '8', '9'
  color VARCHAR(30),                       -- e.g. 'Black', 'White'
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  product_description TEXT,
  image_url VARCHAR(255)
);

-- Some sample data so your catalog actually shows products
INSERT INTO products
(product_name, brand, category, size, color, price, stock, product_description, image_url)
VALUES
('Air Max Plus', 'Nike', 'Men', '8', 'Black', 170.00, 10,
 'Iconic running shoe featuring Nike''s Tuned Air technology.',
 '/images/nikeairmaxplus_black.webp'),

('Air Max Plus', 'Nike', 'Men', '9', 'Black', 170.00, 12,
 'Iconic running shoe featuring Nike''s Tuned Air technology.',
 '/images/nikeairmaxplus_black.webp'),

('Ultraboost 5', 'Adidas', 'Women', '7', 'White', 180.00, 15,
 'Revolutionary running shoe with LIGHT BOOST foam.',
 '/images/ultraboost_white.webp'),

('574 Core', 'New Balance', 'Children', '3', 'Gray', 99.95, 8,
 'Heritage sneaker built as versatile hybrid road/trail design.',
 '/images/574core_white.jpg');
