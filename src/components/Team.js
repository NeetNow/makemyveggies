import React from 'react';
import { Link } from 'react-router-dom';

const Team = () => {
  return (
    <section className="team padding-block bg-white overflow-hidden">
      <div className="container">
        <div className="section__header section__header--header2">
          <span>Our Team Member<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
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
                    <img src="/assets/img/home-1/team/img1.jpg" alt="bakul" />
                    <div className="allicon go-up">
                      <div className="fixedicon">
                        <i className="fa-sharp fa-regular fa-share-nodes"></i>
                      </div>
                      <ul>
                        <li><a href="#"><i className="fa-sharp fa-regular fa-basketball"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
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
                    <img src="/assets/img/home-1/team/img2.jpg" alt="bakul" />
                    <div className="allicon go-up">
                      <div className="fixedicon">
                        <i className="fa-sharp fa-regular fa-share-nodes"></i>
                      </div>
                      <ul>
                        <li><a href="#"><i className="fa-sharp fa-regular fa-basketball"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
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
                    <img src="/assets/img/home-1/team/img3.jpg" alt="bakul" />
                    <div className="allicon go-up">
                      <div className="fixedicon">
                        <i className="fa-sharp fa-regular fa-share-nodes"></i>
                      </div>
                      <ul>
                        <li><a href="#"><i className="fa-sharp fa-regular fa-basketball"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
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
                    <img src="/assets/img/home-1/team/img4.jpg" alt="bakul" />
                    <div className="allicon go-up">
                      <div className="fixedicon">
                        <i className="fa-sharp fa-regular fa-share-nodes"></i>
                      </div>
                      <ul>
                        <li><a href="#"><i className="fa-sharp fa-regular fa-basketball"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
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
        <a href="team-single.html" className="custom-btn">View All members</a>
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
