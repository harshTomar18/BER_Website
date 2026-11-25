import mongoose from 'mongoose';

const ContactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      maxlength: [25, 'Phone number cannot exceed 25 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters.'],
      default: '',
    },
    service: {
      type: String,
      trim: true,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters.'],
      default: '',
    },
    type: {
      type: String,
      enum: ['contact', 'consultation'],
      default: 'contact',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_progress', 'closed'],
      default: 'new',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Optimize query performance for admin retrieval
ContactInquirySchema.index({ createdAt: -1 });
ContactInquirySchema.index({ email: 1 });
ContactInquirySchema.index({ type: 1 });
ContactInquirySchema.index({ status: 1 });

export const ContactInquiry = mongoose.model('ContactInquiry', ContactInquirySchema);
