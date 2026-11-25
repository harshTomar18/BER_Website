import mongoose from 'mongoose';

const TechItemSchema = new mongoose.Schema(
  {
    id: { type: String, default: '', trim: true },
    pillTitle: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    slug: { type: String, default: '', trim: true },
    iconImg: { type: String, default: '', trim: true },
    iconType: { type: String, default: 'code', trim: true },
    description: { type: String, default: '', trim: true },
    techs: [
      {
        name: { type: String, default: '', trim: true },
        color: { type: String, default: '#1385ac', trim: true },
      },
    ],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const TestimonialItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true },
    role: { type: String, default: '', trim: true },
    text: { type: String, default: '', trim: true },
    avatar: { type: String, default: '', trim: true },
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const ClientItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true },
    logo: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const ShowcaseSchema = new mongoose.Schema(
  {
    // 1. Technologies We Work With (TechSlider)
    techSlider: {
      eyebrow: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      items: { type: [TechItemSchema], default: [] },
      isActive: { type: Boolean, default: true },
    },

    // 2. Next-Generation Engineering Vision Statement (NextGen)
    nextGen: {
      eyebrow: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      paragraphs: { type: [String], default: [] },
      isActive: { type: Boolean, default: true },
    },

    // 3. Client Feedback / Testimonials
    testimonials: {
      eyebrow: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      text: { type: String, default: '', trim: true },
      items: { type: [TestimonialItemSchema], default: [] },
      isActive: { type: Boolean, default: true },
    },

    // 4. Our Clients Marquee
    clients: {
      eyebrow: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      text: { type: String, default: '', trim: true },
      items: { type: [ClientItemSchema], default: [] },
      isActive: { type: Boolean, default: true },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Showcase', ShowcaseSchema);
