import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import '../assets/css/style.css'; // Import original CSS

const Shop = () => {
  const { addToCart, loading } = useCart();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 500],
    rating: 0,
    searchTerm: ''
  });

  // Sample product data with categories
  const [allProducts] = useState([
    {
      id: 1,
      name: 'Gardening Gloves',
      price: 25.99,
      image: '/assets/img/shop/img1.jpg',
      rating: 5,
      category: 'tools'
    },
    {
      id: 2,
      name: 'Gardening Boots',
      price: 89.99,
      image: '/assets/img/shop/img2.jpg',
      rating: 4,
      category: 'clothing'
    },
    {
      id: 3,
      name: 'Gardening Hose',
      price: 45.99,
      image: '/assets/img/shop/img3.jpg',
      rating: 5,
      category: 'watering'
    },
    {
      id: 4,
      name: 'Watering Can',
      price: 35.99,
      image: '/assets/img/shop/img4.jpg',
      rating: 4,
      category: 'watering'
    },
    {
      id: 5,
      name: 'Flowerpot',
      price: 15.99,
      image: '/assets/img/shop/img5.jpg',
      rating: 3,
      category: 'pots'
    },
    {
      id: 6,
      name: 'Wheelbarrow',
      price: 199.99,
      image: '/assets/img/shop/img6.jpg',
      rating: 5,
      category: 'tools'
    },
    {
      id: 7,
      name: 'Gardening Fork',
      price: 29.99,
      image: '/assets/img/shop/img7.jpg',
      rating: 4,
      category: 'tools'
    },
    {
      id: 8,
      name: 'Garden Fertilizer',
      price: 19.99,
      image: '/assets/img/shop/img8.jpg',
      rating: 5,
      category: 'fertilizers'
    },
    {
      id: 9,
      name: 'Garden Hoe',
      price: 39.99,
      image: '/assets/img/shop/img9.jpg',
      rating: 4,
      category: 'tools'
    },
    {
      id: 10,
      name: 'Plant Seeds',
      price: 12.99,
      image: '/assets/img/shop/img1.jpg',
      rating: 5,
      category: 'seeds'
    },
    {
      id: 11,
      name: 'Garden Sprayer',
      price: 65.99,
      image: '/assets/img/shop/img2.jpg',
      rating: 4,
      category: 'watering'
    },
    {
      id: 12,
      name: 'Pruning Shears',
      price: 24.99,
      image: '/assets/img/shop/img3.jpg',
      rating: 5,
      category: 'tools'
    }
  ]);

  // Filter products based on current filters
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    
    // Rating filter
    if (product.rating < filters.rating) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 500],
      rating: 0,
      searchTerm: ''
    });
  };

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    try {
      await addToCart(product, 1);
      // Show success message with option to view cart
      const viewCart = window.confirm(
        `${product.name} added to cart successfully!\n\nWould you like to view your cart now?`
      );
      if (viewCart) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle quick view to cart
  const handleQuickAddToCart = (product, event) => {
    event.preventDefault();
    handleAddToCart(product);
  };

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Our Shop Page</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="active" aria-current="page">Shop</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        
        {/* Shop Section */}
        <section className="blogsingle shoppage bg-white">
          <div className="container">
            <div className="row g-4">
              <div className="col-xl-8">
                <div className="shoppage__header">
                  <nav className="shoppagenav">
                    <h6>Showing 1–{filteredProducts.length} of {allProducts.length} results</h6>
                    <div className="nav nav-tab" id="nav-tab" role="tablist">
                      <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                        <i className="fa-light fa-list-ul"></i>
                      </button>
                      <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                        <i className="fa-light fa-bars"></i>
                      </button>
                    </div>
                  </nav>
                </div>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa-solid fa-search fa-3x text-muted mb-3"></i>
                        <h4>No products found</h4>
                        <p className="text-muted mb-4">
                          Try adjusting your filters or search terms to find what you're looking for.
                        </p>
                        <button 
                          onClick={resetFilters}
                          className="custom-btn"
                        >
                          <i className="fa-solid fa-refresh me-2"></i>
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {filteredProducts.map((product) => (
                        <div key={product.id} className="col-md-6 col-xl-4">
                          <div className="shoppage__inner">
                            <div className="shoppage__item">
                              <div className="thum">
                                <Link to={`/product-details/${product.id}`}>
                                  <img src={product.image} alt="img" />
                                </Link>
                                <div className="shoppagelink go-up">
                                  <a href={product.image} data-rel="lightcase"><i className="fa-solid fa-eye"></i></a>
                                  <a href="#"><i className="fa-regular fa-heart"></i></a>
                                  <button 
                                    onClick={(e) => handleQuickAddToCart(product, e)}
                                    disabled={addingToCart === product.id}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'inherit',
                                      cursor: addingToCart === product.id ? 'not-allowed' : 'pointer',
                                      opacity: addingToCart === product.id ? 0.6 : 1
                                    }}
                                    title="Add to Cart"
                                  >
                                    {addingToCart === product.id ? (
                                      <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                      <i className="fa-solid fa-cart-shopping"></i>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="content">
                                <div className="allstar">
                                  {[...Array(product.rating)].map((_, i) => (
                                    <i key={i} className="fa-solid fa-star"></i>
                                  ))}
                                </div>
                                <h6><Link to={`/product-details/${product.id}`}>{product.name}</Link></h6>
                                <span>${product.price}</span>
                                <div className="mt-3">
                                  <button 
                                    className="custom-btn w-100"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={addingToCart === product.id}
                                    style={{
                                      opacity: addingToCart === product.id ? 0.6 : 1,
                                      cursor: addingToCart === product.id ? 'not-allowed' : 'pointer'
                                    }}
                                  >
                                    {addingToCart === product.id ? (
                                      <>
                                        <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                        Adding...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa-solid fa-cart-plus me-2"></i>
                                        Add to Cart
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    {/* List view content would go here if needed */}
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                {/* Filter Sidebar */}
                <div className="shoppage__sidebar">
                  
                  {/* Search Filter */}
                  <div className="sidebar__widget mb-4">
                    <h5 className="widget-title">Search Products</h5>
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="sidebar__widget mb-4">
                    <h5 className="widget-title">Categories</h5>
                    <div className="category-list">
                      {['all', 'tools', 'watering', 'pots', 'seeds', 'fertilizers', 'clothing'].map(category => (
                        <div key={category} className="category-item">
                          <label className="d-flex align-items-center">
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={filters.category === category}
                              onChange={(e) => handleFilterChange('category', e.target.value)}
                              className="me-2"
                            />
                            <span className="text-capitalize">
                              {category === 'all' ? 'All Categories' : category}
                              <small className="text-muted ms-2">
                                ({category === 'all' 
                                  ? allProducts.length 
                                  : allProducts.filter(p => p.category === category).length})
                              </small>
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  

                  {/* Filter Actions */}
                  <div className="sidebar__widget">
                    <div className="filter-actions">
                      <button 
                        onClick={resetFilters}
                        className="custom-btn w-100 mb-3"
                      >
                        <i className="fa-solid fa-refresh me-2"></i>
                        Reset Filters
                      </button>
                      <div className="active-filters">
                        <h6>Active Filters:</h6>
                        <div className="filter-tags">
                          {filters.category !== 'all' && (
                            <span className="badge bg-success me-2 mb-2">
                              Category: {filters.category}
                              <i 
                                className="fa-solid fa-times ms-1" 
                                onClick={() => handleFilterChange('category', 'all')}
                                style={{cursor: 'pointer'}}
                              ></i>
                            </span>
                          )}
                          {filters.rating > 0 && (
                            <span className="badge bg-warning me-2 mb-2">
                              {filters.rating}+ Stars
                              <i 
                                className="fa-solid fa-times ms-1" 
                                onClick={() => handleFilterChange('rating', 0)}
                                style={{cursor: 'pointer'}}
                              ></i>
                            </span>
                          )}
                          {filters.searchTerm && (
                            <span className="badge bg-info me-2 mb-2">
                              Search: {filters.searchTerm}
                              <i 
                                className="fa-solid fa-times ms-1" 
                                onClick={() => handleFilterChange('searchTerm', '')}
                                style={{cursor: 'pointer'}}
                              ></i>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
