import React from 'react';

const Project = () => {
  return (
    <section className="project overflow-hidden padding-block">
      <div className="container">
        <div className="section__header section__header--header2">
          <span>Natureplant Project<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
          <h3>Nature plant Our Garden Project</h3>
          <p>Continually productize compelling quality for packed business consulting
            Setting up to website and creating pages.</p>
        </div>
      </div>
      <div className="section__wrapper project__wrapper">
        <div className="project__slider overflow-hidden">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="project__inner">
                <div className="project__item">
                  <div className="thum">
                    <img src="/assets/img/home-1/project/img1.jpg" alt="bakul" />
                  </div>
                  <div className="content go-up">
                    <div className="content-inner">
                      <p>Plant Care</p>
                      <h6><a href="project-details.html">Garden Plantations</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="project__inner">
                <div className="project__item">
                  <div className="thum">
                    <img src="/assets/img/home-1/project/img2.jpg" alt="bakul" />
                  </div>
                  <div className="content go-up">
                    <div className="content-inner">
                      <p>Plant Care</p>
                      <h6><a href="project-details.html">Modern Landscape</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="project__inner">
                <div className="project__item">
                  <div className="thum">
                    <img src="/assets/img/home-1/project/img3.jpg" alt="bakul" />
                  </div>
                  <div className="content go-up">
                    <div className="content-inner">
                      <p>Plant Care</p>
                      <h6><a href="project-details.html">Garden System</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="project__inner">
                <div className="project__item">
                  <div className="thum">
                    <img src="/assets/img/home-1/project/img4.jpg" alt="bakul" />
                  </div>
                  <div className="content go-up">
                    <div className="content-inner">
                      <p>Plant Care</p>
                      <h6><a href="project-details.html">Garden Cutting</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="project__inner">
                <div className="project__item">
                  <div className="thum">
                    <img src="/assets/img/home-1/project/img2.jpg" alt="bakul" />
                  </div>
                  <div className="content go-up">
                    <div className="content-inner">
                      <p>Plant Care</p>
                      <h6><a href="project-details.html">Guarantee Design</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="project__btn">
          <a href="portfolio.html" className="custom-btn">View All Project</a>
        </div>
      </div>
    </section>
  );
};

export default Project;
