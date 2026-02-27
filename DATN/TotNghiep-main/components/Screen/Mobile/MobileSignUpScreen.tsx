import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ApiHome from '@api/ApiHome';
import BackHeader from '@/components/Common/BackHeader';
import CustomButton from '@/components/Common/CustomButton';
import Input from '@/components/Common/Input';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import { images } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

const MobileSignUpScreen = () => {
  const router = useRouter();

  // Form state
  const [form, setForm] = useState<{
    username: string;
    email: string;
    phone: string;
    bio: string;
    dob: string;
    avatarFile?: File;
    password: string;
    confirmPassword: string;
  }>({
    username: '',
    email: '',
    phone: '',
    bio: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutation React Query
  const signUpMutation = useMutation({
    mutationFn: (formData: FormData) => ApiHome.signUp(formData),
    onSuccess: (res: any) => {
      if (res.status === 200) {
        alert('Đăng ký thành công!');
        router.push('/auth/sign-in');
      } else {
        setErrors({ general: res.message || 'Đăng ký thất bại' });
      }
    },
    onError: (err: any) => {
      setErrors({ general: err.message || 'Đăng ký thất bại' });
    },
  });

  // File input
  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setForm(prev => ({ ...prev, avatarFile: file }));
    },
    []
  );

  // Submit form
  const onSignUpPress = useCallback(() => {
    const { username, email, phone, password, confirmPassword, bio, dob, avatarFile } = form;

    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = 'Tên người dùng không được để trống';
    if (!email) newErrors.email = 'Email không được để trống';
    if (!phone) newErrors.phone = 'Số điện thoại không được để trống';
    if (!password) newErrors.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải tối thiểu 6 ký tự';
    if (!confirmPassword) newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // xóa lỗi cũ nếu pass validation

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('bio', bio);
    formData.append('dob', dob);
    if (avatarFile) formData.append('avatarUrl', avatarFile);

    signUpMutation.mutate(formData);
  }, [form, signUpMutation]);

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-backgroundV1 px-4">
      <BackHeader headerTitle="Đăng ký" onPress={onBackPress} />

      <div className="pt-6 gap-8 flex flex-col justify-start items-center w-full">
        <Image unoptimized
          src={images.logo}
          alt="Logo"
          width={100}
          height={100}
          quality={100}
          draggable={false}
          className="object-contain h-20 w-auto"
        />

        {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}

        <div className="gap-4 flex flex-col justify-start items-end w-full">
          {/* Username */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-bold text-base text-Neutral-900">Tên người dùng</span>
            <Input
              placeholder="Tên người dùng"
              value={form.username}
              onChangeText={value => setForm({ ...form, username: value })}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-bold text-base text-Neutral-900">Email</span>
            <Input
              placeholder="Email"
              value={form.email}
              onChangeText={value => setForm({ ...form, email: value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-bold text-base text-Neutral-900">Số điện thoại</span>
            <Input
              placeholder="Số điện thoại"
              value={form.phone}
              onChangeText={value => setForm({ ...form, phone: value })}
              inputMode="numeric"
              type="number"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-bold text-base text-Neutral-900">Bio</span>
            <Input
              placeholder="Thông tin về bạn"
              value={form.bio}
              onChangeText={value => setForm({ ...form, bio: value })}
            />
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-bold text-base text-Neutral-900">Ngày sinh</span>
            <Input
              placeholder="YYYY-MM-DD"
              value={form.dob}
              onChangeText={value => setForm({ ...form, dob: value })}
              type="date"
            />
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-bold text-base text-Neutral-900">Avatar</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full p-2 h-10 bg-white rounded-lg"
            />
            {form.avatarFile && (
              <img
                src={URL.createObjectURL(form.avatarFile)}
                alt="Avatar Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full"
              />
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 w-full relative">
            <span className="font-bold text-base">Mật khẩu</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 pr-10 h-10 bg-white rounded-lg text-base placeholder-gray-400"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 w-6 h-6 flex justify-center items-center"
            >
              {showPassword ? <Eye size="20" color="#5B5B5C" /> : <EyeSlash size="20" color="#5B5B5C" />}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1 w-full relative">
            <span className="font-bold text-base">Nhập lại mật khẩu</span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full p-2 pr-10 h-10 bg-white rounded-lg text-base placeholder-gray-400"
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2 w-6 h-6 flex justify-center items-center"
            >
              {showConfirmPassword ? <Eye size="20" color="#5B5B5C" /> : <EyeSlash size="20" color="#5B5B5C" />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
        </div>

        <CustomButton title="Xác nhận" onPress={onSignUpPress} />

        <div className="flex flex-row justify-start items-start gap-1">
          <span className="text-black text-sm">Đã có tài khoản?</span>
          <Link href="/auth/sign-in" className="font-semibold text-black text-sm">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileSignUpScreen;
