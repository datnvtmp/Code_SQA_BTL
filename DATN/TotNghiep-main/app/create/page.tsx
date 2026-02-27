'use client';

import Header from '@/components/Common/Header';
import Loading from '@/components/Common/Loading';
import useMobile from '@/hooks/useMobile';
import PersonalChestScreen from '@/components/Screen/Desktop/PersonalChestScreen';
import MobilePersonalChestScreen from '@/components/Screen/Mobile/MobilePersonalChestScreen';

export default function CreateRecipePage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }

    return (
        isMobile ? (<MobilePersonalChestScreen />) : (<>
            <Header />
            <main className="w-full overflow-hidden">
                <PersonalChestScreen />
            </main>
        </>
        ))
}
