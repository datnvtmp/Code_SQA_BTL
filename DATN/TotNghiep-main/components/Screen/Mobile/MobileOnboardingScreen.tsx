import CustomButton from '@/components/Common/CustomButton';
import { onboarding } from '@/constants';
import { getScaleFactor } from '@/lib/scaling';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

const OnboardingScreen = () => {
    const router = useRouter();
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboarding.length - 1;
    const scaleFactor = getScaleFactor();

    return (
        <div className='flex flex-col justify-between items-center h-full bg-backgroundV1 px-4'>
            <Swiper
                onSwiper={(swiper: SwiperType) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.activeIndex)}
                spaceBetween={0}
                slidesPerView={1}
                className="w-full"
            >
                {onboarding.map((item, index) => (
                    <SwiperSlide key={item.id}>
                        <div className='flex flex-col justify-center items-center w-full px-4'>
                            <div className="relative w-full h-[60vw] max-h-[600px]">
                                <Image unoptimized
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                    draggable={false}
                                />
                            </div>
                            <span className='text-xl font-medium text-center text-black mt-8'>
                                {item.title}
                            </span>
                            <span className="text-lg text-center text-textNeutralV1 mt-2 px-4">
                                {item.description}
                            </span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='flex flex-col justify-between items-center w-full gap-2 my-10'>
                <CustomButton
                    title={isLastSlide ? "Đăng nhập" : "Tiếp tục"}
                    onPress={() =>
                        isLastSlide
                            ? router.push("/auth/sign-in")
                            : swiperRef.current?.slideNext()
                    }
                    className='w-full' />
                <CustomButton
                    bgVariant={isLastSlide ? "outline" : "transparent"}
                    textVariant={isLastSlide ? "outline" : "transparent"}
                    title={isLastSlide ? "Đăng ký" : "Bỏ qua"}
                    onPress={() =>
                        isLastSlide
                            ? router.push("/auth/sign-up")
                            : router.push("/auth/sign-in")
                    }
                    className='w-full' />
            </div>
        </div>
    );
};

export default OnboardingScreen;
