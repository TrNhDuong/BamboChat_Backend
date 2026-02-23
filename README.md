# BamboChat - Hệ thống Nhắn tin Thời gian thực

BamboChat là một ứng dụng nhắn tin hiện đại, hỗ trợ trò chuyện thời gian thực, quản lý bạn bè và đăng nhập linh hoạt.

---

## Tính năng chính

*   **Trò chuyện Real-time**: Gửi và nhận tin nhắn tức thì bằng WebSocket (Socket.io).
*   **Xác thực đa năng**: Hỗ trợ đăng nhập bằng tài khoản (xác thực OTP qua Email) hoặc Google OAuth2.
*   **Quản lý Bạn bè**: Tìm kiếm người dùng, gửi lời mời kết bạn và quản lý danh sách liên lạc.
*   **Hội thoại**: Hỗ trợ chat 1-1 và tương lai mở rộng sang chat nhóm.
*   **Giao diện hiện đại**: Thiết kế tối giản, hiệu ứng mượt mà và hỗ trợ Dark Mode.

---

## Công nghệ sử dụng

### Backend
*   **Node.js & Express**: Máy chủ API.
*   **MongoDB & Mongoose**: Cơ sở dữ liệu NoSQL.
*   **Passport.js**: Xử lý Google OAuth2.
*   **Socket.io**: Giao tiếp thời gian thực.
*   **Brevo SDK**: Gửi email OTP.

### Frontend
*   **React (Vite)**: Framework giao diện.
*   **TypeScript**: Đảm bảo an toàn kiểu dữ liệu.
*   **Socket.io Client**: Kết nối WebSocket.
*   **Vanilla CSS**: Hệ thống Design System tùy chỉnh.

---

## Cấu trúc Thư mục

Dự án được tổ chức theo mô hình Monorepo đơn giản với hai thành phần chính:

```text
.
├── backend/                # Mã nguồn Server (Node.js/Express)
│   ├── src/
│   │   ├── config/         # Cấu hình DB, Passport, App
│   │   ├── controllers/    # Xử lý Logic cho các Route
│   │   ├── middlewares/    # Các bộ lọc (Auth, Error Handler)
│   │   ├── models/         # Định nghĩa Schema MongoDB (Mongoose)
│   │   ├── repositories/   # Tầng truy vấn dữ liệu trực tiếp
│   │   ├── routes/         # Định nghĩa các API endpoints
│   │   ├── services/       # Logic nghiệp vụ (Business Logic)
│   │   ├── sockets/        # Xử lý sự kiện Real-time (Socket.io)
│   │   ├── utils/          # Công cụ hỗ trợ (Mailler, UUIDv7...)
│   │   └── server.js       # Điểm khởi đầu của Backend
│   └── .env                # Biến môi trường Backend
├── frontend/               # Mã nguồn Client (React/Vite)
│   ├── src/
│   │   ├── components/     # UI Components dùng chung
│   │   ├── context/        # Quản lý State toàn cục (AuthContext)
│   │   ├── pages/          # Các trang giao diện chính (Login, Chat...)
│   │   ├── services/       # Gọi API và quản lý Socket
│   │   └── App.tsx         # Cấu trúc Routing chính
│   └── index.html          # File HTML gốc
├── doc/                    # Thư mục chứa tài liệu kỹ thuật
└── README.md               # Tài liệu tổng quan dự án
```

---

## Tài liệu chi tiết

Để hiểu sâu hơn về dự án, vui lòng tham khảo các tài liệu trong thư mục `doc/`:

1.  [**Hướng dẫn Cài đặt (Setup Guide)**](doc/setup_guide.md): Cách chạy dự án trên máy của bạn.
2.  [**Kiến trúc API (API Architecture)**](doc/api_architecture.md): Danh sách các Endpoint và mô hình phân lớp.
3.  [**Thiết kế Database (Database Design)**](doc/database_design.md): Cấu trúc các bảng và mối quan hệ.
4.  [**Luồng Xác thực (Authentication)**](doc/authentication.md): Chi tiết về JWT và Google Login.
5.  [**Luồng WebSocket (WebSocket Flow)**](doc/websocket_flow.md): Cách hoạt động của tin nhắn thời gian thực.

---

## Giấy phép

Dự án này được phát triển cho mục đích học tập và cá nhân.
