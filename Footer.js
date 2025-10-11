import React from 'react';

const Footer = () => {
  return (
    <section className="footer overflow-hidden">
      <div className="footer__top">
        <div className="container">
          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="footer__about">
                <h6>about us</h6>
                <div className="text">
                  <p>We believe that boutique practice are better placed info respond quickly our
                    client bespoke service</p>
                  <div className="allsocialicon">
                    <h6>follow us</h6>
                    <ul>
                      <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fa-sharp fa-regular fa-basketball"></i></a></li>
                      <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                      <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer__link">
                <h6>Quick Links</h6>
                <ul>
                  <li><i className="fa-solid fa-leaf"></i><a href="service.html">Garden Services</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="about.html">About Company</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="project.html">Garden Projects</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="team.html">Team Member</a></li>
                  <li><i className="fa-solid fa-leaf"></i><a href="contact.html">Contact us</a></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer__news">
                <h6>Recent news</h6>
                <ul>
                  <li>
                    <div className="thumb imghover">
                      <a href="blog-single.html"><img src="/assets/img/home-1/footer/news/img1.jpg" alt="bakul" /></a>
                    </div>
                    <div className="text">
                      <h6><a href="blog-single.html">How to Clean Your Fast More Efficiently.</a></h6>
                      <p>14 July 2024</p>
                    </div>
                  </li>
                  <li>
                    <div className="thumb imghover">
                      <a href="blog-single.html"><img src="/assets/img/home-1/footer/news/img2.jpg" alt="bakul" /></a>
                    </div>
                    <div className="text">
                      <h6><a href="blog-single.html">How to Clean Your Fast More Efficiently.</a></h6>
                      <p>14 July 2024</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer__photo">
                <h6>photo gallery</h6>
                <div className="allphoto">
                  <div className="item imghover">
                    <a href="#"><img src="/assets/img/home-1/footer/gallery/img1.jpg" alt="bakul" /></a>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img1.jpg" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <a href="#"><img src="/assets/img/home-1/footer/gallery/img2.jpg" alt="bakul" /></a>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img2.jpg" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <a href="#"><img src="/assets/img/home-1/footer/gallery/img3.jpg" alt="bakul" /></a>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img3.jpg" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <a href="#"><img src="/assets/img/home-1/footer/gallery/img4.jpg" alt="bakul" /></a>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img4.jpg" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <a href="#"><img src="/assets/img/home-1/footer/gallery/img5.jpg" alt="bakul" /></a>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img5.jpg" data-rel="lightcase:myCollection">
                          <i className="fa-sharp fa-regular fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="item imghover">
                    <a href="#"><img src="/assets/img/home-1/footer/gallery/img6.jpg" alt="bakul" /></a>
                    <div className="inneritem go-up">
                      <div className="upitem search">
                        <a href="/assets/img/home-1/footer/gallery/img6.jpg" data-rel="lightcase:myCollection">
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
        <p><i className="fa-regular fa-copyright"></i> Copyright 2024. All Rights Reserved</p>
      </div>
    </section>
  );
};

export default Footer;
