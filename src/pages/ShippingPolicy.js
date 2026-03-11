import React from 'react';
import Footer from '../components/Footer';
import { 
  Truck, 
  Mail, 
  Clock, 
  Package, 
  RefreshCw,
  XCircle,
  MapPin,
  CheckCircle
} from 'lucide-react';

const ShippingPolicy = () => {
  const lastUpdated = "March 11, 2026";

  const sections = [
    {
      icon: <Truck size={28} />,
      title: "Shipping Policy",
      content: `SAANVI CROP SCIENCE PRIVATE LIMITED ensures quality products and secure packaging for all customers. We have partnered with reputed courier agencies to ensure safe and timely delivery.

Free shipping is available on orders above ₹559.`
    },
    {
      icon: <Clock size={28} />,
      title: "How Long Does It Take For An Order To Be Delivered?",
      listItems: [
        "All orders are shipped from our warehouse within 1 working day.",
        "Most orders are delivered within 2–8 working days from the date the order is placed.",
        "Order tracking details will be shared once the order is dispatched."
      ]
    },
    {
      icon: <Package size={28} />,
      title: "Returns",
      content: `Can you return plants? No.

SAANVI CROP SCIENCE PRIVATE LIMITED does not accept returns on products.

If you have any concerns, please contact our support team:`,
      isContact: true,
      contactInfo: {
        email: "support@makemyveggies.com"
      }
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Replacement Policy",
      content: `If a wrong or damaged product is delivered, the issue must be reported to us within 1 day of delivery, along with clear images of the product and packaging.

Upon verification, we will initiate a replacement shipment accordingly.`
    },
    {
      icon: <XCircle size={28} />,
      title: "Cancellation Policy",
      content: `At SAANVI CROP SCIENCE PRIVATE LIMITED, we strive to provide prompt and efficient service. Please review our cancellation policy below:`,
      subsections: [
        {
          title: "1. Order Cancellation Before Shipping",
          content: "Orders can be canceled free of charge if the cancellation request is received before the order is shipped. Orders are typically shipped within 24 hours of placement. To cancel an order, please contact our customer support team as soon as possible."
        },
        {
          title: "2. Order Cancellation After Shipping",
          content: "If a cancellation request is made after the order has been shipped, a ₹200 cancellation fee will be deducted from the refund (if refund applicable). Original delivery charges are non-refundable. For orders with a total value below ₹200, a 100% cancellation fee will apply and no refund will be issued."
        },
        {
          title: "3. Delivery Charges",
          content: "Delivery charges are non-refundable under all circumstances, including order cancellations."
        }
      ]
    },
    {
      icon: <MapPin size={28} />,
      title: "Registered Office Address",
      isAddress: true,
      content: ``,
      addressInfo: [
        "SAANVI CROP SCIENCE PRIVATE LIMITED",
        "Gate No-1, Manjari Green Society,",
        "Manjari BK, Haveli,",
        "Pune – 412307,",
        "Maharashtra, India"
      ]
    }
  ];

  return (
    <>
      {/* Page Header Banner */}
      <section 
        className="shipping-header"
        style={{
          background: 'linear-gradient(135deg, #84A33C 0%, #6B8A2F 100%)',
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
                <Truck size={20} color="#fff" />
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                  Delivery Information
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
                Shipping Policy
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '8px' }}>
                Learn about our shipping, returns, and cancellation policies.
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
              {/* Free Shipping Badge */}
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
                    flexWrap: 'wrap',
                    border: '2px solid #84A33C'
                  }}
                >
                  <CheckCircle size={28} color="#84A33C" />
                  <div>
                    <span style={{ color: '#31381A', fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>
                      Free Shipping Available
                    </span>
                    <span style={{ color: '#84A33C', fontWeight: 500 }}>
                      On all orders above ₹559
                    </span>
                  </div>
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

                      {/* List Items */}
                      {section.listItems && (
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {section.listItems.map((item, i) => (
                            <li 
                              key={i} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: '12px',
                                padding: '12px 0',
                                borderBottom: i < section.listItems.length - 1 ? '1px solid #f0f0f0' : 'none'
                              }}
                            >
                              <div 
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  minWidth: '24px',
                                  borderRadius: '50%',
                                  background: 'rgba(132, 163, 60, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '2px'
                                }}
                              >
                                <CheckCircle size={14} color="#84A33C" />
                              </div>
                              <span style={{ color: '#555', lineHeight: '1.6' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Subsections (for Cancellation Policy) */}
                      {section.subsections && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                          {section.subsections.map((sub, i) => (
                            <div 
                              key={i}
                              style={{
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid rgba(132, 163, 60, 0.15)'
                              }}
                            >
                              <h4 style={{ color: '#31381A', fontWeight: 600, fontSize: '1rem', marginBottom: '10px' }}>
                                {sub.title}
                              </h4>
                              <p style={{ color: '#666', lineHeight: '1.7', margin: 0 }}>
                                {sub.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Contact Info for Returns */}
                      {section.isContact && (
                        <div style={{ marginTop: '16px' }}>
                          <div 
                            style={{
                              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                              padding: '16px 20px',
                              borderRadius: '10px',
                              border: '1px solid rgba(132, 163, 60, 0.2)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >
                            <Mail size={18} color="#84A33C" />
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
                      )}

                      {/* Address Info */}
                      {section.isAddress && (
                        <div style={{ marginTop: '8px' }}>
                          <div 
                            style={{
                              background: 'linear-gradient(135deg, #31381A 0%, #1a1f0f 100%)',
                              padding: '24px',
                              borderRadius: '12px',
                              color: '#fff'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <MapPin size={22} color="#84A33C" style={{ marginTop: '2px' }} />
                              <address style={{ fontStyle: 'normal', lineHeight: '1.8', margin: 0 }}>
                                {section.addressInfo.map((line, i) => (
                                  <span key={i} style={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
                                    {line}
                                  </span>
                                ))}
                              </address>
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
                  color: '#ffffff'
                }}
              >
                <p style={{ margin: 0, fontSize: '16px', color: "white"}}>
                  Have questions about shipping? Contact us at{' '}
                  <a href="mailto:support@makemyveggies.com" style={{ color: '#84A33C', textDecoration: 'none', fontWeight: 600 }}>
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

export default ShippingPolicy;
