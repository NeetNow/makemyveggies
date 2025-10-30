import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch, FiStar, FiChevronDown, FiFilter, FiX } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Shop.css';

const Shop = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = 'http://localhost:8000'; // process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  // Sample categories for filters
  const categories = [
    'Fresh Vegetables', 'Herbs & Seasonings', 'Fruits', 'Exotic Fruits & Veggies',
    'Fresh Fruits', 'Organic Fruits', 'Fresh Berries', 'Butter & Eggs',
    'Fresh Onion', 'Fresh Nuts', 'Fresh Meat', 'Fresh Milk'
  ];

  // Sample brands for filters
  const brands = [
    'Vegetables', 'Fruits', 'Juices', 'Meat', 'Breakfast', 'Fresh', 'Food', 'Dinner', 'Organic'
  ];

  // Sample price ranges
  const priceRanges = [
    { id: 1, range: '$0.00 - $50.00' },
    { id: 2, range: '$50.00 - $100.00' },
    { id: 3, range: '$100.00 - $150.00' },
    { id: 4, range: '$150.00 - $200.00' },
    { id: 5, range: '$200.00 - $250.00' },
    { id: 6, range: '$250.00 - $300.00' },
    { id: 7, range: '$300.00 - $400.00' },
    { id: 8, range: '$400.00+' }
  ];

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching from:', `${API_BASE}/api/products.php`);
        const res = await fetch(`${API_BASE}/api/products.php`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        
        const data = await res.json();
        console.log('API Response:', data);
        
        if (!data.success) {
          throw new Error(data.message || 'API returned error');
        }
        
        if (!data.data || data.data.length === 0) {
          throw new Error('No products found in database');
        }
        
        const mapped = (data.data || []).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice ?? p.price,
          image: p.image || 'https://via.placeholder.com/300x300/eeeeee/888888?text=Product',
          category: (p.category || 'others').toLowerCase(),
          rating: p.rating || 4.5,
          inStock: p.inStock !== false,
          discount: p.discount || 0,
          brand: p.category || 'Fresh'
        }));
        
        console.log('✅ Loaded products:', mapped.length);
        setProducts(mapped);
        setFilteredProducts(mapped);
        setError(null);
      } catch (e) {
        console.error('❌ Fetch error:', e);
        setError(`Backend Error: ${e.message}. Using sample data.`);
        
        // Fallback to sample data
        const sampleProducts = [
          {
            id: 1,
            name: 'Fresh Organic Tomato',
            price: 2.99,
            originalPrice: 3.99,
            image: 'https://images.unsplash.com/photo-1590771129824-2662a4c7660e?w=300',
            category: 'vegetables',
            rating: 4.5,
            inStock: true,
            discount: 25,
            brand: 'Vegetables'
          },
          {
            id: 2,
            name: 'Organic Carrot',
            price: 1.99,
            originalPrice: 2.49,
            image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=300',
            category: 'vegetables',
            rating: 4.2,
            inStock: true,
            discount: 20,
            brand: 'Vegetables'
          },
          {
            id: 3,
            name: 'Fresh Broccoli',
            price: 3.49,
            originalPrice: 3.99,
            image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=300',
            category: 'vegetables',
            rating: 4.7,
            inStock: true,
            discount: 12,
            brand: 'Vegetables'
          }
        ];
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_BASE]);

  // Filter products by category
  const filterProducts = (category) => {
    setSelectedCategory(category);
    const base = [...products];
    const filtered = category === 'all' ? base : base.filter(product => product.category === category);
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
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
    setPriceRange([0, 10000]);
    setSortBy('featured');
    setFilteredProducts(products);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedBrands, priceRange, sortBy]);

  return (
    <div className="shop-page">
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Shop</h2>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="active" aria-current="page">Shop</li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Shop Content */}
        <div className="container">
          <div className="shop-container">
            {/* Mobile Filter Toggle */}
            <div className="mobile-filter-toggle">
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <FiFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className="shop-layout">
              {/* Sidebar Filters */}
              <aside className={`shop-sidebar ${showMobileFilters ? 'show' : ''}`}>
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
                                value={rating}
                                onChange={() => {}}
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
              </aside>

              {/* Main Content */}
              <div className="shop-main">
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
                <div className={`products-grid ${viewMode}`}>
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
                            <span className="rating-count">({product.rating})</span>
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
                      <p>No products match your filters. Try adjusting your search criteria.</p>
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
