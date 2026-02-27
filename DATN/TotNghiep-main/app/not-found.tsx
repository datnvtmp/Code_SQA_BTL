import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-gray-600">Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <Link href="/" className="text-customPrimary underline">Quay về trang chủ</Link>
    </main>
  );
}


