import React from 'react';
import { Link } from 'react-router-dom';

const NaturePlant = () => {
  return (
    <section className="natureplant mmv-natureplant-split overflow-hidden">
      <div className="container-fluid p-0">
        <div className="row g-0 align-items-stretch">
          <div className="col-12 col-lg-6">
            <div className="mmv-natureplant-split__image imghover">
              <img src="/assets/img/home-1/welcome/leftimg.png" alt="bakul" />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            
            <div className="mmv-natureplant-split__content">
              <div className="mmv-natureplant-split__content-inner">
                <div className="section__header natureplant__header">
                  <div className="col-md-11 col-xl-12 col-xxl-8">
                    <br /><span>Welcome To makemyveggies</span>
                    <br /><h3>Fresh Vegetables, Right From Your Home</h3>
                    <p>MakemyVeggies makes home gardening simple and convenient for everyone. 
                      Our smart gardening solutions, including DIY grow kits and self-watering 
                      planters, help you grow fresh and healthy vegetables at home with minimal effort. 
                      Whether you have a balcony, terrace, or small indoor space, our products are designed 
                      to support easy plant care and better growth, making gardening enjoyable for beginners 
                      and plant lovers alike.🌱</p>
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

      {/* Background Images */}
      <div className="position leftimg imghover d-none">
        <img src="/assets/img/home-1/welcome/leftimg.png" alt="bakul" />
      </div>
      <div className="position topshape d-xxl-block d-none">
        <img src="/assets/img/home-1/welcome/knife.png" alt="bakul" />
      </div>
      <div className="position middleshape d-xxl-block d-none">
        <img src="/assets/img/home-1/welcome/middleshape.png" alt="bakul" />
      </div>
    </section>
  );
};

export default NaturePlant;
