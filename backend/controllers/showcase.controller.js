import Showcase from '../models/Showcase.model.js';

// Default initial dataset to seed MongoDB Atlas
const defaultTechItems = [
  {
    id: 'react',
    pillTitle: 'React',
    title: 'React.js Architecture',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/React.png',
    iconType: 'code',
    description: 'High-performance reactive frontend architectures, component-driven design systems, and fast Next.js SSR web applications.',
    techs: [
      { name: 'Next.js', color: '#000000' },
      { name: 'Redux Toolkit', color: '#764abc' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Vite', color: '#646cff' },
    ],
    order: 1,
    isActive: true,
  },
  {
    id: 'nodejs',
    pillTitle: 'Node.js',
    title: 'Node.js Backend & APIs',
    slug: 'custom-software-development',
    iconImg: '/images/suppliers/Nodejs.png',
    iconType: 'code',
    description: 'Event-driven, asynchronous backend runtimes for building scalable microservices, REST APIs, and real-time streaming architectures.',
    techs: [
      { name: 'Express.js', color: '#000000' },
      { name: 'NestJS', color: '#ea2845' },
      { name: 'GraphQL', color: '#e10098' },
      { name: 'MongoDB', color: '#47a248' },
    ],
    order: 2,
    isActive: true,
  },
  {
    id: 'angular',
    pillTitle: 'Angular',
    title: 'Angular Enterprise Solutions',
    slug: 'custom-software-development',
    iconImg: '/images/suppliers/Angular.png',
    iconType: 'code',
    description: 'Robust, enterprise-scale single page applications with type-safe dependency injection, RxJS reactive patterns, and modular architecture.',
    techs: [
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'RxJS', color: '#b7178c' },
      { name: 'NgRx Store', color: '#ba2bd3' },
      { name: 'Material UI', color: '#007acc' },
    ],
    order: 3,
    isActive: true,
  },
  {
    id: 'vue',
    pillTitle: 'Vue.js',
    title: 'Vue.js Progressive Framework',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/vue-js.png',
    iconType: 'code',
    description: 'Progressive, lightweight and performant frontend development with reactive data-binding, Nuxt 3 rendering, and clean composables.',
    techs: [
      { name: 'Nuxt 3', color: '#00dc82' },
      { name: 'Pinia Store', color: '#ffd859' },
      { name: 'Vite Bundler', color: '#646cff' },
      { name: 'Tailwind CSS', color: '#38bdf8' },
    ],
    order: 4,
    isActive: true,
  },
  {
    id: 'wordpress',
    pillTitle: 'WordPress',
    title: 'WordPress & WooCommerce CMS',
    slug: 'ecommerce-website-development',
    iconImg: '/images/suppliers/Wordpress.png',
    iconType: 'cart',
    description: 'Bespoke WordPress theme engineering, headless CMS setups, enterprise WooCommerce stores, and high-security maintenance.',
    techs: [
      { name: 'WooCommerce', color: '#7f54b3' },
      { name: 'Custom ACF', color: '#00e5a3' },
      { name: 'Gutenberg Blocks', color: '#21759b' },
      { name: 'REST API', color: '#0087be' },
    ],
    order: 5,
    isActive: true,
  },
  {
    id: 'php',
    pillTitle: 'PHP',
    title: 'PHP & Laravel Development',
    slug: 'custom-software-development',
    iconImg: '/images/suppliers/php.png',
    iconType: 'code',
    description: 'Secure, battle-tested server architectures, Laravel enterprise web portals, automated job queues, and robust relational database systems.',
    techs: [
      { name: 'Laravel 11', color: '#ff2d20' },
      { name: 'MySQL', color: '#00758f' },
      { name: 'PHP 8.3', color: '#777bb4' },
      { name: 'Composer', color: '#885630' },
    ],
    order: 6,
    isActive: true,
  },
  {
    id: 'javascript',
    pillTitle: 'JavaScript',
    title: 'Modern JavaScript (ES6+)',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/Java-script.png',
    iconType: 'code',
    description: 'Dynamic interactive client-side scripting, asynchronous browser architectures, DOM performance tuning, and WebSocket integrations.',
    techs: [
      { name: 'ESNext Standard', color: '#f7df1e' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Async/Await', color: '#f7df1e' },
      { name: 'WebSockets', color: '#1385ac' },
    ],
    order: 7,
    isActive: true,
  },
  {
    id: 'html',
    pillTitle: 'HTML5',
    title: 'Semantic HTML5 Architecture',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/Html.png',
    iconType: 'code',
    description: 'Accessible, W3C-valid, SEO-optimized semantic markup structures ensuring cross-platform browser compliance and top Lighthouse scores.',
    techs: [
      { name: 'Semantic Elements', color: '#e34f26' },
      { name: 'W3C Accessible', color: '#e34f26' },
      { name: 'Schema Markup', color: '#1385ac' },
      { name: 'OpenGraph Tags', color: '#3b5998' },
    ],
    order: 8,
    isActive: true,
  },
  {
    id: 'css',
    pillTitle: 'CSS3',
    title: 'Modern CSS3 Styling',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/CSS.png',
    iconType: 'design',
    description: 'Advanced CSS Grid, Flexbox, custom keyframe animations, glassmorphic styling, and fluid responsive design systems.',
    techs: [
      { name: 'Flexbox / Grid', color: '#1572b6' },
      { name: 'CSS Variables', color: '#1572b6' },
      { name: 'Keyframe Animations', color: '#1385ac' },
      { name: 'Responsive Media', color: '#334155' },
    ],
    order: 9,
    isActive: true,
  },
  {
    id: 'tailwind',
    pillTitle: 'Tailwind CSS',
    title: 'Tailwind CSS Design Systems',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/Tailwind-CSS.png',
    iconType: 'design',
    description: 'Utility-first modern CSS framework enabling bespoke responsive UI systems with zero bloat and lightning-fast page loading speeds.',
    techs: [
      { name: 'JIT Compiler', color: '#38bdf8' },
      { name: 'Custom Tokens', color: '#38bdf8' },
      { name: 'Mobile First', color: '#1385ac' },
      { name: 'Dark Mode Support', color: '#0f172a' },
    ],
    order: 10,
    isActive: true,
  },
];

const defaultNextGen = {
  eyebrow: 'This is what we will be',
  title: 'A Next-Generation Engineering & Digital Solutions Partner',
  paragraphs: [
    "We are a digital solutions and engineering enterprise focused on helping modern organizations keep pace with rapid digital acceleration. Technology in isolation is never enough; the true catalyst for sustained growth is pairing deep engineering capability with strategic design and a customized understanding of each client's commercial objectives.",
    'From custom enterprise web systems and cloud applications to data-backed performance marketing and AI automations, our core standard remains constant: build solutions that perform reliably under pressure, scale gracefully over time, and continue driving tangible business value long after initial deployment.',
  ],
  isActive: true,
};

const defaultTestimonials = {
  eyebrow: 'Client Feedback',
  title: 'Hear what our Clients Say',
  text: 'Hear firsthand from our valued clients about the exceptional service, reliable solutions, and impactful results that set us apart. Their success stories reflect our commitment to excellence and long-term partnerships.',
  items: [
    {
      name: 'Rahul Sharma',
      role: 'Business Owner',
      text: 'BER Services understood our requirements perfectly and delivered a modern, professional website. The entire process was smooth and well managed.',
      avatar: '',
      rating: 5,
      order: 1,
      isActive: true,
    },
    {
      name: 'Amit Verma',
      role: 'Director',
      text: 'The team has been very supportive and proactive with our digital marketing. We have seen a noticeable improvement in our online visibility and leads.',
      avatar: '',
      rating: 5,
      order: 2,
      isActive: true,
    },
    {
      name: 'Neha Gupta',
      role: 'Founder',
      text: 'BER Services built our eCommerce website exactly as we needed. The website is easy to manage, user-friendly, and works smoothly across devices.',
      avatar: '',
      rating: 5,
      order: 3,
      isActive: true,
    },
    {
      name: 'Sanjay Mehta',
      role: 'Business Owner',
      text: 'We were looking for a reliable SEO partner and BER Services has been doing a great job. Their approach is professional, transparent, and result-oriented.',
      avatar: '',
      rating: 5,
      order: 4,
      isActive: true,
    },
    {
      name: 'Vikas Kapoor',
      role: 'Founder',
      text: 'From planning to development, the BER team was very responsive and professional. They delivered a clean and user-friendly mobile application.',
      avatar: '',
      rating: 5,
      order: 5,
      isActive: true,
    },
    {
      name: 'Priya Malhotra',
      role: 'Entrepreneur',
      text: 'The creative team did an excellent job with our branding and marketing creatives. They understood our vision and turned it into professional designs.',
      avatar: '',
      rating: 5,
      order: 6,
      isActive: true,
    },
  ],
  isActive: true,
};

const defaultClients = {
  eyebrow: 'Our Clients',
  title: 'We work with the Best Clients',
  text: 'Trusted by ambitious startups and leading enterprise brands across industries.',
  items: [
    { name: 'VI', logo: '/images/partners/VI.png', website: '', order: 1, isActive: true },
    { name: 'Upstarts University', logo: '/images/partners/Upstarts-university.png', website: '', order: 2, isActive: true },
    { name: 'Med-globe', logo: '/images/partners/Med-globe.png', website: '', order: 3, isActive: true },
    { name: 'Medical Reimpro', logo: '/images/partners/Medical-Reimpro.png', website: '', order: 4, isActive: true },
    { name: 'PhonePe', logo: '/images/partners/Phone-Pay.png', website: '', order: 5, isActive: true },
    { name: 'Rajesh Masale', logo: '/images/partners/Rajesh-masale.png', website: '', order: 6, isActive: true },
    { name: 'Max Healthcare', logo: '/images/partners/Max-Healthcare.png', website: '', order: 7, isActive: true },
    { name: 'FindInjuryCare', logo: '/images/partners/Findijurycare.png', website: '', order: 8, isActive: true },
    { name: 'Instant Injury Doctors', logo: '/images/partners/Instantinjurydoctors.png', website: '', order: 9, isActive: true },
    { name: 'Honda', logo: '/images/partners/Honda.png', website: '', order: 10, isActive: true },
    { name: 'LG', logo: '/images/partners/LG.png', website: '', order: 11, isActive: true },
    { name: 'GOLDI', logo: '/images/partners/GOLDI.png', website: '', order: 12, isActive: true },
  ],
  isActive: true,
};

/**
 * Seed default showcase document in MongoDB Atlas if none exists
 */
export const seedDefaultShowcase = async () => {
  try {
    const count = await Showcase.countDocuments();
    if (count === 0) {
      await Showcase.create({
        techSlider: {
          eyebrow: 'Our Trusted Suppliers',
          title: 'Technologies We Work With',
          items: defaultTechItems,
          isActive: true,
        },
        nextGen: defaultNextGen,
        testimonials: defaultTestimonials,
        clients: defaultClients,
        googleBusiness: {
          name: 'BER Services Pvt Ltd',
          url: 'https://share.google/6ojt2XBKe3kBFESxt',
          reviewUrl: 'https://share.google/6ojt2XBKe3kBFESxt',
          rating: 4.9,
          reviewsCount: '85+',
          status: 'Verified Business on Google',
          isActive: true,
        },
        isActive: true,
      });
      console.log('🌱 [Seeder] Seeded default Showcase Sections (TechSlider, NextGen, Testimonials, Clients).');
    }
  } catch (err) {
    console.error('❌ [Seeder Error] Failed to seed Showcase sections:', err);
  }
};

/**
 * Public: Get active showcase sections
 * GET /api/v1/showcase
 */
export const getPublicShowcase = async (req, res, next) => {
  try {
    let doc = await Showcase.findOne({ isActive: true }).lean();
    if (!doc) {
      // Fallback: try finding any record
      doc = await Showcase.findOne().lean();
    }

    if (!doc) {
      return res.status(200).json({
        success: true,
        message: 'No showcase data available',
        data: {
          techSlider: { eyebrow: '', title: '', items: [], isActive: true },
          nextGen: { eyebrow: '', title: '', paragraphs: [], isActive: true },
          testimonials: { eyebrow: '', title: '', text: '', items: [], isActive: true },
          clients: { eyebrow: '', title: '', text: '', items: [], isActive: true },
        },
      });
    }

    // Filter active items for public consumption
    const filteredDoc = {
      techSlider: {
        eyebrow: doc.techSlider?.eyebrow || '',
        title: doc.techSlider?.title || '',
        items: (doc.techSlider?.items || []).filter((item) => item.isActive !== false),
        isActive: doc.techSlider?.isActive !== false,
      },
      nextGen: {
        eyebrow: doc.nextGen?.eyebrow || '',
        title: doc.nextGen?.title || '',
        paragraphs: doc.nextGen?.paragraphs || [],
        isActive: doc.nextGen?.isActive !== false,
      },
      testimonials: {
        eyebrow: doc.testimonials?.eyebrow || '',
        title: doc.testimonials?.title || '',
        text: doc.testimonials?.text || '',
        items: (doc.testimonials?.items || []).filter((item) => item.isActive !== false),
        isActive: doc.testimonials?.isActive !== false,
      },
      clients: {
        eyebrow: doc.clients?.eyebrow || '',
        title: doc.clients?.title || '',
        text: doc.clients?.text || '',
        items: (doc.clients?.items || []).filter((item) => item.isActive !== false),
        isActive: doc.clients?.isActive !== false,
      },
      googleBusiness: {
        name: doc.googleBusiness?.name || 'BER Services Pvt Ltd',
        url: doc.googleBusiness?.url || 'https://share.google/6ojt2XBKe3kBFESxt',
        reviewUrl: doc.googleBusiness?.reviewUrl || 'https://share.google/6ojt2XBKe3kBFESxt',
        rating: doc.googleBusiness?.rating || 4.9,
        reviewsCount: doc.googleBusiness?.reviewsCount || '85+',
        status: doc.googleBusiness?.status || 'Verified Business on Google',
        isActive: doc.googleBusiness?.isActive !== false,
      },
    };

    return res.status(200).json({
      success: true,
      message: 'Showcase sections retrieved successfully',
      data: filteredDoc,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get complete showcase document (including inactive items)
 * GET /api/v1/showcase/admin
 */
export const getAdminShowcase = async (req, res, next) => {
  try {
    let doc = await Showcase.findOne();
    if (!doc) {
      await seedDefaultShowcase();
      doc = await Showcase.findOne();
    }

    return res.status(200).json({
      success: true,
      message: 'Showcase retrieved for admin',
      data: { showcase: doc },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update showcase sections
 * PUT /api/v1/showcase/admin
 */
export const updateAdminShowcase = async (req, res, next) => {
  try {
    const { techSlider, nextGen, testimonials, clients, googleBusiness, isActive } = req.body;

    let doc = await Showcase.findOne();
    if (!doc) {
      doc = new Showcase({});
    }

    if (techSlider !== undefined) doc.techSlider = techSlider;
    if (nextGen !== undefined) doc.nextGen = nextGen;
    if (testimonials !== undefined) doc.testimonials = testimonials;
    if (clients !== undefined) doc.clients = clients;
    if (googleBusiness !== undefined) doc.googleBusiness = googleBusiness;
    if (isActive !== undefined) doc.isActive = isActive;

    await doc.save();

    return res.status(200).json({
      success: true,
      message: 'Showcase sections updated successfully',
      data: { showcase: doc },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Upload image for Showcase (Logos, Tech Icons, Testimonial Avatars)
 * POST /api/v1/showcase/admin/upload-image
 */
export const uploadShowcaseImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded or invalid format',
      });
    }

    const publicUrl = `/uploads/showcase/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: publicUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (err) {
    next(err);
  }
};
