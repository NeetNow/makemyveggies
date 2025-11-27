import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../assets/css/style.css';
import '../assets/css/order.css';
import '../assets/css/checkout.css';

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();

  const [billingMode, setBillingMode] = useState('saved'); // 'saved' or 'new'
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethod: 'COD',
    notes: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch('/backend/api/get_addresses.php', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data || []);
          if (data.data && data.data.length > 0) {
            setSelectedAddressId(data.data[0].address_id);
            setBillingMode('saved');
          } else {
            setBillingMode('new');
          }
        } else {
          setBillingMode('new');
        }
      } catch (err) {
        setBillingMode('new');
      }
    };

    fetchAddresses();
  }, []);

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 && subtotal < 200 ? 15.0 : 0.0;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setError('');
    setPlacingOrder(true);

    try {
      const payload = {
        paymentMethod: formData.paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD',
        billingMode,
        address_id: billingMode === 'saved' ? selectedAddressId : null,
        notes: formData.notes || null,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postalCode
        }
      };

      const res = await fetch('/backend/api/place_order.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to place order');
        setPlacingOrder(false);
        return;
      }

      setOrderNumber(data.data.order_number);
      setOrderPlaced(true);
      await clearCart();

      // Scroll to top so user sees the order confirmation section
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Show success toast using react-toastify
      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Something went wrong while placing the order');
    } finally {
      setPlacingOrder(false);
    }
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
                      <p className="mb-4">Order ID: <strong>{orderNumber}</strong></p>
                      <p>A confirmation email has been sent to <strong>{formData.email}</strong></p>
                    </div>
                    
                    <div className="confirmation-details">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <h4>Billing Details</h4>
                          <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                          <p>{formData.addressLine1}</p>
                          {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                          <p>{formData.city}, {formData.state} {formData.postalCode}</p>
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
                                  <th>Description</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
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
                      <h4 className="mb-3">Billing Details</h4>

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
                        {/* Address mode options: only show when user has saved addresses */}
                      {addresses.length > 0 && (
                        <div className="mt-4">
                          <div className="mb-2">
                            <strong>Select billing / shipping address</strong>
                          </div>
                          <div className="mb-2">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="billingMode"
                                id="billing-saved"
                                value="saved"
                                checked={billingMode === 'saved'}
                                onChange={() => setBillingMode('saved')}
                              />
                              <label className="form-check-label" htmlFor="billing-saved">
                                Use saved address
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="billingMode"
                                id="billing-new"
                                value="new"
                                checked={billingMode === 'new'}
                                onChange={() => setBillingMode('new')}
                              />
                              <label className="form-check-label" htmlFor="billing-new">
                                Use different billing address
                              </label>
                            </div>
                          </div>

                          {billingMode === 'saved' && (
                            <div className="mb-3">
                              <label className="form-label">Choose from your saved addresses</label>
                              <div className="list-group">
                                {addresses.map(addr => (
                                  <button
                                    type="button"
                                    key={addr.address_id}
                                    className={`list-group-item list-group-item-action ${selectedAddressId === addr.address_id ? 'active' : ''}`}
                                    onClick={() => setSelectedAddressId(addr.address_id)}
                                  >
                                    <div>
                                      <div>{addr.address_line1}</div>
                                      {addr.address_line2 && <div>{addr.address_line2}</div>}
                                      <div>{addr.city}, {addr.state} {addr.postal_code}</div>
                                      <div>{addr.country}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                        {/* Address fields logic:
                           - If no saved addresses: always show fields
                           - If saved addresses: show fields only when billingMode === 'new'
                        */}
                        {(addresses.length === 0 || billingMode === 'new') && (
                          <>
                            <div className="col-12">
                              <div className="form-group">
                                <label>Address Line 1 *</label>
                                <input 
                                  type="text" 
                                  name="addressLine1" 
                                  className="form-control" 
                                  placeholder="Street address"
                                  value={formData.addressLine1}
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
                                  name="postalCode" 
                                  className="form-control" 
                                  value={formData.postalCode}
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
                          </>
                        )}
                        
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
                        <div className="form-check mb-2">
                          <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            className="form-check-input"
                            value="COD"
                            checked={formData.paymentMethod === 'COD'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="cod">
                            Cash on Delivery (COD)
                          </label>
                        </div>

                        <div className="form-check mb-2">
                          <input
                            type="radio"
                            id="online"
                            name="paymentMethod"
                            className="form-check-input"
                            value="ONLINE"
                            checked={formData.paymentMethod === 'ONLINE'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="online">
                            Online Payment (Coming Soon)
                          </label>
                        </div>

                        {formData.paymentMethod === 'ONLINE' && (
                          <p className="text-muted small mt-2">
                            Online payment is not enabled yet. Your order will be placed with payment status "Pending" and you will pay later.
                          </p>
                        )}
                      </div>

                      {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                          {error}
                        </div>
                      )}

                      <div className="place-order mt-4">
                        <button type="submit" className="custom-btn w-100" disabled={placingOrder}>
                          {placingOrder ? 'Placing Order...' : 'Place Order'}
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
