import mongoose from 'mongoose';

const StatItemSchema = new mongoose.Schema(
  {
    n: { type: String, default: '', trim: true },
    l: { type: String, default: '', trim: true },
    icon: { type: String, default: 'code', trim: true },
  },
  { _id: false }
);

const PillarItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const ValueItemSchema = new mongoose.Schema(
  {
    number: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
    icon: { type: String, default: 'ShieldCheck', trim: true },
  },
  { _id: false }
);

const WhyItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
    icon: { type: String, default: 'Layers', trim: true },
  },
  { _id: false }
);

const AboutSectionSchema = new mongoose.Schema(
  {
    // 1. Overview & Homepage Section
    overview: {
      pill: { type: String, default: '', trim: true },
      headline: {
        line1: { type: String, default: '', trim: true },
        line2: { type: String, default: '', trim: true },
        accent: { type: String, default: '', trim: true },
      },
      description: { type: String, default: '', trim: true },
      ctaPrimary: { type: String, default: '', trim: true },
      ctaSecondary: { type: String, default: '', trim: true },
      stats: { type: [StatItemSchema], default: [] },
      artworkImage: { type: String, default: '', trim: true },
      artworkImageAlt: { type: String, default: '', trim: true },
    },

    // 2. Mission & Vision Spotlight
    missionVisionHeader: {
      title: { type: String, default: '', trim: true },
      titleAccent: { type: String, default: '', trim: true },
      subtitle: { type: String, default: '', trim: true },
    },
    mission: {
      badge: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      tagline: { type: String, default: '', trim: true },
      description: { type: String, default: '', trim: true },
      pillars: { type: [PillarItemSchema], default: [] },
    },
    vision: {
      badge: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      tagline: { type: String, default: '', trim: true },
      description: { type: String, default: '', trim: true },
      milestones: { type: [PillarItemSchema], default: [] },
    },

    // 3. Core Values
    valuesHeader: {
      badge: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      titleAccent: { type: String, default: '', trim: true },
      subtitle: { type: String, default: '', trim: true },
    },
    values: { type: [ValueItemSchema], default: [] },

    // 4. Why Choose Us & CTA Strip
    whyChooseUsHeader: {
      badge: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      titleAccent: { type: String, default: '', trim: true },
      subtitle: { type: String, default: '', trim: true },
    },
    whyChooseUs: { type: [WhyItemSchema], default: [] },
    ctaBox: {
      title: { type: String, default: '', trim: true },
      text: { type: String, default: '', trim: true },
      buttonText: { type: String, default: '', trim: true },
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

export default mongoose.model('AboutSection', AboutSectionSchema);
