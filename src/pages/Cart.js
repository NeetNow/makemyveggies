import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart = () => {
  // Sample cart data - in a real app this would come from context/state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Garden Rose Plant',
      price: 25.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80/4CAF50/ffffff?text=Rose'
    },
    {
      id: 2,
      name: 'Garden Irrigation System',
      price: 150.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80/2196F3/ffffff?text=System'
    },
    {
      id: 3,
      name: 'Garden Tools Set',
      price: 75.50,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80/FF9800/ffffff?text=Tools'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 200 ? 0 : 15; // Free shipping over $200
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main>
          <section className="pageheader padding-block">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="section__header">
                    <ul className="breadcum">
                      <li><Link to="/">Home</Link></li>
                      <li>Cart</li>
                    </ul>
                    <h2>Shopping Cart</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cart-empty padding-block">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="empty-cart-content">
                    <div style={{
                      width: '200px',
                      height: '200px',
                      margin: '0 auto 30px',
                      display: 'block',
                      borderRadius: '50%',
                      background: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: '#999'
                    }}>
                      🛒
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="custom-btn">Continue Shopping</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li>Cart</li>
                  </ul>
                  <h2>Shopping Cart</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cart Section */}
        <section className="cart padding-block bg-white">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="cart-container">
                  {/* Cart Items */}
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">{item.name}</h4>
                          <div className="item-meta">
                            <span className="item-category">Garden Plant</span>
                          </div>
                        </div>
                        <div className="item-price">
                          <span className="unit-price">${item.price.toFixed(2)}</span>
                        </div>
                        <div className="item-quantity">
                          <div className="quantity-controls">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="qty-btn"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="qty-input"
                              min="1"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="item-total">
                          <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() => updateQuantity(item.id, 0)}
                            className="remove-btn"
                            title="Remove item"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Actions */}
                  <div className="cart-actions">
                    <Link to="/shop" className="continue-shopping-btn">
                      <i className="fa-solid fa-arrow-left"></i>
                      Continue Shopping
                    </Link>
                    <button className="clear-cart-btn" onClick={() => setCartItems([])}>
                      <i className="fa-solid fa-trash"></i>
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                  <div className="summary-card">
                    <h3>Cart Summary</h3>
                    <div className="summary-row">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span className={shipping === 0 ? 'text-success' : ''}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (10%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr className="summary-divider" />
                    <div className="summary-row summary-total">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    {subtotal < 200 && (
                      <div className="shipping-notice">
                        <i className="fa-solid fa-info-circle"></i>
                        <span>Add ${(200 - subtotal).toFixed(2)} more for FREE shipping!</span>
                      </div>
                    )}

                    <div className="checkout-section">
                      <Link to="/checkout" className="checkout-btn">
                        <i className="fa-solid fa-credit-card"></i>
                        Proceed to Checkout
                      </Link>
                      <div className="secure-checkout">
                        <i className="fa-solid fa-lock"></i>
                        <span>Secure Checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
