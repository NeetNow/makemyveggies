import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart: cartAddToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/backend/api/get_product.php?id=${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to fetch product');
        }

        // Map API response to component state
        const productData = {
          id: data.product.id,
          name: data.product.title,
          price: data.product.price,
          originalPrice: data.product.price * 1.2, // Calculate original price
          image: data.product.primaryImage || 'https://via.placeholder.com/400x400/4CAF50/ffffff?text=Product',
          images: [
            data.product.primaryImage || 'https://via.placeholder.com/400x400/4CAF50/ffffff?text=Product',
            'https://via.placeholder.com/400x400/2196F3/ffffff?text=Product+View+2',
            'https://via.placeholder.com/400x400/FF9800/ffffff?text=Product+View+3'
          ],
          category: data.product.categoryName || 'others',
          rating: data.product.rating,
          reviews: data.product.reviews,
          inStock: data.product.inStock,
          stockCount: data.product.stock,
          description: data.product.description,
          features: data.product.keyFeatures ? data.product.keyFeatures.split(',') : [],
          specifications: {
            'Stock Available': data.product.stock,
            'SKU': data.product.sku,
            'Category': data.product.categoryName
          }
        };

        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('❌ Product fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockCount || 1)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
    if (product) {
      await cartAddToCart({
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }, quantity);
      alert(`Added ${quantity} x ${product.name} to cart!`);
    }
  };

  if (loading) {
    return (
      <>
        <main>
          <div className="container padding-block">
            <div className="row">
              <div className="col-12">
                <p>Loading product details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <main>
          <div className="container padding-block">
            <div className="row">
              <div className="col-12">
                <p>Error loading product: {error}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <main>
          <div className="container padding-block">
            <div className="row">
              <div className="col-12">
                <p>Product not found</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main>
        {/* Page Header */}
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li>{product.name}</li>
                  </ul>
                  <h2>{product.name}</h2>
                </div>
              </div>
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
                      {product.rating > 0 ? `${product.rating} (${product.reviews} reviews)` : 'No ratings yet'}
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
                        onClick={addToCart}
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
                        <button type="button"><i className="fa-brands fa-facebook-f"></i></button>
                        <button type="button"><i className="fa-brands fa-twitter"></i></button>
                        <button type="button"><i className="fa-brands fa-instagram"></i></button>
                        <button type="button"><i className="fa-brands fa-pinterest"></i></button>
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
                              <span className="review-count">Based on {product.reviews} {product.reviews === 1 ? 'review' : 'reviews'}</span>
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
                              <button
                                type="submit"
                                className="submit-review-btn"
                                disabled={!product || product.rating === 0}
                              >
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
