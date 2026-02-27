'use client';

import { images } from '@/constants';
import { CloseCircle, Eye, EyeSlash } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import ApiHome from '@api/ApiHome';
import { StaticImageData } from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';



const LogInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setAuth } = useAuthStore();

  // ==========================
  // LOGIN MUTATION
  // ==========================
  const loginMutation = useMutation({
    mutationFn: () => ApiHome.login(email, password),
    onSuccess: (response) => {
      if (response.status === 200) {
        setAuth(response.data.user, response.data.accessToken);
        console.log(response.data.user)
        // router.replace('/');
      } else {
        setErrorMessage('Sai tài khoản hoặc mật khẩu');
      }
    },
    onError: () => {
      setErrorMessage('Sai tài khoản hoặc mật khẩu');
    },
  });

  const onSignInPress = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setErrorMessage('');
    loginMutation.mutate();
  };

  const backgroundImageUrl =
    typeof images.personalChestBg === 'string'
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
      <div className="mx-auto w-[400px] p-6 min-h-[90vh] shadow-lg rounded-lg bg-white/90 backdrop-blur-sm">

        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <p className="font-bold text-black text-lg">Đăng nhập</p>
        </div>

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image unoptimized alt="CookPad" src={images.logo} width={80} height={80} />
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-900">Tài khoản</label>

            <div className="relative">
              <input
                type="text"
                placeholder="Email hoặc số điện thoại"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white outline-none focus:border-gray-400"
              />

              {email.length > 0 && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <CloseCircle size="20" color="#BDBDBD" variant="Bold" />
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-900">Mật khẩu</label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 pr-10 text-sm bg-white outline-none focus:border-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <Eye size="20" color="#5B5B5C" />
                ) : (
                  <EyeSlash size="20" color="#5B5B5C" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="text-center">
              <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-gray-900 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={onSignInPress}
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-customPrimary px-6 py-2 text-center text-base font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Xác nhận'}
          </button>

          {/* Sign up link */}
          <div className="flex items-center gap-1 text-sm justify-center">
            <span>Bạn chưa có tài khoản?</span>
            <Link
              href="/auth/sign-up"
              className="font-semibold text-gray-900 hover:underline"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInScreen;
