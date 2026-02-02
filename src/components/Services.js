import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section className="service bg-white padding-block overflow-hidden">
      <div className="container">
        <div className="row g-4 align-items-xxl-center align-items-end justify-content-center">
          <div className="col-lg-10 col-xl-7 col-xxl-6">
            <div className="section__header">
              <span>makemyveggies Services</span>
              <h3>Makemyveggies Best Services for Healthy Growing.</h3>
            </div>
            <div className="section__wrapper service__wrapper">
              <p>We provide fresh microgreens, smart growing kits, and expert gardening solutions to help you 
                 grow nutritious greens easily at home or for your business.</p>
              <div className="service__item">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon1.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Fresh Microgreens Supply</Link></h6>
                        <p>Daily-harvested, chemical-free microgreens delivered fresh for 
                          homes, restaurants, and health-conscious customers.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon2.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">DIY Growing Kits</Link></h6>
                        <p>Complete microgreen growing kits with seeds, trays, cocopeat, 
                          and easy instructions — perfect for beginners.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon3.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Seeds & Growing Media</Link></h6>
                        <p>High-quality seeds, cocopeat, and nutrients to ensure fast, healthy, and reliable growth.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon4.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Bulk & Subscription Orders</Link></h6>
                        <p>Customized bulk supply and weekly/monthly subscriptions for restaurants, cafes, and retailers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-xxl-6">
            <div className="service__rightimg imghover" style={{ width: '100%', height: '700px', overflow: 'hidden', borderRadius: '10px' }}>
              <img
                src="/assets/img/home-1/service/service.jpeg"
                alt="Service"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Shapes */}
      <div className="bottomshape right-left d-xxl-block d-none">
        {/* Background shape removed - placeholder for decorative element */}
      </div>
      <div className="positonshape topshape dnone">
        {/* Position shape removed - placeholder for decorative element */}
      </div>
    </section>
  );
};

export default Services;
