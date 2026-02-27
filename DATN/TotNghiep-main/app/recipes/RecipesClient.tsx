"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ApiHome from "@api/ApiHome";
import { RecipeItem } from "@/types/type_index";
import RecipeListItem from "@components/ProfileScreen/RecipeListItem";
import Header from "@components/Common/Header";

export default function RecipesByCategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cateId = Number(searchParams.get("cateId") || 1);
  const name = (searchParams.get("name") || "");
  const { data: recipes, isLoading, isError } = useQuery<RecipeItem[], Error>({
    queryKey: ["recipesByCate", cateId],
    queryFn: () => ApiHome.getRecipesByCate(cateId),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <Header />

      {/* PAGE WRAPPER – tránh bị che bởi header */}
      <main className="pt-[64px] min-h-screen bg-gray-50">
        {/* ===== TITLE ===== */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Công thức theo danh mục {name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Khám phá các món ăn phù hợp với chủ đề bạn chọn
          </p>
        </div>

        {/* ===== CONTENT ===== */}
        {isLoading && (
          <p className="p-6 text-center text-gray-500">
            Đang tải món ăn...
          </p>
        )}

        {isError && (
          <p className="p-6 text-center text-red-500">
            Không thể tải dữ liệu.
          </p>
        )}

        {!isLoading && recipes?.length === 0 && (
          <p className="p-6 text-center text-gray-400">
            Chưa có món ăn trong danh mục này.
          </p>
        )}

        {recipes && recipes.length > 0 && (
          <div className="
            px-6 pb-10
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          ">
            {recipes.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/food-detail?id=${item.id}`)}
                className="cursor-pointer hover:scale-[1.02] transition"
              >
                <RecipeListItem item={item} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
