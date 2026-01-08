import React from 'react';

const Footer = () => {
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
                    As India’s first microgreens-focused platform, we aim to make healthy eating easy and accessible.</p>
                  <div className="allsocialicon">
                    <h6>follow us</h6>
                    <ul>
                      
                      <li><a href="https://www.facebook.com/makemyveggies/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                      <li><button type="button"><i className="fa-brands fa-pinterest"></i></button></li>
                      <li><a href="https://www.linkedin.com/company/makemyveggies/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
                      <li><button type="button"><i className="fa-brands fa-instagram"></i></button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="footer__link">
                <h6>Quick Links</h6>
                <ul>
                  <li><i className="fa-solid fa-leaf"></i><a href="service.html">Terms and Conditions </a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="about.html">Privacy policy</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="project.html">Cancellation Policy</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/contact">Contact Us</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/Login">Track your Order</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="contact.html">Shipping and Returns</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="/About">FAQ</a></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="footer__photo">
                <h6>photo gallery</h6>
                <div className="allphoto">
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame1.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img1.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame2.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img2.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame3.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img3.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame4.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img4.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame5.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img5.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame6.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img6.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame7.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img7.png" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <button type="button"><img src="/assets/img/home-1/footer/gallery/Frame8.png" alt="bakul" /></button>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img8.png" data-rel="lightcase:myCollection">
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
    </section>
  );
};

export default Footer;
