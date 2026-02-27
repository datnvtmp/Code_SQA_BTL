'use client';

import BackHeader from '@/components/Common/BackHeader';
import { images } from '@/constants';
import { CloseCircle, Eye, EyeSlash } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ApiHome from '@api/ApiHome';

const SignUpScreen = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    bio: '',
    dob: '',
    avatarFile: null as File | null,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const signUpMutation = useMutation({
    mutationFn: (formData: FormData) => ApiHome.signUp(formData),
    onSuccess: (res) => {
      if (res.status === 200) {
        router.push('/auth/sign-in');
      } else {
        setErrors({ general: res.message || 'Đăng ký thất bại' });
      }
    },
    onError: (err: any) => {
      setErrors({ general: err.message || 'Đăng ký thất bại' });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, avatarFile: file }));
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSignUpPress = useCallback(() => {
    const { username, email, phone, bio, dob, avatarFile } = form;
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = 'Tên hiển thị không được để trống';
    if (!email) newErrors.email = 'Email không được để trống';
    if (!phone) newErrors.phone = 'Số điện thoại không được để trống';
    if (!password) newErrors.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải tối thiểu 6 ký tự';
    if (!confirmPassword) newErrors.confirmPassword = 'Nhập lại mật khẩu không được để trống';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
  }, [form, password, confirmPassword, signUpMutation]);

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 overflow-auto py-6">
      <div className="w-full max-w-[400px] bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-4 overflow-auto">
        <BackHeader headerTitle="Đăng ký" onPress={onBackPress} />

        <div className="mb-6 flex justify-center">
          <Image unoptimized alt="CookPad" src={images.logo} width={80} height={80} />
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm mb-2 text-center">{errors.general}</p>
        )}

        <div className="space-y-4">
          <InputField
            label="Tên hiển thị"
            value={form.username}
            onChange={(v) => setForm(prev => ({ ...prev, username: v }))}
            error={errors.username}
          />
          <InputField
            label="Email"
            value={form.email}
            onChange={(v) => setForm(prev => ({ ...prev, email: v }))}
            error={errors.email}
          />
          <InputField
            label="Số điện thoại"
            type="number"
            value={form.phone}
            onChange={(v) => setForm(prev => ({ ...prev, phone: v }))}
            error={errors.phone}
          />

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Bio</label>
            <textarea
              placeholder="Thông tin về bạn"
              value={form.bio}
              onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Ngày sinh</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm(prev => ({ ...prev, dob: e.target.value }))}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300"
            />
            {avatarPreview && (
              <Image unoptimized
                src={avatarPreview}
                alt="Avatar Preview"
                width={80}
                height={80}
                className="mt-2 rounded-full object-cover"
              />
            )}
          </div>

          <PasswordField
            label="Mật khẩu"
            value={password}
            show={showPassword}
            onToggle={() => setShowPassword(v => !v)}
            onChange={setPassword}
            error={errors.password}
          />

          <PasswordField
            label="Nhập lại mật khẩu"
            value={confirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(v => !v)}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <button
            type="button"
            onClick={onSignUpPress}
            className="w-full rounded-lg bg-customPrimary px-6 py-2 text-center text-base font-bold text-white shadow hover:opacity-90"
          >
            {signUpMutation.isPending ? 'Đang đăng ký...' : 'Xác nhận'}
          </button>

          <div className="flex items-center gap-2 text-sm justify-center w-full">
            <span>Đã có tài khoản?</span>
            <Link href="/auth/sign-in" className="font-semibold text-gray-900">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;

// ----------------------
// Helper components
// ----------------------
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}

const InputField = ({ label, value, onChange, type = 'text', error }: InputFieldProps) => (
  <div className="space-y-1">
    <label className="block text-sm font-bold text-gray-900">{label}</label>
    <input
      type={type}
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-300 ${
        error ? 'border-red-500' : 'border-gray-200'
      }`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

interface PasswordFieldProps {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  error?: string;
}

const PasswordField = ({ label, value, show, onToggle, onChange, error }: PasswordFieldProps) => (
  <div className="space-y-1">
    <label className="block text-sm font-bold text-gray-900">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none focus:border-gray-300 ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-50"
      >
        {show ? <Eye size="20" color="#5B5B5C" /> : <EyeSlash size="20" color="#5B5B5C" />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
