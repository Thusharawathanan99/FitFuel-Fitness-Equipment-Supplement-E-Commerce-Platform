import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured with real credentials
const isCloudinaryActive = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('placeholder') &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('fitfuel-cloud') &&
    process.env.CLOUDINARY_API_KEY &&
    !process.env.CLOUDINARY_API_KEY.startsWith('123456789') &&
    process.env.CLOUDINARY_API_SECRET &&
    !process.env.CLOUDINARY_API_SECRET.includes('placeholder')
  );
};

let storage;

if (isCloudinaryActive()) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'fitfuel-products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
  });
} else {
  // Ensure local uploads folder exists inside server directory
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    }
  });
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export default upload;
