'use client';
import { useState, useEffect } from 'react';

export default function FreshFootwearApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

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
    },
    mainLayout: {
      display: 'flex',
      position: 'relative',
      width: '100%',
    },
    hamburger: {
      position: 'fixed',
      top: '100px',
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
      padding: '20px 0',
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
    navItemHover: { backgroundColor: '#e0e0e0' },
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
    brandCardHover: { transform: 'translateY(-5px)', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
    brandText: { color: '#fff', fontSize: '28px', fontWeight: 'bold', textAlign: 'center' },
    browseHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px', borderBottom: '1px solid #ddd',
    },
    backButton: {
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', padding: '0',
    },
    backText: { fontSize: '14px', color: '#666', marginTop: '5px' },
    menuButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', padding: '0' },
    filterTabs: {
      display: 'flex', gap: '15px', padding: '20px',
      borderBottom: '1px solid #ddd', justifyContent: 'center',
    },
    filterTab: {
      padding: '10px 25px', border: '3px solid #000', borderRadius: '20px',
      backgroundColor: '#fff', color: '#000', cursor: 'pointer',
      fontSize: '16px', fontWeight: '500', transition: 'all 0.2s ease',
    },
    filterTabActive: { backgroundColor: '#000', color: '#fff', border: '3px solid #000' },
    productsGrid: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
    topGrid: { display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '15px', marginBottom: '20px' },
    bottomGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
    productCard: {
      border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff',
      cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productCardLarge: {
      border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff',
      cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productImage: {
      width: '100%', height: '80px', backgroundColor: '#f5f5f5', borderRadius: '5px', marginBottom: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
    },
    productImageLarge: {
      width: '100%', height: '150px', backgroundColor: '#f5f5f5', borderRadius: '5px', marginBottom: '15px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px',
    },
    productTitle: { fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#000' },
    productTitleLarge: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#000' },
    productUpdate: { fontSize: '12px', color: '#666' },
    productUpdateLarge: { fontSize: '14px', color: '#666' },
    detailsContainer: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    detailsContent: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '20px' },
    detailsImageSection: {
      backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px',
    },
    detailsImage: { fontSize: '200px' },
    detailsInfo: { display: 'flex', flexDirection: 'column', gap: '20px' },
    detailsBrand: { fontSize: '14px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' },
    detailsTitle: { fontSize: '36px', fontWeight: 'bold', color: '#000', marginBottom: '10px' },
    detailsRating: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666' },
    detailsPrice: { fontSize: '32px', fontWeight: 'bold', color: '#000', marginTop: '10px' },
    detailsDescription: { fontSize: '16px', lineHeight: '1.6', color: '#333', marginTop: '10px' },
    detailsSection: { marginTop: '30px' },
    detailsSectionTitle: {
      fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '15px',
      textTransform: 'uppercase', letterSpacing: '1px',
    },
    sizeGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' },
    sizeButton: {
      padding: '15px', border: '2px solid #ddd', borderRadius: '5px', backgroundColor: '#fff',
      cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'center', transition: 'all 0.2s',
    },
    sizeButtonHover: { borderColor: '#000' },
    colorGrid: { display: 'flex', gap: '15px' },
    colorButton: {
      padding: '12px 24px', border: '2px solid #ddd', borderRadius: '5px', backgroundColor: '#fff',
      cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s',
    },
    colorButtonHover: { borderColor: '#000' },
    addToCartButton: {
      width: '100%', padding: '18px', backgroundColor: '#000', color: '#fff', border: 'none',
      borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px',
      transition: 'background-color 0.2s',
    },
    addToCartButtonHover: { backgroundColor: '#333' },
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
      fontSize: '18px'
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
      justifyContent: 'center'
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
      zIndex: 1100
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200
    },
    modalContent: {
      width: '480px',
      maxWidth: '92%',
      background: '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
    },
  }

  const navItems = [
    { label: 'Men' }, { label: 'Women' }, { label: 'Children' }, { label: 'All Shoes' },
  ]

  const brands = ['Nike','Adidas','New Balance','Skechers','Under Armour','Puma']

  const sampleProducts = {
    small: [
      { id: 1, name: 'Air Max Pro', brand: 'Nike', price: 129.99, updated: 'today', description: 'Lightweight running shoes with premium cushioning and breathable mesh upper for maximum comfort during your workout.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Gray'], rating: 4.5, reviews: 324 },
      { id: 2, name: 'Ultra Boost', brand: 'Adidas', price: 159.99, updated: 'today', description: 'High-performance athletic shoes featuring responsive cushioning technology and energy-returning properties.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Navy'], rating: 4.8, reviews: 567 },
      { id: 3, name: 'Fresh Foam', brand: 'New Balance', price: 109.99, updated: 'yesterday', description: 'Versatile training shoes with plush Fresh Foam midsole for exceptional comfort throughout your day.', sizes: ['6','7','8','9','10','11'], colors: ['Gray','Black','Blue'], rating: 4.3, reviews: 198 },
      { id: 4, name: 'Go Walk 6', brand: 'Skechers', price: 79.99, updated: 'yesterday', description: 'Casual walking shoes designed for all-day comfort with lightweight construction and flexible outsole.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Navy','Gray'], rating: 4.2, reviews: 412 },
      { id: 5, name: 'Charged Assert', brand: 'Under Armour', price: 89.99, updated: '2 days ago', description: 'Dynamic running shoes with charged cushioning that absorbs impact and converts it to responsive energy.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Red','White'], rating: 4.4, reviews: 256 },
      { id: 6, name: 'Suede Classic', brand: 'Puma', price: 74.99, updated: '2 days ago', description: 'Iconic lifestyle sneakers with premium suede upper and classic silhouette for timeless street style.', sizes: ['7','8','9','10','11'], colors: ['Black','Navy','Burgundy'], rating: 4.6, reviews: 389 },
      { id: 7, name: 'Court Vision', brand: 'Nike', price: 84.99, updated: '3 days ago', description: 'Basketball-inspired sneakers with retro styling and modern comfort for everyday casual wear.', sizes: ['7','8','9','10','11','12'], colors: ['White','Black','Gray'], rating: 4.3, reviews: 221 },
      { id: 8, name: 'Stan Smith', brand: 'Adidas', price: 94.99, updated: '3 days ago', description: 'Classic tennis shoes reimagined with clean lines and eco-friendly materials for sustainable style.', sizes: ['6','7','8','9','10','11','12'], colors: ['White','Black','Green'], rating: 4.7, reviews: 634 },
      { id: 9, name: '574 Core', brand: 'New Balance', price: 99.99, updated: '4 days ago', description: 'Timeless heritage sneakers combining classic design with modern comfort technology.', sizes: ['7','8','9','10','11','12'], colors: ['Gray','Navy','Burgundy'], rating: 4.5, reviews: 445 },
    ],
    large: [
      { id: 10, name: 'Pegasus 40', brand: 'Nike', price: 139.99, updated: 'today', description: 'Premium running shoes with ReactX foam midsole providing exceptional energy return and durability for serious runners.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Blue'], rating: 4.9, reviews: 892 },
      { id: 11, name: 'Solarboost 4', brand: 'Adidas', price: 169.99, updated: 'yesterday', description: 'Advanced training shoes featuring Boost cushioning and Primeknit upper for adaptive fit and maximum energy.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Gray','Red'], rating: 4.6, reviews: 512 },
      { id: 12, name: '990v6', brand: 'New Balance', price: 199.99, updated: '2 days ago', description: 'Premium lifestyle sneakers handcrafted with ENCAP midsole technology and pigskin/mesh upper construction.', sizes: ['7','8','9','10','11','12'], colors: ['Gray','Navy','Black'], rating: 4.8, reviews: 723 },
      { id: 13, name: 'Velocity Nitro', brand: 'Puma', price: 119.99, updated: '3 days ago', description: 'High-performance running shoes with nitrogen-infused foam for lightweight cushioning and explosive propulsion.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Blue'], rating: 4.4, reviews: 298 },
    ]
  }

  const handleNavigate = (page, filter = 'All') => {
    setCurrentPage(page)
    setSelectedFilter(filter)
    setSidebarOpen(false)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setSelectedSize(product?.sizes?.[0] ?? null)
    setSelectedColor(product?.colors?.[0] ?? null)
    setCurrentPage('details')
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cartItems')
      if (raw) setCartItems(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load cart from localStorage', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [cartItems])

  const handleAddToCart = (product) => {
    if (!product) return
    const item = {
      ...product,
      selectedSize,
      selectedColor,
      variantKey: `${product.id}::${selectedSize ?? 'nosize'}::${selectedColor ?? 'nocolor'}`,
    }
    setCartItems((prev) => [...prev, item])
    setCartOpen(true)
  }

  const handleRemoveOne = (productId) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.variantKey === productId || p.id === productId)
      if (idx === -1) return prev
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }

  const handleClearCart = () => setCartItems([])
  const handleCheckout = () => { setCartOpen(false); setCheckoutOpen(true) }

  const confirmCheckout = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`
      if (!acc[key]) acc[key] = { ...item, qty: 0 }
      acc[key].qty++
      return acc
    }, {})
    const items = Object.values(grouped)
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)
    alert(`Order placed: ${items.reduce((s, it) => s + it.qty, 0)} item(s) — Total: $${total.toFixed(2)}`)
    setCartItems([])
    setCheckoutOpen(false)
  }

  const CartDropdown = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`
      if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key }
      acc[key].qty++
      return acc
    }, {})
    const items = Object.values(grouped)
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)

    return (
      <div style={styles.cartDropdown} role="dialog" aria-label="Cart dropdown">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong>Your Cart</strong>
          <button onClick={handleClearCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 12 }}>Your cart is empty</div>
        ) : (
          items.map((it) => (
            <div key={it.id} style={styles.cartItem}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ fontSize: 18 }}>&#128095;</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {it.selectedSize ? `Size: ${it.selectedSize}` : ''}
                    {it.selectedSize && it.selectedColor ? ' • ' : ''}
                    {it.selectedColor ? `Color: ${it.selectedColor}` : ''}
                  </div>
                  <div style={{ fontSize: 12, color: '#000', marginTop: 4 }}>${it.price.toFixed(2)} × {it.qty}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontWeight: '600' }}>${(it.price * it.qty).toFixed(2)}</div>
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

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, marginRight: 12 }}>Total: ${total.toFixed(2)}</div>
          <button onClick={() => setCartOpen(false)} style={{ padding: '10px', border: '1px solid #000000ff', background: '#000000ff', cursor: 'pointer' }}>Continue</button>
          <button onClick={handleCheckout} style={{ padding: '10px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>Checkout</button>
        </div>
      </div>
    )
  }

  const CheckoutModal = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`
      if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key }
      acc[key].qty++
      return acc
    }, {})
    const items = Object.values(grouped)
    const total = items.reduce((s, it) => s + it.price * it.qty, 0)

    return (
      <div style={styles.modalOverlay} role="dialog" aria-label="Checkout">
        <div style={styles.modalContent}>
          <h3>Checkout</h3>
          {items.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            <div>
              {items.map((it) => (
                <div key={it.variantKey} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#000' }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {it.selectedSize ? `Size: ${it.selectedSize}` : ''}
                      {it.selectedSize && it.selectedColor ? ' • ' : ''}
                      {it.selectedColor ? `Color: ${it.selectedColor}` : ''}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>${it.price.toFixed(2)} × {it.qty}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>${(it.price * it.qty).toFixed(2)}</div>
                </div>
              ))}
              <hr />
              {/* Total displayed directly under the line */}
              <div style={{ marginTop: 8, padding: '8px 0', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#333' }}>Total:</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#000', marginLeft: 12 }}>${total.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => setCheckoutOpen(false)} style={{ flex: 1, padding: '10px', border: '1px solid #000000ff', background: '#000000ff', cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirmCheckout} style={{ flex: 1, padding: '10px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>Confirm Order</button>
          </div>
        </div>
      </div>
    )
  }

  const CartButton = () => (
    <button
      style={styles.cartButton}
      onClick={() => setCartOpen(!cartOpen)}
      aria-label="Open cart"
    >
      🛒
      {cartItems.length > 0 && (
        <div style={styles.cartCount}>{cartItems.length}</div>
      )}
    </button>
  )

  const renderHomePage = () => (
    <>
      {/* Header */}
      <header style={styles.header}>
        Fresh Footwear
      </header>

      {/* Hamburger Menu */}
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
        {/* Sidebar Navigation */}
        <nav style={styles.sidebar}>
          {navItems.map((item, index) => (
            <div
              key={index}
              style={styles.navItem}
              onClick={() => handleNavigate('browse', item.label)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Main Content */}
        <main style={styles.content}>
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search...."
              style={styles.searchBar}
            />
          </div>

          {/* Brands Section */}
          <h2 style={styles.heading}>Brands we carry</h2>

          <div style={styles.brandsGrid}>
            {brands.map((brand, index) => (
              <div
                key={index}
                style={styles.brandCard}
                onClick={() => handleNavigate('browse')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={styles.brandText}>{brand}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )

  const renderDetailsPage = () => {
    if (!selectedProduct) return null

    return (
      <>
        {/* Header */}
        <header style={styles.header}>
          Fresh Footwear
        </header>

        {/* Details Header with Back Button */}
        <div style={styles.browseHeader}>
          <button style={styles.backButton} onClick={() => handleNavigate('browse')}>
            <span>&larr;</span>
            <span style={styles.backText}>Back to Browse</span>
          </button>
        </div>

        {/* Details Content */}
        <div style={styles.detailsContainer}>
          <div style={styles.detailsContent}>
            {/* Product Image */}
            <div style={styles.detailsImageSection}>
              <div style={styles.detailsImage}>
                <span>&#128095;</span>
              </div>
            </div>

            {/* Product Info */}
            <div style={styles.detailsInfo}>
              <div style={styles.detailsBrand}>{selectedProduct.brand}</div>
              <h1 style={styles.detailsTitle}>{selectedProduct.name}</h1>

              {/* Rating */}
              <div style={styles.detailsRating}>
                <span>{'★'.repeat(Math.floor(selectedProduct.rating))}{'☆'.repeat(5 - Math.floor(selectedProduct.rating))}</span>
                <span>{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div style={styles.detailsPrice}>${selectedProduct.price}</div>

              {/* Description */}
              <p style={styles.detailsDescription}>
                {selectedProduct.description}
              </p>

              {/* Select Size */}
              <div style={styles.detailsSection}>
                <div style={styles.detailsSectionTitle}>Select Size</div>
                <div style={styles.sizeGrid}>
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      style={{
                        ...styles.sizeButton,
                        border: selectedSize === size ? '2px solid #000' : styles.sizeButton.border,
                        backgroundColor: selectedSize === size ? '#000' : styles.sizeButton.backgroundColor,
                        color: selectedSize === size ? '#fff' : (styles.sizeButton.color || '#000')
                      }}
                      onClick={() => setSelectedSize(size)}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedSize === size ? '#000' : '#ddd' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Color */}
              <div style={styles.detailsSection}>
                <div style={styles.detailsSectionTitle}>Select Color</div>
                <div style={styles.colorGrid}>
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      style={{
                        ...styles.colorButton,
                        border: selectedColor === color ? '2px solid #000' : styles.colorButton.border,
                        backgroundColor: selectedColor === color ? '#000' : styles.colorButton.backgroundColor,
                        color: selectedColor === color ? '#fff' : '#000'
                      }}
                      onClick={() => setSelectedColor(color)}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedColor === color ? '#000' : '#ddd' }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                style={styles.addToCartButton}
                onClick={() => handleAddToCart(selectedProduct)}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#333' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderBrowsePage = () => (
    <>
      {/* Header */}
      <header style={styles.header}>
        Fresh Footwear
      </header>

      {/* Browse Header with Back Button */}
      <div style={styles.browseHeader}>
        <button style={styles.backButton} onClick={() => handleNavigate('home')}>
          <span>&larr;</span>
          <span style={styles.backText}>Back</span>
        </button>
        <button style={styles.menuButton}>
          <span>&#8942;</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {['Men', 'Women', 'Children', 'All'].map((filter) => (
          <button
            key={filter}
            style={{
              ...styles.filterTab,
              ...(selectedFilter === filter ? styles.filterTabActive : {})
            }}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={styles.productsGrid}>
        {/* Top Grid - 9 small products */}
        <div style={styles.topGrid}>
          {sampleProducts.small.map((product) => (
            <div
              key={product.id}
              style={styles.productCard}
              onClick={() => handleProductClick(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={styles.productImage}>
                <span>&#128095;</span>
              </div>
              <div style={styles.productTitle}>{product.name}</div>
              <div style={styles.productUpdate}>Updated {product.updated}</div>
            </div>
          ))}
        </div>

        {/* Bottom Grid - 4 large products */}
        <div style={styles.bottomGrid}>
          {sampleProducts.large.map((product) => (
            <div
              key={product.id}
              style={styles.productCardLarge}
              onClick={() => handleProductClick(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={styles.productImageLarge}>
                <span>&#128095;</span>
              </div>
              <div style={styles.productTitleLarge}>{product.name}</div>
              <div style={styles.productUpdateLarge}>Updated {product.updated}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div style={styles.container}>
      <CartButton />
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'browse' && renderBrowsePage()}
      {currentPage === 'details' && renderDetailsPage()}
      {cartOpen && <CartDropdown />}
      {checkoutOpen && <CheckoutModal />}
    </div>
  )
}
