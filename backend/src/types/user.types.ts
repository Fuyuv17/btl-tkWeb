/**
 * types/user.types.ts
 * Khai báo các Type & Interface liên quan đến Người dùng và Xác thực
 */

import { Request } from 'express';

export type UserRole = 'customer' | 'admin' | 'staff';

export interface IUser {
  id: string;
  ho: string;
  ten: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  role: UserRole;
  newsletter?: boolean;
  createdAt: string;
}

export interface IUserRegisterInput {
  surname: string;
  givenName: string;
  phone: string;
  email?: string;
  password: string;
  newsletter?: boolean;
}

export interface IUserLoginInput {
  account: string; // Có thể là Email hoặc Số điện thoại
  password: string;
}

export interface IUserPayload {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
  role: UserRole;
}

export interface IAuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

/**
 * Interface mở rộng của Express Request chứa thông tin user đã đăng nhập
 */
export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUserPayload;
}
