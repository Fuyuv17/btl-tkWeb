# 🍔 Express.js Backend (TypeScript Edition)

> **Khung Backend RESTful API thuần TypeScript không phụ thuộc trước database hoặc file mock data.**
> Bạn có thể tùy chọn kết nối bất kỳ cơ sở dữ liệu nào (MongoDB Mongoose, MySQL, PostgreSQL, Prisma, TypeORM,...) dựa trên các vị trí `// TODO:` có sẵn trong controller.

---

## ⚡ 1. Lệnh Vận Hành Bằng `npx`

```bash
# 1. Chuyển vào thư mục backend
cd backend

# 2. Cài đặt các gói thư viện
npx -y npm install

# 3. Khởi chạy server ở chế độ Development (tự reload khi sửa code)
npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/server.ts

# Hoặc dùng script đã cấu hình trong package.json
npx npm run dev

# 4. Biên dịch sang JavaScript thuần
npx tsc

# 5. Chạy bản build production
node dist/server.js
```

---

## 📁 2. Cấu Trúc Thư Mục TypeScript

```text
backend/
├── src/
│   ├── controllers/          # Tầng xử lý logic nghiệp vụ
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   └── orderController.ts
│   ├── middleware/           # Tầng chốt chặn kiểm tra
│   │   ├── auth.ts           # ⭐ Middleware xác thực JWT (authenticateToken, authorizeRoles)
│   │   ├── validate.ts       # Kiểm tra dữ liệu đầu vào (Regex Phone/Email/Pass)
│   │   └── errorHandler.ts   # Bắt lỗi 404 và 500 tập trung
│   ├── routes/               # Tầng định tuyến API
│   │   ├── authRoutes.ts     # /api/auth
│   │   ├── productRoutes.ts  # /api/products
│   │   ├── cartRoutes.ts     # /api/cart
│   │   └── orderRoutes.ts    # /api/orders
│   ├── types/                # Tầng định nghĩa Type & Interface
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   ├── express.d.ts
│   │   └── index.ts
│   ├── utils/                # Tiện ích bổ trợ
│   │   └── generateToken.ts  # Ký và xác thực JWT
│   └── server.ts             # Điểm khởi chạy Express Server
├── .env                      # Cấu hình biến môi trường
├── .env.example              # Mẫu biến môi trường
├── package.json              # Khai báo dependencies
└── tsconfig.json             # Cấu hình TypeScript Compiler
```
