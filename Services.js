import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section className="service bg-white padding-block overflow-hidden">
      <div className="container">
        <div className="row g-4 align-items-xxl-center align-items-end justify-content-center">
          <div className="col-lg-10 col-xl-7 col-xxl-6">
            <div className="section__header">
              <span>Natureplant Services<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
              <h3>Nature plant Best Services For Gardening.</h3>
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
              <img src="/assets/img/home-1/service/rightimg.png" alt="bakul" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Shapes */}
      <div className="bottomshape right-left d-xxl-block d-none">
        <img src="/assets/img/home-1/service/bottomshape.png" alt="bakul" />
      </div>
      <div className="positonshape topshape dnone">
        <img src="/assets/img/home-1/banner/shape1.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Services;
