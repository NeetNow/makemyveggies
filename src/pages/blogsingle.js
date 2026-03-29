import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Loader2, CheckCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';

const BLOG_POSTS = {
  '1': {
    id: '1',
    title: 'Balcony and Kitchen Gardening for Beginners: Grow Fresh, Healthy Food at Home',
    image: '/assets/img/home-1/blog/img1.png',
    author: 'MakeMyVeggies Team',
    authorImage: '/assets/img/logo/logo.png',
    date: 'March 15, 2026',
    readTime: '8 min read',
    category: 'Gardening Tips',
    content: [
      {
        type: 'p',
        text: 'Living in a city doesn\'t mean you have to give up on fresh, healthy food. Even with limited space and a busy routine, it\'s surprisingly easy to grow your own greens at home. Balcony and kitchen gardening are simple ways to bring a bit of nature into your daily life — and the best part is, you don\'t need a garden to get started.',
      },
      {
        type: 'p',
        text: 'Whether it\'s a few pots on your balcony or a tray of microgreens sitting on your kitchen counter, growing your own food can completely change the way you eat and feel.',
      },
      { type: 'h2', text: 'What Is Balcony and Kitchen Gardening?' },
      {
        type: 'p',
        text: 'Balcony and kitchen gardening refers to growing edible plants in small, functional spaces within your home, instead of a traditional outdoor garden. These spaces typically include balconies, windowsills, kitchen counters, and compact indoor shelves.',
      },
      {
        type: 'p',
        text: 'With increasing urbanisation, many city homes no longer have access to gardens. Balcony and kitchen gardening solve this problem by using containers, pots, trays, and vertical setups to grow plants efficiently in tight areas.',
      },
      { type: 'p', text: 'This form of gardening allows you to grow:' },
      {
        type: 'ul',
        items: ['Leafy greens', 'Herbs', 'Microgreens', 'Select vegetables'],
      },
      { type: 'p', text: 'right where you live.' },
      { type: 'h3', text: 'Why it works for urban homes:' },
      {
        type: 'ul',
        items: [
          'Most edible plants require only 4–6 hours of indirect sunlight',
          'Microgreens and herbs can grow well in areas as small as 1–2 square feet',
          'Many crops are ready to harvest within 7–30 days, depending on the plant',
        ],
      },
      {
        type: 'p',
        text: 'Balcony gardens usually make use of natural sunlight and airflow, while kitchen gardening often relies on windows, shelves, or countertops—making it ideal for growing fast crops like microgreens.',
      },
      { type: 'h2', text: 'Health Benefits of Growing Food at Home' },
      { type: 'h3', text: 'Fresh, nutrient-rich produce' },
      {
        type: 'p',
        text: 'When you grow food at home, you harvest it fresh — right when it\'s ready. This helps preserve important nutrients like vitamins, minerals, and antioxidants that are often lost during storage and transport.',
      },
      {
        type: 'p',
        text: 'Microgreens such as broccoli, radish, mustard, and pea shoots are known for being especially nutritious and are easy to include in everyday meals.',
      },
      { type: 'h3', text: 'Clean, chemical-free eating' },
      {
        type: 'p',
        text: 'One of the biggest perks of home gardening is control. You decide what goes into your plants — no unnecessary chemicals, no mystery sprays. This makes homegrown food safer for families, kids, and even pets.',
      },
      { type: 'h2', text: 'Perfect for City Living' },
      { type: 'p', text: 'Balcony and kitchen gardening fit perfectly into modern urban life:' },
      {
        type: 'ul',
        items: ['No large space needed', 'Very little water required', 'Easy to manage, even with a busy schedule', 'Can be done all year round'],
      },
      {
        type: 'p',
        text: 'With today\'s simple growing methods, even complete beginners can enjoy gardening without feeling overwhelmed.',
      },
      { type: 'h2', text: 'A Small Step Towards a Greener Planet' },
      {
        type: 'p',
        text: 'Growing food at home isn\'t just good for your health — it\'s also better for the environment. When you grow your own greens, there\'s no need for transportation or long food supply chains, which means zero food miles and lower emissions. Home gardening also reduces the use of plastic packaging that often comes with store-bought produce. Since you harvest only what you need, food waste is naturally reduced, helping lower your overall household carbon footprint in a simple, sustainable way.',
      },
      {
        type: 'p',
        text: 'Microgreens are especially eco-friendly since they grow quickly and need fewer resources than most vegetables.',
      },
      { type: 'h2', text: 'Easy Plants to Start With' },
      { type: 'p', text: 'If you\'re new to gardening, start simple. These are great options for small spaces:' },
      {
        type: 'ul',
        items: [
          'Microgreens: Fast-growing, highly nutritious, and beginner-friendly.',
          'Herbs: Coriander, basil, and mint grow well in small pots and are useful in everyday cooking.',
          'Leafy greens: Spinach, lettuce, and fenugreek are easy to manage and perfect for balconies.',
        ],
      },
      { type: 'h2', text: 'More Than Just Gardening: Mental Wellness Benefits' },
      {
        type: 'p',
        text: 'Spending even a few minutes a day with plants can be incredibly calming. Many people find that gardening helps:',
      },
      {
        type: 'ul',
        items: ['Reduce stress and anxiety', 'Improve focus and mindfulness', 'Create a sense of accomplishment', 'Build a stronger connection with nature'],
      },
      {
        type: 'p',
        text: 'Watching something grow under your care is quietly rewarding.',
      },
      { type: 'h2', text: 'Budget-Friendly and Sustainable' },
      { type: 'p', text: 'Balcony and kitchen gardening can also help you save money over time:' },
      {
        type: 'ul',
        items: ['Lower grocery bills', 'Less food waste', 'Grow only what you need', 'Enjoy regular, fresh harvests'],
      },
      {
        type: 'p',
        text: 'With reusable containers and seeds, it becomes a simple, long-term habit rather than an expensive hobby.',
      },
      { type: 'h2', text: 'How to Get Started (It\'s Easier Than You Think)' },
      {
        type: 'p',
        text: 'Starting your own mini garden at home doesn\'t require special skills or a lot of time. A few basic steps are enough to get you going.',
      },
      { type: 'h3', text: 'Pick a spot with good light' },
      {
        type: 'p',
        text: 'Choose a place that receives natural light for a few hours a day, such as a balcony, windowsill, or near a kitchen window. Most greens and microgreens grow well with indirect sunlight, so you don\'t need harsh or direct sun all day.',
      },
      { type: 'h3', text: 'Use small pots or trays' },
      {
        type: 'p',
        text: 'You don\'t need large containers. Small pots, shallow trays, or ready grow kits work perfectly, especially for microgreens and herbs. Make sure the containers have drainage or are designed for indoor growing.',
      },
      { type: 'h3', text: 'Start with fast-growing plants' },
      {
        type: 'p',
        text: 'Begin with easy and quick options like microgreens, leafy greens, or herbs. Microgreens are ideal for beginners because they grow fast and are usually ready to harvest within 7–14 days, giving you quick results and confidence.',
      },
      { type: 'h3', text: 'Water regularly and harvest fresh' },
      {
        type: 'p',
        text: 'Water gently to keep the soil or growing medium moist but not soggy. Check your plants daily and harvest them when they\'re fresh and ready. Regular care and timely harvesting help keep your plants healthy and productive.',
      },
      { type: 'p', text: 'That\'s it. No experience needed.' },
      { type: 'h2', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Balcony and kitchen gardening prove that you don\'t need a big garden to live a healthier, more sustainable life. With just a little space and a bit of care, you can grow fresh, nutritious food right at home.',
      },
      {
        type: 'p',
        text: 'Start small, enjoy the process, and let your balcony or kitchen become your own little green corner.',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Gardening at Home: A Natural Way to Unwind from Urban Stress',
    image: '/assets/img/home-1/blog/img2.png',
    author: 'MakeMyVeggies Team',
    authorImage: '/assets/img/logo/logo.png',
    date: 'March 12, 2026',
    readTime: '6 min read',
    category: 'Wellness',
    content: [
      {
        type: 'p',
        text: 'City life moves fast. Between work deadlines, traffic, screens, and never-ending notifications, it\'s easy to feel overwhelmed. While urban living has its perks, it often leaves very little room for quiet moments or a real connection with nature.',
      },
      {
        type: 'p',
        text: 'That\'s where home gardening comes in. You don\'t need a big backyard or hours of free time — even a few plants on a balcony, windowsill, or kitchen counter can become a calming escape from everyday stress.',
      },
      { type: 'h2', text: 'Why Urban Life Feels So Stressful' },
      {
        type: 'p',
        text: 'Living in a city can quietly take a toll on mental well-being. Many people deal with:',
      },
      {
        type: 'ul',
        items: ['Constant stress and irritability', 'Mental exhaustion or burnout', 'Trouble sleeping', 'Difficulty focusing'],
      },
      {
        type: 'p',
        text: 'When this kind of stress builds up, it affects both mental and physical health. Finding simple, everyday ways to slow down becomes essential — and gardening is one of them.',
      },
      { type: 'h2', text: 'How Gardening Helps You Relax' },
      {
        type: 'p',
        text: 'Spending time with plants has a naturally calming effect. Watering, pruning, or simply checking on your plants helps shift your focus away from screens and worries.',
      },
      { type: 'p', text: 'Gardening can:' },
      {
        type: 'ul',
        items: ['Help reduce stress levels', 'Slow the body down', 'Improve mood and emotional balance'],
      },
      {
        type: 'p',
        text: 'Unlike scrolling or watching TV, gardening gently engages your mind and body, making it a more refreshing way to unwind.',
      },
      { type: 'h2', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'In a world filled with concrete, screens, and tight schedules, gardening at home becomes a quiet form of therapy. It slows you down, brings nature closer, and creates moments of calm in an otherwise busy day.',
      },
      {
        type: 'p',
        text: 'Sometimes, peace grows quietly — right at home.',
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Health Benefits of Microgreens and How to Use Them in Everyday Cooking',
    image: '/assets/img/home-1/blog/img3.png',
    author: 'MakeMyVeggies Team',
    authorImage: '/assets/img/logo/logo.png',
    date: 'March 10, 2026',
    readTime: '7 min read',
    category: 'Healthy Eating',
    content: [
      {
        type: 'p',
        text: 'Eating healthy doesn\'t always mean complicated recipes or strict diets. Sometimes, it\'s as simple as adding one small ingredient to your meals — and that\'s where microgreens come in.',
      },
      {
        type: 'p',
        text: 'These tiny greens may look delicate, but they\'re packed with nutrition and fresh flavour. Easy to grow at home and incredibly versatile in the kitchen, microgreens fit right into everyday cooking — from breakfast to dinner.',
      },
      { type: 'h2', text: 'What Exactly Are Microgreens?' },
      {
        type: 'p',
        text: 'Microgreens are young vegetable greens harvested just after their first leaves appear. This early stage is when they\'re packed with nutrients and fresh flavor.',
      },
      { type: 'h2', text: 'Health Benefits of Eating Microgreens Regularly' },
      {
        type: 'p',
        text: 'Despite their size, microgreens are loaded with nutrients. They\'re rich in:',
      },
      {
        type: 'ul',
        items: ['Vitamins A, C, E, and K', 'Minerals like iron, calcium, and magnesium', 'Antioxidants'],
      },
      {
        type: 'p',
        text: 'Eating them regularly can help support immunity, digestion, energy levels, and overall wellness.',
      },
      { type: 'h2', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Microgreens prove that healthy eating doesn\'t have to be complicated. They\'re easy to grow, simple to use, and fit naturally into everyday cooking.',
      },
    ],
  },
  '4': {
    id: '4',
    title: 'Mental Health Benefits of Home Gardening for Working Professionals',
    image: '/assets/img/home-1/blog/img4.png',
    author: 'MakeMyVeggies Team',
    authorImage: '/assets/img/logo/logo.png',
    date: 'March 8, 2026',
    readTime: '6 min read',
    category: 'Mental Wellness',
    content: [
      {
        type: 'p',
        text: 'Work today moves fast. Long hours, endless screens, constant notifications, and the pressure to always be "on" can leave even the most motivated professionals feeling drained.',
      },
      {
        type: 'p',
        text: 'In the middle of all this, home gardening has turned into a surprisingly effective way to slow down.',
      },
      { type: 'h2', text: 'Gardening: A Simple Way to Unwind' },
      {
        type: 'p',
        text: 'One of the nicest things about gardening is how naturally calming it feels. Spending just a few minutes watering plants or checking on new growth can help lower stress levels and calm a busy mind.',
      },
      { type: 'h2', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'For working professionals navigating stressful, fast-paced lives, home gardening is more than a hobby — it\'s a quiet form of self-care.',
      },
    ],
  },
  '5': {
    id: '5',
    title: 'Nutritional and Protein Content of Microgreens: What Science Really Says',
    image: '/assets/img/home-1/blog/img5.png',
    author: 'MakeMyVeggies Team',
    authorImage: '/assets/img/logo/logo.png',
    date: 'March 5, 2026',
    readTime: '5 min read',
    category: 'Nutrition Science',
    content: [
      {
        type: 'p',
        text: 'Microgreens might be tiny, but don\'t let their size fool you. Over the past few years, researchers and nutrition experts have taken a closer look at these young greens — and the results are impressive.',
      },
      { type: 'h2', text: 'Why Microgreens Are Naturally So Nutritious' },
      {
        type: 'p',
        text: 'Microgreens are harvested very early in their life cycle, just after their first leaves appear. At this stage, the plant is focused on fast growth, which means it\'s full of nutrients it needs to develop.',
      },
      { type: 'h2', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Science clearly supports what many home gardeners already know — microgreens pack a lot of nutrition into a very small space.',
      },
    ],
  },
  '6': {
    id: '6',
    title: 'Why Homegrown Vegetables Are Healthier (and More Sustainable) Than Store-Bought Produce',
    image: '/assets/img/home-1/blog/img6.png',
    author: 'MakeMyVeggies Team',
    authorImage: '/assets/img/logo/logo.png',
    date: 'March 1, 2026',
    readTime: '7 min read',
    category: 'Sustainability',
    content: [
      {
        type: 'p',
        text: 'Lately, many of us have started paying closer attention to what we eat — not just how it tastes, but where it comes from. With concerns around pesticides and long transport journeys, growing food at home is becoming popular again.',
      },
      { type: 'h2', text: 'Fresher Vegetables, Better Nutrition' },
      {
        type: 'p',
        text: 'One of the biggest reasons homegrown vegetables are healthier is simple: freshness. Most vegetables you buy from stores are harvested early and travel long distances before they reach your plate.',
      },
      { type: 'h2', text: 'A Greener Choice for the Planet' },
      {
        type: 'p',
        text: 'Homegrown vegetables are also kinder to the environment. No trucks, no plastic packaging, no long supply chains — just food grown right where you live.',
      },
      { type: 'h2', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Homegrown vegetables aren\'t just a trend — they\'re a practical, healthy, and sustainable way to eat better.',
      },
    ],
  },
};

const getRelatedPosts = (currentId) => {
  return Object.values(BLOG_POSTS)
    .filter(post => post.id !== currentId)
    .slice(0, 3);
};

const getRecentPosts = (currentId) => {
  return Object.values(BLOG_POSTS)
    .filter(post => post.id !== currentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
};

const BlogSingle = () => {
  const { id } = useParams();
  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeMobileWidget, setActiveMobileWidget] = useState(null);
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const blogId = id || '1';
  const post = BLOG_POSTS[blogId];
  const relatedPosts = getRelatedPosts(blogId);
  const recentPosts = getRecentPosts(blogId);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/backend/api/subscribe_newsletter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        toast.success(data.message || 'Thank you for subscribing!', {
          position: 'top-center',
          autoClose: 4000,
        });
        setEmail('');
        
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again later.', {
        position: 'top-center',
        autoClose: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setIsSticky(scrollTop > 400);
      setShowBackToTop(scrollTop > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${post?.title}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderContent = (block, idx) => {
    switch (block.type) {
      case 'h2':
        return (
          <h2 key={idx} id={`section-${idx}`} className="blog-content-h2">
            <i className="fas fa-leaf heading-icon" />
            {block.text}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={idx} className="blog-content-h3">
            <i className="fas fa-seedling heading-icon" />
            {block.text}
          </h3>
        );
      case 'ul':
        return (
          <ul key={idx} className="blog-content-ul">
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx} className="blog-content-li">
                <span className="bullet-icon"><i className="fas fa-check" /></span>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'highlight':
        return (
          <div key={idx} className={`content-highlight ${block.style || 'info'}`}>
            <div className="highlight-icon">
              <i className={block.icon || 'fas fa-lightbulb'} />
            </div>
            <div className="highlight-content">
              {block.title && <h4 className="highlight-title">{block.title}</h4>}
              <p className="highlight-text">{block.text}</p>
            </div>
          </div>
        );
      case 'p':
      default:
        return (
          <p key={idx} className="blog-content-p">
            {block.text}
          </p>
        );
    }
  };

  const tableOfContents = post?.content
    .map((block, idx) => block.type === 'h2' ? { text: block.text, id: `section-${idx}` } : null)
    .filter(Boolean);

  if (!post) {
    return (
      <>
        <main className="blog-single-page">
          <div className="container">
            <div className="blog-not-found">
              <div className="not-found-icon">🌱</div>
              <h2>Blog not found</h2>
              <p>The blog you're looking for doesn't exist.</p>
              <Link to="/blog" className="btn-primary">
                Back to Blogs
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          top: '70px',
          zIndex: 999999
        }}
      />
      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div 
          className="reading-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="blog-single-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-hero-image-wrapper">
            <img src={post.image} alt={post.title} className="blog-hero-image" />
            <div className="blog-hero-overlay" />
          </div>
          <div className="container">
            <div className="blog-hero-content">
              <h1 className="blog-hero-title">{post.title}</h1>
              <div className="blog-hero-meta">
                <div className="author-info">
                  <img src={post.authorImage} alt={post.author} className="author-avatar" />
                  <div className="author-details">
                    <span className="author-name">{post.author}</span>
                    <span className="publish-date">{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="blog-main-section">
          <div className="container">
            <div className="blog-layout">
              {/* Mobile Sidebar Toggle */}
              <div className="mobile-sidebar-toggle">
                <button 
                  className="mobile-toggle-btn"
                  onClick={() => setActiveMobileWidget(activeMobileWidget === 'contents' ? null : 'contents')}
                >
                  <i className="fas fa-list" /> Table of Contents
                  <i className={`fas fa-chevron-${activeMobileWidget === 'contents' ? 'up' : 'down'} toggle-arrow`} />
                </button>
                {activeMobileWidget === 'contents' && tableOfContents.length > 0 && (
                  <div className="mobile-toc">
                    <ul className="toc-list">
                      {tableOfContents.map((item, idx) => (
                        <li key={idx}>
                          <a href={`#${item.id}`} onClick={(e) => { scrollToSection(e, item.id); setActiveMobileWidget(null); }}>
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className={`blog-sidebar ${isSticky ? 'sticky' : ''}`}>
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <div className="sidebar-widget toc-widget">
                    <h4 className="widget-title">
                      <i className="fas fa-list" /> Table of Contents
                    </h4>
                    <ul className="toc-list">
                      {tableOfContents.map((item, idx) => (
                        <li key={idx}>
                          <a href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)}>
                            <i className="fas fa-chevron-right toc-icon" />
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent Posts */}
                <div className="sidebar-widget recent-posts-widget">
                  <h4 className="widget-title">
                    <i className="fas fa-clock" /> Recent Posts
                  </h4>
                  <ul className="recent-posts-list">
                    {recentPosts.map((recentPost) => (
                      <li key={recentPost.id}>
                        <Link to={`/blog/${recentPost.id}`} className="recent-post-link">
                          <div className="recent-post-thumb">
                            <img src={recentPost.image} alt={recentPost.title} />
                          </div>
                          <div className="recent-post-info">
                            <h6 className="recent-post-title">{recentPost.title}</h6>
                            <span className="recent-post-date">{recentPost.date}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter Widget */}
                <div className="sidebar-widget newsletter-widget">
                  <h4 className="widget-title">
                    <i className="fas fa-envelope" /> Newsletter
                  </h4>
                  <p>Get gardening tips delivered to your inbox!</p>
                  <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                    <input 
                      type="email" 
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting || isSuccess}
                      required
                    />
                    <button type="submit" className="btn-subscribe" disabled={isSubmitting || isSuccess}>
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          Subscribing...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle size={14} />
                          Subscribed!
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane" /> Subscribe
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </aside>

              {/* Article Content */}
              <article className="blog-article">
                <div className="blog-content">
                  {post.content.map((block, idx) => renderContent(block, idx))}
                </div>

                {/* Tags */}
                <div className="blog-tags">
                  <span className="tags-label">Tags:</span>
                  {['Gardening', 'Urban Living', 'Healthy Food', 'Microgreens', 'Sustainability'].map((tag) => (
                    <Link key={tag} to={`/blog?tag=${tag}`} className="tag-link">
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Author Box */}
                <div className="author-box">
                  <div className="author-box-header">
                    <div className="author-box-avatar">
                      <img src={post.authorImage} alt={post.author} />
                    </div>
                    <div className="author-box-title">
                      <span className="written-by">Written by</span>
                      <h5 className="author-box-name">{post.author}</h5>
                    </div>
                  </div>
                  <div className="author-box-content">
                    <p className="author-box-bio">
                      Passionate about helping urban dwellers grow their own fresh, healthy food. 
                      We provide easy-to-use gardening kits and expert tips for beginners.
                    </p>
                    <div className="author-box-social">
                      <a href="#" className="social-link" title="Instagram"><i className="fab fa-instagram" /></a>
                      <a href="#" className="social-link" title="Facebook"><i className="fab fa-facebook-f" /></a>
                      <a href="#" className="social-link" title="Twitter"><i className="fab fa-twitter" /></a>
                      <a href="#" className="social-link" title="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="related-posts-section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Explore More</span>
              <h2 className="section-title">Related Articles</h2>
            </div>
            <div className="related-posts-grid">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="related-post-card">
                  <div className="related-post-image">
                    <Link to={`/blog/${relatedPost.id}`}>
                      <img src={relatedPost.image} alt={relatedPost.title} />
                      <div className="related-post-overlay">
                        <span className="read-more">Read Article</span>
                      </div>
                    </Link>
                    <span className="related-post-category">{relatedPost.category}</span>
                  </div>
                  <div className="related-post-content">
                    <div className="related-post-meta">
                      <span className="related-post-date">{relatedPost.date}</span>
                      <span className="related-post-readtime">{relatedPost.readTime}</span>
                    </div>
                    <h4 className="related-post-title">
                      <Link to={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="blog-cta-section">
          <div className="container">
            <div className="cta-box">
              <div className="cta-content">
                <div className="cta-icon">🌱</div>
                <h3 className="cta-title">Ready to Start Your Garden?</h3>
                <p className="cta-description">
                  Transform your balcony or kitchen into a thriving green space. 
                  Our beginner-friendly growing kits make it easy to grow fresh microgreens and herbs at home.
                </p>
                <div className="cta-buttons">
                  <Link to="/shop" className="btn-primary">
                    Shop Growing Kits
                  </Link>
                  <Link to="/contact" className="btn-outline">
                    Get Expert Help
                  </Link>
                </div>
              </div>
              <div className="cta-image">
                <img src="/assets/img/home-1/blog/img3.png" alt="Growing kits" />
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Back to Top"
      >
        <i className="fas fa-arrow-up" />
      </button>
      <Footer />
    </>
  );
};

export default BlogSingle;