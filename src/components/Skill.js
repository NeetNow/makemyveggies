import React from 'react';

const Skill = () => {
  return (
    <section className="skill padding-block overflow-hidden" style={{ background: '#BCCD88' }}>
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className="section__header skill__header">
              <div className="col-lg-12 col-xl-10">
                <span>We’re Skilled Full<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
                <h3>Experience Gardening & Landscape Center</h3>
                <p>We provide high-quality DIY gardening kits and expert support to make home gardening simple, effective, and enjoyable.</p>
              </div>
            </div>
            <div className="section-wrapper">
              <div className="skill-bar-wrapper">
                <div className="skill__item skill__item--itemaboutpage">
                  <div className="skill-title">
                    <div className="left">Gardening</div>
                    <div className="right">
                      <span className="odometer" data-odometer-final="70">70</span>
                      <span>%</span>
                    </div>
                  </div>
                  <div className="skillbar-container clearfix" data-percent="70%">
                    <div className="skills" style={{ background: '#73B611', width: '70%' }}></div>
                  </div>
                </div>
                <div className="skill__item skill__item--itemaboutpage">
                  <div className="skill-title">
                    <div className="left">Landscape</div>
                    <div className="right">
                      <span className="odometer" data-odometer-final="60">60</span>
                      <span>%</span>
                    </div>
                  </div>
                  <div className="skillbar-container clearfix" data-percent="60%">
                    <div className="skills" style={{ background: '#73B611', width: '60%' }}></div>
                  </div>
                </div>
                <div className="skill__item skill__item--itemaboutpage">
                  <div className="skill-title">
                    <div className="left">Maintenance</div>
                    <div className="right">
                      <span className="odometer" data-odometer-final="90">90</span>
                      <span>%</span>
                    </div>
                  </div>
                  <div className="skillbar-container clearfix" data-percent="90%">
                    <div className="skills" style={{ background: '#73B611', width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 pt-lg-0 pt-4">
            <div className="skill__aboutskill imghover text-center">
              <img src="/assets/img/about/skill/bg.png" alt="bakul" />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bottom-right right-left d-xxl-block d-none">
        <img src="/assets/img/home-1/welcome/img1.png" alt="bakul" />
      </div> */}
      <div className="topleft top-bottom d-none">
        <img src="/assets/img/home-2/service/topshape.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Skill;
