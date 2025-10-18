import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';
import '../assets/css/profile.css';

const UserProfile = () => {
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
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Load user profile data
        loadUserProfile();
        loadUserOrders();
    }, []);

    const loadUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost/makemyveggies/backend/api/get_user_profile.php?userId=${userId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setUser(data.user);
            } else {
                setMessage('Failed to load profile: ' + data.message);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('An error occurred while loading profile');
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await fetch(`http://localhost/makemyveggies/backend/api/get_user_orders.php?userId=${userId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

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
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost/makemyveggies/backend/api/update_user_profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    ...user
                }),
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setMessage('Failed to update profile: ' + data.message);
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
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost/makemyveggies/backend/api/change_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setMessage('Password changed successfully!');
                setIsChangingPassword(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setMessage('Failed to change password: ' + data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('An error occurred while changing password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="register-page banner">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="register-box text-center">
                                <h2>Loading Profile...</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="register-page banner">
            {/* Background Images */}
            <div className="position_bshape contentrightimg imghover d-md-block d-none">
                <img src="/assets/img/home-1/banner/bannerightimg.png" alt="banner" />
            </div>
            <div className="position_bshape topleftimg dnone">
                <img src="/assets/img/home-1/banner/shape1.png" alt="banner" />
            </div>
            <div className="position_bshape topright">
                <img src="/assets/img/home-1/banner/shape5.png" alt="banner" />
            </div>
            <div className="position_bshape bottomleft d-xl-block d-none">
                <img src="/assets/img/home-1/banner/shpae2.png" alt="banner" />
            </div>
            <div className="position_bshape bottommiddle d-lg-block d-none">
                <img src="/assets/img/home-1/banner/shape3.png" alt="banner" />
            </div>
            <div className="position_bshape bottomright d-sm-block d-none">
                <img src="/assets/img/home-1/banner/shape4.png" alt="banner" />
            </div>
            <div className="position_bshape middleshape d-lg-block d-none">
                <img src="/assets/img/home-1/banner/shape6.png" alt="banner" />
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-lg-8 mx-auto">
                        <div className="register-box">
                            <div className="register-header text-center">
                                <h2>My Profile</h2>
                                <p>Manage your account information</p>
                            </div>

                            {message && (
                                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                                    {message}
                                </div>
                            )}

                            {/* Profile Navigation */}
                            <div className="profile-nav mb-4">
                                <div className="btn-group w-100" role="group">
                                    <button 
                                        type="button" 
                                        className={`btn ${!isChangingPassword ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setIsChangingPassword(false)}
                                    >
                                        Profile Info
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`btn ${isChangingPassword ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setIsChangingPassword(true)}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>

                            {!isChangingPassword ? (
                                /* Profile Information Section */
                                <form onSubmit={handleUpdateProfile} className="register-form">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={user.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
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
                                                    value={user.lastName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
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
                                            value={user.email}
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
                                            value={user.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <h5 className="mt-4 mb-3">Address Information</h5>
                                    
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

                                    <div className="form-group mb-4">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary me-2"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success me-2"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        loadUserProfile(); // Reset form
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                /* Change Password Section */
                                <form onSubmit={handleChangePassword} className="register-form">
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

                                    <div className="form-group mb-4">
                                        <button type="submit" className="btn btn-primary">
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Order History Section */}
                            <div className="mt-5">
                                <h5>Recent Orders</h5>
                                {orders.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Order #</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.slice(0, 5).map(order => (
                                                    <tr key={order.order_id}>
                                                        <td>{order.order_number}</td>
                                                        <td>{new Date(order.placed_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td>${order.total_amount}</td>
                                                        <td>
                                                            <Link to={`/order-tracking?order=${order.order_number}`} className="btn btn-sm btn-outline-primary">
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted">No orders found.</p>
                                )}
                            </div>

                            {/* Account Actions */}
                            <div className="profile-actions mt-4 pt-4 border-top">
                                <div className="d-flex justify-content-between">
                                    <Link to="/" className="btn btn-outline-secondary">
                                        Back to Home
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
