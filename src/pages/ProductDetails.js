import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Sample product data
  const product = {
    id: 1,
    name: 'Gardening Gloves',
    price: 290.99,
    rating: 4.5,
    reviews: 3,
    image: 'https://via.placeholder.com/400x400/73B611/white?text=Product+Image',
    images: [
      'https://via.placeholder.com/400x400/73B611/white?text=Image+1',
      'https://via.placeholder.com/400x400/8BC34A/white?text=Image+2',
      'https://via.placeholder.com/400x400/4CAF50/white?text=Image+3',
      'https://via.placeholder.com/400x400/66BB6A/white?text=Image+4'
    ],
    description: 'High-quality gardening gloves perfect for all your gardening needs. Durable, comfortable, and designed to protect your hands.',
    features: [
      'Durable material construction',
      'Comfortable fit for extended use',
      'Water-resistant coating',
      'Excellent grip and dexterity',
      'Machine washable'
    ]
  };

  const updateQuantity = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    alert(`${product.name} (Qty: ${quantity}) added to cart!`);
  };

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Product Details</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li className="active" aria-current="page">Product Details</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <div style={{ padding: '60px 0', background: '#ffffff' }}>
          <div className="container">
            <div className="row">
              {/* Product Images */}
              <div className="col-md-6">
                <div style={{ marginBottom: '30px' }}>
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '400px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid #eee'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        onClick={() => setSelectedImage(index)}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: selectedImage === index ? '3px solid #73B611' : '1px solid #ddd',
                          borderRadius: '6px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="col-md-6">
                <div style={{ padding: '0 20px' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '20px' }}>
                    {product.name}
                  </h1>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          style={{ 
                            color: i < product.rating ? '#ffc107' : '#ddd', 
                            fontSize: '20px',
                            marginRight: '3px'
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span style={{ color: '#666', fontSize: '16px' }}>({product.reviews} reviews)</span>
                  </div>

                  <div style={{ 
                    padding: '25px', 
                    background: '#f8f9fa', 
                    borderRadius: '10px', 
                    marginBottom: '30px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#73B611', marginBottom: '10px' }}>
                      ${product.price}
                    </div>
                    <div style={{ color: '#73B611', fontWeight: '600', fontSize: '18px' }}>
                      ✓ In Stock
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <p style={{ color: '#666', lineHeight: '1.8', fontSize: '18px' }}>
                      {product.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                      Key Features:
                    </h3>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {product.features.map((feature, index) => (
                        <li key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '15px', 
                          marginBottom: '15px',
                          color: '#666',
                          fontSize: '16px'
                        }}>
                          <span style={{ color: '#73B611', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ 
                    padding: '30px', 
                    background: '#f8f9fa', 
                    borderRadius: '10px',
                    marginBottom: '30px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', justifyContent: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#333', fontSize: '18px' }}>Quantity:</span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #73B611', borderRadius: '8px' }}>
                        <button 
                          onClick={() => updateQuantity(-1)}
                          disabled={quantity <= 1}
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            border: 'none', 
                            background: '#73B611',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 'bold'
                          }}
                        >
                          -
                        </button>
                        <span style={{ 
                          width: '80px', 
                          height: '50px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: 'white',
                          fontWeight: '700',
                          fontSize: '18px'
                        }}>
                          {quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(1)}
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            border: 'none', 
                            background: '#73B611',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 'bold'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button 
                        onClick={handleAddToCart}
                        style={{ 
                          flex: '1',
                          padding: '18px 30px',
                          background: '#73B611',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '18px'
                        }}
                      >
                        🛒 Add to Cart
                      </button>
                      <Link 
                        to="/cart" 
                        style={{ 
                          flex: '1',
                          padding: '18px 30px',
                          background: '#333',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}
                      >
                        👁️ View Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Tabs Section */}
        <div style={{ padding: '60px 0', background: '#f8f9fa' }}>
          <div className="container">
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
              {/* Tab Navigation */}
              <div style={{ display: 'flex', background: '#f8f9fa' }}>
                <button 
                  onClick={() => setActiveTab('description')}
                  style={{ 
                    flex: '1',
                    padding: '25px 40px',
                    border: 'none',
                    background: activeTab === 'description' ? '#73B611' : 'transparent',
                    color: activeTab === 'description' ? 'white' : '#666',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '18px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📝 Description
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  style={{ 
                    flex: '1',
                    padding: '25px 40px',
                    border: 'none',
                    background: activeTab === 'reviews' ? '#73B611' : 'transparent',
                    color: activeTab === 'reviews' ? 'white' : '#666',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '18px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⭐ Reviews
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ padding: '50px' }}>
                {activeTab === 'description' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#333', marginBottom: '25px' }}>
                      Product Description
                    </h2>
                    <p style={{ color: '#666', lineHeight: '2', fontSize: '18px', marginBottom: '40px' }}>
                      {product.description}
                    </p>
                    
                    <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '25px' }}>
                      🌟 Detailed Features:
                    </h3>
                    <div style={{ display: 'grid', gap: '20px' }}>
                      {product.features.map((feature, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '20px', 
                          padding: '20px',
                          background: '#f8f9fa',
                          borderRadius: '10px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <span style={{ 
                            color: '#73B611', 
                            fontSize: '24px', 
                            fontWeight: 'bold',
                            minWidth: '30px'
                          }}>
                            ✓
                          </span>
                          <span style={{ color: '#333', fontSize: '18px', fontWeight: '500' }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '40px',
                      paddingBottom: '25px',
                      borderBottom: '2px solid #eee'
                    }}>
                      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#333', margin: '0' }}>
                        Customer Reviews
                      </h2>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '15px',
                        padding: '15px 25px',
                        background: '#73B611',
                        borderRadius: '25px',
                        color: 'white'
                      }}>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ fontSize: '20px', marginRight: '3px' }}>★</span>
                          ))}
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '18px' }}>4.8 out of 5</span>
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div style={{ display: 'grid', gap: '30px' }}>
                      <div style={{ 
                        padding: '30px', 
                        background: '#f8f9fa', 
                        borderRadius: '15px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                          <div style={{ 
                            width: '70px', 
                            height: '70px', 
                            borderRadius: '50%', 
                            background: '#73B611',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '24px'
                          }}>
                            MW
                          </div>
                          <div>
                            <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 8px 0' }}>
                              Maria Watson
                            </h4>
                            <span style={{ color: '#999', fontSize: '16px', display: 'block', marginBottom: '10px' }}>
                              📅 24 Jan 2024, at 02:00 pm
                            </span>
                            <div>
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: '#ffc107', fontSize: '18px', marginRight: '3px' }}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: '#666', lineHeight: '1.8', fontSize: '18px', margin: '0' }}>
                          💬 "Excellent quality gloves! Very comfortable and durable. Perfect for my gardening needs. Highly recommended!"
                        </p>
                      </div>

                      <div style={{ 
                        padding: '30px', 
                        background: '#f8f9fa', 
                        borderRadius: '15px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                          <div style={{ 
                            width: '70px', 
                            height: '70px', 
                            borderRadius: '50%', 
                            background: '#73B611',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '24px'
                          }}>
                            CB
                          </div>
                          <div>
                            <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 8px 0' }}>
                              Carlos Becker
                            </h4>
                            <span style={{ color: '#999', fontSize: '16px', display: 'block', marginBottom: '10px' }}>
                              📅 18 Jan 2024, at 10:30 am
                            </span>
                            <div>
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: '#ffc107', fontSize: '18px', marginRight: '3px' }}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: '#666', lineHeight: '1.8', fontSize: '18px', margin: '0' }}>
                          💬 "Great product! The grip is excellent and they're very comfortable to wear for long periods. Worth every penny!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;
