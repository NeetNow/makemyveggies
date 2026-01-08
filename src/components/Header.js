import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../assets/css/auth.css';
import { ShoppingCart } from "lucide-react";


const Header = () => {
  const { currentUser } = useAuth();
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems || [];
  const loading = cartContext?.loading || false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate total cart items
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const hasItems = !loading && totalCartItems > 0;

  return (
    <div className="header">
      {/* Header Top */}
      <div className="header__top d-xl-block bg-white">
        <div className="container-xl container-fluid">
          <div className="header__topcontent">
            <div className="left">
              <ul>
                <li>
                  <div className="icon">
                    <i className="fa-solid fa-square-phone"></i>
                  </div>
                  <div className="text">
                    <p>77980-40848</p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fa-sharp fa-regular fa-envelope-open"></i>
                  </div>
                  <div className="text">
                    <p>sales@makemyveggies.com</p>
                  </div>
                </li>
                
              </ul>
            </div>
            <div className="right">
              <ul>
                <li><a href="https://www.facebook.com/makemyveggies/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                <li><button type="button"><i className="fa-brands fa-pinterest"></i></button></li>
                <li><a href="https://www.linkedin.com/company/makemyveggies/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
                <li><button type="button"><i className="fa-brands fa-instagram"></i></button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom */}
      <div className="header__bottom bg-white p-0">
        <div className="container-xl container-fluid">
          <div className="row align-items-center">
            <div className="col-6 col-xl-2">
              <div className="left">
                <div className="header__logo">
                  <Link to="/"><img src="/assets/img/logo/logo.png" alt="logo" /></Link>
                </div>
              </div>
            </div>
            <div className="col-6 col-xl-10">
              <div className="right">
                <div className="header__nav target">
                  <div className="mobilelogo d-xl-none d-block">
                    <Link to="/"><img src="/assets/img/logo/whiteloog.png" alt="logo" /></Link>
                  </div>
                  <div className="mainactive activescroll">
                    <ul>
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">About</Link></li>
                      <li><Link to="/shop">DIY Kits</Link></li>
                      <li><Link to="/shop">Suppliments</Link></li>
                      <li><Link to="/Blog">Blog</Link></li>
                      <li><Link to="/contact">Contact</Link></li>
                    </ul>
                  </div>
                </div>

                <div
                  className="header__cart"
                  onMouseEnter={() => {
                    if (hasItems) {
                      setIsCartOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasItems) {
                      setIsCartOpen(false);
                    }
                  }}
                >
                  <div className="carticon">
                    <Link to="/cart">
                      <button
                        type="button"
                      >
                        <ShoppingCart size={24} strokeWidth={1.5} />

                        {hasItems && (
                          <span className="cart-count">{totalCartItems}</span>
                        )}
                      </button>
                    </Link>
                  </div>

                  {(loading || hasItems) && (
                    <div className={`cart-details ${isCartOpen ? 'show' : ''}`}>
                      <div className="close d-sm-none d-block" onClick={() => setIsCartOpen(false)}>
                        <i className="fa-sharp fa-solid fa-square-xmark"></i>
                      </div>
                    
                      {loading ? (
                        <div className="cart-loading">Loading cart...</div>
                      ) : cartItems.length === 0 ? (
                        <div className="cart-empty">Your cart is empty</div>
                      ) : (
                        <>
                          {cartItems.map((item) => (
                            <div className="item" key={item.cart_id}>
                              <div className="thumb">
                                <img src={item.image} alt={item.name} />
                              </div>
                              <div className="right">
                                <div className="text">
                                  <h6><Link to={`/product-details/${item.product_id}`}>{item.name}</Link></h6>
                                  <p>${item.price.toFixed(2)}</p>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="total">
                            <div className="subtotal">
                              <p>Subtotal :<span> ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span></p>
                            </div>
                            <div className="checkout">
                              <Link to="/checkout">Checkout</Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="header__bottombtn d-xl-block d-none">
                  {currentUser ? (
                    <Link to="/profile" className="custom-btn">Profile</Link>
                  ) : (
                    <div className="auth-buttons">
                      <Link to="/login" className="custom-btn login-btn">Login</Link>
                    </div>
                  )}
                </div>

                <div className="ellepsis d-xl-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <i className="fa-solid fa-circle-info"></i>
                </div>

                <div className="bar d-xl-none d-block" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <i className="fa-solid fa-bars"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img src="/assets/img/logo/whiteloog.png" alt="logo" />
              <button onClick={() => setIsMenuOpen(false)}>
                <i className="fa-sharp fa-solid fa-square-xmark"></i>
              </button>
            </div>
            <nav className="mobile-nav">
              <ul>
                <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                <li><Link to="/service" onClick={() => setIsMenuOpen(false)}>Services</Link></li>
                <li><Link to="/project" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
                <li><Link to="/team" onClick={() => setIsMenuOpen(false)}>Team</Link></li>
                <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
                <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                <li><Link to="/checkout" onClick={() => setIsMenuOpen(false)}>Checkout</Link></li>
                {currentUser ? (
                  <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                ) : (
                  <>
                    <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                    <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;