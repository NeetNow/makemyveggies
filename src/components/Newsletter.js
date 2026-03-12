import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/backend/api/subscribe_newsletter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        toast.success(data.message || 'Thank you for subscribing!', {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setEmail('');
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'An error occurred. Please try again later.', {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          top: '70px',
          zIndex: 999999
        }}
      />
      
      <section 
        className="newsletter-section"
        style={{
          padding: '40px 0',
          background: 'linear-gradient(135deg, #84A33C 0%, #31381A 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Elements */}
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div 
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            {/* Icon */}
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                backdropFilter: 'blur(10px)'
              }}
            >
              {isSuccess ? (
                <CheckCircle size={24} color="#fff" />
              ) : (
                <Mail size={24} color="#fff" />
              )}
            </div>

            {/* Heading */}
            <h3 
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '8px',
                lineHeight: 1.3
              }}
            >
              Stay Updated with Fresh News
            </h3>
            
            <p 
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '20px',
                lineHeight: 1.5
              }}
            >
              Subscribe to our newsletter and be the first to know about exclusive deals, 
              new products, and gardening tips delivered straight to your inbox.
            </p>

            {/* Form */}
            <form 
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxWidth: '480px',
                margin: '0 auto'
              }}
            >
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingLeft: '44px',
                    fontSize: '14px',
                    border: 'none',
                    borderRadius: '50px',
                    background: 'rgba(255,255,255,0.95)',
                    color: '#333',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.95)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                />
                <Mail 
                  size={18} 
                  color="#84A33C" 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isSuccess ? '#84A33C' : '#fff',
                  background: isSuccess ? '#fff' : 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50px',
                  cursor: isSubmitting || isSuccess ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && !isSuccess) {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && !isSuccess) {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Subscribing...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={16} />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Note */}
            <p 
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '12px'
              }}
            >
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Spinner Animation Styles */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default Newsletter;
