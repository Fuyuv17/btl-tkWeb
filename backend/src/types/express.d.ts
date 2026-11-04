/**
 * types/express.d.ts
 * Mở rộng Interface Request của Express để hỗ trợ req.user có định kiểu chặt chẽ
 */

import { IUserPayload } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
