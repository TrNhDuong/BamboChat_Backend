# Database Schema: BamboChat System (MongoDB/Mongoose)

Tài liệu này mô tả cấu trúc cơ sở dữ liệu NoSQL được triển khai qua Mongoose cho hệ thống Web Chat. Thiết kế tận dụng các tính năng của MongoDB như TTL indexes và Sparse indexes để tối ưu hiệu suất.

---

## 1. Người dùng & Xác thực (Collections: Users & OTPs)

### Collection `Users`
Lưu trữ thông tin định danh. Sử dụng `id` tùy chọn của người dùng làm khóa chính `_id` (String).

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String (**PK**) | ID người dùng tự chọn (Unique, max 50 chars) |
| `email` | String | Email dùng cho OTP/OAuth (Unique, Index) |
| `passwordHash` | String | Mật khẩu đã băm (Bcrypt) |
| `isVerified` | Boolean | Trạng thái xác thực (Default: false) |
| `displayName` | String | Display name on the UI |
| `bio` | String | Short self-introduction |
| `avatar` | Object | `{ url, public_id }` for profile picture |
| `googleId` | String | ID from Google OAuth (Unique, Sparse Index) |

* **Indexes:** `unique: true` trên `email`, `sparse: true` trên `googleId`.

### Collection `OTPs`
Quản lý mã xác thực ngắn hạn. Tự động xóa sau khi hết hạn bằng TTL Index.

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | String | Email nhận mã (Index) |
| `otpCode` | String | Mã 6 chữ số |
| `expiresAt` | Date | Thời điểm hết hạn |
| `attempts` | Number | Số lần nhập sai (Default: 0) |

* **Indexes:** `idx_otps_email`, TTL index trên `expiresAt`.

---

## 2. Quan hệ & Bạn bè (Collection: Friendships)

Lưu trữ đồ thị quan hệ giữa người dùng.

| Field | Type | Description |
| :--- | :--- | :--- |
| `requesterId` | String (**FK**) | Người gửi yêu cầu kết bạn |
| `addresseeId` | String (**FK**) | Người nhận yêu cầu (Index) |
| `status` | Enum | `pending`, `accepted`, `blocked` |

* **Indexes:** Composite Unique `{ requesterId, addresseeId }` để tránh lời mời trùng lặp.

---

## 3. Hội thoại & Tin nhắn (Collections: Conversations, Participants, Messages)

### Collection `Conversations`
Đại diện cho các phòng chat.

| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | Enum | `direct_message`, `group` |
| `name` | String | Tên nhóm (NULL nếu là chat 1-1) |

### Collection `Participants`
Liên kết người dùng vào hội thoại. Quản lý trạng thái "Đã xem".

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId`| ObjectId(**FK**) | ID phòng chat |
| `userId` | String (**FK**) | ID người dùng (Index) |
| `lastReadMessageId`| String | ID of the last message read |
| `role` | Enum | `admin`, `member` (Controls kick permissions) |

* **Indexes:** Composite Unique `{ conversationId, userId }`.

### Collection `Messages`
Lưu trữ nội dung tin nhắn. Sử dụng UUIDv7 để sắp xếp theo thời gian tự nhiên.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String (**PK**) | Khóa chính (UUIDv7 - Time sortable) |
| `conversationId`| ObjectId(**FK**) | Thuộc phòng chat nào (Index) |
| `senderId` | String (**FK**) | Người gửi tin nhắn |
| `content` | String | Nội dung văn bản |

* **Indexes:** Compound index `{ conversationId: 1, _id: -1 }` cho Pagination.

---

## 4. Đặc điểm Kỹ thuật

1.  **UUIDv7 & Pagination:** Bảng `Messages` sử dụng UUIDv7 thay vì ObjectId mặc định để đảm bảo các tin nhắn luôn được sắp xếp theo thời gian gửi ngay cả khi phân tán, hỗ trợ **Cursor-based Pagination** mượt mà.
2.  **Watermark Read Receipts:** Trạng thái "Đã xem" không lưu theo từng tin nhắn mà lưu con trỏ `lastReadMessageId` trong `Participants`.
3.  **Custom _id:** Việc sử dụng String `_id` cho `Users` giúp việc tìm kiếm bằng tên người dùng (id) trở nên trực tiếp và nhanh chóng hơn.
