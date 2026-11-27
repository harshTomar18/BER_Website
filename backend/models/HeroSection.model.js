import mongoose from 'mongoose';

const DynamicWordSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    color: { type: String, default: '#16a1ce', trim: true },
  },
  { _id: false }
);

const StatItemSchema = new mongoose.Schema(
  {
    icon: { type: String, default: '⚡', trim: true },
    value: { type: String, default: '', trim: true },
    label: { type: String, default: '', trim: true },
    color: { type: String, default: 'cyan', trim: true },
  },
  { _id: false }
);

const HeroSectionSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Hero main title is required'],
      trim: true,
    },
    titleSub: {
      type: String,
      default: '',
      trim: true,
    },
    dynamicWords: {
      type: [DynamicWordSchema],
      default: [],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    primaryCta: {
      text: { type: String, default: '', trim: true },
      url: { type: String, default: '', trim: true },
      action: {
        type: String,
        enum: ['modal', 'url'],
        default: 'modal',
      },
    },
    secondaryCta: {
      text: { type: String, default: '', trim: true },
      url: { type: String, default: '', trim: true },
    },
    features: {
      type: [String],
      default: [],
    },
    heroImage: {
      type: String,
      default: '',
      trim: true,
    },
    heroImageAlt: {
      type: String,
      default: '',
      trim: true,
    },
    heroVideo: {
      type: String,
      default: '/images/This is what we will be.mp4',
      trim: true,
    },
    heroVideoPoster: {
      type: String,
      default: '',
      trim: true,
    },
    heroMediaType: {
      type: String,
      enum: ['video', 'image', 'code', 'none'],
      default: 'video',
    },
    heroVideoAutoplay: {
      type: Boolean,
      default: true,
    },
    heroVideoLoop: {
      type: Boolean,
      default: true,
    },
    heroVideoMuted: {
      type: Boolean,
      default: true,
    },
    windowBadge: {
      type: String,
      default: '',
      trim: true,
    },
    windowLiveStatus: {
      type: String,
      default: '',
      trim: true,
    },
    stats: {
      type: [StatItemSchema],
      default: [],
    },
    codeSnippet: {
      fileName: { type: String, default: '', trim: true },
      language: { type: String, default: '', trim: true },
      code: { type: String, default: '' },
    },
    techPills: {
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

export default mongoose.model('HeroSection', HeroSectionSchema);
