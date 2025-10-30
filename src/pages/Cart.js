import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaStar, FaTimes, FaShoppingCart } from 'react-icons/fa';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Calculate cart totals
  const [selectedShipping, setSelectedShipping] = React.useState('free');
  const [country, setCountry] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingRates = { free: 0, flat: 0, local: 0 };
  const shipping = shippingRates[selectedShipping] ?? 0;
  const total = subtotal + shipping;

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Header />
        <main>
          <section className="pageheader overflow-hidden">
            <div className="container">
              <div className="pageheader__content">
                <h2>Shopping Cart</h2>
                <nav aria-label="breadcrumb">
                  <ul className="breadcrumb">
                    <li><Link to="/">Home</Link></li>
                    <li className="active" aria-current="page">Cart</li>
                  </ul>
                </nav>
              </div>
            </div>
          </section>

          <section className="cart-empty padding-block">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="empty-cart-content">
                    <div className="empty-cart-icon">
                      <FaShoppingCart />
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything to your cart yet</p>
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
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Shopping Cart</h2>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="active" aria-current="page">Cart</li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <section className="cartdesk padding-block">
          <div className="container">
            <div className="cartdesk__innerborder">
              {/* Cart Header */}
              <div className="cartdesk__header">
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button 
                      className="nav-link active" 
                      id="nav-home-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#nav-home" 
                      type="button" 
                      role="tab" 
                      aria-controls="nav-home" 
                      aria-selected="true"
                    >
                      Shopping Cart
                    </button>
                  </div>
                </nav>
              </div>
              
              {/* Cart Content */}
              <div className="cartdesk__content row">
                <div className="col-lg-7">
                  <div className="cartdesk__body">
                    <div className="cartdesk__tablehead row d-none d-md-flex">
                      <div className="col-md-6 th">Product</div>
                      <div className="col-md-2 th">Price</div>
                      <div className="col-md-2 th">Quantity</div>
                      <div className="col-md-1 th">Total</div>
                      <div className="col-md-1 th text-end">Remove</div>
                    </div>
                    {cartItems.map((item) => (
                      <div key={item.id} className="cartdesk__item">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <div className="cartdesk__itemleft">
                              <div className="cartdesk__img">
                                <img src={item.image} alt={item.name} className="img-fluid" />
                              </div>
                              <div className="cartdesk__text">
                                <h4>{item.name}</h4>
                                <div className="allstar">
                                  <ul className="star">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <FaStar 
                                        key={star} 
                                        className={star <= 4 ? 'filled' : 'half'} 
                                      />
                                    ))}
                                  </ul>
                                </div>
                                <p>{item.description || 'No description available'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="cartdesk__price">
                              <div className="price-amount">${item.price.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="cartdesk__qty">
                              <div className="quantity">
                                <button 
                                  className="minus"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  type="button"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <input 
                                  type="text" 
                                  value={item.quantity} 
                                  className="qty" 
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    updateQuantity(item.id, Math.max(1, value));
                                  }}
                                  aria-label="Quantity"
                                />
                                <button 
                                  className="plus"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  type="button"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-1">
                            <div className="cartdesk__total">
                              <div className="total-amount">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="col-md-1 text-end">
                            <div className="cartdesk__remove">
                              <button 
                                className="remove"
                                onClick={() => removeFromCart(item.id)}
                                type="button"
                                aria-label="Remove item"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="coupon mt-3">
                    <label className="d-block mb-2">Discount Code</label>
                    <div className="d-flex gap-2">
                      <input type="text" placeholder="Discount Code" />
                      <button type="button" className="custom-btn">Apply</button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="cartdesk__totalamount">
                    <div className="cartdesk__totalamount--item">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="cartdesk__totalamount--item">
                      <span>Shipping</span>
                      <span>+${shipping.toFixed(2)}</span>
                    </div>
                    <div className="shipping-options">
                      <div className="option">
                        <label>
                          <input
                            type="radio"
                            name="shipping"
                            value="free"
                            checked={selectedShipping === 'free'}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                          />{' '}
                          Free Shipping
                        </label>
                        <span className="amount">+${(0).toFixed(2)}</span>
                      </div>
                      <div className="option">
                        <label>
                          <input
                            type="radio"
                            name="shipping"
                            value="flat"
                            checked={selectedShipping === 'flat'}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                          />{' '}
                          Flat Rate
                        </label>
                        <span className="amount">+${(0).toFixed(2)}</span>
                      </div>
                      <div className="option">
                        <label>
                          <input
                            type="radio"
                            name="shipping"
                            value="local"
                            checked={selectedShipping === 'local'}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                          />{' '}
                          Local Delivery
                        </label>
                        <span className="amount">+${(0).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="calculate-shipping">
                      <div className="mb-2 calc-title">Calculate Shipping</div>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-select mb-2"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="IN">India</option>
                        <option value="GB">United Kingdom</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Postcode/ZIP"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="form-control mb-2"
                      />
                      <button type="button" className="custom-btn w-100">Update Cart</button>
                    </div>
                    <div className="cartdesk__totalamount--item total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="cartdesk__totalamount--btn">
                      <Link to="/checkout" className="custom-btn">
                        <FaShoppingCart className="me-2" />
                        Proceed To Checkout
                      </Link>
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