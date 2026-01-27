import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const BlogPage = () => {

  const blogs = [
    {
      id: 1,
      title: "Balcony and Kitchen Gardening for Beginners: Grow Fresh, Healthy Food at Home",
      image: "/assets/img/home-1/blog/img1.png",
      description: "Learn how SEO optimization improves website visibility."
    },
    {
      id: 2,
      title: "Gardening at Home: A Natural Way to Unwind from Urban Stress",
      image: "/assets/img/home-1/blog/img2.png",
      description: "Easy gardening tips for healthy and green plants."
    },
    {
      id: 3,
      title: "Health Benefits of Microgreens and How to Use Them in Everyday Cooking",
      image: "/assets/img/home-1/blog/img3.png",
      description: "Grow fresh and chemical-free vegetables organically."
    },
    {
      id: 4,
      title: "Mental Health Benefits of Home Gardening for Working Professionals",
      image: "/assets/img/home-1/blog/img4.png",
      description: "Simple indoor plant care tips for beginners."
    },
    {
      id: 5,
      title: "Nutritional and Protein Content of Microgreens: What Science Really Says",
      image: "/assets/img/home-1/blog/img5.png",
      description: "Know what to plant and when for best results."
    },
    {
      id: 6,
      title: "Why Homegrown Vegetables Are Healthier (and More Sustainable) Than Store-Bought Produce",
      image: "/assets/img/home-1/blog/img6.png",
      description: "Enhance your garden with creative landscape designs."
    }
  ];

  return (
    <>
      <main>

                <section className="pageheader2 overflow-hidden">
                  <div className="container">
                    <div className="pageheader__content">
                      <h2>Our Blogs</h2>
                    </div>
                  </div>
                </section>

        <section className="blog padding-block">
          <div className="container">
            <div className="section__header text-center">
              <span>Latest News</span>

              <p>Stay updated with the latest gardening tips and trends.</p>
            </div>

            <div className="row g-4 justify-content-center">
              {blogs.map((blog) => (
                <div key={blog.id} className="col-md-6 col-xl-4">
                  <div className="blog__item">
                    <div className="blog__inner">
                      <div className="thumb">
                        <Link to={`/blog/${blog.id}`}>
                          <img src={blog.image} alt={blog.title} />
                        </Link>
                      </div>
                      <div className="content bg-white">
                        <div className="text">
                          <h6>
                            <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                          </h6>
                          <p>{blog.description}</p>
                        </div>
                        <div className="blogbtn">
                          <Link to={`/blog/${blog.id}`} className="custom-btn">
                            Read More
                          </Link>
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
