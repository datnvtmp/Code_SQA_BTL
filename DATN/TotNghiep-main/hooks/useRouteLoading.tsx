'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/Common/LoadingProvider';

export const useRouteLoading = () => {
    const { setLoading } = useLoading();
    const router = useRouter();

    // Override router methods to show loading
    const navigateWithLoading = {
        push: (href: string) => {
            setLoading(true);
            router.push(href);
        },
        replace: (href: string) => {
            setLoading(true);
            router.replace(href);
        },
        back: () => {
            setLoading(true);
            router.back();
        },
        forward: () => {
            setLoading(true);
            router.forward();
        },
        refresh: () => {
            setLoading(true);
            router.refresh();
        }
    };

    return {
        router: navigateWithLoading,
        setLoading
    };
};
