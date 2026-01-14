import React from 'react';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <>
      <main>
        <section className="pageheader3 overflow-hidden">
                  <div className="container">
                    <div className="pageheader__content">
                      <h2>Contact Make My Veggies</h2>
                    </div>
                  </div>
                </section>

        <section className="contact padding-block">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="contact__form">
                  <h3>Get In Touch</h3>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input type="text" placeholder="First Name" />
                      </div>
                      <div className="col-md-6">
                        <input type="text" placeholder="Last Name" />
                      </div>
                      <div className="col-12">
                        <input type="tel" placeholder="Contact Number" />
                      </div>
                      <div className="col-12">
                        <input type="email" placeholder="Email Address" />
                      </div>
                      <div className="col-12">
                        <input type="text" placeholder="Subject" />
                      </div>
                      <div className="col-12">
                        <textarea placeholder="Your Message"></textarea>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="custom-btn">Send Message</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="contact__info">
                  <h3>Contact Information</h3>
                  <div className="contact__item">
                    <div className="icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="text">
                      <h6>Phone</h6>
                      <p>77980-40848</p>
                    </div>
                  </div>
                  <div className="contact__item">
                    <div className="icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="text">
                      <h6>Email</h6>
                      <p>sales@makemyveggies.com</p>
                    </div>
                  </div>
                  <div className="contact__item">
                    <div className="icon">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="text">
                      <h6>Address</h6>
                      <p>City - Pune</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="map padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="map__container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d134808.32197304978!2d73.80310711615661!3d18.527071546856202!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1767882727746!5m2!1sen!2sus"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;