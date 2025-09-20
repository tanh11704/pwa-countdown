# PWA Event Countdown

Một Progressive Web App hiện đại giúp bạn quản lý và nhận thông báo cho các sự kiện quan trọng với bộ đếm ngược trực quan.

## 📝 Mô tả dự án

**PWA Event Countdown** là ứng dụng web giàu tính năng cho phép người dùng tạo và quản lý các bộ đếm ngược cho nhiều loại sự kiện. Ứng dụng được xây dựng bằng **React** và các công nghệ web hiện đại, có thiết kế responsive, hoạt động **offline**, và hỗ trợ **thông báo trình duyệt**.

## 🎯 Tính năng chính

### 1) Quản lý sự kiện

- Tạo, sửa, xoá sự kiện đếm ngược.
- Phân loại sự kiện bằng biểu tượng (Work 💼, Personal 👤, Birthday 🎂, …).
- Ghi chú/mô tả chi tiết cho từng sự kiện.
- Bộ chọn ngày giờ tuỳ chỉnh.

### 2) Hệ thống thông báo

- Chọn thời điểm nhắc: **5 phút**, **15 phút**, **30 phút**, **1 giờ** trước sự kiện.
- Gửi **thông báo trình duyệt** khi đến hạn.
- Quản lý quyền thông báo (xin/cấp quyền).

### 3) Hỗ trợ giao diện (Theme)

- **Light/Dark mode**.
- Tự động nhận diện theme theo **hệ thống**.
- Ghi nhớ lựa chọn theme của người dùng.

### 4) Tính năng PWA

- **Cài đặt** trên desktop & mobile (Add to Home Screen).
- **Hoạt động ngoại tuyến** (offline).
- **Tự động cập nhật** khi có phiên bản mới.
- Giao diện **responsive** đẹp trên mọi kích thước.

## 🏗️ Cấu trúc dự án (rút gọn)

```text
.
├─ public/
│  └─ icons/            # (Khuyến nghị) icon PNG 192/512
├─ src/
│  ├─ components/
│  ├─ constants/
│  │  └─ constans.js    # Hằng số ứng dụng (đang dùng tên file này)
│  ├─ hooks/
│  │  ├─ useLocalStorage.js
│  │  └─ useTheme.js
│  ├─ utils/
│  │  ├─ db.js
│  │  └─ helper.js
│  ├─ App.jsx
│  ├─ index.css
│  ├─ main.jsx
│  └─ sw.js             # Service Worker cho PWA
├─ index.html
├─ vite.config.js
└─ package.json
```

## 🛠️ Công nghệ sử dụng

- **Frontend Framework:** React
- **Build Tool:** Vite
- **CSS:** Tailwind CSS
- **PWA:** vite-plugin-pwa
- **Lưu trữ:** LocalStorage
- **Quản lý trạng thái:** React Hooks + Context

> Lưu ý: Ứng dụng chính dùng LocalStorage để lưu dữ liệu người dùng; phần Service Worker có thể dùng IndexedDB để phục vụ các tác vụ nền (ví dụ nhắc lịch).

## 📥 Cài đặt

```bash
# 1) Clone mã nguồn
git clone <repository-url>
cd pwa_event_countdown

# 2) Cài đặt phụ thuộc
npm install

# 3) Chạy môi trường phát triển
npm run dev

# 4) Build sản phẩm
npm run build

# 5) Xem trước bản build (tùy chọn)
npm run preview
```

## 🚀 Sử dụng

### Tạo sự kiện

1. Nhấn nút **"+"**.
2. Điền thông tin: tên, ngày giờ, danh mục (icon), ghi chú.
3. Bật **Nhắc thông báo** nếu muốn và chọn thời điểm nhắc.
4. Nhấn **Create Event**.

### Quản lý sự kiện

- Danh sách sự kiện hiển thị ở trang chính.
- Nhấp vào một sự kiện để **chỉnh sửa** hoặc **xoá**.
- Dùng **Bottom Navigation** để chuyển giữa các màn hình.

### Cài đặt

- Chuyển **Light/Dark**.
- Xoá toàn bộ dữ liệu.
- Quản lý quyền thông báo trình duyệt.

## 💾 Lưu trữ dữ liệu

Ứng dụng lưu các thông tin sau trong **LocalStorage**:

- Danh sách sự kiện.
- Tuỳ chọn theme.
- Cài đặt nhắc thông báo.

## 🌐 Tính năng PWA

- **Offline:** Ứng dụng hoạt động khi không có internet.
- **Installable:** Có thể cài lên màn hình chính.
- **Auto Updates:** Tự động cập nhật phiên bản mới.
- **Push Notifications:** Nhắc sự kiện (yêu cầu người dùng cấp quyền thông báo).

## ⚙️ Tệp cấu hình quan trọng

- `vite.config.js`: Cấu hình PWA và build.
- `tailwind.config.js`: Cấu hình theme & tiện ích CSS.
- `src/constants/constans.js`: Hằng số ứng dụng.

## 📱 Trình duyệt hỗ trợ

- **Chrome** (Desktop & Mobile)
- **Firefox**
- **Safari**
- **Edge**
