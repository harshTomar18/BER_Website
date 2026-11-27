import Faq from '../models/Faq.model.js';
import { apiResponse } from '../utils/apiResponse.js';

/**
 * Seed default FAQs if collection is empty
 */
export const seedDefaultFaqs = async () => {
  try {
    const count = await Faq.countDocuments();
    if (count === 0) {
      const defaultFaqs = [
        {
          question: 'What services does BER Services provide?',
          answer:
            'We provide comprehensive end-to-end digital engineering and marketing solutions, including custom website development, enterprise eCommerce platforms, cross-platform mobile apps (iOS & Android), bespoke custom software, digital marketing & SEO, branding & UI/UX design, and AI workflow automations.',
          category: 'General',
          order: 1,
          isActive: true,
          isLandingFeatured: true, // Only this single featured FAQ is displayed on the landing page!
        },
        {
          question: 'How long does a typical digital or web project take to complete?',
          answer:
            'A standard corporate or brand website typically takes 2–4 weeks from UX blueprinting to deployment. Larger bespoke web applications, enterprise portals, or multi-vendor eCommerce platforms generally range between 6–12 weeks, governed by an agile milestone schedule.',
          category: 'Process & Timelines',
          order: 2,
          isActive: true,
          isLandingFeatured: false,
        },
        {
          question: 'Do you provide dedicated maintenance, SLA security & technical support after launch?',
          answer:
            'Yes, absolutely. We offer 24/7 proactive maintenance, speed optimization, regular security patching, SSL management, automated cloud backups, and dedicated monthly retainers to ensure your system operates without downtime.',
          category: 'Support & SLA',
          order: 3,
          isActive: true,
          isLandingFeatured: false,
        },
        {
          question: 'Will my website and application be fully responsive and SEO-ready from day one?',
          answer:
            'Yes. Every platform engineered at BER Services is mobile-first, passes Core Web Vitals with 90+ Lighthouse benchmark scores, includes semantic HTML5 structure, schema structured data, OpenGraph tags, and canonical SEO configurations.',
          category: 'Technical & SEO',
          order: 4,
          isActive: true,
          isLandingFeatured: false,
        },
        {
          question: 'How does the engagement, consultation, and billing process work?',
          answer:
            'Getting started is straightforward. You can request a free discovery consultation via our website form or consultation modal. We analyze your requirements, provide a transparent fixed-price or milestone-based quotation with technical specifications, and kick off the project upon agreement confirmation.',
          category: 'Billing & Pricing',
          order: 5,
          isActive: true,
          isLandingFeatured: false,
        },
        {
          question: 'Can you modernize or rebuild our existing website or software without losing SEO rankings?',
          answer:
            'Yes. We specialize in zero-downtime platform migrations, ensuring all existing SEO rankings, backlink equity, and page URLs are preserved using exact 301 redirect mappings, canonical tags, and preserved metadata.',
          category: 'Technical & SEO',
          order: 6,
          isActive: true,
          isLandingFeatured: false,
        },
      ];

      await Faq.insertMany(defaultFaqs);
      console.log('🌱 [Seeder] Default FAQs initialized.');
    }
  } catch (err) {
    console.error('Error seeding default FAQs:', err);
  }
};

/**
 * Public: Get active FAQs
 * GET /api/v1/faqs
 * Query Params:
 *  - landing: boolean (if true, returns ONLY 1 FAQ - the featured one)
 *  - limit: number
 *  - category: string
 *  - search: string
 */
export const getPublicFaqs = async (req, res) => {
  try {
    const { landing, limit, category, search } = req.query;

    const filter = { isActive: true };

    if (category && category !== 'ALL' && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), 'i');
      filter.$or = [{ question: reg }, { answer: reg }, { category: reg }];
    }

    // If requested for Landing page, return ONLY ONE (1) FAQ
    if (landing === 'true' || landing === '1' || limit === '1') {
      // Find the landing featured FAQ first; fallback to first active FAQ by order
      let featuredFaq = await Faq.findOne({ isActive: true, isLandingFeatured: true }).lean();
      if (!featuredFaq) {
        featuredFaq = await Faq.findOne({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
      }

      const faqs = featuredFaq ? [featuredFaq] : [];
      return apiResponse.success(res, { faqs, isLanding: true, total: faqs.length });
    }

    let query = Faq.find(filter).sort({ order: 1, createdAt: 1 });

    if (limit && parseInt(limit, 10) > 0) {
      query = query.limit(parseInt(limit, 10));
    }

    const faqs = await query.lean();
    return apiResponse.success(res, { faqs, total: faqs.length });
  } catch (err) {
    console.error('Error in getPublicFaqs:', err);
    return apiResponse.error(res, 'Failed to fetch FAQs', 500);
  }
};

/**
 * Admin: Get all FAQs (Protected)
 * GET /api/v1/faqs/admin
 */
export const getAdminFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return apiResponse.success(res, { faqs, total: faqs.length });
  } catch (err) {
    console.error('Error in getAdminFaqs:', err);
    return apiResponse.error(res, 'Failed to fetch admin FAQs', 500);
  }
};

/**
 * Admin: Create a new FAQ (Protected)
 * POST /api/v1/faqs/admin
 */
export const createFaq = async (req, res) => {
  try {
    const { question, answer, category, order, isActive, isLandingFeatured } = req.body;

    if (!question || !question.trim()) {
      return apiResponse.badRequest(res, 'Question is required');
    }
    if (!answer || !answer.trim()) {
      return apiResponse.badRequest(res, 'Answer is required');
    }

    // If marked as landing featured, unset any existing landing featured
    if (isLandingFeatured) {
      await Faq.updateMany({}, { $set: { isLandingFeatured: false } });
    }

    let itemOrder = order;
    if (itemOrder === undefined || itemOrder === null || itemOrder === '') {
      const count = await Faq.countDocuments();
      itemOrder = count + 1;
    }

    const faq = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category ? category.trim() : 'General',
      order: Number(itemOrder) || 0,
      isActive: isActive !== false,
      isLandingFeatured: Boolean(isLandingFeatured),
    });

    return apiResponse.created(res, { faq }, 'FAQ created successfully');
  } catch (err) {
    console.error('Error in createFaq:', err);
    return apiResponse.error(res, 'Failed to create FAQ', 500);
  }
};

/**
 * Admin: Update an FAQ (Protected)
 * PUT /api/v1/faqs/admin/:id
 */
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, order, isActive, isLandingFeatured } = req.body;

    const existing = await Faq.findById(id);
    if (!existing) {
      return apiResponse.notFound(res, 'FAQ item not found');
    }

    // If toggled to landing featured, ensure only this one has isLandingFeatured: true
    if (isLandingFeatured) {
      await Faq.updateMany({ _id: { $ne: id } }, { $set: { isLandingFeatured: false } });
    }

    if (question !== undefined) existing.question = question.trim();
    if (answer !== undefined) existing.answer = answer.trim();
    if (category !== undefined) existing.category = category.trim();
    if (order !== undefined) existing.order = Number(order) || 0;
    if (isActive !== undefined) existing.isActive = Boolean(isActive);
    if (isLandingFeatured !== undefined) existing.isLandingFeatured = Boolean(isLandingFeatured);

    await existing.save();

    return apiResponse.success(res, { faq: existing }, 'FAQ updated successfully');
  } catch (err) {
    console.error('Error in updateFaq:', err);
    return apiResponse.error(res, 'Failed to update FAQ', 500);
  }
};

/**
 * Admin: Delete an FAQ (Protected)
 * DELETE /api/v1/faqs/admin/:id
 */
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      return apiResponse.notFound(res, 'FAQ item not found');
    }

    // If deleted FAQ was the landing featured, set another active one as featured
    if (faq.isLandingFeatured) {
      const nextFeatured = await Faq.findOne({ isActive: true }).sort({ order: 1 });
      if (nextFeatured) {
        nextFeatured.isLandingFeatured = true;
        await nextFeatured.save();
      }
    }

    return apiResponse.success(res, null, 'FAQ deleted successfully');
  } catch (err) {
    console.error('Error in deleteFaq:', err);
    return apiResponse.error(res, 'Failed to delete FAQ', 500);
  }
};

/**
 * Admin: Reorder FAQs in bulk (Protected)
 * PUT /api/v1/faqs/admin/reorder
 */
export const reorderFaqs = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }
    if (!Array.isArray(items)) {
      return apiResponse.badRequest(res, 'Items array is required for reordering');
    }

    const bulkOps = items.map((item, idx) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { order: item.order !== undefined ? item.order : idx + 1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await Faq.bulkWrite(bulkOps);
    }

    const updated = await Faq.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return apiResponse.success(res, { faqs: updated }, 'FAQs reordered successfully');
  } catch (err) {
    console.error('Error in reorderFaqs:', err);
    return apiResponse.error(res, 'Failed to reorder FAQs', 500);
  }
};
