'use client';

import CustomButton from '@/components/Common/CustomButton';
import CustomFilter from '@/components/Common/CustomFilter';
import { icons } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export interface IngredientItem {
  id: string;
  name: string;
  isSelected?: boolean;
  isFilter?: boolean;
}

interface IngredientsSectionProps {
  ingredients: IngredientItem[];
}

const PAGE_SIZE = 8;

const IngredientsSection: React.FC<IngredientsSectionProps> = ({ ingredients }) => {
  const router = useRouter();

  const defaultSelected = ingredients.filter(i => i.isSelected).map(i => i.id);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(defaultSelected);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /** phân trang */
  const [page, setPage] = useState(0);

  const toggleIngredient = (id: string) => {
    setPage(0);
    setSelectedIngredients(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSearchRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setRecipes([]);
      setPage(0);
      return;
    }

    try {
      setLoading(true);
      const token = useAuthStore.getState().token;

      const responses = await Promise.all(
        selectedIngredients.map(id =>
          fetch(
            // 🔥 LUÔN LẤY FULL – KHÔNG PHÂN TRANG Ở API
            `${process.env.NEXT_PUBLIC_API_HOST}/api/ingredient/${id}/recipes?page=0&size=1000`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          ).then(res => res.json())
        )
      );

      const allRecipes = responses.flatMap(r => r?.data?.content || []);

      // unique theo id
      const uniqueRecipes = [
        ...new Map(allRecipes.map((r: any) => [r.id, r])).values(),
      ];

      setRecipes(uniqueRecipes);
      setPage(0);
    } catch (error) {
      console.error('Lỗi khi lấy công thức:', error);
      setRecipes([]);
      setPage(0);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAllIngredients = () => {
    setPage(0);
    if (selectedIngredients.length === ingredients.length) {
      setSelectedIngredients([]);
      setRecipes([]);
    } else {
      setSelectedIngredients(ingredients.map(i => i.id));
    }
  };

  /** 🔥 PHÂN TRANG SAU KHI ĐÃ LỌC */
  const totalPages = useMemo(() => {
    return Math.ceil(recipes.length / PAGE_SIZE);
  }, [recipes]);

  const paginatedRecipes = useMemo(() => {
    const start = page * PAGE_SIZE;
    return recipes.slice(start, start + PAGE_SIZE);
  }, [recipes, page]);

  return (
    <div className="w-full px-10 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Trong tủ lạnh nhà bạn có gì?
      </h2>

      <CustomFilter
        data={ingredients}
        selectedItems={selectedIngredients}
        onToggleItem={toggleIngredient}
        showFilterIcon
        isFilterSelected={selectedIngredients.length === ingredients.length}
        onToggleAll={handleToggleAllIngredients}
      />

      <CustomButton
        title="Tìm kiếm theo nguyên liệu"
        onPress={handleSearchRecipes}
        className="mx-auto"
        IconLeft={
          <Image
            unoptimized
            src={icons.searchIcon}
            alt="search"
            width={20}
            height={20}
            className="brightness-0 invert"
          />
        }
      />

      {loading && (
        <p className="text-center text-sm text-gray-500">
          Đang tìm món ăn phù hợp...
        </p>
      )}

      {!loading && recipes.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          Chưa có món ăn phù hợp 🍳
        </p>
      )}

      {/* RECIPES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {paginatedRecipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => router.push(`/food-detail?id=${recipe.id}`)}
            className="cursor-pointer bg-white rounded-xl border
                       hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative w-full h-36">
              <Image
                unoptimized
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold line-clamp-1">
                {recipe.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {recipe.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 pt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="px-4 py-2 rounded-full border disabled:opacity-40"
          >
            ← Trước
          </button>

          <span className="text-sm text-gray-500 flex items-center">
            Trang {page + 1}/{totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-full border disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default IngredientsSection;
