'use client';

import { images } from '@/constants';
import { CloseCircle } from 'iconsax-reactjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import BackHeader from '../../Common/BackHeader';
import { StaticImageData } from 'next/image';

const ForgotPasswordScreen = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onSendResetMail = useCallback(async () => {
		if (!email.trim()) {
			window.alert('Vui lòng nhập email');
			return;
		}

		try {
			setLoading(true);

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/auth/forgot-password?email=${encodeURIComponent(email)}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);


			if (!res.ok) {
				throw new Error('Gửi email thất bại');
			}

			window.alert('Vui lòng kiểm tra email để đặt lại mật khẩu');
			router.back();
		} catch (err) {
			console.error(err);
			window.alert('Có lỗi xảy ra, vui lòng thử lại');
		} finally {
			setLoading(false);
		}
	}, [email, router]);

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
			}}
		>
			<div className="mx-auto max-w-[400px] w-[400px] p-4 min-h-[90vh] shadow-md rounded-lg bg-white/90 backdrop-blur-sm">
				<BackHeader headerTitle="Quên mật khẩu" onPress={() => router.back()} />

				<div className="mb-8 flex justify-center">
					<Image unoptimized alt="CookPad" src={images.logo} width={80} height={80} />
				</div>

				<div className="space-y-4">
					<p className="text-sm text-center text-gray-600 px-4">
						Link đặt lại mật khẩu sẽ được gửi tới email bạn đã đăng ký.
					</p>

					<div className="space-y-2">
						<label className="block text-sm font-bold text-gray-900">Email</label>
						<div className="relative">
							<input
								type="email"
								placeholder="Nhập email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-300"
							/>
							{email && (
								<button
									type="button"
									onClick={() => setEmail('')}
									className="absolute right-2 top-1/2 -translate-y-1/2"
								>
									<CloseCircle size="20" color="#D9D9DB" variant="Bold" />
								</button>
							)}
						</div>
					</div>

					<button
						disabled={loading}
						onClick={onSendResetMail}
						className="w-full rounded-lg bg-customPrimary px-6 py-2 font-bold text-white hover:opacity-90 disabled:opacity-60"
					>
						{loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
					</button>

					<div className="text-sm text-center">
						<button
							onClick={() => router.back()}
							className="font-semibold hover:underline"
						>
							Quay lại đăng nhập
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordScreen;
