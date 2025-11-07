import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const ServicesPage = () => {
  return (
    <>
      <main>
        {/* Page Header */}
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li>Services</li>
                  </ul>
                  <h2>Our Services</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="service bg-white padding-block">
          <div className="container">
            <div className="section__header text-center">
              <span>Natureplant Services</span>
              <h3>Nature plant Best Services For Gardening.</h3>
              <p>Continually productize compelling quality for packed in business consulting Setting up to website and creating pages.</p>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="service__inner">
                  <div className="thumb">
                    <img src="/assets/img/home-1/service/icon1.png" alt="Garden Plantations" />
                  </div>
                  <div className="text">
                    <h6><Link to="/service-details">Garden Plantations</Link></h6>
                    <p>Continua productize compel packed productize compelling quality for all creating website pages.</p>
                    <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service__inner">
                  <div className="thumb">
                    <img src="/assets/img/home-1/service/icon2.png" alt="Garden Irrigation System" />
                  </div>
                  <div className="text">
                    <h6><Link to="/service-details">Garden Irrigation System</Link></h6>
                    <p>Continua productize compel packed productize compelling quality for all creating website pages.</p>
                    <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service__inner">
                  <div className="thumb">
                    <img src="/assets/img/home-1/service/icon3.png" alt="Garden Hedge Cutting" />
                  </div>
                  <div className="text">
                    <h6><Link to="/service-details">Garden Hedge Cutting</Link></h6>
                    <p>Continua productize compel packed productize compelling quality for all creating website pages.</p>
                    <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service__inner">
                  <div className="thumb">
                    <img src="/assets/img/home-1/service/icon4.png" alt="Guarantee Design" />
                  </div>
                  <div className="text">
                    <h6><Link to="/service-details">Guarantee Design</Link></h6>
                    <p>Continua productize compel packed productize compelling quality for all creating website pages.</p>
                    <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta padding-block bg-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3>Need Professional Gardening Services?</h3>
                <p>Contact us today for a free consultation and quote.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/contact" className="custom-btn">Get Quote</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;
