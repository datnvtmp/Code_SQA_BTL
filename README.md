# 🍳 CookPad - Ứng dụng Nấu ăn & Chia sẻ Công thức

## 📋 Mô tả dự án

CookPad là ứng dụng web chia sẻ công thức nấu ăn, cho phép người dùng:
- Tạo, chia sẻ và quản lý công thức nấu ăn
- Tìm kiếm công thức theo danh mục, nguyên liệu
- Đặt mua món ăn từ các đầu bếp (CHEF)
- Thanh toán qua VNPay
- Tương tác: bình luận, thích, theo dõi
- Chat AI hỗ trợ nấu ăn (tích hợp Groq AI)

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| **Backend** | Spring Boot (Java) | 3.5.6 |
| **Frontend** | Next.js (React + TypeScript) | 16.0.10 |
| **Database** | MySQL | 9.x |
| **Java** | OpenJDK | 21 |
| **Node.js** | Node.js | 24.x |
| **CSS** | Tailwind CSS | 3.4.x |
| **State Management** | Zustand | 5.x |
| **API Client** | Axios + TanStack React Query | - |
| **AI** | Spring AI + Groq API | - |
| **Search** | MeiliSearch | - |
| **Payment** | VNPay Sandbox | - |

## 📁 Cấu trúc dự án

```
CookpadOri/
├── Backend/
│   └── BE_Cooking-main/
│       └── cooking/              # Spring Boot project
│           ├── src/
│           │   └── main/
│           │       ├── java/     # Source code Java
│           │       └── resources/
│           │           └── application.yml  # Cấu hình ứng dụng
│           ├── pom.xml           # Maven dependencies
│           └── mvnw.cmd          # Maven wrapper (Windows)
├── DATN/
│   └── TotNghiep-main/          # Next.js project
│       ├── app/                  # App Router (Next.js)
│       ├── components/           # React components
│       ├── api/                  # API routes
│       ├── services/             # API services
│       ├── store/                # Zustand stores
│       ├── .env.local            # Biến môi trường
│       └── package.json          # Node.js dependencies
├── cooking_db_backup.sql         # File backup database
└── README.md                     # File này
```

## ⚙️ Yêu cầu hệ thống

- **Java JDK 21** trở lên
- **Node.js 20+** (khuyến nghị 24.x)
- **MySQL 8.0+** (khuyến nghị 9.x)
- **Git**
- Hệ điều hành: Windows 10/11

## 🚀 Hướng dẫn cài đặt & chạy dự án

### Bước 1: Cài đặt MySQL

1. Tải và cài đặt MySQL từ [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)
2. Đặt password cho user `root` là `123456` (hoặc tùy chỉnh)

### Bước 2: Tạo Database & Import dữ liệu

Mở **Command Prompt** hoặc **PowerShell**, chạy lần lượt:

```bash
# Tạo database
"C:\Program Files\MySQL\MySQL Server 9.3\bin\mysql.exe" -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS cooking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"

# Import dữ liệu từ file backup
# Cách 1: Dùng CMD
cmd /c ""C:\Program Files\MySQL\MySQL Server 9.3\bin\mysql.exe" -u root -p123456 cooking_db < cooking_db_backup.sql"

# Cách 2: Dùng PowerShell
Get-Content cooking_db_backup.sql | & "C:\Program Files\MySQL\MySQL Server 9.3\bin\mysql.exe" -u root -p123456 cooking_db
```

> **⚠️ Lưu ý:** Đường dẫn MySQL có thể khác tùy phiên bản cài đặt. Hãy thay đổi cho phù hợp.

### Bước 3: Cấu hình Backend

Mở file `Backend/BE_Cooking-main/cooking/src/main/resources/application.yml` và kiểm tra:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cooking_db
    username: root
    password: 123456    # ← Thay bằng password MySQL của bạn
```

### Bước 4: Cấu hình khóa (API Key) cho AI
Vì lý do bảo mật, mã khóa API không được tải lên Github. Khi clone dự án về, bạn cần:
1. Tạo một file tên là `.env` nằm ở thư mục `Backend/BE_Cooking-main/cooking/`
2. Mở file `.env` đó ra và dán nội dung sau vào:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxx
```
*(Thay `gsk_xxxx` bằng key thật do chủ dự án cung cấp hoặc tự đăng ký tại groq.com).*

### Bước 5: Chạy Backend (Spring Boot)

```bash
# Di chuyển đến thư mục Backend
cd Backend/BE_Cooking-main/cooking

# Chạy ứng dụng Spring Boot
./mvnw.cmd spring-boot:run
```

Đợi đến khi thấy dòng log:
```
Started CookingApplication in X seconds
Tomcat started on port 8080
```

✅ Backend sẽ chạy tại: **http://localhost:8080**

### Bước 6: Cấu hình Frontend

File `.env.local` tại `DATN/TotNghiep-main/.env.local` đã được cấu hình sẵn:

```env
NEXT_PUBLIC_API_HOST=http://localhost:8080
NEXT_PUBLIC_API_DATA=http://localhost:3001
```

### Bước 7: Chạy Frontend (Next.js)

```bash
# Di chuyển đến thư mục Frontend
cd DATN/TotNghiep-main

# Cài đặt dependencies (chỉ cần lần đầu)
npm install

# Chạy ứng dụng
npm run dev
```

✅ Frontend sẽ chạy tại: **http://localhost:3000**

## 🔑 Tài khoản mặc định

| Vai trò | Email/Username | Mật khẩu |
|---|---|---|
| **Admin** | `admin` | `admin12345` |
| **User** | `ninh@test.com` | `admin12345` |

> **Ghi chú:** Tất cả tài khoản đều dùng cùng một password hash, mật khẩu mặc định là `admin12345`.

## 🌐 Các URL quan trọng

| Dịch vụ | URL |
|---|---|
| Frontend (Web) | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger API Docs | http://localhost:8080/swagger-ui/index.html |

## 📝 Tóm tắt lệnh chạy nhanh

```bash
# Terminal 1 - Chạy Backend
cd Backend/BE_Cooking-main/cooking
./mvnw.cmd spring-boot:run

# Terminal 2 - Chạy Frontend
cd DATN/TotNghiep-main
npm run dev
```
# Terminal 3 - Chạy Frontend
PS D:\SQA\CookpadOri> node "d:\SQA\CookpadOri\DATN\TotNghiep-main\test.js"  
## ❗ Lỗi thường gặp

### 1. Lỗi kết nối MySQL
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra username/password trong `application.yml`
- Kiểm tra database `cooking_db` đã được tạo chưa

### 2. Lỗi `mysql` command not found
- MySQL chưa được thêm vào PATH
- Sử dụng đường dẫn đầy đủ: `"C:\Program Files\MySQL\MySQL Server 9.3\bin\mysql.exe"`

### 3. Lỗi Java version
- Dự án yêu cầu Java 21. Kiểm tra: `java -version`
- Tải JDK 21 tại: https://adoptium.net/

### 4. Lỗi port đã được sử dụng
- Backend port 8080: `netstat -ano | findstr :8080` rồi kill process
- Frontend port 3000: `netstat -ano | findstr :3000` rồi kill process

### 5. Frontend không hiển thị dữ liệu
- Đảm bảo Backend đã chạy thành công trước khi mở Frontend
- Kiểm tra file `.env.local` có đúng URL Backend không

## 💳 Hướng dẫn Test Thanh toán (VNPay Sandbox)
Để kiểm thử chức năng thanh toán trên môi trường Sandbox của VNPay, khi trang thanh toán hiện ra, hãy chọn **Thanh toán qua thẻ ATM/Tài khoản nội địa**, chọn ngân hàng **NCB** và sử dụng thông tin thẻ test dưới đây:

| Thông tin | Giá trị |
|---|---|
| **Ngân hàng** | NCB |
| **Số thẻ** | `9704198526191432198` |
| **Tên chủ thẻ** | `NGUYEN VAN A` |
| **Ngày phát hành** | `07/15` |
| **Mật khẩu OTP** | `123456` |

## 💾 Hướng dẫn Export / Danh sách Database
Nếu bạn có thay đổi cơ sở dữ liệu (thêm món ăn, thêm user...) và muốn chia sẻ cho người khác:

1. Dùng lệnh `mysqldump` để xuất CSDL:
```bash
"C:\Program Files\MySQL\MySQL Server 9.3\bin\mysqldump.exe" -u root -p123456 cooking_db > cooking_db_backup.sql
```
2. Gửi file `cooking_db_backup.sql` cho người khác.
3. Người nhận thực hiện lại **Bước 2: Tạo Database & Import dữ liệu** phía trên để đồng bộ.