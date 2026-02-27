'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const PaymentResultPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token, setAuth } = useAuthStore();

  // --- LẤY ĐÚNG THAM SỐ ---
  const code = searchParams.get('code'); // MoMo trả code=00 là thành công
  const orderId = searchParams.get('orderId');

  // --- LOGIC XÁC ĐỊNH TRẠNG THÁI ---
  const status =
    code === '00'
      ? 'success'
      : code
      ? 'failed'
      : 'pending';

  const displayMessage =
    status === 'success'
      ? 'Thanh toán thành công! Cảm ơn bạn đã nâng cấp tài khoản.'
      : status === 'failed'
      ? 'Thanh toán thất bại hoặc bị hủy.'
      : 'Đang xử lý...';

  // --- CẬP NHẬT ROLE CHEF SAU KHI THANH TOÁN THÀNH CÔNG ---
  useEffect(() => {
    if (status === 'success' && user && token) {
      const hasChef = user.roles.some(r => r.name === 'CHEF');
      if (!hasChef) {
        const updatedRoles = [...user.roles, { name: 'CHEF' }];
        setAuth({ ...user, roles: updatedRoles }, token);
      }
    }
  }, [status, user, token, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {status === 'success'
            ? '🎉 Thanh toán thành công'
            : status === 'failed'
            ? '⚠️ Thanh toán thất bại'
            : '⏳ Đang xử lý'}
        </h1>

        <p className="text-gray-700">{displayMessage}</p>

        {orderId && <p className="text-sm text-gray-500">Mã đơn hàng: {orderId}</p>}

        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Quay lại trang chính
        </button>
      </div>
    </div>
  );
};

export default PaymentResultPage;
