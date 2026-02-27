import BackHeader from '@/components/Common/BackHeader';
import CustomButton from '@/components/Common/CustomButton';
import { images } from '@/constants';
import { useSuccessStore } from '@/store/successStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Eye, EyeSlash } from 'iconsax-reactjs';

const MobileChangePasswordScreen = () => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const setSuccess = useSuccessStore((state) => state.setSuccess);

  const handlePress = useCallback(async () => {
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
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

  return (
    <div className='flex flex-col min-h-screen bg-backgroundV1'>
      <div className='px-4'>
        <BackHeader
          headerTitle="Đổi mật khẩu"
          onPress={onBackPress}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6 gap-8 flex flex-col justify-start items-center">
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

        {/* Form */}
        <div className="gap-4 flex flex-col justify-start items-end w-full">
          {/* Password Input */}
          <div className="gap-1 flex flex-col justify-start items-start w-full">
            <span className="justify-start font-bold text-base">
              Mật khẩu mới
            </span>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-2 pr-10 h-10 bg-white rounded-lg text-base placeholder-gray-400 border-2 border-transparent focus:outline-none focus:border-customPrimary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 w-6 h-6 flex justify-center items-center"
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
          <div className="gap-1 flex flex-col justify-start items-start w-full">
            <div className="gap-1 justify-start items-center">
              <span className="justify-start font-bold text-base">
                Nhập lại mật khẩu mới
              </span>
            </div>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full p-2 pr-10 h-10 bg-white rounded-lg text-base placeholder-gray-400 border-2 border-transparent focus:outline-none focus:border-customPrimary"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 w-6 h-6 flex justify-center items-center"
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
        </div>

        {/* Confirm Button */}
        <CustomButton
          title="Xác nhận"
          onPress={handlePress}
        />
      </div>
    </div>
  );
};

export default MobileChangePasswordScreen;
