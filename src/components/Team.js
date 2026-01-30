import React from 'react';
import { Link } from 'react-router-dom';

const Team = () => {
  return (
    <section className="team padding-block bg-white overflow-hidden">
      <div className="container">
        <div className="section__header section__header--header2">
          <span>Our Products<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
          <h3>our professional landscapers</h3>
          <p>Continually productize compelling quality for packed business consulting
            Setting up to website and creating pages.</p>
        </div>
      </div>
      <div className="section__wrapper team__wrapper">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="team__item">
                <div className="team__inner bg-white">
                  <div className="thumb">
                    <img src="/assets/img/home-1/team/Picture8.png" alt="bakul" />
                  </div>
                  <div className="text">
                    <h6><Link to="/team-single">Albert Hopper</Link></h6>
                    <p>Gardenist</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="team__item">
                <div className="team__inner bg-white">
                  <div className="thumb">
                    <img src="/assets/img/home-1/team/picture6.png" alt="bakul" />
                  </div>
                  <div className="text">
                    <h6><Link to="/team-single">Albert Hopper</Link></h6>
                    <p>Gardenist</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="team__item">
                <div className="team__inner bg-white">
                  <div className="thumb">
                    <img src="/assets/img/home-1/team/picture7.png" alt="bakul" />
                  </div>
                  <div className="text">
                    <h6><Link to="/team-single">Margot Robbie</Link></h6>
                    <p>Gardenist</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="team__item">
                <div className="team__inner bg-white">
                  <div className="thumb">
                    <img src="/assets/img/home-1/team/picture8.png" alt="bakul" />
                  </div>
                  <div className="text">
                    <h6><Link to="/team-single">Kevin Martin</Link></h6>
                    <p>Gardenist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="project__btn">
        <a href="/shop" className="custom-btn">View All Products</a>
      </div>

      {/* Background Shapes */}
      <div className="leftshape left-right d-xxl-block d-none">
        <img src="/assets/img/home-1/team/toptree.png" alt="bakul" />
      </div>
      <div className="bottomshape right-left d-lg-block d-none">
        <img src="/assets/img/home-1/team/bottomtree.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Team;
