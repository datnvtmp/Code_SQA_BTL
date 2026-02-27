'use client';

import Header from "@/components/Common/Header";
import Loading from "@/components/Common/Loading";
import FoodDetailScreen from "@/components/Screen/Desktop/FoodDetailScreen";
import MobileFoodDetailScreen from "@/components/Screen/Mobile/MobileFoodDetailScreen";
import useMobile from "@/hooks/useMobile";

export default function FoodDetailPage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileFoodDetailScreen /> : (
        <>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <FoodDetailScreen />
            </main>
        </>
    );
}