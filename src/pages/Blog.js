import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogPage = () => {
  return (
    <>
      <Header />
      <main>
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <ul className="breadcum">
                    <li><Link to="/">Home</Link></li>
                    <li>Blog</li>
                  </ul>
                  <h2>Our Blog</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="blog padding-block">
          <div className="container">
            <div className="section__header text-center">
              <span>Latest News</span>
              <h3>Our Blog & Articles</h3>
              <p>Stay updated with the latest gardening tips and trends.</p>
            </div>
            <div className="row g-4 justify-content-center">
              {[1, 2, 3, 4, 5, 6].map((post) => (
                <div key={post} className="col-md-6 col-xl-4">
                  <div className="blog__item">
                    <div className="blog__inner">
                      <div className="thumb">
                        <Link to="/blog-single"><img src={`/assets/img/home-1/blog/img${post <= 3 ? post : post - 3}.jpg`} alt="Blog Post" /></Link>
                      </div>
                      <div className="content bg-white">
                        <div className="text">
                          <h6><Link to="/blog-single">Blog Post Title {post}</Link></h6>
                          <ul>
                            <li><a href="#"><i className="fa-solid fa-user"></i>Admin</a></li>
                            <li><a href="#"><i className="fa-regular fa-eye"></i>25</a></li>
                            <li><a href="#"><i className="fa-solid fa-message"></i>11 Comment</a></li>
                          </ul>
                          <p>Gardening tips and techniques for better results in your garden.</p>
                        </div>
                        <div className="blogbtn">
                          <Link to="/blog-single" className="custom-btn">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
