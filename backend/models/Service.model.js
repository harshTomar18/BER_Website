import mongoose from 'mongoose';

const CapabilitySchema = new mongoose.Schema(
  {
    icon: { type: String, default: 'Layout', trim: true },
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const TechItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true },
    color: { type: String, default: '#1385ac', trim: true },
  },
  { _id: false }
);

const ProcessStepSchema = new mongoose.Schema(
  {
    step: { type: String, default: '01', trim: true },
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const BenefitItemSchema = new mongoose.Schema(
  {
    value: { type: String, default: '', trim: true },
    label: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const GuaranteeItemSchema = new mongoose.Schema(
  {
    icon: { type: String, default: 'ShieldCheck', trim: true },
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const ArchitectureCardSchema = new mongoose.Schema(
  {
    num: { type: String, default: '01', trim: true },
    tag: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
    metric: { type: String, default: '', trim: true },
    hudBadge: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Zap', trim: true },
    image: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const ArchitectureShowcaseSchema = new mongoose.Schema(
  {
    badge: { type: String, default: 'Interactive Architecture Showcase', trim: true },
    title: { type: String, default: '', trim: true },
    tagline: { type: String, default: '', trim: true },
    items: { type: [ArchitectureCardSchema], default: [] },
  },
  { _id: false }
);

const DeliverableModuleSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
    hudTag: { type: String, default: '', trim: true },
    metric: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Layout', trim: true },
    image: { type: String, default: '', trim: true },
    deliverables: { type: [String], default: [] },
  },
  { _id: false }
);

const KeyDeliverablesSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: 'Core Architecture', trim: true },
    title: { type: String, default: 'Explore Key Deliverables & Systems', trim: true },
    subtitle: {
      type: String,
      default: 'Scroll down through the deliverables or select any module to inspect detailed architecture specifications.',
      trim: true,
    },
    items: { type: [DeliverableModuleSchema], default: [] },
  },
  { _id: false }
);

const DeskCardSchema = new mongoose.Schema(
  {
    badge: { type: String, default: 'Chief Architect On Desk', trim: true },
    title: { type: String, default: 'Need Technical Scoping?', trim: true },
    desc: {
      type: String,
      default: 'Speak directly with our senior architecture lead to analyze system requirements and get a detailed quote.',
      trim: true,
    },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    whatsapp: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const FinalCtaSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Ready to architect your solution?', trim: true },
    desc: {
      type: String,
      default: 'Book a confidential discovery session with our senior technology team.',
      trim: true,
    },
    buttonText: { type: String, default: 'Get Free Consultation', trim: true },
  },
  { _id: false }
);

const HeaderMetaSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    eyebrow: {
      type: String,
      default: 'Enterprise Service Overview',
      trim: true,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    short: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    heroImage: {
      type: String,
      default: '',
      trim: true,
    },
    galleryImage: {
      type: String,
      default: '',
      trim: true,
    },
    galleryLabel: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    overview: {
      type: [String],
      default: [],
    },
    long: {
      type: String,
      default: '',
      trim: true,
    },

    // 1. Interactive Architecture Showcase (PinnedScrollScrub)
    architectureShowcase: {
      type: ArchitectureShowcaseSchema,
      default: () => ({}),
    },

    // 2. Core Architecture & Key Deliverables (PinnedImageSwap)
    keyDeliverables: {
      type: KeyDeliverablesSchema,
      default: () => ({}),
    },

    // 3. Technologies & Frameworks
    techStackHeader: {
      type: HeaderMetaSchema,
      default: () => ({
        eyebrow: 'Battle-Tested Stack',
        title: 'Technologies & Frameworks',
        subtitle: 'Modern, high-performance tools selected for fault-tolerant scalability and long-term security.',
      }),
    },
    techStack: {
      type: [TechItemSchema],
      default: [],
    },

    // 4. Agile Delivery Process
    processHeader: {
      type: HeaderMetaSchema,
      default: () => ({
        eyebrow: 'Execution Roadmap',
        title: 'Our 4-Step Agile Delivery Process',
        subtitle: 'Transparent sprint iterations with continuous staging reviews and zero surprise delays.',
      }),
    },
    process: {
      type: [ProcessStepSchema],
      default: [],
    },

    // 5. Measurable Outcomes (ROI)
    benefitsHeader: {
      type: HeaderMetaSchema,
      default: () => ({
        eyebrow: 'Measurable ROI',
        title: 'Target Commercial Outcomes',
        subtitle: 'Concrete performance metrics and business impact we target for every deployment.',
      }),
    },
    benefits: {
      type: [BenefitItemSchema],
      default: [],
    },

    // 6. Guarantees & Trust
    guarantees: {
      type: [GuaranteeItemSchema],
      default: () => [
        {
          icon: 'ShieldCheck',
          title: '100% NDA Protection',
          desc: 'Strict non-disclosure agreements with complete client source code and intellectual property ownership.',
        },
        {
          icon: 'Clock',
          title: '24h Scoping Turnaround',
          desc: 'Fast architectural review and comprehensive milestone estimation delivered within 24 business hours.',
        },
        {
          icon: 'Lock',
          title: 'OWASP Bank-Grade Security',
          desc: 'Rigorous input sanitization, automated DDoS mitigation, and SSL encryption preventing vulnerabilities.',
        },
        {
          icon: 'Award',
          title: 'Dedicated SLA Support',
          desc: 'Continuous uptime monitoring, security patching, and responsive post-launch engineering support.',
        },
      ],
    },

    // 7. Desk Card & Direct Contact
    deskCard: {
      type: DeskCardSchema,
      default: () => ({}),
    },

    // 8. Final CTA
    finalCta: {
      type: FinalCtaSchema,
      default: () => ({}),
    },

    capabilities: {
      type: [CapabilitySchema],
      default: [],
    },
    points: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Service', ServiceSchema);
