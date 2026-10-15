import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { errorHandler } from './middleware/error-handler';
import { originGuard } from './middleware/origin-guard';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import favoritesRoutes from './routes/favorites.routes';
import inquiryRoutes from './routes/inquiry.routes';
import notificationRoutes from './routes/notification.routes';
import propertyRoutes from './routes/property.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);
app.use(originGuard);
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  return res.status(200).json({ success: true, data: { status: 'ok', service: 'estatepro-api' } });
});
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', (_req, res) =>
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'API endpoint not found.' } }),
);
app.use(errorHandler);

let server: ReturnType<typeof app.listen> | undefined;

async function start() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected successfully.');

    const cloudinaryConfigured = Boolean(
      env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
    );
    console.log(
      cloudinaryConfigured
        ? 'Cloudinary credentials configured (connection is checked when image upload is used).'
        : 'Cloudinary not configured; image upload will be unavailable.',
    );
    server = app.listen(env.PORT, () => console.log(`EstatePro API listening on port ${env.PORT}`));
  } catch (error) {
    console.error('API startup failed; database connection could not be verified.', error);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}

void start();

async function shutdown() {
  if (server) server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  else {
    await prisma.$disconnect();
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
