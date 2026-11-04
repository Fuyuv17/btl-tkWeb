/**
 * routes/authRoutes.ts
 * Các tuyến đường xác thực tài khoản (TypeScript)
 */

import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// [POST] /api/auth/register -> Đăng ký tài khoản
router.post('/register', validateRegister, register);

// [POST] /api/auth/login -> Đăng nhập tài khoản
router.post('/login', validateLogin, login);

// [GET] /api/auth/me -> Lấy thông tin tài khoản hiện tại (yêu cầu Token)
router.get('/me', authenticateToken, getMe);

export default router;
