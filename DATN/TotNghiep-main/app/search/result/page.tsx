'use client';

import Header from '@/components/Common/Header';
import Loading from '@/components/Common/Loading';
import useMobile from '@/hooks/useMobile';
import { Suspense } from 'react';
import SearchResultsScreen from '@/components/Screen/Desktop/SearchResultsScreen';
import MobileSearchResultsScreen from '@/components/Screen/Mobile/MobileSearchResultsScreen';

export default function SearchResultsPage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }

    return (
        isMobile ? (<MobileSearchResultsScreen />) : (
            <>
                <Header />
                <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                    <Suspense fallback={null}>
                        <SearchResultsScreen />
                    </Suspense>
                </main>
            </>
        ))
}
