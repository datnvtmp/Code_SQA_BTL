"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CategorySuccessPage() {
  const router = useRouter();

  // Redirect tự động sau 5 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoProfile = () => {
    router.push("/profile");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Tạo công thức thành công!
        </h1>
        <p className="text-gray-600">
          Công thức của bạn đã được tạo thành công. Bạn sẽ được chuyển đến trang profile sau 5 giây.
        </p>

        <button
          onClick={handleGoProfile}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Vào trang profile ngay
        </button>
      </div>
    </main>
  );
}
