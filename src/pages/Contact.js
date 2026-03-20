import React, { useState } from 'react';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://dev.makemyveggies.com/';

const Contact = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = String(form.email || '').trim();
    const message = String(form.message || '').trim();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!message) {
      toast.error('Please enter your message');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}backend/api/submit_contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: String(form.firstName || '').trim(),
          lastName: String(form.lastName || '').trim(),
          phone: String(form.phone || '').trim(),
          email,
          subject: String(form.subject || '').trim(),
          message
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to send message');
      }

      toast.success(data?.message || 'Message sent successfully');
      setNotification({
        type: 'success',
        message: data?.message || 'Message sent successfully! We will get back to you soon.'
      });
      setIsSubmitted(true);
      setForm({ firstName: '', lastName: '', phone: '', email: '', subject: '', message: '' });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      toast.error(error?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {notification && (
              <div className="row mb-4">
                <div className="col-12">
                  <div 
                    style={{
                      background: '#d4edda',
                      border: '1px solid #c3e6cb',
                      color: '#155724',
                      padding: '15px 20px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <i className="fa-solid fa-check-circle" style={{ fontSize: '24px' }}></i>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>{notification.message}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="contact__form">
                  <h3>Get In Touch</h3>
                  {isSubmitted ? (
                    <div className="success-message" style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: '#28a745', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                      }}>
                        <i className="fa-solid fa-check" style={{ fontSize: '40px', color: '#fff' }}></i>
                      </div>
                      <h4 style={{ color: '#28a745', marginBottom: '15px' }}>Submitted Successfully</h4>
                      <p style={{ fontSize: '16px', color: '#666', marginBottom: '25px' }}>
                        Your message has been submitted successfully. We will get back to you soon.
                      </p>
                      <button 
                        type="button" 
                        className="custom-btn"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <input
                            type="tel"
                            placeholder="Contact Number"
                            value={form.phone}
                            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="col-12">
                          <textarea
                            placeholder="Your Message"
                            value={form.message}
                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            disabled={isSubmitting}
                            required
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="custom-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
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
                      <p>SAANVI CROP SCIENCE PRIVATE LIMITED
                          Gate No-1, Manjari Green Society,
                          Manjari BK, Haveli,
                          Pune – 412307,
                          Maharashtra, India</p>
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