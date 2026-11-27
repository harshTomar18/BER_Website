/**
 * BER Services - Enterprise Portfolio & Case Studies Dataset
 * Real-world commercial digital solutions engineered by BER Services PVT. LTD.
 */

export const portfolioCategories = [
  { id: 'all', label: 'All Projects', count: 8 },
  { id: 'web', label: 'Web Architecture', count: 2 },
  { id: 'ecommerce', label: 'eCommerce Platforms', count: 2 },
  { id: 'mobile', label: 'Mobile Apps', count: 1 },
  { id: 'software', label: 'Custom Enterprise Software', count: 1 },
  { id: 'ai', label: 'AI & Automation', count: 1 },
  { id: 'marketing', label: 'Digital Marketing & SEO', count: 1 }
];

export const portfolioStats = [
  { value: '500+', label: 'Commercial Projects Delivered', sub: 'Across 14+ Global Verticals' },
  { value: '99.98%', label: 'Platform Reliability & Uptime', sub: 'OWASP Bank-Grade Security' },
  { value: '3.4x', label: 'Average Client ROI & Conversion', sub: 'Measurable Commercial Impact' }
];

export const portfolioProjects = [
  {
    id: 'nexus-cloud-erp',
    slug: 'nexus-enterprise-cloud-erp',
    title: 'Nexus Enterprise Cloud ERP & Operational Suite',
    category: 'software',
    categoryLabel: 'Custom Enterprise Software',
    client: 'Nexus Logistics Global',
    industry: 'Supply Chain & Freight Logistics',
    featured: true,
    tagline: 'High-Throughput Cloud Resource Management System Handling 1.2M+ Monthly Shipments.',
    overview: 'Engineered an end-to-end cloud ERP unifying warehousing, freight documentation, automated driver dispatching, and automated GST billing into a single sub-second dashboard.',
    challenge: 'The client was losing 200+ hours monthly due to fragmented legacy databases, manual dispatch dispatching spreadsheets, and catastrophic peak-hour system timeouts.',
    solution: 'BER Services architected an event-driven microservices ERP on Node.js and PostgreSQL with real-time WebSocket sync, role-based multi-tier RBAC, and automated invoice reconciliation.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=85',
    metrics: [
      { value: '99.99%', label: 'System Uptime' },
      { value: '<250ms', label: 'Dashboard Latency' },
      { value: '78%', label: 'Manual Work Cut' }
    ],
    techStack: [
      { name: 'Node.js', color: '#339933' },
      { name: 'React 18', color: '#61dafb' },
      { name: 'PostgreSQL', color: '#336791' },
      { name: 'Redis Cache', color: '#dc382d' },
      { name: 'Docker', color: '#2496ed' },
      { name: 'AWS Cloud', color: '#ff9900' }
    ],
    deliverables: [
      'Event-driven logistics dispatch microservices engine',
      'Automated e-Way bill & GST invoicing pipelines',
      'Real-time GPS vehicle tracking & route optimization',
      'End-to-end audit logs with OWASP Level-3 encryption'
    ],
    testimonial: {
      quote: 'BER Services transformed our chaotic logistics operation into a sleek, automated digital machine. Reliability under heavy shipping volume has been 100% flawless.',
      author: 'Vikram Singhania',
      role: 'Chief Operating Officer, Nexus Global'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'luxe-fashion-store',
    slug: 'luxe-couture-headless-ecommerce',
    title: 'Luxe Couture Headless Omnichannel eCommerce',
    category: 'ecommerce',
    categoryLabel: 'eCommerce Platforms',
    client: 'Luxe Apparel Inc.',
    industry: 'Luxury Fashion & Direct-to-Consumer',
    featured: true,
    tagline: 'Sub-Second Next.js Headless Storefront Delivering 185% YoY Mobile Sales Acceleration.',
    overview: 'A hyper-fast international storefront integrating custom 3D garment lookbooks, multi-currency checkout, and bi-directional Shopify Plus inventory automation.',
    challenge: 'A slow legacy monolithic theme caused 65% mobile drop-offs during flash drops and peak festival discount campaigns, with average load times exceeding 5.4 seconds.',
    solution: 'Designed an ultra-responsive headless frontend on Next.js 14 and Tailwind, hooked into Shopify GraphQL APIs with global edge caching across 280+ Cloudflare PoPs.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=85',
    metrics: [
      { value: '+185%', label: 'Mobile Revenue' },
      { value: '0.4s', label: 'Average FCP Speed' },
      { value: '4.8★', label: 'Client Satisfaction' }
    ],
    techStack: [
      { name: 'Next.js 14', color: '#000000' },
      { name: 'Shopify Plus', color: '#96bf48' },
      { name: 'Tailwind CSS', color: '#06b6d4' },
      { name: 'Stripe Global', color: '#635bff' },
      { name: 'Cloudflare Edge', color: '#f38020' }
    ],
    deliverables: [
      'Sub-400ms global edge-rendered product pages',
      'Personalized AI cross-sell and dynamic cart recommendation',
      'Multi-currency payment gateway routing with fraud shield',
      'Interactive 3D garment sizing & fabric zoom showcase'
    ],
    testimonial: {
      quote: 'Our conversion rates doubled in the first 45 days post-launch. The speed and visual elegance engineered by BER is unmatched.',
      author: 'Pooja Kashyap',
      role: 'Head of eCommerce, Luxe Apparel'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'fintech-neo-app',
    slug: 'zenith-wealth-mobile-app',
    title: 'Zenith Wealth Cross-Platform Financial Mobile Suite',
    category: 'mobile',
    categoryLabel: 'Mobile Applications',
    client: 'Zenith Capital Advisors',
    industry: 'FinTech & Wealth Management',
    featured: false,
    tagline: 'Biometric-Secured Investment & Portfolio Tracker Supporting 50K+ Active Investors.',
    overview: 'A high-performance iOS and Android app providing real-time stock quotes, automated mutual fund SIP investments, and biometric facial authentication.',
    challenge: 'The client needed bank-level data encryption and low-latency financial chart updates on low-bandwidth 4G networks without UI stutter.',
    solution: 'Built with Flutter 3 and Go backend microservices, featuring local SQLite offline caching and WebSockets for real-time portfolio valuation updates.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1400&q=85',
    metrics: [
      { value: '50K+', label: 'Active App Users' },
      { value: '99.9%', label: 'Transaction Success' },
      { value: '<100ms', label: 'Quote Stream Speed' }
    ],
    techStack: [
      { name: 'Flutter 3', color: '#02569b' },
      { name: 'Go Microservices', color: '#00add8' },
      { name: 'PostgreSQL', color: '#336791' },
      { name: 'Kafka Streams', color: '#231f20' }
    ],
    deliverables: [
      'Native 60 FPS interactive portfolio analytics charts',
      'Hardware-level FaceID & Fingerprint biometric security',
      'Automated KYC onboarding with instant Aadhaar verification',
      'Encrypted automated push notifications & portfolio alerts'
    ],
    testimonial: {
      quote: 'Flawless execution from wireframes to Google Play and Apple App Store approvals. Investor retention has skyrocketed.',
      author: 'Rajeev Malhotra',
      role: 'Managing Director, Zenith Wealth'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'aurora-ai-support',
    slug: 'aurora-ai-autonomous-support',
    title: 'Aurora Autonomous Enterprise RAG & Support Agent',
    category: 'ai',
    categoryLabel: 'AI & Automation',
    client: 'HealthShield InsureTech',
    industry: 'Healthcare Insurance & Claims',
    featured: false,
    tagline: 'Private Enterprise LLM Agent Deflecting 82% of Repetitive Insurance Claims Queries.',
    overview: 'An intelligent AI customer agent trained securely on 1,500+ private policy documents and medical claims SOPs, delivering instant human-like claim resolution.',
    challenge: 'Call centers were overwhelmed with 8,000+ daily repetitive queries about policy exclusions and hospital network lists, causing 45-minute customer wait times.',
    solution: 'Engineered a Retrieval-Augmented Generation (RAG) agent utilizing Claude 3.5 Sonnet and Pinecone vector database with strict zero-data-retention guardrails.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1400&q=85',
    metrics: [
      { value: '82%', label: 'Ticket Deflection' },
      { value: '<2.5s', label: 'Average Response Time' },
      { value: '100%', label: 'Private Data Security' }
    ],
    techStack: [
      { name: 'Anthropic Claude', color: '#d97757' },
      { name: 'Pinecone Vector', color: '#000000' },
      { name: 'FastAPI Python', color: '#05998b' },
      { name: 'LangChain', color: '#00d2ff' }
    ],
    deliverables: [
      'Multi-lingual WhatsApp & Web chat support agent',
      'OCR-based medical bill and invoice data parser',
      'Automated CRM ticket sync and sentiment classification',
      'Zero-data-retention corporate security isolation'
    ],
    testimonial: {
      quote: 'Wait times fell from 45 minutes to 2 seconds. The AI answers policy nuances more accurately than our junior claim analysts.',
      author: 'Dr. Sameer Sen',
      role: 'Chief Medical Officer, HealthShield'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'apex-health-portal',
    slug: 'apex-healthcare-web-platform',
    title: 'Apex Multi-Hospital Patient & Telehealth Portal',
    category: 'web',
    categoryLabel: 'Web Architecture',
    client: 'Apex Healthcare Network',
    industry: 'Hospitality & Clinical Care',
    featured: false,
    tagline: 'HIPAA-Compliant Web Architecture Serving 12 Hospitals and 250+ Speciality Doctors.',
    overview: 'A patient booking and medical record portal enabling teleconsultations, instant lab report downloads, and multi-branch doctor scheduling.',
    challenge: 'Patients suffered frequent booking double-allocations and frustrating phone queues due to disconnected hospital clinic databases.',
    solution: 'Developed an integrated React web application with automated SMS/WhatsApp appointment reminders and real-time doctor availability calendars.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85',
    metrics: [
      { value: '250K+', label: 'Monthly Appointments' },
      { value: '100%', label: 'HIPAA Standard Security' },
      { value: '4.9★', label: 'Patient Experience Score' }
    ],
    techStack: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Node.js', color: '#339933' },
      { name: 'MongoDB Atlas', color: '#47a248' },
      { name: 'WebRTC Video', color: '#333333' }
    ],
    deliverables: [
      'Telehealth video consultations via encrypted WebRTC',
      'Automated doctor slot booking & cancellation engine',
      'Instant encrypted PDF diagnostic report repository',
      'Role-based doctor, nurse, and admin permission portals'
    ],
    testimonial: {
      quote: 'Patient bookings increased by 140% while reception call workload plummeted. BER Services executed our clinical vision with precision.',
      author: 'Ananya Roy',
      role: 'Director of Operations, Apex Health'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'organica-brand-growth',
    slug: 'organica-digital-seo-marketing',
    title: 'Organica D2C Organic Search Domination & Performance Engine',
    category: 'marketing',
    categoryLabel: 'Digital Marketing & SEO',
    client: 'Organica Wellness Foods',
    industry: 'Consumer Goods & Organic Foods',
    featured: false,
    tagline: '420% Organic Search Traffic Growth and 3.8x Meta Performance ROAS in 6 Months.',
    overview: 'A data-driven technical SEO architecture paired with high-converting programmatic Meta & Google Ads campaigns for an organic wellness D2C brand.',
    challenge: 'Stagnant keyword rankings on page 4 of Google and skyrocketing Customer Acquisition Costs (CAC) from unoptimized paid ad campaigns.',
    solution: 'Audited technical schema markup, restructured programmatic collection silos, and launched localized hyper-targeted performance creative funnels.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    metrics: [
      { value: '+420%', label: 'Organic Search Traffic' },
      { value: '3.8x', label: 'Blended Ad ROAS' },
      { value: '#1', label: 'Rankings on 45+ Core Keywords' }
    ],
    techStack: [
      { name: 'Google Ads', color: '#4285f4' },
      { name: 'Meta Business Suite', color: '#0668e1' },
      { name: 'SEMrush Enterprise', color: '#ff642d' },
      { name: 'Google Analytics 4', color: '#f9ab00' }
    ],
    deliverables: [
      'Comprehensive Core Web Vitals technical SEO overhaul',
      'Intent-based programmatic high-volume keyword silos',
      'Dynamic product retargeting & lookalike audience funnels',
      'Real-time automated Google Looker Studio client dashboard'
    ],
    testimonial: {
      quote: 'Our brand went from obscurity to dominating Google search for all our primary wellness categories. BER is our growth engine.',
      author: 'Karan Mehra',
      role: 'Founder & CEO, Organica'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'velocity-saas-website',
    slug: 'velocity-developer-saas-platform',
    title: 'Velocity Developer Platform & Cloud Documentation',
    category: 'web',
    categoryLabel: 'Web Architecture',
    client: 'Velocity Cloud Labs',
    industry: 'Developer Tools & SaaS',
    featured: false,
    tagline: 'Interactive 60 FPS Developer Hub with Interactive API Playgrounds and Code Sandboxes.',
    overview: 'Engineered a dark-mode developer experience platform featuring real-time syntax highlighted API consoles, multi-SDK tabs, and sub-second documentation search.',
    challenge: 'Developer onboarding drop-off was 48% due to sluggish, confusing documentation and poor code sample presentation.',
    solution: 'Built an MDX-driven static-generated documentation suite with instantaneous Algolia search and live browser API test run environments.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85',
    metrics: [
      { value: '<150ms', label: 'Instant Search Latency' },
      { value: '+92%', label: 'Developer Signups' },
      { value: '100/100', label: 'Google Lighthouse Score' }
    ],
    techStack: [
      { name: 'Next.js 14', color: '#000000' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Algolia Search', color: '#5468ff' },
      { name: 'Tailwind CSS', color: '#06b6d4' }
    ],
    deliverables: [
      'Interactive TypeScript & Python code sandbox runner',
      'Instantaneous client-side Algolia documentation search',
      'Dark/Light theme switching with zero layout flash',
      'GitHub pull-request driven automated doc preview deployment'
    ],
    testimonial: {
      quote: 'Engineers love using our documentation. Our signup conversion rate doubled within three weeks of launch.',
      author: 'David Chen',
      role: 'VP of Product, Velocity Labs'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'artisan-crafts-b2b',
    slug: 'artisan-global-b2b-wholesale',
    title: 'Artisan Global Export & B2B Wholesale Marketplace',
    category: 'ecommerce',
    categoryLabel: 'eCommerce Platforms',
    client: 'Artisan Heritage Exports',
    industry: 'Handicrafts & B2B Global Trade',
    featured: false,
    tagline: 'B2B Wholesale eCommerce with Tiered Volume Pricing and Custom Quote Generators.',
    overview: 'A specialized wholesale platform designed for overseas buyers featuring minimum order quantity (MOQ) logic, custom shipping container calculations, and RFQ workflows.',
    challenge: 'B2B international buyers were burdened by manual email back-and-forth for container volume calculations and trade quotes.',
    solution: 'Designed an enterprise B2B portal with live container load calculators, dynamic bulk tiered pricing tiers, and automated multi-currency proforma invoicing.',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=85',
    metrics: [
      { value: '+260%', label: 'International Inquiries' },
      { value: '60%', label: 'Faster Quote Turnaround' },
      { value: '$4.2M+', label: 'Wholesale GMV Processed' }
    ],
    techStack: [
      { name: 'Shopify Plus B2B', color: '#96bf48' },
      { name: 'React 18', color: '#61dafb' },
      { name: 'Node.js', color: '#339933' },
      { name: 'GraphQL', color: '#e10098' }
    ],
    deliverables: [
      'Live sea freight container volume fill calculator',
      'Automated digital Request for Quotation (RFQ) pipelines',
      'Custom B2B buyer accounts with approved credit terms',
      'Automated proforma and commercial export invoice generation'
    ],
    testimonial: {
      quote: 'Our European and US buyers can now configure bulk orders in minutes. It completely revolutionized our export business.',
      author: 'Sunil Aggarwal',
      role: 'Managing Director, Artisan Heritage'
    },
    liveUrl: 'https://thebermedia.com/'
  }
];
