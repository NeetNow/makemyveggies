import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/auth.css';

const Header = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
                    </ul>
                  </div>
                </div>

                <div className="header__cart">
                  <div className="carticon">
                    <a href="#" onClick={() => setIsCartOpen(!isCartOpen)}>
                      <i className="fa-light fa-basket-shopping"></i>
                    </a>
                  </div>
                  <div className={`cart-details ${isCartOpen ? 'show' : ''}`}>
                    <div className="close d-sm-none d-block" onClick={() => setIsCartOpen(false)}>
                      <i className="fa-sharp fa-solid fa-square-xmark"></i>
                    </div>
                    <div className="item">
                      <div className="thumb">
                        <img src="/assets/img/cart/img1.jpg" alt="img" />
                      </div>
                      <div className="right">
                        <div className="text">
                          <h6><a href="#">Product title here</a></h6>
                          <p>$20.00</p>
                          <span>In Stock</span>
                        </div>
                        <div className="cros">
                          <i className="fa-sharp fa-solid fa-square-xmark"></i>
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="thumb">
                        <img src="/assets/img/cart/img2.png" alt="img" />
                      </div>
                      <div className="right">
                        <div className="text">
                          <h6><a href="#">Product title here</a></h6>
                          <p>$20.00</p>
                          <span>In Stock</span>
                        </div>
                        <div className="cros">
                          <i className="fa-sharp fa-solid fa-square-xmark"></i>
                        </div>
                      </div>
                    </div>
                    <div className="total">
                      <div className="subtotal">
                        <p>Subtotal :<span> $40.00</span></p>
                      </div>
                      <div className="checkout">
                        <a href="#">Checkout</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="header__bottombtn d-xl-block d-none">
                  {currentUser ? (
                    <Link to="/profile" className="custom-btn">Profile</Link>
                  ) : (
                    <div className="auth-buttons">
                      <Link to="/login" className="custom-btn login-btn">Login/Register</Link>
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
