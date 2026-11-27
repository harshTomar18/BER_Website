/**
 * BER Services - Enterprise Portfolio & Work Showcase Dataset
 * Inspired by premium agency showcase layouts (DigiStreet style)
 * Custom branded with BER Services (#20285b Navy, #1385ac Teal, #16a1ce Electric Cyan)
 */

export const portfolioCategories = [
  { id: 'all', label: 'All Projects', count: 12 },
  { id: 'web', label: 'Websites & Portals', count: 3 },
  { id: 'software', label: 'B2B & Enterprise Software', count: 2 },
  { id: 'ecommerce', label: 'eCommerce Stores', count: 2 },
  { id: 'mobile', label: 'Mobile Applications', count: 2 },
  { id: 'ai', label: 'AI & Automation', count: 2 },
  { id: 'marketing', label: 'Digital Marketing & SEO', count: 1 }
];

export const portfolioStats = [
  { value: '500+', label: 'Commercial Projects Delivered', sub: 'Across 14+ Global Verticals' },
  { value: '99.98%', label: 'Platform Reliability & Uptime', sub: 'OWASP Bank-Grade Security' },
  { value: '3.4x', label: 'Average Client ROI & Conversion', sub: 'Measurable Commercial Impact' },
  { value: '100%', label: 'On-Time Milestone Delivery', sub: 'Agile Two-Week Sprints' }
];

export const portfolioProjects = [
  {
    id: 'nexus-cloud-erp',
    slug: 'nexus-enterprise-cloud-erp',
    title: 'Nexus Enterprise Cloud ERP & Operational Suite',
    category: 'software',
    categoryLabel: 'B2B Enterprise Software',
    client: 'Nexus Logistics Global',
    industry: 'Freight & Supply Chain Logistics',
    featured: true,
    tagline: 'High-Throughput Cloud Resource Management System Handling 1.2M+ Monthly Shipments.',
    overview: 'Engineered an end-to-end cloud ERP unifying warehousing, freight documentation, automated driver dispatching, and automated GST billing into a single sub-second dashboard.',
    challenge: 'The client was losing 200+ hours monthly due to fragmented legacy databases, manual dispatch dispatching spreadsheets, and catastrophic peak-hour system timeouts.',
    solution: 'BER Services architected an event-driven microservices ERP on Node.js and PostgreSQL with real-time WebSocket sync, role-based multi-tier RBAC, and automated invoice reconciliation.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=75',
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
    title: 'Luxe Couture Headless Omnichannel eCommerce Flagship',
    category: 'ecommerce',
    categoryLabel: 'eCommerce Stores',
    client: 'Luxe Apparel Inc.',
    industry: 'Direct-to-Consumer Fashion',
    featured: true,
    tagline: 'Sub-Second Next.js Headless Storefront Delivering 185% YoY Mobile Sales Acceleration.',
    overview: 'A hyper-fast international storefront integrating custom 3D garment lookbooks, multi-currency checkout, and bi-directional Shopify Plus inventory automation.',
    challenge: 'A slow legacy monolithic theme caused 65% mobile drop-offs during flash drops and peak festival discount campaigns, with average load times exceeding 5.4 seconds.',
    solution: 'Designed an ultra-responsive headless frontend on Next.js 14 and Tailwind, hooked into Shopify GraphQL APIs with global edge caching across 280+ Cloudflare PoPs.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=75',
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
    id: 'videonetics-ai-vision',
    slug: 'videonetics-ai-video-analytics',
    title: 'Videonetics AI Video Computing & Security Architecture',
    category: 'web',
    categoryLabel: 'Websites & Portals',
    client: 'Videonetics Technologies',
    industry: 'AI Video Computing & Smart Cities',
    featured: true,
    tagline: 'Enterprise Showcase & Interactive Solution Matrix for AI Visual Intelligence.',
    overview: 'Engineered an interactive product suite showcase presenting automated traffic management, facial recognition, and industrial surveillance computing across 80+ cities.',
    challenge: 'Complex technical specifications and deep product matrices were difficult for global government and enterprise buyers to evaluate through standard PDFs.',
    solution: 'Built an immersive interactive 3D WebGL product explorer, dynamic ROI calculators, and a searchable technical whitepaper repository with sub-second page transitions.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '80+ Cities', label: 'Deployed Scale' },
      { value: '+210%', label: 'Enterprise Inquiries' },
      { value: '0.5s', label: 'Page Load Speed' }
    ],
    techStack: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Three.js / WebGL', color: '#000000' },
      { name: 'Node.js', color: '#339933' },
      { name: 'Tailwind CSS', color: '#06b6d4' }
    ],
    deliverables: [
      'Interactive 3D visual intelligence capability map',
      'Enterprise government compliance certification portal',
      'Multi-lingual localization support (English, Arabic, Spanish)',
      'Sub-second Core Web Vitals optimization'
    ],
    testimonial: {
      quote: 'BER Services captured the high-tech essence of our AI platforms with breathtaking digital execution.',
      author: 'Avinash Trivedi',
      role: 'VP Marketing, Videonetics'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'metso-industrial-portal',
    slug: 'metso-industrial-b2b-portal',
    title: 'Metso Heavy Machinery & Mineral Processing Portal',
    category: 'software',
    categoryLabel: 'B2B Enterprise Software',
    client: 'Metso Industrial Solutions',
    industry: 'Heavy Machinery & Mining Tech',
    featured: false,
    tagline: 'Integrated B2B Equipment Catalog & Telemetric Maintenance Portal.',
    overview: 'A digital engineering hub connecting mineral processing plants with real-time equipment telemetrics, spare parts order routing, and digital operating manuals.',
    challenge: 'Plant managers faced extensive downtime ordering replacement crusher parts through legacy telephone and fragmented fax communication systems.',
    solution: 'Engineered an integrated B2B customer self-service portal with serial-number lookup, 3D exploded parts diagrams, and automated logistics order routing.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '-65%', label: 'Parts Order Time' },
      { value: '10,000+', label: 'SKU Parts Catalog' },
      { value: '99.9%', label: 'Portal Uptime' }
    ],
    techStack: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Node.js / Express', color: '#339933' },
      { name: 'SAP ERP Integration', color: '#008fd3' },
      { name: 'PostgreSQL', color: '#336791' }
    ],
    deliverables: [
      'Interactive 3D exploded parts identification interface',
      'Real-time SAP ERP bi-directional stock sync',
      'Automated warranty and field service ticket routing',
      'Offline-capable PWA for remote quarry workers'
    ],
    testimonial: {
      quote: 'Parts dispatch accuracy rose to 99.4% in the first quarter. This portal revolutionized our customer service operations.',
      author: 'Marcus Lindholm',
      role: 'Director of Digital Services, Metso'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'jbm-electric-mobility',
    slug: 'jbm-green-transit-platform',
    title: 'JBM Buses Clean Transit Operations & Telematics Platform',
    category: 'mobile',
    categoryLabel: 'Mobile Applications',
    client: 'JBM Electric Vehicles',
    industry: 'Automotive & Clean Energy Transit',
    featured: true,
    tagline: 'Real-Time EV Fleet Telematics & Depot Charging Orchestration App.',
    overview: 'A cross-platform mobile ecosystem monitoring 1,500+ electric municipal buses with battery state-of-health tracking, depot fast-charging schedules, and driver telemetry.',
    challenge: 'Depots were suffering peak grid power surcharges and unpredictable vehicle battery degradation due to manual charging schedules.',
    solution: 'Developed an intelligent Flutter app backed by Go microservices and IoT MQTT streams calculating optimal vehicle charge cycles and route allocations.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '1,500+ Buses', label: 'Active Fleet Tracked' },
      { value: '-32%', label: 'Depot Energy Bills' },
      { value: '100ms', label: 'IoT Stream Frequency' }
    ],
    techStack: [
      { name: 'Flutter 3', color: '#02569b' },
      { name: 'Go Microservices', color: '#00add8' },
      { name: 'MQTT / IoT', color: '#660066' },
      { name: 'TimescaleDB', color: '#fdb515' }
    ],
    deliverables: [
      'Native iOS & Android depot supervisor dashboards',
      'Automated time-of-day charging grid optimization',
      'Driver regenerative braking telemetry analysis',
      'Predictive thermal anomaly and cell health alerts'
    ],
    testimonial: {
      quote: 'BER Services delivered a rock-solid fleet telematics solution that saved millions in grid electricity costs.',
      author: 'Nishant Arya',
      role: 'Executive Director, JBM Group'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'fintech-neo-app',
    slug: 'zenith-wealth-mobile-app',
    title: 'Zenith Wealth Biometric Financial Investment App',
    category: 'mobile',
    categoryLabel: 'Mobile Applications',
    client: 'Zenith Capital Advisors',
    industry: 'FinTech & Wealth Management',
    featured: false,
    tagline: 'Biometric-Secured Investment & Portfolio Tracker Supporting 50K+ Active Investors.',
    overview: 'A high-performance iOS and Android app providing real-time stock quotes, automated mutual fund SIP investments, and biometric facial authentication.',
    challenge: 'The client needed bank-level data encryption and low-latency financial chart updates on low-bandwidth 4G networks without UI stutter.',
    solution: 'Built with Flutter 3 and Go backend microservices, featuring local SQLite offline caching and WebSockets for real-time portfolio valuation updates.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=75',
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
    featured: true,
    tagline: 'Private Enterprise LLM Agent Deflecting 82% of Repetitive Insurance Claims Queries.',
    overview: 'An intelligent AI customer agent trained securely on 1,500+ private policy documents and medical claims SOPs, delivering instant human-like claim resolution.',
    challenge: 'Call centers were overwhelmed with 8,000+ daily repetitive queries about policy exclusions and hospital network lists, causing 45-minute customer wait times.',
    solution: 'Engineered a Retrieval-Augmented Generation (RAG) agent utilizing Claude 3.5 Sonnet and Pinecone vector database with strict zero-data-retention guardrails.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=75',
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
    id: 'ai-lead-automation',
    slug: 'agentic-b2b-lead-pipeline',
    title: 'Agentic B2B Lead Enrichment & Outreach Engine',
    category: 'ai',
    categoryLabel: 'AI & Automation',
    client: 'Apex Scale Ventures',
    industry: 'Venture Capital & SaaS Accelerators',
    featured: false,
    tagline: 'Autonomous AI Agent Scrapes, Validates, and Personalizes 5,000+ Weekly Enterprise Leads.',
    overview: 'A serverless autonomous workflow extracting executive signals from LinkedIn and news publications to compose hyper-personalized cold outreach emails.',
    challenge: 'Sales development reps spent 70% of their working hours manually copy-pasting data into HubSpot and writing generic outreach drafts.',
    solution: 'Architected an automated agentic pipeline utilizing LangGraph, OpenAI GPT-4o, and Hunter APIs connected directly to HubSpot CRM via webhooks.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '4.2x', label: 'Outbound Reply Rate' },
      { value: '35 hrs', label: 'SDR Weekly Hours Saved' },
      { value: '100%', label: 'Automated CRM Sync' }
    ],
    techStack: [
      { name: 'OpenAI GPT-4o', color: '#10a37f' },
      { name: 'LangGraph Python', color: '#00d2ff' },
      { name: 'HubSpot API', color: '#ff7a59' },
      { name: 'AWS Lambda', color: '#ff9900' }
    ],
    deliverables: [
      'Autonomous lead scraping and email verification mesh',
      'Company trigger signal detection (fundraising, hiring, tech stack)',
      'Automated personalized ice-breaker drafting',
      'Bi-directional HubSpot contact and deal pipeline creation'
    ],
    testimonial: {
      quote: 'Our sales pipeline quadrupled in 90 days. The level of personalization achieved by BER’s AI workflows is extraordinary.',
      author: 'Karan Singhal',
      role: 'Partner, Apex Scale'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'aurum-luxury-realty',
    slug: 'aurum-alumni-luxury-realty',
    title: 'Aurum Alumni High-End Residential Property Platform',
    category: 'web',
    categoryLabel: 'Websites & Portals',
    client: 'Aurum Real Estate Group',
    industry: 'Luxury Residential & Commercial Realty',
    featured: true,
    tagline: 'Immersive Architectural Experience with Virtual 360° Penthouse Walkthroughs.',
    overview: 'An ultra-luxury real estate web flagship featuring interactive floor plans, neighborhood lifestyle maps, and an instant VIP private showing booking calendar.',
    challenge: 'High-net-worth buyers from London, Dubai, and Singapore demanded realistic digital walkthroughs of off-plan penthouses without downloading heavy apps.',
    solution: 'Engineered an ultra-fast WebGL 360° virtual tour player directly in the browser, complete with real-time currency converters and WhatsApp private banker concierge.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '₹140 Cr', label: 'Digital Property Sales' },
      { value: '3.2 min', label: 'Avg Session Duration' },
      { value: '0.4s', label: 'First Contentful Paint' }
    ],
    techStack: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Three.js / WebGL', color: '#000000' },
      { name: 'GSAP Animations', color: '#88ce02' },
      { name: 'Cloudflare CDN', color: '#f38020' }
    ],
    deliverables: [
      'Interactive 360° virtual walkthrough engine',
      'Multi-currency property EMI & tax calculation matrix',
      'Direct WhatsApp VIP sales concierge routing',
      'Sub-second mobile responsive performance'
    ],
    testimonial: {
      quote: 'The website closed multiple 8-figure penthouse sales from international buyers before construction was even finished.',
      author: 'Siddharth Varma',
      role: 'Managing Director, Aurum Group'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'amity-global-admissions',
    slug: 'amity-university-admissions-portal',
    title: 'Amity Global Student Admissions & Program Discovery Portal',
    category: 'web',
    categoryLabel: 'Websites & Portals',
    client: 'Amity University Global',
    industry: 'Higher Education & Academia',
    featured: false,
    tagline: 'Streamlined Course Discovery & Global Application Engine Handling 500K+ Annual Applicants.',
    overview: 'A student-centric admissions web architecture guiding prospective applicants through scholarship eligibility calculators, campus virtual tours, and fee payments.',
    challenge: 'Legacy forms resulted in high application drop-offs and administrative bottlenecks during annual exam result announcements.',
    solution: 'Built a modular multi-step application funnel with auto-saving drafts, digital document verification, and instant fee gateway integration.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '500K+', label: 'Annual Applicants' },
      { value: '-45%', label: 'Application Drop-off' },
      { value: '100%', label: 'Mobile Compliance' }
    ],
    techStack: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Node.js', color: '#339933' },
      { name: 'PostgreSQL', color: '#336791' },
      { name: 'Razorpay / Stripe', color: '#528ff0' }
    ],
    deliverables: [
      'Multi-step auto-saving student admissions pipeline',
      'Smart scholarship eligibility assessment engine',
      'Automated WhatsApp & SMS admission status updates',
      'Instant digital offer letter generation'
    ],
    testimonial: {
      quote: 'Application completion rates jumped by 45%. The experience for students and parents has been smooth and modern.',
      author: 'Dr. Meenakshi Sharma',
      role: 'Dean of Admissions, Amity Global'
    },
    liveUrl: 'https://thebermedia.com/'
  },
  {
    id: 'shivalik-fintech-bank',
    slug: 'shivalik-digital-banking-storefront',
    title: 'Shivalik Digital Banking & MSME Financial Platform',
    category: 'ecommerce',
    categoryLabel: 'eCommerce Stores',
    client: 'Shivalik Bank',
    industry: 'Banking & Financial Technology',
    featured: false,
    tagline: 'Instant Account Opening & Paperless MSME Loan Origination Portal.',
    overview: 'A digital banking platform providing instant video-KYC account opening, paperless credit checks for small business owners, and fixed deposit booking in under 3 minutes.',
    challenge: 'Traditional branch-based account opening required 3 to 5 business days, limiting customer acquisition among digitally savvy millennial entrepreneurs.',
    solution: 'Designed a compliant digital onboarding architecture with Aadhaar e-Sign, automated CIBIL score checks, and instant UPI mandate integration.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=75',
    metrics: [
      { value: '<3 Min', label: 'Account Opening Time' },
      { value: '₹350 Cr+', label: 'Digital Deposits' },
      { value: 'RBI Ready', label: 'Bank-Grade Security' }
    ],
    techStack: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Go Backend', color: '#00add8' },
      { name: 'Docker / K8s', color: '#2496ed' },
      { name: 'Redis', color: '#dc382d' }
    ],
    deliverables: [
      'Paperless Video-KYC verification pipeline',
      'Instant UPI and NetBanking payment authorization',
      'Real-time automated credit underwriting engine',
      'Comprehensive audit logging conforming to RBI guidelines'
    ],
    testimonial: {
      quote: 'Digital account opening transformed from a 4-day ordeal to a 3-minute delight. BER’s financial engineering is world-class.',
      author: 'Harpreet Singh',
      role: 'Chief Digital Officer, Shivalik'
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
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=75',
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
      author: 'Rohit Bansal',
      role: 'Founder & CEO, Organica Foods'
    },
    liveUrl: 'https://thebermedia.com/'
  }
];
