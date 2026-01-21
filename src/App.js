import React, { Fragment } from 'react';
import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Homepage Components
import Header from './components/Header';
import Banner from './components/Banner';
import Features from './components/Features';
import NaturePlant from './components/NaturePlant';
import Services from './components/Services';
import Counter from './components/Counter';
import Team from './components/Team';
import Feedback from './components/Feedback';
import Blog from './components/Blog';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

// Page Components
import About from './pages/About';
import ServicesPage from './pages/Services';
import TeamPage from './pages/Team';
import BlogPage from './pages/Blog';
import Contact from './pages/Contact';
import History from './pages/History';
import FAQ from './pages/FAQ';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UserProfile from './pages/UserProfile';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './pages/admin/AdminRoute';

// Component to conditionally render header
function ConditionalHeader() {
  const location = useLocation();

  // Pages where header should be hidden
  const hideHeaderRoutes = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/profile',
    '/admin/login',
    '/admin',
  ];

  // Check if current route should hide header
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return !shouldHideHeader ? <Header /> : null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ConditionalHeader />
          <Fragment>
            <Routes>
              {/* Homepage */}
              <Route
                path="/"
                element={
                  <>
                    <Banner />
                    <Features />
                    <NaturePlant />
                    <Services />
                    <Counter />
                    <Team />
                    <Feedback />
                    <Blog />
                    <Newsletter />
                    <Footer />
                  </>
                }
              />

              {/* Individual Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/service" element={<ServicesPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/history" element={<History />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>

            {/* Toast Container for notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Fragment>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
