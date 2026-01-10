import React from 'react';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <main>
        <section className="faq padding-block">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <h2
                      className="text-center"
                      style={{
                        marginBottom: '40px',
                        marginTop: '20px'
                      }}
                    >
                      Terms &amp; Conditions
                    </h2>
                  </div>
                </div>

                <div className="faq__content">
                  <div className="faq__item">
                    <h4>OVERVIEW</h4>
                    <p>
                      This website is operated by Saanvi Crop Science Pvt Ltd. Throughout the site,
                      the terms “we”, “us” and “our” refer to Saanvi Crop Science Pvt Ltd. We offer
                      this website, including all information, tools and services available from
                      this site to you, the user, conditioned upon your acceptance of all terms,
                      conditions, policies and notices stated here.
                    </p>
                    <p>
                      By visiting our site and/or purchasing something from us, you engage in our
                      “Service” and agree to be bound by the following terms and conditions
                      (“Terms of Service”, “Terms”), including those additional terms and
                      conditions and policies referenced herein and/or available by hyperlink.
                      These Terms apply to all users of the site.
                    </p>
                    <p>
                      Please read these Terms carefully before accessing or using our website.
                      By accessing or using any part of the site, you agree to be bound by these
                      Terms. If you do not agree, you may not access the website or use any
                      Services.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>SECTION 1 - ONLINE STORE TERMS</h4>
                    <p>
                      By agreeing to these Terms, you represent that you are at least the age of
                      majority in your state or province of residence, or that you have given us
                      your consent to allow any of your minor dependents to use this site.
                    </p>
                    <p>
                      You may not use our products or services for any illegal or unauthorized
                      purpose nor may you, in the use of the Service, violate any laws in your
                      jurisdiction.
                    </p>
                    <p>
                      You must not transmit any worms, viruses or any code of a destructive
                      nature. A breach or violation of any of the Terms will result in an
                      immediate termination of your Services.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>SECTION 2 - GENERAL CONDITIONS</h4>
                    <p>
                      We reserve the right to refuse service to anyone for any reason at any time.
                    </p>
                    <p>
                      You understand that your content (not including credit card information)
                      may be transferred unencrypted and involve transmissions over various
                      networks; and changes to conform and adapt to technical requirements.
                      Credit card information is always encrypted during transfer over networks.
                    </p>
                    <p>
                      You agree not to reproduce, duplicate, copy, sell, resell or exploit any
                      portion of the Service without express written permission from Saanvi Crop
                      Science Pvt Ltd.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h4>
                    <p>
                      We are not responsible if information on this site is not accurate,
                      complete or current. The material on this site is provided for general
                      information only and should not be relied upon as the sole basis for making
                      decisions.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>CHANGES TO TERMS</h4>
                    <p>
                      We reserve the right to update, change or replace any part of these Terms
                      by posting updates and/or changes to our website. Your continued use of the
                      website following the posting of any changes constitutes acceptance of
                      those changes.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>CONTACT</h4>
                    <p>
                      Questions about the Terms should be sent to <strong>support@makemyveggies.com</strong>.
                    </p>
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

export default TermsAndConditions;
