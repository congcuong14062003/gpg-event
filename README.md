# GPG Solar — Website phục vụ sự kiện

Website dành cho khách hàng quét QR Code tại sự kiện, chọn sản phẩm năng lượng mặt trời và đăng ký nhận tư vấn. Dữ liệu đăng ký được ghi trực tiếp vào Google Sheets — không cần database, không cần admin.

## Luồng khách hàng

```
QR Code → /products → Chọn sản phẩm → /cart → Nhập thông tin → Đăng ký → Google Sheets → /success
```

## Tính năng

- Danh sách sản phẩm với tìm kiếm và lọc theo danh mục
- Trang chi tiết sản phẩm với thông số kỹ thuật
- Giỏ hàng lưu trên trình duyệt (localStorage), giữ lại khi tải lại trang
- Form đăng ký ngắn gọn (chỉ cần họ tên + số điện thoại)
- Tính giá và tổng tiền phía server (không tin tưởng dữ liệu từ trình duyệt)
- Ghi đơn hàng vào Google Sheets (2 sheet: Orders & OrderItems)
- Trang đăng ký thành công kèm mã đơn hàng
- Giao diện mobile-first, tối ưu cho sự kiện

## Cài đặt

```bash
npm install
```

## Cấu hình Google Sheets

1. **Tạo Google Cloud Project**
   - Truy cập https://console.cloud.google.com/
   - Tạo project mới hoặc chọn project có sẵn.

2. **Enable Google Sheets API**
   - Vào **APIs & Services → Library**
   - Tìm "Google Sheets API" và nhấn **Enable**.

3. **Tạo Service Account**
   - Vào **APIs & Services → Credentials**
   - Nhấn **Create Credentials → Service Account**
   - Đặt tên và tạo.

4. **Tạo credentials (JSON key)**
   - Mở service account vừa tạo
   - Tab **Keys → Add Key → Create new key → JSON**
   - Tải file JSON về máy.

5. **Lấy client email**
   - Trong file JSON, tìm trường `client_email`.

6. **Lấy private key**
   - Trong file JSON, tìm trường `private_key`.
   - Giữ nguyên các ký tự `\n`.

7. **Tạo Google Sheet**
   - Tạo một Google Spreadsheet mới.
   - Đặt tên 2 sheet: `Orders` và `OrderItems` (có thể để trống, app sẽ tự tạo header).

8. **Share Google Sheet cho Service Account**
   - Nhấn **Share** trên Google Sheet
   - Dán `client_email` từ bước 5
   - Cấp quyền **Editor**

9. **Lấy Spreadsheet ID**
   - Xem trên URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

10. **Cấu hình biến môi trường**
    ```bash
    cp .env.example .env
    ```
    Điền 3 giá trị:
    ```env
    GOOGLE_SHEET_ID="your-spreadsheet-id"
    GOOGLE_CLIENT_EMAIL="your-service-account-email"
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    ```

> **Lưu ý:** Không commit file `.env`. File `.env.example` chỉ là mẫu.

## Chạy development

```bash
npm run dev
```

Mở http://localhost:3000 — sẽ tự chuyển hướng tới `/products`.

## Build & Production

```bash
npm run build
npm start
```

## Chạy trên Linux bằng Docker

Sao chép file `.env.example` thành `.env.local` trên máy chủ và điền thông tin Google Sheets. Không đưa file này vào Git.

```bash
docker compose up -d --build
```

Website chạy ở cổng `3000`. Kiểm tra log bằng:

```bash
docker compose logs -f web
```

Hoặc không dùng Docker Compose:

```bash
docker build -t gpg-solar .
docker run -d --name gpg-solar --restart unless-stopped -p 3000:3000 --env-file .env.local gpg-solar
```

## Cấu trúc dự án

```
src/
├── app/
│   ├── products/
│   │   ├── page.tsx          # Danh sách sản phẩm
│   │   ├── loading.tsx       # Skeleton
│   │   └── [slug]/page.tsx   # Chi tiết sản phẩm
│   ├── cart/page.tsx         # Giỏ hàng + form đăng ký
│   ├── success/page.tsx      # Đăng ký thành công
│   ├── api/register/route.ts # API ghi đơn hàng
│   ├── page.tsx              # Redirect → /products
│   ├── layout.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── product/
│   ├── cart/
│   ├── ui/
│   ├── site-header.tsx
├── data/products.ts          # Dữ liệu sản phẩm (static)
├── lib/
│   ├── google-sheets.ts      # Google Sheets helper
│   ├── order.ts              # Tính giá, mã đơn hàng
│   ├── validation.ts         # Zod schemas
│   └── format.ts
└── types/index.ts
```

## Chỉnh sửa sản phẩm

Mở `data/products.ts` và thêm/sửa các object `Product`. Không cần database.

## Cột Google Sheet

### Sheet `Orders`

| orderCode | createdAt | customerName | phone | email | company | address | note | totalAmount | status |
|-----------|-----------|--------------|-------|-------|---------|---------|------|-------------|--------|

### Sheet `OrderItems`

| orderCode | productId | productName | productCode | quantity | unitPrice | totalPrice |
|-----------|-----------|-------------|-------------|----------|-----------|------------|
