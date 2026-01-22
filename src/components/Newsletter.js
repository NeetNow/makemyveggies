import React from 'react';

const Newsletter = () => {
  return (
    <section className="newslatter bg-white go-up">
      <div className="container">
        <div className="newslatter__bg">
          <div className="text">
            <h3>Get Latest Updates and Deals</h3>
          </div>
          <div className="newslatter__form">
            <form action="#0">
              <input type="email" placeholder="Enter your Email" />
              <button type="submit">Subscribe Now</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
