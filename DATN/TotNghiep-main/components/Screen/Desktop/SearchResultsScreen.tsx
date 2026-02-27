'use client';

import { icons } from '@/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import FoodGrid from '../../Common/Desktop/FoodGrid';
import { useQuery } from '@tanstack/react-query';
import { getRecipesBySearch } from '@api/ApiHome';
import type { FormattedRecipeItem } from '@/types/type_index';

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const LIMIT = 12;

const SearchResultsScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const queryFromUrl = searchParams.get('query') || '';
  const pageFromUrl = Number(searchParams.get('page') || 0);

  // ✅ init ONCE from URL
  const [searchText, setSearchText] = useState(queryFromUrl);
  const [page, setPage] = useState(pageFromUrl);

  const debouncedSearchText = useDebounce(searchText);

  // ✅ ONE-WAY: state → URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchText.trim()) params.set('query', searchText);
    if (page > 0) params.set('page', String(page));

    router.replace(`/search/result?${params.toString()}`, {
      scroll: false,
    });
  }, [searchText, page, router]);

  const { data, isFetching, error } = useQuery<FormattedRecipeItem[]>({
    queryKey: ['searchRecipes', debouncedSearchText, page],
    queryFn: () => getRecipesBySearch(page, LIMIT, debouncedSearchText),
    enabled: debouncedSearchText.trim() !== '',
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 pt-4">
      <div className="mb-2 flex items-center gap-2">
        <button onClick={() => router.back()}>
          <Image unoptimized src={icons.caretLeftIcon} alt="back" width={24} height={24} />
        </button>

        <div className="flex flex-1 items-center rounded-lg bg-white h-10 px-2">
          <input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm kiếm..."
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>

      <FoodGrid featuredRecipesData={data || []} />

      {data && data.length > 0 && (
        <div className="mt-8 mb-6 flex items-center justify-center gap-6">
          {/* Trang trước */}
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className={`
        flex items-center justify-center min-w-[120px] h-10
        rounded-full border text-sm font-medium
        transition-all duration-200
        ${page === 0
                ? 'cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95'
              }
      `}
          >
            ← Trang trước
          </button>

          {/* Page indicator */}
          <span className="text-sm font-medium text-gray-600 select-none">
            Trang <span className="font-semibold">{page + 1}</span>
          </span>

          {/* Trang sau */}
          <button
            disabled={isFetching || data.length < LIMIT}
            onClick={() => setPage((p) => p + 1)}
            className={`
        flex items-center justify-center min-w-[120px] h-10
        rounded-full border text-sm font-medium
        transition-all duration-200
        ${isFetching || data.length < LIMIT
                ? 'cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95'
              }
      `}
          >
            Trang sau →
          </button>
        </div>
      )}

    </div>
  );
};

export default SearchResultsScreen;
