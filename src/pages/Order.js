import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

import '../assets/css/style.css'; // Import original CSS
import '../assets/css/order.css'; // Import order page CSS

const Order = () => {
  const { cartItems, getCartTotal } = useCart();

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
  const [orderData, setOrderData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const existing = document.querySelector('script[data-razorpay="checkout"]');
    if (existing) {
      setRazorpayReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpay = 'checkout';
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setRazorpayReady(false);
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isCartEmpty = !cartItems || cartItems.length === 0;

  // When order is not yet placed, use live cart totals from context
  const liveSubtotal = getCartTotal();

  // When order is placed, use backend response totals and items
  const displayItems = orderPlaced && orderData && Array.isArray(orderData.items)
    ? orderData.items
    : cartItems;

  const displaySubtotal = orderPlaced && orderData
    ? orderData.total_amount || 0
    : liveSubtotal;

  // Flat shipping for now; you can move this to backend later
  const displayShipping = orderPlaced ? 0 : 15.0;

  const displayTotal = displaySubtotal + displayShipping;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCartEmpty) {
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Map frontend payment method to backend values
    const paymentMap = {
      'cash-on-delivery': 'COD',
      'credit-card': 'ONLINE',
      'paypal': 'ONLINE',
    };

    const paymentMethod = paymentMap[formData.paymentMethod] || 'COD';

    const payload = {
      paymentMethod,
      notes: formData.notes || null,
      billingMode: 'new',
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_line1: formData.address,
        address_line2: '',
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.zipCode,
      },
    };

    let initiatedOrderId = null;
    let initiatedRazorpayOrderId = null;

    try {
      if (paymentMethod === 'ONLINE') {
        if (!razorpayReady || !window.Razorpay) {
          throw new Error('Payment system is not ready. Please refresh and try again.');
        }

        const initResp = await fetch('/backend/api/razorpay_create_order.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            paymentMethod: 'ONLINE'
          }),
        });

        const initData = await initResp.json();
        if (!initResp.ok || !initData.success) {
          throw new Error(initData.message || 'Failed to initiate payment');
        }

        const rp = initData.data;
        initiatedOrderId = rp.order_id;
        initiatedRazorpayOrderId = rp.razorpay_order_id;

        await new Promise((resolve, reject) => {
          const options = {
            key: rp.razorpay_key_id,
            amount: rp.amount,
            currency: rp.currency,
            name: 'MakeMyVeggies',
            description: `Order ${rp.order_number}`,
            order_id: rp.razorpay_order_id,
            prefill: {
              name: rp.name,
              email: rp.email,
              contact: rp.contact,
            },
            notes: {
              order_id: String(rp.order_id),
              order_number: rp.order_number,
            },
            handler: async function (response) {
              try {
                const verifyResp = await fetch('/backend/api/razorpay_verify.php', {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    order_id: rp.order_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyResp.json();
                if (!verifyResp.ok || !verifyData.success) {
                  throw new Error(verifyData.message || 'Payment verification failed');
                }

                setOrderPlaced(true);
                setOrderData({
                  order_id: rp.order_id,
                  order_number: rp.order_number,
                  payment_method: 'ONLINE',
                  total_amount: displayTotal,
                  items: displayItems,
                  billing: payload.billing,
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () => reject(new Error('PAYMENT_CANCELLED'))
            }
          };

          try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function () {
              reject(new Error('PAYMENT_FAILED'));
            });
            rzp.open();
          } catch (err) {
            reject(err);
          }
        });

        return;
      }

      const response = await fetch('/backend/api/place_order.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrderPlaced(true);
      setOrderData(data.data || null);
    } catch (err) {
      const msg = (err && err.message) ? String(err.message) : '';

      if ((msg === 'PAYMENT_CANCELLED' || msg === 'PAYMENT_FAILED') && initiatedOrderId) {
        try {
          await fetch('/backend/api/razorpay_mark_failed.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_id: initiatedOrderId,
              razorpay_order_id: initiatedRazorpayOrderId,
            }),
          });
        } catch (e) {
          // ignore secondary failure
        }

        try {
          await fetch('/backend/api/clear_cart.php', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (e) {
          // ignore
        }
      }

      if (msg === 'PAYMENT_CANCELLED') {
        setError('Payment popup closed. Your order is not confirmed. You can try again.');
      } else if (msg === 'PAYMENT_FAILED') {
        setError('Payment failed. Your order is not confirmed. Please try again.');
      } else {
        setError(msg || 'An error occurred while placing your order.');
      }
    } finally {
      setSubmitting(false);
    }
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
                          {displayItems && displayItems.length > 0 ? (
                            displayItems.map((item, index) => {
                              const name = item.name;
                              const qty = item.quantity;
                              const lineTotal = orderPlaced
                                ? (item.total_price || (item.unit_price || 0) * qty)
                                : (item.price || 0) * qty;

                              const key = item.cart_id || item.product_id || index;

                              return (
                                <li key={key}>
                                  <div className="product">
                                    <span>{name} × {qty}</span>
                                  </div>
                                  <div className="total">
                                    <span>${lineTotal.toFixed(2)}</span>
                                  </div>
                                </li>
                              );
                            })
                          ) : (
                            <li>
                              <div className="product">
                                <span>Your cart is empty.</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="order-subtotal">
                        <ul>
                          <li>
                            <span>Subtotal</span>
                            <span>${displaySubtotal.toFixed(2)}</span>
                          </li>
                          <li>
                            <span>Shipping</span>
                            <span>${displayShipping.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="order-total">
                        <ul>
                          <li>
                            <span>Total</span>
                            <span className="fw-bold">${displayTotal.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger mt-3" role="alert">
                        {error}
                      </div>
                    )}

                    {orderPlaced && orderData && (
                      <div className="alert alert-success mt-3" role="alert">
                        Order <strong>{orderData.order_number}</strong> placed successfully!
                      </div>
                    )}

                    <div className="place-order mt-4">
                      <button type="submit" className="custom-btn w-100" disabled={submitting}>
                        {submitting ? 'Placing Order...' : 'Place Order'}
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