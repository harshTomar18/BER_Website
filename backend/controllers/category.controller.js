import BlogCategory from '../models/BlogCategory.model.js';
import Blog from '../models/Blog.model.js';
import { apiResponse } from '../utils/apiResponse.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get all categories (Public / Admin)
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });

    // Aggregate article counts per category
    const counts = await Blog.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 }, published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = { total: c.total, published: c.published };
    });

    const enriched = categories.map((cat) => ({
      ...cat.toObject(),
      articleCount: countMap[cat.name]?.published || 0,
      totalCount: countMap[cat.name]?.total || 0,
    }));

    return apiResponse.success(res, { categories: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Category (Admin)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    if (!name || !name.trim()) {
      return apiResponse.badRequest(res, 'Category name is required.');
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    const existing = await BlogCategory.findOne({
      $or: [{ name: trimmedName }, { slug }],
    });

    if (existing) {
      return apiResponse.badRequest(res, 'Category with this name or slug already exists.');
    }

    const category = await BlogCategory.create({
      name: trimmedName,
      slug,
      description: (description || '').trim(),
      color: (color || '').trim(),
    });

    return apiResponse.created(res, { category }, 'Category created successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Category (Admin)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    const category = await BlogCategory.findById(id);
    if (!category) {
      return apiResponse.notFound(res, 'Category not found.');
    }

    const oldName = category.name;
    let newName = oldName;

    if (name && name.trim()) {
      newName = name.trim();
      const slug = slugify(newName);
      const duplicate = await BlogCategory.findOne({
        _id: { $ne: id },
        $or: [{ name: newName }, { slug }],
      });

      if (duplicate) {
        return apiResponse.badRequest(res, 'Another category already exists with this name.');
      }

      category.name = newName;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description.trim();
    if (color !== undefined) category.color = color.trim();

    await category.save();

    // If category name changed, update existing blogs with this category
    if (oldName !== newName) {
      await Blog.updateMany({ category: oldName }, { $set: { category: newName } });
    }

    return apiResponse.success(res, { category }, 'Category updated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Category (Admin)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await BlogCategory.findById(id);

    if (!category) {
      return apiResponse.notFound(res, 'Category not found.');
    }

    // Check if blogs are using this category
    const blogsCount = await Blog.countDocuments({ category: category.name });
    if (blogsCount > 0) {
      return apiResponse.badRequest(
        res,
        `Cannot delete category "${category.name}" because ${blogsCount} articles are currently assigned to it. Reassign them first.`
      );
    }

    await BlogCategory.findByIdAndDelete(id);

    return apiResponse.success(res, null, `Category "${category.name}" deleted successfully.`);
  } catch (error) {
    next(error);
  }
};
