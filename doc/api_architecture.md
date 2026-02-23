# Kiến trúc Phần mềm & API: BamboChat System

Tài liệu này định nghĩa kiến trúc tổng thể, cấu trúc thư mục và danh sách các API/Sự kiện WebSocket cho dự án BamboChat. Hệ thống áp dụng mô hình phân lớp **Controller - Service - Repository** để đảm bảo tính module hóa và dễ bảo trì.

---

## 1. Mô hình Kiến trúc (Architecture Pattern)

Hệ thống được chia thành 4 lớp cốt lõi:

1.  **Routing / Gateway:** Sử dụng `express.Router` để định nghĩa các endpoint và áp dụng `authMiddleware` (JWT) để bảo vệ các tài nguyên riêng tư.
2.  **Controller Layer:** Xử lý các HTTP Request/Response, validate dữ liệu đầu vào cơ bản và gọi xuống Service Layer.
3.  **Service Layer (Business Logic):** Chứa các logic nghiệp vụ phức tạp (ví dụ: xử lý gửi lời mời kết bạn, kiểm tra phòng chat tồn tại).
4.  **Repository Layer:** Tương tác trực tiếp với MongoDB thông qua Mongoose Models.

---

## 2. Danh sách RESTful API

Tất cả các API (ngoại trừ Auth) đều yêu cầu Header: `Authorization: Bearer <token>`.

### A. Xác thực (Authentication) - `/api/auth`

| Method | Endpoint | Nhiệm vụ | Ghi chú |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Đăng ký tài khoản | Chờ xác thực OTP qua email. |
| POST | `/verify-otp` | Xác thực OTP | Cần mã OTP 6 số và email. |
| POST | `/login` | Đăng nhập | Trả về Access Token & Refresh Token. |
| GET | `/google` | Login Google | Chuyển hướng tới Google Login. |
| GET | `/google/callback`| Xử lý Google Callback | Trả về token qua URL params. |

### B. Người dùng (Users) - `/api/users`

| Method | Endpoint | Nhiệm vụ | Ghi chú |
| :--- | :--- | :--- | :--- |
| GET | `/search` | Search for users | By `id` (query param). |
| PUT | `/profile` | Update profile | Change `displayName`, `bio`. |
| POST | `/avatar` | Upload avatar | Multer-based image upload. |

### C. Bạn bè (Friends) - `/api/friends`

| Method | Endpoint | Nhiệm vụ | Ghi chú |
| :--- | :--- | :--- | :--- |
| GET | `/` | Lấy danh sách bạn bè | Trả về mảng `userId`. |
| GET | `/requests/pending`| Lời mời đã nhận | Các yêu cầu đang chờ xử lý. |
| GET | `/requests/sent` | Lời mời đã gửi | Các yêu cầu bạn đã gửi đi. |
| POST | `/requests` | Gửi lời mời kết bạn | Cần truyền `addresseeId`. |
| PUT | `/requests/:id` | Chấp nhận/Từ chối | `action: 'accept' / 'reject'`. |
| DELETE | `/:id` | Hủy kết bạn | Xóa quan hệ bạn bè. |

### D. Hội thoại (Conversations) - `/api/conversations`

| Method | Endpoint | Nhiệm vụ | Ghi chú |
| :--- | :--- | :--- | :--- |
| POST | `/` | Create/Get conversation | For 1-1 and Group chats. |
| GET | `/` | Get conversation list | Lists rooms with the last message. |
| GET | `/:id/messages` | Get message history | Supports pagination via `cursor`. |
| POST | `/:id/participants` | Add members | Add multiple users to a group. |
| DELETE | `/:id/participants/:userId` | Kick participant | Admin-only removal of member. |

---

## 3. WebSocket Events (Socket.io)

### Client Emit (Gửi lên)
*   **`send_message`**: `{ conversationId, content }`
*   **`join_conversation`**: `{ conversationId }`
*   **`typing`**: `{ conversationId, isTyping }`

### Client Listen (Nhận về)
*   **`receive_message`**: `{ _id, conversationId, senderId, content, createdAt }`
*   **`connect_error` / `disconnect`**: Quản lý trạng thái kết nối.

---

## 4. Middleware & Xử lý lỗi
*   **`authMiddleware`**: Kiểm tra tính hợp lệ của JWT trong Header. Nếu hết hạn hoặc sai, trả về lỗi 401.
*   **`errorHandler`**: Middleware tập trung xử lý mọi lỗi phát sinh trong quá trình chạy, trả về JSON chuẩn `{ message, status }`.
