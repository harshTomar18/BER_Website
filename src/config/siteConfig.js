// =====================================================
// ALL TEXT CONTENT LIVES HERE. Edit once, updates everywhere.
// =====================================================
import { images } from './images.js';

export const company = {
  name: 'BER Services',
  legalName: 'BER SERVICES PVT. LTD.',
  tagline: 'Your trusted partner for digital solutions that strengthen brands, engage customers, and drive growth.',
  phone: '+91 85273 35977',
  email: 'info@thebermedia.com',
  whatsapp: 'https://wa.me/918527335977?text=Hello%20BER%20Services%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.',
  address: '6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP',
  shortAddress: '6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP',
  googleBusiness: {
    name: 'BER Services Pvt Ltd',
    url: 'https://share.google/6ojt2XBKe3kBFESxt',
    reviewUrl: 'https://share.google/6ojt2XBKe3kBFESxt',
    rating: 4.9,
    reviewsCount: '85+',
    status: 'Verified Business on Google',
  },
  offices: [
    {
      id: 'india',
      country: 'India',
      flag: '🇮🇳',
      badge: 'Corporate Headquarters',
      title: 'BER Services PVT. LTD.',
      address: '6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP',
      shortAddress: '6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP',
      phone: '+91 85273 35977',
      email: 'info@thebermedia.com',
      hours: 'Mon – Sat: 9:30 AM – 6:30 PM IST',
      mapUrl: 'https://share.google/6ojt2XBKe3kBFESxt',
      embedUrl: 'https://maps.google.com/maps?q=Cloud%209%20Towers,%20Sector-1,%20Vaishali,%20Ghaziabad&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
  ],
  addresses: [
    {
      title: 'BER Services PVT. LTD. (Corporate Headquarters)',
      text: '6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP',
      map: 'https://share.google/6ojt2XBKe3kBFESxt',
    },
  ],
  shortAddress: '6th Floor, Cloud 9 Towers, 5A-62, Sector-1, Vaishali, Ghaziabad, Delhi NCR, UP',
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=61593900316535',
    instagram: 'https://www.instagram.com/thebermedia_official/',
    linkedin: 'https://www.linkedin.com/company/ber-services-pvt-ltd/posts/?feedView=all',
  },
};

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About BER', to: '/about-us' },
  { label: 'Services We Provide', to: '/services-we-provide', dropdown: true },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'News and Article', to: '/news-and-article' },
  { label: 'Contact Us', to: '/contact-us' },
];

export const services = [
  {
    slug: 'website-designing-development',
    title: 'Website Designing & Development',
    badge: 'Modern Web Engineering',
    tagline: 'Enterprise Web Engineering That Converts Visitors Into Long-Term Brand Advocates.',
    short: 'Websites that are modern, responsive, and actually built to grow your brand — not just look good sitting there.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'Website Development',
    image: images.services.website,
    overview: [
      'In today\'s digital-first economy, your website is the primary operational flagship of your brand. At BER Services, we design and develop custom, high-speed, and conversion-optimized websites engineered for flawless performance across every viewport and device.',
      'From architectural wireframing and bespoke UI/UX styling to scalable frontend development and secure CMS architectures, our senior engineering team ensures your digital footprint delivers lightning-fast load speeds, robust security protocols, and measurable commercial results.'
    ],
    long: 'We design and develop custom, responsive and SEO-ready websites that represent your brand and convert visitors into customers. From planning and UI design to development, testing and launch, we handle the whole journey.',
    capabilities: [
      {
        icon: 'Layout',
        title: 'Custom UI/UX & Responsive Design',
        desc: 'Bespoke design systems and mobile-first responsive layouts that captivate audiences and maximize user engagement.'
      },
      {
        icon: 'Zap',
        title: 'Core Web Vitals & Speed Optimization',
        desc: 'Sub-second page rendering, asset compression, and clean code architectures benchmarked for perfect Lighthouse scores.'
      },
      {
        icon: 'Layers',
        title: 'Headless CMS & Admin Portals',
        desc: 'Effortless content editing workflows with enterprise CMS platforms including WordPress, Strapi, and custom admin dashboards.'
      },
      {
        icon: 'Search',
        title: 'Technical SEO & Metadata Architecture',
        desc: 'Structured schema markup, semantic HTML5, and automated sitemaps built to dominate Google search rankings from day one.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Enterprise Security & SSL Protocols',
        desc: 'Bank-grade SSL encryption, automated DDoS safeguards, and strict input sanitization preventing vulnerabilities.'
      },
      {
        icon: 'Code2',
        title: 'API & Third-Party System Integrations',
        desc: 'Seamless connections with your ERP, CRM, payment gateways, analytics suites, and marketing automation pipelines.'
      }
    ],
    techStack: [
      { name: 'React', color: '#61dafb' },
      { name: 'Next.js', color: '#000000' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Tailwind CSS', color: '#38bdf8' },
      { name: 'Node.js', color: '#68a063' },
      { name: 'WordPress', color: '#21759b' },
    ],
    process: [
      { step: '01', title: 'Requirement & UX Blueprinting', desc: 'Deep discovery into your business objectives, competitor landscape, and target customer behavior to craft a precise architectural roadmap.' },
      { step: '02', title: 'Figma Prototyping & Design Systems', desc: 'Iterative high-fidelity UI/UX design with reusable components, interaction prototypes, and brand-aligned styling for client sign-off.' },
      { step: '03', title: 'Agile Frontend & Backend Engineering', desc: 'Developing clean, modular code with modern frameworks, rigorous cross-browser testing, and headless API integrations.' },
      { step: '04', title: 'Speed Audits, Security & Live Launch', desc: 'Rigorous staging quality assurance, Core Web Vitals benchmarking, SSL configuration, and seamless zero-downtime production deployment.' }
    ],
    benefits: [
      { value: '<1.2s', label: 'Average Page Load', desc: 'Lightning-fast delivery keeping bounce rates near zero.' },
      { value: '100%', label: 'Mobile Optimized', desc: 'Flawless touch interactions on every phone and tablet.' },
      { value: '99.9%', label: 'Uptime Reliability', desc: 'Enterprise-grade hosting architecture built for high traffic.' },
      { value: '3x', label: 'Conversion Uplift', desc: 'Clear call-to-actions strategically placed to generate qualified leads.' }
    ],
    points: ['Custom UI/UX design', 'Responsive across all devices', 'SEO-ready structure', 'Fast loading & secure', 'CMS & admin panel integration']
  },
  {
    slug: 'ecommerce-website-development',
    title: 'eCommerce Website Development',
    badge: 'Omnichannel Retail & Commerce',
    tagline: 'High-Converting Digital Storefronts Built for Scalable Global Transactions.',
    short: 'Online stores that make shopping simple for your customers, with secure integrations that just work in the background.',
    heroImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'eCommerce Stores',
    image: images.services.ecommerce,
    overview: [
      'Modern digital commerce demands unmatched reliability, lightning-fast product discovery, and frictionless checkout flows. BER Services architects bespoke eCommerce platforms designed to turn casual browsers into repeat, high-value purchasers.',
      'Whether you require a custom Shopify Plus storefront, a highly scalable WooCommerce architecture, or a tailored headless commerce solution, we integrate enterprise payment gateways, real-time inventory management, automated tax compliance, and automated logistics tracking.'
    ],
    long: 'We build scalable online stores with smooth checkout, payment gateway integration, inventory management and a customer experience that encourages repeat purchases.',
    capabilities: [
      {
        icon: 'ShoppingCart',
        title: 'Custom Shopify & WooCommerce Stores',
        desc: 'Tailored store architecture with bespoke themes, conversion-focused product pages, and intuitive navigation.'
      },
      {
        icon: 'CreditCard',
        title: 'Multi-Currency & Secure Payments',
        desc: 'Native integration with Stripe, Razorpay, PayPal, Apple Pay, and UPI with bank-level encryption standards.'
      },
      {
        icon: 'Layers',
        title: 'Real-Time Inventory & ERP Sync',
        desc: 'Automated catalog synchronization, multi-warehouse stock management, and back-office ERP integrations.'
      },
      {
        icon: 'Zap',
        title: 'One-Click Frictionless Checkout',
        desc: 'Optimized conversion funnels with address auto-completion and instant guest checkout to slash cart abandonment.'
      },
      {
        icon: 'Search',
        title: 'Smart Product Search & Filters',
        desc: 'Instant typeahead search, faceted filtering, and personalized product recommendations to boost average order value.'
      },
      {
        icon: 'ShieldCheck',
        title: 'PCI-DSS Compliance & Fraud Safeguards',
        desc: 'Enterprise security standards protecting sensitive customer data and preventing fraudulent transactions.'
      }
    ],
    techStack: [
      { name: 'Shopify Plus', color: '#96bf48' },
      { name: 'WooCommerce', color: '#7f54b3' },
      { name: 'Stripe', color: '#6772e5' },
      { name: 'Razorpay', color: '#0c2340' },
      { name: 'React', color: '#61dafb' },
      { name: 'Node.js', color: '#68a063' },
    ],
    process: [
      { step: '01', title: 'Catalog Scoping & Funnel Strategy', desc: 'Analyzing SKU hierarchies, target demographics, and checkout flows to architect the optimal buyer journey.' },
      { step: '02', title: 'High-Converting UI/UX Prototyping', desc: 'Crafting responsive mobile-first store designs, sticky cart drawers, and frictionless payment screens in Figma.' },
      { step: '03', title: 'Platform Development & Gateways', desc: 'Configuring payment APIs, shipping partners, tax calculators, and real-time inventory hooks.' },
      { step: '04', title: 'Transaction Stress Testing & Launch', desc: 'Simulating concurrent checkouts, payment failure fallbacks, and server load spikes prior to public deployment.' }
    ],
    benefits: [
      { value: '35%+', label: 'Checkout Conversion Lift', desc: 'Frictionless purchasing flows driving immediate revenue increases.' },
      { value: '<800ms', label: 'Cart Response Time', desc: 'Instant item additions without sluggish page reloads.' },
      { value: 'Level 1', label: 'PCI-DSS Compliant', desc: 'Highest standard in secure electronic payment processing.' },
      { value: '24/7', label: 'Sales Uptime', desc: 'Resilient cloud architecture prepared for festive seasonal traffic spikes.' }
    ],
    points: ['Shopify / WooCommerce / Custom stores', 'Secure payment gateways', 'Inventory & order management', 'Mobile-first shopping experience', 'Shipping & CRM integrations']
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    badge: 'Cross-Platform & Native Mobile',
    tagline: 'Feature-Rich iOS & Android Applications That Keep Users Actively Engaged.',
    short: 'Mobile apps that are easy for customers to use and built to genuinely connect them with your business.',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'Mobile Apps',
    image: images.services.mobile,
    overview: [
      'Mobile devices are the central touchpoint between modern consumers and your business. BER Services develops intuitive, high-performance iOS and Android applications utilizing cutting-edge cross-platform and native technologies.',
      'From rapid MVP prototyping to full-scale enterprise deployments, we deliver seamless 60fps animations, offline-first data caching, secure biometric authentication, and robust cloud API backends that scale effortlessly with your user base.'
    ],
    long: 'From idea to app-store launch, we create intuitive Android and iOS apps using modern cross-platform and native technologies.',
    capabilities: [
      {
        icon: 'Smartphone',
        title: 'Cross-Platform Flutter & React Native',
        desc: 'Single codebase efficiency delivering native performance, shared business logic, and rapid time-to-market.'
      },
      {
        icon: 'Code2',
        title: 'Native iOS & Android Engineering',
        desc: 'Dedicated Swift and Kotlin implementations for hardware-intensive applications and platform-specific capabilities.'
      },
      {
        icon: 'Zap',
        title: 'Offline Mode & Local Data Sync',
        desc: 'SQLite and local caching mechanisms ensuring full application functionality even in low-connectivity areas.'
      },
      {
        icon: 'Layers',
        title: 'Push Notifications & Engagement',
        desc: 'Personalized automated push messaging and in-app alerts powered by Firebase Cloud Messaging (FCM).'
      },
      {
        icon: 'ShieldCheck',
        title: 'Biometric Security & Encrypted Vaults',
        desc: 'Touch ID, Face ID, and AES-256 local keychain encryption protecting user data and confidential credentials.'
      },
      {
        icon: 'Sparkles',
        title: 'App Store & Play Store Publishing',
        desc: 'End-to-end management of developer accounts, guideline compliance, asset requirements, and store reviews.'
      }
    ],
    techStack: [
      { name: 'Flutter', color: '#02569b' },
      { name: 'React Native', color: '#61dafb' },
      { name: 'Swift (iOS)', color: '#f05138' },
      { name: 'Kotlin (Android)', color: '#7f52ff' },
      { name: 'Firebase', color: '#ffca28' },
      { name: 'Node.js', color: '#68a063' },
    ],
    process: [
      { step: '01', title: 'Mobile UX & Feature Scoping', desc: 'Defining core mobile user personas, touch journeys, device requirements, and cloud backend architecture.' },
      { step: '02', title: 'Interactive Prototype Validation', desc: 'Crafting clickable mobile prototypes in Figma to test user intuition, navigation flows, and animation physics.' },
      { step: '03', title: 'Sprint Sprints & Real Device Testing', desc: 'Engineering modular frontends with API integrations, tested across dozens of physical iOS and Android devices.' },
      { step: '04', title: 'Store Deployment & Performance Monitoring', desc: 'Navigating Apple App Store and Google Play compliance, metadata optimization, and crash analytics setup.' }
    ],
    benefits: [
      { value: '60 FPS', label: 'Fluid Motion', desc: 'Buttery-smooth UI transitions and gestures on all devices.' },
      { value: '99.8%', label: 'Crash-Free Rate', desc: 'Extensively tested against edge cases and system interruptions.' },
      { value: '2x', label: 'Faster Time to Market', desc: 'Cross-platform single codebase cutting delivery timelines in half.' },
      { value: '100%', label: 'Store Approval', desc: 'Full compliance with Apple App Store and Google Play guidelines.' }
    ],
    points: ['Android & iOS apps', 'Flutter & React Native', 'API & backend integration', 'App store deployment', 'Maintenance & support']
  },
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    badge: 'Enterprise Cloud Architecture',
    tagline: 'Tailor-Made Software Systems Engineered to Automate Complex Workflows and Scale Effortlessly.',
    short: "Software built around how your business actually operates, so day-to-day work gets simpler and growth doesn't feel like a struggle.",
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'Custom Software',
    image: images.services.software,
    overview: [
      'Off-the-shelf software often forces growing enterprises into rigid, inefficient processes. BER Services engineers custom, cloud-native software platforms tailored precisely to your operational workflows, compliance mandates, and scaling objectives.',
      'From custom ERP and CRM platforms to real-time administrative dashboards and microservices architectures, we construct modular, fault-tolerant software systems that streamline internal productivity and provide actionable business intelligence.'
    ],
    long: 'We develop tailor-made software — ERP, CRM, portals and automation tools — designed around your workflows and built to scale with you.',
    capabilities: [
      {
        icon: 'Cpu',
        title: 'Custom ERP, CRM & Business Portals',
        desc: 'Centralized systems automating supply chains, customer records, billing, and internal employee workflows.'
      },
      {
        icon: 'Layers',
        title: 'Microservices & REST / GraphQL APIs',
        desc: 'Loosely coupled modular services engineered to process high concurrent throughput with zero downtime.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Role-Based Access Control (RBAC)',
        desc: 'Fine-grained permissions, audit trails, and multi-tenant isolation keeping confidential enterprise data secure.'
      },
      {
        icon: 'BarChart3',
        title: 'Real-Time Analytics & BI Dashboards',
        desc: 'Interactive data visualization suites providing operational intelligence and executive reporting in real time.'
      },
      {
        icon: 'Database',
        title: 'High-Concurrency Database Design',
        desc: 'PostgreSQL, MySQL, and Redis caching topologies architected for data integrity and sub-millisecond queries.'
      },
      {
        icon: 'Zap',
        title: 'Legacy Modernization & Cloud Migration',
        desc: 'Refactoring outdated monolithic systems into modern Docker and Kubernetes cloud-native environments.'
      }
    ],
    techStack: [
      { name: 'Python', color: '#3776ab' },
      { name: 'Node.js', color: '#68a063' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'PostgreSQL', color: '#336791' },
      { name: 'Docker', color: '#2496ed' },
      { name: 'AWS Cloud', color: '#ff9900' },
    ],
    process: [
      { step: '01', title: 'System Architecture & Domain Scoping', desc: 'Mapping database schemas, entity relationship models, and user role matrices with your key business stakeholders.' },
      { step: '02', title: 'Microservices & API Architecture', desc: 'Designing secure OpenAPI specifications, authentication gateways, and modular service boundaries.' },
      { step: '03', title: 'Iterative Sprints & Automated Testing', desc: 'Writing clean, documented code backed by automated unit, integration, and security vulnerability testing.' },
      { step: '04', title: 'CI/CD Cloud Deployment & Training', desc: 'Automating zero-downtime deployment pipelines on AWS/Azure and providing exhaustive operator documentation.' }
    ],
    benefits: [
      { value: 'Zero', label: 'Vendor Lock-In', desc: 'You own 100% of the proprietary source code, IP, and database architecture.' },
      { value: '10x', label: 'Scalability Factor', desc: 'Designed to handle 10x traffic expansion without architectural refactoring.' },
      { value: '50%+', label: 'Operational Speedup', desc: 'Elimination of repetitive manual data entry and spreadsheet errors.' },
      { value: '99.98%', label: 'Cloud Uptime SLA', desc: 'Fault-tolerant multi-zone deployments ensuring uninterrupted business continuity.' }
    ],
    points: ['ERP / CRM / HRMS', 'Web portals & dashboards', 'Third-party integrations', 'Scalable architecture', 'Ongoing support']
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    badge: 'Performance Growth & SEO',
    tagline: 'Data-Driven Performance Campaigns That Maximize Qualified Traffic and Measurable ROI.',
    short: 'Strategies backed by real data — more visibility, more engagement, more leads, and conversions that actually move the needle.',
    heroImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'Digital Marketing',
    image: images.services.marketing,
    overview: [
      'Traffic is vanity; qualified leads and scalable revenue are sanity. BER Services builds comprehensive, data-backed digital marketing strategies designed to position your brand directly in front of active, high-intent buyers.',
      'Combining technical Search Engine Optimization (SEO), high-yield paid search and social campaigns (Google Ads, Meta Ads), conversion rate optimization (CRO), and transparent multi-touch attribution, we ensure every marketing rupee spent yields measurable commercial return.'
    ],
    long: 'Our data-driven digital marketing covers SEO, social media, paid ads and content so your brand reaches the right audience at the right time.',
    capabilities: [
      {
        icon: 'Search',
        title: 'Technical & On-Page SEO Domination',
        desc: 'Comprehensive keyword research, backlink acquisition, and architectural SEO to capture top Google rankings.'
      },
      {
        icon: 'BarChart3',
        title: 'Google Ads & High-Intent PPC',
        desc: 'Hyper-targeted Search, Shopping, and Display campaigns engineered to minimize cost-per-acquisition (CPA).'
      },
      {
        icon: 'Sparkles',
        title: 'Meta & Social Performance Ads',
        desc: 'Engaging video and carousel ad creatives tailored for Instagram, Facebook, and LinkedIn audience segments.'
      },
      {
        icon: 'Zap',
        title: 'Conversion Rate Optimization (CRO)',
        desc: 'A/B landing page testing, heatmap diagnostics, and user session recordings to maximize lead conversions.'
      },
      {
        icon: 'Layers',
        title: 'Content Marketing & Brand Authority',
        desc: 'Authoritative blog articles, whitepapers, and case studies that build organic domain authority.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Attribution & Transparent Reporting',
        desc: 'Real-time Looker Studio dashboards giving you 24/7 visibility into impressions, clicks, leads, and ROAS.'
      }
    ],
    techStack: [
      { name: 'Google Ads', color: '#4285f4' },
      { name: 'Meta Ads', color: '#0668e1' },
      { name: 'SEMrush', color: '#ff642d' },
      { name: 'Google Analytics 4', color: '#f9ab00' },
      { name: 'Looker Studio', color: '#0066ff' },
      { name: 'HubSpot', color: '#ff7a59' },
    ],
    process: [
      { step: '01', title: 'Audit & Competitor Intelligence', desc: 'Analyzing existing web traffic, competitor ad spend, keyword gaps, and customer search intent.' },
      { step: '02', title: 'Campaign Architecture & Funnel Setup', desc: 'Crafting high-converting ad copy, landing pages, tracking pixels, and server-side conversion APIs.' },
      { step: '03', title: 'Live Campaign Launch & A/B Testing', desc: 'Deploying targeted ad sets across Google & Meta, aggressively testing creatives, copy, and audience variants.' },
      { step: '04', title: 'Weekly Optimization & Scaling', desc: 'Reallocating spend to winning ad sets, negative keyword pruning, and weekly executive performance reviews.' }
    ],
    benefits: [
      { value: '3.8x', label: 'Average ROAS', desc: 'Proven returns generated across competitive commercial ad campaigns.' },
      { value: '250%+', label: 'Organic Traffic Lift', desc: 'Sustainable, non-paid visitor growth driven by rigorous technical SEO.' },
      { value: '100%', label: 'Transparent Data', desc: 'Direct live access to your ad accounts, analytics, and lead dashboards.' },
      { value: '<48h', label: 'Campaign Launch Speed', desc: 'Fast turnaround from campaign strategy sign-off to live ad delivery.' }
    ],
    points: ['Search Engine Optimization', 'Social media marketing', 'Google & Meta Ads', 'Content marketing', 'Analytics & reporting']
  },
  {
    slug: 'branding-graphic-design-services',
    title: 'Branding & Graphic Design Services',
    badge: 'Creative Identity & Design Systems',
    tagline: 'Distinctive Visual Identities That Command Authority and Foster Customer Trust.',
    short: 'A brand identity your business can be proud of — logos, brand guidelines, brochures, catalogues, marketing material and digital creatives.',
    heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'Branding & Design',
    image: images.services.branding,
    overview: [
      'In a crowded digital marketplace, unforgettable visual branding is the differentiator between being overlooked and being chosen. BER Services creates iconic brand identities and comprehensive design systems that convey professionalism and trust.',
      'From distinctive corporate logos and typography standards to high-end sales brochures, digital advertising assets, and premium packaging, our creative studio translates your business essence into a timeless, coherent visual language.'
    ],
    long: 'We craft memorable brand identities and creatives that reflect the reliability and expertise your industry demands.',
    capabilities: [
      {
        icon: 'Palette',
        title: 'Logo Design & Visual Identity',
        desc: 'Original, memorable logo marks paired with versatile wordmarks and responsive brand lockups.'
      },
      {
        icon: 'Layers',
        title: 'Comprehensive Brand Stylebooks',
        desc: 'Exhaustive guidelines specifying color palettes, typography hierarchies, spacing rules, and usage standards.'
      },
      {
        icon: 'Code2',
        title: 'Corporate Stationery & Print Collateral',
        desc: 'Print-ready business cards, letterheads, presentation decks, and executive folders formatted to exact specs.'
      },
      {
        icon: 'Sparkles',
        title: 'Marketing Brochures & Catalogues',
        desc: 'High-impact multi-page corporate profiles, product brochures, and interactive digital PDF portfolios.'
      },
      {
        icon: 'Layout',
        title: 'Digital Social & Ad Creative Packs',
        desc: 'Engaging, on-brand graphics, promotional banners, and animated templates tailored for social feeds.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Packaging & Environmental Design',
        desc: 'Product packaging dielines, 3D mockups, exhibition banners, and signage ready for industrial fabrication.'
      }
    ],
    techStack: [
      { name: 'Figma', color: '#f24e1e' },
      { name: 'Adobe Illustrator', color: '#ff9a00' },
      { name: 'Adobe Photoshop', color: '#31a8ff' },
      { name: 'Adobe InDesign', color: '#ff3366' },
      { name: 'After Effects', color: '#9999ff' },
    ],
    process: [
      { step: '01', title: 'Brand Discovery & Moodboarding', desc: 'Uncovering brand personality, core audience values, industry benchmarks, and emotional positioning.' },
      { step: '02', title: 'Concept Ideation & Vector Sketching', desc: 'Drafting distinct logo concepts, monogram variations, and typography pairing options.' },
      { step: '03', title: 'Brand System Finalization', desc: 'Refining chosen concepts into complete color palettes, typography scales, and application mockups.' },
      { step: '04', title: 'Asset Handover & Master Guidelines', desc: 'Delivering vector SVG, EPS, PDF, and high-res web assets with an exhaustive brand guide PDF.' }
    ],
    benefits: [
      { value: '100%', label: 'Original Artwork', desc: 'Completely unique, copyright-clean designs ready for trademark registration.' },
      { value: 'Vector', label: 'Infinite Resolution', desc: 'Crisp scalable graphics perfect for business cards or roadside billboards.' },
      { value: 'Cohesive', label: 'Multi-Channel Consistency', desc: 'Unified visual tone across physical print, websites, and social media.' },
      { value: 'Ready', label: 'Print-Ready Files', desc: 'CMYK color profiles and bleed marks calibrated for industrial printers.' }
    ],
    points: ['Logo & brand identity', 'Brand guidelines', 'Brochures & catalogues', 'Social media creatives', 'Packaging & print design']
  },
  {
    slug: 'ai-automation-services',
    title: 'AI Automation Services',
    badge: 'Intelligent Workflows & AI Agents',
    tagline: 'Intelligent AI Agents and Automated Workflows That Eliminate Repetitive Tasks and Multiply Team Output.',
    short: 'Smart automation and AI tools that save time, cut repetitive work and help your team focus on what matters.',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=75&auto=format',
    galleryImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=70&auto=format',
    galleryLabel: 'AI Automation',
    image: images.services.seo,
    overview: [
      'Artificial intelligence is no longer an experiment; it is the modern enterprise\'s most potent operational multiplier. BER Services builds enterprise-ready AI agents, Retrieval-Augmented Generation (RAG) knowledge systems, and multi-step workflow automations.',
      'From 24/7 intelligent customer care assistants to automated document parsing, lead qualification, and cross-platform CRM synchronization, we engineer secure AI systems that eliminate manual bottlenecks and let your talent focus on high-impact strategic work.'
    ],
    long: 'We integrate AI chatbots, workflow automation and intelligent data tools into your business so you can operate faster and smarter.',
    capabilities: [
      {
        icon: 'Bot',
        title: '24/7 Conversational AI Chatbots',
        desc: 'Custom-trained AI agents that understand context, answer complex queries, and resolve support tickets autonomously.'
      },
      {
        icon: 'Cpu',
        title: 'Enterprise RAG & Knowledge Retrieval',
        desc: 'Connecting private internal documents, SOPs, and product manuals securely to LLMs with strict data privacy.'
      },
      {
        icon: 'Zap',
        title: 'Automated Multi-App Workflows',
        desc: 'Trigger-action pipelines synchronizing Gmail, WhatsApp, CRMs, ERPs, and spreadsheets without manual intervention.'
      },
      {
        icon: 'Database',
        title: 'Intelligent Document & Data Extraction',
        desc: 'OCR-powered document parsing that automatically extracts invoices, contracts, and receipts into structured databases.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Enterprise AI Governance & Privacy',
        desc: 'Zero-data-retention API architectures ensuring sensitive proprietary company records are never used to train public models.'
      },
      {
        icon: 'BarChart3',
        title: 'Predictive Analytics & Smart Alerts',
        desc: 'Machine learning algorithms identifying customer churn risks, inventory deficits, and sales trends proactively.'
      }
    ],
    techStack: [
      { name: 'OpenAI API', color: '#10a37f' },
      { name: 'Anthropic Claude', color: '#d97757' },
      { name: 'LangChain', color: '#00d2ff' },
      { name: 'Python', color: '#3776ab' },
      { name: 'Pinecone', color: '#000000' },
      { name: 'FastAPI', color: '#05998b' },
    ],
    process: [
      { step: '01', title: 'Operational Friction Audit', desc: 'Identifying high-volume repetitive tasks, support ticket bottlenecks, and manual data pipelines within your business.' },
      { step: '02', title: 'Knowledge Ingestion & Prompt Engineering', desc: 'Structuring your proprietary business data, establishing guardrails, and tuning LLM system prompts.' },
      { step: '03', title: 'System Integration & Testing', desc: 'Connecting agents with WhatsApp, your CRM, internal APIs, and databases under strict edge-case validation.' },
      { step: '04', title: 'Production Rollout & Continuous Monitoring', desc: 'Deploying with human-in-the-loop fallback safeguards, latency monitoring, and automated performance tracking.' }
    ],
    benefits: [
      { value: '80%', label: 'Routine Ticket Deflection', desc: 'Immediate resolution of standard customer questions without human intervention.' },
      { value: '<3s', label: 'Instant Response Time', desc: 'Zero wait times across customer support and internal inquiry channels.' },
      { value: '100%', label: 'Private Data Security', desc: 'Strict enterprise guardrails ensuring zero model training on your internal data.' },
      { value: '24/7', label: 'Continuous Operation', desc: 'Automations running reliably through nights, weekends, and holiday periods.' }
    ],
    points: ['AI chatbots', 'Workflow automation', 'Data extraction & analysis', 'CRM & email automation', 'Custom AI integrations']
  },
];

export const hero = {
  titleStart: 'Custom Website Development & Digital Solutions That',
  highlights: ['Deliver', 'Grow', 'Perform'],
  text: 'Professional web development services with custom, responsive, and SEO-ready websites built for business growth.',
  cta: 'Get a Free Consultation',
  features: ['End-to-End Solutions', 'Advanced Technology', 'Tailored Strategies'],
};

export const homeServices = {
  eyebrow: 'BER Services',
  title: 'Our Services',
  text: 'We bring together technology, creativity, and digital strategy to help businesses grow, connect with their audience, and stay ahead of the competition.',
};

export const about = {
  pill: 'About BER Services',
  eyebrow: 'Highly respected global business partner',
  title: 'About BER Services',
  headline: {
    line1: 'Building Smart',
    line2: 'Software Solutions',
    accent: 'for a Better Tomorrow',
  },
  text: 'At BER Services, we turn ideas into powerful digital experiences. From modern web & mobile applications to scalable software solutions, we help businesses grow, innovate and stay ahead in the digital world.',
  ctaPrimary: "Let's Build Together",
  ctaSecondary: 'Our Vision',
  stats: [
    { n: '50+', l: 'Projects Delivered', icon: 'code' },
    { n: '30+', l: 'Happy Clients', icon: 'clients' },
    { n: '99.9%', l: 'Uptime Reliability', icon: 'uptime' },
    { n: '100%', l: 'Client Satisfaction', icon: 'satisfaction' },
  ],
};

// Comprehensive About Page Data (Mission, Vision, Values, Why Us)
export const aboutPage = {
  header: {
    eyebrow: 'Who We Are & What We Stand For',
    title: 'Architecting Digital Solutions That Transform Enterprise Operations',
    desc: 'BER Services is a premier digital engineering and technology consultancy based in Delhi NCR. We empower modern enterprises, ambitious startups, and global brands to design, engineer, and scale high-performance web systems, custom software platforms, and intelligent automations.',
  },
  mission: {
    badge: 'Our Mission',
    title: 'Empowering Businesses Through Resilient Digital Engineering',
    tagline: 'Bridging the gap between cutting-edge technology and real commercial outcomes.',
    description: 'At BER Services, our mission is to empower ambitious brands and fast-growing enterprises with resilient, high-performance, and human-centric digital solutions. We exist to eliminate the friction between complex engineering and tangible business growth—architecting websites, custom software, mobile platforms, and automated workflows that streamline day-to-day operations and reliably accelerate commercial success.',
    pillars: [
      {
        title: 'Architectural Excellence',
        desc: 'Engineering fault-tolerant, scalable, and secure digital foundations designed to withstand exponential business growth.'
      },
      {
        title: 'Measurable Commercial ROI',
        desc: 'Ensuring every single sprint, design deliverable, and marketing campaign aligns directly with client revenue and efficiency.'
      },
      {
        title: 'Human-Centered Experience',
        desc: 'Crafting intuitive, frictionless digital journeys that turn casual visitors into loyal, repeat brand advocates.'
      }
    ]
  },
  vision: {
    badge: 'Our Vision',
    title: 'Pioneering the Next Era of Intelligent Digital Transformation',
    tagline: 'Becoming the world’s most trusted partner for sustainable, future-ready technology.',
    description: 'We envision becoming a globally respected digital technology partner, benchmarked for engineering brilliance, transparent collaboration, and transformative AI-powered business solutions. By continuously pushing the frontiers of modern cloud architectures, web standards, and intelligent automation, we strive to build sustainable digital ecosystems that help businesses thrive in an increasingly connected world.',
    milestones: [
      {
        title: 'Global Engineering Benchmarks',
        desc: 'Adopting the highest international standards of code quality, automated testing, and zero-downtime CI/CD delivery.'
      },
      {
        title: 'Practical AI & Cloud Synergy',
        desc: 'Democratizing production-grade artificial intelligence and automated workflows to give growing companies an unfair advantage.'
      },
      {
        title: 'Enduring Partnerships',
        desc: 'Cultivating long-term client relationships rooted in complete transparency, proactive advisory, and mutual growth.'
      }
    ]
  },
  values: [
    {
      number: '01',
      title: 'Engineering Precision & Quality',
      desc: 'We adhere to strict architectural standards, clean code principles, and comprehensive security testing. We never cut corners on performance or security.',
      icon: 'ShieldCheck'
    },
    {
      number: '02',
      title: 'Client-Centric Co-Creation',
      desc: 'We don’t treat clients as ticket numbers; we operate as invested technology advisors and an agile extension of your in-house leadership team.',
      icon: 'Users'
    },
    {
      number: '03',
      title: 'Uncompromising Transparency',
      desc: 'Clear milestones, transparent sprint tracking, honest architectural advice, and zero hidden costs or surprise delays from day one.',
      icon: 'CheckCircle2'
    },
    {
      number: '04',
      title: 'Relentless Innovation & Agility',
      desc: 'Constantly mastering next-generation web frameworks, cloud topologies, and AI automation tools to keep our clients ahead of market trends.',
      icon: 'Zap'
    }
  ],
  whyChooseUs: [
    {
      title: 'Full-Lifecycle Engineering',
      desc: 'From technical discovery and UI/UX prototyping to cloud deployment, database architecture, and 24/7 post-launch maintenance.',
      icon: 'Layers'
    },
    {
      title: 'Agile Velocity & Live Demos',
      desc: 'Fast 2-week sprint iterations with interactive staging environments so you can see, test, and provide feedback on actual working software.',
      icon: 'Zap'
    },
    {
      title: 'Enterprise Security & NDA',
      desc: '100% strict Non-Disclosure Agreements, complete client IP ownership, and OWASP-compliant security protocols safeguarding your data.',
      icon: 'Lock'
    },
    {
      title: 'Dedicated SLA & Proactive Support',
      desc: 'Continuous server monitoring, automated backups, security patching, and rapid-response technical teams at your disposal.',
      icon: 'Headphones'
    }
  ]
};

export const technologies = ['PHP', 'PostgreSQL', 'Python', 'REST API', 'Tailwind', 'TypeScript', 'MySQL', 'GraphQL', 'Flutter', 'Angular', 'React Native', 'Java', 'Laravel', 'Bootstrap', 'JavaScript', 'CSS3', 'HTML5', 'Node.js', 'Vue.js'];

export const marqueeServices = [
  {
    id: 'react',
    pillTitle: 'React',
    title: 'React.js Architecture',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/React.webp',
    iconType: 'code',
    description: 'High-performance reactive frontend architectures, component-driven design systems, and fast Next.js SSR web applications.',
    techs: [
      { name: 'Next.js', color: '#000000' },
      { name: 'Redux Toolkit', color: '#764abc' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Vite', color: '#646cff' },
    ],
  },
  {
    id: 'nodejs',
    pillTitle: 'Node.js',
    title: 'Node.js Backend & APIs',
    slug: 'custom-software-development',
    iconImg: '/images/suppliers/Nodejs.webp',
    iconType: 'code',
    description: 'Event-driven, asynchronous backend runtimes for building scalable microservices, REST APIs, and real-time streaming architectures.',
    techs: [
      { name: 'Express.js', color: '#000000' },
      { name: 'NestJS', color: '#ea2845' },
      { name: 'GraphQL', color: '#e10098' },
      { name: 'MongoDB', color: '#47a248' },
    ],
  },
  {
    id: 'angular',
    pillTitle: 'Angular',
    title: 'Angular Enterprise Solutions',
    slug: 'custom-software-development',
    iconImg: '/images/suppliers/Angular.webp',
    iconType: 'code',
    description: 'Robust, enterprise-scale single page applications with type-safe dependency injection, RxJS reactive patterns, and modular architecture.',
    techs: [
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'RxJS', color: '#b7178c' },
      { name: 'NgRx Store', color: '#ba2bd3' },
      { name: 'Material UI', color: '#007acc' },
    ],
  },
  {
    id: 'vue',
    pillTitle: 'Vue.js',
    title: 'Vue.js Progressive Framework',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/vue-js.webp',
    iconType: 'code',
    description: 'Progressive, lightweight and performant frontend development with reactive data-binding, Nuxt 3 rendering, and clean composables.',
    techs: [
      { name: 'Nuxt 3', color: '#00dc82' },
      { name: 'Pinia Store', color: '#ffd859' },
      { name: 'Vite Bundler', color: '#646cff' },
      { name: 'Tailwind CSS', color: '#38bdf8' },
    ],
  },
  {
    id: 'wordpress',
    pillTitle: 'WordPress',
    title: 'WordPress & WooCommerce CMS',
    slug: 'ecommerce-website-development',
    iconImg: '/images/suppliers/Wordpress.webp',
    iconType: 'cart',
    description: 'Bespoke WordPress theme engineering, headless CMS setups, enterprise WooCommerce stores, and high-security maintenance.',
    techs: [
      { name: 'WooCommerce', color: '#7f54b3' },
      { name: 'Custom ACF', color: '#00e5a3' },
      { name: 'Gutenberg Blocks', color: '#21759b' },
      { name: 'REST API', color: '#0087be' },
    ],
  },
  {
    id: 'php',
    pillTitle: 'PHP',
    title: 'PHP & Laravel Development',
    slug: 'custom-software-development',
    iconImg: '/images/suppliers/php.webp',
    iconType: 'code',
    description: 'Secure, battle-tested server architectures, Laravel enterprise web portals, automated job queues, and robust relational database systems.',
    techs: [
      { name: 'Laravel 11', color: '#ff2d20' },
      { name: 'MySQL', color: '#00758f' },
      { name: 'PHP 8.3', color: '#777bb4' },
      { name: 'Composer', color: '#885630' },
    ],
  },
  {
    id: 'javascript',
    pillTitle: 'JavaScript',
    title: 'Modern JavaScript (ES6+)',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/Java-script.webp',
    iconType: 'code',
    description: 'Dynamic interactive client-side scripting, asynchronous browser architectures, DOM performance tuning, and WebSocket integrations.',
    techs: [
      { name: 'ESNext Standard', color: '#f7df1e' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Async/Await', color: '#f7df1e' },
      { name: 'WebSockets', color: '#1385ac' },
    ],
  },
  {
    id: 'html',
    pillTitle: 'HTML5',
    title: 'Semantic HTML5 Architecture',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/Html.webp',
    iconType: 'code',
    description: 'Accessible, W3C-valid, SEO-optimized semantic markup structures ensuring cross-platform browser compliance and top Lighthouse scores.',
    techs: [
      { name: 'Semantic Elements', color: '#e34f26' },
      { name: 'W3C Accessible', color: '#e34f26' },
      { name: 'Schema Markup', color: '#1385ac' },
      { name: 'OpenGraph Tags', color: '#3b5998' },
    ],
  },
  {
    id: 'css',
    pillTitle: 'CSS3',
    title: 'Modern CSS3 Styling',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/CSS.webp',
    iconType: 'design',
    description: 'Advanced CSS Grid, Flexbox, custom keyframe animations, glassmorphic styling, and fluid responsive design systems.',
    techs: [
      { name: 'Flexbox / Grid', color: '#1572b6' },
      { name: 'CSS Variables', color: '#1572b6' },
      { name: 'Keyframe Animations', color: '#1385ac' },
      { name: 'Responsive Media', color: '#334155' },
    ],
  },
  {
    id: 'tailwind',
    pillTitle: 'Tailwind CSS',
    title: 'Tailwind CSS Design Systems',
    slug: 'website-designing-development',
    iconImg: '/images/suppliers/Tailwind-CSS.webp',
    iconType: 'design',
    description: 'Utility-first modern CSS framework enabling bespoke responsive UI systems with zero bloat and lightning-fast page loading speeds.',
    techs: [
      { name: 'JIT Compiler', color: '#38bdf8' },
      { name: 'Custom Tokens', color: '#38bdf8' },
      { name: 'Mobile First', color: '#1385ac' },
      { name: 'Dark Mode Support', color: '#0f172a' },
    ],
  },
];

export const nextGen = {
  eyebrow: 'This is what we will be',
  title: 'A Next-Generation Engineering & Digital Solutions Partner',
  paragraphs: [
    "We are a digital solutions and engineering enterprise focused on helping modern organizations keep pace with rapid digital acceleration. Technology in isolation is never enough; the true catalyst for sustained growth is pairing deep engineering capability with strategic design and a customized understanding of each client's commercial objectives.",
    'From custom enterprise web systems and cloud applications to data-backed performance marketing and AI automations, our core standard remains constant: build solutions that perform reliably under pressure, scale gracefully over time, and continue driving tangible business value long after initial deployment.',
  ],
};

export const testimonials = {
  eyebrow: 'Client Feedback',
  title: 'Hear what our Clients Say',
  text: 'Hear firsthand from our valued clients about the exceptional service, reliable solutions, and impactful results that set us apart. Their success stories reflect our commitment to excellence and long-term partnerships.',
  items: [
    { name: 'Rahul Sharma', role: 'Business Owner', text: 'BER Services understood our requirements perfectly and delivered a modern, professional website. The entire process was smooth and well managed.' },
    { name: 'Amit Verma', role: 'Director', text: 'The team has been very supportive and proactive with our digital marketing. We have seen a noticeable improvement in our online visibility and leads.' },
    { name: 'Neha Gupta', role: 'Founder', text: 'BER Services built our eCommerce website exactly as we needed. The website is easy to manage, user-friendly, and works smoothly across devices.' },
    { name: 'Sanjay Mehta', role: 'Business Owner', text: 'We were looking for a reliable SEO partner and BER Services has been doing a great job. Their approach is professional, transparent, and result-oriented.' },
    { name: 'Vikas Kapoor', role: 'Founder', text: 'From planning to development, the BER team was very responsive and professional. They delivered a clean and user-friendly mobile application.' },
    { name: 'Priya Malhotra', role: 'Entrepreneur', text: 'The creative team did an excellent job with our branding and marketing creatives. They understood our vision and turned it into professional designs.' },
  ],
};

export const news = {
  eyebrow: 'All in One Place',
  title: 'News & Updates',
  text: 'Stay informed with the latest news, updates, and announcements from our team.',
  posts: [
    {
      slug: 'mobile-app-development-ai-ar-future',
      title: 'The Future of Mobile App Development: AI, AR & Smarter User Experiences',
      category: 'Mobile App Development',
      image: images.news[0],
      date: 'October 2026',
      excerpt: 'The concept of a multi-brand system has gained traction, allowing businesses to manage various brands.',
      body: [
        'Mobile apps are moving beyond simple screens and taps. AI-driven personalization, augmented reality and smarter interfaces are changing how customers interact with brands.',
        'Businesses that invest in intelligent, user-first apps today will be better placed to retain customers and grow tomorrow.'
      ]
    },
    {
      slug: 'ecommerce-website-development-trends',
      title: 'eCommerce Website Development: Key Trends for Better Customer Experience',
      category: 'E-Commerce Development',
      image: images.news[1],
      date: 'October 2026',
      excerpt: 'The concept of a multi-brand system has gained traction, allowing businesses to manage various brands.',
      body: [
        'Fast, mobile-first stores with simple checkout, personalized recommendations and secure payments are now the baseline for online shopping.',
        'Focusing on speed, trust and convenience helps stores turn visitors into loyal customers.'
      ]
    },
    {
      slug: 'website-designing-development-ai-2026',
      title: 'How AI Is Changing Website Designing & Development in 2026',
      category: 'Website Designing',
      image: images.news[2],
      date: 'October 2026',
      excerpt: 'The concept of a multi-brand system has gained traction, allowing businesses to manage various brands.',
      body: [
        'AI tools now speed up design, coding, testing and content creation, letting teams ship better websites faster.',
        'Human creativity and strategy remain essential — AI works best as a partner, not a replacement.'
      ]
    },
  ],
};

export const clients = [
  { name: 'VI', logo: '/images/partners/VI.png' },
  { name: 'Upstarts University', logo: '/images/partners/Upstarts-university.png' },
  { name: 'Med-globe', logo: '/images/partners/Med-globe.png' },
  { name: 'Medical Reimpro', logo: '/images/partners/Medical-Reimpro.png' },
  { name: 'PhonePe', logo: '/images/partners/Phone-Pay.png' },
  { name: 'Rajesh Masale', logo: '/images/partners/Rajesh-masale.png' },
  { name: 'Max Healthcare', logo: '/images/partners/Max-Healthcare.png' },
  { name: 'Findi Jury Care', logo: '/images/partners/Findijurycare.png' },
  { name: 'Instant Injury Doctors', logo: '/images/partners/Instantinjurydoctors.png' },
  { name: 'Honda', logo: '/images/partners/Honda.png' },
  { name: 'LG', logo: '/images/partners/LG.png' },
  { name: 'GOLDI', logo: '/images/partners/GOLDI.png' },
];

export const contactSection = {
  eyebrow: 'Get in Touch',
  title: 'Connect with us',
  formTitle: 'We’d love to hear from you!',
  formText: 'Please fill out the form below, and we’ll get back to you as soon as possible.',
};

export const consult = {
  title: 'Book A Free Consultation Now',
  text: 'Have a project in mind? Fill out the form below, and our experts will get back to you to discuss your project requirement.'
};

export const formServices = [
  'Website Designing & Development',
  'eCommerce Website Development',
  'Mobile App Development',
  'Custom Software Development',
  'Digital Marketing',
  'Branding & Graphic Design Services',
  'AI Automation Solutions',
  'Others'
];

export const footerLinks = {
  about: [
    { label: 'About BER', to: '/about-us' },
    { label: 'News and Article', to: '/news-and-article' },
    { label: 'Contact Us', to: '/contact-us' },
    { label: 'FAQ', to: '/faq' }
  ],
  legal: [
    { label: 'Terms & Conditions', to: '/terms-conditions' },
    { label: 'Privacy Policy', to: '/privacy-policy' }
  ],
};

export const faqs = [
  { q: 'What services does BER Services provide?', a: 'We provide website design & development, eCommerce development, mobile apps, custom software, digital marketing, branding & graphic design and AI automation.' },
  { q: 'How long does a website project take?', a: 'A typical business website takes 2–6 weeks depending on pages, features and content readiness.' },
  { q: 'Do you provide support after launch?', a: 'Yes. We offer maintenance and support plans so your website or app stays secure, fast and up to date.' },
  { q: 'Will my website be SEO-friendly and responsive?', a: 'Absolutely. All our websites are built responsive and SEO-ready from day one.' },
  { q: 'How can I get a quote?', a: 'Use the Get Free Consultation button or the contact form and our team will get back to you shortly.' },
];

export const legal = {
  terms: [
    'By accessing and using this website you accept and agree to be bound by these terms.',
    'All content on this website is the property of BER Services PVT. LTD. and may not be reproduced without permission.',
    'Project scope, timelines and payments are governed by the agreement signed for each engagement.',
    'We may update these terms from time to time; continued use means you accept the changes.'
  ],
  privacy: [
    'We collect only the information you submit through our forms, such as name, phone, email and message.',
    'Your information is used to respond to enquiries and improve our services, and is never sold to third parties.',
    'We apply reasonable security measures to protect your data.',
    'You can contact us at any time to request correction or deletion of your information.'
  ],
};
