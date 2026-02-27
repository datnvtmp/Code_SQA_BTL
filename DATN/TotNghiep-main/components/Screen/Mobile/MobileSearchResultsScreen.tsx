"use client";

import CustomFilter from '@/components/Common/CustomFilter';
import { icons } from '@/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import MobileFoodGrid from '@/components/Common/Mobile/FoodGrid';
import { useQuery } from '@tanstack/react-query';
import { getRecipesBySearch } from '@api/ApiHome';

const dietaryFilterData = [
  { id: '1', name: 'Ăn chay', isSelected: false },
  { id: '2', name: 'Giàu đạm', isSelected: false },
  { id: '3', name: 'Kiêng đường', isSelected: false },
  { id: '4', name: 'Ít calo', isSelected: false },
  { id: '5', name: 'Không gluten', isSelected: false },
  { id: '6', name: 'Keto', isSelected: false },
  { id: '7', name: 'Paleo', isSelected: false },
  { id: '8', name: 'Mediterranean', isSelected: false },
];

const MobileSearchResultsScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery: string = searchParams?.get('searchQuery') || '';
  const [searchText, setSearchText] = useState<string>(initialQuery);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterSelected, setIsFilterSelected] = useState(true);
  const [inputError, setInputError] = useState(false);

  // React Query refetch khi searchText thay đổi
  const { data: featuredRecipesData, isLoading, error } = useQuery({
    queryKey: ['searchRecipes', searchText],
    queryFn: () => getRecipesBySearch(0, 10, searchText),
    enabled: searchText.trim() !== '', // chỉ gọi API khi có từ khóa
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchText.trim() === '') {
        setInputError(true);
        return;
      }
      setInputError(false);
      router.push(`/search/result?searchQuery=${encodeURIComponent(searchText)}`);
    }
  };

  const toggleFilter = (id: string) => {
    setSelectedFilters(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleFilterIcon = () => {
    setIsFilterSelected(prev => !prev);
  };

  return (
    <div className="bg-backgroundV1 w-full max-w-screen overflow-hidden">
      <div className="flex flex-col justify-start items-start px-4 pt-4">
        <div className="w-full flex flex-row justify-start items-center gap-2 mb-2">
          <button onClick={() => router.back()}>
            <Image unoptimized
              src={icons.caretLeftIcon}
              alt="Back"
              width={100}
              height={100}
              quality={100}
              draggable={false}
              className="object-contain h-6 w-auto"
            />
          </button>

          <div className="flex-1 h-10 px-2 bg-white rounded-lg flex flex-row justify-start items-center gap-4">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Tìm kiếm..."
              className="flex-1 text-sm font-medium text-black py-0 border-none outline-none bg-transparent"
            />
          </div>
        </div>

        {inputError && (
          <div className="text-red-500 text-sm mb-2">
            Vui lòng nhập từ khóa để tìm kiếm
          </div>
        )}

        <CustomFilter
          data={dietaryFilterData}
          selectedItems={selectedFilters}
          onToggleItem={toggleFilter}
          showFilterIcon={true}
          isFilterSelected={isFilterSelected}
          onToggleFilter={toggleFilterIcon}
        />

        {searchText.trim() !== '' && !isLoading && featuredRecipesData?.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            Không tìm thấy kết quả cho &quot;{searchText}&quot;
          </div>
        )}

        <MobileFoodGrid featuredRecipesData={featuredRecipesData || []} />
      </div>
    </div>
  );
};

export default MobileSearchResultsScreen;
