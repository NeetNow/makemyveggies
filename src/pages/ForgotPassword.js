import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Choose channel & enter details, 2: Enter OTP, 3: Set new password
    const [channel, setChannel] = useState('email'); // 'email' or 'whatsapp'
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const navigate = useNavigate();

    const handleEmailSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const endpoint = channel === 'whatsapp'
                ? 'http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/request_password_reset_whatsapp.php'
                : 'http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/request_password_reset.php';

            const payload = channel === 'whatsapp'
                ? { email, phone, country_code: countryCode }
                : { email };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            setIsSubmitting(false);

            if (data.success) {
                setMessage(channel === 'whatsapp'
                    ? 'OTP sent to your WhatsApp number. Please check your WhatsApp.'
                    : 'OTP sent to your email. Please check your inbox.');
                setStep(2);
            } else {
                setMessage(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('OTP request error:', error);
            setMessage('An error occurred while requesting OTP. Please try again.');
        }
    };

    const handleOtpSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/verify_password_reset_otp.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            setIsSubmitting(false);

            if (data.success) {
                setMessage('OTP verified successfully. Please set your new password.');
                setStep(3);
            } else {
                setMessage(data.message || 'OTP verification failed');
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('OTP verification error:', error);
            setMessage('An error occurred during OTP verification. Please try again.');
        }
    };

    const handlePasswordReset = async(e) => {
        e.preventDefault();

        // Basic validation
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/backend/api/reset_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, new_password: newPassword }),
            });

            const data = await response.json();
            setIsSubmitting(false);

            if (data.success) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message || 'Password reset failed');
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Password reset error:', error);
            setMessage('An error occurred during password reset. Please try again.');
        }
    };

    return (
        <div className="forgot-password-page banner">
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
                        <div className="login-box">
                            <div className="login-header text-center">
                                <h2>{step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'Set New Password'}</h2>
                                <p>
                                    {step === 1
                                        ? 'Choose how you want to receive OTP and enter required details'
                                        : step === 2
                                            ? 'Enter the OTP sent to your selected channel'
                                            : 'Set your new password'}
                                </p>
                            </div>

                            {message && (
                                <div
                                    className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}
                                >
                                    {message}
                                </div>
                            )}

                            {/* Step 1: Choose channel & enter details */}
                            {step === 1 && (
                                <form onSubmit={handleEmailSubmit} className="login-form">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Select OTP Method</label>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${
                                                    channel === 'email' ? 'btn-primary' : 'btn-outline-primary'
                                                }`}
                                                onClick={() => setChannel('email')}
                                            >
                                                Email OTP
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${
                                                    channel === 'whatsapp' ? 'btn-primary' : 'btn-outline-primary'
                                                }`}
                                                onClick={() => setChannel('whatsapp')}
                                            >
                                                WhatsApp OTP
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email Address
                                        </label>
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

                                    {channel === 'whatsapp' && (
                                        <>
                                            <div className="form-group mb-3">
                                                <label htmlFor="countryCode" className="form-label">
                                                    Country Code
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="countryCode"
                                                    placeholder="+91"
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="phone" className="form-label">
                                                    WhatsApp Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="phone"
                                                    placeholder="Enter your WhatsApp number"
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(e.target.value.replace(/\D/g, ''))
                                                    }
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group mb-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 2: Enter OTP */}
                            {step === 2 && (
                                <form onSubmit={handleOtpSubmit} className="login-form">
                                    <div className="form-group mb-3">
                                        <label htmlFor="otp" className="form-label">
                                            OTP Code
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control text-center"
                                            id="otp"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            required
                                        />
                                        <small className="form-text text-muted">
                                            Enter the 6-digit code sent to {email}
                                        </small>
                                    </div>

                                    <div className="form-group mb-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={() => setStep(1)}
                                        >
                                            Back to Email
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 3: Set New Password */}
                            {step === 3 && (
                                <form onSubmit={handlePasswordReset} className="login-form">
                                    <div className="form-group mb-3">
                                        <label htmlFor="newPassword" className="form-label">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="Confirm new password"
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
                                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={() => setStep(2)}
                                        >
                                            Back to OTP
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="login-footer text-center">
                                <p>
                                    Remember your password?{' '}
                                    <Link to="/login">Login here</Link>
                                </p>
                                <p>
                                    Don't have an account?{' '}
                                    <Link to="/register">Register here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;