import React from 'react'; 
import { Link } from 'react-router-dom';

const HomeAboutBanner = () => {
  return (
    <section className="natureplant mmv-natureplant-split overflow-hidden">
      <div className="container-fluid p-0">
        <div className="row g-0 align-items-stretch">
          <div className="col-12 col-lg-6">
            <div className="mmv-natureplant-split__image imghover" style={{ padding: '10px', background: '#c7d89a'}}>
              <img src="/assets/img/home-1/welcome/aboutleft.png" alt="bakul" style={{ borderRadius: '10px', display: 'block', width: '750px', height: '580px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div
              className="mmv-natureplant-split__content"
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div className="mmv-natureplant-split__content-inner">
                <div className="section__header natureplant__header">
                  <div className="col-12">
                    <br /><span className="mmv-homeabout-welcome">Welcome To makemyveggies</span>
                    <h3 className="mmv-homeabout-title" style={{ lineHeight: '1.45', marginTop: '0.5rem', marginBottom: '1.25rem' }}>Fresh Vegetables, <br/>Right From Your Home</h3>
                    <p style={{ lineHeight: '1.8', textAlign: 'justify' }}>MakemyVeggies makes home gardening simple and convenient for everyone. Our smart gardening solutions, including DIY grow kits and self-watering planters, help you grow fresh and healthy vegetables at home with minimal effort. Whether you have a balcony, terrace, or small indoor space, our products are designed to support easy plant care and better growth, making gardening enjoyable for beginners and plant lovers alike.</p>
                  </div>
                  <div className="mmv-homeabout-btn-wrap">
                    <Link to="/about" className="custom-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>About our company</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAboutBanner;
