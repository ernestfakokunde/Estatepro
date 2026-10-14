import type { RequestHandler } from 'express';
import { uploadPropertyImage } from '../services/cloudinary.service';
import { sendData } from '../utils/http';

export const upload: RequestHandler = async (req, res) => {
  const files = (req.files ?? []) as Express.Multer.File[];
  const uploaded = await Promise.all(
    files.map(async (file) => ({
      ...(await uploadPropertyImage(file)),
      alt: file.originalname.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
    })),
  );
  return sendData(res, uploaded, 201);
};
