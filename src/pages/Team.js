import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TeamPage = () => {
  return (
    <>
      <Header />
      <main>
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li>Team</li>
                  </ul>
                  <h2>Our Team</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="team padding-block bg-white">
          <div className="container">
            <div className="section__header text-center">
              <span>Our Team Members</span>
              <h3>Professional Landscapers</h3>
              <p>Meet our experienced team of gardening professionals.</p>
            </div>
            <div className="row g-4 justify-content-center">
              {[1, 2, 3, 4, 5, 6].map((member) => (
                <div key={member} className="col-md-6 col-lg-4 col-xl-3">
                  <div className="team__item">
                    <div className="team__inner bg-white">
                      <div className="thumb">
                        <img src={`/assets/img/home-1/team/img${member}.jpg`} alt="Team Member" />
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
                        <h6><Link to="/team-single">Team Member {member}</Link></h6>
                        <p>Gardenist</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TeamPage;
