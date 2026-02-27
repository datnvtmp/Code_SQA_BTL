"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import RecipeCard from "../HomeScreen/Desktop/InspirationTab/RecipeCard";
import { useQuery } from "@tanstack/react-query";
import QUERY_KEY from "@api/QueryKey";
import ApiHome from "@api/ApiHome";

interface RecipeItem {
    id: string;
    name: string;
    image: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
    time: string;
    likes: number;
}

const HistoryRecipe = () => {
    const { data: postsData } = useQuery({
        queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + "history"],
        queryFn: () => ApiHome.getRecipesHistory(0, 10),
        staleTime: 1000 * 60 * 5,
    });

    if (!postsData || postsData.length === 0) return null;

    const recipes: RecipeItem[] = postsData.map((item: any) => {
        const img = item.image || item.content?.image || "";
        const isObj = img && typeof img === "object" && img.src;

        return {
            id: item.id,
            name: item.name || item.content?.title || "No title",
            image: isObj ? img.src : img,
            width: isObj ? img.width : undefined,
            height: isObj ? img.height : undefined,
            blurDataURL: isObj ? img.blurDataURL : undefined,
            time: item.time || item.user?.timeAgo || "N/A",
            likes: item.likes || item.content?.likes || 0,
        };
    });

    return (
        <div className="mb-4 pb-1 w-full">
            <Swiper
                slidesPerView={2.5} // mặc định mobile
                spaceBetween={12}
                grabCursor
                freeMode
                observer
                observeParents
                breakpoints={{
                    480: { slidesPerView: 2.5, spaceBetween: 12 },
                    640: { slidesPerView: 3.5, spaceBetween: 16 },
                    768: { slidesPerView: 4.5, spaceBetween: 16 },
                    1024: { slidesPerView: 6, spaceBetween: 20 },
                    1440: { slidesPerView: 8, spaceBetween: 20 },
                }}
                modules={[FreeMode]}
                className="mySwiper !px-1"
            >
                {recipes.map((item, index) => (
                    <SwiperSlide key={`${item.id}-${index}`} className="!h-auto">
                        <RecipeCard
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            width={item.width}
                            height={item.height}
                            blurDataURL={item.blurDataURL}
                            time={item.time}
                            likes={item.likes}
                            onClick={() => (window.location.href = `/food-detail?id=${item.id}`)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
};

export default HistoryRecipe;
