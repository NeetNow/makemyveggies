import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../assets/css/auth.css';

const Login = () => {
  const [loginType, setLoginType] = useState('email'); // email or mobile
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/backend/api/login.php', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: loginType === 'email' ? email : null,
          mobile: loginType === 'mobile' ? mobile : null,
          password 
        }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (data.success) {
        // Update auth context with user data
        login(data.data.user);
        
        // Show success toast
        toast.success('Login successful! Welcome back.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Navigate to home page
        navigate('/');
      } else {
        setMessage(data.message || 'Login failed');
        toast.error(data.message || 'Login failed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Login error:', error);
      const errorMessage = 'An error occurred during login. Please try again.';
      setMessage(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="login-page banner">
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
                <h2>Login to Your Account</h2>
                <p>Please enter your credentials to login</p>
              </div>

              {/* Login Type Selection - Minimalist Style */}
              <div className="login-type-selector mb-4">
                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className={`login-type-btn ${loginType === 'email' ? 'active' : ''}`}
                    onClick={() => setLoginType('email')}
                  >
                    Email
                  </button>
                  <button 
                    type="button" 
                    className={`login-type-btn ${loginType === 'mobile' ? 'active' : ''}`}
                    onClick={() => setLoginType('mobile')}
                  >
                    Mobile Number
                  </button>
                </div>
              </div>

              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleLogin} className="login-form">

                {/* Email Input */}
                {loginType === 'email' && (
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
                )}

                {/* Mobile Input */}
                {loginType === 'mobile' && (
                  <div className="form-group mb-3">
                    <label htmlFor="mobile" className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      placeholder="Enter your mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Password Input */}
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

                {/* Remember Me Checkbox */}
                <div className="form-group mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-group mb-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Login'}
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="login-footer text-center">
                  <p>
                    Don't have an account? <Link to="/register">Register here</Link>
                  </p>
                  <p>
                    <Link to="/forgot-password">Forgot Password?</Link>
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

export default Login;
