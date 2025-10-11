import React from 'react';

const Counter = () => {
  return (
    <div className="counter overflow-hidden padding-block overly">
      <div className="container">
        <div className="row g-5 justify-content-center">
          <div className="col-6 col-md-4 col-lg-3">
            <div className="counter__item">
              <div className="counter__inner go-up">
                <div className="thumb">
                  <img src="/assets/img/home-1/counter/icon1.png" alt="bakul" />
                </div>
                <div className="counter__content">
                  <div className="maincounter">
                    <h4 className="odometer" data-odometer-final="5253">2654</h4>
                  </div>
                  <h6>Garden Complete</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-3">
            <div className="counter__item">
              <div className="counter__inner go-up">
                <div className="thumb">
                  <img src="/assets/img/home-1/counter/icon2.png" alt="bakul" />
                </div>
                <div className="counter__content">
                  <div className="maincounter">
                    <h4 className="odometer" data-odometer-final="6253">2654</h4>
                  </div>
                  <h6>satisfied Clients</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-3">
            <div className="counter__item">
              <div className="counter__inner go-up">
                <div className="thumb">
                  <img src="/assets/img/home-1/counter/icon3.png" alt="bakul" />
                </div>
                <div className="counter__content">
                  <div className="maincounter">
                    <h4 className="odometer" data-odometer-final="7253">2654</h4>
                  </div>
                  <h6>National Award</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-3">
            <div className="counter__item">
              <div className="counter__inner go-up">
                <div className="thumb">
                  <img src="/assets/img/home-1/counter/icon4.png" alt="counterimg" />
                </div>
                <div className="counter__content">
                  <div className="maincounter">
                    <h4 className="odometer" data-odometer-final="6253">2654</h4>
                  </div>
                  <h6>Team Members</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
