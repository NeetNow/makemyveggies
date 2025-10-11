import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/style.css'; // Import original CSS

const Shop = () => {
  // Sample product data matching original structure
  const [products] = useState([
    {
      id: 1,
      name: 'Gardening Gloves',
      price: 100.99,
      image: '/assets/img/shop/img1.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Gardening Boots',
      price: 100.99,
      image: '/assets/img/shop/img2.jpg',
      rating: 5
    },
    {
      id: 3,
      name: 'Gardening Hose',
      price: 100.99,
      image: '/assets/img/shop/img3.jpg',
      rating: 5
    },
    {
      id: 4,
      name: 'Watering Can',
      price: 100.99,
      image: '/assets/img/shop/img4.jpg',
      rating: 5
    },
    {
      id: 5,
      name: 'Flowerpot',
      price: 100.99,
      image: '/assets/img/shop/img5.jpg',
      rating: 5
    },
    {
      id: 6,
      name: 'Wheelbarrow',
      price: 100.99,
      image: '/assets/img/shop/img6.jpg',
      rating: 5
    },
    {
      id: 7,
      name: 'Gardening Fork',
      price: 100.99,
      image: '/assets/img/shop/img7.jpg',
      rating: 5
    },
    {
      id: 8,
      name: 'Garden Fertilizer',
      price: 100.99,
      image: '/assets/img/shop/img8.jpg',
      rating: 5
    },
    {
      id: 9,
      name: 'Garden Hoe',
      price: 100.99,
      image: '/assets/img/shop/img9.jpg',
      rating: 5
    }
  ]);

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Our Shop Page</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="active" aria-current="page">Shop</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        
        {/* Shop Section */}
        <section className="blogsingle shoppage bg-white">
          <div className="container">
            <div className="row g-4">
              <div className="col-xl-8">
                <div className="shoppage__header">
                  <nav className="shoppagenav">
                    <h6>Showing 1–9 of 12 results</h6>
                    <div className="nav nav-tab" id="nav-tab" role="tablist">
                      <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                        <i className="fa-light fa-list-ul"></i>
                      </button>
                      <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                        <i className="fa-light fa-bars"></i>
                      </button>
                    </div>
                  </nav>
                </div>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div className="row g-4">
                      {products.map((product) => (
                        <div key={product.id} className="col-md-6 col-xl-4">
                          <div className="shoppage__inner">
                            <div className="shoppage__item">
                              <div className="thum">
                                <Link to={`/product-details/${product.id}`}>
                                  <img src={product.image} alt="img" />
                                </Link>
                                <div className="shoppagelink go-up">
                                  <a href={product.image} data-rel="lightcase"><i className="fa-solid fa-eye"></i></a>
                                  <a href="#"><i className="fa-regular fa-heart"></i></a>
                                  <Link to={`/product-details/${product.id}`}><i className="fa-solid fa-cart-shopping"></i></Link>
                                </div>
                              </div>
                              <div className="content">
                                <div className="allstar">
                                  {[...Array(product.rating)].map((_, i) => (
                                    <i key={i} className="fa-solid fa-star"></i>
                                  ))}
                                </div>
                                <h6><Link to={`/product-details/${product.id}`}>{product.name}</Link></h6>
                                <span>${product.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    {/* List view content would go here if needed */}
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                {/* Sidebar content would go here if needed */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
