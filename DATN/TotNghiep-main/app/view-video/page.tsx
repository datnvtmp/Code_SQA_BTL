'use client';

import Loading from '@/components/Common/Loading';
import MobileViewVideoScreen from '@/components/Screen/Mobile/MobileViewVideoScreen';
import useMobile from '@/hooks/useMobile';

export default function ViewVideoPage() {
    const { isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }

    return <MobileViewVideoScreen />
}
