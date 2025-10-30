import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Sample product data - in a real app this would come from an API or context
  const [product] = useState({
    id: parseInt(id) || 1,
    name: 'Garden Rose Plant',
    price: 25.99,
    originalPrice: 35.99,
    image: 'https://via.placeholder.com/400x400/4CAF50/ffffff?text=Rose+Plant',
    images: [
      'https://via.placeholder.com/400x400/4CAF50/ffffff?text=Rose+Plant',
      'https://via.placeholder.com/400x400/2196F3/ffffff?text=Plant+View+2',
      'https://via.placeholder.com/400x400/FF9800/ffffff?text=Plant+View+3'
    ],
    category: 'plants',
    rating: 4.5,
    reviews: 28,
    inStock: true,
    stockCount: 15,
    description: 'Beautiful garden rose plant perfect for your garden. This premium rose variety produces stunning blooms throughout the season and is easy to care for. Ideal for borders, containers, or as a specimen plant.',
    features: [
      'Premium rose variety with stunning blooms',
      'Easy to care for and maintain',
      'Perfect for borders and containers',
      'Disease resistant',
      'Long blooming season'
    ],
    specifications: {
      'Plant Height': '2-3 feet',
      'Bloom Time': 'Spring to Fall',
      'Sun Requirements': 'Full Sun',
      'Water Needs': 'Moderate',
      'USDA Hardiness Zone': '5-9'
    }
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const productForCart = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      description: product.description,
    };
    addToCart(productForCart, quantity);
  };

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>{product.name}</h2>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li className="active" aria-current="page">{product.name}</li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="product-details padding-block bg-white">
          <div className="container">
            <div className="row g-4">
              {/* Product Images */}
              <div className="col-lg-6">
                <div className="product-gallery">
                  <div className="main-image">
                    <img src={product.images[selectedImage]} alt={product.name} />
                  </div>
                  <div className="image-thumbnails">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="col-lg-6">
                <div className="product-info">
                  <div className="product-category">
                    Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </div>

                  <h1 className="product-title">{product.name}</h1>

                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="product-price">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="discount">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="stock-status">
                    <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? `✓ In Stock (${product.stockCount} available)` : '✗ Out of Stock'}
                    </span>
                  </div>

                  <div className="product-description">
                    <p>{product.description}</p>
                  </div>

                  {product.inStock && (
                    <div className="quantity-add">
                      <div className="quantity-controls">
                        <label>Quantity:</label>
                        <div className="quantity-input">
                          <button
                            onClick={() => updateQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                            min="1"
                            max={product.stockCount}
                          />
                          <button
                            onClick={() => updateQuantity(quantity + 1)}
                            disabled={quantity >= product.stockCount}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="add-to-cart-btn"
                      >
                        Add to Cart - ${(product.price * quantity).toFixed(2)}
                      </button>
                    </div>
                  )}

                  <div className="product-actions">
                    <button className="wishlist-btn">
                      <i className="fa-solid fa-heart"></i> Add to Wishlist
                    </button>
                    <button className="compare-btn">
                      <i className="fa-solid fa-balance-scale"></i> Compare
                    </button>
                  </div>

                  <div className="product-meta">
                    <div className="meta-item">
                      <span>SKU:</span>
                      <span>GP-{product.id.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="meta-item">
                      <span>Share:</span>
                      <div className="social-links">
                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i className="fa-brands fa-twitter"></i></a>
                        <a href="#"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#"><i className="fa-brands fa-pinterest"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="row">
              <div className="col-12">
                <div className="product-tabs">
                  <div className="tab-buttons">
                    <button
                      className={`tab-btn ${selectedTab === 'description' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('description')}
                    >
                      Description
                    </button>
                    <button
                      className={`tab-btn ${selectedTab === 'features' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('features')}
                    >
                      Features
                    </button>
                    <button
                      className={`tab-btn ${selectedTab === 'specifications' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('specifications')}
                    >
                      Specifications
                    </button>
                    <button
                      className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('reviews')}
                    >
                      Reviews ({product.reviews})
                    </button>
                  </div>

                  <div className="tab-content">
                    {selectedTab === 'description' && (
                      <div className="tab-pane">
                        <p>{product.description}</p>
                        <p>This premium garden rose plant is carefully selected for its exceptional beauty, fragrance, and disease resistance. Perfect for both beginner and experienced gardeners, this rose variety will bring elegance and color to your garden space.</p>
                      </div>
                    )}

                    {selectedTab === 'features' && (
                      <div className="tab-pane">
                        <ul className="features-list">
                          {product.features.map((feature, index) => (
                            <li key={index}>
                              <i className="fa-solid fa-check"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedTab === 'specifications' && (
                      <div className="tab-pane">
                        <div className="specifications-table">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="spec-item">
                              <span className="spec-label">{key}:</span>
                              <span className="spec-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTab === 'reviews' && (
                      <div className="tab-pane">
                        <div className="reviews-section">
                          <div className="review-summary">
                            <div className="overall-rating">
                              <span className="rating-number">{product.rating}</span>
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`fa-solid fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                                  ></i>
                                ))}
                              </div>
                              <span className="review-count">Based on {product.reviews} reviews</span>
                            </div>
                          </div>

                          <div className="write-review">
                            <h5>Write a Review</h5>
                            <form className="review-form">
                              <div className="rating-input">
                                <label>Your Rating:</label>
                                <div className="star-rating">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className="fa-regular fa-star"></i>
                                  ))}
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Your Review:</label>
                                <textarea rows="4" placeholder="Share your thoughts about this product..."></textarea>
                              </div>
                              <button type="submit" className="submit-review-btn">
                                Submit Review
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="related-products padding-block bg-white">
          <div className="container">
            <div className="section__header text-center">
              <span>Related Products</span>
              <h3>You Might Also Like</h3>
            </div>

            <div className="row g-4">
              {/* Sample related products */}
              {[2, 3, 4].map((id) => (
                <div key={id} className="col-md-6 col-lg-3">
                  <div className="product-card">
                    <div className="product-image">
                      <img src={`https://via.placeholder.com/250x250/${id === 2 ? '2196F3' : id === 3 ? 'FF9800' : '9C27B0'}/ffffff?text=Product+${id}`} alt={`Product ${id}`} />
                    </div>
                    <div className="product-info">
                      <h5 className="product-title">
                        <Link to={`/product-details/${id}`}>Related Product {id}</Link>
                      </h5>
                      <div className="product-price">
                        <span className="current-price">${(Math.random() * 50 + 10).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;
