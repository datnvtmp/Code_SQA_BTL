'use client';

import { useState } from 'react';
import HeroSection from '../../SearchScreen/Desktop/HeroSection';
import SearchHistorySection from '../../SearchScreen/Desktop/SearchHistorySection';
import SuggestedTopicsSection from '../../SearchScreen/Desktop/SuggestedTopicsSection';

const SearchScreen = () => {
    const [searchValue, setSearchValue] = useState(''); // state ở đây

    return (
        <div className="flex-1 bg-backgroundV1 px-16">
            <div className='py-4 bg-backgroundV1'>
                <HeroSection
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
            </div>
            <SearchHistorySection />
            <SuggestedTopicsSection  />
        </div>
    );
};

export default SearchScreen;
