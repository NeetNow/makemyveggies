import React from 'react';
import { Link } from 'react-router-dom';

const NaturePlant = () => {
  return (
    <section className="natureplant overflow-hidden">
      <div className="container">
        <div className="row justify-content-xxl-end justify-content-center">
          <div className="col-lg-10 col-xl-7 col-xxl-6">
            <div className="section__header natureplant__header">
              <div className="col-md-11 col-xl-12 col-xxl-8">
                <span>Welcome To natureplant<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
                <h3>Beautiful Garden is a Work of Heart.</h3>
              </div>
            </div>
            <div className="section__wrapper natureplant__content">
              <p>Continually productize compelling quality for packed with elated
                productize compelling quality for packed in with all elated Them
                Setting up to website and creating pages.</p>
              <ul>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Trimming & Pruning</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Peseta & Weeds Control.</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Peseta & Weeds Control.</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Arbor Management</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Nursery / Tree Fram</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Trimming & Pruning</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Peseta & Weeds Control.</li>
                <li><i className="fa-sharp fa-solid fa-square-check"></i>Nursery / Tree Fram</li>
              </ul>
              <div className="natureplant__gardingmake">
                <div className="item">
                  <div className="thumb">
                    <img src="/assets/img/home-1/welcome/icon1.png" alt="bakul" />
                  </div>
                  <div className="text">
                    <h5 className="odometer" data-odometer-final="653">346</h5>
                    <h6>Garden Make</h6>
                  </div>
                </div>
                <div className="item">
                  <div className="thumb">
                    <img src="/assets/img/home-1/welcome/icon2.png" alt="bakul" />
                  </div>
                  <div className="text">
                    <h5 className="odometer" data-odometer-final="20">44</h5>
                    <h6>Award Wining</h6>
                  </div>
                </div>
              </div>
              <Link to="/about" className="custom-btn">About our company</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Images */}
      <div className="position leftimg imghover d-xxl-block d-none">
        <img src="/assets/img/home-1/welcome/leftimg.png" alt="bakul" />
      </div>
      <div className="rightshape right-left d-lg-block d-none">
        <img src="/assets/img/home-1/welcome/img1.png" alt="bakul" />
      </div>
      <div className="position topshape d-xxl-block d-none">
        <img src="/assets/img/home-1/welcome/knife.png" alt="bakul" />
      </div>
      <div className="position middleshape d-xxl-block d-none">
        <img src="/assets/img/home-1/welcome/middleshape.png" alt="bakul" />
      </div>
    </section>
  );
};

export default NaturePlant;
