import BackHeader from '@/components/Common/BackHeader';
import CustomButton from '@/components/Common/CustomButton';
import { images } from '@/constants';
import { useForgotPasswordStore } from '@/store/forgotPasswordStore';
import { useSuccessStore } from '@/store/successStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useState } from 'react';

const MobileOTPInputScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const setSuccess = useSuccessStore((state) => state.setSuccess);
  const isForgotPassword = useForgotPasswordStore((state) => state.isForgotPassword);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePress = useCallback(async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      alert("Vui lòng nhập đầy đủ 4 số OTP");
      return;
    }
    if (isForgotPassword) {
      router.replace('/auth/change-password');
      return;
    }
    setIsLoading(true);
    setSuccess('Đăng ký thành công!', 'Bạn đã đăng ký thành công, vui lòng đăng nhập với tài khoản mới của bạn.', '/auth/sign-in');
    router.replace('/auth/register-success');
  }, [otp, isForgotPassword, setSuccess, router]);

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className='flex flex-col min-h-screen bg-backgroundV1'>
      <div className='px-4'>
        <BackHeader
          headerTitle="Nhập OTP"
          onPress={onBackPress}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6 gap-8 flex flex-col justify-center items-center">
        {/* Logo */}
        <Image unoptimized
          src={images.logo}
          alt="Logo"
          width={100}
          height={100}
          quality={100}
          draggable={false}
          className="object-contain h-20 w-auto"
        />

        {/* OTP Input Section */}
        <div className="w-full">
          {/* Instruction Text */}
          <div className="w-full gap-2 flex flex-col justify-center items-center">
            <span className="text-center text-textNeutralV1 text-base">
              Nhập mã OTP vừa được gửi tới số điện thoại 0123456789
            </span>
          </div>

          {/* OTP Input */}
          <div className="mt-8 flex justify-center items-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="number"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-4xl font-bold border-b-2 border-gray-800 focus:border-customPrimary focus:outline-none bg-transparent"
              />
            ))}
          </div>

          {/* Resend OTP Link */}
          <div className="gap-1 mt-8 flex flex-row justify-center">
            <span className="text-black text-sm">
              Bạn không nhận được mã?
            </span>
            <button
              onClick={() => alert("Mã OTP mới đã được gửi")}
              className="font-semibold text-black text-sm"
            >
              Gửi lại mã xác thực
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <CustomButton
          title="Xác nhận"
          onPress={handlePress}
        />
      </div>
    </div>
  );
};

export default MobileOTPInputScreen;
