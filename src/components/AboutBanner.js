import React from 'react';
import { Link } from 'react-router-dom';

const AboutBanner = () => {
  return (
    <section className="natureplant mmv-natureplant-split overflow-hidden">
      <div className="container-fluid p-0">
        <div className="row g-0 align-items-stretch">
          <div className="col-12 col-lg-6">
            <div className="mmv-natureplant-split__image imghover" style={{ padding: '10px', background: '#c7d89a'}}>
              <img src="/assets/img/home-1/welcome/aboutleft.png" alt="bakul" style={{ borderRadius: '10px', display: 'block', width: '100%', height: 'auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            
            <div className="mmv-natureplant-split__content">
              <div className="mmv-natureplant-split__content-inner">
                <div className="section__header natureplant__header">
                  <div className="col-md-11 col-xl-12 col-xxl-8">
                    <br /><span>Welcome To makemyveggies</span>
                    <br /><h3>Beautiful Gardens Start With Smart Growing</h3>
                    <p>MakemyVeggies makes home gardening simple and productive with smart 
                    self-watering planters and grow kits, perfect for urban spaces and beginners alike.</p>
                  </div>
                </div>
                <div className="section__wrapper natureplant__content">
                  
                  <ul>
                    <li><i className="fa-sharp fa-solid fa-square-check"></i>Hassle-free plant care</li>
                    <li><i className="fa-sharp fa-solid fa-square-check"></i>Perfect for homes, balconies & offices</li>
                    <li><i className="fa-sharp fa-solid fa-square-check"></i>Better plant survival & faster growth</li>
                    <li><i className="fa-sharp fa-solid fa-square-check"></i>Designed for Indian climates</li>
                  </ul><br />

                  <h4>Our Mission</h4>
                  <p>To make home gardening easy, affordable, and rewarding for everyone — 
                    so every home can enjoy fresh, pesticide-free vegetables.</p>
                  <Link to="/about" className="custom-btn">About our company</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;
