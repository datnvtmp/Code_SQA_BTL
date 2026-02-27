'use client';

import Loading from '@/components/Common/Loading';
import useMobile from '@/hooks/useMobile';
import MobileNotificationScreen from '@/components/Screen/Mobile/MobileNotificationScreen';

export default function CreateRecipePage() {
    const { isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }

    return <MobileNotificationScreen />
}
