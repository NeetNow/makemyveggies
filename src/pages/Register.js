import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Email OTP State
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otpCode, setOtpCode] = useState(''); // For Email OTP

    // SMS/Text OTP State (Renamed from whatsappOtp)
    const [smsOtp, setSmsOtp] = useState('');
    const [isVerifyingSmsOtp, setIsVerifyingSmsOtp] = useState(false);

    const navigate = useNavigate();

    // Utility function for API calls with timeout/error handling
    const fetchApi = async (endpoint, payload, actionName, successMessage) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setMessage(successMessage);
                return { success: true, data };
            } else {
                setMessage(`${actionName} failed: ` + (data.message || 'Unknown error'));
                return { success: false, data };
            }

        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`${actionName} error:`, error);
            
            if (error.name === 'AbortError') {
                setMessage('Request timeout. Please check your connection and try again.');
            } else if (error.message.includes('Failed to fetch')) {
                setMessage('Network error: Unable to connect to the server. Please ensure XAMPP is running and try again.');
            } else {
                setMessage(`${actionName} failed: ` + error.message);
            }
            return { success: false, error };
        }
    };

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

        const result = await fetchApi(
            '/backend/api/register.php', 
            userData, 
            'Registration', 
            'OTP sent to your email! Please enter the verification code below.'
        );

        setIsSubmitting(false);

        if (result.success) {
            // Show OTP form for email immediately
            setShowOtpForm(true);

            // Fire-and-forget WhatsApp OTP send; do not block email OTP UI on this
            handleSendSmsOtp();
        }
    };

    // Send WhatsApp OTP for the phone number (called automatically after registration)
    const handleSendSmsOtp = async () => {
        if (!phone) {
            return;
        }

        const payload = {
            phone,
            country_code: '+91',
        };

        await fetchApi(
            '/backend/api/send_sms_otp.php', 
            payload, 
            'SMS OTP Send', 
            'OTP sent to your mobile number via Whatsapp.'
        );
    };

    // Renamed from handleVerifyWhatsappOtp
    const handleVerifySmsOtp = async (e) => {
        e.preventDefault();

        if (!smsOtp || smsOtp.length !== 6) {
            setMessage('Please enter a valid 6-digit SMS OTP');
            return;
        }

        setIsVerifyingSmsOtp(true);
        setMessage('');

        const payload = {
            email,
            phone,
            country_code: '+91',
            otp_code: smsOtp,
        };

        await fetchApi(
            '/backend/api/verify_sms_otp.php', 
            payload, 
            'SMS OTP Verification', 
            'SMS OTP verified successfully.'
        );

        setIsVerifyingSmsOtp(false);
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

        const result = await fetchApi(
            '/backend/api/verify_otp.php', 
            otpData, 
            'Email OTP Verification', 
            'Registration completed successfully! Redirecting to login...'
        );
        
        setIsSubmitting(false);

        if (result.success) {
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        setMessage('');

        const resendData = { email };

        await fetchApi(
            '/backend/api/resend_otp.php', 
            resendData, 
            'Resend OTP', 
            'New OTP sent to your email!'
        );

        setIsSubmitting(false);
    };

    return (
        <div className="register-page banner">
            {/* Background Images - Assuming CSS handles this correctly */}
            {/* ... (Background div elements remain the same) ... */}
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
                                <h2>{showOtpForm ? 'Verify Your Account' : 'Create an Account'}</h2>
                                <p>{showOtpForm ? 'Enter the verification code(s)' : 'Please fill in the information below'}</p>
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
                                        <label htmlFor="phone" className="form-label">Phone Number (Whatsapp Verification)</label>
                                        <input 
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            placeholder="Enter your phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
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
                                <form className="otp-form">
                                    {/* Email OTP Verification */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="otpCode" className="form-label">Email OTP Code</label>
                                        <div className="d-flex gap-2">
                                            <input 
                                                type="text"
                                                className="form-control text-center"
                                                id="otpCode"
                                                placeholder="Email 6-digit code"
                                                maxLength="6"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                                required 
                                            />
                                            <button 
                                                type="button"
                                                className="btn btn-primary"
                                                style={{ minWidth: '140px' }}
                                                onClick={handleOtpSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Verifying Email...' : 'Verify'}
                                            </button>
                                        </div>
                                        <small className="form-text text-muted mt-1 d-block">
                                            Enter the 6-digit code sent to {email} to complete registration.
                                        </small>
                                    </div>

                                    {/* SMS/Phone OTP Verification */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="smsOtp" className="form-label">SMS OTP (Phone Verification)</label>
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control text-center"
                                                id="smsOtp"
                                                placeholder="SMS 6-digit code"
                                                maxLength="6"
                                                value={smsOtp}
                                                onChange={(e) => setSmsOtp(e.target.value.replace(/\D/g, ''))}
                                                disabled={isVerifyingSmsOtp}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-success"
                                                style={{ minWidth: '140px' }}
                                                onClick={handleVerifySmsOtp}
                                                disabled={isVerifyingSmsOtp || !smsOtp}
                                            >
                                                {isVerifyingSmsOtp ? 'Verifying SMS OTP...' : 'Verify'}
                                            </button>
                                        </div>
                                        <small className="form-text text-muted mt-1 d-block">
                                            Enter the 6-digit code sent to your Whatsapp number {phone}.
                                        </small>
                                    </div>

                                    <div className="form-group mb-3 text-center">
                                        <button 
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={handleResendOtp}
                                            disabled={isSubmitting}
                                        >
                                            Resend Email OTP
                                        </button>
                                    </div>

                                    <div className="form-group mb-4">
                                        <button
                                            type="button"
                                            className="btn btn-success w-100"
                                            onClick={() => navigate('/login')}
                                        >
                                            Continue
                                        </button>
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