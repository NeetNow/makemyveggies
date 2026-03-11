import React from 'react';
import { Link } from 'react-router-dom';

const Team = () => {

  const diyProducts = [
    { id: 74, name: 'Capsicum', image: '/assets/img/home-1/team/Capsicum.png' },
    { id: 37, name: 'Cherry Tomato', image: '/assets/img/home-1/team/cherrytomato.png' },
    { id: 73, name: 'Hot Pepper', image: '/assets/img/home-1/team/HotPepper.png' },
    { id: 75, name: 'Tomato', image: '/assets/img/home-1/team/Tomato.png' },
  ];

  return (
    <section className="team padding-block bg-white overflow-hidden">
      <div className="container">
        <div className="section__header section__header--header2">
          <span>Our Products<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
          <h3>our professional landscapers</h3>
          <p>Explore our premium DIY gardening kits designed to help you grow fresh, healthy vegetables at home with ease.</p>
        </div>
      </div>
      <div className="section__wrapper team__wrapper">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {diyProducts.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
                <Link
                  to={`/product-details/${product.id}`}
                  className="team__item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="team__inner bg-white">
                    <div className="thumb">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="text">
                      <h6>{product.name}</h6>
                      <p>DIY KITS</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="project__btn">
        <a href="/shop" className="custom-btn">View All Products</a>
      </div>

      {/* Background Shapes */}
      <div className="leftshape left-right d-xxl-block d-none">
        <img src="/assets/img/home-1/team/toptree.png" alt="bakul" />
      </div>
      <div className="bottomshape right-left d-lg-block d-none">
        <img src="/assets/img/home-1/team/bottomtree.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Team;
