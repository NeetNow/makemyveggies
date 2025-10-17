import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Shop = () => {
  // Sample product data - in a real app this would come from an API or context
  const [products] = useState([
    {
      id: 1,
      name: 'Garden Rose Plant',
      price: 25.99,
      originalPrice: 35.99,
      image: 'https://via.placeholder.com/300x300/4CAF50/ffffff?text=Rose+Plant',
      category: 'plants',
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: 'Garden Irrigation System',
      price: 150.00,
      originalPrice: 180.00,
      image: 'https://via.placeholder.com/300x300/2196F3/ffffff?text=Irrigation',
      category: 'equipment',
      rating: 4.8,
      inStock: true
    },
    {
      id: 3,
      name: 'Garden Tools Set',
      price: 75.50,
      originalPrice: 85.00,
      image: 'https://via.placeholder.com/300x300/FF9800/ffffff?text=Tools',
      category: 'tools',
      rating: 4.2,
      inStock: true
    },
    {
      id: 4,
      name: 'Organic Fertilizer',
      price: 18.99,
      originalPrice: 22.99,
      image: 'https://via.placeholder.com/300x300/9C27B0/ffffff?text=Fertilizer',
      category: 'supplies',
      rating: 4.6,
      inStock: false
    },
    {
      id: 5,
      name: 'Garden Gloves',
      price: 12.50,
      originalPrice: 15.00,
      image: 'https://via.placeholder.com/300x300/F44336/ffffff?text=Gloves',
      category: 'accessories',
      rating: 4.3,
      inStock: true
    },
    {
      id: 6,
      name: 'Plant Seeds Collection',
      price: 8.99,
      originalPrice: 12.99,
      image: 'https://via.placeholder.com/300x300/795548/ffffff?text=Seeds',
      category: 'plants',
      rating: 4.7,
      inStock: true
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Filter products by category
  const filterProducts = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };

  // Sort products
  const sortProducts = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortType) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(sorted);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li>Shop</li>
                  </ul>
                  <h2>Our Products</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Section */}
        <section className="shop padding-block bg-white">
          <div className="container">
            {/* Shop Controls */}
            <div className="shop-controls">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <div className="filter-category">
                    <label>Category:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => filterProducts(e.target.value)}
                      className="form-select"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="filter-sort">
                    <label>Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => sortProducts(e.target.value)}
                      className="form-select"
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="view-mode">
                    <span>View:</span>
                    <button
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="fa-solid fa-th"></i>
                    </button>
                    <button
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="fa-solid fa-list"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <p className="results-count">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`products-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className={viewMode === 'list' ? 'col-12' : 'col-md-6 col-lg-4'}>
                    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        {product.originalPrice > product.price && (
                          <div className="discount-badge">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="stock-badge out-of-stock">Out of Stock</div>
                        )}
                        <div className="product-actions">
                          <button className="action-btn">
                            <i className="fa-solid fa-heart"></i>
                          </button>
                          <button className="action-btn">
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </div>
                      </div>
                      <div className="product-info">
                        <div className="product-category">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </div>
                        <h5 className="product-title">
                          <Link to={`/product-details/${product.id}`}>{product.name}</Link>
                        </h5>
                        <div className="product-rating">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                            ></i>
                          ))}
                          <span>({product.rating})</span>
                        </div>
                        <div className="product-price">
                          <span className="current-price">${product.price.toFixed(2)}</span>
                          {product.originalPrice > product.price && (
                            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="product-buttons">
                          {product.inStock ? (
                            <button className="add-to-cart-btn">
                              Add to Cart
                            </button>
                          ) : (
                            <button className="notify-btn" disabled>
                              Notify When Available
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {filteredProducts.length >= 6 && (
              <div className="row">
                <div className="col-12 text-center">
                  <button className="load-more-btn">Load More Products</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
