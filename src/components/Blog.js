import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  return (
    <section className="blog padding-block overflow-hidden">
      <div className="container">
        <div className="section__header blog__header">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-8 col-lg-9 col-xl-10">
              <span>Our News Update<img src="/assets/img/logo/pata.png" alt="bakul" /></span>
              <h3>Latest Blogs & Articles</h3>
              <p>Continually productize compelling quality packed business consulting
                Setting up to website and creating pages.</p>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-2">
              <div className="blog__btn mt-md-0 mt-4">
                <Link to="/blog" className="custom-btn">View all post</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="section__wrapper">
          <div className="row justify-content-center g-4">
            <div className="col-md-6 col-xl-4">
              <div className="blog__item">
                <div className="blog__inner">
                  <div className="thumb">
                    <Link to="/blog/1"><img src="/assets/img/home-1/blog/img1.png" alt="bakul" /></Link>
                  </div>
                  <div className="content bg-white">
                    <div className="text">
                      <h6><Link to="/blog/1">Balcony and Kitchen Gardening for Beginners: Grow Fresh, Healthy Food at Home</Link></h6>
                      <p>Living in the city doesn’t mean giving up fresh, healthy food. Balcony and kitchen gardening make it easy to grow your own greens at home, even with limited space and a busy lifestyle</p>
                    </div>
                    <div className="blogbtn">
                      <Link to="/blog/1" className="custom-btn">Read More</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-4">
              <div className="blog__item">
                <div className="blog__inner">
                  <div className="thumb">
                    <Link to="/blog/2"><img src="/assets/img/home-1/blog/img2.png" alt="bakul" /></Link>
                  </div>
                  <div className="content bg-white">
                    <div className="text">
                      <h6><Link to="/blog/2">Gardening at Home: A Natural Way to Unwind from Urban Stress</Link></h6>
                      <p>Discover how home gardening helps urban lifestyles slow down, reduce stress, and reconnect with nature using simple balcony and kitchen plant setups.</p>
                    </div>
                    <div className="blogbtn">
                      <Link to="/blog/2" className="custom-btn">Read More</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-4">
              <div className="blog__item">
                <div className="blog__inner">
                  <div className="thumb">
                    <Link to="/blog/3"><img src="/assets/img/home-1/blog/img3.png" alt="bakul" /></Link>
                  </div>
                  <div className="content bg-white">
                    <div className="text">
                      <h6><Link to="/blog/3">Health Benefits of Microgreens and How to Use Them in Everyday Cooking</Link></h6>
                      <p>Microgreens are nutrient-dense, easy-to-grow greens that enhance everyday meals with fresh flavour and health benefits—without changing your routine.</p>
                    </div>
                    <div className="blogbtn">
                      <Link to="/blog/3" className="custom-btn">Read More</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Shapes */}
      <div className="positionblog topshape dnone">
        <img src="/assets/img/home-1/banner/shape1.png" alt="bakul" />
      </div>
      <div className="bottomshape right-left d-lg-block d-none">
        <img src="/assets/img/home-1/blog/bottomshape.png" alt="bakul" />
      </div>
    </section>
  );
};

export default Blog;
