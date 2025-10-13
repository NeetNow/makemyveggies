import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li>About</li>
                  </ul>
                  <h2>About Us</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="about padding-block">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="about__left">
                  <div className="thumb">
                    <img src="/assets/img/about/img1.jpg" alt="About Us" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about__right">
                  <div className="section__header">
                    <span>Welcome To NaturePlant</span>
                    <h3>Beautiful Garden is a Work of Heart</h3>
                    <p>Continually productize compelling quality for packed with elated productize compelling quality for packed in with all elated Them Setting up to website and creating pages.</p>
                  </div>
                  <ul className="about__list">
                    <li><i className="fa-solid fa-check"></i> Professional landscapers</li>
                    <li><i className="fa-solid fa-check"></i> Environmentally friendly</li>
                    <li><i className="fa-solid fa-check"></i> 99% guarantee services</li>
                    <li><i className="fa-solid fa-check"></i> Dedicated support team</li>
                  </ul>
                  <div className="about__btn">
                    <Link to="/contact" className="custom-btn">Contact Us</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats bg-white padding-block">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-3 col-6">
                <div className="stats__item">
                  <div className="thumb">
                    <img src="/assets/img/home-1/welcome/icon1.png" alt="icon" />
                  </div>
                  <div className="text">
                    <h4 className="odometer" data-odometer-final="653">653</h4>
                    <p>Garden Complete</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stats__item">
                  <div className="thumb">
                    <img src="/assets/img/home-1/welcome/icon2.png" alt="icon" />
                  </div>
                  <div className="text">
                    <h4 className="odometer" data-odometer-final="20">20</h4>
                    <p>Award Winning</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stats__item">
                  <div className="thumb">
                    <img src="/assets/img/home-1/counter/icon3.png" alt="icon" />
                  </div>
                  <div className="text">
                    <h4 className="odometer" data-odometer-final="7253">7253</h4>
                    <p>Happy Clients</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stats__item">
                  <div className="thumb">
                    <img src="/assets/img/home-1/counter/icon4.png" alt="icon" />
                  </div>
                  <div className="text">
                    <h4 className="odometer" data-odometer-final="6253">6253</h4>
                    <p>Team Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-preview padding-block">
          <div className="container">
            <div className="section__header text-center">
              <span>Our Team</span>
              <h3>Meet Our Professional Landscapers</h3>
              <p>Continually productize compelling quality for packed business consulting Setting up to website and creating pages.</p>
            </div>
            <div className="row g-4 justify-content-center">
              <div className="col-md-6 col-lg-4 col-xl-3">
                <div className="team__item">
                  <div className="team__inner bg-white">
                    <div className="thumb">
                      <img src="/assets/img/home-1/team/img1.jpg" alt="Team Member" />
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
                      <img src="/assets/img/home-1/team/img2.jpg" alt="Team Member" />
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
                      <img src="/assets/img/home-1/team/img3.jpg" alt="Team Member" />
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
                      <img src="/assets/img/home-1/team/img4.jpg" alt="Team Member" />
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
            <div className="text-center mt-5">
              <Link to="/team" className="custom-btn">View All Team Members</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
