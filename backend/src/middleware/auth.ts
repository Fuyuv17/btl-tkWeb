/**
 * middleware/auth.ts
 * Middleware xác thực đăng nhập qua JSON Web Token (JWT)
 * Viết bằng TypeScript với kiểu AuthenticatedRequest, Response, NextFunction
 */

import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';
import { UserRole, AuthenticatedRequest } from '../types/user.types';

/**
 * Middleware bắt buộc đăng nhập (Authentication Guard)
 * Kiểm tra token từ Header: Authorization: Bearer <token>
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // 1. Trích xuất Header Authorization
    const authHeader = req.headers['authorization'];

    // 2. Kiểm tra định dạng tiền tố "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập hoặc thiếu mã xác thực (Token). Vui lòng đăng nhập!',
      });
      return;
    }

    // 3. Tách chuỗi lấy token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Mã xác thực không đúng định dạng.',
      });
      return;
    }

    // 4. Giải mã và kiểm tra tính hợp lệ của Token
    try {
      const decoded = verifyToken(token);
      // Gán payload đã giải mã vào req.user
      req.user = decoded;
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
        });
        return;
      }

      res.status(403).json({
        success: false,
        message: 'Mã xác thực không hợp lệ.',
      });
      return;
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ trong quá trình xác thực.',
      error: error.message,
    });
  }
}

/**
 * Middleware phân quyền người dùng (Role Authorization)
 * Ví dụ: authorizeRoles('admin', 'staff')
 */
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      });
      return;
    }
    next();
  };
}
