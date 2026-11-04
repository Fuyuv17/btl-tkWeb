/**
 * middleware/validate.ts
 * Middleware kiểm tra hợp lệ dữ liệu đầu vào (Validation Middleware)
 */

import { Request, Response, NextFunction } from 'express';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(?!00)[0-9]{10,11}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { surname, givenName, phone, email, password } = req.body;

  if (!surname || !givenName || !phone || !password) {
    res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ họ, tên, số điện thoại và mật khẩu.',
    });
    return;
  }

  if (!PHONE_PATTERN.test(phone)) {
    res.status(400).json({
      success: false,
      message: 'Số điện thoại phải gồm 10–11 chữ số và không bắt đầu bằng "00".',
    });
    return;
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Email không đúng định dạng.',
    });
    return;
  }

  if (!PASSWORD_PATTERN.test(password)) {
    res.status(400).json({
      success: false,
      message: 'Mật khẩu cần ít nhất 6 ký tự, gồm cả chữ và số.',
    });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { account, password } = req.body;

  if (!account || !password) {
    res.status(400).json({
      success: false,
      message: 'Vui lòng nhập tài khoản (email hoặc số điện thoại) và mật khẩu.',
    });
    return;
  }

  next();
}
