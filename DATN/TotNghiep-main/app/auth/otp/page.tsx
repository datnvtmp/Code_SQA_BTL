"use client";

import Loading from "@/components/Common/Loading";
import OTPInputScreen from "@/components/Screen/Desktop/OTPInputScreen";
import MobileOTPInputScreen from "@/components/Screen/Mobile/MobileOTPInputScreen";
import useMobile from "@/hooks/useMobile";

export default function OTPInputPage() {
    const { isLoading, isMobile } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileOTPInputScreen /> : <OTPInputScreen />;
}
