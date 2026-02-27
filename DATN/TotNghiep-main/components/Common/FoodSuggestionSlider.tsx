'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface FoodSuggestion {
    id: number;
    name: string;
    image: string;
    description: string;
}

interface Props {
    data: FoodSuggestion[];
}

const FoodSuggestionSlider = ({ data }: Props) => {
    return (
        <section className="bg-white py-10">
            <div className="w-full px-4 sm:px-8">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    loop
                    centeredSlides
                    slidesPerView="auto"
                    spaceBetween={28}
                    className="food-suggestion-swiper"
                >
                    {data.map((item) => (
                        <SwiperSlide
                            key={item.id}
                            className="!w-[96px] flex justify-center opacity-50 scale-90 transition-all duration-300
                                       [&.swiper-slide-active]:opacity-100
                                       [&.swiper-slide-active]:scale-100"
                        >
                            <div className="group flex flex-col items-center cursor-pointer">
                                {/* Image */}
                                <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden bg-gray-100 border
                                                transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="88px"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Title */}
                                <p className="mt-2 text-[11px] font-medium text-gray-700 group-hover:text-orange-500 transition line-clamp-1">
                                    {item.name}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FoodSuggestionSlider;
