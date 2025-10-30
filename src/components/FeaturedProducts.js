import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Fresh Organic Tomato',
      price: 2.99,
      originalPrice: 3.99,
      image: 'https://images.unsplash.com/photo-1590771129824-2662a4c7660e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      category: 'Vegetables',
      rating: 4.5,
      discount: 25
    },
    {
      id: 2,
      name: 'Organic Carrot',
      price: 1.99,
      originalPrice: 2.49,
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      category: 'Vegetables',
      rating: 4.2,
      discount: 20
    },
    {
      id: 3,
      name: 'Fresh Broccoli',
      price: 3.49,
      originalPrice: 3.99,
      image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      category: 'Vegetables',
      rating: 4.7,
      discount: 12
    },
    {
      id: 4,
      name: 'Organic Spinach',
      price: 2.29,
      originalPrice: 2.99,
      image: 'https://images.unsplash.com/photo-1576045057995-568f4fdd4c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      category: 'Greens',
      rating: 4.6,
      discount: 23
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star filled"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }

    return stars;
  };

  return (
    <section className="featured-products padding-block">
      <div className="container">
        <div className="section__header text-center">
          <h2>Featured Products</h2>
          <p>Add our best products to weekly line up</p>
        </div>
        <div className="row">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-6">
              <div className="product-card">
                <div className="product-badge">-{product.discount}%</div>
                <div className="product-image">
                  <img src={product.image} alt={product.name} className="img-fluid" />
                  <div className="product-actions">
                    <button className="action-btn">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fas fa-search"></i>
                    </button>
                    <button className="action-btn">
                      <FiShoppingCart />
                    </button>
                  </div>
                </div>
                <div className="product-content">
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
                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                  </div>
                  <button className="add-to-cart">
                    <FiShoppingCart className="icon" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
