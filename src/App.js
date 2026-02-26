import React, { Fragment, useEffect } from 'react';
import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Homepage Components
import Header from './components/Header';
import Banner from './components/Banner';
import Features from './components/Features';
import NaturePlant from './components/NaturePlant';
import Services from './components/Services';
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
import BlogSingle from './pages/blogsingle';
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
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './pages/admin/AdminRoute';
import Orders from './pages/admin/Orders';
import ViewOrder from './pages/admin/ViewOrder';
import Customers from './pages/admin/Customers';
import Categories from './pages/admin/Categories';
import Content from './pages/admin/Content';
import AdminNewsletter from './pages/admin/Newsletter';
import Discounts from './pages/admin/Discounts';
import Analytics from './pages/admin/Analytics';
import Users from './pages/admin/Users';
import ProductDiyKits from './pages/admin/ProductDiyKits';
import AddDiyKit from './pages/admin/AddDiyKit';
import ViewDiyKit from './pages/admin/ViewDiyKit';
import EditDiyKit from './pages/admin/EditDiyKit';
import ProductSupplements from './pages/admin/ProductSupplements';
import AddSupplement from './pages/admin/AddSupplement';
import ViewSupplement from './pages/admin/ViewSupplement';
import EditSupplement from './pages/admin/EditSupplement';
import ContactMessages from './pages/admin/ContactMessages';
import Payments from './pages/admin/Payments';

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
  const shouldHideHeader = hideHeaderRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  return !shouldHideHeader ? <Header /> : null;
}

function ConditionalBodyZoom() {
  const location = useLocation();

  useEffect(() => {
    const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

    if (isAdminRoute) {
      document.body.classList.remove('site-zoom');
    } else {
      document.body.classList.add('site-zoom');
    }

    return () => {
      document.body.classList.remove('site-zoom');
    };
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Router>
            <ConditionalBodyZoom />
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
              <Route path="/blog/:id" element={<BlogSingle />} />
              <Route path="/blogsingle" element={<BlogSingle />} />
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
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<ViewOrder />} />
                <Route path="customers" element={<Customers />} />
                <Route path="categories" element={<Categories />} />
                <Route path="content" element={<Content />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="contact-messages" element={<ContactMessages />} />
                <Route path="users" element={<Users />} />
                <Route path="discounts" element={<Discounts />} />
                <Route path="payments" element={<Payments />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="products/diy-kits" element={<ProductDiyKits />} />
                <Route path="products/diy-kits/add" element={<AddDiyKit />} />
                <Route path="products/diy-kits/:id" element={<ViewDiyKit />} />
                <Route path="products/diy-kits/:id/edit" element={<EditDiyKit />} />
                <Route path="products/supplements" element={<ProductSupplements />} />
                <Route path="products/supplements/add" element={<AddSupplement />} />
                <Route path="products/supplements/:id" element={<ViewSupplement />} />
                <Route path="products/supplements/:id/edit" element={<EditSupplement />} />
              </Route>
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
        </AdminAuthProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
