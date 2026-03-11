import React from 'react';
import Footer from '../components/Footer';
import { 
  FileText, 
  Mail, 
  Store, 
  Settings, 
  Info, 
  RefreshCw,
  AlertTriangle,
  Shield
} from 'lucide-react';

const TermsAndConditions = () => {
  const lastUpdated = "March 11, 2026";

  const sections = [
    {
      icon: <FileText size={28} />,
      title: "Overview",
      content: `This website is operated by Saanvi Crop Science Pvt Ltd. Throughout the site, the terms "we", "us" and "our" refer to Saanvi Crop Science Pvt Ltd. We offer this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.

By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms apply to all users of the site.

Please read these Terms carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree, you may not access the website or use any Services.`
    },
    {
      icon: <Store size={28} />,
      title: "Section 1 - Online Store Terms",
      content: `By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence, or that you have given us your consent to allow any of your minor dependents to use this site.

You may not use our products or services for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.

You must not transmit any worms, viruses or any code of a destructive nature. A breach or violation of any of the Terms will result in an immediate termination of your Services.`
    },
    {
      icon: <Settings size={28} />,
      title: "Section 2 - General Conditions",
      content: `We reserve the right to refuse service to anyone for any reason at any time.

You understand that your content (not including credit card information) may be transferred unencrypted and involve transmissions over various networks; and changes to conform and adapt to technical requirements. Credit card information is always encrypted during transfer over networks.

You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission from Saanvi Crop Science Pvt Ltd.`
    },
    {
      icon: <Info size={28} />,
      title: "Section 3 - Accuracy, Completeness and Timeliness of Information",
      content: `We are not responsible if information on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions.`
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Changes to Terms",
      content: `We reserve the right to update, change or replace any part of these Terms by posting updates and/or changes to our website. Your continued use of the website following the posting of any changes constitutes acceptance of those changes.`
    },
    {
      icon: <Mail size={28} />,
      title: "Contact",
      isContact: true,
      content: `Questions about the Terms should be sent to:`,
      contactInfo: {
        email: "support@makemyveggies.com"
      }
    }
  ];

  return (
    <>
      {/* Page Header Banner */}
      <section 
        className="terms-header"
        style={{
          background: 'linear-gradient(135deg, #31381A 0%, #84A33C 100%)',
          padding: '60px 0 80px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  marginBottom: '24px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Shield size={20} color="#fff" />
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                  Legal Agreement
                </span>
              </div>
              <h1 
                style={{
                  color: '#fff',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Terms & Conditions
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '8px' }}>
                Please read these terms carefully before using our services.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Last Updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom curve */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: '#fff',
            borderRadius: '50px 50px 0 0'
          }}
        />
      </section>

      {/* Main Content */}
      <main style={{ background: '#f8f9fa', padding: '60px 0 80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {/* Notice Badge */}
              <div className="text-center mb-5">
                <div
                  style={{
                    background: '#fff',
                    padding: '24px 32px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '16px',
                    margin: '0 auto 40px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <AlertTriangle size={24} color="#84A33C" />
                  <span style={{ color: '#31381A', fontWeight: 500 }}>
                    By using our website, you agree to be bound by these Terms & Conditions.
                  </span>
                </div>
              </div>

              {/* Terms Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {sections.map((section, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      padding: '32px',
                      boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(132, 163, 60, 0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    {/* Section Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          minWidth: '52px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #31381A 0%, #84A33C 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}
                      >
                        {section.icon}
                      </div>
                      <h3 
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          color: '#31381A',
                          margin: 0,
                          paddingTop: '12px'
                        }}
                      >
                        {section.title}
                      </h3>
                    </div>

                    {/* Section Content */}
                    <div style={{ paddingLeft: '68px' }}>
                      {section.content && (
                        <div 
                          style={{ 
                            color: '#555', 
                            lineHeight: '1.8',
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {section.content}
                        </div>
                      )}

                      {/* Contact Info Special Layout */}
                      {section.isContact && (
                        <div style={{ marginTop: '20px' }}>
                          <div 
                            style={{
                              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                              padding: '24px',
                              borderRadius: '12px',
                              border: '1px solid rgba(132, 163, 60, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                          >
                            <Mail size={24} color="#84A33C" />
                            <div>
                              <span style={{ color: '#888', fontSize: '14px', display: 'block' }}>Email</span>
                              <a 
                                href={`mailto:${section.contactInfo.email}`}
                                style={{ 
                                  color: '#84A33C', 
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  fontSize: '1.1rem'
                                }}
                              >
                                {section.contactInfo.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div 
                style={{
                  marginTop: '40px',
                  textAlign: 'center',
                  padding: '24px',
                  background: 'linear-gradient(135deg, #31381A 0%, #1a1f0f 100%)',
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                <p style={{ margin: 0, fontSize: '16px', color: "white"}}>
                  If you have any questions about these Terms, please contact us at{' '}
                  <a href="mailto:support@makemyveggies.com" style={{ color: '#84A33C', textDecoration: 'none' }}>
                    support@makemyveggies.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
