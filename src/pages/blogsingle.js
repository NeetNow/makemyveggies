import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';

const BLOG_POSTS = {
  '1': {
    title: 'Balcony and Kitchen Gardening for Beginners: Grow Fresh, Healthy Food at Home',
    image: '/assets/img/home-1/blog/img1.png',
    content: [
      {
        type: 'p',
        text: 'Living in a city doesn’t mean you have to give up on fresh, healthy food. Even with limited space and a busy routine, it’s surprisingly easy to grow your own greens at home. Balcony and kitchen gardening are simple ways to bring a bit of nature into your daily life — and the best part is, you don’t need a garden to get started.',
      },
      {
        type: 'p',
        text: 'Whether it’s a few pots on your balcony or a tray of microgreens sitting on your kitchen counter, growing your own food can completely change the way you eat and feel.',
      },
      { type: 'h4', text: 'What Is Balcony and Kitchen Gardening?' },
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
      { type: 'h4', text: 'Why it works for urban homes:' },
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
      { type: 'p', text: 'Because these gardens are close to your daily living space, they:' },
      {
        type: 'ul',
        items: [
          'Encourage regular care and harvesting',
          'Reduce dependence on store-bought produce',
          'Make fresh food easily accessible',
        ],
      },
      {
        type: 'p',
        text: 'In short, balcony and kitchen gardening turn unused corners of your home into productive green spaces, making healthy, homegrown food possible even in the middle of a city.',
      },
      {
        type: 'p',
        text: 'With pots, trays, or ready grow kits, you can easily grow vegetables, herbs, and microgreens without soil-heavy gardening or complicated setups.',
      },
      { type: 'p', text: 'Microgreens are especially popular with beginners because they:' },
      {
        type: 'ul',
        items: ['Take up very little space', 'Don’t need strong sunlight', 'Are ready to harvest in just 7–14 days'],
      },
      { type: 'h4', text: 'Health Benefits of Growing Food at Home' },
      { type: 'h4', text: 'Fresh, nutrient-rich produce' },
      {
        type: 'p',
        text: 'When you grow food at home, you harvest it fresh — right when it’s ready. This helps preserve important nutrients like vitamins, minerals, and antioxidants that are often lost during storage and transport.',
      },
      {
        type: 'p',
        text: 'Microgreens such as broccoli, radish, mustard, and pea shoots are known for being especially nutritious and are easy to include in everyday meals.',
      },
      { type: 'h4', text: 'Clean, chemical-free eating' },
      {
        type: 'p',
        text: 'One of the biggest perks of home gardening is control. You decide what goes into your plants — no unnecessary chemicals, no mystery sprays. This makes homegrown food safer for families, kids, and even pets.',
      },
      { type: 'h4', text: 'Perfect for City Living' },
      { type: 'p', text: 'Balcony and kitchen gardening fit perfectly into modern urban life:' },
      {
        type: 'ul',
        items: ['No large space needed', 'Very little water required', 'Easy to manage, even with a busy schedule', 'Can be done all year round'],
      },
      {
        type: 'p',
        text: 'With today’s simple growing methods, even complete beginners can enjoy gardening without feeling overwhelmed.',
      },
      { type: 'h4', text: 'A Small Step Towards a Greener Planet 🌍' },
      {
        type: 'p',
        text: 'Growing food at home isn’t just good for your health — it’s also better for the environment. When you grow your own greens, there’s no need for transportation or long food supply chains, which means zero food miles and lower emissions. Home gardening also reduces the use of plastic packaging that often comes with store-bought produce. Since you harvest only what you need, food waste is naturally reduced, helping lower your overall household carbon footprint in a simple, sustainable way.',
      },
      {
        type: 'p',
        text: 'Microgreens are especially eco-friendly since they grow quickly and need fewer resources than most vegetables.',
      },
      { type: 'h4', text: 'Easy Plants to Start With' },
      { type: 'p', text: 'If you’re new to gardening, start simple. These are great options for small spaces:' },
      {
        type: 'ul',
        items: [
          'Microgreens: Fast-growing, highly nutritious, and beginner-friendly.',
          'Herbs: Coriander, basil, and mint grow well in small pots and are useful in everyday cooking.',
          'Leafy greens: Spinach, lettuce, and fenugreek are easy to manage and perfect for balconies.',
        ],
      },
      { type: 'h4', text: 'More Than Just Gardening: Mental Wellness Benefits' },
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
      { type: 'h4', text: 'Budget-Friendly and Sustainable' },
      { type: 'p', text: 'Balcony and kitchen gardening can also help you save money over time:' },
      {
        type: 'ul',
        items: ['Lower grocery bills', 'Less food waste', 'Grow only what you need', 'Enjoy regular, fresh harvests'],
      },
      {
        type: 'p',
        text: 'With reusable containers and seeds, it becomes a simple, long-term habit rather than an expensive hobby.',
      },
      { type: 'h4', text: 'How to Get Started (It’s Easier Than You Think)' },
      {
        type: 'p',
        text: 'Starting your own mini garden at home doesn’t require special skills or a lot of time. A few basic steps are enough to get you going.',
      },
      { type: 'h4', text: 'Pick a spot with good light' },
      {
        type: 'p',
        text: 'Choose a place that receives natural light for a few hours a day, such as a balcony, windowsill, or near a kitchen window. Most greens and microgreens grow well with indirect sunlight, so you don’t need harsh or direct sun all day.',
      },
      { type: 'h4', text: 'Use small pots or trays' },
      {
        type: 'p',
        text: 'You don’t need large containers. Small pots, shallow trays, or ready grow kits work perfectly, especially for microgreens and herbs. Make sure the containers have drainage or are designed for indoor growing.',
      },
      { type: 'h4', text: 'Start with fast-growing plants' },
      {
        type: 'p',
        text: 'Begin with easy and quick options like microgreens, leafy greens, or herbs. Microgreens are ideal for beginners because they grow fast and are usually ready to harvest within 7–14 days, giving you quick results and confidence.',
      },
      { type: 'h4', text: 'Water regularly and harvest fresh' },
      {
        type: 'p',
        text: 'Water gently to keep the soil or growing medium moist but not soggy. Check your plants daily and harvest them when they’re fresh and ready. Regular care and timely harvesting help keep your plants healthy and productive.',
      },
      { type: 'p', text: 'That’s it. No experience needed.' },
      { type: 'h4', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Balcony and kitchen gardening prove that you don’t need a big garden to live a healthier, more sustainable life. With just a little space and a bit of care, you can grow fresh, nutritious food right at home.',
      },
      {
        type: 'p',
        text: 'Start small, enjoy the process, and let your balcony or kitchen become your own little green corner. 🌱',
      },
    ],
  },
  '2': {
    title: 'Gardening at Home: A Natural Way to Unwind from Urban Stress',
    image: '/assets/img/home-1/blog/img2.png',
    content: [
      {
        type: 'p',
        text: 'City life moves fast. Between work deadlines, traffic, screens, and never-ending notifications, it’s easy to feel overwhelmed. While urban living has its perks, it often leaves very little room for quiet moments or a real connection with nature.',
      },
      {
        type: 'p',
        text: 'That’s where home gardening comes in. You don’t need a big backyard or hours of free time — even a few plants on a balcony, windowsill, or kitchen counter can become a calming escape from everyday stress.',
      },

      { type: 'h4', text: 'Why Urban Life Feels So Stressful' },
      {
        type: 'p',
        text: 'Living in a city can quietly take a toll on mental well-being. Many people deal with:',
      },
      {
        type: 'ul',
        items: [
          'Constant stress and irritability',
          'Mental exhaustion or burnout',
          'Trouble sleeping',
          'Difficulty focusing',
        ],
      },
      {
        type: 'p',
        text: 'When this kind of stress builds up, it affects both mental and physical health. Finding simple, everyday ways to slow down becomes essential — and gardening is one of them.',
      },

      { type: 'h4', text: 'How Gardening Helps You Relax 🌿' },
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

      { type: 'h4', text: 'Bringing Nature Back into City Homes' },
      {
        type: 'p',
        text: 'Access to green spaces isn’t always easy in cities, but home gardening brings nature right to you.',
      },
      { type: 'p', text: 'A small garden can live on:' },
      {
        type: 'ul',
        items: ['Balconies', 'Windowsills', 'Terraces', 'Kitchen counters'],
      },
      {
        type: 'p',
        text: 'Even indoor plants and microgreens can add freshness to your space and help restore that much-needed connection with nature.',
      },
      {
        type: 'p',
        text: 'Microgreens are especially popular in urban homes because they grow fast, take up very little space, and are easy to care for.',
      },

      { type: 'h4', text: 'Gardening and Mindfulness Go Hand in Hand 🧠' },
      {
        type: 'p',
        text: 'Gardening naturally pulls you into the present moment. Simple actions like:',
      },
      {
        type: 'ul',
        items: ['Touching soil', 'Watering plants', 'Watching new leaves grow'],
      },
      {
        type: 'p',
        text: 'help quiet racing thoughts. It’s a lot like meditation — but easier and more enjoyable for many people. Over time, this mindful routine can reduce overthinking and create a sense of calm.',
      },

      { type: 'h4', text: 'The Joy of Watching Something Grow' },
      {
        type: 'p',
        text: 'Urban life often feels rushed and out of our control. Gardening gives you something steady and positive to focus on.',
      },
      { type: 'p', text: 'With plants:' },
      {
        type: 'ul',
        items: [
          'You see progress',
          'You feel responsible for something living',
          'You experience a sense of achievement',
        ],
      },
      {
        type: 'p',
        text: 'Harvesting something you’ve grown yourself — especially quick growers like microgreens — can be surprisingly satisfying.',
      },

      { type: 'h4', text: 'A Simple Way to Improve Work-Life Balance' },
      {
        type: 'p',
        text: 'When work and home start to blend together, especially with remote work, it’s hard to switch off.',
      },
      { type: 'p', text: 'Gardening helps by:' },
      {
        type: 'ul',
        items: ['Creating a small daily routine', 'Encouraging screen-free time', 'Giving you something to look forward to outside of work'],
      },
      {
        type: 'p',
        text: 'Even 10–15 minutes a day with your plants can help clear your mind and reset your energy.',
      },

      { type: 'h4', text: 'Physical Benefits That Support Mental Health' },
      {
        type: 'p',
        text: 'Gardening also includes light physical movement, which helps:',
      },
      {
        type: 'ul',
        items: ['Release muscle tension', 'Improve circulation', 'Support better sleep'],
      },
      {
        type: 'p',
        text: 'Being around greenery has also been linked to improved sleep quality and relaxation — both important for managing stress.',
      },

      { type: 'h4', text: 'Why Microgreens Work So Well for City Living 🌱' },
      {
        type: 'p',
        text: 'Microgreens are ideal for busy, urban lifestyles:',
      },
      {
        type: 'ul',
        items: ['Ready to harvest in 7–14 days', 'Need very little space and water', 'Grow well indoors'],
      },
      {
        type: 'p',
        text: 'Their quick growth offers fast rewards, making them perfect for stress relief without adding extra pressure.',
      },

      { type: 'h4', text: 'Turning Gardening into a Long-Term Habit' },
      {
        type: 'p',
        text: 'Over time, regular gardening can help:',
      },
      {
        type: 'ul',
        items: ['Build emotional resilience', 'Reduce anxiety and burnout', 'Improve overall life satisfaction'],
      },
      {
        type: 'p',
        text: 'It doesn’t need to be complicated — consistency matters more than size or effort.',
      },

      { type: 'h4', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'In a world filled with concrete, screens, and tight schedules, gardening at home becomes a quiet form of therapy. It slows you down, brings nature closer, and creates moments of calm in an otherwise busy day.',
      },
      {
        type: 'p',
        text: 'You don’t need much space or time — just a small green corner and the willingness to care for it.',
      },
      {
        type: 'p',
        text: '🌿 Sometimes, peace grows quietly — right at home.',
      },
    ],
  },

  '3': {
    title: 'Health Benefits of Microgreens and How to Use Them in Everyday Cooking',
    image: '/assets/img/home-1/blog/img3.png',
    content: [
      {
        type: 'p',
        text: 'Eating healthy doesn’t always mean complicated recipes or strict diets. Sometimes, it’s as simple as adding one small ingredient to your meals — and that’s where microgreens come in.',
      },
      {
        type: 'p',
        text: 'These tiny greens may look delicate, but they’re packed with nutrition and fresh flavour. Easy to grow at home and incredibly versatile in the kitchen, microgreens fit right into everyday cooking — from breakfast to dinner.',
      },
      {
        type: 'p',
        text: 'Let’s take a closer look at what microgreens are, why they’re so good for you, and how you can start using them daily without changing your routine.',
      },

      { type: 'h4', text: 'What Exactly Are Microgreens?' },
      {
        type: 'p',
        text: 'Microgreens are young vegetable greens harvested just after their first leaves appear. This early stage is when they’re packed with nutrients and fresh flavor. One of the best things about microgreens is how quickly they grow—most are ready to harvest in just 7 to 14 days, making them perfect for home gardening, even with a busy schedule.',
      },
      { type: 'p', text: 'Our microgreen range includes:' },
      {
        type: 'ul',
        items: ['Sunflower', 'Chickpeas', 'Mustard', 'Fenugreek', 'Peas'],
      },
      {
        type: 'p',
        text: 'These varieties are easy to grow at home and fit well into everyday cooking, adding both nutrition and freshness to your meals.',
      },

      { type: 'h4', text: 'Why Microgreens Work So Well in Daily Cooking' },
      {
        type: 'p',
        text: 'What makes microgreens great is how easily they fit into regular meals. They:',
      },
      {
        type: 'ul',
        items: ['Don’t need long cooking times', 'Go well with both Indian and global dishes', 'Add colour, texture, and a fresh bite'],
      },
      {
        type: 'p',
        text: 'Because you can harvest them right when you need them, they taste better and retain more nutrients than greens that have been stored for days.',
      },

      { type: 'h4', text: 'Simple Ways to Add Microgreens to Your Meals' },
      { type: 'p', text: 'You don’t need fancy recipes — just sprinkle or mix them in.' },

      { type: 'h4', text: 'Salads and bowls' },
      {
        type: 'p',
        text: 'Add a handful to salads, grain bowls, or even sprout mixes for extra crunch and freshness.',
      },

      { type: 'h4', text: 'Breakfast dishes' },
      {
        type: 'p',
        text: 'Microgreens work beautifully in omelettes, scrambled eggs, sandwiches, and wraps. They instantly make breakfast feel lighter and healthier.',
      },

      { type: 'h4', text: 'Indian meals' },
      { type: 'p', text: 'They blend surprisingly well with everyday Indian food:' },
      {
        type: 'ul',
        items: ['Sprinkle them over dal or sabzi', 'Mix into paratha or cheela batter', 'Use as a garnish on khichdi or pulao'],
      },

      { type: 'h4', text: 'Smoothies and juices' },
      {
        type: 'p',
        text: 'Mild varieties like pea or sunflower microgreens blend easily into smoothies without changing the taste much — just an added nutrition boost.',
      },

      { type: 'h4', text: 'Soups and snacks' },
      {
        type: 'p',
        text: 'Top soups, chaat, toast, pasta, or noodles with microgreens. Think of them as a healthier, fresher garnish.',
      },

      { type: 'h4', text: 'Health Benefits of Eating Microgreens Regularly 🌱' },
      {
        type: 'p',
        text: 'Despite their size, microgreens are loaded with nutrients. They’re rich in:',
      },
      {
        type: 'ul',
        items: ['Vitamins A, C, E, and K', 'Minerals like iron, calcium, and magnesium', 'Antioxidants'],
      },
      {
        type: 'p',
        text: 'Eating them regularly can help support immunity, digestion, energy levels, and overall wellness.',
      },
      {
        type: 'p',
        text: 'Some microgreens are also known to support heart health by helping manage cholesterol levels and improving circulation.',
      },
      {
        type: 'p',
        text: 'They’re light, easy to digest, and suitable for all age groups.',
      },

      { type: 'h4', text: 'Homegrown Microgreens vs Store-Bought Greens' },
      {
        type: 'p',
        text: 'When you grow microgreens at home, you get them at their freshest. Homegrown microgreens:',
      },
      {
        type: 'ul',
        items: ['Are harvested just before eating', 'Retain more nutrients', 'Don’t need preservatives or chemicals'],
      },
      {
        type: 'p',
        text: 'Plus, growing them yourself gives you complete control over cleanliness and quality.',
      },

      { type: 'h4', text: 'Perfect for Busy, Urban Lifestyles' },
      {
        type: 'p',
        text: 'Microgreens are ideal if you live in a city or have a packed schedule:',
      },
      {
        type: 'ul',
        items: ['They grow indoors', 'Need very little water', 'Take up minimal space', 'Are ready in just a few days'],
      },
      {
        type: 'p',
        text: 'Even beginners can grow them successfully with basic tools and good seeds.',
      },

      { type: 'h4', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Microgreens prove that healthy eating doesn’t have to be complicated. They’re easy to grow, simple to use, and fit naturally into everyday cooking.',
      },
      {
        type: 'p',
        text: 'Whether you sprinkle them over your meals or blend them into drinks, microgreens add freshness, nutrition, and a little green joy to your plate — every single day.',
      },
      {
        type: 'p',
        text: 'Consistency matters: regular inclusion in meals is more important than “superfood” hype.',
      },
    ],
  },

  '4': {
    title: 'Mental Health Benefits of Home Gardening for Working Professionals',
    image: '/assets/img/home-1/blog/img4.png',
    content: [
      {
        type: 'p',
        text: 'Work today moves fast. Long hours, endless screens, constant notifications, and the pressure to always be “on” can leave even the most motivated professionals feeling drained. Stress, burnout, and mental fatigue have quietly become part of everyday life.',
      },
      {
        type: 'p',
        text: 'In the middle of all this, home gardening has turned into a surprisingly effective way to slow down. You don’t need a big garden or extra free time either — even a few plants on your balcony or a tray of microgreens in the kitchen can make a real difference.',
      },
      {
        type: 'p',
        text: 'Here’s how small gardening habits can support mental well-being, especially for busy professionals.',
      },

      { type: 'h4', text: 'Gardening: A Simple Way to Unwind 🌿' },
      {
        type: 'p',
        text: 'One of the nicest things about gardening is how naturally calming it feels. Spending just a few minutes watering plants or checking on new growth can:',
      },
      {
        type: 'ul',
        items: ['Help lower stress levels', 'Calm a busy mind', 'Create a break from screens and work pressure'],
      },
      {
        type: 'p',
        text: 'For professionals who are mentally exhausted at the end of the day, gardening offers a peaceful pause — no emails, no deadlines, just you and your plants. Microgreens and indoor plants work especially well because they don’t demand much time or effort.',
      },

      { type: 'h4', text: 'Helps Clear the Mind and Improve Focus' },
      {
        type: 'p',
        text: 'Constant multitasking and digital overload can make it hard to concentrate. Gardening gently pulls your attention into the present moment. Simple actions like:',
      },
      {
        type: 'ul',
        items: ['Watering plants', 'Trimming leaves', 'Harvesting microgreens'],
      },
      {
        type: 'p',
        text: 'encourage focus on one small task at a time. Many people find that this helps clear mental clutter and even improves focus when they return to work.',
      },

      { type: 'h4', text: 'Eases Anxiety and Emotional Fatigue' },
      {
        type: 'p',
        text: 'Watching something grow under your care can be incredibly reassuring. Home gardening can:',
      },
      {
        type: 'ul',
        items: ['Reduce feelings of anxiety', 'Improve mood', 'Create a sense of emotional balance'],
      },
      {
        type: 'p',
        text: 'Seeing microgreens sprout within a few days or noticing a new leaf appear offers small moments of positivity — something many professionals miss in high-pressure work environments.',
      },

      { type: 'h4', text: 'Brings a Sense of Control and Achievement' },
      {
        type: 'p',
        text: 'Work stress often comes from things we can’t control — deadlines, meetings, expectations. Gardening is different. With plants:',
      },
      {
        type: 'ul',
        items: ['You control the routine', 'You see steady progress', 'You enjoy visible results'],
      },
      {
        type: 'p',
        text: 'Harvesting something you’ve grown yourself, even from a small kitchen setup, creates a genuine sense of accomplishment that boosts confidence and motivation.',
      },

      { type: 'h4', text: 'Encourages Mindfulness (Without Trying Too Hard) 🧠' },
      {
        type: 'p',
        text: 'Gardening naturally slows you down. Touching soil, arranging trays, observing plant growth — these small, repetitive actions keep your attention in the present moment. It’s a lot like meditation, but without the pressure of “doing it right.” For professionals dealing with burnout or overthinking, gardening becomes a gentle form of mental reset.',
      },

      { type: 'h4', text: 'Helps Create Better Work-Life Balance' },
      {
        type: 'p',
        text: 'When work and home blur together, especially in remote or hybrid setups, it becomes hard to switch off. Gardening helps by:',
      },
      {
        type: 'ul',
        items: ['Creating a non-work routine', 'Giving your day a clear pause', 'Offering a screen-free activity to look forward to'],
      },
      {
        type: 'p',
        text: 'Even a short daily gardening habit can help reclaim personal time and mental space.',
      },

      { type: 'h4', text: 'Lifts Mood Through a Connection with Nature 🌱' },
      {
        type: 'p',
        text: 'Humans naturally feel better around greenery. This connection — often called biophilia — helps improve mood and emotional resilience. Having plants at home:',
      },
      {
        type: 'ul',
        items: ['Adds life to indoor spaces', 'Reduces feelings of isolation', 'Brings a sense of calm and freshness'],
      },
      {
        type: 'p',
        text: 'Growing edible plants or microgreens deepens this connection, linking nature, nourishment, and daily routine.',
      },

      { type: 'h4', text: 'Supports Long-Term Mental Well-Being' },
      { type: 'p', text: 'Over time, home gardening can help:' },
      {
        type: 'ul',
        items: ['Reduce burnout', 'Improve emotional balance', 'Increase overall life satisfaction'],
      },
      {
        type: 'p',
        text: 'Because microgreens and indoor plants are low-maintenance and fast-growing, they fit easily into busy schedules without becoming another task on your to-do list.',
      },
      { type: 'h4', text: 'Perfect for Busy Professionals and City Homes' },
      {
        type: 'p',
        text: 'Modern home gardening doesn’t need large spaces or hours of work. Today, it’s easy to:',
      },
      {
        type: 'ul',
        items: [
          'Garden on balconies or kitchen counters',
          'Grow fast crops like microgreens',
          'Keep routines simple and manageable'
        ],
      },
      {
        type: 'p',
        text: 'Even beginners can enjoy the mental benefits with minimal effort.',
      },

      {
        type: 'h4',
        text: 'Final Thoughts'
      },
      {
        type: 'p',
        text: 'For working professionals navigating stressful, fast-paced lives, home gardening is more than a hobby — it’s a quiet form of self-care. It offers calm, focus, and a sense of balance that’s often missing in modern routines.',
      },
      {
        type: 'p',
        text: 'Whether it’s a few plants by the window or fresh microgreens growing in your kitchen, sometimes the best therapy really is watching something grow.',
      },
      {
        type: 'p',
        text: '🌿 Small green habits can make a big difference.',
      },
    ],
  }, // Close post 4

  '5': {
    title: 'Nutritional and Protein Content of Microgreens: What Science Really Says',
    image: '/assets/img/home-1/blog/img5.png',
    content: [
      {
        type: 'p',
        text: 'Microgreens might be tiny, but don’t let their size fool you. Over the past few years, researchers and nutrition experts have taken a closer look at these young greens — and the results are impressive. Time and again, studies have shown that microgreens are packed with nutrients and can offer more goodness per bite than many mature vegetables.',
      },
      {
        type: 'p',
        text: 'If you’ve ever wondered why microgreens are considered so healthy, here’s a simple breakdown of the science behind them — without the heavy jargon.',
      },

      { type: 'h4', text: 'Why Microgreens Are Naturally So Nutritious' },
      {
        type: 'p',
        text: 'Microgreens are harvested very early in their life cycle, just after their first leaves appear. At this stage, the plant is focused on fast growth, which means it’s full of nutrients it needs to develop.',
      },
      { type: 'p', text: 'Because of this early harvest:' },
      {
        type: 'ul',
        items: [
          'Nutrients are more concentrated',
          'Vitamins and minerals are easier for the body to absorb',
          'Beneficial plant compounds are at their peak',
        ],
      },
      {
        type: 'p',
        text: 'This is what gives microgreens an edge over many fully grown vegetables.',
      },

      { type: 'h4', text: 'What Research Says About Their Nutrient Density 🧪' },
      {
        type: 'p',
        text: 'Several food science studies have found that microgreens can contain much higher levels of certain nutrients compared to their mature versions. Some key findings show that microgreens are rich in:',
      },
      {
        type: 'ul',
        items: [
          'Vitamins C, E, and K',
          'Beta-carotene',
          'Antioxidants and polyphenols that help fight oxidative stress',
        ],
      },
      {
        type: 'p',
        text: 'Different varieties bring different benefits. For example, broccoli and mustard microgreens are known for their strong antioxidant content, while pea and sunflower microgreens offer a good mix of vitamins and minerals. Including a variety helps create a more balanced diet.',
      },

      { type: 'h4', text: 'Do Microgreens Contain Protein?' },
      {
        type: 'p',
        text: 'Yes — while they aren’t a replacement for lentils, beans, or paneer, microgreens do contribute plant-based protein. Here’s what science tells us:',
      },
      {
        type: 'ul',
        items: [
          'Microgreens contain essential amino acids',
          'Legume-based microgreens like pea, lentil, and chickpea tend to have higher protein levels',
          'Their young structure makes them easier to digest',
        ],
      },
      {
        type: 'p',
        text: 'Think of microgreens as a nutritional booster rather than a main protein source. They work best when added to regular meals.',
      },

      { type: 'h4', text: 'Minerals and Better Absorption' },
      {
        type: 'p',
        text: 'Microgreens are also a good source of important minerals such as:',
      },
      {
        type: 'ul',
        items: ['Iron', 'Calcium', 'Magnesium', 'Zinc'],
      },
      {
        type: 'p',
        text: 'Because they’re harvested young, these minerals are often more bioavailable — meaning your body can absorb and use them more efficiently. This supports bone health, muscle function, and overall energy levels.',
      },

      { type: 'h4', text: 'Antioxidants and Cellular Health 🌱' },
      {
        type: 'p',
        text: 'One of the biggest reasons microgreens are so highly regarded is their antioxidant content. Antioxidants help:',
      },
      {
        type: 'ul',
        items: ['Reduce inflammation', 'Protect cells from everyday damage', 'Support immune health'],
      },
      {
        type: 'p',
        text: 'Brassica microgreens like broccoli, cabbage, and mustard are especially known for compounds called glucosinolates, which have been widely studied for their role in supporting long-term cellular health.',
      },

      { type: 'h4', text: 'Growing Conditions Matter More Than You Think' },
      {
        type: 'p',
        text: 'Research also shows that how microgreens are grown can affect their nutritional quality. Things like:',
      },
      {
        type: 'ul',
        items: ['Light exposure', 'Water quality', 'Growing medium', 'Overall plant care'],
      },
      {
        type: 'p',
        text: 'all play a role. When microgreens are grown under balanced conditions, they tend to have better flavour, yield, and nutrient content — even when grown indoors.',
      },

      { type: 'h4', text: 'Why Homegrown Microgreens Make the Most Sense' },
      {
        type: 'p',
        text: 'From a nutritional point of view, freshness is key. Homegrown microgreens:',
      },
      {
        type: 'ul',
        items: ['Are harvested right before eating', 'Lose fewer nutrients', 'Don’t need preservatives or long storage'],
      },
      {
        type: 'p',
        text: 'This means you get more vitamins, minerals, and antioxidants compared to greens that have been sitting on shelves for days.',
      },

      { type: 'h4', text: 'Microgreens in Modern Nutrition' },
      {
        type: 'p',
        text: 'Because of their high nutrient density and low environmental impact, microgreens are increasingly recommended for:',
      },
      {
        type: 'ul',
        items: ['Plant-based diets', 'Functional and balanced nutrition', 'Sustainable eating habits'],
      },
      {
        type: 'p',
        text: 'They grow fast, need very little space, and fit perfectly into modern lifestyles.',
      },

      { type: 'h4', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Science clearly supports what many home gardeners and health-focused eaters already know — microgreens pack a lot of nutrition into a very small space. Rich in vitamins, minerals, antioxidants, and even some plant protein, they’re an easy way to upgrade everyday meals.',
      },
      {
        type: 'p',
        text: 'When grown at home, microgreens offer the best of both worlds: fresh, clean food backed by real science.',
      },
      {
        type: 'p',
        text: '🌿 Small greens, big benefits.',
      },
    ],
  },

  '6': {
    title: 'Why Homegrown Vegetables Are Healthier (and More Sustainable) Than Store-Bought Produce',
    image: '/assets/img/home-1/blog/img6.png',
    content: [
      {
        type: 'p',
        text: 'Lately, many of us have started paying closer attention to what we eat — not just how it tastes, but where it comes from. With concerns around pesticides, long transport journeys, and vegetables losing their goodness before they reach us, growing food at home is slowly becoming popular again.',
      },
      {
        type: 'p',
        text: 'And honestly, it makes sense.',
      },
      {
        type: 'p',
        text: 'Whether it’s a few leafy greens on your balcony or a tray of microgreens growing quietly in your kitchen, homegrown vegetables are one of the easiest ways to eat fresher, cleaner food while also doing something good for the planet.',
      },
      {
        type: 'p',
        text: 'Let’s look at why growing your own veggies — even in a small space — is worth it.',
      },

      { type: 'h4', text: '1. Fresher Vegetables, Better Nutrition' },
      {
        type: 'p',
        text: 'One of the biggest reasons homegrown vegetables are healthier is simple: freshness. Most vegetables you buy from stores are harvested early and travel long distances before they reach your plate. During that time, they slowly lose vitamins and antioxidants.',
      },
      { type: 'p', text: 'When you grow vegetables at home:' },
      {
        type: 'ul',
        items: [
          'You harvest them when they’re ready',
          'They don’t sit in storage for days',
          'You eat them almost immediately',
        ],
      },
      {
        type: 'p',
        text: 'Microgreens are a great example. These tiny greens are harvested at a very early stage, when their nutrient levels are surprisingly high. Growing them at home means you get them at their freshest — not days later.',
      },

      { type: 'h4', text: '2. No Unwanted Chemicals on Your Plate' },
      {
        type: 'p',
        text: 'Commercial farming often uses chemical fertilizers and pesticides to improve yield and shelf life. While this helps large-scale production, it’s not always ideal for our health or the environment.',
      },
      { type: 'p', text: 'When you grow vegetables or microgreens at home:' },
      {
        type: 'ul',
        items: [
          'You know exactly what goes into your food',
          'There’s no need for harsh chemicals',
          'It’s safer for kids, pets, and the soil',
        ],
      },
      {
        type: 'p',
        text: 'You can keep things simple and natural, especially with microgreens, which grow easily without much intervention.',
      },

      { type: 'h4', text: '3. A Greener Choice for the Planet 🌱' },
      {
        type: 'p',
        text: 'Homegrown vegetables are also kinder to the environment. Think about it — no trucks, no plastic packaging, no long supply chains. Just food grown right where you live.',
      },
      { type: 'p', text: 'Some environmental benefits include:' },
      {
        type: 'ul',
        items: [
          'No food miles',
          'Less plastic waste',
          'Lower carbon footprint',
          'Reduced food wastage',
        ],
      },
      {
        type: 'p',
        text: 'Microgreens are especially eco-friendly. They grow fast (often ready in 7–14 days), use very little water, and can be grown indoors all year round.',
      },
      {
        type: 'p',
        text: 'Even growing a small portion of your food at home makes a difference.',
      },

      { type: 'h4', text: '4. Better Taste, Hands Down' },
      {
        type: 'p',
        text: 'Anyone who has tried homegrown vegetables knows this — they simply taste better. Homegrown greens:',
      },
      {
        type: 'ul',
        items: [
          'Are more flavourful and aromatic',
          'Look fresher and more vibrant',
          'Add life to everyday meals',
        ],
      },
      {
        type: 'p',
        text: 'Microgreens, in particular, bring a fresh crunch and bold flavour to salads, sandwiches, smoothies, and even Indian dishes.',
      },

      { type: 'h4', text: '5. Perfect for Small Homes and City Life' },
      {
        type: 'p',
        text: 'You don’t need a backyard or a big garden to start growing your own food. Microgreens can easily be grown:',
      },
      {
        type: 'ul',
        items: [
          'On kitchen counters',
          'Near a sunny window',
          'On balconies or windowsills',
        ],
      },
      {
        type: 'p',
        text: 'They’re ideal for apartments and busy urban lifestyles, and you don’t need any prior gardening experience to get started.',
      },

      { type: 'h4', text: '6. Grows More Than Just Food' },
      {
        type: 'p',
        text: 'Growing your own vegetables isn’t only about eating better — it often leads to healthier habits overall. People who grow their own food often:',
      },
      {
        type: 'ul',
        items: [
          'Become more aware of nutrition',
          'Rely less on processed foods',
          'Enjoy cooking more',
          'Feel a sense of calm and satisfaction',
        ],
      },
      {
        type: 'p',
        text: 'It’s also a great way to get children interested in eating greens when they’ve helped grow them.',
      },

      { type: 'h4', text: '7. Saves Money Over Time' },
      {
        type: 'p',
        text: 'Organic vegetables and microgreens can be expensive when bought regularly. Growing them at home is much more budget-friendly in the long run.',
      },
      {
        type: 'ul',
        items: [
          'One tray can give multiple harvests',
          'Lower grocery bills',
          'Good yield from very little space',
        ],
      },
      {
        type: 'p',
        text: 'With the right seeds and basic supplies, you get consistent results without spending too much.',
      },

      { type: 'h4', text: 'Final Thoughts' },
      {
        type: 'p',
        text: 'Homegrown vegetables aren’t just a trend — they’re a practical, healthy, and sustainable way to eat better. From fresher nutrition, better taste, to reduced waste and environmental benefits, the advantages really add up.',
      },
      {
        type: 'p',
        text: 'Whether you start with a small tray of microgreens or slowly build a home garden, every little step towards growing your own food is worth it — for you and for the planet.',
      },
      {
        type: 'p',
        text: '🌿 Once you try homegrown greens, it’s hard to go back.',
      },
    ],
  },
};

const BlogSingle = () => {
  const { id } = useParams();
  const blogId = id || '1';
  const post = BLOG_POSTS[blogId];

  return (
    <>
      <main>
        <section
          className="blog-single faq"
        >
          <div className="container-fluid px-0">
            {!post ? (
              <div className="container">
                <div className="faq__content">
                  <div className="faq__item">
                    <h2 className="blog-single__title">Blog not found</h2>
                    <p>The blog you’re looking for doesn’t exist.</p>
                    <Link to="/blog" className="custom-btn">Back to Blogs</Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="container blog-single__container">
                  <div className="blog-single__header">
                    <h2 className="blog-single__title">{post.title}</h2>
                  </div>
                </div>

                <div className="blog-single__hero">
                  <img src={post.image} alt={post.title} className="blog-single__hero-image" />
                </div>

                <div className="container blog-single__container">
                  <div className="faq__content blog-single__content">
                    <div className="blog-single__columns">
                      {post.content.map((block, idx) => {
                        if (typeof block === 'string') {
                          return (
                            <div className="faq__item" key={idx}>
                              <p>{block}</p>
                            </div>
                          );
                        }

                        if (block.type === 'h4') {
                          const shouldBreakColumn =
                            typeof block.text === 'string' &&
                            block.text.includes('A Small Step Towards a Greener Planet');

                          return (
                            <div
                              className={`faq__item${shouldBreakColumn ? ' blog-single__column-break' : ''}`}
                              key={idx}
                            >
                              <h4>{block.text}</h4>
                            </div>
                          );
                        }

                        if (block.type === 'ul') {
                          return (
                            <div className="faq__item" key={idx}>
                              <ul className="ps-3">
                                {block.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        }

                        return (
                          <div className="faq__item" key={idx}>
                            <p>{block.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogSingle;