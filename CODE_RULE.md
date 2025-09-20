# PWA Countdown Timer: Coding Rules & Best Practices

Chào mừng các bạn interns! Để đảm bảo project "PWA Countdown Timer" của chúng ta có chất lượng cao nhất, dễ bảo trì và mở rộng, tất cả chúng ta sẽ tuân thủ theo bộ quy tắc code (coding rules) dưới đây. Hãy đọc kỹ và áp dụng một cách nhất quán.

## 1. General Principles (Nguyên tắc chung)

- **KISS (Keep It Simple, Stupid)**: Ưu tiên giải pháp đơn giản và dễ hiểu. Đừng phức tạp hóa vấn đề một cách không cần thiết.
- **DRY (Don't Repeat Yourself)**: Tránh lặp lại code. Tận dụng tối đa component, utility function và hằng số.
- **Single Responsibility Principle (SRP)**: Mỗi component hoặc function chỉ nên làm một việc và làm tốt việc đó.
- **Code for Humans**: Viết code cho người khác (và chính bạn trong tương lai) đọc. Code cần rõ ràng, có comment khi cần thiết và tuân thủ convention.

---

## 2. Project Structure (Cấu trúc dự án)

Chúng ta sẽ theo cấu trúc feature-based để dễ dàng quản lý và tìm kiếm code.

```bash
src/
├── assets/         # Chứa fonts, images, svgs...
├── components/     # Chứa các UI components tái sử dụng
│   ├── common/     # Các component chung (Button, Input, Modal...)
│   ├── layout/     # Các component layout (Header, Footer, Sidebar...)
│   └── ui/         # Các component UI nhỏ lẻ khác
├── constants/      # Chứa các hằng số (API endpoints, routes, config keys...)
│   └── index.js
├── hooks/          # Chứa các custom React hooks
│   ├── useLocalStorage.js
│   └── ...
├── pages/          # Các trang chính của ứng dụng
│   ├── HomePage/
│   │   ├── index.jsx
│   │   └── HomePage.module.css  # (Nếu cần CSS Modules)
│   └── ...
├── services/       # Xử lý logic nghiệp vụ, gọi API
│   └── notificationService.js
├── styles/         # Chứa file CSS global
│   └── index.css
├── utils/          # Chứa các utility functions (format date, validation...)
│   └── dateUtils.js
├── App.jsx
├── main.jsx
└── service-worker.js # (Cấu hình PWA)
```

## 3. Naming Conventions (Quy tắc đặt tên)

- **Components**: Dùng PascalCase. Ví dụ: EventCard.jsx, CountdownDisplay.jsx.
- **Files & Folders**: Ưu tiên PascalCase cho các thư mục chứa component và file component. Ví dụ: thư mục EventCard chứa file EventCard.jsx.
- **Variables & Functions**: Dùng camelCase. Ví dụ: const eventDate, function calculateTimeLeft().
- **Constants**: Dùng UPPER_SNAKE_CASE. Ví dụ: const MAX_EVENTS = 10;.
- **Custom Hooks**: Bắt đầu bằng use. Ví dụ: useCountdown.js.
- **CSS Classes (Tailwind)**: Viết trực tiếp trong className. Không cần quy tắc đặc biệt, nhưng hãy giữ cho thứ tự các class được sắp xếp một cách logic (xem phần Tailwind CSS).

## 4. React Best Practices

- **Functional Components & Hooks**: Chỉ sử dụng functional components với React Hooks. Không dùng Class Components.
- **Props Destructuring**: Luôn phân rã (destructure) props ở đầu function.
- **PropTypes**: Sử dụng prop-types để xác thực kiểu dữ liệu của props, giúp phát hiện lỗi sớm.
- **File index.jsx vs. ComponentName.jsx**: Để đơn giản, đặt tên file component là ComponentName.jsx. Sử dụng index.js trong thư mục component để export.
- **Component Logic**: Tách biệt logic phức tạp ra khỏi JSX bằng cách sử dụng custom hooks hoặc utility functions.
- **State Management**:
- **_useState_**: Dùng cho state đơn giản, cục bộ trong một component.
- **_useReducer_**: Dùng cho state phức tạp hoặc khi state tiếp theo phụ thuộc vào state trước đó.
- **_Context API / Zustand_**: Đối với global state (ví dụ: danh sách các sự kiện), chúng ta sẽ dùng Zustand để quản lý state một cách hiệu quả và tránh re-render không cần thiết. Tránh dùng Context cho các state cập nhật thường xuyê
- **Custom Hooks**: Tạo custom hook để tái sử dụng logic (ví dụ: useLocalStorage để lưu sự kiện, useCountdown để xử lý logic đếm ngược). Điều này giúp component gọn gàng và tập trung vào việc render UI.

## 5. Styling with Tailwind CSS v4

- **Utility-First**: Tận dụng tối đa các utility class của Tailwind. Hạn chế viết CSS tùy chỉnh.
- **Class Ordering**: Sắp xếp các class một cách logic để dễ đọc. Quy tắc gợi ý: Layout & Box Model → Typography → Backgrounds & Borders → Effects → Transitions & Animations.
- **_Sai_**: className="text-white p-4 rounded-lg bg-blue-500 font-bold"
- **_Đúng_**: className="p-4 bg-blue-500 rounded-lg font-bold text-white"
- **Responsive Design**: Luôn sử dụng các prefix responsive của Tailwind (sm:, md:, lg:) để đảm bảo giao diện hoạt động tốt trên mọi thiết bị.
- **Component Classes with @apply**: Chỉ sử dụng @apply trong file CSS global (src/styles/index.css) cho các class dùng chung ở nhiều nơi và không thể tạo component (ví dụ: btn-primary). Hạn chế lạm dụng.

## 6. Icons & Animation

- Sử dụng component FontAwesomeIcon từ thư viện @fortawesome/react-fontawesome.

- Chỉ import những icon cần thiết để giảm kích thước bundle. Tạo một file quản lý icon tập trung.

- **Framer Motion**:
  Sử dụng framer-motion để tạo các animation mượt mà và có ý nghĩa.
  Bao bọc các element cần animation bằng component motion. Ví dụ: motion.div.
  Tận dụng các props như initial, animate, exit, whileHover, whileTap, variants để định nghĩa animation.
  Giữ cho animation đơn giản và không gây mất tập trung cho người dùng.

## 7. PWA & Offline First

- **Service Worker**: Cấu hình service worker (Vite PWA plugin được khuyến khích) để cache các assets quan trọng (HTML, CSS, JS, images, fonts).
- **Caching Strategy**: Sử dụng chiến lược "Cache First" cho static assets và "Network First" (hoặc "Stale While Revalidate") cho dữ liệu động (danh sách sự kiện).
- **Offline Data**: Dữ liệu sự kiện của người dùng phải được lưu vào LocalStorage hoặc IndexedDB để có thể truy cập và chỉnh sửa khi không có mạng.
- **UI/UX Offline**: Phải có chỉ báo rõ ràng cho người dùng biết họ đang ở chế độ offline. Các chức năng yêu cầu mạng (nếu có) phải được vô hiệu hóa.
