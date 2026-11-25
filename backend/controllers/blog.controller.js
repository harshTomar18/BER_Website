import Blog from '../models/Blog.model.js';
import BlogCategory from '../models/BlogCategory.model.js';
import { apiResponse } from '../utils/apiResponse.js';

// Helper to convert title into URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ---------------------------------------------------------------------------
// PUBLIC CONTROLLERS
// ---------------------------------------------------------------------------

/**
 * Get Published Blogs with pagination, search, category & tag filters
 */
export const getPublicBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const { category, tag, search } = req.query;

    const filter = {
      status: 'published',
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: null },
      ],
    };

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt featuredImage featuredImageAlt category tags publishedAt readingTime author'),
      Blog.countDocuments(filter),
    ]);

    // Fetch active categories with counts for filter tabs
    const categoriesWithCounts = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Unique tags
    const tagsAggregation = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    return apiResponse.success(res, {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
        hasMore: page * limit < total,
      },
      categories: categoriesWithCounts.map((c) => ({ name: c._id, count: c.count })),
      popularTags: tagsAggregation.map((t) => t._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Published Blog by Slug
 */
export const getPublicBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug: slug.toLowerCase().trim(),
      status: 'published',
    }).populate('relatedArticleIds', 'title slug excerpt featuredImage category publishedAt readingTime');

    if (!blog) {
      return apiResponse.notFound(res, 'Article not found or has been unpublished.');
    }

    // Increment view count asynchronously
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    // Determine related articles:
    // 1. If administrator manually selected related articles, use them.
    // 2. Otherwise auto-calculate related articles with matching category or shared tags.
    let relatedArticles = blog.relatedArticleIds || [];

    if (relatedArticles.length === 0) {
      relatedArticles = await Blog.find({
        _id: { $ne: blog._id },
        status: 'published',
        $or: [
          { category: blog.category },
          { tags: { $in: blog.tags || [] } },
        ],
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select('title slug excerpt featuredImage category publishedAt readingTime');
    }

    // Previous and Next article navigation links
    const [prevBlog, nextBlog] = await Promise.all([
      Blog.findOne({
        status: 'published',
        publishedAt: { $lt: blog.publishedAt || blog.createdAt },
      })
        .sort({ publishedAt: -1 })
        .select('title slug'),
      Blog.findOne({
        status: 'published',
        publishedAt: { $gt: blog.publishedAt || blog.createdAt },
      })
        .sort({ publishedAt: 1 })
        .select('title slug'),
    ]);

    return apiResponse.success(res, {
      blog,
      relatedArticles,
      navigation: {
        prev: prevBlog || null,
        next: nextBlog || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Dynamic XML Sitemap Generator
 */
export const getSitemapXml = async (req, res, next) => {
  try {
    const baseUrl = 'https://thebermedia.com';

    // 1. Core static marketing and service routes
    const staticRoutes = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
      { loc: `${baseUrl}/about-us`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/services-we-provide`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/website-designing-development`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/mobile-app-development`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/performance-marketing`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/ecommerce-growth-engine`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/brand-identity-creative-strategy`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/seo-visibility-architecture`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/services-we-provide/social-media-management`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/news-and-article`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/contact-us`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/faq`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/terms-conditions`, priority: '0.4', changefreq: 'yearly' },
      { loc: `${baseUrl}/privacy-policy`, priority: '0.4', changefreq: 'yearly' },
    ];

    // 2. Fetch all published blogs dynamically
    const publishedBlogs = await Blog.find({ status: 'published' })
      .select('slug updatedAt publishedAt')
      .sort({ publishedAt: -1 });

    const blogRoutes = publishedBlogs.map((b) => ({
      loc: `${baseUrl}/news-and-article/${b.slug}`,
      lastmod: (b.updatedAt || b.publishedAt || new Date()).toISOString().slice(0, 10),
      priority: '0.8',
      changefreq: 'weekly',
    }));

    const allUrls = [...staticRoutes, ...blogRoutes];

    // Construct valid XML string
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// ADMIN CONTROLLERS (PROTECTED)
// ---------------------------------------------------------------------------

/**
 * Get all blogs for Admin Console (with draft/published/scheduled filters)
 */
export const getAdminBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const { status, category, search } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { slug: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [blogs, total, totalPublished, totalDrafts, totalScheduled] = await Promise.all([
      Blog.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug category status publishedAt scheduledAt views readingTime author updatedAt createdAt'),
      Blog.countDocuments(filter),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      Blog.countDocuments({ status: 'scheduled' }),
    ]);

    return apiResponse.success(res, {
      blogs,
      stats: {
        totalAll: totalPublished + totalDrafts + totalScheduled,
        totalPublished,
        totalDrafts,
        totalScheduled,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Blog by ID for Admin Editor
 */
export const getAdminBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('relatedArticleIds', 'title slug');

    if (!blog) {
      return apiResponse.notFound(res, 'Article not found.');
    }

    return apiResponse.success(res, { blog });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Blog
 */
export const createBlog = async (req, res, next) => {
  try {
    const { title, slug, content, category } = req.body;

    if (!title || !title.trim()) {
      return apiResponse.badRequest(res, 'Article title is required.');
    }

    if (!content || !content.trim()) {
      return apiResponse.badRequest(res, 'Article content is required.');
    }

    if (!category || !category.trim()) {
      return apiResponse.badRequest(res, 'Category is required.');
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);

    // Guarantee unique slug
    let existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const blogData = {
      ...req.body,
      title: title.trim(),
      slug: finalSlug,
      category: category.trim(),
    };

    if (blogData.status === 'published' && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
    }

    const newBlog = await Blog.create(blogData);

    return apiResponse.created(res, { blog: newBlog }, 'Article created successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Blog
 */
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
      const existing = await Blog.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (existing) {
        return apiResponse.badRequest(res, 'This URL slug is already in use by another article.');
      }
    }

    if (updateData.status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return apiResponse.notFound(res, 'Article not found.');
    }

    return apiResponse.success(res, { blog: updatedBlog }, 'Article updated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Blog
 */
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return apiResponse.notFound(res, 'Article not found.');
    }

    return apiResponse.success(res, null, `Article "${deleted.title}" deleted permanently.`);
  } catch (error) {
    next(error);
  }
};

/**
 * Duplicate a Blog (as Draft)
 */
export const duplicateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sourceBlog = await Blog.findById(id).lean();

    if (!sourceBlog) {
      return apiResponse.notFound(res, 'Source article not found.');
    }

    delete sourceBlog._id;
    delete sourceBlog.createdAt;
    delete sourceBlog.updatedAt;

    sourceBlog.title = `${sourceBlog.title} (Copy)`;
    sourceBlog.slug = `${sourceBlog.slug}-copy-${Date.now().toString().slice(-4)}`;
    sourceBlog.status = 'draft';
    sourceBlog.publishedAt = null;
    sourceBlog.views = 0;

    const duplicated = await Blog.create(sourceBlog);

    return apiResponse.created(res, { blog: duplicated }, 'Article duplicated as draft.');
  } catch (error) {
    next(error);
  }
};

/**
 * Quick Toggle Status (Publish / Unpublish)
 */
export const toggleBlogStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return apiResponse.notFound(res, 'Article not found.');
    }

    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    blog.status = newStatus;
    if (newStatus === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();

    return apiResponse.success(
      res,
      { status: blog.status, publishedAt: blog.publishedAt },
      `Article marked as ${newStatus}.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Internal URL Registry for the Internal Linking Engine
 * Provides administrators with all existing website routes dynamically
 */
export const getInternalRoutes = async (req, res, next) => {
  try {
    const staticPages = [
      { title: 'Home Page', url: '/', category: 'Core' },
      { title: 'About Us', url: '/about-us', category: 'Core' },
      { title: 'All Services', url: '/services-we-provide', category: 'Services' },
      { title: 'Website Designing & Development', url: '/services-we-provide/website-designing-development', category: 'Services' },
      { title: 'Mobile App Development', url: '/services-we-provide/mobile-app-development', category: 'Services' },
      { title: 'Performance Marketing', url: '/services-we-provide/performance-marketing', category: 'Services' },
      { title: 'eCommerce Growth Engine', url: '/services-we-provide/ecommerce-growth-engine', category: 'Services' },
      { title: 'Brand Identity & Strategy', url: '/services-we-provide/brand-identity-creative-strategy', category: 'Services' },
      { title: 'SEO Architecture', url: '/services-we-provide/seo-visibility-architecture', category: 'Services' },
      { title: 'Social Media Management', url: '/services-we-provide/social-media-management', category: 'Services' },
      { title: 'News and Articles', url: '/news-and-article', category: 'Articles' },
      { title: 'Contact Us', url: '/contact-us', category: 'Core' },
      { title: 'FAQ', url: '/faq', category: 'Support' },
      { title: 'Privacy Policy', url: '/privacy-policy', category: 'Legal' },
      { title: 'Terms & Conditions', url: '/terms-conditions', category: 'Legal' },
    ];

    // Query published blogs dynamically
    const publishedBlogs = await Blog.find({ status: 'published' })
      .select('title slug category')
      .sort({ title: 1 });

    const blogRoutes = publishedBlogs.map((b) => ({
      title: b.title,
      url: `/news-and-article/${b.slug}`,
      category: `Blog: ${b.category}`,
    }));

    return apiResponse.success(res, {
      routes: [...staticPages, ...blogRoutes],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload Image handler for Featured Image and In-Article Media
 */
export const uploadBlogImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse.error(res, 'No image file uploaded.', 400);
    }

    const relativeUrl = `/uploads/blogs/${req.file.filename}`;

    return apiResponse.success(
      res,
      {
        url: relativeUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      'Image uploaded successfully.'
    );
  } catch (error) {
    next(error);
  }
};
