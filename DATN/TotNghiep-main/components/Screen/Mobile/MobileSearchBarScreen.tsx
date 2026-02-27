"use client";

import { icons } from '@/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { searchSuggestionsData } from '@/components/SearchScreen/mockData';
import SearchSuggestionItem from '@/components/SearchScreen/Mobile/SearchSuggestionItem';

const MobileSearchBarScreen = () => {
    const [searchText, setSearchText] = useState('');
    const router = useRouter();

    const getFilteredData = () => {
        if (searchText.trim() === '') {
            return searchSuggestionsData.filter(item => item.searched === true);
        } else {
            return searchSuggestionsData.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    };

    // 👉 XỬ LÝ ENTER ĐỂ SEARCH
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const keyword = searchText.trim();

            if (keyword.length === 0) {
                alert("Vui lòng nhập từ khóa tìm kiếm");
                return;
            }

            router.push(`/search/result?searchQuery=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <div className='bg-backgroundV1 w-full max-w-screen overflow-hidden pb-14 h-screen p-4'>
            {/* Status Bar and Search Input */}
            <div className="w-full flex flex-row justify-start items-center gap-2">
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
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}     // 👈 Thêm vào đây
                        placeholder="Tìm kiếm..."
                        className="flex-1 text-sm font-medium text-black py-0 border-none outline-none bg-transparent"
                    />
                </div>
            </div>

            {/* Search Suggestions */}
            <div className="w-full py-2">
                {getFilteredData().map((item) => (
                    <SearchSuggestionItem key={item.id} item={item} />
                ))}
            </div>

            <div className='w-full flex justify-center items-center'>
                <span className="w-full text-center text-customPrimary text-sm mt-0.5">
                    Xem tất cả
                </span>
            </div>

        </div>
    );
};

export default MobileSearchBarScreen;
