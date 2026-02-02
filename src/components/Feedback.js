import React from 'react';

const Feedback = () => {
  return (
    <section className="feedback padding-block overflow-hidden">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-xl-6 text-center pt-sm-0 pt-1">
            
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
                              <h6>Shashank Mohite</h6>
                            </div>
                            <div className="star">
                              <ul>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bottom">
                          <p>This DIY kit made balcony gardening easy. The potting mix is great, 
                            and the guide helped with watering. My cherry tomatoes are already 
                            flowering! Just be sure your spot gets at least 2 hours of sunlight.</p>
                        </div>
                      </div>
                      <div className="feedback__inner bg-white">
                        <div className="top">
                          <div className="thumb">
                            <img src="/assets/img/home-1/feedback/img2.png" alt="bakul" />
                          </div>
                          <div className="profile">
                            <div className="name">
                              <h6>Aparna Shah</h6>
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
                          <p>The Microgreen kit is amazing for quick, easy salads. I chose 
                          Mustard seeds and had a full harvest in just 12 days. It’s very 
                          beginner-friendly, and the spray bottle makes watering simple. 
                          A great way to start urban farming!</p>
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
                              <h6>Shashank Mohite</h6>
                            </div>
                            <div className="star">
                              <ul>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                                <li><i className="fa-solid fa-star"></i></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bottom">
                          <p>This DIY kit made balcony gardening easy. The potting mix is great, 
                            and the guide helped with watering. My cherry tomatoes are already 
                            flowering! Just be sure your spot gets at least 2 hours of sunlight.</p>
                        </div>
                      </div>
                      <div className="feedback__inner bg-white">
                        <div className="top">
                          <div className="thumb">
                            <img src="/assets/img/home-1/feedback/img2.png" alt="bakul" />
                          </div>
                          <div className="profile">
                            <div className="name">
                              <h6>Aparna Shah</h6>
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
                          <p>The Microgreen kit is amazing for quick, easy salads. I chose 
                          Mustard seeds and had a full harvest in just 12 days. It’s very 
                          beginner-friendly, and the spray bottle makes watering simple. 
                          A great way to start urban farming!</p>
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
      <div className="positionfeedback righttop">
        <img src="/assets/img/home-1/feedback/topshape.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Feedback;
