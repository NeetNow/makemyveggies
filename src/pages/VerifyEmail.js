import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/auth.css';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userId = location.state?.userId || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userId) {
      setMessage('Invalid request. Please register first.');
      return;
    }
    
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    setMessage('');
    
    // Prepare data for submission
    const verificationData = {
      userId: userId,
      otp: otp
    };
    
    // Send data to PHP backend for email verification
    fetch('http://localhost/makemyveggies/backend/api/verify_otp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    })
    .then(response => response.json())
    .then(data => {
      setIsVerifying(false);
      if (data.status === 'success') {
        setMessage('Email verified successfully! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Verification failed: ' + data.message);
      }
    })
    .catch(error => {
      setIsVerifying(false);
      console.error('Error:', error);
      setMessage('An error occurred during verification');
    });
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
                <h2>Verify Your Email</h2>
                <p>Please enter the OTP sent to your email</p>
              </div>
              
              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group mb-3">
                  <label htmlFor="otp" className="form-label">OTP Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group mb-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>
                
                <div className="register-footer text-center">
                  <p>
                    Didn't receive the code? <Link to="/register">Resend OTP</Link>
                  </p>
                  <p>
                    Already have an account? <Link to="/login">Login here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
