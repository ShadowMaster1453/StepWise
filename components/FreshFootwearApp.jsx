'use client';
import { useState, useEffect } from 'react';
import CheckoutPage from './Checkout.jsx';

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
  const [searchTerm, setSearchTerm] = useState('');

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
    productTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#000',
    },
    productUpdate: {
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
    detailsInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
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
    detailsSection: { marginTop: '30px' },
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

  const sampleProducts = [
    { id: 1, name: 'Air Max Plus', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Men', price: 170.00, updated: 'today', description: 'Iconic running shoe featuring Nike\'s revolutionary "Tuned Air" technology with visible Air units in heel and forefoot. Inspired by Florida\'s coastal sunsets with distinctive TPU fingers design. Provides enhanced stability, responsive cushioning and impact absorption with breathable mesh upper.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Gray'], rating: 4.5, reviews: 324, image: '/images/nikeairmaxplus_black.webp', colorImages: { 'Black': '/images/nikeairmaxplus_black.webp', 'White': '/images/nikeairmax_white.webp', 'Gray': '/images/nikeairmax_grey.webp' } },
    { id: 2, name: 'Ultraboost 5', brand: 'Adidas', brandLogo: '/images/adidas_logo.jpg', category: 'Women', price: 180.00, updated: 'today', description: 'Revolutionary running shoe with 9mm more LIGHT BOOST foam offering 2% more forefoot energy return than previous models. Features adaptive Primeknit upper with enhanced breathability and Continental rubber outsole. 30% lighter than original Boost with highest energy return yet.', sizes: ['5','6','7','8','9','10','11'], colors: ['Black','White','Beige'], rating: 4.8, reviews: 567, image: '/images/ultraboost_white.webp', colorImages: { 'Black': '/images/ultraboost_black.webp', 'White': '/images/ultraboost_white.webp', 'Beige': '/images/ultraboost_beige.webp' } },
    { id: 3, name: 'Fresh Foam X 1080 v14', brand: 'New Balance', brandLogo: '/images/newbalance_logo.jpg', category: 'Women', price: 165.00, updated: 'yesterday', description: 'Premium daily trainer with Fresh Foam X midsole (38mm heel/32mm forefoot stack, 6mm drop). Features triple jacquard mesh upper with increased breathability and higher midsole sidewalls for enhanced stability. Ideal for easy runs, recovery and long distances with plush, trustworthy ride.', sizes: ['5','6','7','8','9','10','11'], colors: ['White','Black','Pink'], rating: 4.3, reviews: 198, image: '/images/freshfoam_white.webp', colorImages: { 'White': '/images/freshfoam_white.webp', 'Black': '/images/freshfoam_black.webp', 'Pink': '/images/freshfoam_pink.webp' } },
    { id: 4, name: 'Go Walk 6', brand: 'Skechers', brandLogo: '/images/sketchers_logo.png', category: 'Women', price: 75.00, updated: 'yesterday', description: 'Next level comfort walking shoe featuring Stretch Fit engineered mesh upper with sock-like feel, lightweight ULTRA GO cushioning midsole, Air-Cooled Goga Mat insole and Hyper Pillars for added support. Solid shock absorption with pleasant springback for all-day wear.', sizes: ['5','6','7','8','9','10'], colors: ['Black','Navy'], rating: 4.2, reviews: 412, image: '/images/gowalk_black.avif', colorImages: { 'Black': '/images/gowalk_black.avif', 'Navy': '/images/gowalk_navy.avif' } },
    { id: 5, name: 'Charged Assert 10', brand: 'Under Armour', brandLogo: '/images/underarmour_logo.jpg', category: 'Men', price: 75.00, updated: '2 days ago', description: 'Budget-friendly running shoe with Charged Cushioning midsole that absorbs impact and converts it to responsive energy. Features breathable mesh upper with leather overlays, deluxe Comfort System sockliner and solid rubber outsole. Stable and comfortable for runs up to 6-7 miles.', sizes: ['7','8','9','10','11','12'], colors: ['Black','Red','White'], rating: 4.4, reviews: 256, image: '/images/chargedassert_black.jpg', colorImages: { 'Black': '/images/chargedassert_black.jpg', 'Red': '/images/chargedassert_red.avif', 'White': '/images/chargedassert_white.avif' } },
    { id: 6, name: 'Suede Classic XXI', brand: 'Puma', brandLogo: '/images/puma_logo.jpg', category: 'Men', price: 85.00, updated: '2 days ago', description: 'Iconic lifestyle sneaker that hit the scene in 1968, now updated for the 21st century. Features premium suede upper with comfort sockliner for instant cushioning, padded collar, cushioned midsole and durable rubber outsole. Timeless style meets modern comfort with gold-toned Puma details.', sizes: ['7','8','9','10','11','12'], colors: ['Blue','Black'], rating: 4.6, reviews: 389, image: '/images/suedeclassix_blue.avif', colorImages: { 'Blue': '/images/suedeclassix_blue.avif', 'Black': '/images/suedeclassic_black.avif' } },
    { id: 7, name: 'Court Vision Low', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Men', price: 80.00, updated: '3 days ago', description: 'Court-style sneaker bringing \'80s basketball fast break style to today\'s culture. Features synthetic and real leather upper that softens with wear, perforations for breathability and classic rubber cupsole. Basketball-inspired design with Air Force 1 sole and refined Dunk-like profile for everyday casual wear.', sizes: ['7','8','9','10','11','12'], colors: ['White','Black'], rating: 4.3, reviews: 221, image: '/images/courtvision_white.webp', colorImages: { 'White': '/images/courtvision_white.webp', 'Black': '/images/courtvision_black.avif' } },
    { id: 8, name: 'Superstar II', brand: 'Adidas', brandLogo: '/images/adidas_logo.jpg', category: 'Men', price: 100.00, updated: '3 days ago', description: 'Iconic basketball-inspired sneaker with signature rubber shell toe and classic leather upper. Features the legendary Three Stripes design, cushioned insole and durable rubber cupsole. A timeless streetwear staple that blends sports heritage with modern style.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White'], rating: 4.7, reviews: 634, image: '/images/superstar_black.webp', colorImages: { 'Black': '/images/superstar_black.webp', 'White': '/images/superstar_white.avif' } },
    { id: 9, name: '574 Core', brand: 'New Balance', brandLogo: '/images/newbalance_logo.jpg', category: 'Children', price: 99.95, updated: '4 days ago', description: 'Heritage sneaker built as versatile hybrid road/trail design on wider last. Features ENCAP midsole cushioning combining soft foam with durable polyurethane rim for all-day support, lightweight EVA foam cushioning. Upper made of 50% recycled content. Reliable, rugged and durable for active lifestyles.', sizes: ['1','2','3','4','5','6'], colors: ['White','Black','Blue'], rating: 4.5, reviews: 445, image: '/images/574core_white.jpg', colorImages: { 'White': '/images/574core_white.jpg', 'Black': '/images/574core_black.webp', 'Blue': '/images/574core_blue.webp' } },
    { id: 10, name: 'Pegasus 40', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Men', price: 130.00, updated: 'today', description: 'Great all-rounder trainer suitable for everything from Park Run to speed sessions to marathons. Features React foam midsole with front and heel Zoom Air bags for responsive cushioning, redesigned engineered mesh upper with improved mid-foot band support, and 10mm drop. Trusty, reliable training partner weighing just 9.4 oz.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White','Neon'], rating: 4.9, reviews: 892, image: '/images/pegasus_black.webp', colorImages: { 'Black': '/images/pegasus_black.webp', 'White': '/images/pegasus_white.avif', 'Neon': '/images/pegasus_neon.avif' } },
    { id: 11, name: 'Solarboost 5', brand: 'Adidas', brandLogo: '/images/adidas_logo.jpg', category: 'Women', price: 130.00, updated: 'yesterday', description: 'Workhorse running shoe with support, cushioning and energy for building consistency or upping mileage.', sizes: ['5','6','7','8','9','10','11'], colors: ['White','Red'], rating: 4.6, reviews: 512, image: '/images/solarboost_white.jpg', colorImages: { 'White': '/images/solarboost_white.jpg', 'Red': '/images/solarboost_red.avif' } },
    { id: 12, name: '990v6', brand: 'New Balance', brandLogo: '/images/newbalance_logo.jpg', category: 'Men', price: 200.00, updated: '2 days ago', description: 'Premium Made in USA lifestyle sneaker featuring FuelCell foam technology for superior cushioning and rebound.', sizes: ['7','8','9','10','11','12','13'], colors: ['Black','Blue'], rating: 4.8, reviews: 723, image: '/images/990v6_black.webp', colorImages: { 'Black': '/images/990v6_black.webp', 'Blue': '/images/990v6_blue.webp' } },
    { id: 13, name: 'Velocity Nitro 3', brand: 'Puma', brandLogo: '/images/puma_logo.jpg', category: 'Children', price: 135.00, updated: '3 days ago', description: 'Lightweight daily trainer with supercritical NITROFOAM providing explosive energy return.', sizes: ['1','2','3','4','5','6'], colors: ['Black','Blue','Pink'], rating: 4.4, reviews: 298, image: '/images/velocitynitro_black.avif', colorImages: { 'Black': '/images/velocitynitro_black.avif', 'Blue': '/images/velocitynitro_blue.avif', 'Pink': '/images/velocitynitro_pink.avif' } },
    { id: 14, name: 'Air Zoom Structure 25', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Men', price: 140.00, updated: '3 days ago', description: 'Stability running shoe with dual Zoom Air units for responsive cushioning and medial post for support.', sizes: ['7','8','9','10','11','12'], colors: ['Black','White'], rating: 4.5, reviews: 412, image: '/images/structure25_black.avif', colorImages: { 'Black': '/images/structure25_black.avif', 'White': '/images/structure25_white.avif' } },
    { id: 15, name: 'Air Zoom Pegasus 40', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Women', price: 140.00, updated: 'today', description: 'Versatile running shoe with React foam midsole and dual Zoom Air units for responsive cushioning.', sizes: ['5','6','7','8','9','10','11'], rating: 4.7, reviews: 638, image: '/images/airzoompegasus_black.webp' },
    { id: 16, name: 'Cali Court', brand: 'Puma', brandLogo: '/images/puma_logo.jpg', category: 'Women', price: 75.00, updated: 'yesterday', description: 'Retro-inspired lifestyle sneaker with classic court design and modern comfort.', sizes: ['5','6','7','8','9','10','11'], rating: 4.6, reviews: 521, image: '/images/calicourt_white.webp' },
    { id: 17, name: 'Air Force 1 \'07', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Women', price: 110.00, updated: '2 days ago', description: 'Iconic basketball-inspired sneaker with timeless style and modern comfort.', sizes: ['5','6','7','8','9','10','11'], colors: ['White','Black','Beige'], rating: 4.5, reviews: 389, image: '/images/airforce_white.webp', colorImages: { 'White': '/images/airforce_white.webp', 'Black': '/images/airforce_black.avif', 'Beige': '/images/airforce_beige.avif' } },
    { id: 18, name: 'Cloudfoam Pure 2.0', brand: 'Adidas', brandLogo: '/images/adidas_logo.jpg', category: 'Women', price: 70.00, updated: '3 days ago', description: 'Comfortable lifestyle sneaker with Cloudfoam cushioning for all-day wear.', sizes: ['5','6','7','8','9','10','11'], colors: ['White','Black'], rating: 4.6, reviews: 445, image: '/images/cloudfoam_white.avif', colorImages: { 'White': '/images/cloudfoam_white.avif', 'Black': '/images/cloudfoam_black.avif' } },
    { id: 19, name: 'Revolution 7', brand: 'Nike', brandLogo: '/images/nike_logo.jpg', category: 'Children', price: 65.00, updated: 'today', description: 'Durable kids running shoe with soft foam cushioning and flexible design.', sizes: ['1','2','3','4','5','6'], colors: ['Black','Blue'], rating: 4.3, reviews: 289, image: '/images/revolution7.webp', colorImages: { 'Black': '/images/revolution7.webp', 'Blue': '/images/revolution7_blue.avif' } },
    { id: 20, name: 'Racer TR 3', brand: 'Adidas', brandLogo: '/images/adidas_logo.jpg', category: 'Children', price: 55.00, updated: 'yesterday', description: 'Lightweight kids training shoe with Cloudfoam cushioning for comfort.', sizes: ['1','2','3','4','5','6'], rating: 4.2, reviews: 312, image: '/images/trracer3_black.avif' },
    { id: 21, name: 'FuelCore Rush', brand: 'New Balance', brandLogo: '/images/newbalance_logo.jpg', category: 'Children', price: 60.00, updated: '2 days ago', description: 'Kids running shoe with REVlite midsole for lightweight cushioning.', sizes: ['1','2','3','4','5','6'], rating: 4.4, reviews: 267, image: '/images/fuelcore_grey.webp' },
    { id: 22, name: 'Enzo 2', brand: 'Puma', brandLogo: '/images/puma_logo.jpg', category: 'Children', price: 50.00, updated: '3 days ago', description: 'Kids athletic shoe with SoftFoam cushioning for comfort.', sizes: ['1','2','3','4','5','6'], rating: 4.1, reviews: 198, image: '/images/enzo2_black.jpg' },
    { id: 23, name: 'Charged Pursuit 3', brand: 'Under Armour', brandLogo: '/images/underarmour_logo.jpg', category: 'Children', price: 55.00, updated: '4 days ago', description: 'Kids running shoe with Charged Cushioning midsole for responsive comfort.', sizes: ['1','2','3','4','5','6'], rating: 4.3, reviews: 223, image: '/images/chargedpursuit_black.jpg' },
    { id: 24, name: 'D-Lites', brand: 'Skechers', brandLogo: '/images/sketchers_logo.png', category: 'Children', price: 60.00, updated: '4 days ago', description: 'Kids lifestyle sneaker with Air-Cooled Memory Foam insole for comfort.', sizes: ['1','2','3','4','5','6'], rating: 4.5, reviews: 334, image: '/images/d-lites_blue.webp' },
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

  // localStorage cart persistence
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

  const handleRemoveOne = (variantKeyOrId) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.variantKey === variantKeyOrId || p.id === variantKeyOrId);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const handleClearCart = () => setCartItems([]);

  const handleCheckout = () => {
    setCartOpen(false);
    setCurrentPage('checkout');
  };

  const CartDropdown = () => {
    const grouped = cartItems.reduce((acc, item) => {
      const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`;
      if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key };
      acc[key].qty++;
      return acc;
    }, {});
    const items = Object.values(grouped);
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

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
            <div key={it.variantKey} style={styles.cartItem}>
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

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, marginRight: 12 }}>Total: ${total.toFixed(2)}</div>
          <button onClick={() => setCartOpen(false)} style={{ padding: '10px', border: '1px solid #000000ff', background: '#000000ff', color: '#fff', cursor: 'pointer' }}>Continue</button>
          <button onClick={handleCheckout} style={{ padding: '10px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>Checkout</button>
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
      {cartItems.length > 0 && (
        <div style={styles.cartCount}>{cartItems.length}</div>
      )}
    </button>
  );

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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <main style={styles.content}>
          {/* search on home page - hitting Enter jumps to browse */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search...."
              style={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate('browse');
                }
              }}
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
      if (selectedProduct.colorImages && selectedColor && selectedProduct.colorImages[selectedColor]) {
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
              <img src={getCurrentImage()} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div style={styles.detailsInfo}>
              <img src={selectedProduct.brandLogo} alt={selectedProduct.brand} style={{ maxWidth: '120px', maxHeight: '40px', marginBottom: '10px' }} />
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
                        backgroundColor: selectedSize === size ? '#000' : styles.sizeButton.backgroundColor,
                        color: selectedSize === size ? '#fff' : (styles.sizeButton.color || '#000'),
                      }}
                      onClick={() => setSelectedSize(size)}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedSize === size ? '#000' : '#ddd'; }}
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
                          border: selectedColor === color ? '2px solid #000' : styles.colorButton.border,
                          backgroundColor: selectedColor === color ? '#000' : styles.colorButton.backgroundColor,
                          color: selectedColor === color ? '#fff' : '#000',
                        }}
                        onClick={() => setSelectedColor(color)}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedColor === color ? '#000' : '#ddd'; }}
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
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#333'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000'; }}
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
    // base filter: category
    let filtered = sampleProducts.filter(
      (product) => selectedFilter === 'All' || product.category === selectedFilter
    );

    // brand filter
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // search filter (name OR brand)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
      );
    }

    return (
      <>
        <header style={styles.header}>Fresh Footwear</header>

        <div style={styles.browseHeader}>
          <button style={styles.backButton} onClick={() => handleNavigate('home')}>
            <span>&larr;</span>
          </button>
        </div>

        {/* search on browse page */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search...."
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedBrand && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '15px' }}>
              Showing: {selectedBrand}
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
            {filtered.map((product) => (
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
      {currentPage === 'checkout' && (
        <CheckoutPage
          cartItems={cartItems}
          setCartItems={setCartItems}
          setCurrentPage={setCurrentPage}
        />
      )}
      {cartOpen && <CartDropdown />}
    </div>
  );
}
