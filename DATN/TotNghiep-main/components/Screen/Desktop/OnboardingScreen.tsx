'use client';

import CustomButton from '@/components/Common/CustomButton';
import { onboarding } from '@/constants';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper/types';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

const OnboardingScreen = () => {
    const router = useRouter();
    const swiperRef = useRef<SwiperInstance | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboarding.length - 1;

    return (
        <div
            className='flex justify-between items-center min-h-dvh bg-backgroundV1 px-4'>
            <div className='w-full'>
                <Swiper
                    onSwiper={(swiper: SwiperInstance) => (swiperRef.current = swiper)}
                    onSlideChange={(s: SwiperInstance) => setActiveIndex(s.activeIndex)}
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                >
                    {onboarding.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className={`flex justify-center items-center px-4 w-[${screenWidth - 32}px]`}>
                                <Image unoptimized src={item.image} alt={item.title} className={`object-contain w-[${screenWidth}px] h-[${screenWidth * 0.6}px]`} />
                            </div>
                            <p
                                className='text-xl font-medium text-center text-black mt-8'>
                                {item.title}
                            </p>
                            <p
                                className="text-lg text-center text-textNeutralV1 mt-2 px-4">
                                {item.description}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div
                className='flex-col justify-between items-center w-full gap-2 mt-10 mb-10'>
                <CustomButton
                    title={isLastSlide ? "Đăng nhập" : "Tiếp tục"}
                    onPress={() =>
                        isLastSlide
                            ? router.replace("/auth/sign-in")
                            : swiperRef.current?.slideTo(activeIndex + 1)
                    }
                    className='w-full' />
                <CustomButton
                    bgVariant={isLastSlide ? "outline" : "transparent"}
                    textVariant={isLastSlide ? "outline" : "transparent"}
                    title={isLastSlide ? "Đăng ký" : "Bỏ qua"}
                    onPress={() =>
                        isLastSlide
                            ? router.replace("/auth/sign-up")
                            : router.replace("/auth/sign-in")
                    }
                    className='w-full' />
            </div>
        </div>
    );
};

export default OnboardingScreen;
