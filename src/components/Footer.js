import React from 'react';

const Footer = () => {
  const [lightboxSrc, setLightboxSrc] = React.useState(null);
  const openLightbox = (e, src) => { e.preventDefault(); e.stopPropagation(); setLightboxSrc(src); };

  return (
    <section className="footer overflow-hidden">
      <div className="footer__top">
        <div className="container">
          <div className="row g-3">
            <div className="col-sm-6 col-lg-4">
              <div className="footer__about">
                <h6>about us</h6>
                <div className="text">
                  <p>Make My Veggies is an e-commerce website selling fresh microgreens and wellness products.
                    As Indiaâ€™s first microgreens-focused platform, we aim to make healthy eating easy and accessible.</p>
                  <div className="allsocialicon">
                    <h6>follow us</h6>
                    <ul>
                      
                      <li><a href="https://www.facebook.com/makemyveggies/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                      <li><button type="button"><i className="fa-brands fa-pinterest"></i> </button></li>
                      <li><a href="https://www.linkedin.com/company/makemyveggies/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
                      <li><button type="button"><i className="fa-brands fa-instagram"></i> </button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="footer__link">
                <h6>Quick Links</h6>
                <ul>
                  <li><i className="fa-solid fa-leaf"></i><a href="/terms-and-conditions">Terms and Conditions </a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/privacy-policy">Privacy policy</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/terms-and-conditions">Cancellation Policy</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/contact">Contact Us</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/order-tracking">Track your Order</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/ShippingPolicy">Shipping and Returns</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/About">FAQ</a></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="footer__photo">
                <h6>photo gallery</h6>
                <div className="allphoto">
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame1.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img1.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img1.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame2.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img2.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img2.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame3.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img3.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img3.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame4.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img4.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img4.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame5.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img5.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img5.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame6.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img6.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img6.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame7.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img7.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img7.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame8.png" alt="bakul" /> </button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img8.png" data-rel="lightcase:myCollection" onClick={(e) => openLightbox(e, '/assets/img/home-1/footer/gallery/img8.png') }>
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p><i className="fa-regular fa-copyright"></i> Make My Veggies is a brand developed by SAANVI CROP SCEINCE PVT. LTD.</p>
        <p>Registered in India and operating since 2024</p>
      </div>
          {lightboxSrc && (
        <div
          className="mmv-lightbox"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setLightboxSrc(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close"
              onClick={() => { setLightboxSrc(null); }}
              style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', color: '#fff', border: 'none', padding: 0, width: 'auto', height: 'auto', fontSize: '28px', lineHeight: 1, cursor: 'pointer' }}
            >
              ×
            </button>
            <img src={lightboxSrc} alt="gallery" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }} />
          </div>
        </div>
      )}    </section>
  );
};

export default Footer;





