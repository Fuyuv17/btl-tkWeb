/**
 * middleware/errorHandler.ts
 * Xử lý lỗi tập trung 404 & 500
 */

import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: [${req.method}] ${req.originalUrl}`,
  });
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('🔥 [Lỗi Server]:', err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Đã xảy ra lỗi máy chủ nội bộ.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}
