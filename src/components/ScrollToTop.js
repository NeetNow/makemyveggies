import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className="scrollToTop"
          onClick={e => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Scroll to top"
        >
          <i className="fa-solid fa-arrow-up-long"></i>
          <span className="pluse_1"></span>
          <span className="pluse_2"></span>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
