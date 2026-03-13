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
    <section className="question padding-block"  id="faq">
      <div className="container">
        <div className="section__header w-100">
          <div className="col-lg-7 col-xl-6">
            <span>Asked Questions<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
            <h3>Frequently Asked Questions.</h3>
            <p>Get quick answers about grow kits, plant care, and product use— <br />everything you need to start and succeed in your home gardening journey 🌱</p>
          </div>
        </div>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7 col-xl-6">
            <div className="section__wrapper">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      How do Make My Veggies grow kits work?<span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>Our kits have everything you need — seeds, soil mix, and basic tools. Just follow the simple steps in the guide, and your plants will start growing.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      What can I grow with Make My Veggies kits?<span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>You can grow fresh vegetables, herbs, and other useful plants. We have different kits based on what you want to grow.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Are Make My Veggies kits good for beginners?<span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>Yes! Our kits are perfect for beginners. The instructions are simple and easy to follow.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item accordion-item--itme2Serpage">
                  <h2 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      How long does it take for plants to grow?<span className="plus-icon"></span>
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <p>It depends on the plant. Most plants start growing within a few weeks if you take good care of them.</p>
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
