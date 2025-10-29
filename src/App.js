import React from 'react';
import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Homepage Components
import Header from './components/Header';
import Banner from './components/Banner';
import Features from './components/Features';
import NaturePlant from './components/NaturePlant';
import Services from './components/Services';
import Counter from './components/Counter';
import Project from './components/Project';
import Team from './components/Team';
import Feedback from './components/Feedback';
import Partner from './components/Partner';
import Blog from './components/Blog';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

// Page Components
import About from './pages/About';
import ServicesPage from './pages/Services';
import TeamPage from './pages/Team';
import ProjectPage from './pages/Project';
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
import Order from './pages/Order';
import OrderTracking from './pages/OrderTracking';

function App() {
  return (
    <Router>
      <Fragment>

        <Routes>
          {/* Homepage */}
          <Route path="/" element={
            <>
              <Header />
              <Banner />
              <Features />
              <NaturePlant />
              <Services />
              <Counter />
              <Project />
              <Team />
              <Feedback />
              <Partner />
              <Blog />
              <Newsletter />
              <Footer />

              {/* Scroll To Top */}
              <a href="#" className="scrollToTop">
                <i className="fa-solid fa-arrow-up-long"></i>
                <span className="pluse_1"></span>
                <span className="pluse_2"></span>
              </a>
            </>
          } />

          {/* Individual Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<ServicesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/project" element={<ProjectPage />} />
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
          <Route path="/order" element={<Order />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
