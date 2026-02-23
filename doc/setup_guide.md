# Hướng dẫn Cài đặt & Chạy dự án (Setup Guide)

Tài liệu này hướng dẫn bạn cách thiết lập môi trường và chạy dự án BamboChat trên máy cục bộ (Local).

---

## 1. Yêu cầu Hệ thống (Prerequisites)

*   **Node.js**: Phiên bản 16.x trở lên.
*   **MongoDB**: Có sẵn một Cluster trên MongoDB Atlas hoặc chạy MongoDB cục bộ.
*   **npm**: Thường đi kèm với Node.js.

---

## 2. Thiết lập Backend

1.  **Di chuyển vào thư mục backend**:
    ```bash
    cd backend
    ```
2.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```
3.  **Cấu hình biến môi trường (.env)**:
    Tạo hoặc chỉnh sửa file `.env` trong thư mục `backend/` với các giá trị sau:
    ```env
    PORT=5000
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_secure_random_string"
    JWT_REFRESH_SECRET="your_another_secure_string"
    JWT_EXPIRES_IN=15m
    JWT_REFRESH_EXPIRES_IN=7d

    # Gửi Email qua Brevo (để dùng OTP)
    BREVO_API_KEY="your_brevo_api_key"
    BREVO_URL="https://api.brevo.com/v3/smtp/email"

    # Google OAuth (để đăng nhập bằng Google)
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    ```
4.  **Chạy Backend**:
    *   Chế độ phát triển (Auto-reload): `npm run dev`
    *   Chế độ chính thức: `npm start`

---

## 3. Thiết lập Frontend

1.  **Di chuyển vào thư mục frontend**:
    ```bash
    cd frontend
    ```
2.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```
3.  **Cấu hình**:
    Hiện tại Frontend đang kết nối mặc định tới `http://localhost:5000/api`. Nếu bạn đổi cổng backend, hãy cập nhật trong `src/services/api.ts` và `src/services/socket.ts`.
4.  **Chạy Frontend**:
    ```bash
    npm run dev
    ```
    Mặc định ứng dụng sẽ chạy tại: `http://localhost:5173`

---

## 4. Các lưu ý quan trọng

*   **Google OAuth**: Khi tạo Credentials trên Google Cloud, hãy đảm bảo đã thêm `http://localhost:5000/api/auth/google/callback` vào danh sách **Authorized redirect URIs**.
*   **Cơ sở dữ liệu**: Đảm bảo Network Access trên MongoDB Atlas đã cho phép địa chỉ IP của bạn.
