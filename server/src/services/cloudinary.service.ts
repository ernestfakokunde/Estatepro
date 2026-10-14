import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../utils/http';

function configured() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new AppError(
      'Image uploads are not configured. Add Cloudinary credentials to server/.env.',
      503,
      'UPLOAD_NOT_CONFIGURED',
    );
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadPropertyImage(file: Express.Multer.File) {
  configured();
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
          { width: 2200, height: 1600, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result)
          return reject(new AppError(error?.message || 'Image upload failed.', 502, 'UPLOAD_FAILED'));
        return resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(file.buffer);
  });
}

export async function deleteImage(publicId: string) {
  configured();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
}
