/**
 * controllers/cartController.ts
 * Quản lý giỏ hàng của người dùng (TypeScript)
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/user.types';

export async function getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    // TODO: Truy vấn giỏ hàng của userId từ CSDL
    res.status(200).json({
      success: true,
      userId,
      data: [],
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    // TODO: Cập nhật giỏ hàng của userId trong CSDL
    res.status(200).json({
      success: true,
      message: 'Cập nhật giỏ hàng thành công.',
      userId,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    // TODO: Xóa giỏ hàng của userId trong CSDL
    res.status(200).json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng.',
      userId,
    });
  } catch (error) {
    next(error);
  }
}
