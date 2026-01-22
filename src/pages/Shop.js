import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch, FiX } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../styles/Shop.css';

const Shop = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Dynamic data from backend
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // 4 columns x 3 rows

  // Read category from URL (e.g. /shop?category=soil) for nicer empty-state message
  const urlCategory = new URLSearchParams(location.search).get('category');

  // Fetch products from backend
  const fetchProducts = useCallback(async (search) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = search || '';

      const res = await fetch(`/backend/api/get_products.php${queryString}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          // Content-Type for GET is unnecessary, but harmless. You can remove if you prefer.
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      console.log('💬 fetchProducts response:', data); // <--- helpful for debugging

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch products');
      }

      // Backend returns { status, products, pagination }
      if (!data.products || data.products.length === 0) {
        setProducts([]);
        setFilteredProducts([]);
        setError('No products found in the database');
        return;
      }

      const mapped = data.products.map(p => {
        // safe parsing with fallbacks
        const rawPrice = Number(p.price);
        const rawOriginalPrice = Number(p.originalPrice);
        const rawDiscount = Number(p.discount);

        const safePrice = Number.isFinite(rawPrice) ? rawPrice : 0;
        // Prefer backend originalPrice if valid and greater than price; otherwise fall back to price
        const backendOriginal = Number.isFinite(rawOriginalPrice) ? rawOriginalPrice : safePrice;
        const safeOriginalPrice = backendOriginal > safePrice ? backendOriginal : safePrice;

        // Normalize discount: use backend value if valid
        let discount = Number.isFinite(rawDiscount) ? rawDiscount : 0;

        // If discount is not positive, treat product as non-discounted
        if (discount <= 0) {
          discount = 0;
        }

        // normalize category & brand from backend fields
        const category = (p.categoryName || 'others').toString().toLowerCase();
        const brand = (p.brand || p.categoryName || 'Unknown').toString();

        // rating comes from backend avg_rating (mapped to p.rating)
        const ratingNum = Number(p.rating);
        const rating = Number.isFinite(ratingNum) ? ratingNum : 0;

        // inStock is already provided by get_products.php
        const inStock = !!p.inStock;

        return {
          id: p.id,
          name: p.title || p.name || 'Unnamed product',
          price: safePrice,
          // If no discount, keep originalPrice equal to price so UI shows simple price
          originalPrice: discount > 0 ? safeOriginalPrice : safePrice,
          image: p.primaryImage || p.image || 'https://via.placeholder.com/300x300/eeeeee/888888?text=Product',
          category,
          rating,
          inStock,
          discount,
          brand,
          description: p.description || '',
          stock: p.stock ?? null,
          sku: p.sku ?? null,
        };
      });

      setProducts(mapped);
      setFilteredProducts(mapped);

      // Extract unique categories and brands from products
      const uniqueCategories = [...new Set(mapped.map(p => p.category))].filter(Boolean);
      const uniqueBrands = [...new Set(mapped.map(p => p.brand))].filter(Boolean);

      setCategories(uniqueCategories);
      setBrands(uniqueBrands);

      setError(null);
    } catch (e) {
      console.error('❌ Fetch error:', e);
      // Show a simple, human-friendly message in the UI
      setError('We could not load products right now. Please try again in a few minutes.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch products whenever the URL query (e.g. category) changes
  useEffect(() => {
    fetchProducts(location.search);
  }, [location.search, fetchProducts]);

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    setAddedItems(prev => [...prev, product.id]);
    
    // Remove the added item from the addedItems array after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="half" />);
      } else {
        stars.push(<FaRegStar key={i} className="empty" />);
      }
    }

    return stars;
  };

  // Toggle filter section
  const toggleFilterSection = (section) => {
    switch (section) {
      case 'categories':
        setShowCategories(!showCategories);
        break;
      case 'price':
        setShowPrice(!showPrice);
        break;
      case 'brands':
        setShowBrands(!showBrands);
        break;
      case 'ratings':
        setShowRatings(!showRatings);
        break;
      case 'tags':
        setShowTags(!showTags);
        break;
      default:
        break;
    }
  };

  // Toggle brand selection
  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Apply filters
  const applyFilters = () => {
    console.log('🔍 Applying filters. Total products:', products.length);
    if (products.length === 0) {
      console.log('⚠️ No products to filter yet');
      return;
    }
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
      console.log('After category filter:', filtered.length);
    }
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
      console.log('After brand filter:', filtered.length);
    }
    
    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    console.log('After price filter:', filtered.length, 'Range:', priceRange);
    
    // Apply rating filter
    if (selectedRating) {
      filtered = filtered.filter(product => product.rating >= selectedRating);
      console.log('After rating filter:', filtered.length, 'Rating:', selectedRating);
    }
    
    // Apply sorting
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    console.log('✅ Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSelectedRating(null);
    setPriceRange([0, 10000]);
    setSortBy('featured');
    setFilteredProducts(products);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  console.log('🎯 Render: filteredProducts:', filteredProducts.length, 'currentProducts:', currentProducts.length, 'page:', currentPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Apply filters when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      console.log('🔄 Products loaded, applying initial filters');
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  // Apply filters when filter dependencies change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedBrands, selectedRating, priceRange, sortBy]);

  return (
    <div className="shop-page">
      <main>
        {/* Page Header */}
        <section className="pageheader4 overflow-hidden">
                  <div className="container">
                    <div className="pageheader__content">
                      <h2>Shop</h2>
                    </div>
                  </div>
                </section>

        {/* Shop Content */}
        <div className="container">
          <div className="shop-container">
            {/* Mobile Filter Toggle - REMOVED */}
            {/* <div className="mobile-filter-toggle">
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <FiFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div> */}

            <div className="shop-layout" style={{display: 'block', width: '100%'}}>
              {/* Sidebar Filters - REMOVED */}
              {false && <aside className={`shop-sidebar ${showMobileFilters ? 'show' : ''}`}>
                <div className="sidebar-header">
                  <h3>Filter</h3>
                  <button className="close-filters" onClick={() => setShowMobileFilters(false)}>
                    <FiX />
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="filter-section">
                  <div 
                    className="filter-section-header"
                    onClick={() => toggleFilterSection('categories')}
                  >
                    <h4>Categories</h4>
                    {showCategories ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {showCategories && (
                    <div className="filter-section-content">
                      <ul className="category-list">
                        {categories.map((category, index) => (
                          <li key={index}>
                            <label className="checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={selectedCategory === category.toLowerCase()}
                                onChange={() => setSelectedCategory(selectedCategory === category.toLowerCase() ? 'all' : category.toLowerCase())}
                              />
                              <span className="checkmark"></span>
                              {category}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                  <div 
                    className="filter-section-header"
                    onClick={() => toggleFilterSection('price')}
                  >
                    <h4>Price Range</h4>
                    {showPrice ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {showPrice && (
                    <div className="filter-section-content">
                      <div className="price-range">
                        <input 
                          type="range" 
                          min="0" 
                          max="10000" 
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        />
                        <div className="price-inputs">
                          <div className="price-input">
                            <span>Min: ${priceRange[0]}</span>
                          </div>
                          <div className="price-input">
                            <span>Max: ${priceRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brands Filter */}
                <div className="filter-section">
                  <div 
                    className="filter-section-header"
                    onClick={() => toggleFilterSection('brands')}
                  >
                    <h4>Brands</h4>
                    {showBrands ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {showBrands && (
                    <div className="filter-section-content">
                      <ul className="brand-list">
                        {brands.map((brand, index) => (
                          <li key={index}>
                            <label className="checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                              />
                              <span className="checkmark"></span>
                              {brand}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Ratings Filter */}
                <div className="filter-section">
                  <div 
                    className="filter-section-header"
                    onClick={() => toggleFilterSection('ratings')}
                  >
                    <h4>Ratings</h4>
                    {showRatings ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {showRatings && (
                    <div className="filter-section-content">
                      <div className="rating-filters">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="rating-filter">
                            <label className="radio-container">
                              <input 
                                type="radio" 
                                name="rating" 
                                checked={selectedRating === rating}
                                onChange={() => setSelectedRating(rating)}
                              />
                              <span className="radio-checkmark"></span>
                              <div className="stars">
                                {Array(5).fill().map((_, i) => (
                                  i < rating ? 
                                    <FaStar key={i} className="filled" /> : 
                                    <FaRegStar key={i} className="empty" />
                                ))}
                                <span>& Up</span>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="filter-actions">
                  <button className="apply-filters" onClick={applyFilters}>
                    Apply Filters
                  </button>
                  <button className="reset-filters" onClick={resetFilters}>
                    Reset All
                  </button>
                </div>
              </aside>}

              {/* Main Content */}
              <div className="shop-main" style={{width: '100%', maxWidth: '100%'}}>
                {/* Shop Header */}
                <div className="shop-header">
                  <p className="results-count">
                    Showing {filteredProducts.length} of {products.length} products
                    {loading && ' (Loading...)'}
                    {error && ` (Error: ${error})`}
                  </p>
                  <div className="shop-controls">
                    <div className="sort-by">
                      <label>Sort by:</label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="featured">Featured</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                    <div className="view-toggle">
                      <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                        title="Grid View"
                      >
                        <span className="grid-icon"></span>
                      </button>
                      <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                        title="List View"
                      >
                        <span className="list-icon"></span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className={`products-grid ${viewMode}`} style={{gridTemplateColumns: viewMode === 'grid' ? 'repeat(4, 1fr)' : '1fr'}}>
                  {loading ? (
                    <div className="no-results"><p>Loading products...</p></div>
                  ) : error ? (
                    <div className="no-results"><p>{error}</p></div>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <div key={product.id} className="product-card">
                        {product.discount > 0 && (
                          <div className="product-badge">-{product.discount}%</div>
                        )}
                        <div className="product-image-container">
                          <img src={product.image} alt={product.name} className="product-image" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/300x300/eeeeee/888888?text=Product'; }} />
                          <div className="product-actions">
                            <button className="action-btn" title="Add to Wishlist">
                              <FiHeart />
                            </button>
                            <button className="action-btn" title="Quick View">
                              <FiSearch />
                            </button>
                            <button 
                              className="action-btn cart-btn" 
                              title="Add to Cart"
                              onClick={() => handleAddToCart(product)}
                            >
                              <FiShoppingCart />
                            </button>
                          </div>
                        </div>
                        <div className="product-info">
                          <span className="product-category">{product.category}</span>
                          <h3 className="product-title">
                            <Link to={`/product-details/${product.id}`}>{product.name}</Link>
                          </h3>
                          <div className="product-rating">
                            {renderStars(product.rating)}
                            <span className="rating-count">{product.rating > 0 ? `(${product.rating})` : '(No ratings yet)'}</span>
                          </div>
                          <div className="product-price">
                            <span className="current-price">${product.price.toFixed(2)}</span>
                            {product.originalPrice > product.price && (
                              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <button 
                            className={`add-to-cart-btn ${addedItems.includes(product.id) ? 'added' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={addedItems.includes(product.id)}
                          >
                            {addedItems.includes(product.id) ? (
                              <>
                                <FaCheck className="icon" /> Added
                              </>
                            ) : (
                              <>
                                <FiShoppingCart className="icon" /> Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>
                        {urlCategory || selectedCategory !== 'all'
                          ? 'No products are available for this category yet. Please check back later or choose another category.'
                          : 'No products match your filters. Try adjusting your search criteria.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        className={`page-btn ${currentPage === number ? 'active' : ''}`}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button 
                      className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;