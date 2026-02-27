import PostItem from './PostItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import { useId } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome from '@api/ApiHome';

const PostsSwiper3 = () => {
    const uniqueId = useId().replace(/:/g, '-');

    const {
        data: postsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + 'views'],
        queryFn: () => ApiHome.getRecipesView(0, 50), // page = 0, size = 10
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="w-full relative px-4 sm:px-8 md:px-16 mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Công thức được nhiều lượt quan tâm
            </h2>
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={4} // default
                spaceBetween={16}
                grabCursor={true}
                navigation={{
                    nextEl: `.swiper-button-next-posts-${uniqueId}`,
                    prevEl: `.swiper-button-prev-posts-${uniqueId}`,
                }}
                pagination={{
                    el: `.swiper-pagination-posts-${uniqueId}`,
                    clickable: true,
                    type: 'bullets',
                }}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 8 },
                    640: { slidesPerView: 2, spaceBetween: 12 },
                    1024: { slidesPerView: 3, spaceBetween: 16 },
                    1280: { slidesPerView: 4, spaceBetween: 16 },
                }}
                className="posts-swiper"
            >
                {postsData?.map((item: any) => (
                    <SwiperSlide key={item.id} className="h-full pb-1">
                        <PostItem item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation buttons */}
            <button
                type="button"
                className={`swiper-button-prev-posts-${uniqueId} absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-customPrimary rounded-full shadow-lg flex items-center justify-center hover:bg-[#E36137]/90 transition-all duration-300 hover:shadow-xl`}
                aria-label="Previous slide"
            >
                <ArrowLeft2 size={20} color="#fff" variant="Outline" />
            </button>
            <button
                type="button"
                className={`swiper-button-next-posts-${uniqueId} absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-customPrimary rounded-full shadow-lg flex items-center justify-center hover:bg-[#E36137]/90 transition-all duration-300 hover:shadow-xl`}
                aria-label="Next slide"
            >
                <ArrowRight2 size={20} color="#fff" variant="Outline" />
            </button>

            {/* Pagination */}
            {/* <div
                className={`
                    swiper-pagination-posts-${uniqueId}
                    hidden
                    sm:flex
                    justify-center
                    mt-4
                    gap-2
                `}
            /> */}
        </div>
    );
};

export default PostsSwiper3;
