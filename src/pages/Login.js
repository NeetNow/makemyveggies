import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle login logic
    console.log('Login attempt with:', { email, password, rememberMe });
    // For now, we'll just navigate to the home page
    navigate('/');
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
              
              <form onSubmit={handleSubmit} className="login-form">
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
                
                <div className="form-group mb-4">
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </div>
                
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
