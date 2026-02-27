"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { images } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface Category {
    id: number;
    name: string;
    imageUrl?: string;
}

interface ApiCategoryResponse {
    data: {
        content: Category[];
    };
}

const PopularTopicsSection = () => {
    // API call
    const router = useRouter();
    const token = useAuthStore.getState().token;
    const fetchCategories = async (): Promise<Category[]> => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/categories?page=0&size=10`,
            {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const json: ApiCategoryResponse = await res.json();
        return json.data?.content ?? [];
    };

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return <p className="px-16">Đang tải chủ đề...</p>;
    }

    return (
        <div className="w-full mb-8 px-16">
            <p className="font-bold text-black mb-4 text-lg">
                Chủ đề phổ biến hôm nay
            </p>

            <div className="grid grid-cols-6 gap-5">
                {categories?.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => router.push(`/recipes?cateId=${item.id}&name=${item.name}`)}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        {/* Image */}
                        <Image
                            unoptimized
                            src={item.imageUrl || images.sampleFood1}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Title */}
                        <div className="absolute inset-0 flex items-end justify-center pb-4 px-2">
                            <p className="text-center font-semibold text-white text-base leading-tight line-clamp-2">
                                {item.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default PopularTopicsSection;
