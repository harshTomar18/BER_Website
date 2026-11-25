import { ContactInquiry } from '../models/ContactInquiry.model.js';
import Blog from '../models/Blog.model.js';
import Service from '../models/Service.model.js';
import Showcase from '../models/Showcase.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const { name, phone, email, company, service, message, type } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const newInquiry = await ContactInquiry.create({
      name,
      phone,
      email,
      company: company || '',
      service: service || 'General Inquiry',
      message: message || '',
      type: type === 'consultation' ? 'consultation' : 'contact',
      ipAddress: clientIp,
    });

    console.log(`📥 [Lead Ingested] ID: ${newInquiry._id} | Type: ${newInquiry.type} | Client: ${name} (${email})`);

    return ApiResponse.success(
      res,
      {
        leadId: newInquiry._id,
        createdAt: newInquiry.createdAt,
      },
      'Thank you! Your inquiry has been submitted and saved successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type && ['contact', 'consultation'].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    if (req.query.status && ['new', 'contacted', 'in_progress', 'closed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      const q = req.query.search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { service: { $regex: q, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      ContactInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactInquiry.countDocuments(filter),
    ]);

    return ApiResponse.success(
      res,
      {
        total,
        page,
        limit,
        leads,
      },
      'Inquiries retrieved successfully.'
    );
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'in_progress', 'closed'].includes(status)) {
      return ApiResponse.error(res, 'Invalid status value.', 400);
    }

    const lead = await ContactInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!lead) {
      return ApiResponse.error(res, 'Inquiry not found.', 404);
    }

    console.log(`🔄 [Inquiry Status Updated] ID: ${id} -> Status: ${status}`);
    return ApiResponse.success(res, { lead }, 'Status updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await ContactInquiry.findByIdAndDelete(id);

    if (!lead) {
      return ApiResponse.error(res, 'Inquiry not found.', 404);
    }

    console.log(`🗑️ [Lead Deleted] ID: ${id}`);
    return ApiResponse.success(res, { id }, 'Lead deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalInquiries,
      newInquiries,
      contactCount,
      consultationCount,
      totalBlogs,
      totalServices,
      showcaseDoc,
      recentInquiries,
    ] = await Promise.all([
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: 'new' }),
      ContactInquiry.countDocuments({ type: 'contact' }),
      ContactInquiry.countDocuments({ type: 'consultation' }),
      Blog.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Showcase.findOne(),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(6),
    ]);

    const clientLogosCount = Array.isArray(showcaseDoc?.clients?.items) ? showcaseDoc.clients.items.length : 0;
    const testimonialsCount = Array.isArray(showcaseDoc?.testimonials?.items) ? showcaseDoc.testimonials.items.length : 0;
    const techItemsCount = Array.isArray(showcaseDoc?.techSlider?.items) ? showcaseDoc.techSlider.items.length : 0;

    return ApiResponse.success(
      res,
      {
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
          contact: contactCount,
          consultation: consultationCount,
        },
        content: {
          blogs: totalBlogs,
          services: totalServices,
          clients: clientLogosCount,
          testimonials: testimonialsCount,
          tech: techItemsCount,
        },
        recentInquiries,
      },
      'Dashboard stats retrieved successfully.'
    );
  } catch (error) {
    next(error);
  }
};
