import React from 'react';
import Footer from '../components/Footer';
import AboutBanner from '../components/AboutBanner';
import Features from '../components/Features';
import Skill from '../components/Skill';
import Testimonial from '../components/Testimonial';
import Question from '../components/Question';
import Newsletter from '../components/Newsletter';

const About = () => {
  return (
    <>
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>About Make My Veggies</h2>
            </div>
          </div>
        </section>

        {/* About banner section (copied from NaturePlant) */}
        <AboutBanner />

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
