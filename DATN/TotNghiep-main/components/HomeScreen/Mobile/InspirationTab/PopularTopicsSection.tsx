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
    const token = useAuthStore.getState().token;
    const router = useRouter();

    const fetchCategories = async (): Promise<Category[]> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/categories?page=0&size=10`, {
            method: "GET",
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const json: ApiCategoryResponse = await res.json();
        return json.data?.content ?? [];
    };

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return <p className="px-4">Đang tải chủ đề...</p>;

    return (
        <div className="w-full flex flex-col justify-center items-start mb-6 px-4">
            <span className="mb-2 font-bold text-black text-base">
                Chủ đề phổ biến hôm nay
            </span>

            <div className="w-full flex flex-wrap gap-2">
                {categories?.map((item) => (
                    <div
                        key={item.id}
                        className="flex-1 min-w-[calc(50%-0.5rem)] h-24 rounded-lg flex justify-center items-center relative overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/recipes?cateId=${item.id}`)}
                    >
                        <Image
                            unoptimized
                            src={item.imageUrl || images.sampleFood1}
                            alt={item.name}
                            fill
                            className="rounded-lg object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-lg" />
                        <span className="font-bold text-center text-white text-base relative z-20">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PopularTopicsSection;
