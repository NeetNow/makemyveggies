import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters long");
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            password
        };

        try {
            const response = await fetch('http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setIsSubmitting(false);

            if (data.success) {
                setMessage('OTP sent to your email! Please enter the verification code below.');
                setShowOtpForm(true);
            } else {
                setMessage('Registration failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error:', error);
            setMessage('An error occurred during registration. Please check if the backend server is running.');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        if (!otpCode || otpCode.length !== 6) {
            setMessage('Please enter a valid 6-digit OTP code');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const otpData = {
            email,
            otp_code: otpCode
        };

        try {
            const response = await fetch('http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/verify_otp.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(otpData),
            });

            const data = await response.json();

            setIsSubmitting(false);

            if (data.success) {
                setMessage('Registration completed successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage('OTP verification failed: ' + data.message);
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error:', error);
            setMessage('An error occurred during OTP verification');
        }
    };

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        setMessage('');

        const resendData = { email };

        try {
            const response = await fetch('http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/resend_otp.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resendData),
            });

            const data = await response.json();

            setIsSubmitting(false);

            if (data.success) {
                setMessage('New OTP sent to your email!');
            } else {
                setMessage('Failed to resend OTP: ' + data.message);
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error:', error);
            setMessage('An error occurred while resending OTP');
        }
    };

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
                    <div className="col-md-6 col-lg-5">
                        <div className="register-box">
                            <div className="register-header text-center">
                                <h2>{showOtpForm ? 'Verify Your Email' : 'Create an Account'}</h2>
                                <p>{showOtpForm ? 'Enter the OTP sent to your email' : 'Please fill in the information below'}</p>
                            </div>

                            {message && (
                                <div className={`alert ${message.includes('success') || message.includes('sent') ? 'alert-success' : 'alert-danger'} mb-3`}>
                                    {message}
                                </div>
                            )}

                            {!showOtpForm ? (
                                <form onSubmit={handleSubmit} className="register-form">
                                    <div className="form-group mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            placeholder="Enter your first name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            placeholder="Enter your last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input 
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input 
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            placeholder="Enter your phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input 
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input 
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <button 
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Registering...' : 'Register'}
                                        </button>
                                    </div>

                                    <div className="register-footer text-center">
                                        <p>
                                            Already have an account? <Link to="/login">Login here</Link>
                                        </p>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleOtpSubmit} className="otp-form">
                                    <div className="form-group mb-3">
                                        <label htmlFor="otpCode" className="form-label">Enter OTP Code</label>
                                        <input 
                                            type="text"
                                            className="form-control text-center"
                                            id="otpCode"
                                            placeholder="000000"
                                            maxLength="6"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                            required 
                                        />
                                        <small className="form-text text-muted">
                                            Enter the 6-digit code sent to {email}
                                        </small>
                                    </div>

                                    <div className="form-group mb-3">
                                        <button 
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                    </div>

                                    <div className="form-group mb-4">
                                        <button 
                                            type="button"
                                            className="btn btn-outline-secondary w-100"
                                            onClick={handleResendOtp}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    </div>

                                    <div className="register-footer text-center">
                                        <p>
                                            <button 
                                                type="button" 
                                                className="btn btn-link p-0"
                                                onClick={() => {
                                                    setShowOtpForm(false);
                                                    setOtpCode('');
                                                    setMessage('');
                                                }}
                                            >
                                                Back to Registration
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;