import React from 'react';
import Footer from '../components/Footer';
import { 
  Shield, 
  Mail, 
  MapPin, 
  Database, 
  Monitor, 
  ShoppingBag, 
  Baby, 
  Share2, 
  Target, 
  FileText,
  Cookie,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "March 11, 2026";

  const sections = [
    {
      icon: <Shield size={28} />,
      title: "Privacy Policy",
      content: `This Privacy Policy describes how Saanvi Crop Science Pvt Ltd ("we", "us", "our") collects, uses, and discloses your personal information when you visit or make a purchase from this website (the "Site").`
    },
    {
      icon: <Mail size={28} />,
      title: "Contact",
      isContact: true,
      content: `After reviewing this policy, if you have additional questions, want more information about our privacy practices, or would like to make a complaint, please contact us:`,
      contactInfo: {
        email: "support@makemyveggies.com",
        address: [
          "SAANVI CROP SCIENCE PRIVATE LIMITED",
          "Gate No-1, Manjari Green Society,",
          "Manjari BK, Haveli,",
          "Pune- 412307,",
          "Maharashtra"
        ]
      }
    },
    {
      icon: <Database size={28} />,
      title: "Collecting Personal Information",
      content: `When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.

"Personal Information" refers to information that identifies or relates to an identifiable individual.`
    },
    {
      icon: <Monitor size={28} />,
      title: "Device Information",
      details: [
        { label: "Purpose of collection", text: "To load the Site accurately for you and to analyze site usage to improve performance and user experience." },
        { label: "Source of collection", text: "Collected automatically through cookies, log files, web beacons, tags, or pixels." },
        { label: "Disclosure for a business purpose", text: "Shared with service providers who support our website and business operations." },
        { label: "Personal Information collected", text: "Web browser version, IP address, time zone, cookie information, pages or products viewed, search terms, and interactions with the Site." }
      ]
    },
    {
      icon: <ShoppingBag size={28} />,
      title: "Order Information",
      details: [
        { label: "Purpose of collection", text: "To process orders, payments, shipping, provide invoices or confirmations, communicate with you, screen for potential fraud or risk, and provide information or marketing communications where permitted." },
        { label: "Source of collection", text: "Collected directly from you." },
        { label: "Disclosure for a business purpose", text: "Shared with payment processors, logistics partners, and service providers necessary to complete transactions." },
        { label: "Personal Information collected", text: "Name, billing address, shipping address, payment details, email address, and phone number." }
      ]
    },
    {
      icon: <Baby size={28} />,
      title: "Minors",
      content: `The Site is not intended for individuals under the age of 60 months. We do not knowingly collect Personal Information from children. If you believe a child has provided Personal Information, please contact us to request deletion.`
    },
    {
      icon: <Share2 size={28} />,
      title: "Sharing Personal Information",
      content: `We share your Personal Information with trusted service providers to help operate the Site, fulfill orders, process payments, deliver products, and comply with legal obligations.

We may also disclose Personal Information to comply with applicable laws, regulations, legal processes, or lawful government requests, or to protect our rights.`
    },
    {
      icon: <Target size={28} />,
      title: "Behavioral Advertising",
      content: `We may use your Personal Information to provide marketing communications or advertisements that we believe may be relevant to you.

Information about your interaction with the Site, purchases, or advertisements may be shared with advertising and analytics partners through cookies or similar technologies, subject to applicable laws and your consent preferences.

You may manage or opt out of targeted advertising through your device or browser settings.`
    },
    {
      icon: <FileText size={28} />,
      title: "Using Personal Information",
      listItems: [
        "Offer products for sale",
        "Process payments",
        "Fulfill and ship orders",
        "Communicate with you regarding orders or inquiries",
        "Provide updates, offers, and promotional communications (where permitted)"
      ]
    },
    {
      icon: <Cookie size={28} />,
      title: "Cookies",
      content: `Cookies are small data files placed on your device when you visit the Site. We use cookies to improve functionality, analyze performance, and enhance your browsing experience.

Cookies may be session cookies (which expire when you close your browser) or persistent cookies (which remain until deleted or expired).

You can control or disable cookies through your browser settings. Please note that disabling cookies may affect certain features or functionality of the Site.`
    },
    {
      icon: <EyeOff size={28} />,
      title: "Do Not Track",
      content: `There is no consistent industry standard for responding to "Do Not Track" signals. As a result, we do not alter our data collection or usage practices when such signals are detected.`
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Changes to This Privacy Policy",
      content: `We may update this Privacy Policy periodically to reflect changes to our practices, legal requirements, or operational needs. Updates will be posted on this page.`
    },
    {
      icon: <AlertCircle size={28} />,
      title: "Complaints",
      content: `If you have concerns or complaints about how your Personal Information is handled, please contact us using the details provided above.

If you are not satisfied with our response, you may have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.`
    }
  ];

  return (
    <>
      {/* Page Header Banner */}
      <section 
        className="privacy-header"
        style={{
          background: 'linear-gradient(135deg, #84A33C 0%, #31381A 100%)',
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
                  Legal Information
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
                Privacy Policy
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '8px' }}>
                Your privacy is important to us. Learn how we collect, use, and protect your information.
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
              {/* Trust Badge */}
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
                  <CheckCircle size={24} color="#84A33C" />
                  <span style={{ color: '#31381A', fontWeight: 500 }}>
                    We are committed to protecting your personal information and your right to privacy.
                  </span>
                </div>
              </div>

              {/* Policy Sections */}
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
                          background: 'linear-gradient(135deg, #84A33C 0%, #6B8A2F 100%)',
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
                              border: '1px solid rgba(132, 163, 60, 0.2)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                              <Mail size={20} color="#84A33C" />
                              <div>
                                <span style={{ color: '#888', fontSize: '14px', display: 'block' }}>Email</span>
                                <a 
                                  href={`mailto:${section.contactInfo.email}`}
                                  style={{ 
                                    color: '#84A33C', 
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                  }}
                                >
                                  {section.contactInfo.email}
                                </a>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <MapPin size={20} color="#84A33C" style={{ marginTop: '4px' }} />
                              <div>
                                <span style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Mailing Address</span>
                                <address style={{ color: '#555', fontStyle: 'normal', lineHeight: '1.6', margin: 0 }}>
                                  {section.contactInfo.address.map((line, i) => (
                                    <span key={i} style={{ display: 'block' }}>{line}</span>
                                  ))}
                                </address>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Detail Items */}
                      {section.details && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {section.details.map((detail, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ color: '#31381A', fontWeight: 600, fontSize: '15px' }}>
                                {detail.label}:
                              </span>
                              <span style={{ color: '#666', lineHeight: '1.6' }}>
                                {detail.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* List Items */}
                      {section.listItems && (
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {section.listItems.map((item, i) => (
                            <li 
                              key={i} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                padding: '10px 0',
                                borderBottom: i < section.listItems.length - 1 ? '1px solid #f0f0f0' : 'none'
                              }}
                            >
                              <div 
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: 'rgba(132, 163, 60, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <CheckCircle size={14} color="#84A33C" />
                              </div>
                              <span style={{ color: '#555' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
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
                  If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPolicy;
