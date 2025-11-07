import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../assets/css/style.css'; // Import original CSS
import '../assets/css/order.css'; // Import order page CSS

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample order status data for demonstration
  const sampleOrderStatus = {
    orderId: 'MMV-2025-001234',
    status: 'in-transit',
    estimatedDelivery: 'Oct 20, 2025',
    items: [
      {
        id: 1,
        name: 'Gardening Gloves',
        quantity: 2,
        price: 100.99
      },
      {
        id: 2,
        name: 'Gardening Boots',
        quantity: 1,
        price: 150.99
      }
    ],
    timeline: [
      {
        id: 1,
        status: 'order-placed',
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        date: 'Oct 15, 2025',
        time: '10:30 AM',
        completed: true
      },
      {
        id: 2,
        status: 'processing',
        title: 'Order Processing',
        description: 'We are preparing your order for shipment',
        date: 'Oct 16, 2025',
        time: '9:15 AM',
        completed: true
      },
      {
        id: 3,
        status: 'shipped',
        title: 'Order Shipped',
        description: 'Your order has been shipped and is on the way',
        date: 'Oct 17, 2025',
        time: '2:45 PM',
        completed: true
      },
      {
        id: 4,
        status: 'in-transit',
        title: 'In Transit',
        description: 'Your order is currently in transit',
        date: 'Oct 18, 2025',
        time: '8:30 AM',
        completed: true
      },
      {
        id: 5,
        status: 'out-for-delivery',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        date: '',
        time: '',
        completed: false
      },
      {
        id: 6,
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered',
        date: '',
        time: '',
        completed: false
      }
    ]
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real application, this would be an API call
      setOrderStatus(sampleOrderStatus);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'order-placed':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'in-transit':
        return 'In Transit';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return '';
    }
  };

  return (
    <>
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Order Tracking</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li className="active" aria-current="page">Order Tracking</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Order Tracking Section */}
        <section className="ordertracking bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="ordertracking__form">
                  <h4 className="mb-4">Track Your Order</h4>
                  <p className="mb-4">Enter your order tracking number to get real-time updates on your order status.</p>
                  
                  <form onSubmit={handleTrackOrder} className="mb-5">
                    <div className="form-group">
                      <label htmlFor="trackingNumber">Tracking Number *</label>
                      <input
                        type="text"
                        id="trackingNumber"
                        className="form-control"
                        placeholder="e.g. MMV-2025-001234"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                      {error && <div className="text-danger mt-2">{error}</div>}
                    </div>
                    <button 
                      type="submit" 
                      className="custom-btn mt-3"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Tracking...' : 'Track Order'}
                    </button>
                    <div className="text-center mt-4">
                      <Link to="/shop" className="custom-btn btn-outline">Continue Shopping</Link>
                    </div>
                  </form>

                  {orderStatus && (
                    <div className="ordertracking__status">
                      <div className="order-header mb-4">
                        <h5>Order Status: <span className="status-highlight">{getStatusText(orderStatus.status)}</span></h5>
                        <p className="mb-0"><strong>Order ID:</strong> {orderStatus.orderId}</p>
                        <p className="mb-0"><strong>Estimated Delivery:</strong> {orderStatus.estimatedDelivery}</p>
                      </div>

                      <div className="order-timeline mb-5">
                        <h6 className="mb-4">Order Timeline</h6>
                        <div className="timeline-steps">
                          {orderStatus.timeline.map((step) => (
                            <div 
                              key={step.id} 
                              className={`timeline-step ${step.completed ? 'completed' : ''} ${step.status === orderStatus.status ? 'active' : ''}`}
                            >
                              <div className="timeline-icon">
                                {step.completed ? (
                                  <i className="fa-solid fa-check"></i>
                                ) : step.status === orderStatus.status ? (
                                  <i className="fa-solid fa-box-open"></i>
                                ) : (
                                  <i className="fa-solid fa-hourglass-half"></i>
                                )}
                              </div>
                              <div className="timeline-content">
                                <h6>{step.title}</h6>
                                <p>{step.description}</p>
                                {step.date && (
                                  <p className="timeline-date">
                                    <i className="fa-regular fa-calendar"></i> {step.date} at {step.time}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="order-items">
                        <h6 className="mb-4">Order Items</h6>
                        <div className="items-list">
                          {orderStatus.items.map((item) => (
                            <div key={item.id} className="item-row">
                              <div className="item-details">
                                <h6>{item.name}</h6>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                              <div className="item-price">
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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

export default OrderTracking;