import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import '../assets/css/auth.css';

const UserProfile = () => {
    const { currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();
    
    const [activeSection, setActiveSection] = useState('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersLimit] = useState(10);
    const [ordersTotalPages, setOrdersTotalPages] = useState(1);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

    // Product rating state for ordered items
    const [productRatings, setProductRatings] = useState({});
    const [ratingSubmitting, setRatingSubmitting] = useState({});
    const [ratingError, setRatingError] = useState({});
    const [ratingSuccess, setRatingSuccess] = useState({});

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showOrderModal) return;
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOrderModal]);

    const loadUserProfile = useCallback(async () => {
        try {
            if (!currentUser) {
                return;
            }

            const response = await fetch(`/backend/api/get_user_profile.php`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                // Merge API data with existing user data
                setUser(prev => ({
                    ...prev,
                    ...data.user,
                    // Ensure email comes from currentUser if not in API response
                    email: data.user.email || currentUser.email || prev.email
                }));
            } else {
                setMessage('Failed to load profile: ' + data.message);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('An error occurred while loading profile');
            // If API fails, ensure we still have basic user data from currentUser
            setUser(prev => ({
                ...prev,
                firstName: currentUser.firstName || prev.firstName,
                lastName: currentUser.lastName || prev.lastName,
                email: currentUser.email || prev.email
            }));
        } finally {
            setIsLoading(false);
        }
    }, [currentUser, setUser]);

    const loadUserOrders = useCallback(async (page = 1) => {
        try {
            if (!currentUser) return;

            const response = await fetch(`/backend/api/get_user_orders.php?page=${page}&limit=${ordersLimit}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                setOrders(data.orders);
                const totalPages = (data.pagination && data.pagination.total_pages) ? Number(data.pagination.total_pages) : 1;
                setOrdersTotalPages(totalPages > 0 ? totalPages : 1);
                setOrdersPage(page);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }, [currentUser, ordersLimit]);

    const fetchOrderDetails = useCallback(async (order) => {
        setLoadingOrderDetails(true);
        setActiveSection('orderDetails');
        try {
            // Try multiple possible identifiers in order of likelihood
            const possibleIds = [order.id, order.order_id, order.orderNumber, order.order_number, order.orderId];
            const idToUse = possibleIds.find(id => id != null && id !== '');
            if (!idToUse) {
                toast.error('Order identifier is missing');
                setActiveSection('orders');
                return;
            }
            const response = await fetch(`/backend/api/get_order_details.php?id=${idToUse}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                setOrderDetails(data.order);
                
                // Fetch existing reviews for these products
                const productIds = data.order.items?.map(item => {
                    // Try different possible field names for product ID
                    return item.productId || item.product_id || item.productId || item.id;
                }).filter(Boolean);
                if (productIds && productIds.length > 0) {
                    await fetchExistingReviews(productIds);
                }
            } else {
                // If backend says not found, show a helpful error inside the tab instead of closing it
                setOrderDetails(null);
                toast.error(data.message || 'Order not found');
                // Keep tab open so user can see error and go back manually
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            toast.error('Failed to load order details');
            setActiveSection('orders');
        } finally {
            setLoadingOrderDetails(false);
        }
    }, [setActiveSection]);

    const fetchExistingReviews = async (productIds) => {
        try {
            // Fetch user's existing reviews for these products
            const response = await fetch(`/backend/api/get_user_reviews.php`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            
            if (data.status === 'success' && data.reviews) {
                // Build productRatings map from existing reviews
                const ratings = {};
                data.reviews.forEach(review => {
                    if (productIds.includes(review.product_id)) {
                        ratings[review.product_id] = review.rating;
                    }
                });
                setProductRatings(ratings);
            }
        } catch (err) {
            console.error('Error fetching existing reviews:', err);
        }
    };

    useEffect(() => {
        if (!showOrderModal) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeOrderModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showOrderModal]);

    const closeOrderModal = () => {
        setShowOrderModal(false);
        setOrderDetails(null);
    };

    const backToOrders = () => {
        setActiveSection('orders');
        setOrderDetails(null);
    };

    const submitProductRating = async (productId, ratingValue) => {
        setRatingError(prev => ({ ...prev, [productId]: null }));
        setRatingSuccess(prev => ({ ...prev, [productId]: null }));

        const ratingNum = Number(ratingValue);
        if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            setRatingError(prev => ({ ...prev, [productId]: 'Please select a rating between 1-5.' }));
            return;
        }

        try {
            setRatingSubmitting(prev => ({ ...prev, [productId]: true }));
            const res = await fetch(`/backend/api/submit_review.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    rating: ratingNum,
                }),
            });

            const data = await res.json();
            if (!res.ok || data.status !== 'success') {
                // If already reviewed, show existing rating instead of error
                if (data.message && data.message.includes('already reviewed')) {
                    setRatingSuccess(prev => ({ ...prev, [productId]: 'Rating already submitted' }));
                    return;
                }
                setRatingError(prev => ({ ...prev, [productId]: data.message || 'Failed to submit rating.' }));
                return;
            }

            setRatingSuccess(prev => ({ ...prev, [productId]: 'Rating submitted successfully!' }));
            setProductRatings(prev => ({ ...prev, [productId]: ratingNum }));
        } catch (err) {
            setRatingError(prev => ({ ...prev, [productId]: err.message || 'Failed to submit rating.' }));
        } finally {
            setRatingSubmitting(prev => ({ ...prev, [productId]: false }));
        }
    };

    useEffect(() => {
        // Wait for authentication check to complete
        if (loading) {
            return;
        }
        
        // Check if user is authenticated after loading is complete
        if (!currentUser) {
            navigate('/login');
            return;
        }
        
        // Initialize user data with currentUser data
        setUser(prev => ({
            ...prev,
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            addressLine1: currentUser.addressLine1 || '',
            addressLine2: currentUser.addressLine2 || '',
            city: currentUser.city || '',
            state: currentUser.state || '',
            country: currentUser.country || '',
            postalCode: currentUser.postalCode || ''
        }));
        
        // Load user profile data
        loadUserProfile();
        loadUserOrders(1);
    }, [currentUser, loading, navigate, loadUserProfile, loadUserOrders, setUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('/backend/api/update_user_profile.php', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    ...user
                }),
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setMessage('Profile updated successfully!');
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setMessage('Failed to update profile: ' + data.message);
                toast.error('Failed to update profile: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('An error occurred while updating profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage('New password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('/backend/api/change_password.php', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setMessage('Password changed successfully!');
                toast.success('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setMessage('Failed to change password: ' + data.message);
                toast.error('Failed to change password: ' + data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('An error occurred while changing password');
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Show loading while authentication is being checked
    if (loading) {
        return (
            <div className="register-page banner">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="register-box text-center">
                                <h2>Checking Authentication...</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading while profile data is being loaded
    if (isLoading) {
        return (
            <>
                <section className="pageheader overflow-hidden" style={{
                    backgroundImage: 'url(/assets/img/pageheader/bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div className="container">
                        <div className="pageheader__content">
                            <h2>User Profile</h2>
                        </div>
                    </div>
                </section>
                <div className="profile-page">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="text-center py-5">
                                    <h3>Loading Profile Data...</h3>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Show loading when order details are being fetched and we are on the orderDetails tab
    if (activeSection === 'orderDetails' && loadingOrderDetails) {
        return (
            <>
                <section className="pageheader overflow-hidden" style={{
                    backgroundImage: 'url(/assets/img/pageheader/bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div className="container">
                        <div className="pageheader__content">
                            <h2>User Profile</h2>
                        </div>
                    </div>
                </section>
                <div className="profile-page">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="text-center py-5">
                                    <h3>Loading Order Details...</h3>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Get section title for mobile header
    const getSectionTitle = () => {
        switch (activeSection) {
            case 'profile':
                return 'Personal Information';
            case 'address':
                return 'Address Information';
            case 'orders':
                return 'Order History';
            case 'orderDetails':
                return 'Order Details';
            case 'password':
                return 'Change Password';
            case 'settings':
                return 'Account Settings';
            default:
                return 'Personal Information';
        }
    };

    // Handle section change and close mobile menu
    const handleSectionChange = (section) => {
        setActiveSection(section);
        setIsMobileMenuOpen(false);
        if (section !== 'orderDetails') {
            setOrderDetails(null);
        }
    };

    // Render different sections based on activeSection
    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return renderProfileSection();
            case 'address':
                return renderAddressSection();
            case 'orders':
                return renderOrdersSection();
            case 'orderDetails':
                return renderOrderDetailsSection();
            case 'password':
                return renderPasswordSection();
            case 'settings':
                return renderSettingsSection();
            default:
                return renderProfileSection();
        }
    };

    const renderProfileSection = () => (
        <div className="profile-content">
            <h3 className="mb-4">Personal Information</h3>
            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleUpdateProfile}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={user.firstName || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your first name"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={user.lastName || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={user.email || ''}
                        disabled
                    />
                    <small className="text-muted">Email cannot be changed</small>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={user.phone || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                    />
                </div>
                <div className="form-actions">
                    {!isEditing ? (
                        <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        <div>
                            <button type="submit" className="btn btn-success me-2">
                                Save Changes
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    const renderAddressSection = () => (
        <div className="profile-content">
            <h3 className="mb-4">Address Information</h3>
            <form onSubmit={handleUpdateProfile}>
                <div className="form-group mb-3">
                    <label htmlFor="addressLine1" className="form-label">Address Line 1</label>
                    <input
                        type="text"
                        className="form-control"
                        id="addressLine1"
                        name="addressLine1"
                        value={user.addressLine1}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="addressLine2" className="form-label">Address Line 2</label>
                    <input
                        type="text"
                        className="form-control"
                        id="addressLine2"
                        name="addressLine2"
                        value={user.addressLine2}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={user.city}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="state" className="form-label">State</label>
                            <input
                                type="text"
                                className="form-control"
                                id="state"
                                name="state"
                                value={user.state}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input
                                type="text"
                                className="form-control"
                                id="country"
                                name="country"
                                value={user.country}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="postalCode" className="form-label">Postal Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="postalCode"
                                name="postalCode"
                                value={user.postalCode}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    {!isEditing ? (
                        <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            Edit Address
                        </button>
                    ) : (
                        <div>
                            <button type="submit" className="btn btn-success me-2">
                                Save Changes
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    const renderOrdersSection = () => (
        <div className="profile-content">
            <h3 className="mb-4">Order History</h3>
            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map((order, index) => (
                        <div key={index} className="order-item card mb-3" style={{ cursor: 'pointer' }} onClick={() => fetchOrderDetails(order)}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5 className="card-title">Order #{order.orderNumber || order.order_number || order.id}</h5>
                                        <p className="card-text">
                                            <small className="text-muted">Placed on {order.date}</small>
                                        </p>
                                        <p className="card-text">{order.items} items</p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <h5 className="text-success">
  ₹{Number(String(order?.total).replace(/[^0-9.]/g, "") || 0).toFixed(2)}
</h5>
                                        <div className="d-flex align-items-center justify-content-end gap-2 mt-1">
                                            <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Shipped' ? 'bg-info' : order.status === 'Confirmed' ? 'bg-primary' : 'bg-warning'}`}>
                                                {order.status}
                                            </span>
                                            <button className="btn btn-outline-primary btn-sm" style={{ fontSize: '12px', padding: '4px 12px' }} onClick={(e) => { e.stopPropagation(); fetchOrderDetails(order); }}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                    <h5>No Orders Yet</h5>
                    <p className="text-muted">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                </div>
            )}

            {orders.length > 0 && ordersTotalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Order history pagination">
                        <ul className="pagination mb-0">
                            <li className={`page-item ${ordersPage <= 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    type="button"
                                    onClick={() => loadUserOrders(ordersPage - 1)}
                                    disabled={ordersPage <= 1}
                                >
                                    Previous
                                </button>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">{ordersPage} / {ordersTotalPages}</span>
                            </li>
                            <li className={`page-item ${ordersPage >= ordersTotalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    type="button"
                                    onClick={() => loadUserOrders(ordersPage + 1)}
                                    disabled={ordersPage >= ordersTotalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );

    const renderOrderDetailsSection = () => (
        <div className="profile-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Order Details</h3>
                <button className="btn btn-outline-secondary btn-sm" onClick={backToOrders}>
                    <i className="fa-solid fa-arrow-left me-2"></i>Back to Orders
                </button>
            </div>

            {loadingOrderDetails ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading order details...</p>
                </div>
            ) : orderDetails ? (
                <div className="order-details">
                    {/* Order Header */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Order Number</h6>
                            <p className="fw-bold">#{orderDetails.orderNumber}</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <h6 className="text-muted mb-1">Order Date</h6>
                            <p>{new Date(orderDetails.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="row mb-4">
                        <div className="col text-md-end">
                            <h6 className="text-muted mb-1">Payment Status</h6>
                            <span className={`badge ${orderDetails.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                {orderDetails.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Tracking ID */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6 className="text-muted mb-1">Order Tracking ID</h6>
                            <p className="fw-bold font-monospace" style={{ color: orderDetails.orderTrackingId ? '#2c5f2d' : '#999' }}>
                                {orderDetails.orderTrackingId || 'NA'}
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            {orderDetails.orderTrackingId ? (
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => window.open(`https://www.indiapost.gov.in/_layouts/15/dop.dashboard.tracking/track.aspx?track=${orderDetails.orderTrackingId}`, '_blank')}
                                >
                                    <i className="fa-solid fa-location-arrow me-2"></i>
                                    Track on India Post
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* Product Items */}
                    <h6 className="border-bottom pb-2 mb-3">Items Ordered</h6>
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                        <div className="table-responsive mb-4">
                            <table className="table table-borderless">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Price</th>
                                        <th className="text-end">Total</th>
                                        <th className="text-center">Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="mb-0 fw-semibold">{item.title}</p>
                                                        <small className="text-muted">SKU: {item.sku}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">₹{item.unitPrice.toFixed(2)}</td>
                                            <td className="text-end">₹{item.totalPrice.toFixed(2)}</td>
                                            <td className="text-center">
                                                {/* Rate Product */}
                                                <div className="rating-section">
                                                    {(() => {
                                                        // Try different possible field names for product ID
                                                        const pid = item.productId || item.product_id || item.productId || item.id;
                                                        return (
                                                            <>
                                                                <div className="star-rating" role="radiogroup" aria-label="Rate product">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <button
                                                                            key={star}
                                                                            type="button"
                                                                            className={`star-btn btn btn-link p-0 ${(productRatings[pid] || 0) >= star ? 'text-warning' : 'text-muted'}`}
                                                                            onClick={() => submitProductRating(pid, star)}
                                                                            aria-label={`${star} star`}
                                                                            disabled={ratingSubmitting[pid]}
                                                                            style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                                                                        >
                                                                            <i className={`${(productRatings[pid] || 0) >= star ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {ratingError[pid] && (
                                                                    <small className="text-danger d-block mt-1">{ratingError[pid]}</small>
                                                                )}
                                                                {ratingSuccess[pid] && (
                                                                    <small className="text-success d-block mt-1">{ratingSuccess[pid]}</small>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">No items found for this order.</p>
                    )}

                    {/* Order Summary */}
                    <div className="row justify-content-end mb-4">
                        <div className="col-md-6">
                            <div className="bg-light p-3 rounded">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>₹{orderDetails.subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>₹{orderDetails.shippingCost?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold border-top pt-2">
                                    <span>Total:</span>
                                    <span className="text-success">₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <h6 className="border-bottom pb-2 mb-3">Shipping Address</h6>
                    <div className="bg-light p-3 rounded mb-3">
                        <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                            {orderDetails.shippingAddress || 'No shipping address available'}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <h6 className="border-bottom pb-2 mb-3">Payment Method</h6>
                    <p className="mb-0">
                        <i className="fa-solid fa-credit-card me-2"></i>
                        {orderDetails.paymentMethod || 'Online Payment'}
                    </p>
                </div>
            ) : (
                <div className="alert alert-danger">Failed to load order details.</div>
            )}
        </div>
    );

    const renderPasswordSection = () => (
        <div className="profile-content">
            <h3 className="mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword}>
                <div className="form-group mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Change Password
                </button>
            </form>
        </div>
    );

    const renderSettingsSection = () => (
        <div className="profile-content">
            <h3 className="mb-4">Account Settings</h3>
            
            {/* Security Settings */}
            <div className="settings-section mb-5">
                <div className="settings-header mb-3">
                    <h5 className="settings-title">
                        <i className="fa-solid fa-shield-alt me-2 text-primary"></i>
                        Security
                    </h5>
                </div>
                <div className="settings-item">
                    <div className="settings-info">
                        <h6 className="mb-1">Password</h6>
                        <p className="text-muted mb-0">Update your password to keep your account secure</p>
                    </div>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => setActiveSection('password')}
                    >
                        <i className="fa-solid fa-lock me-2"></i>
                        Change Password
                    </button>
                </div>
            </div>

            {/* Account Management */}
            <div className="settings-section">
                <div className="settings-header mb-3">
                    <h5 className="settings-title">
                        <i className="fa-solid fa-exclamation-triangle me-2 text-warning"></i>
                        Account Management
                    </h5>
                </div>
                <div className="settings-item danger-zone">
                    <div className="settings-info">
                        <h6 className="mb-1 text-danger">Delete Account</h6>
                        <p className="text-muted mb-0">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button className="btn btn-outline-danger">
                        <i className="fa-solid fa-trash me-2"></i>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Page Header */}
            <section className="pageheader overflow-hidden" style={{
                backgroundImage: 'url(/assets/img/pageheader/bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className="container">
                    <div className="pageheader__content">
                        <h2>User Profile</h2>
                    </div>
                </div>
            </section>

            <div className="profile-page">
                {/* Mobile Header */}
            <div className="mobile-header d-md-none" ref={mobileMenuRef}>
                <div className="container-fluid">
                    <div className="mobile-header-content">
                        <button 
                            className="btn btn-link text-dark p-0 me-2"
                            onClick={() => navigate(-1)}
                            style={{ fontSize: '1.2rem' }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div className="mobile-user-info">
                            <i className="fa-solid fa-user-circle fa-2x text-primary me-2"></i>
                            <div>
                                <h6 className="mb-0">{currentUser?.firstName} {currentUser?.lastName}</h6>
                                <small className="text-muted">{getSectionTitle()}</small>
                            </div>
                        </div>
                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="mobile-nav-dropdown">
                        <nav className="mobile-nav">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
                                        onClick={() => handleSectionChange('profile')}
                                    >
                                        <i className="fa-solid fa-user me-2"></i>
                                        Personal Info
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'address' ? 'active' : ''}`}
                                        onClick={() => handleSectionChange('address')}
                                    >
                                        <i className="fa-solid fa-map-marker-alt me-2"></i>
                                        Address
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'orders' ? 'active' : ''}`}
                                        onClick={() => handleSectionChange('orders')}
                                    >
                                        <i className="fa-solid fa-box me-2"></i>
                                        Order History
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
                                        onClick={() => handleSectionChange('settings')}
                                    >
                                        <i className="fa-solid fa-cog me-2"></i>
                                        Settings
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link text-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="fa-solid fa-sign-out-alt me-2"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <div className="container-fluid">
                <div className="row">
                    {/* Desktop Sidebar */}
                    <div className="col-md-3 col-lg-2 sidebar d-none d-md-block">
                        <div className="profile-sidebar">
                            <div className="user-info text-center mb-4">
                                <div className="user-avatar">
                                    <i className="fa-solid fa-user-circle fa-4x text-primary"></i>
                                </div>
                                <h5 className="mt-2">{currentUser?.firstName} {currentUser?.lastName}</h5>
                                <p className="text-muted">{currentUser?.email}</p>
                            </div>
                            
                            <nav className="sidebar-nav">
                                <ul className="nav flex-column">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
                                            onClick={() => setActiveSection('profile')}
                                        >
                                            <i className="fa-solid fa-user me-2"></i>
                                            Personal Info
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeSection === 'address' ? 'active' : ''}`}
                                            onClick={() => setActiveSection('address')}
                                        >
                                            <i className="fa-solid fa-map-marker-alt me-2"></i>
                                            Address
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeSection === 'orders' ? 'active' : ''}`}
                                            onClick={() => setActiveSection('orders')}
                                        >
                                            <i className="fa-solid fa-box me-2"></i>
                                            Order History
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
                                            onClick={() => setActiveSection('settings')}
                                        >
                                            <i className="fa-solid fa-cog me-2"></i>
                                            Settings
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className="nav-link text-danger"
                                            onClick={handleLogout}
                                        >
                                            <i className="fa-solid fa-sign-out-alt me-2"></i>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="col-12 col-md-9 col-lg-10 main-content">
                        <div className="content-wrapper">
                            <div className="d-none d-md-flex align-items-center mb-3">
                                <button 
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="fa-solid fa-arrow-left me-2"></i>
                                    Back
                                </button>
                            </div>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && (
            <div
                className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                tabIndex="-1"
                onMouseDown={(e) => {
                    if (e.target === e.currentTarget) closeOrderModal();
                }}
            >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Order Details</h5>
                            <button type="button" className="btn-close" onClick={closeOrderModal}></button>
                        </div>
                        <div className="modal-body">
                            {loadingOrderDetails ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading order details...</p>
                                </div>
                            ) : orderDetails ? (
                                <div className="order-details">
                                    {/* Order Header */}
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-1">Order Number</h6>
                                            <p className="fw-bold">#{orderDetails.orderNumber}</p>
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                            <h6 className="text-muted mb-1">Order Date</h6>
                                            <p>{new Date(orderDetails.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    {/* Order Status */}
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-1">Order Status</h6>
                                            <span className={`badge ${orderDetails.status === 'Delivered' ? 'bg-success' : orderDetails.status === 'Shipped' ? 'bg-info' : orderDetails.status === 'Confirmed' ? 'bg-primary' : 'bg-warning'}`}>
                                                {orderDetails.status}
                                            </span>
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                            <h6 className="text-muted mb-1">Payment Status</h6>
                                            <span className={`badge ${orderDetails.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                                {orderDetails.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Items */}
                                    <h6 className="border-bottom pb-2 mb-3">Items Ordered</h6>
                                    {orderDetails.items && orderDetails.items.length > 0 ? (
                                        <div className="table-responsive mb-4">
                                            <table className="table table-borderless">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Product</th>
                                                        <th className="text-center">Qty</th>
                                                        <th className="text-end">Price</th>
                                                        <th className="text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderDetails.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {item.image && (
                                                                        <img 
                                                                            src={item.image} 
                                                                            alt={item.title} 
                                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <p className="mb-0 fw-semibold">{item.title}</p>
                                                                        <small className="text-muted">SKU: {item.sku}</small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">{item.quantity}</td>
                                                            <td className="text-end">₹{item.unitPrice.toFixed(2)}</td>
                                                            <td className="text-end">₹{item.totalPrice.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted">No items found for this order.</p>
                                    )}

                                    {/* Order Summary */}
                                    <div className="row justify-content-end mb-4">
                                        <div className="col-md-6">
                                            <div className="bg-light p-3 rounded">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Subtotal:</span>
                                                    <span>₹{orderDetails.subtotal?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Shipping:</span>
                                                    <span>₹{orderDetails.shippingCost?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="d-flex justify-content-between fw-bold border-top pt-2">
                                                    <span>Total:</span>
                                                    <span className="text-success">₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <h6 className="border-bottom pb-2 mb-3">Shipping Address</h6>
                                    <div className="bg-light p-3 rounded mb-3">
                                        <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                                            {orderDetails.shippingAddress || 'No shipping address available'}
                                        </p>
                                    </div>

                                    {/* Payment Method */}
                                    <h6 className="border-bottom pb-2 mb-3">Payment Method</h6>
                                    <p className="mb-0">
                                        <i className="fa-solid fa-credit-card me-2"></i>
                                        {orderDetails.paymentMethod || 'Online Payment'}
                                    </p>
                                </div>
                            ) : (
                                <div className="alert alert-danger">Failed to load order details.</div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeOrderModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <Footer />
        </>
    );
};

export default UserProfile;
