import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/style.css'; // Import original CSS

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Sample product data matching original
  const product = {
    id: 1,
    name: 'Gardening Gloves',
    price: 290.99,
    rating: 4.5,
    reviews: 3,
    images: [
      '/assets/img/product-details/img1.jpg',
      '/assets/img/product-details/img2.jpg',
      '/assets/img/product-details/img3.jpg',
      '/assets/img/product-details/img4.jpg',
      '/assets/img/product-details/img3.jpg'
    ],
    smallImages: [
      '/assets/img/product-details/small/img1.jpg',
      '/assets/img/product-details/small/img2.jpg',
      '/assets/img/product-details/small/img3.jpg',
      '/assets/img/product-details/small/img4.jpg',
      '/assets/img/product-details/small/img5.jpg'
    ],
    description: 'Rorem psum dolor sit amet, consectetuer anadipiscing ani elit sed diam nonummy nibh euismod tincidunt are and thlaoreet dolore magna aliquam erat are avolutpat. Claritas etiam qui sequitur mutationem consuetudium the awesome prodect lectorum.',
    features: [
      'Digital project planning and resourcing',
      'In-House digital consulting',
      'Permanent and contract recruitement',
      'In-House digital consulting'
    ]
  };

  const updateQuantity = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Our Shop Details</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">shop</Link></li>
                  <li className="active" aria-current="page">Shop Details</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <div className="shopdetails overflow-hidden bg-white">
          <div className="container">
            <div className="section__wrapper shopdetails__wrapper">
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="shopdetails__leftinner">
                    <div className="productsdetails2 overflow-hidden">
                      <div className="swiper-wrapper">
                        {product.images.map((image, index) => (
                          <div key={index} className="swiper-slide">
                            <div className="shopdetails__innerthumb">
                              <img src={image} alt="bakul" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="productsdetails1 overflow-hidden">
                      <div className="swiper-wrapper">
                        {product.smallImages.map((image, index) => (
                          <div key={index} className="swiper-slide">
                            <div className="shopdetails__smallthumb">
                              <img src={image} alt="img" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="shopdetails__content">
                    <h5>{product.name}</h5>
                    <h6>Price:<span> ${product.price}</span></h6>
                    <div className="rating">
                      <p>Rating:</p>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          <i className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : (i === Math.floor(product.rating) && product.rating % 1 !== 0 ? 'fa-star-half-stroke' : '')}`}></i>
                        </span>
                      ))}
                      <a href="#reviews"> ({product.reviews} customer reviews)</a>
                    </div>
                    <p>{product.description}</p>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}><i className="fa-sharp fa-solid fa-square-check"></i> {feature}</li>
                      ))}
                    </ul>
                    <div className="countadd">
                      <div className="cart-plus-minus">
                        <div className="dec qtybutton" onClick={() => updateQuantity(-1)}>-</div>
                        <input className="cart-plus-minus-box" type="text" value={quantity} readOnly />
                        <div className="inc qtybutton" onClick={() => updateQuantity(1)}>+</div>
                      </div>
                      <form>
                        <input type="text" placeholder="Discount Code" />
                      </form>
                      <Link to="/cart" className="custom-btn">Add to Cart</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <section className="cartdesk overflow-hidden bg-white">
          <div className="container">
            <div className="cartdesk__innerborder">
              <div className="cartdesk__header">
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button 
                      className={`nav-link ${activeTab === 'description' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('description')}
                    >
                      description
                    </button>
                    <button 
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('reviews')}
                    >
                      reviews
                    </button>
                  </div>
                </nav>
              </div>
              <div className="tab-content p-4" id="nav-tabContent">
                {activeTab === 'description' && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="cartdesk__item">
                      <div className="description">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <div className="row g-4 my-2 align-items-center">
                          <div className="col-lg-5 col-12">
                            <div className="cartdesk__content">
                              <ul>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Donec non est at libero vulputate rutrum.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Morbi ornare lectus quis justo gravida semper.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Pellentesque aliquet, sem eget laoreet ultrices.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Nulla tellus mi, vulputate adipiscing cursus nulla.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Donec a neque libero.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Pellentesque aliquet, sem eget laoreet ultrices.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Morbi ornare lectus quis justo gravida semper.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>ornare lectus quis justo gravida semper.</li>
                                <li><i className="fa-sharp fa-solid fa-square-check"></i>Nulla tellus mi, vulputate adipiscing suscipit.</li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-3 col-12">
                            <div className="description__thumb">
                              <img src="assets/img/product-details/img1.jpg" alt="bakul" />
                            </div>
                          </div>
                          <div className="col-lg-3 col-12">
                            <div className="description__thumb">
                              <img src="assets/img/product-details/img4.jpg" alt="bakul" />
                            </div>
                          </div>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="cartdesk__itemheading">
                      <h5>03 Customer Reviews</h5>
                    </div>
                    <div className="cartdesk__item mt-4">
                      <div className="row g-2 align-items-center">
                        <div className="col-xl-1">
                          <div className="cartdesk__img">
                            <img src="/assets/img/product-details/reviewimg/img1.png" alt="bakul" />
                          </div>
                        </div>
                        <div className="col-xl-11">
                          <div className="cartdesk__text">
                            <div className="nametext">
                              <div className="profile">
                                <h6>Maria Watson</h6>
                                <span>24 Jan 2024 , at 02:00 pm</span>
                              </div>
                              <div className="allstar">
                                <div className="star">
                                  <i className="fa-solid fa-star"></i>
                                  <i className="fa-solid fa-star"></i>
                                  <i className="fa-solid fa-star"></i>
                                  <i className="fa-solid fa-star"></i>
                                  <i className="fa-regular fa-star-half-stroke"></i>
                                </div>
                              </div>
                            </div>
                            <div className="destext">
                              <p>Sedut perspiciatis unde omnis iste natus error sitilei voluptatem accusantium doloremque laudantium totam rem aperiam eaque</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Additional reviews would go here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;
