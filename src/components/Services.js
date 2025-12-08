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
              <h3>makemyveggies Best Services For Gardening.</h3>
            </div>
            <div className="section__wrapper service__wrapper">
              <p>Continually productize compelling quality for packed in business consulting Setting up to
                website and creating pages.</p>
              <div className="service__item">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon1.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Garden Plantations</Link></h6>
                        <p>Continua productize compel packed productize compelling quality for all
                          creating website pages.</p>
                        <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon2.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Garden Irrigation System</Link></h6>
                        <p>Continua productize compel packed productize compelling quality for all
                          creating website pages.</p>
                        <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon3.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Garden Hedge Cutting</Link></h6>
                        <p>Continua productize compel packed productize compelling quality for all
                          creating website pages.</p>
                        <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service__inner">
                      <div className="thumb">
                        <img src="/assets/img/home-1/service/icon4.png" alt="bakul" />
                      </div>
                      <div className="text">
                        <h6><Link to="/service-details">Guarantee Design</Link></h6>
                        <p>Continua productize compel packed productize compelling quality for all
                          creating website pages.</p>
                        <Link to="/service-details">Read More <i className="fa-solid fa-chevrons-right"></i></Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-xxl-6">
            <div className="service__rightimg imghover">
              <div style={{width: '100%', height: '400px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px'}}>
                <span style={{color: '#666', fontSize: '18px'}}>Service Image</span>
              </div>
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
