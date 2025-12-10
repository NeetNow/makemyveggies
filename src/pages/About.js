import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NaturePlant from '../components/NaturePlant';
import Features from '../components/Features';
import Skill from '../components/Skill';
import Testimonial from '../components/Testimonial';
import Question from '../components/Question';
import Partner from '../components/Partner';
import Newsletter from '../components/Newsletter';

const About = () => {
  return (
    <>
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>about our company</h2>
              <nav aria-label="breadcrumb">
                <ul className="breadcum">
                  <li><Link to="/">Home</Link></li>
                  <li className="active" aria-current="page">About us</li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Natureplant Section */}
        <NaturePlant />

        {/* Feature Section */}
        <Features />

        {/* Skill Section */}
        <Skill />

        {/* Testimonial Section */}
        <Testimonial />

        {/* Question Section */}
        <Question />

        {/* Newsletter Section */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default About;
