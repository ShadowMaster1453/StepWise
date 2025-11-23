'use client';
import { useState, useEffect } from 'react';

export default function FreshFootwearApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');   // 🔍 search text

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#fff',
      width: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '20px',
      textAlign: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      width: '100vw',
      margin: 0,
      boxSizing: 'border-box',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
    },
    mainLayout: {
      display: 'flex',
      position: 'relative',
      width: '100%',
    },
    hamburger: {
      position: 'fixed',
      top: '85px',
      left: '20px',
      zIndex: 1000,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px',
    },
    hamburgerLine: {
      width: '30px',
      height: '3px',
      backgroundColor: '#000',
      margin: '6px 0',
      display: 'block',
    },
    sidebar: {
      position: 'fixed',
      left: sidebarOpen ? '0' : '-250px',
      top: '80px',
      width: '250px',
      height: 'calc(100vh - 80px)',
      backgroundColor: '#f5f5f5',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      transition: 'left 0.3s ease',
      zIndex: 999,
      padding: '80px 0 20px 0',
    },
    navItem: {
      padding: '15px 30px',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'background-color 0.2s',
    },
    content: {
      flex: 1,
      padding: '40px 20px',
      marginLeft: sidebarOpen ? '250px' : '0',
      transition: 'margin-left 0.3s ease',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '60px',
      marginTop: '20px',
    },
    searchBar: {
      width: '100%',
      maxWidth: '600px',
      padding: '15px 20px',
      fontSize: '16px',
      border: '2px solid #ddd',
      borderRadius: '25px',
      backgroundColor: '#f5f5f5',
      outline: 'none',
    },
    heading: {
      textAlign: 'center',
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '40px',
      color: '#000',
    },
    brandsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '30px',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 20px',
    },
    brandCard: {
      backgroundColor: '#000',
      padding: '60px 40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '150px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    browseHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #ddd',
    },
    backButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '24px',
      padding: '0',
    },
    filterTabs: {
      display: 'flex',
      gap: '15px',
      padding: '20px',
      borderBottom: '1px solid #ddd',
      justifyContent: 'center',
    },
    filterTab: {
      padding: '10px 25px',
      border: '3px solid #000',
      borderRadius: '20px',
      backgroundColor: '#fff',
      color: '#000',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    filterTabActive: { backgroundColor: '#000', color: '#fff', border: '3px solid #000' },
    productsGrid: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
    topGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
      marginBottom: '20px',
    },
    productCard: {
      border: '2px solid #ddd',
      borderRadius: '12px',
      padding: '25px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productImage: {
      width: '100%',
      height: '180px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
    },
    productTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#000' },
    productUpdate: { fontSize: '14px', color: '#666' },
    detailsContainer: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    detailsContent: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '20px' },
    detailsImageSection: {
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      padding: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '500px',
    },
    detailsInfo: { display: 'flex', flexDirection: 'column', gap: '20px' },
    detailsTitle: { fontSize: '36px', fontWeight: 'bold', color: '#000', marginBottom: '10px' },
    detailsRating: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666' },
    detailsPrice: { fontSize: '32px', fontWeight: 'bold', color: '#000', marginTop: '10px' },
    detailsDescription: { fontSize: '16px', lineHeight: '1.6', color: '#333', marginTop: '10px' },
    detailsSection: { marginTop: '30px' },
    detailsSectionTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    sizeGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' },
    sizeButton: {
      padding: '15px',
      border: '2px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      transition: 'all 0.2s',
    },
    colorGrid: { display: 'flex', gap: '15px' },
    colorButton: {
      padding: '12px 24px',
      border: '2px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    addToCartButton: {
      width: '100%',
      padding: '18px',
      backgroundColor: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '30px',
      transition: 'background-color 0.2s',
    },
    cartButton: {
      position: 'fixed',
      top: '16px',
      right: 'clamp(16px, 3vw, 32px)',
      zIndex: 1001,
      background: '#fff',
      color: '#000',
      border: '2px solid #000',
      borderRadius: '24px',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '18px',
    },
    cartCount: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      background: '#ff3b30',
      color: '#fff',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartDropdown: {
      position: 'fixed',
      top: '72px',
      right: '16px',
      width: '360px',
      maxHeight: '60vh',
      overflow: 'auto',
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      zIndex: 1100,
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f0f0f0',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
    },
    modalContent: {
      width: '480px',
      maxWidth: '92%',
      background: '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    },
  };

  const navItems = [
    { label: 'Men', category: 'Men' },
    { label: 'Women', category: 'Women' },
    { label: 'Children', category: 'Children' },
    { label: 'All Shoes', category: 'All' },
  ];

  const brands = [
    { name: 'Nike', logo: '/images/nike_logo.jpg' },
    { name: 'Adidas', logo: '/images/adidas_logo.jpg' },
    { name: 'New Balance', logo: '/images/newbalance_logo.jpg' },
    { name: 'Skechers', logo: '/images/sketchers_logo.png' },
    { name: 'Under Armour', logo: '/images/underarmour_logo.jpg' },
    { name: 'Puma', logo: '/images/puma_logo.jpg' },
  ];

  // shortened sampleProducts here for brevity – paste your full array
  const sampleProducts = [
    {
      id: 1,
      name: 'Air Max Plus',
      brand: 'Nike',
      brandLogo: '/images/nike_logo.jpg',
      category: 'Men',
      price: 170.0,
      updated: 'today',
      description:
        "Iconic running shoe featuring Nike's revolutionary Tuned Air technology.",
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['Black', 'White', 'Gray'],
      image: '/images/nikeairmaxplus_black.webp',
      colorImages: {
        Black: '/images/nikeairmaxplus_black.webp',
        White: '/images/nikeairmax_white.webp',
        Gray: '/images/nikeairmax_grey.webp',
      },
    },
    // 👉 add all the other products you already had here
  ];

  const handleNavigate = (page, filter = 'All') => {
    setCurrentPage(page);
    setSelectedFilter(filter);
    setSelectedBrand(null);
    setSidebarOpen(false);
  };

  const handleBrandClick = (brandName) => {
    setCurrentPage('browse');
    setSelectedFilter('All');
    setSelectedBrand(brandName);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product?.sizes?.[0] ?? null);
    setSelectedColor(product?.colors?.[0] ?? null);
    setCurrentPage('details');
  };

  // load/save cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cartItems');
      if (raw) setCartItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const handleAddToCart = (product) => {
    if (!product) return;
    const item = {
      ...product,
      selectedSize,
      selectedColor,
      variantKey: `${product.id}::${selectedSize ?? 'nosize'}::${selectedColor ?? 'nocolor'}`,
    };
    setCartItems((prev) => [...prev, item]);
    setCartOpen(true);
  };

  const handleRemoveOne = (productId) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.variantKey === productId || p.id === productId);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const handleClearCart = () => setCartItems([]);
  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const confirmCheckout = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key =
        item.variantKey ??
        `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`;
      if (!acc[key]) acc[key] = { ...item, qty: 0 };
      acc[key].qty++;
      return acc;
    }, {});
    const items = Object.values(grouped);
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
    alert(
      `Order placed: ${items.reduce((s, it) => s + it.qty, 0)} item(s) — Total: $${total.toFixed(
        2,
      )}`,
    );
    setCartItems([]);
    setCheckoutOpen(false);
  };

  const CartDropdown = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key =
        item.variantKey ??
        `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`;
      if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key };
      acc[key].qty++;
      return acc;
    }, {});
    const items = Object.values(grouped);
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

    return (
      <div style={styles.cartDropdown} role="dialog" aria-label="Cart dropdown">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <strong>Your Cart</strong>
          <button
            onClick={handleClearCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 12 }}>Your cart is empty</div>
        ) : (
          items.map((it) => (
            <div key={it.variantKey} style={styles.cartItem}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <img
                  src={it.image}
                  alt={it.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {it.selectedSize ? `Size: ${it.selectedSize}` : ''}
                    {it.selectedSize && it.selectedColor ? ' • ' : ''}
                    {it.selectedColor ? `Color: ${it.selectedColor}` : ''}
                  </div>
                  <div style={{ fontSize: 12, color: '#000', marginTop: 4 }}>
                    ${it.price.toFixed(2)} × {it.qty}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 6,
                }}
              >
                <div style={{ fontWeight: 600 }}>${(it.price * it.qty).toFixed(2)}</div>
                <button
                  onClick={() => handleRemoveOne(it.variantKey ?? it.id)}
                  style={{
                    background: '#000',
                    color: '#ff3b30',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 700, marginRight: 12 }}>Total: ${total.toFixed(2)}</div>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              padding: '10px',
              border: '1px solid #000000ff',
              background: '#000000ff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Continue
          </button>
          <button
            onClick={handleCheckout}
            style={{ padding: '10px', border: 'none', background: '#000', color: '#fff' }}
          >
            Checkout
          </button>
        </div>
      </div>
    );
  };

  const CheckoutModal = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key =
        item.variantKey ??
        `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`;
      if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key };
      acc[key].qty++;
      return acc;
    }, {});
    const items = Object.values(grouped);
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);

    return (
      <div style={styles.modalOverlay} role="dialog" aria-label="Checkout">
        <div style={styles.modalContent}>
          <h3>Checkout</h3>
          {items.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            <div>
              {items.map((it) => (
                <div
                  key={it.variantKey}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#000' }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {it.selectedSize ? `Size: ${it.selectedSize}` : ''}
                      {it.selectedSize && it.selectedColor ? ' • ' : ''}
                      {it.selectedColor ? `Color: ${it.selectedColor}` : ''}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      ${it.price.toFixed(2)} × {it.qty}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>${(it.price * it.qty).toFixed(2)}</div>
                </div>
              ))}
              <hr />
              <div
                style={{
                  marginTop: 8,
                  padding: '8px 0',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: '#333' }}>Total:</div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#000',
                    marginLeft: 12,
                  }}
                >
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              onClick={() => setCheckoutOpen(false)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #000000ff',
                background: '#000000ff',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmCheckout}
              style={{ flex: 1, padding: '10px', border: 'none', background: '#000', color: '#fff' }}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CartButton = () => (
    <button
      style={styles.cartButton}
      onClick={() => setCartOpen(!cartOpen)}
      aria-label="Open cart"
    >
      🛒
      {cartItems.length > 0 && <div style={styles.cartCount}>{cartItems.length}</div>}
    </button>
  );

  // 🔍 when user types in the home search and hits Enter, go to browse page
  const handleHomeSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage('browse');
    }
  };

  const renderHomePage = () => (
    <>
      <header style={styles.header}>Fresh Footwear</header>

      <button
        style={styles.hamburger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <span style={styles.hamburgerLine}></span>
        <span style={styles.hamburgerLine}></span>
        <span style={styles.hamburgerLine}></span>
      </button>

      <div style={styles.mainLayout}>
        <nav style={styles.sidebar}>
          {navItems.map((item, index) => (
            <div
              key={index}
              style={styles.navItem}
              onClick={() => handleNavigate('browse', item.category)}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <main style={styles.content}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search…"
              style={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleHomeSearchKeyDown}
            />
          </div>

          <h2 style={styles.heading}>Brands we carry</h2>

          <div style={styles.brandsGrid}>
            {brands.map((brand, index) => (
              <div
                key={index}
                style={styles.brandCard}
                onClick={() => handleBrandClick(brand.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{ maxWidth: '250px', maxHeight: '120px', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );

  const renderDetailsPage = () => {
    if (!selectedProduct) return null;

    const getCurrentImage = () => {
      if (
        selectedProduct.colorImages &&
        selectedColor &&
        selectedProduct.colorImages[selectedColor]
      ) {
        return selectedProduct.colorImages[selectedColor];
      }
      return selectedProduct.image;
    };

    return (
      <>
        <header style={styles.header}>Fresh Footwear</header>

        <div style={styles.browseHeader}>
          <button style={styles.backButton} onClick={() => handleNavigate('browse')}>
            <span>&larr;</span>
          </button>
        </div>

        <div style={styles.detailsContainer}>
          <div style={styles.detailsContent}>
            <div style={styles.detailsImageSection}>
              <img
                src={getCurrentImage()}
                alt={selectedProduct.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={styles.detailsInfo}>
              <img
                src={selectedProduct.brandLogo}
                alt={selectedProduct.brand}
                style={{ maxWidth: '120px', maxHeight: '40px', marginBottom: '10px' }}
              />
              <h1 style={styles.detailsTitle}>{selectedProduct.name}</h1>

              <div style={styles.detailsRating}>
                <span>{'☆'.repeat(5)}</span>
              </div>

              <div style={styles.detailsPrice}>${selectedProduct.price}</div>

              <p style={styles.detailsDescription}>{selectedProduct.description}</p>

              <div style={styles.detailsSection}>
                <div style={styles.detailsSectionTitle}>Select Size</div>
                <div style={styles.sizeGrid}>
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      style={{
                        ...styles.sizeButton,
                        border: selectedSize === size ? '2px solid #000' : styles.sizeButton.border,
                        backgroundColor:
                          selectedSize === size ? '#000' : styles.sizeButton.backgroundColor,
                        color: selectedSize === size ? '#fff' : '#000',
                      }}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div style={styles.detailsSection}>
                  <div style={styles.detailsSectionTitle}>Select Color</div>
                  <div style={styles.colorGrid}>
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        style={{
                          ...styles.colorButton,
                          border:
                            selectedColor === color ? '2px solid #000' : styles.colorButton.border,
                          backgroundColor:
                            selectedColor === color ? '#000' : styles.colorButton.backgroundColor,
                          color: selectedColor === color ? '#fff' : '#000',
                        }}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                style={styles.addToCartButton}
                onClick={() => handleAddToCart(selectedProduct)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderBrowsePage = () => {
    // 🔍 apply category + brand + search filters
    const filteredProducts = sampleProducts
      .filter((p) => selectedFilter === 'All' || p.category === selectedFilter)
      .filter((p) => !selectedBrand || p.brand === selectedBrand)
      .filter((p) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term)
        );
      });

    return (
      <>
        <header style={styles.header}>Fresh Footwear</header>

        <div style={styles.browseHeader}>
          <button style={styles.backButton} onClick={() => handleNavigate('home')}>
            <span>&larr;</span>
          </button>
        </div>

        {/* search bar on browse page too */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search…"
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedBrand && (
          <div style={{ padding: '0 20px 10px', textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '15px' }}>
              Showing brand: {selectedBrand}
            </span>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={() => setSelectedBrand(null)}
            >
              Clear Brand Filter
            </button>
          </div>
        )}

        <div style={styles.filterTabs}>
          {['Men', 'Women', 'Children', 'All'].map((filter) => (
            <button
              key={filter}
              style={{
                ...styles.filterTab,
                ...(selectedFilter === filter ? styles.filterTabActive : {}),
              }}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={styles.productsGrid}>
          <div style={styles.topGrid}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={styles.productCard}
                onClick={() => handleProductClick(product)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.productImage}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                </div>
                <div style={styles.productTitle}>{product.name}</div>
                <div style={styles.productUpdate}>Updated {product.updated}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      <CartButton />
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'browse' && renderBrowsePage()}
      {currentPage === 'details' && renderDetailsPage()}
      {cartOpen && <CartDropdown />}
      {checkoutOpen && <CheckoutModal />}
    </div>
  );
}
