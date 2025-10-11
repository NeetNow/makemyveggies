import React from 'react';

const Feedback = () => {
  return (
    <section className="feedback padding-block overflow-hidden">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-xl-6 text-center pt-sm-0 pt-1">
            <div className="plybtn d-xl-block d-none">
              <a href="https://www.youtube.com/watch?v=m4CWaHAQ4wc" className="popup">
                <i className="fa-solid fa-play"></i>
              </a>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="section__header feedback__header">
              <span>Our Feedback<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
              <h3>what Our Client Say About Us</h3>
              <p>Continually productize compelling quality packed business consulting
                Setting up to website and creating pages.</p>
            </div>
            <div className="section_wrapper">
              <div className="feedback__slider overflow-hidden">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="feedback__item">
                      <div className="feedback__inner bg-white">
                        <div className="top">
                          <div className="thumb">
                            <img src="/assets/img/home-1/feedback/img1.png" alt="bakul" />
                          </div>
                          <div className="profile">
                            <div className="name">
                              <h6>Leslie Alexander</h6>
                              <span>Founder</span>
                            </div>
                            <div className="star">
                              <ul>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bottom">
                          <p>Rapaciously simplify enabled intellectual capital and transparent it
                            core competencies energetically enable user centric remarkets the
                            after leveraged methodologies.</p>
                        </div>
                      </div>
                      <div className="feedback__inner bg-white">
                        <div className="top">
                          <div className="thumb">
                            <img src="/assets/img/home-1/feedback/img1.png" alt="bakul" />
                          </div>
                          <div className="profile">
                            <div className="name">
                              <h6>Stephen Hughes</h6>
                              <span>Manager</span>
                            </div>
                            <div className="star">
                              <ul>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bottom">
                          <p>Rapaciously simplify enabled intellectual capital and transparent it
                            core competencies energetically enable user centric remarkets the
                            after leveraged methodologies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="feedback__item">
                      <div className="feedback__inner bg-white">
                        <div className="top">
                          <div className="thumb">
                            <img src="/assets/img/home-1/feedback/img1.png" alt="bakul" />
                          </div>
                          <div className="profile">
                            <div className="name">
                              <h6>Douglas Pitts</h6>
                              <span>Manager</span>
                            </div>
                            <div className="star">
                              <ul>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bottom">
                          <p>Rapaciously simplify enabled intellectual capital and transparent it
                            core competencies energetically enable user centric remarkets the
                            after leveraged methodologies.</p>
                        </div>
                      </div>
                      <div className="feedback__inner bg-white">
                        <div className="top">
                          <div className="thumb">
                            <img src="/assets/img/home-1/feedback/img1.png" alt="bakul" />
                          </div>
                          <div className="profile">
                            <div className="name">
                              <h6>Humberto Luish</h6>
                              <span>Founder</span>
                            </div>
                            <div className="star">
                              <ul>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bottom">
                          <p>Rapaciously simplify enabled intellectual capital and transparent it
                            core competencies energetically enable user centric remarkets the
                            after leveraged methodologies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Shapes */}
      <div className="rightbottom right-left d-lg-block d-none">
        <img src="/assets/img/home-1/feedback/bottomshape.png" alt="bakul" />
      </div>
      <div className="positionfeedback righttop">
        <img src="/assets/img/home-1/feedback/topshape.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Feedback;
