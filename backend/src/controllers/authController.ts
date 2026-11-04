/**
 * controllers/authController.ts
 * Xử lý logic Đăng ký, Đăng nhập và Profile bằng TypeScript
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';
import { IUser, IUserRegisterInput, IUserLoginInput, AuthenticatedRequest } from '../types/user.types';

// TODO: Thay thế mảng memory này bằng kết nối CSDL của bạn (MongoDB Mongoose, MySQL, PostgreSQL, Prisma, ...)
const usersDatabase: IUser[] = [];

/**
 * [POST] /api/auth/register
 * Đăng ký tài khoản mới
 */
export async function register(
  req: Request<{}, {}, IUserRegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { surname, givenName, phone, email, password } = req.body;

    // 1. Kiểm tra tài khoản đã tồn tại chưa (TODO: Thay bằng truy vấn CSDL)
    const exists = usersDatabase.some(
      (u) => (email && u.email.toLowerCase() === email.toLowerCase()) || u.phone === phone
    );

    if (exists) {
      res.status(409).json({
        success: false,
        message: 'Email hoặc số điện thoại này đã được đăng ký tài khoản.',
      });
      return;
    }

    // 2. Băm mật khẩu với bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Khởi tạo đối tượng người dùng mới
    const newUser: IUser = {
      id: 'usr_' + Date.now(),
      ho: surname,
      ten: givenName,
      fullName: `${surname} ${givenName}`.trim(),
      phone,
      email: email ? email.toLowerCase() : '',
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    // TODO: Lưu newUser vào Database
    usersDatabase.push(newUser);

    // 4. Sinh JWT Token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      fullName: newUser.fullName,
      role: newUser.role,
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * [POST] /api/auth/login
 * Đăng nhập tài khoản
 */
export async function login(
  req: Request<{}, {}, IUserLoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { account, password } = req.body;
    const normalizedAccount = account.trim().toLowerCase();

    // 1. Tìm user theo Email hoặc SĐT (TODO: Thay bằng truy vấn CSDL)
    const user = usersDatabase.find(
      (u) => u.email.toLowerCase() === normalizedAccount || u.phone === account.trim()
    );

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác.',
      });
      return;
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác.',
      });
      return;
    }

    // 3. Sinh JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * [GET] /api/auth/me
 * Lấy thông tin user hiện tại từ token đã xác thực
 */
export async function getMe(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.user được gán từ middleware authenticateToken
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin phiên đăng nhập.',
      });
      return;
    }

    // TODO: Có thể truy vấn thêm thông tin chi tiết từ CSDL theo req.user.id
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
}
