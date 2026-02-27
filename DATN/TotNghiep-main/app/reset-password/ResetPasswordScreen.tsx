'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const ResetPasswordScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [email, setemail] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onResetPassword = async () => {
    if (!token) {
      alert('Link đặt lại mật khẩu không hợp lệ');
      return;
    }

    if (!email) {
      alert('Email không hợp lệ');
      return;
    }

    if (!password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/reset-password?token=${encodeURIComponent(
          token
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            confirmPassword,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      alert('Đổi mật khẩu thành công');
      router.push('/auth/sign-in');
    } catch (err) {
      console.error(err);
      alert('Token hết hạn hoặc không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">Đặt lại mật khẩu</h1>

        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <button
          onClick={onResetPassword}
          disabled={loading}
          className="w-full bg-customPrimary text-white py-2 rounded font-bold disabled:opacity-60"
        >
          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
