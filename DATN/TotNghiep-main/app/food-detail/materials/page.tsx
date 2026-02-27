'use client';

import RecipeScreen from '@/components/Screen/Desktop/RecipeScreen';
import Header from "@/components/Common/Header";
import useMobile from '@/hooks/useMobile';
import Loading from '@/components/Common/Loading';
import MobileRecipeScreen from '@/components/Screen/Mobile/MobileRecipeScreen';

export default function FoodMaterialsPage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileRecipeScreen /> : (
        <>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <RecipeScreen />
            </main>
        </>
    );
}