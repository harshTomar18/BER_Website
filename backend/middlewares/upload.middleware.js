import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless environments (Vercel/AWS Lambda), the root filesystem is read-only.
// We use os.tmpdir() on Vercel so any disk writing operations happen in /tmp.
const baseUploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../../uploads');

const uploadDir = path.join(baseUploadDir, 'blogs');
const heroUploadDir = path.join(baseUploadDir, 'hero');
const aboutUploadDir = path.join(baseUploadDir, 'about');
const serviceUploadDir = path.join(baseUploadDir, 'services');
const showcaseUploadDir = path.join(baseUploadDir, 'showcase');

// Ensure destination folders exist safely without crashing on read-only serverless filesystems
const ensureDirSafe = (dir) => {
  if (process.env.VERCEL) return;
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn(`[Upload Dir Notice] ${dir}:`, err?.message || err);
  }
};

ensureDirSafe(uploadDir);
ensureDirSafe(heroUploadDir);
ensureDirSafe(aboutUploadDir);
ensureDirSafe(serviceUploadDir);
ensureDirSafe(showcaseUploadDir);

// Reusable safe storage engine
const createSafeDiskStorage = (targetDir, prefix) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const cleanName = path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const uniqueName = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      cb(null, uniqueName);
    },
  });
};

const storage = createSafeDiskStorage(uploadDir, 'img');
const heroStorage = createSafeDiskStorage(heroUploadDir, 'hero');
const aboutStorage = createSafeDiskStorage(aboutUploadDir, 'about');
const serviceStorage = createSafeDiskStorage(serviceUploadDir, 'service');
const showcaseStorage = createSafeDiskStorage(showcaseUploadDir, 'showcase');

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg\+xml|svg/;
  const mimeMatch = allowedTypes.test(file.mimetype);
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeMatch || extMatch) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image files (JPG, PNG, WebP, GIF, SVG) are permitted.'), false);
  }
};

export const uploadBlogImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
}).single('image');

export const uploadHeroImage = multer({
  storage: heroStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single('image');

const mediaFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg\+xml|svg|mp4|webm|ogg|quicktime|mov/;
  const mimeMatch = allowedTypes.test(file.mimetype);
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeMatch || extMatch) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only valid media files (JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV) are permitted.'
      ),
      false
    );
  }
};

export const uploadHeroMedia = multer({
  storage: heroStorage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for hero videos/media
  },
}).single('file');

export const uploadAboutImage = multer({
  storage: aboutStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single('image');

export const uploadServiceImage = multer({
  storage: serviceStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single('image');

export const uploadShowcaseImage = multer({
  storage: showcaseStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single('image');
