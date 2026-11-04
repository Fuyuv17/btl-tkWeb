/**
 * server.ts
 * Điểm khởi chạy chính của Backend Express.js (viết bằng TypeScript)
 * Tác giả: Quy Duong (MSV: 252631030)
 */

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';

// Import các Routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5001;

// 1. Middlewares chung
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 2. Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🎉 Express TypeScript Backend đang hoạt động ổn định!',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (POST /register, POST /login, GET /me)',
      products: '/api/products (GET /, GET /category/:category, GET /:id)',
      cart: '/api/cart (GET /, POST /, DELETE /)',
      orders: '/api/orders (POST /, GET /my-orders, GET /:id)',
    },
  });
});

// 3. Đăng ký các module API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 4. Middlewares xử lý lỗi
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 5. Khởi chạy Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Server Express TypeScript đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 Môi trường (NODE_ENV): ${process.env.NODE_ENV || 'development'}`);
  console.log(`📖 Endpoint kiểm tra: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

export default app;
