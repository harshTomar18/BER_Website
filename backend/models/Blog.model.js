import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    featuredImageAlt: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Blog category is required'],
      trim: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    readingTime: {
      type: Number,
      default: 3,
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      image: { type: String, default: '' },
      bio: { type: String, default: '' },
    },
    reviewer: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      focusKeyword: { type: String, default: '' },
      secondaryKeywords: [{ type: String, trim: true }],
      canonicalUrl: { type: String, default: '' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      robots: { type: String, default: 'index, follow' },
      schemaType: {
        type: String,
        enum: ['Article', 'BlogPosting', 'NewsArticle'],
        default: 'BlogPosting',
      },
    },
    cta: {
      enabled: { type: Boolean, default: false },
      badge: { type: String, default: '' },
      heading: { type: String, default: '' },
      description: { type: String, default: '' },
      buttonText: { type: String, default: '' },
      buttonUrl: { type: String, default: '' },
      secondaryButtonText: { type: String, default: '' },
      secondaryButtonUrl: { type: String, default: '' },
      phone: { type: String, default: '' },
      bulletPoints: [{ type: String, trim: true }],
      image: { type: String, default: '' },
      backgroundStyle: {
        type: String,
        enum: ['navy_gradient', 'cyan_glow', 'minimal_slate', 'dark_card'],
        default: 'navy_gradient',
      },
      placement: {
        type: String,
        enum: ['end_of_article', 'inside_content', 'banner', 'sidebar'],
        default: 'end_of_article',
      },
    },
    internalLinks: [
      {
        anchorText: { type: String, default: '' },
        targetUrl: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    relatedArticleIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
blogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text',
  'seo.focusKeyword': 'text',
});

// Auto calculate reading time before save
blogSchema.pre('save', function () {
  if (this.content) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
