import HeroSection from '../models/HeroSection.model.js';
import { apiResponse } from '../utils/apiResponse.js';

/**
 * Seed default Hero section if none exists
 */
export const seedDefaultHero = async () => {
  try {
    const count = await HeroSection.countDocuments();
    if (count === 0) {
      const defaultHero = {
        badge: 'Enterprise Technology Flagship',
        title: 'Custom Website Development &',
        titleSub: 'Digital Solutions That',
        dynamicWords: [
          { text: 'Deliver Results', color: '#1385ac' },
          { text: 'Accelerate Growth', color: '#16a1ce' },
          { text: 'Perform at Scale', color: '#00d2ff' },
          { text: 'Power Enterprise', color: '#1497c2' },
        ],
        description:
          'Professional web development services with custom, responsive, and SEO-ready websites built for business growth.',
        primaryCta: {
          text: 'Get a Free Consultation',
          url: '',
          action: 'modal',
        },
        secondaryCta: {
          text: 'Explore Services',
          url: '/services-we-provide',
        },
        features: ['End-to-End Solutions', 'Advanced Technology', 'Tailored Strategies'],
        heroImage: '',
        heroImageAlt: 'BER Services Enterprise Architecture Platform',
        windowBadge: 'thebermedia.com/enterprise',
        windowLiveStatus: 'Active System',
        stats: [
          { icon: '⚡', value: '99.98%', label: 'Uptime & Scalability', color: 'cyan' },
          { icon: '🚀', value: '500+', label: 'Projects Delivered', color: 'orange' },
        ],
        codeSnippet: {
          fileName: 'BER_Architecture.ts',
          language: 'Enterprise • TypeScript',
          code: `export const DigitalSolution = {
  core: 'Cloud ERP & Custom Software',
  apps: 'Cross-Platform Mobile (iOS/Android)',
  ai: 'Intelligent Workflow Automation',
  uptime: true, security: 'Enterprise'
};`,
        },
        techPills: ['React', 'Node.js', 'Python', 'Flutter', 'AI Automation'],
        isActive: true,
      };

      await HeroSection.create(defaultHero);
      console.log('🌱 [Seeder] Default Hero section initialized.');
    }
  } catch (err) {
    console.error('Error seeding default hero section:', err);
  }
};

/**
 * Public: Get active hero section data
 * GET /api/v1/hero
 */
export const getPublicHero = async (req, res, next) => {
  try {
    const hero = await HeroSection.findOne({ isActive: true }).lean();
    return apiResponse.success(res, { hero: hero || null }, 'Hero section fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get hero section data for editing
 * GET /api/v1/hero/admin
 */
export const getAdminHero = async (req, res, next) => {
  try {
    let hero = await HeroSection.findOne({ isActive: true }).lean();
    if (!hero) {
      hero = await HeroSection.findOne().lean();
    }
    return apiResponse.success(res, { hero: hero || null }, 'Admin hero section data fetched');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update / Overwrite Hero section
 * PUT /api/v1/hero/admin
 */
export const updateAdminHero = async (req, res, next) => {
  try {
    const payload = req.body;

    if (!payload.title || !payload.title.trim()) {
      return apiResponse.error(res, 'Hero section main title is required.', 400);
    }

    const updatedHero = await HeroSection.findOneAndUpdate(
      { isActive: true },
      { $set: payload },
      { upsert: true, new: true, runValidators: true }
    );

    return apiResponse.success(res, { hero: updatedHero }, 'Hero section updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Upload Hero Image
 * POST /api/v1/hero/admin/upload-image
 */
export const uploadHeroImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse.error(res, 'No image file uploaded. Please attach an image.', 400);
    }

    const fileUrl = `/uploads/hero/${req.file.filename}`;

    return apiResponse.success(
      res,
      {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      'Hero image uploaded successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};
