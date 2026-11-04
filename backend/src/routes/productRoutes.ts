/**
 * routes/productRoutes.ts
 * Các tuyến đường xem thực đơn và món ăn (TypeScript)
 */

import { Router } from 'express';
import { getAllProducts, getProductById, getProductsByCategory } from '../controllers/productController';

const router = Router();

// [GET] /api/products -> Lấy toàn bộ món ăn
router.get('/', getAllProducts);

// [GET] /api/products/category/:category -> Lấy món theo danh mục
router.get('/category/:category', getProductsByCategory);

// [GET] /api/products/:id -> Lấy chi tiết 1 món ăn
router.get('/:id', getProductById);

export default router;
