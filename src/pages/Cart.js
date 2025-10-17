import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    setError 
  } = useCart();

  const subtotal = getCartTotal();
  const total = subtotal;

  // Handle quantity update
  const handleQuantityUpdate = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(id, newQuantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  // Show empty cart
  if (cartItems.length === 0 && !loading) {
    return (
      <>
        <Header />
        <main>
          <section className="pageheader overflow-hidden">
            <div className="container">
              <div className="pageheader__content">
                <h2>Shop Cart</h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li className="active" aria-current="page">Cart</li>
                  </ol>
                </nav>
              </div>
            </div>
          </section>
          <div className="cart-page-content">
            <div className="container">
              <div className="empty-cart">
                <h4>Your cart is empty</h4>
                <p>Add some items to your cart to get started!</p>
                <Link to="/shop" className="btn btn-success">Continue Shopping</Link>
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
      <Header />
      <main>
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Shop Cart</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li className="active" aria-current="page">Cart</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        <div className="cart-page-content">
          <div className="container">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError(null)}></button>
              </div>
            )}

            {!loading && (
              <div className="row">
                <div className="col-lg-8">
                  <div className="cart-table">
                    {/* Table Header */}
                    <div className="cart-header">
                      <div className="header-product">Product</div>
                      <div className="header-price">Price</div>
                      <div className="header-quantity">Quantity</div>
                      <div className="header-total">Total</div>
                      <div className="header-remove">Remove</div>
                    </div>

                    {/* Table Body */}
                    <div className="cart-body">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-row">
                          <div className="cart-product">
                            <img src={item.image} alt={item.name} className="product-img" />
                            <div className="product-details">
                              <h6><Link to={`/product-details/${item.id}`}>{item.name}</Link></h6>
                            </div>
                          </div>
                          <div className="cart-price">
                            ${item.price?.toFixed(2)}
                          </div>
                          <div className="cart-quantity">
                            <div className="qty-controls">
                              <button 
                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                className="qty-btn"
                              >
                                -
                              </button>
                              <span className="qty-value">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                className="qty-btn"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="cart-total">
                            ${((item.price || 0) * item.quantity).toFixed(2)}
                          </div>
                          <div className="cart-remove">
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="remove-btn"
                            >
                              ●
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Discount Section */}
                    <div className="discount-row">
                      <input type="text" placeholder="Discount Code" className="discount-input" />
                      <button className="discount-apply-btn">Lawyer Book</button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="cart-summary-box">
                    

                    <div className="summary-total">
                      <span>Total</span>
                      <span className="amount">${total.toFixed(2)}</span>
                    </div>

                    <Link to="/checkout" className="checkout-button">
                      Proceed To Checkout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
