'use client';

import Header from '@/components/Common/Header';
import Loading from '@/components/Common/Loading';
import useMobile from '@/hooks/useMobile';
import CreateCollectionPage from '@components/Screen/Desktop/CreateCollectionScreen';

export default function CreateRecipePage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <CreateCollectionPage />
            </main>
        </>
    )
}
