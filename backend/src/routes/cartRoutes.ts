/**
 * routes/cartRoutes.ts
 * Các tuyến đường quản lý giỏ hàng (yêu cầu đăng nhập)
 */

import { Router } from 'express';
import { getCart, updateCart, clearCart } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Tất cả thao tác giỏ hàng đều yêu cầu xác thực
router.use(authenticateToken);

router.get('/', getCart);
router.post('/', updateCart);
router.delete('/', clearCart);

export default router;
