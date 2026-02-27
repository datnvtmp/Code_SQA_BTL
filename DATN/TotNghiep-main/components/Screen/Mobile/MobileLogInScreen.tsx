'use client';

import CustomButton from '@/components/Common/CustomButton';
import { images } from '@/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Input from '@/components/Common/Input';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import { useMutation } from '@tanstack/react-query';
import ApiHome from '@api/ApiHome';
import { useAuthStore } from '@/store/useAuthStore';

const MobileLogInScreen = () => {
  const router = useRouter();
  const { setAuth, isLoggedIn } = useAuthStore();
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/profile');
    }
  }, [isLoggedIn, router]);

  // Form state gộp vào 1 object
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ==========================
  // LOGIN MUTATION
  // ==========================
  const loginMutation = useMutation({
    mutationFn: () => ApiHome.login(form.email, form.password),
    onSuccess: (response) => {
      if (response.status === 200) {
        // Lưu vào store Zustand
        setAuth(response.data.user, response.data.accessToken);
        // console.log(response.data, response.data)
        router.replace('/');
      } else {
        setErrorMessage('Sai tài khoản hoặc mật khẩu');
      }
    },
    onError: () => {
      setErrorMessage('Sai tài khoản hoặc mật khẩu');
    },
  });

  const onSignInPress = () => {
    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setErrorMessage('');
    loginMutation.mutate();
  };

  return (
    <div className='flex flex-col min-h-screen bg-backgroundV1'>

      {/* Header */}
      <div className="h-11 flex justify-center items-center font-bold text-base">
        Đăng nhập
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6 flex flex-col gap-8 items-center">

        {/* Logo */}
        <Image unoptimized
          src={images.logo}
          alt="Logo"
          width={100}
          height={100}
          className="object-contain h-20"
        />

        {/* Form */}
        <div className="w-full flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-base text-black">Tài khoản</span>
            <Input
              placeholder="Email hoặc số điện thoại"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-base text-black">Mật khẩu</span>

            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full p-2 pr-10 h-10 bg-white border-2 border-transparent rounded-lg text-base placeholder-gray-400 focus:outline-none focus:border-customPrimary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2"
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
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          {/* Forgot password */}
          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-black"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login button */}
        <CustomButton
          title={loginMutation.isPending ? 'Đang đăng nhập...' : 'Xác nhận'}
          onPress={onSignInPress}
          disabled={loginMutation.isPending}
        />

        {/* Signup */}
        <div className="flex flex-row gap-1 text-sm">
          <span>Bạn chưa có tài khoản?</span>
          <Link href="/auth/sign-up" className="font-semibold text-black">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileLogInScreen;
