import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ = () => {
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
                    <li>FAQ</li>
                  </ul>
                  <h2>Frequently Asked Questions</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="faq padding-block">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="faq__content">
                  <div className="faq__item">
                    <h4>What services do you offer?</h4>
                    <p>We offer a comprehensive range of gardening and landscaping services including garden design, lawn care, tree services, irrigation systems, and landscape maintenance.</p>
                  </div>
                  <div className="faq__item">
                    <h4>How much do your services cost?</h4>
                    <p>Our pricing varies depending on the scope of work. We provide free consultations and detailed quotes for all projects. Contact us for a personalized estimate.</p>
                  </div>
                  <div className="faq__item">
                    <h4>Do you offer emergency services?</h4>
                    <p>Yes, we provide emergency tree removal and storm damage cleanup services. Call us anytime for urgent landscaping needs.</p>
                  </div>
                  <div className="faq__item">
                    <h4>Are your services environmentally friendly?</h4>
                    <p>Absolutely! We use eco-friendly products and sustainable practices in all our services. We're committed to protecting the environment while creating beautiful landscapes.</p>
                  </div>
                  <div className="faq__item">
                    <h4>How do I schedule a consultation?</h4>
                    <p>You can schedule a free consultation by calling us at +041-982-3648 or filling out the contact form on our website. We'll arrange a convenient time to discuss your project.</p>
                  </div>
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

export default FAQ;
