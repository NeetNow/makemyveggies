import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_BASE = 'https://dev.makemyveggies.com/makemyveggies';

      const response = await fetch(`${API_BASE}/backend/api/admin/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Admin login non-JSON response:', text);
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials');
      }

      localStorage.setItem('isAdminLoggedIn', 'true');

      toast.success('Admin login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/admin');
    } catch (err) {
      const message = err.message || 'Login failed';
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
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
                <img
                  src="/assets/img/logo/logo.png"
                  alt="Make My Veggies Admin"
                  style={{ maxHeight: '60px' }}
                />
                <h2>Admin Login</h2>
                <p>Please enter your credentials to login</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@makemyveggies.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
