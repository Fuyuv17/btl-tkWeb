/**
 * utils/generateToken.ts
 * Tiện ích tạo và giải mã JSON Web Token (JWT) có TypeScript typing
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { IUserPayload } from '../types/user.types';

/**
 * Hàm sinh JWT Token
 * @param payload Dữ liệu định danh người dùng cần đưa vào token
 */
export function generateToken(payload: IUserPayload): string {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_2026_btlwd_quyduong';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
}

/**
 * Hàm giải mã / xác thực JWT Token
 * @param token Chuỗi token gửi từ Header Authorization
 */
export function verifyToken(token: string): IUserPayload {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_2026_btlwd_quyduong';
  return jwt.verify(token, secret) as IUserPayload;
}
