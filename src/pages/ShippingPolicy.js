import React from 'react';
import Footer from '../components/Footer';

const ShippingPolicy = () => {
  return (
    <>
      <main>
        <section
          className="faq"
          style={{
            paddingTop: '40px',
            paddingBottom: '40px'
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <h2
                      className="text-center"
                      style={{
                        marginBottom: '40px',
                        marginTop: '20px'
                      }}
                    >
                      Shipping Policy
                    </h2>
                  </div>
                </div>

                <div className="faq__content">
                  <div className="faq__item">
                    <h4>SHIPPING POLICY</h4>
                    <p>
                      SAANVI CROP SCIENCE PRIVATE LIMITED ensures quality products and secure
                      packaging for all customers. We have partnered with reputed courier
                      agencies to ensure safe and timely delivery.
                    </p>
                    <p>
                      Free shipping is available on orders above ₹559.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>HOW LONG DOES IT TAKE FOR AN ORDER TO BE DELIVERED?</h4>
                    <p>
                      All orders are shipped from our warehouse within 1 working day.
                    </p>
                    <p>
                      Most orders are delivered within 2–8 working days from the date the order
                      is placed.
                    </p>
                    <p>
                      Order tracking details will be shared once the order is dispatched.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>RETURNS</h4>
                    <p>
                      <strong>Can you return plants?</strong> No.
                    </p>
                    <p>
                      SAANVI CROP SCIENCE PRIVATE LIMITED does not accept returns on products.
                    </p>
                    <p>
                      If you have any concerns, please contact our support team:
                    </p>
                    <p>
                      <strong>Email:</strong> support@makemyveggies.com
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>REPLACEMENT POLICY</h4>
                    <p>
                      If a wrong or damaged product is delivered, the issue must be reported to
                      us within 1 day of delivery, along with clear images of the product and
                      packaging.
                    </p>
                    <p>
                      Upon verification, we will initiate a replacement shipment accordingly.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>CANCELLATION POLICY</h4>
                    <p>
                      At SAANVI CROP SCIENCE PRIVATE LIMITED, we strive to provide prompt and
                      efficient service. Please review our cancellation policy below:
                    </p>

                    <p>
                      <strong>1. ORDER CANCELLATION BEFORE SHIPPING</strong>
                      <br />
                      Orders can be canceled free of charge if the cancellation request is
                      received before the order is shipped.
                    </p>
                    <p>
                      Orders are typically shipped within 24 hours of placement.
                    </p>
                    <p>
                      To cancel an order, please contact our customer support team as soon as
                      possible.
                    </p>

                    <p>
                      <strong>2. ORDER CANCELLATION AFTER SHIPPING</strong>
                      <br />
                      If a cancellation request is made after the order has been shipped, a
                      ₹200 cancellation fee will be deducted from the refund. If refund
                      applicable.
                    </p>
                    <p>
                      Original delivery charges are non-refundable.
                    </p>
                    <p>
                      For orders with a total value below ₹200, a 100% cancellation fee will
                      apply and no refund will be issued.
                    </p>

                    <p>
                      <strong>3. DELIVERY CHARGES</strong>
                      <br />
                      Delivery charges are non-refundable under all circumstances, including
                      order cancellations.
                    </p>
                  </div>

                  <div className="faq__item">
                    <h4>REGISTERED OFFICE ADDRESS</h4>
                    <p>
                      SAANVI CROP SCIENCE PRIVATE LIMITED<br />
                      Gate No-1, Manjari Green Society,<br />
                      Manjari BK, Haveli,<br />
                      Pune – 412307,<br />
                      Maharashtra, India
                    </p>
                  </div>
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

export default ShippingPolicy;
