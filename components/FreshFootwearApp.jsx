import { useState, useEffect } from 'react'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderConfirmation, setOrderConfirmation] = useState(null)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    cityStateZip: "",
    country: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const OrderConfirmationModal = ({ data, onClose }) => {
    if (!data) return null
    return (
      <div style={styles.modalOverlay} role="dialog" aria-label="Order confirmation">
        <div style={styles.modalContent}>
          <h3>Order confirmed</h3>
          <p style={{ marginTop: 8 }}>Thank you — your order has been placed.</p>
          <p style={{ marginTop: 8 }}>A receipt will be emailed to you shortly.</p>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700 }}>Order summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}><div>Items</div><div>{data.itemCount}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Subtotal</div><div>${data.subtotal.toFixed(2)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Shipping</div><div>${data.shipping.toFixed(2)}</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Tax</div><div>${data.tax.toFixed(2)}</div></div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}><div>Total</div><div>${data.total.toFixed(2)}</div></div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => { onClose(); }} style={{ flex: 1, padding: '10px', border: '1px solid #000', background: '#000000ff', color: '#fff', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

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
    navItemHover: {
      backgroundColor: '#e0e0e0',
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
    brandCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    },
    brandText: {
      color: '#fff',
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
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
    backText: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px',
    },
    menuButton: {
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
    filterTabActive: {
      backgroundColor: '#000',
      color: '#fff',
    border: '3px solid #000', 
    },
    productsGrid: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    topGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(9, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    bottomGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    productCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productCardLarge: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productImage: {
      width: '100%',
      height: '80px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
    },
    productImageLarge: {
      width: '100%',
      height: '150px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '60px',
    },
    productTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#000',
    },
    productTitleLarge: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#000',
    },
    productUpdate: {
      fontSize: '12px',
      color: '#666',
    },
    productUpdateLarge: {
      fontSize: '14px',
      color: '#666',
    },
    detailsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    detailsContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      marginTop: '20px',
    },
    detailsImageSection: {
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      padding: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '500px',
    },
    detailsImage: {
      fontSize: '200px',
    },
    detailsInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    detailsBrand: {
      fontSize: '14px',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    detailsTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '10px',
    },
    detailsRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      color: '#666',
    },
    detailsPrice: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#000',
      marginTop: '10px',
    },
    detailsDescription: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#333',
      marginTop: '10px',
    },
    detailsSection: {
      marginTop: '30px',
    },
    detailsSectionTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    sizeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '10px',
    },
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
    sizeButtonHover: {
      borderColor: '#000',
    },
    colorGrid: {
      display: 'flex',
      gap: '15px',
    },
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
    colorButtonHover: {
      borderColor: '#000',
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
    addToCartButtonHover: {
      backgroundColor: '#333',
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
      color: '#000',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
},
    /* Checkout page styles */
    checkoutLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr 420px',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px'
    },
    checkoutLeft: {
      background: '#000000ff',
      border: '1px solid #000000ff',
      borderRadius: '8px',
      padding: '16px'
    },
    checkoutRight: {
      background: '#000000ff',
      border: '1px solid #000000ff',
      borderRadius: '8px',
      padding: '16px'
    },
    checkoutItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #000000ff'
    },
    checkoutForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    input: {
      padding: '10px',
      border: '1px solid #000000ff',
      borderRadius: '6px'
    },
    textarea: {
      padding: '10px',
      border: '1px solid #000000ff',
      borderRadius: '6px',
      minHeight: '80px'
    },
    checkoutSummary: {
      padding: '12px',
      borderTop: '1px solid #000000ff',
      marginTop: '12px'
    },
    checkoutActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    },
  }


  const navItems = [
    { label: 'Men' },
    { label: 'Women' },
    { label: 'Children' },
    { label: 'All Shoes' },
  ]

  const brands = [
    { name: 'Nike', logo: 'https://cdn.simpleicons.org/nike' },
    { name: 'Adidas', logo: 'https://cdn.simpleicons.org/adidas' },
    { name: 'New Balance', logo: 'https://cdn.simpleicons.org/newbalance' },
    { name: 'Skechers', logo: 'https://maisonrmi.com/wp-content/uploads/2022/06/Skechers-logo_Black-01-1024x285.png' },
    { name: 'Under Armour', logo: 'https://cdn.simpleicons.org/underarmour' },
    { name: 'Puma', logo: 'https://cdn.simpleicons.org/puma' }
  ]

  const sampleProducts = {
    small: [
          { id: 1, name: 'Air Max Plus', brand: 'Nike', brandLogo: 'https://cdn.simpleicons.org/nike', price: 170.00, updated: 'today', description: 'Iconic running shoe featuring Nike\'s revolutionary "Tuned Air" technology with visible Air units in heel and forefoot. Inspired by Florida\'s coastal sunsets with distinctive TPU fingers design. Provides enhanced stability, responsive cushioning and impact absorption with breathable mesh upper.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Gray'], rating: 4.5, reviews: 324, image: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/85917daf-2674-4e8f-9acc-2f0ecc8fc8f6/NIKE+AIR+MAX+PLUS.png' },
      { id: 2, name: 'Ultraboost 5', brand: 'Adidas', brandLogo: 'https://cdn.simpleicons.org/adidas', price: 180.00, updated: 'today', description: 'Revolutionary running shoe with 9mm more LIGHT BOOST foam offering 2% more forefoot energy return than previous models. Features adaptive Primeknit upper with enhanced breathability and Continental rubber outsole. 30% lighter than original Boost with highest energy return yet.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Navy'], rating: 4.8, reviews: 567, image: 'https://cdn11.bigcommerce.com/s-ppsyskcavg/images/stencil/1280x1280/products/77984/304802/JR1987__66337.1745959479.png?c=2' },
      { id: 3, name: 'Fresh Foam X 1080 v14', brand: 'New Balance', brandLogo: 'https://cdn.simpleicons.org/newbalance', price: 165.00, updated: 'yesterday', description: 'Premium daily trainer with Fresh Foam X midsole (38mm heel/32mm forefoot stack, 6mm drop). Features triple jacquard mesh upper with increased breathability and higher midsole sidewalls for enhanced stability. Ideal for easy runs, recovery and long distances with plush, trustworthy ride.', sizes: ['6','7','8','9','10','11'], colors: ['Gray','Black','Blue'], rating: 4.3, reviews: 198, image: 'https://spryactive.ca/cdn/shop/files/new-balance-1080-v-14-w-brown-side_1024x.jpg?v=1750715502' },
      { id: 4, name: 'Go Walk 6', brand: 'Skechers', brandLogo: 'https://maisonrmi.com/wp-content/uploads/2022/06/Skechers-logo_Black-01-1024x285.png', price: 75.00, updated: 'yesterday', description: 'Next level comfort walking shoe featuring Stretch Fit engineered mesh upper with sock-like feel, lightweight ULTRA GO cushioning midsole, Air-Cooled Goga Mat insole and Hyper Pillars for added support. Solid shock absorption with pleasant springback for all-day wear.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Navy','Gray'], rating: 4.2, reviews: 412, image: 'https://i.ebayimg.com/images/g/~wsAAOSwMxRjGh9g/s-l400.jpg' },
      { id: 5, name: 'Charged Assert 10', brand: 'Under Armour', brandLogo: 'https://cdn.simpleicons.org/underarmour', price: 75.00, updated: '2 days ago', description: 'Budget-friendly running shoe with Charged Cushioning midsole that absorbs impact and converts it to responsive energy. Features breathable mesh upper with leather overlays, deluxe Comfort System sockliner and solid rubber outsole. Stable and comfortable for runs up to 6-7 miles.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Red','White'], rating: 4.4, reviews: 256, image: 'https://underarmour.scene7.com/is/image/Underarmour/3026179-001_DEFAULT?rp=standard-30pad%7CpdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on%2Con&bgc=f0f0f0&wid=566&hei=708&size=536%2C688' },
      { id: 6, name: 'Suede Classic XXI', brand: 'Puma', brandLogo: 'https://cdn.simpleicons.org/puma', price: 85.00, updated: '2 days ago', description: 'Iconic lifestyle sneaker that hit the scene in 1968, now updated for the 21st century. Features premium suede upper with comfort sockliner for instant cushioning, padded collar, cushioned midsole and durable rubber outsole. Timeless style meets modern comfort with gold-toned Puma details.', sizes: ['7','8','9','10','11'], colors: ['Black','Navy','Burgundy'], rating: 4.6, reviews: 389, image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/399781/01/sv01/fnd/PNA/fmt/png/Suede-Classic-Sneakers' },
      { id: 7, name: 'Court Vision Low', brand: 'Nike', brandLogo: 'https://cdn.simpleicons.org/nike', price: 80.00, updated: '3 days ago', description: 'Court-style sneaker bringing \'80s basketball fast break style to today\'s culture. Features synthetic and real leather upper that softens with wear, perforations for breathability and classic rubber cupsole. Basketball-inspired design with Air Force 1 sole and refined Dunk-like profile for everyday casual wear.', sizes: ['7','8','9','10','11','12'], colors: ['White','Black','Gray'], rating: 4.3, reviews: 221, image: 'https://www.svpsports.ca/cdn/shop/files/Nike---Men_s-Court-Vision-Low-Premium-Shoes-_HM9429-101_-01_76a17564-04c9-4852-93d5-0eb2cb5256c2.jpg?v=1752609847&width=2400' },
      { id: 8, name: 'Stan Smith', brand: 'Adidas', brandLogo: 'https://cdn.simpleicons.org/adidas', price: 100.00, updated: '3 days ago', description: 'Enduring classic since the 1960s, named after tennis legend Stan Smith. Features clean silhouette with smooth leather upper, perforated Three Stripes branding and contrasting heel tab with iconic portrait. Rubber cupsole provides lightweight cushioning and durable traction. Timeless lifestyle sneaker from tennis courts to streets.', sizes: ['6','7','8','9','10','11','12'], colors: ['White','Black','Green'], rating: 4.7, reviews: 634, image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/69721f2e7c934d909168a80e00818569_9366/Stan_Smith_Shoes_White_M20324_01_standard.jpg' },
      { id: 9, name: '574 Core', brand: 'New Balance', brandLogo: 'https://cdn.simpleicons.org/newbalance', price: 99.95, updated: '4 days ago', description: 'Heritage sneaker built as versatile hybrid road/trail design on wider last. Features ENCAP midsole cushioning combining soft foam with durable polyurethane rim for all-day support, lightweight EVA foam cushioning. Upper made of 50% recycled content. Reliable, rugged and durable for active lifestyles.', sizes: ['7','8','9','10','11','12'], colors: ['Gray','Navy','Burgundy'], rating: 4.5, reviews: 445, image: 'https://nb.scene7.com/is/image/NB/ml574evb_nb_02_i?$dw_detail_gallery$' },
],
    large: [
           { id: 10, name: 'Pegasus 40', brand: 'Nike', brandLogo: 'https://cdn.simpleicons.org/nike', price: 130.00, updated: 'today', description: 'Great all-rounder trainer suitable for everything from Park Run to speed sessions to marathons. Features React foam midsole with front and heel Zoom Air bags for responsive cushioning, redesigned engineered mesh upper with improved mid-foot band support, and 10mm drop. Trusty, reliable training partner weighing just 9.4 oz.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Blue'], rating: 4.9, reviews: 892, image: 'https://lecoureurnordique.ca/cdn/shop/files/DV7480-001-5.jpg?v=1692988384&width=2130' },
      { id: 11, name: 'Solarboost 5', brand: 'Adidas', brandLogo: 'https://cdn.simpleicons.org/adidas', price: 130.00, updated: 'yesterday', description: 'Workhorse running shoe with support, cushioning and energy for building consistency or upping mileage. Features full-length Light Boost foam (30% lighter than standard Boost), Linear Energy Push system for smoother transitions, technical mesh upper with integrated tongue, and Continental rubber outsole. Suitable for 5K to marathon distances with 10mm drop.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Gray','Red'], rating: 4.6, reviews: 512, image: 'https://i.ebayimg.com/images/g/KJ0AAOSw5n1j79Hn/s-l400.jpg' },
      { id: 12, name: '990v6', brand: 'New Balance', brandLogo: 'https://cdn.simpleicons.org/newbalance', price: 200.00, updated: '2 days ago', description: 'Premium Made in USA lifestyle sneaker featuring FuelCell foam technology for superior cushioning and rebound, ENCAP midsole for exceptional support, and genuine suede/mesh/leather throughout. Wider forefoot (113.8mm) provides outstanding stability. Lighter than v5 at 12.9oz yet maintains premium craftsmanship. 40th anniversary of the iconic 990 line.', sizes: ['7','8','9','10','11','12'], colors: ['Gray','Navy','Black'], rating: 4.8, reviews: 723, image: 'https://tenuedenimes.com/cdn/shop/files/m990gl6_nb_02_i_auto_x2_798cc696-55b0-4377-b270-75085c21cfd7.jpg?v=1699274988' },
      { id: 13, name: 'Velocity Nitro 3', brand: 'Puma', brandLogo: 'https://cdn.simpleicons.org/puma', price: 135.00, updated: '3 days ago', description: 'Lightweight daily trainer with 36mm heel/26mm forefoot supercritical NITROFOAM (nitrogen-infused) providing explosive energy return. Features engineered breathable mesh upper with PWRTAPE support, PumaGrip mini lugged outsole for leading traction, 10mm drop. Versatile cushioned trainer suitable for long runs, speed sessions and daily training at affordable price. Weighs just 9.1oz.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Blue'], rating: 4.4, reviews: 298, image: 'https://www.therunnersshop.com/cdn/shop/files/311141_07_sv01_1080x.jpg?v=1760128336' },
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

  const handleCheckout = () => {
    // navigate to dedicated checkout page
    setCartOpen(false)
    setCurrentPage('checkout')
  }

  async function confirmCheckout() {
    const grouped = cartItems.reduce((acc, item) => {
      const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`
      if (!acc[key]) acc[key] = { ...item, qty: 0 }
      acc[key].qty++
      return acc
    }, {})
    const items = Object.values(grouped)
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)
    const shipping = subtotal > 0 ? 20.0 : 0
    const tax = subtotal * 0.13
    const total = subtotal + shipping + tax

    // show confirmation popout with order summary
    setOrderConfirmation({ items, itemCount: items.reduce((s, it) => s + it.qty, 0), subtotal, shipping, tax, total })
    // clear cart and close any checkout modal state
    setCartItems([])
    setCheckoutOpen(false)

    try {
      // Use relative path so Vite proxy (dev) or same-origin (prod) handles the request.
      const backend = ''
      const payload = {
        ...form,
        items,
        amount: Math.round(total * 100),
        status: 'pending',
      }

      const res = await fetch(`${backend}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('Server returned error saving order:', data)
        const message = data && data.details ? `${data.error}: ${data.details}` : (data && data.error) || 'Unknown server error'
        alert('Failed to save order — ' + message)
        return
      }

      console.log('Order saved:', data)
      alert('Order saved!')
    } catch (err) {
      console.error('Error saving order:', err)
      alert('Failed to save order — network error')
    }
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
                <img src={it.image} alt={it.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
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

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between',alignItems: 'center' }}>
          <div style={{ fontWeight: 700, marginRight: 12 }}>Total: ${total.toFixed(2)}</div>
          <button onClick={() => setCartOpen(false)} style={{padding: '10px', border: '1px solid #000000ff', background: '#000000ff', color: '#fff', cursor: 'pointer' }}>Continue</button>
          <button onClick={handleCheckout} style={{padding: '10px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>Checkout</button>
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
            <button onClick={() => setCheckoutOpen(false)} style={{ flex: 1, padding: '10px', border: '1px solid #000000ff', background: '#000000ff', color: '#fff', cursor: 'pointer' }}>Cancel</button>
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
                <img src={brand.logo} alt={brand.name} style={{ maxWidth: '150px', maxHeight: '60px', filter: 'brightness(0) invert(1)' }} />
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
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Product Info */}
            <div style={styles.detailsInfo}>
              <img src={selectedProduct.brandLogo} alt={selectedProduct.brand} style={{ maxWidth: '120px', maxHeight: '40px', marginBottom: '10px' }} />
              <h1 style={styles.detailsTitle}>{selectedProduct.name}</h1>

              {/* Rating */}
              <div style={styles.detailsRating}>
                <span>{'★'.repeat(Math.floor(selectedProduct.rating))}{'☆'.repeat(5 - Math.floor(selectedProduct.rating))}</span>
                <span>{'☆'.repeat(5)}</span>
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
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#000'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = selectedSize === size ? '#000' : '#ddd'
                      }}
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
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#000'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = selectedColor === color ? '#000' : '#ddd'
                      }}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000'
                }}
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
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
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
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
              </div>
              <div style={styles.productTitleLarge}>{product.name}</div>
              <div style={styles.productUpdateLarge}>Updated {product.updated}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderCheckoutPage = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`
      if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key }
      acc[key].qty++
      return acc
    }, {})
    const items = Object.values(grouped)
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)
    const shipping = subtotal > 0 ? 20.0 : 0
    const tax = subtotal * 0.13
    const total = subtotal + shipping + tax

    return (
      <>
        <header style={styles.header}>Fresh Footwear</header>
        <div style={{ padding: 20 }}>
          <button onClick={() => setCurrentPage('browse')} style={{ marginBottom: 12 }}>← Back to Browse</button>
          <div style={styles.checkoutLayout}>
            <div style={styles.checkoutLeft}>
              <h3>Your items</h3>
              {items.length === 0 ? (
                <div style={{ padding: 12 }}>Your cart is empty</div>
              ) : (
                items.map((it) => (
                  <div key={it.variantKey} style={styles.checkoutItem}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{it.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {it.selectedSize ? `Size: ${it.selectedSize}` : ''}
                        {it.selectedSize && it.selectedColor ? ' • ' : ''}
                        {it.selectedColor ? `Color: ${it.selectedColor}` : ''}
                      </div>
                      <div style={{ fontSize: 13, marginTop: 6 }}>${it.price.toFixed(2)} × {it.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>${(it.price * it.qty).toFixed(2)}</div>
                  </div>
                ))
              )}
              <div style={styles.checkoutSummary}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Subtotal</div><div>${subtotal.toFixed(2)}</div></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Shipping</div><div>${shipping.toFixed(2)}</div></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Tax</div><div>${tax.toFixed(2)}</div></div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: 8 }}><div>Total</div><div>${total.toFixed(2)}</div></div>
              </div>
            </div>

            <div style={styles.checkoutRight}>
              <h3>Checkout information</h3>
              <div style={styles.checkoutForm}>
                <input style={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                <input style={styles.input} name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <input style={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" />
                <input style={styles.input} name="address1" value={form.address1} onChange={handleChange} placeholder="Address line 1" />
                <input style={styles.input} name="address2" value={form.address2} onChange={handleChange} placeholder="Address line 2" />
                <input style={styles.input} name="cityStateZip" value={form.cityStateZip} onChange={handleChange} placeholder="City, State ZIP" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...styles.input, flex: 1 }} name="country" value={form.country} onChange={handleChange} placeholder="Country" />
                  <input style={{ ...styles.input, width: 100 }} name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginTop: 8 }}>Payment</div>
                  <input style={styles.input} name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Card number" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input style={{ ...styles.input, flex: 1 }} name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
                    <input style={{ ...styles.input, width: 120 }} name="cvc" value={form.cvc} onChange={handleChange} placeholder="CVC" />
                  </div>
                </div>

                <div style={styles.checkoutActions}>
                  <button onClick={() => setCurrentPage('browse')} style={{ flex: 1, padding: 12, border: '1px solid #ddd', background: '#000000ff' }}>Continue shopping</button>
                  <button onClick={confirmCheckout} style={{ flex: 1, padding: 12, border: '1px solid #ddd', background: '#000', color: '#ffffffff' }}>Place order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div style={styles.container}>
      <CartButton />
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'browse' && renderBrowsePage()}
      {currentPage === 'details' && renderDetailsPage()}
  {currentPage === 'checkout' && renderCheckoutPage()}
      {cartOpen && <CartDropdown />}
      {checkoutOpen && <CheckoutModal />}
      {orderConfirmation && (
        <OrderConfirmationModal
          data={orderConfirmation}
          onClose={() => {
            setOrderConfirmation(null)
            setCurrentPage('home')
          }}
        />
      )}
    </div>
  )
}
