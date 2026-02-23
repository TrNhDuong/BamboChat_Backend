# Luồng Xác thực (Authentication Flow)

BamboChat hỗ trợ hai phương thức xác thực chính: Đăng nhập truyền thống (ID/Password + OTP) và Đăng nhập qua bên thứ ba (Google OAuth2).

---

## 1. Xác thực truyền thống (ID/Password)

Hệ thống sử dụng cơ chế xác thực từng bước để đảm bảo tính an toàn:

1.  **Đăng ký (Register)**:
    *   User nhập ID, Email, Password.
    *   Backend lưu User với trạng thái `isVerified = false`.
    *   Backend sinh mã OTP 6 số và gửi qua Email (sử dụng Brevo).
2.  **Xác thực mã (Verify OTP)**:
    *   User nhập mã OTP nhận được từ Email.
    *   Backend kiểm tra mã và cập nhật `isVerified = true`.
3.  **Đăng nhập (Login)**:
    *   User sử dụng ID và Password.
    *   Hệ thống trả về **Access Token** (ngắn hạn) và **Refresh Token** (dài hạn).
    *   Access Token được đính kèm vào Header `Authorization: Bearer <token>` cho mọi request sau đó.

---

## 2. Google OAuth2

Tích hợp thông qua thư viện `passport-google-oauth20`:

*   **Khởi tạo**: Frontend gọi `GET /api/auth/google`.
*   **Redirect**: Backend chuyển hướng User tới trang đăng nhập của Google.
*   **Callback**: Sau khi thành công, Google gọi về `/api/auth/google/callback`.
*   **Xử lý tại Backend**:
    *   Nếu User đã tồn tại (khớp Email hoặc Google ID): Đăng nhập ngay.
    *   Nếu User chưa tồn tại: Tự động tạo tài khoản mới với mật khẩu mặc định.
*   **Trả kết quả**: Backend redirect User về Frontend kèm theo các Token trên thanh URL. Frontend sẽ lưu Token vào `localStorage` và chuyển vào trang Chat.

---

## 3. Bảo mật Token

*   **Access Token**: Hết hạn sau 15 phút. Lưu trong bộ nhớ hoặc `localStorage`.
*   **Refresh Token**: Hết hạn sau 7 ngày. Dùng để lấy Access Token mới mà không cần đăng nhập lại.
*   **Socket Authentication**: Khi kết nối WebSocket, Token cũng được gửi kèm trong phần `auth` của Socket.io client để xác định danh tính User.
