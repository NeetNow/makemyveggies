import React from 'react';

const Banner = () => {
  return (
    <div className="banner banner--static">
      <div className="hostbanner">
        <div className="container">
          <div className="banner__content col-md-7 col-xl-6">
            <h2>We are helping you to be self dependent for food</h2>
            <p>Our kits are designed to empower individuals and families to take small 
              but meaningful steps toward self-sufficiency. From growing fresh vegetables 
              and herbs to understanding the basics of sustainable food systems, microgeens 
              turns everyday spaces into productive green corners. We believe growing your 
              own food builds healthier habits, stronger connections with nature, and a more 
              sustainable future. With microgeens and veggies, anyone can start growing—no farm, 
              no prior experience, just curiosity and care.</p>
            <div className="bannerbtn">
              <a href="/about" className="custom-btn">Learn More</a>
              <a href="/contact" className="custom-btn">Contact Us</a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Images */}
      <div className="position_bshape contentrightimg imghover d-md-block d-none">
        <img src="/assets/img/home-1/banner/bannerightimg.jpeg" alt="bakul" />
      </div>
      <div className="position_bshape topright">
        <img src="/assets/img/home-1/banner/shape5.png" alt="bakul" />
      </div>
      <div className="position_bshape bottommiddle d-lg-block d-none">
        <img src="/assets/img/home-1/banner/shape3.png" alt="bakul" />
      </div>
    </div>
  );
};

export default Banner;
