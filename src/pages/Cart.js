import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

const Cart = () => {
  const { cartItems, updateQuantity, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping over $200
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <main>
          <section className="pageheader overflow-hidden"> 
                    <div className="container">
                      <div className="pageheader__content">
                        <h2>Shopping Cart</h2>
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
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
                  <div className="container">
                    <div className="pageheader__content">
                      <h2>Shopping Cart</h2>
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                          <li><Link to="/">Home</Link></li>
                          <li><Link to="/shop">Shop</Link></li>
                          <li><Link to="/cart">Cart</Link></li>
                        </ol>
                      </nav>
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
                          {item.original_price && item.original_price > item.price ? (
                            <div className="price-with-discount d-flex flex-column gap-1">
                              <div>
                                <span className="text-muted">MRP: </span>
                                <span className="original-price text-decoration-line-through text-muted">
                                  ₹{item.original_price.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="discount-badge badge bg-danger">
                                  {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                                </span>
                                <span className="text-success fw-bold ms-2">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className="text-muted small ms-1">
                                  (Save ₹{(item.original_price - item.price).toFixed(2)})
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="unit-price">₹{item.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="item-quantity">
                          <div className="quantity-controls">
                            <button
                              onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                              className="qty-btn"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.cart_id, parseInt(e.target.value) || 0)}
                              className="qty-input"
                              min="1"
                            />
                            <button
                              onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="item-total">
                          {item.original_price && item.original_price > item.price ? (
                            <div className="total-with-discount d-flex flex-column gap-1 text-end">
                              <div>
                                <span className="text-muted">Total MRP: </span>
                                <span className="original-total text-decoration-line-through text-muted">
                                  ₹{(item.original_price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-success fw-bold">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                                <span className="badge bg-success ms-2">
                                  Save ₹{((item.original_price - item.price) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="total-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                          )}
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() => updateQuantity(item.cart_id, 0)}
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
                    <button className="clear-cart-btn" onClick={clearCart}>
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
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span className={shipping === 0 ? 'text-success' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <hr className="summary-divider" />
                    <div className="summary-row summary-total">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>

                    {/* {subtotal < 200 && (
                      <div className="shipping-notice">
                        <i className="fa-solid fa-info-circle"></i>
                        <span>Add ₹{(200 - subtotal).toFixed(2)} more for FREE shipping!</span>
                      </div>
                    )} */}

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
