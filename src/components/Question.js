import React from 'react';

const Question = () => {
  return (
    <section className="question padding-block">
      <div className="container">
        <div className="section__header w-100">
          <div className="col-lg-7 col-xl-6">
            <span>Asked Questions<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
            <h3>Frequently Asked Questions.</h3>
            <p>Continually productize compelling quality packed business consulting Setting up to website and creating pages.</p>
          </div>
        </div>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7 col-xl-6">
            <div className="section__wrapper">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Automobile Manufacturing<span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>Since 2000 we have been and visionary and an reliable software engineering partner for world class brands an We are a boutique digital transformation consultancy.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Oil Gas & Power Energy Plant <span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>Since 2000 we have been and visionary and an reliable software engineering partner for world class brands an We are a boutique digital transformation consultancy.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Petroleum & Refinery <span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>Since 2000 we have been and visionary and an reliable software engineering partner for world class brands an We are a boutique digital transformation consultancy.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      Automobile Manufacturing <span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>Since 2000 we have been and visionary and an reliable software engineering partner for world class brands an We are a boutique digital transformation consultancy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-xl-6">
            <div className="question__rightimg imghover" style={{ backgroundImage: `url(/assets/img/home-2/question/rightimg.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '400px' }}>
              
            </div>
          </div>
        </div>
      </div>
      <div className="leftshape top-bottom d-none">
        <img src="/assets/img/home-2/question/topleft.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Question;
