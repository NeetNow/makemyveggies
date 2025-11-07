import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../assets/css/style.css';
import '../assets/css/order.css';
import '../assets/css/checkout.css';

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    notes: ''
  });
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 && subtotal < 200 ? 15.00 : 0.00;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, this would submit the order to the backend
    // For now, we'll simulate a successful order placement
    
    // Generate a random order ID
    const newOrderId = 'MMV-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setOrderPlaced(true);
    
    // Clear the cart after successful order
    clearCart();
  };

  return (
    <>
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>{orderPlaced ? "Order Confirmation" : "Checkout"}</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li><Link to="/cart">Cart</Link></li>
                  <li className="active" aria-current="page">{orderPlaced ? "Order Confirmation" : "Checkout"}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Checkout Section */}
        <section className="checkoutpage bg-white">
          <div className="container">
            {orderPlaced ? (
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="order-confirmation">
                    <div className="confirmation-header text-center mb-5">
                      <div className="icon mb-4">
                        <i className="fa-solid fa-check-circle fa-2x text-success"></i>
                      </div>
                      <h2 className="mb-3">Thank You! Your Order Has Been Placed</h2>
                      <p className="mb-4">Order ID: <strong>{orderId}</strong></p>
                      <p>A confirmation email has been sent to <strong>{formData.email}</strong></p>
                    </div>
                    
                    <div className="confirmation-details">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <h4>Billing Details</h4>
                          <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                          <p>{formData.address}</p>
                          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                          <p>{formData.country}</p>
                          <p>Email: {formData.email}</p>
                          <p>Phone: {formData.phone}</p>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                          <h4>Order Summary</h4>
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cartItems.map((item) => (
                                  <tr key={item.cart_id || item.id}>
                                    <td>
                                      {item.name} <strong>× {item.quantity}</strong>
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>Subtotal</td>
                                  <td>${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>Shipping</td>
                                  <td>${shipping.toFixed(2)}</td>
                                </tr>
                                <tr className="total">
                                  <td><strong>Total</strong></td>
                                  <td><strong className="primary-color">${total.toFixed(2)}</strong></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-4">
                        <Link to="/shop" className="custom-btn">Continue Shopping</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-lg-8">
                    <div className="checkoutpage__billingdetails">
                      <h4 className="mb-4">Billing Details</h4>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>First Name *</label>
                            <input 
                              type="text" 
                              name="firstName" 
                              className="form-control" 
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Last Name *</label>
                            <input 
                              type="text" 
                              name="lastName" 
                              className="form-control" 
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Email Address *</label>
                            <input 
                              type="email" 
                              name="email" 
                              className="form-control" 
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Phone *</label>
                            <input 
                              type="tel" 
                              name="phone" 
                              className="form-control" 
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-group">
                            <label>Address *</label>
                            <input 
                              type="text" 
                              name="address" 
                              className="form-control" 
                              placeholder="Street address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Town / City *</label>
                            <input 
                              type="text" 
                              name="city" 
                              className="form-control" 
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>State *</label>
                            <input 
                              type="text" 
                              name="state" 
                              className="form-control" 
                              value={formData.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Postcode / ZIP *</label>
                            <input 
                              type="text" 
                              name="zipCode" 
                              className="form-control" 
                              value={formData.zipCode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Country *</label>
                            <select 
                              name="country" 
                              className="form-control" 
                              value={formData.country}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Country</option>
                              <option value="India">India</option>
                              <option value="Bangladesh">Bangladesh</option>
                              <option value="UK">United Kingdom</option>
                              <option value="USA">United States</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-group">
                            <label>Order Notes (optional)</label>
                            <textarea 
                              name="notes" 
                              className="form-control" 
                              rows="4"
                              placeholder="Notes about your order, e.g. special instructions for delivery."
                              value={formData.notes}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="checkoutpage__paymentmethod mt-4">
                      <h4 className="mb-4">Payment Method</h4>
                      
                      <div className="payment-options">
                        <div className="form-check mb-3">
                          <input 
                            type="radio" 
                            id="credit-card" 
                            name="paymentMethod" 
                            className="form-check-input" 
                            value="credit-card"
                            checked={formData.paymentMethod === 'credit-card'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="credit-card">
                            Credit Card
                          </label>
                        </div>
                        
                        <div className="form-check mb-3">
                          <input 
                            type="radio" 
                            id="paypal" 
                            name="paymentMethod" 
                            className="form-check-input" 
                            value="paypal"
                            checked={formData.paymentMethod === 'paypal'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="paypal">
                            PayPal
                          </label>
                        </div>
                        
                        {formData.paymentMethod === 'credit-card' && (
                          <div className="credit-card-form">
                            <div className="row g-3">
                              <div className="col-12">
                                <div className="form-group">
                                  <label>Card Number *</label>
                                  <input 
                                    type="text" 
                                    name="cardNumber" 
                                    className="form-control" 
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    required={formData.paymentMethod === 'credit-card'}
                                  />
                                </div>
                              </div>
                              
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Name on Card *</label>
                                  <input 
                                    type="text" 
                                    name="cardName" 
                                    className="form-control" 
                                    placeholder="John Doe"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    required={formData.paymentMethod === 'credit-card'}
                                  />
                                </div>
                              </div>
                              
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label>Expiry Date *</label>
                                  <input 
                                    type="text" 
                                    name="expiryDate" 
                                    className="form-control" 
                                    placeholder="MM/YY"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    required={formData.paymentMethod === 'credit-card'}
                                  />
                                </div>
                              </div>
                              
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label>CVV *</label>
                                  <input 
                                    type="text" 
                                    name="cvv" 
                                    className="form-control" 
                                    placeholder="123"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required={formData.paymentMethod === 'credit-card'}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="place-order mt-4">
                        <button type="submit" className="custom-btn w-100">
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="checkoutpage__order">
                      <h4 className="mb-4">Your Order</h4>
                      
                      {cartItems.length === 0 ? (
                        <div className="empty-cart">
                          <p>Your cart is empty</p>
                          <Link to="/shop" className="custom-btn">Continue Shopping</Link>
                        </div>
                      ) : (
                        <div className="order-table">
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cartItems.map((item) => (
                                  <tr key={item.cart_id || item.id}>
                                    <td>
                                      {item.name} <strong>× {item.quantity}</strong>
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>Subtotal</td>
                                  <td>${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>Shipping</td>
                                  <td>${shipping.toFixed(2)}</td>
                                </tr>
                                <tr className="total">
                                  <td><strong>Total</strong></td>
                                  <td><strong className="primary-color">${total.toFixed(2)}</strong></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
