import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'FAQ question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'FAQ answer is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isLandingFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ order: 1, createdAt: -1 });

const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
export default Faq;
