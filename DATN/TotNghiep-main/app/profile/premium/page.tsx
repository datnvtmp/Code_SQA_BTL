"use client";

import useMobile from "@/hooks/useMobile";
import Loading from "@/components/Common/Loading";
import MobilePremiumScreen from "@/components/Screen/Mobile/MobilePremiumScreen";

export default function PremiumProfilePage() {
    const { isLoading } = useMobile();

    if (isLoading) {
        return <Loading />;
    }

    return <MobilePremiumScreen />;
}