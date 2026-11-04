/**
 * controllers/orderController.ts
 * Xử lý tạo và quản lý đơn hàng (TypeScript)
 */

import { Request, Response, NextFunction } from 'express';
import { IOrderInput, IOrder } from '../types/order.types';
import { AuthenticatedRequest } from '../types/user.types';

// TODO: Thay thế bằng Model CSDL của bạn
const ordersDatabase: IOrder[] = [];

export async function createOrder(
  req: AuthenticatedRequest<{}, {}, IOrderInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { receiverName, receiverPhone, receiverAddress, paymentMethod, items, note } = req.body;

    if (!receiverName || !receiverPhone || !receiverAddress) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ tên, số điện thoại và địa chỉ nhận hàng.',
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Đơn hàng phải có ít nhất 1 món ăn.',
      });
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const newOrder: IOrder = {
      id: 'ord_' + Date.now(),
      userId: req.user ? req.user.id : null,
      receiverName,
      receiverPhone,
      receiverAddress,
      paymentMethod: paymentMethod || 'cash',
      items,
      totalAmount,
      status: 'pending',
      note: note || '',
      createdAt: new Date().toISOString(),
    };

    // TODO: Lưu newOrder vào Database
    ordersDatabase.push(newOrder);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;

    // TODO: Truy vấn danh sách đơn hàng của userId từ CSDL
    const userOrders = ordersDatabase.filter((o) => o.userId === userId);

    res.status(200).json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // TODO: Tìm đơn hàng theo ID từ CSDL
    const order = ordersDatabase.find((o) => o.id === id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn hàng mã '${id}'.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
