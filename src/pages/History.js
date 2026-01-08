import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const History = () => {
  return (
    <>
      <main>
        <section className="pageheader padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header">
                  <h2>Our History</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="about padding-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header text-center">
                  <span>Our Journey</span>
                  <h3>15 Years of Excellence in Gardening</h3>
                  <p>Discover how makemyveggies has grown from a small local business to a trusted name in professional landscaping.</p>
                </div>
                <div className="history__content">
                  <p>Founded in 2009, makemyveggies began as a small family business with a passion for creating beautiful gardens. Over the years, we've grown into one of the region's most trusted landscaping companies, serving thousands of satisfied customers.</p>
                  <p>Our commitment to quality, sustainability, and customer satisfaction has been the cornerstone of our success. We've completed over 5,000 projects and continue to innovate in the field of landscape design and garden maintenance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default History;
