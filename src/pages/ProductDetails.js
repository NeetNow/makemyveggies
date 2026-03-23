import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart: cartAddToCart } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('overview');

  const [reviewRating, setReviewRating] = useState(0);
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

  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  };

  const shareProduct = async () => {
    const url = window.location.href;
    const title = product?.name ? String(product.name) : 'Product';
    const text = `Check out ${title} on Make My Veggies`;

    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share({
          title,
          text,
          url
        });
        toast.success('Shared successfully!');
        return;
      }
    } catch (e) {
      if (e?.name === 'AbortError') return;
      toast.error('Share cancelled or failed.');
    }

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
      }
    } catch (err) {
      // clipboard API failed (e.g. not in secure context)
    }

    if (copyToClipboard(url)) {
      toast.success('Link copied to clipboard!');
    } else {
      // Last fallback: show a prompt so desktop users clearly see the URL
      // (useful when toasts are not visible or clipboard APIs are blocked)
      window.prompt('Copy this product link:', url);
    }
  };

  const resolveImageUrl = (url) => {
    if (!url) {
      return 'https://via.placeholder.com/400x400/eeeeee/888888?text=Product';
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const prefix = url.startsWith('/') ? '' : '/';
    return `${process.env.PUBLIC_URL || ''}${prefix}${url}`;
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

        // Map API response to component state (use backend discount/originalPrice)
        const safeOriginalPrice = Number(data.product.originalPrice);
        const originalPrice = Number.isFinite(safeOriginalPrice) ? safeOriginalPrice : 0;
        
        // Get discount percentage from backend
        const discountPercent = Number(data.product.discount) || 0;
        
        // Calculate price: if discount exists, deduct percentage from original price
        let price = originalPrice;
        if (discountPercent > 0 && originalPrice > 0) {
          price = originalPrice - (originalPrice * discountPercent / 100);
        }
        
        const ratingNum = Number(data.product.rating);
        const rating = Number.isFinite(ratingNum) ? ratingNum : 0;
        const reviewsNum = Number(data.product.reviews);
        const reviews = Number.isFinite(reviewsNum) ? reviewsNum : 0;

        const apiPrimaryImage = resolveImageUrl(data.product.primaryImage);
        const apiImagesRaw = Array.isArray(data.product.images)
          ? data.product.images
          : Array.isArray(data.product.secondaryImages)
            ? [data.product.primaryImage, ...data.product.secondaryImages]
            : [data.product.primaryImage];
        const apiImagesResolved = apiImagesRaw.map(resolveImageUrl).filter(Boolean);
        const images = apiImagesResolved.length > 0 ? apiImagesResolved : [apiPrimaryImage];

        const features = data.product.keyFeatures
          ? data.product.keyFeatures
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean)
          : [];

        const productIncludes = Array.isArray(data.product.productIncludes) ? data.product.productIncludes : [];

        const reviewsList = Array.isArray(data.product.reviewsList) ? data.product.reviewsList : [];
        const ratingBreakdown = data.product.ratingBreakdown || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

        const productData = {
          id: data.product.id,
          name: data.product.title,
          price,
          originalPrice,
          discount: discountPercent,
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
          productIncludes,
          specifications: {
            'Stock Available': data.product.stock,
            'SKU': data.product.sku,
            'Category': data.product.categoryName
          }
        };

        setProduct(productData);
        setSelectedImage(0);
        setReviewRating(0);
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
          `/backend/api/get_products.php?category=${encodeURIComponent(category)}&limit=8&offset=0`,
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
    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (product) {
      try {
        await cartAddToCart({
          id: product.id,
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        }, quantity);
        toast.success(`Added ${product.name} to cart!`);
      } catch (err) {
        toast.error('Failed to add to cart');
      }
    }
  };

  const buyNow = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (product) {
      try {
        await cartAddToCart({
          id: product.id,
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        }, quantity);
        navigate('/cart');
      } catch (err) {
        toast.error('Failed to add to cart');
      }
    }
  };

  const submitRating = async (ratingValue) => {
    setReviewError(null);
    setReviewSuccess(null);

    if (!product) {
      return;
    }

    if (!currentUser) {
      // Redirect to login and return back to this product page
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const ratingNum = Number(ratingValue);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      setReviewError('Please select a rating.');
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await fetch(`/backend/api/submit_review.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          rating: ratingNum,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        setReviewError(data.message || 'Failed to submit review.');
        return;
      }

      setReviewSuccess('Rating submitted successfully.');
      setReviewRating(ratingNum);

      const refresh = await fetch(`/backend/api/get_product.php?id=${product.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refresh.ok) {
        const refreshed = await refresh.json();
        if (refreshed.status === 'success') {
          const safeOriginalPrice = Number(refreshed.product.originalPrice);
          const originalPrice = Number.isFinite(safeOriginalPrice) ? safeOriginalPrice : 0;
          
          // Get discount percentage and calculate price
          const discountPercent = Number(refreshed.product.discount) || 0;
          let price = originalPrice;
          if (discountPercent > 0 && originalPrice > 0) {
            price = originalPrice - (originalPrice * discountPercent / 100);
          }
          
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
            discount: discountPercent,
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

  const handleStarClick = (star) => {
    if (reviewSubmitting) return;
    setReviewRating(star);
    submitRating(star);
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
    <div className="product-details-page">
      {/* Toast Container for product page notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999, marginTop: '5rem' }}
      />
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
                    <span>
                      Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                    <button type="button" className="share-product-btn" onClick={shareProduct} aria-label="Share product">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
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
                    <span className="current-price">₹{product.price.toFixed(2)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                    )}
                    {product.discount > 0 && (
                      <span className="discount">
                        {Math.round(product.discount)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="stock-status">
                    <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? `✓ In Stock` : '✗ Out of Stock'}
                    </span>
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

                      <div className="cta-row">
                        <button type="button" onClick={addToCart} className="add-to-cart-btn">
                          Add to cart
                        </button>
                        <button type="button" onClick={buyNow} className="buy-now-btn">
                          Buy it now
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="product-meta">
                    <div className="meta-item">
                      <span>Share:</span>
                      <div className="social-links">
                        <a
                          href="https://www.facebook.com/people/Make-My-Veggies/61581769312519/?mibextid=wwXIfr&rdid=IRuQvgUrHnQgCb6O&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Cnhb4XHfJ%2F%3Fmibextid%3DwwXIfr"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Make My Veggies on Facebook"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a
                          href="https://www.linkedin.com/company/makemyveggies/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3Bq2l2qqJdSZWG4zcSWCdQmw%3D%3D"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Make My Veggies on LinkedIn"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
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
                      className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('overview')}
                    >
                      Overview
                    </button>
                    <button
                      className={`tab-btn ${selectedTab === 'key_features' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('key_features')}
                    >
                      Key Features
                    </button>
                    <button
                      className={`tab-btn ${selectedTab === 'includes' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('includes')}
                    >
                      Includes
                    </button>
                    <button
                      className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('reviews')}
                    >
                      Reviews ({product.reviews})
                    </button>
                  </div>

                  <div className="tab-content">
                    {selectedTab === 'overview' && (
                      <div className="tab-pane active">
                        <p>{product.description || dummyDescription}</p>
                        <p>{dummyDescriptionExtra}</p>
                      </div>
                    )}

                    {selectedTab === 'key_features' && (
                      <div className="tab-pane active">
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
                          <p>No information available.</p>
                        )}
                      </div>
                    )}

                    {selectedTab === 'includes' && (
                      <div className="tab-pane active">
                        {product.productIncludes && product.productIncludes.length > 0 ? (
                          <ul className="features-list">
                            {product.productIncludes.map((inc, index) => (
                              <li key={index}>
                                <i className="fa-solid fa-check"></i>
                                {inc}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No includes available.</p>
                        )}
                      </div>
                    )}

                    {selectedTab === 'reviews' && (
                      <div className="tab-pane active">
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
                            <h5>Rate this product</h5>
                            <div className="review-form">
                              <div className="rating-input">
                                <label>Your Rating:</label>
                                <div className="star-rating" role="radiogroup" aria-label="Select rating">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      className={`star-btn ${reviewRating >= star ? 'active' : ''}`}
                                      onClick={() => handleStarClick(star)}
                                      aria-label={`${star} star`}
                                      disabled={reviewSubmitting}
                                    >
                                      <i className={`${reviewRating >= star ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <p className="m-0 text-muted" style={{ marginTop: 10 }}>
                                {currentUser ? 'Tap a star to submit your rating.' : 'Login required to rate. Tap a star and you’ll be redirected to login.'}
                              </p>

                              {reviewError && <div className="review-msg error">{reviewError}</div>}
                              {reviewSuccess && <div className="review-msg success">{reviewSuccess}</div>}
                            </div>
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
                          <span className="current-price">₹{Number(p.price || 0).toFixed(2)}</span>
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