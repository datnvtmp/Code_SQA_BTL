'use client';

import BackHeader from '@/components/Common/BackHeader';
import { images } from '@/constants';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForgotPasswordStore } from '@/store/forgotPasswordStore';
import { useSuccessStore } from '@/store/successStore';
import { StaticImageData } from 'next/image';
import { OTPInput, SlotProps } from 'input-otp';

// OTP Slot Component
const OTPSlot = (props: SlotProps) => {
  return (
    <div
      className="relative h-16 w-16 border-0 border-b-2 border-b-[#333333] bg-transparent text-center text-4xl font-bold text-black outline-none ring-0 transition-all duration-200"
    >
      <div className="flex h-full w-full items-center justify-center">
        {props.char ?? props.placeholderChar ?? '•'}
      </div>
      {props.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-0.5 h-8 bg-gray-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};

const OTPInputScreen = () => {
  const [otp, setOtp] = useState('');
  const setSuccess = useSuccessStore((state) => state.setSuccess);
  const isForgotPassword = useForgotPasswordStore((state) => state.isForgotPassword);
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (otp.length !== 4) {
      window.alert('Vui lòng nhập đầy đủ 4 số OTP');
      return;
    }
    if (isForgotPassword) {
      router.replace('/auth/change-password');
      return;
    }
    setSuccess(
      'Đăng ký thành công!',
      'Bạn đã đăng ký thành công, vui lòng đăng nhập với tài khoản mới của bạn.',
      '/auth/sign-in'
    );
    router.replace('/auth/register-success');
  }, [otp, isForgotPassword, setSuccess, router]);

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
          headerTitle="Nhập OTP"
          onPress={onBackPress}
        />

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image unoptimized alt="CookPad" src={images.logo} width={80} height={80} />
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Instruction Text */}
          <div className="space-y-2">
            <p className="text-center text-sm text-gray-700">
              Nhập mã OTP vừa được gửi tới số điện thoại 0123456789
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <OTPInput
              maxLength={4}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <div className="flex gap-4">
                  {slots.map((slot, idx) => (
                    <OTPSlot key={idx} {...slot} />
                  ))}
                </div>
              )}
            />
          </div>

          {/* Resend OTP Link */}
          <div className="flex flex-row justify-center gap-1 text-sm">
            <span className="text-gray-700">Bạn không nhận được mã?</span>
            <button
              type="button"
              onClick={() => window.alert('Mã OTP mới đã được gửi')}
              className="font-semibold text-gray-900 hover:underline"
            >
              Gửi lại mã xác thực
            </button>
          </div>

          {/* Verify Button */}
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

export default OTPInputScreen;
