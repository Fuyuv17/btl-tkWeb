/**
 * routes/orderRoutes.ts
 * Các tuyến đường quản lý đơn đặt hàng
 */

import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// [POST] /api/orders -> Tạo đơn đặt hàng (khách hoặc user có tài khoản)
router.post('/', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}, createOrder);

// [GET] /api/orders/my-orders -> Lịch sử đơn hàng của tôi (yêu cầu Token)
router.get('/my-orders', authenticateToken, getMyOrders);

// [GET] /api/orders/:id -> Chi tiết đơn hàng
router.get('/:id', getOrderById);

export default router;
