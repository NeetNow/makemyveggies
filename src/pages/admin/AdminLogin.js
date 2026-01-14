import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_BASE = 'http://localhost/git_mmv/makemyveggies';

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
    <main className="auth-page admin-auth-page banner position-relative overflow-hidden py-5 min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center g-4">
          {/* Left: Login form */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <img
                    src="/assets/img/logo/logo.png"
                    alt="Make My Veggies Admin"
                    style={{ maxHeight: '60px' }}
                  />
                  <h2 className="mt-3 mb-1">Admin Panel</h2>
                  <p className="text-muted mb-0">Sign in to manage products, orders and content.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="admin@makemyveggies.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
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

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="custom-btn"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Themed background image */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="position-relative h-100">
              <div className="position_bshape contentrightimg imghover w-100 h-100">
                <img
                  src="/assets/img/home-1/banner/bannerightimg.jpeg"
                  alt="Admin background"
                  className="img-fluid rounded-3"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative shapes reused from banner for theme consistency */}
      <div className="position_bshape topleftimg dnone">
        <img src="/assets/img/home-1/banner/shape1.png" alt="shape" />
      </div>
      <div className="position_bshape topright">
        <img src="/assets/img/home-1/banner/shape5.png" alt="shape" />
      </div>
      <div className="position_bshape bottommiddle d-lg-block d-none">
        <img src="/assets/img/home-1/banner/shape3.png" alt="shape" />
      </div>
      <div className="position_bshape bottomright d-sm-block d-none">
        <img src="/assets/img/home-1/banner/shape4.png" alt="shape" />
      </div>
      <div className="position_bshape middleshape d-lg-block d-none">
        <img src="/assets/img/home-1/banner/shape6.png" alt="shape" />
      </div>
    </main>
  );
};

export default AdminLogin;
