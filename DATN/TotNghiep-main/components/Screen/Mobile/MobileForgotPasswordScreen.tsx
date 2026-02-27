import CustomButton from '@/components/Common/CustomButton';
import { images } from '@/constants';
import { useForgotPasswordStore } from '@/store/forgotPasswordStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import Input from '@/components/Common/Input';
import BackHeader from '@/components/Common/BackHeader';

const MobileForgotPasswordScreen = () => {
    const [form, setForm] = useState({
        phone: '',
    });

    const setIsForgotPassword = useForgotPasswordStore((state) => state.setIsForgotPassword);
    const router = useRouter();

    const onSendOTPPress = useCallback(async () => {
        if (!form.phone.trim()) {
            alert("Vui lòng nhập số điện thoại");
            return;
        }

        setIsForgotPassword(true);
        router.push('/auth/otp');
    }, [form.phone, setIsForgotPassword, router]);

    const onBackPress = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <div className='flex flex-col min-h-screen bg-backgroundV1'>
            <div className='px-4'>
                <BackHeader
                    headerTitle="Quên mật khẩu"
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
                {/* Instruction Text */}
                <div className="flex flex-col justify-center items-center">
                    <span className="text-center text-textNeutralV1 text-base px-4">
                        Mã OTP lấy lại mật khẩu sẽ được gửi tới số điện thoại của bạn. Vui lòng nhập đúng số điện thoại bạn đã dùng để đăng ký.
                    </span>
                </div>

                {/* Phone Number Input */}
                <div className="gap-1 flex flex-col justify-start items-start w-full">
                    <span className="justify-start font-bold text-base text-Neutral-900">
                        Số điện thoại
                    </span>
                    <div className="relative w-full">
                        <Input
                            type='number'
                            placeholder="Nhập số điện thoại"
                            value={form.phone}
                            onChangeText={(value) => setForm({ ...form, phone: value })}
                            inputMode="numeric"
                        />
                        {form.phone.length > 0 && (
                            <button
                                onClick={() => setForm({ ...form, phone: '' })}
                                className="absolute right-2 top-2 w-6 h-6 flex justify-center items-center"
                            >
                                <span className="text-gray-400 text-xl">✕</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Send OTP Button */}
                <CustomButton
                    title="Gửi mã OTP"
                    onPress={onSendOTPPress}
                />
            </div>
        </div>
    );
};

export default MobileForgotPasswordScreen;
