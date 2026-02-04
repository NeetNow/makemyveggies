import React from 'react';

const Question = () => {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);
  const videoRef = React.useRef(null);

  const closeVideo = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (e) {
      }
    }
    setIsVideoOpen(false);
  };

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
            <div
              className="question__rightimg imghover"
              style={{ backgroundImage: `url(/assets/img/home-2/question/rightimg.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '400px', position: 'relative', overflow: 'hidden', borderRadius: '3%' }}
            >
              {!isVideoOpen && (
                <button
                  type="button"
                  aria-label="Play video"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVideoOpen(true); }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', border: 'none', cursor: 'pointer' }}
                >
                  <span
                    style={{ width: '74px', height: '74px', borderRadius: '50%', background: '#ffffff', display: 'grid', placeItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
                  >
                    <span
                      style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '18px solid #31381A', marginLeft: '3px' }}
                    />
                  </span>
                </button>
              )}

              {isVideoOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close video"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeVideo(); }}
                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '22px', lineHeight: 1, cursor: 'pointer' }}
                  >
                    ×
                  </button>
                  <video
                    ref={videoRef}
                    src="/assets/img/home-2/question/vdo.mov"
                    poster="/assets/img/home-2/question/rightimg.png"
                    controls
                    autoPlay
                    playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </>
              )}
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
