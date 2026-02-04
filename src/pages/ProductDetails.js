import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart: cartAddToCart } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://dev.makemyveggies.com/';

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const dummyDescription =
    'This premium plant product is carefully selected for quality, freshness, and performance. It is suitable for home gardens and professional use, delivering consistent results with proper care.';

  const dummyDescriptionExtra =
    'Perfect for both beginners and experienced gardeners, this product supports healthy growth and helps you maintain a vibrant, beautiful garden space.';

  const dummyFeatures = [
    'Premium quality and carefully packed',
    'Suitable for all seasons',
    'Easy to use and maintain',
    'Safe and reliable for home gardening',
    'Fast delivery and secure packaging'
  ];

  const dummySpecifications = {
    'Stock Available': 'N/A',
    'SKU': 'N/A',
    'Category': 'N/A'
  };

  const dummyNoReviewsText =
    'No reviews yet. Be the first to review this product and help other customers make the right choice.';

  const resolveImageUrl = (url) => {
    if (!url) {
      return 'https://via.placeholder.com/400x400/eeeeee/888888?text=Product';
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const prefix = url.startsWith('/') ? '' : '/';
    return `${API_BASE_URL}${prefix}${url}`;
  };

  const renderRatingStars = (value) => {
    const v = Number(value);
    const rating = Number.isFinite(v) ? v : 0;

    return [...Array(5)].map((_, i) => {
      const idx = i + 1;
      const filled = rating >= idx;
      const half = !filled && rating >= idx - 0.5;

      if (filled) {
        return <i key={idx} className="fa-solid fa-star filled"></i>;
      }

      if (half) {
        return <i key={idx} className="fa-solid fa-star-half-alt filled"></i>;
      }

      return <i key={idx} className="fa-regular fa-star"></i>;
    });
  };

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/backend/api/get_product.php?id=${id}`, {
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

        // Map API response to component state (use backend discount/originalPrice)
        const safePrice = Number(data.product.price);
        const safeOriginalPrice = Number(data.product.originalPrice);
        const price = Number.isFinite(safePrice) ? safePrice : 0;
        const originalPrice = Number.isFinite(safeOriginalPrice) ? safeOriginalPrice : price;
        const ratingNum = Number(data.product.rating);
        const rating = Number.isFinite(ratingNum) ? ratingNum : 0;
        const reviewsNum = Number(data.product.reviews);
        const reviews = Number.isFinite(reviewsNum) ? reviewsNum : 0;

        const apiPrimaryImage = resolveImageUrl(data.product.primaryImage);
        const apiImagesRaw = Array.isArray(data.product.images) ? data.product.images : [];
        const apiImagesResolved = apiImagesRaw.map(resolveImageUrl).filter(Boolean);
        const images = apiImagesResolved.length > 0 ? apiImagesResolved : [apiPrimaryImage];

        const features = data.product.keyFeatures
          ? data.product.keyFeatures
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean)
          : [];

        const reviewsList = Array.isArray(data.product.reviewsList) ? data.product.reviewsList : [];
        const ratingBreakdown = data.product.ratingBreakdown || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

        const productData = {
          id: data.product.id,
          name: data.product.title,
          price,
          originalPrice,
          image: apiPrimaryImage,
          images,
          category: (data.product.categoryName || 'others').toString(),
          rating,
          reviews,
          reviewsList,
          ratingBreakdown,
          inStock: !!data.product.inStock,
          stockCount: Number.isFinite(Number(data.product.stock)) ? Number(data.product.stock) : 0,
          description: data.product.description || dummyDescription,
          features,
          specifications: {
            'Stock Available': data.product.stock,
            'SKU': data.product.sku,
            'Category': data.product.categoryName
          }
        };

        setProduct(productData);
        setSelectedImage(0);
        setReviewRating(0);
        setReviewComment('');
        setReviewError(null);
        setReviewSuccess(null);
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

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) {
        setRelatedProducts([]);
        return;
      }

      try {
        const category = product.category.toString().toLowerCase();
        const res = await fetch(
          `${API_BASE_URL}/backend/api/get_products.php?category=${encodeURIComponent(category)}&limit=8&offset=0`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          setRelatedProducts([]);
          return;
        }

        const data = await res.json();
        if (data.status !== 'success' || !Array.isArray(data.products)) {
          setRelatedProducts([]);
          return;
        }

        const mapped = data.products
          .map((p) => ({
            id: p.id,
            name: p.title || p.name || 'Unnamed product',
            price: Number(p.price) || 0,
            image: resolveImageUrl(p.primaryImage),
          }))
          .filter((p) => p.id !== product.id)
          .slice(0, 4);

        setRelatedProducts(mapped);
      } catch {
        setRelatedProducts([]);
      }
    };

    fetchRelated();
  }, [product?.category, product?.id]);

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
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    if (!product) {
      return;
    }

    if (!currentUser) {
      setReviewError('Please login to submit a review.');
      return;
    }

    if (!reviewRating) {
      setReviewError('Please select a rating.');
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/backend/api/submit_review.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        setReviewError(data.message || 'Failed to submit review.');
        return;
      }

      setReviewSuccess('Review submitted successfully.');
      setReviewRating(0);
      setReviewComment('');

      const refresh = await fetch(`${API_BASE_URL}/backend/api/get_product.php?id=${product.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refresh.ok) {
        const refreshed = await refresh.json();
        if (refreshed.status === 'success') {
          const safePrice = Number(refreshed.product.price);
          const safeOriginalPrice = Number(refreshed.product.originalPrice);
          const price = Number.isFinite(safePrice) ? safePrice : 0;
          const originalPrice = Number.isFinite(safeOriginalPrice) ? safeOriginalPrice : price;
          const ratingNum = Number(refreshed.product.rating);
          const rating = Number.isFinite(ratingNum) ? ratingNum : 0;
          const reviewsNum = Number(refreshed.product.reviews);
          const reviews = Number.isFinite(reviewsNum) ? reviewsNum : 0;

          const apiPrimaryImage = resolveImageUrl(refreshed.product.primaryImage);
          const apiImagesRaw = Array.isArray(refreshed.product.images) ? refreshed.product.images : [];
          const apiImagesResolved = apiImagesRaw.map(resolveImageUrl).filter(Boolean);
          const images = apiImagesResolved.length > 0 ? apiImagesResolved : [apiPrimaryImage];

          const features = refreshed.product.keyFeatures
            ? refreshed.product.keyFeatures
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean)
            : [];

          const reviewsList = Array.isArray(refreshed.product.reviewsList) ? refreshed.product.reviewsList : [];
          const ratingBreakdown = refreshed.product.ratingBreakdown || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

          setProduct({
            id: refreshed.product.id,
            name: refreshed.product.title,
            price,
            originalPrice,
            image: apiPrimaryImage,
            images,
            category: (refreshed.product.categoryName || 'others').toString(),
            rating,
            reviews,
            reviewsList,
            ratingBreakdown,
            inStock: !!refreshed.product.inStock,
            stockCount: Number.isFinite(Number(refreshed.product.stock)) ? Number(refreshed.product.stock) : 0,
            description: refreshed.product.description || dummyDescription,
            features,
            specifications: {
              'Stock Available': refreshed.product.stock,
              'SKU': refreshed.product.sku,
              'Category': refreshed.product.categoryName,
            },
          });
        }
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
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

  const specificationsToRender =
    product.specifications && Object.keys(product.specifications).length > 0
      ? product.specifications
      : dummySpecifications;

  return (
    <div className="product-details-page">
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>{product.name}</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li className="active" aria-current="page">{product.name}</li>
                </ol>
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
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/400x400/eeeeee/888888?text=Product';
                      }}
                    />
                  </div>
                  <div className="image-thumbnails">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/120x120/eeeeee/888888?text=Img';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="col-lg-6">
                <div className="product-info product-info-panel">
                  <div className="product-category">
                    Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </div>

                  <h1 className="product-title">{product.name}</h1>

                  <div className="product-rating">
                    <div className="stars">
                      {renderRatingStars(product.rating)}
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
                    <p>{product.description || dummyDescription}</p>
                  </div>

                  <div className="product-highlights">
                    {(product.features && product.features.length > 0 ? product.features.slice(0, 3) : ['Quality Assured', 'Fresh & Safe', 'Fast Delivery']).map(
                      (item, idx) => (
                        <div key={idx} className="highlight-item">
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{item}</span>
                        </div>
                      )
                    )}
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
                            max={product.stockCount || 1}
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
                        <p>{product.description || dummyDescription}</p>
                        <p>{dummyDescriptionExtra}</p>
                      </div>
                    )}

                    {selectedTab === 'features' && (
                      <div className="tab-pane">
                        {(product.features.length > 0 ? product.features : dummyFeatures).length > 0 ? (
                          <ul className="features-list">
                            {(product.features.length > 0 ? product.features : dummyFeatures).map((feature, index) => (
                              <li key={index}>
                                <i className="fa-solid fa-check"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No features available.</p>
                        )}
                      </div>
                    )}

                    {selectedTab === 'specifications' && (
                      <div className="tab-pane">
                        <div className="specifications-table">
                          {Object.entries(specificationsToRender).map(([key, value]) => (
                            <div key={key} className="spec-item">
                              <span className="spec-label">{key}:</span>
                              <span className="spec-value">{value || 'N/A'}</span>
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
                              <div className="stars">{renderRatingStars(product.rating)}</div>
                              <span className="review-count">
                                Based on {product.reviews} {product.reviews === 1 ? 'review' : 'reviews'}
                              </span>
                            </div>

                            <div className="rating-bars">
                              {[5, 4, 3, 2, 1].map((star) => {
                                const breakdown = product.ratingBreakdown || {};
                                const count = Number(breakdown[String(star)] || 0);
                                const total = Number(product.reviews || 0) || 0;
                                const pct = total > 0 ? (count / total) * 100 : 0;

                                return (
                                  <div key={star} className="bar-row">
                                    <span className="bar-label">{star} Star</span>
                                    <div className="bar-track">
                                      <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                                    </div>
                                    <span className="bar-count">{count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="write-review">
                            <h5>Write a Review</h5>
                            <form className="review-form" onSubmit={submitReview}>
                              <div className="rating-input">
                                <label>Your Rating:</label>
                                <div className="star-rating" role="radiogroup" aria-label="Select rating">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      className={`star-btn ${reviewRating >= star ? 'active' : ''}`}
                                      onClick={() => setReviewRating(star)}
                                      aria-label={`${star} star`}
                                    >
                                      <i className={`${reviewRating >= star ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Your Review:</label>
                                <textarea
                                  rows="4"
                                  placeholder="Share your thoughts about this product..."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                ></textarea>
                              </div>

                              {reviewError && <div className="review-msg error">{reviewError}</div>}
                              {reviewSuccess && <div className="review-msg success">{reviewSuccess}</div>}

                              <button
                                type="submit"
                                className="submit-review-btn"
                                disabled={reviewSubmitting}
                              >
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                              </button>
                            </form>
                          </div>

                          <div className="reviews-list">
                            {product.reviewsList && product.reviewsList.length > 0 ? (
                              product.reviewsList.map((r, idx) => (
                                <div key={idx} className="review-card">
                                  <div className="review-top">
                                    <div className="review-user">{r.userName || 'Customer'}</div>
                                    <div className="review-stars">{renderRatingStars(r.rating)}</div>
                                  </div>
                                  {r.comment && <div className="review-comment">{r.comment}</div>}
                                  {r.createdAt && <div className="review-date">{new Date(r.createdAt).toLocaleDateString()}</div>}
                                </div>
                              ))
                            ) : (
                              <p>{dummyNoReviewsText}</p>
                            )}
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
              {relatedProducts.length > 0 ? (
                relatedProducts.map((p) => (
                  <div key={p.id} className="col-md-6 col-lg-3">
                    <div className="product-card">
                      <div className="product-image">
                        <img
                          src={p.image}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/250x250/eeeeee/888888?text=Product';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h5 className="product-title">
                          <Link to={`/product-details/${p.id}`}>{p.name}</Link>
                        </h5>
                        <div className="product-price">
                          <span className="current-price">${Number(p.price || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p style={{ textAlign: 'center', margin: 0 }}>No related products found.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;