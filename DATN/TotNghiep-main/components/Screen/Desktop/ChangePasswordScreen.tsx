'use client';

import BackHeader from '@/components/Common/BackHeader';
import { images } from '@/constants';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { StaticImageData } from 'next/image';
import { useSuccessStore } from '@/store/successStore';

const ChangePasswordScreen = () => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const setSuccess = useSuccessStore((state) => state.setSuccess);
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (form.password !== form.confirmPassword) {
      window.alert('Mật khẩu xác nhận không khớp');
      return;
    }
    setSuccess(
      'Đổi mật khẩu thành công!',
      'Bạn đã thay đổi mật khẩu thành công, vui lòng đăng nhập với mật khẩu mới của bạn.',
      '/auth/sign-in'
    );
    router.replace('/auth/register-success');
  }, [form.password, form.confirmPassword, setSuccess, router]);

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const backgroundImageUrl = typeof images.personalChestBg === 'string'
    ? images.personalChestBg
    : (images.personalChestBg as StaticImageData)?.src || images.personalChestBg;

  return (
    <div
      className="h-screen flex items-center justify-center w-full"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto 200vh',
        backgroundPosition: '0 0',
      }}
    >
      <div className="mx-auto max-w-[400px] w-[400px] p-4 min-h-[90vh] shadow-md rounded-lg bg-white/90 overflow-hidden backdrop-blur-sm">
        <BackHeader 
          headerTitle="Đổi mật khẩu" 
          onPress={onBackPress} 
        />

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image unoptimized alt="CookPad" src={images.logo} width={80} height={80} />
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-10 text-sm outline-none ring-0 focus:border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-50"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <Eye
                    size="20"
                    color="#5B5B5C"
                  />
                ) : (
                  <EyeSlash
                    size="20"
                    color="#5B5B5C"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Nhập lại mật khẩu mới</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-10 text-sm outline-none ring-0 focus:border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-50"
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? (
                  <Eye
                    size="20"
                    color="#5B5B5C"
                  />
                ) : (
                  <EyeSlash
                    size="20"
                    color="#5B5B5C"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handlePress}
            className="w-full rounded-lg bg-customPrimary px-6 py-2 text-center text-base font-bold text-white shadow-neutral-400/70 hover:opacity-90"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
