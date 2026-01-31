import React from 'react';

const Features = () => {
  return (
    <section className="feature padding-block overflow-hidden bg-white">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 col-xl-3">
            <div className="feature__item">
              <div className="feature__inner">
                <div className="icon">
                  <img src="/assets/img/home-1/feature/icon1.png" alt="bakul" />
                </div>
                <div className="text">
                  <h6>Quality Assured Services</h6>
                  <p>We deliver reliable, high-quality solutions with strict quality checks</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="feature__item">
              <div className="feature__inner">
                <div className="icon">
                  <img src="/assets/img/home-1/feature/icon2.png" alt="bakul" />
                </div>
                <div className="text">
                  <h6>Environmentally Friendly</h6>
                  <p>Convenient & proacteds bested quality and ideas use production. </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="feature__item">
              <div className="feature__inner">
                <div className="icon">
                  <img src="/assets/img/home-1/feature/icon3.png" alt="bakul" />
                </div>
                <div className="text">
                  <h6>Sustainable & Responsible</h6>
                  <p>We follow sustainable processes with efficient performance.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="feature__item">
              <div className="feature__inner">
                <div className="icon">
                  <img src="/assets/img/home-1/feature/icon4.png" alt="bakul" />
                </div>
                <div className="text">
                  <h6>Dedicated Support Team</h6>
                  <p>Our expert support team ensures quick help and smooth communication at every step.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
