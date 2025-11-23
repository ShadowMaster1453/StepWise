import React, { useState } from 'react'

export function OrderConfirmationModal({ data, onClose }) {
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

export function CheckoutModal({ cartItems = [], setCartItems, onClose = () => {}, onConfirm = () => {} }) {
  const grouped = cartItems.reduce((acc, item) => {
    const key = item.variantKey ?? `${item.id}::${item.selectedSize ?? 'nosize'}::${item.selectedColor ?? 'nocolor'}`
    if (!acc[key]) acc[key] = { ...item, qty: 0, variantKey: key }
    acc[key].qty++
    return acc
  }, {})
  const items = Object.values(grouped)
  const total = items.reduce((s, it) => s + it.price * it.qty, 0)

  const handleConfirm = async () => {
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)
    const shipping = subtotal > 0 ? 20.0 : 0
    const tax = subtotal * 0.13
    const totalAmt = subtotal + shipping + tax

    const payload = {
      items,
      amount: Math.round(totalAmt * 100),
      status: 'pending',
    }

    try {
      const res = await fetch(`/api/checkout`, {
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

      // clear cart locally and notify parent
      setCartItems([])
      onConfirm({ items, itemCount: items.reduce((s, it) => s + it.qty, 0), subtotal, shipping, tax, total: totalAmt })
      onClose()
      alert('Order saved!')
    } catch (err) {
      console.error('Error saving order:', err)
      alert('Failed to save order — network error')
    }
  }

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
                  <div style={{ fontWeight: 600, color: '#000000ff' }}>{it.name}</div>
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
            <div style={{ marginTop: 8, padding: '8px 0', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#333' }}>Total:</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#000', marginLeft: 12 }}>${total.toFixed(2)}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #000000ff', background: '#000000ff', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleConfirm} style={{ flex: 1, padding: '10px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>Confirm Order</button>
        </div>
      </div>
    </div>
  )
}

export function CheckoutPage({ cartItems = [], setCartItems, setCurrentPage = () => {}, onOrderConfirmed = () => {} }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    City: '',
    Provience: '',
    PostalCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

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

  const confirmCheckout = async () => {
    // UI feedback
    onOrderConfirmed({ items, itemCount: items.reduce((s, it) => s + it.qty, 0), subtotal, shipping, tax, total })
    setCartItems([])

    const payload = {
      ...form,
      items,
      amount: Math.round(total * 100),
      status: 'pending',
    }

    try {
      const res = await fetch(`/api/checkout`, {
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
      setCurrentPage('home')
    } catch (err) {
      console.error('Error saving order:', err)
      alert('Thank you for placing your order')
    }
  }

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
                    <div style={{ fontSize: 12, color: '#000000ff' }}>
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
              <input style={styles.input} name="cityStateZip" value={form.cityStateZip} onChange={handleChange} placeholder="City" />
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...styles.input, flex: 1 }} name="country" value={form.country} onChange={handleChange} placeholder="Province" />
                <input style={{ ...styles.input, width: 100 }} name="zip" value={form.zip} onChange={handleChange} placeholder="Postal Code" />
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
                <button onClick={() => setCurrentPage('browse')} style={{ flex: 1, padding: 12, border: '1px solid #ffffffff', background: '#000000ff', color: '#ffffffff' }}>Continue shopping</button>
                <button onClick={confirmCheckout} style={{ flex: 1, padding: 12, border: '1px solid #ddd', background: '#000', color: '#ffffffff' }}>Place order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200
  },
  modalContent: {
    width: '480px',
    maxWidth: '92%',
    background: '#000',
    color: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.8)'
  },
  checkoutLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    background: '#000',
    color: '#fff',
  },
  checkoutLeft: {
    background: '#000',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '8px',
    padding: '16px'
  },
  checkoutRight: {
    background: '#000',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '8px',
    padding: '16px'
  },
  checkoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #fff',
    color: '#fff',
  },
  checkoutForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    color: '#fff',
  },
  input: {
    padding: '10px',
    border: '1px solid #fff',
    borderRadius: '6px',
    background: '#000',
    color: '#fff',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #fff',
    borderRadius: '6px',
    minHeight: '80px',
    background: '#000',
    color: '#fff',
  },
  checkoutSummary: {
    padding: '12px',
    borderTop: '1px solid #fff',
    marginTop: '12px',
    color: '#fff',
  },
  checkoutActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    color: '#fff',
  },
  header: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  }
}

export default CheckoutPage
