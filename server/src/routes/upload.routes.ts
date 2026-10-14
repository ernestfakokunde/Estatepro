import { Router } from 'express';
import multer from 'multer';
import { Role } from '@prisma/client';
import { upload } from '../controllers/upload.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { AppError } from '../utils/http';

const router = Router();
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype))
      return callback(new AppError('Use a JPG, PNG, WebP or AVIF image.', 400, 'INVALID_IMAGE_TYPE'));
    return callback(null, true);
  },
});

router.post('/', requireAuth, requireRole(Role.AGENT, Role.ADMIN), imageUpload.array('images', 12), upload);
export default router;
