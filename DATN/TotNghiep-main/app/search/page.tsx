'use client';

import Header from '@/components/Common/Header';
import Loading from '@/components/Common/Loading';
import useMobile from '@/hooks/useMobile';
import SearchScreen from '@/components/Screen/Desktop/SearchScreen';
import MobileSearchScreen from '@/components/Screen/Mobile/MobileSearchScreen';

export default function SearchPage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }

    return (
        isMobile ? (<MobileSearchScreen />) : (<>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <SearchScreen />
            </main>
        </>
        ))
}
