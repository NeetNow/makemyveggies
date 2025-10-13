import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/style.css'; // Import original CSS

const Cart = () => {
  // Sample cart data matching original
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Lawyer book here',
      price: 200.99,
      quantity: 3,
      image: 'assets/img/shop/img2.jpg'
    },
    {
      id: 2,
      name: 'Lawyer book here',
      price: 100.99,
      quantity: 3,
      image: 'assets/img/shop/img2.jpg'
    },
    {
      id: 3,
      name: 'Lawyer book here',
      price: 250.99,
      quantity: 3,
      image: '/assets/img/shop/img4.jpg'
    },
    {
      id: 4,
      name: 'Lawyer book here',
      price: 230.99,
      quantity: 3,
      image: '/assets/img/shop/img5.jpg'
    },
    {
      id: 5,
      name: 'Lawyer book here',
      price: 300.99,
      quantity: 3,
      image: '/assets/img/shop/img7.jpg'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Simplified for original structure

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main>
          <section className="pageheader overflow-hidden">
            <div className="container">
              <div className="pageheader__content">
                <h2>Shop Cart</h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">shop</Link></li>
                    <li className="active" aria-current="page">Shop Cart</li>
                  </ol>
                </nav>
              </div>
            </div>
          </section>
          <div className="cartpage bg-white">
            <div className="container">
              <p>Your cart is empty. <Link to="/shop">Continue shopping</Link></p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="pageheader overflow-hidden">
          <div className="container">
            <div className="pageheader__content">
              <h2>Shop Cart</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">shop</Link></li>
                  <li className="active" aria-current="page">Shop Cart</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Cart Section */}
        <div className="cartpage bg-white">
          <div className="container">
            <div className="row g-3">
              <div className="col-xxl-7">
                <div className="cartpage__inner">
                  <div className="cartpage__item">
                    <div className="cartpage__header">
                      <ul>
                        <li>Product</li>
                        <li>price</li>
                        <li>quantity</li>
                        <li>total</li>
                        <li>remove</li>
                      </ul>
                    </div>
                    <div className="cartpage__body">
                      <ul>
                        {cartItems.map((item) => (
                          <li key={item.id}>
                            <div className="product">
                              <div className="thum">
                                <Link to={`/product-details/${item.id}`}>
                                  <img src={item.image} alt="cartimg" />
                                </Link>
                              </div>
                              <div className="text">
                                <h6><Link to={`/product-details/${item.id}`}>{item.name}</Link></h6>
                              </div>
                            </div>
                            <div className="price">
                              <span>${item.price}</span>
                            </div>
                            <div className="countadd">
                              <div className="cart-plus-minus">
                                <div className="dec qtybutton" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</div>
                                <input className="cart-plus-minus-box" type="text" value={item.quantity} readOnly />
                                <div className="inc qtybutton" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</div>
                              </div>
                            </div>
                            <div className="total">
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="remove">
                              <i className="fa-solid fa-circle-xmark" onClick={() => updateQuantity(item.id, 0)} style={{cursor: 'pointer'}}></i>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="cartpage__discountcode">
                      <input type="text" placeholder="discount code" />
                      <button className="custom-btn">Apply</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-5">
                <div className="cartpage__paymentitem">
                  <div className="header">
                    <ul>
                      <li>subtotal</li>
                      <li>${subtotal.toFixed(2)}</li>
                    </ul>
                  </div>
                  <div className="content">
                    <p>shipping</p>
                    <form>
                      <div className="alltopitem">
                        <div className="item">
                          <input type="radio" id="free" name="shipping" defaultChecked />
                          <label htmlFor="free">
                            <span> free shipping</span>
                            <span>+$00.00</span>
                          </label>
                        </div>
                        <div className="item">
                          <input type="radio" id="flat" name="shipping" />
                          <label htmlFor="flat">
                            <span> flat rate</span>
                            <span>+$00.00</span>
                          </label>
                        </div>
                        <div className="item">
                          <input type="radio" id="local" name="shipping" />
                          <label htmlFor="local">
                            <span> local delivery</span>
                            <span>+$00.00</span>
                          </label>
                        </div>
                      </div>
                      <div className="country">
                        <p>calculate shipping</p>
                        <select>
                          <option>Select Country</option>
                          <option>India</option>
                          <option>Bangladesh</option>
                          <option>UK</option>
                        </select>
                      </div>
                      <div className="zipcode">
                        <input type="text" placeholder="postcode/ZIP" />
                      </div>
                      <div className="update">
                        <button type="button">update cart</button>
                      </div>
                      <div className="totall">
                        <ul>
                          <li>
                            <span>total</span>
                            <span>${total.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="checkout">
                        <Link to="/checkout" className="custom-btn">proceed to checkout</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
