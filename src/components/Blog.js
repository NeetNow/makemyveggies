import React from 'react';

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
                <a href="blog-single.html" className="custom-btn">View all post</a>
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
                    <a href="blog-single.html"><img src="/assets/img/home-1/blog/img1.png" alt="bakul" /></a>
                  </div>
                  <div className="content bg-white">
                    <div className="text">
                      <h6><a href="blog-single.html">Balcony and Kitchen Gardening for Beginners: Grow Fresh, Healthy Food at Home</a></h6>
                      <p>Living in the city doesn’t mean giving up fresh, healthy food. Balcony and kitchen gardening make it easy to grow your own greens at home, even with limited space and a busy lifestyle</p>
                    </div>
                    <div className="blogbtn">
                      <a href="blog-single.html" className="custom-btn">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-4">
              <div className="blog__item">
                <div className="blog__inner">
                  <div className="thumb">
                    <a href="blog-single.html"><img src="/assets/img/home-1/blog/img2.png" alt="bakul" /></a>
                  </div>
                  <div className="content bg-white">
                    <div className="text">
                      <h6><a href="blog-single.html">Gardening at Home: A Natural Way to Unwind from Urban Stress</a></h6>
                      <p>Discover how home gardening helps urban lifestyles slow down, reduce stress, and reconnect with nature using simple balcony and kitchen plant setups.</p>
                    </div>
                    <div className="blogbtn">
                      <a href="blog-single.html" className="custom-btn">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-4">
              <div className="blog__item">
                <div className="blog__inner">
                  <div className="thumb">
                    <a href="blog-single.html"><img src="/assets/img/home-1/blog/img3.png" alt="bakul" /></a>
                  </div>
                  <div className="content bg-white">
                    <div className="text">
                      <h6><a href="blog-single.html">Health Benefits of Microgreens and How to Use Them in Everyday Cooking</a></h6>
                      <p>Microgreens are nutrient-dense, easy-to-grow greens that enhance everyday meals with fresh flavour and health benefits—without changing your routine.</p>
                    </div>
                    <div className="blogbtn">
                      <a href="blog-single.html" className="custom-btn">Read More</a>
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
