import { ApiResponse } from '../utils/apiResponse.js';

// Clean sanitization helper to strip potentially dangerous characters/scripts
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
};

export const validateContactInput = (req, res, next) => {
  const { name, phone, email, company, service, message, type } = req.body;
  const errors = [];

  // Required Field Checks
  if (!name || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }

  if (!phone || !phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required.' });
  }

  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push({ field: 'email', message: 'Please provide a valid email format.' });
    }
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Validation failed for one or more fields.', 400, errors);
  }

  // Sanitize inputs before passing to controller
  req.body.name = sanitizeString(name);
  req.body.phone = sanitizeString(phone);
  req.body.email = sanitizeString(email).toLowerCase();
  req.body.company = sanitizeString(company);
  req.body.service = sanitizeString(service) || 'General Inquiry';
  req.body.message = sanitizeString(message);
  req.body.type = ['consultation', 'contact'].includes(type) ? type : 'contact';

  next();
};
