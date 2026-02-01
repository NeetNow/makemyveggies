import React, { useState } from 'react';
import { toast } from 'react-toastify';
 
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const trimmedEmail = email.trim();
 
    if (!trimmedEmail) {
      toast.error('Please enter your email address');
      return;
    }
 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
 
    setIsSubmitting(true);
 
    try {
      const response = await fetch('http://localhost:3000/makemyveggies/backend/api/subscribe_newsletter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });
 
      const rawText = await response.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        throw new Error('Server returned an invalid response. Please verify the API URL.');
      }
 
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to subscribe');
      }
 
      toast.success(data?.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <section className="newslatter bg-white go-up">
      <div className="container">
        <div className="newslatter__bg">
          <div className="text">
            <h3>Get Latest Updates and Deals</h3>
          </div>
          <div className="newslatter__form">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default Newsletter;
 
 