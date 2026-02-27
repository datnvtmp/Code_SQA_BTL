'use client';

import { icons } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getLikedRecipes } from '@api/ApiHome';
import { FormattedRecipeItem } from '@/types/type_index';
import { useState } from 'react';

interface FoodGridProps {
  featuredRecipesData?: FormattedRecipeItem[];
}

const fallbackImage = '/fallback-image.png';
const LIMIT = 6;

const FoodGrid = ({ featuredRecipesData }: FoodGridProps) => {
  const [page, setPage] = useState(0);

  const {
    data: searchedDishesData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['likedRecipes', page],
    queryFn: () => getLikedRecipes(page, LIMIT),
    enabled: !featuredRecipesData,
  });

  const data: FormattedRecipeItem[] = Array.isArray(featuredRecipesData)
    ? featuredRecipesData
    : Array.isArray(searchedDishesData)
    ? searchedDishesData
    : [];

  if (isLoading) return <p className="text-center py-6">Đang tải món ăn...</p>;
  if (error)
    return (
      <p className="text-center py-6 text-red-500">
        Không tải được món ăn
      </p>
    );
  if (!data.length) return <p className="text-center py-6"></p>;

  const renderItem = (item: FormattedRecipeItem) => (
    <Link
      key={item.id}
      href={`/food-detail?id=${item.id}`}
      className="group w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative w-full h-48 md:h-56">
        <Image
          unoptimized
          src={item.images?.[0] || fallbackImage}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3 flex justify-between items-start gap-2">
        <p className="flex-1 font-semibold text-sm text-black line-clamp-2 group-hover:text-orange-500">
          {item.title}
        </p>
        <Image
          unoptimized
          src={icons.threeDotsIcon}
          alt="more"
          className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </Link>
  );

  return (
    <div className="w-full px-2 md:px-0">
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {data.map(renderItem)}
      </div>

      {/* Pagination (chỉ hiện khi dùng API) */}
      {!featuredRecipesData && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className={`min-w-[120px] h-10 rounded-full border text-sm font-medium transition-all
              ${
                page === 0
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
          >
            ← Trang trước
          </button>

          <span className="text-sm font-medium text-gray-600">
            Trang <span className="font-semibold">{page + 1}</span>
          </span>

          <button
            disabled={isFetching || data.length < LIMIT}
            onClick={() => setPage((p) => p + 1)}
            className={`min-w-[120px] h-10 rounded-full border text-sm font-medium transition-all
              ${
                isFetching || data.length < LIMIT
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
          >
            Trang sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodGrid;
