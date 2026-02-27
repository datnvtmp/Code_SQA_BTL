'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/axios';

type Ingredient = {
  id: number;
  name: string;
};

type Recipe = {
  recipeId: number;
  title: string;
  description: string;
  imageUrl: string;
  matchedIngredients: string;
  missingFromRecipe: string | null;
  matchedCount: number;
  totalRecipeIngredients: number;
  difficulty: string;
  cookTime: number;
  servings: number;
};

export default function RecipeSearchByIngredient() {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const selectedIds = selectedIngredients.map((i) => i.id);

  /* ===================== SEARCH INGREDIENT ===================== */
  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredient-search', keyword],
    enabled: keyword.trim().length > 0,
    queryFn: async () => {
      const res = await api.get('/api/ingredient/search-by-keyword?page=0&size=50', { params: { keyword } });
      return res.data.data.content as Ingredient[];
    },
  });

  /* ===================== SEARCH RECIPE ===================== */
  const { data: recipePage, isLoading } = useQuery({
    queryKey: ['recipes-by-ingredients', selectedIds, page],
    enabled: selectedIds.length > 0,
    queryFn: async () => {
      const res = await api.get('/user/test/recipes/search-by-ingredients', {
        params: { ingredientIds: selectedIds, page, size: 4 },
      });
      return res.data.data; // <- trả về đúng data.content
    },
  });

  const recipes: Recipe[] = recipePage?.content ?? [];

  /* ===================== HANDLER ===================== */
  const toggleIngredient = (ingredient: Ingredient) => {
    setPage(0);
    setSelectedIngredients((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      if (exists) return prev.filter((i) => i.id !== ingredient.id);
      return [...prev, ingredient];
    });
  };
  const handlePrevPage = () => {
    if (!recipePage || recipePage.first) return;
    setPage((p) => Math.max(0, p - 1));
  };

  const handleNextPage = () => {
    if (!recipePage || recipePage.last) return;
    setPage((p) => p + 1);
  };

  /* ===================== UI ===================== */
  return (
    <section className="w-full mx-auto px-4 md:px-6 py-10 space-y-10">

      {/* ===== HEADER ===== */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Cho mình biết bạn có nguyên liệu gì để nấu ăn nha!
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Nhập các nguyên liệu bạn đang có, chúng tôi sẽ gợi ý món ăn phù hợp nhất cho bạn
        </p>
      </div>

      {/* ===== SEARCH INPUT ===== */}
      <div className="relative max-w-2xl mx-auto">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔍 Nhập nguyên liệu (ví dụ: cánh gà, đường...)"
          className="
          w-full rounded-2xl border border-gray-200
          px-6 py-4 text-base
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-green-500
        "
        />

        {/* AUTOCOMPLETE */}
        {keyword && ingredients.length > 0 && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border bg-white shadow-xl max-h-64 overflow-auto">
            {ingredients.map((i) => {
              const active = selectedIds.includes(i.id);
              return (
                <div
                  key={i.id}
                  onClick={() => toggleIngredient(i)}
                  className={`px-5 py-3 cursor-pointer flex items-center justify-between hover:bg-green-50 ${active ? 'bg-green-50' : ''
                    }`}
                >
                  <span className="text-sm">{i.name}</span>
                  {active && (
                    <span className="text-green-600 font-bold">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== SELECTED INGREDIENTS ===== */}
      {selectedIngredients.length > 0 && (
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
          {selectedIngredients.map((i) => (
            <button
              key={i.id}
              onClick={() => toggleIngredient(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-green-100 text-green-700 text-sm font-medium
                       hover:bg-green-200 transition"
            >
              {i.name}
              <span className="text-xs">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* ===== RECIPE GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && (
          <p className="col-span-full text-center text-gray-500 animate-pulse">
            Đang tìm công thức phù hợp...
          </p>
        )}

        {recipes.map((r) => (
          <article
            key={r.recipeId}
            onClick={() => router.push(`/food-detail?id=${r.recipeId}`)}
            className="
            cursor-pointer rounded-3xl overflow-hidden
            border border-gray-200 bg-white
            shadow-sm hover:shadow-xl transition
            flex flex-col group
          "
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={r.imageUrl}
                alt={r.title}
                className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                {r.matchedCount}/{r.totalRecipeIngredients} nguyên liệu
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <h3 className="text-lg font-semibold line-clamp-2">
                {r.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2">
                {r.description}
              </p>

              <div className="text-sm space-y-1">
                <p className="text-green-600">
                  <b>Khớp:</b> {r.matchedIngredients || 'Không có'}
                </p>
                <p className="text-red-500">
                  <b>Thiếu:</b> {r.missingFromRecipe || 'Không có'}
                </p>
              </div>

              <div className="mt-auto flex justify-between text-xs text-gray-500">
                <span>⏱ {r.cookTime} phút</span>
                <span>🍽 {r.servings} người</span>
                <span>🔥 {r.difficulty}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ===== PAGINATION ===== */}
      {recipePage && recipePage.totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-8">

          <button
            disabled={recipePage.first}
            onClick={handlePrevPage}
            className="px-6 py-2 rounded-full border
                 disabled:opacity-40 disabled:cursor-not-allowed
                 hover:bg-gray-100 transition"
          >
            ← Trang trước
          </button>

          <span className="text-sm text-gray-500">
            Trang <b>{recipePage.pageNumber + 1}</b> / {recipePage.totalPages}
          </span>

          <button
            disabled={recipePage.last}
            onClick={handleNextPage}
            className="px-6 py-2 rounded-full border
                 disabled:opacity-40 disabled:cursor-not-allowed
                 hover:bg-gray-100 transition"
          >
            Trang sau →
          </button>

        </div>
      )}

    </section>
  );

}