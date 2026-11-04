/**
 * controllers/productController.ts
 * Xử lý truy vấn danh sách và chi tiết món ăn (TypeScript)
 */

import { Request, Response, NextFunction } from 'express';
import { IProduct } from '../types/product.types';

// TODO: Thay thế bằng Model truy vấn từ CSDL thật của bạn (MongoDB, MySQL, PostgreSQL, ...)
export async function getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Viết câu lệnh truy vấn toàn bộ sản phẩm từ CSDL
    res.status(200).json({
      success: true,
      message: 'Khung API lấy danh sách món ăn',
      data: [],
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    // TODO: Viết câu lệnh tìm sản phẩm theo ID từ CSDL
    res.status(200).json({
      success: true,
      message: `Khung API lấy chi tiết món ăn ${id}`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductsByCategory(
  req: Request<{ category: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { category } = req.params;

    // TODO: Viết câu lệnh lọc món ăn theo danh mục từ CSDL
    res.status(200).json({
      success: true,
      category,
      data: [],
    });
  } catch (error) {
    next(error);
  }
}
