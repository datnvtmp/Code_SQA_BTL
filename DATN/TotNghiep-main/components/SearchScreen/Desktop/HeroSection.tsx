'use client';

import { icons, images } from '@/constants';
import Image from 'next/image';
import SearchDropdown from './SearchDropdown';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface StoredSearch {
  id: string;
  name: string;
  searched: boolean;
}
interface HeroSectionProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}
const LOCAL_STORAGE_KEY = 'recentSearches';

const HeroSection: React.FC<HeroSectionProps> = ({ searchValue, setSearchValue }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<StoredSearch[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const router = useRouter();

  const handleFocus = () => setIsDropdownOpen(true);
  const handleClose = () => setIsDropdownOpen(false);

  const saveSearch = (name: string) => {
    if (!name.trim()) return;

    let newSearches = [...recentSearches];
    const existingIndex = newSearches.findIndex(
      s => s.name.toLowerCase() === name.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Đưa item cũ lên đầu
      const [existing] = newSearches.splice(existingIndex, 1);
      newSearches = [existing, ...newSearches];
    } else {
      newSearches = [{ id: uuidv4(), name, searched: true }, ...newSearches];
    }

    if (newSearches.length > 10) newSearches = newSearches.slice(0, 10);

    setRecentSearches(newSearches);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSearches));
  };

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    saveSearch(value); // lưu ngay khi nhấn Enter
    setIsDropdownOpen(false);
    router.push(`/search/result?query=${encodeURIComponent(value)}`);
  };

  return (
    <div className="relative bg-[#E36137] h-56 grid grid-cols-2 rounded-xl">
      {/* Search Field */}
      <div className="relative flex flex-col items-start justify-start px-4 pt-4">
        <div className="relative w-full">
          <div className="flex w-full flex-row items-center justify-start rounded-lg bg-white h-10 px-2 gap-4 relative z-10">
            <Image unoptimized src={icons.searchIcon} alt="search" width={24} height={24} />
            <div className="flex flex-row items-center justify-start rounded bg-[rgba(239,68,68,0.2)] px-.5 py-0.5 gap-0.5">
              <Image unoptimized src={icons.fireIcon} alt="hot" width={16} height={16} />
              <span className="font-medium text-red-500 text-sm">Hot</span>
            </div>
            <input
              placeholder="Mì tôm thanh long"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(searchValue);
                }
              }}
              className="text-sm font-medium text-black border-none outline-none flex-1 bg-transparent"
            />
          </div>

          <SearchDropdown
            searchText={searchValue}
            isOpen={isDropdownOpen}
            onClose={handleClose}
            recentSearches={recentSearches}
            onSelect={value => {
              setSearchValue(value);
              handleSearch(value);
            }}
          />
        </div>
      </div>

      {/* Hero image và bubble */}
      <div className="relative">
        <div className="absolute right-0 bottom-0 w-[200px] h-[200px]">
          <Image unoptimized src={images.searchHero} alt="search hero" fill className="object-contain" />
        </div>

        <div className="absolute flex items-center justify-center w-[170px] h-[137px] right-[200px] bottom-[48px]">
          <div className="absolute inset-0">
            <Image unoptimized src={images.messageBubble2} alt="bubble" fill className="object-contain" />
          </div>
          <span className="text-[13px] font-light text-customSecondary max-w-[120px] relative z-10">
            Nhập tên món ăn nếu bạn đã lựa chọn được món muốn nấu hoặc nhập tên nguyên liệu để xem gợi ý nhé!
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
