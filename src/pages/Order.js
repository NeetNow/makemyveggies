import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/style.css'; // Import original CSS
import '../assets/css/order.css'; // Import order page CSS

const Order = () => {
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

  const [cartItems] = useState([
    {
      id: 1,
      name: 'Gardening Gloves',
      price: 100.99,
      quantity: 2,
      image: '/assets/img/shop/img1.jpg'
    },
    {
      id: 2,
      name: 'Gardening Boots',
      price: 150.99,
      quantity: 1,
      image: '/assets/img/shop/img2.jpg'
    }
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would submit the order
    alert('Order placed successfully!');
  };

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Checkout</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li><Link to="/cart">Cart</Link></li>
                  <li className="active" aria-current="page">Checkout</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Checkout Section */}
        <section className="checkoutpage bg-white">
          <div className="container">
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
                      
                      <div className="form-check mb-3">
                        <input 
                          type="radio" 
                          id="cash-on-delivery" 
                          name="paymentMethod" 
                          className="form-check-input" 
                          value="cash-on-delivery"
                          checked={formData.paymentMethod === 'cash-on-delivery'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="cash-on-delivery">
                          Cash on Delivery
                        </label>
                      </div>
                    </div>
                    
                    {formData.paymentMethod === 'credit-card' && (
                      <div className="credit-card-form mt-4">
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
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="col-12">
                            <div className="form-group">
                              <label>Name on Card *</label>
                              <input 
                                type="text" 
                                name="cardName" 
                                className="form-control" 
                                placeholder="John Doe"
                                value={formData.cardName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Expiry Date *</label>
                              <input 
                                type="text" 
                                name="expiryDate" 
                                className="form-control" 
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>CVV *</label>
                              <input 
                                type="text" 
                                name="cvv" 
                                className="form-control" 
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-lg-4">
                  <div className="checkoutpage__order">
                    <h4 className="mb-4">Your Order</h4>
                    
                    <div className="order-details">
                      <div className="order-header">
                        <ul>
                          <li>Product</li>
                          <li className="text-end">Total</li>
                        </ul>
                      </div>
                      
                      <div className="order-body">
                        <ul>
                          {cartItems.map((item) => (
                            <li key={item.id}>
                              <div className="product">
                                <span>{item.name} × {item.quantity}</span>
                              </div>
                              <div className="total">
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="order-subtotal">
                        <ul>
                          <li>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </li>
                          <li>
                            <span>Shipping</span>
                            <span>${shipping.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="order-total">
                        <ul>
                          <li>
                            <span>Total</span>
                            <span className="fw-bold">${total.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="place-order mt-4">
                      <button type="submit" className="custom-btn w-100">
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Order;