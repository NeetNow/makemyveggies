import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, getCartTotal, getCartItemCount, removeFromCart } = useCart();

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
                    <p>+041-982-3648</p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fa-sharp fa-regular fa-envelope-open"></i>
                  </div>
                  <div className="text">
                    <p>+info@gmail.com</p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="fa-sharp fa-solid fa-location-dot"></i>
                  </div>
                  <div className="text">
                    <p>22 Vokte Street Building Melborn City</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="right">
              <ul>
                <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                <li><a href="#"><i className="fa-sharp fa-regular fa-basketball"></i></a></li>
                <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom */}
      <div className="header__bottom bg-white">
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
                      <li>
                        <Link to="/">Home</Link>
                        <ul>
                          <li><Link to="/" className="active">home-1</Link></li>
                          <li><Link to="/">home-2</Link></li>
                          <li><Link to="/">home-3</Link> </li>
                        </ul>
                      </li>
                      <li><Link to="/about">About</Link></li>
                      <li>
                        <a href="#0">Pages</a>
                        <ul>
                          <li>
                            <a href="#0">portfolio</a>
                            <ul>
                              <li><Link to="/project">Portfolio</Link></li>
                              <li><Link to="/project-mas">Portfolio Masonary</Link></li>
                              <li><Link to="/project-details">Project Details</Link></li>
                            </ul>
                          </li>
                          <li>
                            <a href="#0">Service</a>
                            <ul>
                              <li><Link to="/service">Service</Link></li>
                              <li><Link to="/service-details">Service Single</Link></li>
                            </ul>
                          </li>
                          <li>
                            <a href="#0">Team</a>
                            <ul>
                              <li><Link to="/team">Team</Link></li>
                              <li><Link to="/team-single">Team Single</Link></li>
                            </ul>
                          </li>
                          <li><Link to="/history">history</Link></li>
                          <li><Link to="/faq">FAQ</Link></li>
                          <li><Link to="/404">404</Link></li>
                        </ul>
                      </li>
                      <li>
                        <a href="#0">shop</a>
                        <ul>
                          <li><Link to="/cart">Cart</Link></li>
                          <li><Link to="/shop">Shop</Link></li>
                          <li><Link to="/product-details">Product Details</Link></li>
                        </ul>
                      </li>
                      <li>
                        <a href="#0">Blog</a>
                        <ul>
                          <li><Link to="/blog">Blog</Link></li>
                          <li><Link to="/blog-single">Blog Single</Link></li>
                        </ul>
                      </li>
                      <li><Link to="/contact">Contact</Link></li>
                      <li><Link to="/login">Login</Link></li>
                      <li><Link to="/register">Register</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="header__cart">
                  <div className="carticon" style={{ position: 'relative' }}>
                    <Link to="/cart" onClick={() => setIsCartOpen(!isCartOpen)}>
                      <i className="fa-light fa-basket-shopping"></i>
                      {getCartItemCount() > 0 && (
                        <span 
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#73B611',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {getCartItemCount()}
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className={`cart-details ${isCartOpen ? 'show' : ''}`}>
                    <div className="close d-sm-none d-block" onClick={() => setIsCartOpen(false)}>
                      <i className="fa-sharp fa-solid fa-square-xmark"></i>
                    </div>
                    
                    {cartItems.length === 0 ? (
                      <div className="text-center p-3">
                        <p>Your cart is empty</p>
                        <Link to="/shop" className="custom-btn" onClick={() => setIsCartOpen(false)}>
                          Shop Now
                        </Link>
                      </div>
                    ) : (
                      <>
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="item">
                            <div className="thumb">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="right">
                              <div className="text">
                                <h6><Link to={`/product-details/${item.id}`}>{item.name}</Link></h6>
                                <p>${item.price?.toFixed(2)} x {item.quantity}</p>
                                <span>In Stock</span>
                              </div>
                              <div className="cros" onClick={() => removeFromCart(item.id)}>
                                <i className="fa-sharp fa-solid fa-square-xmark"></i>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {cartItems.length > 3 && (
                          <div className="text-center p-2">
                            <small>and {cartItems.length - 3} more items...</small>
                          </div>
                        )}
                        
                        <div className="total">
                          <div className="subtotal">
                            <p>Subtotal: <span>${getCartTotal().toFixed(2)}</span></p>
                          </div>
                          <div className="checkout">
                            <Link to="/cart" onClick={() => setIsCartOpen(false)}>View Cart</Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="header__bottombtn d-xl-block d-none">
                  <a href="contact.html" className="custom-btn">Explore Garden</a>
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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/service">Services</Link></li>
                <li><Link to="/project">Projects</Link></li>
                <li><Link to="/team">Team</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
