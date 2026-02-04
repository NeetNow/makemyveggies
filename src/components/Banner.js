import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const Banner = () => {
  return (
    <div className="banner">
      <div className="hostbanner">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          speed={3000}
          className="swiper-container"
        >
          <SwiperSlide>
            <div className="container">
              <div className="banner__content col-md-7 col-xl-6">
                <h3>Helping you be self-dependent in food</h3>
                <p>Our kits empower individuals and families to take small steps toward self-sufficiency. 
                  By growing fresh vegetables and herbs, microgeens turns everyday spaces into productive green corners. 
                  We believe growing your own food builds healthier habits and a more sustainable future—no farm or experience needed, just curiosity and care.</p>
                <div className="bannerbtn">
                  <a href="/about" className="custom-btn">Learn More</a>
                  <a href="/contact" className="custom-btn">Contact Us</a>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="container">
              <div className="banner__content col-md-7 col-xl-6">
                <h3>Join Our Green Initiative</h3>
                <p>Be part of our mission to create a sustainable future. Together we can make a difference
                  in preserving our planet for future generations through innovative solutions and
                  responsible business practices.</p>
                <div className="bannerbtn">
                  <a href="/contact" className="custom-btn">Get Involved</a>
                  <a href="/about" className="custom-btn">Learn More</a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Background Images */}
      <div className="position_bshape contentrightimg imghover d-md-block d-none">
        <img src="/assets/img/home-1/banner/bannerightimg.jpeg" alt="bakul" />
      </div>
      <div className="position_bshape topleftimg dnone">
        <img src="/assets/img/home-1/banner/shape1.png" alt="bakul" />
      </div>
      <div className="position_bshape topright">
        <img src="/assets/img/home-1/banner/shape5.png" alt="bakul" />
      </div>
      <div className="position_bshape bottommiddle d-lg-block d-none">
        <img src="/assets/img/home-1/banner/shape3.png" alt="bakul" />
      </div>
      <div className="position_bshape bottomright d-sm-block d-none">
        <img src="/assets/img/home-1/banner/shape4.png" alt="bakul" />
      </div>
      <div className="position_bshape middleshape d-lg-block d-none">
        <img src="/assets/img/home-1/banner/shape6.png" alt="bakul" />
      </div>
    </div>
  );
};

export default Banner;
