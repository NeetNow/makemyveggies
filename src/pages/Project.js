import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const ProjectPage = () => {
  return (
    <>
      <main>
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <h2>Our Projects</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="project padding-block">
          <div className="container">
            <div className="section__header text-center">
              <span>makemyveggies Projects</span>
              <h3>Our Garden Projects</h3>
              <p>Showcasing our best gardening and landscaping work.</p>
            </div>
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((project) => (
                <div key={project} className="col-md-6 col-lg-4">
                  <div className="project__item">
                    <div className="thumb">
                      <img src={`/assets/img/home-1/project/img${project}.jpg`} alt="Project" />
                    </div>
                    <div className="content">
                      <div className="content-inner">
                        <p>Plant Care</p>
                        <h6><Link to="/project-details">Garden Project {project}</Link></h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/project" className="custom-btn">View All Projects</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProjectPage;
