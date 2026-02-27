'use client';

import TableSelection from '@/components/Screen/Desktop/TableSelection';
import Header from "@/components/Common/Header";
import { Suspense } from 'react';
import useMobile from '@/hooks/useMobile';
import Loading from '@/components/Common/Loading';
import MobileTableSelection from '@/components/Screen/Mobile/MobileTableSelection';

export default function SettingPage() {
    const { isMobile, isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return (<>
        <Header />
        <main className="w-full pt-16 min-h-screen bg-backgroundV1">
            <Suspense fallback={null}>
                <TableSelection />
            </Suspense>
        </main>
    </>
    );
}