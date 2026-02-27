
"use client";

import Loading from "@/components/Common/Loading";
import ChangePasswordScreen from "@/components/Screen/Desktop/ChangePasswordScreen";
import MobileChangePasswordScreen from "@/components/Screen/Mobile/MobileChangePasswordScreen";
import useMobile from "@/hooks/useMobile";

export default function ChangePasswordPage() {
    const { isLoading, isMobile } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileChangePasswordScreen /> : <ChangePasswordScreen />;
}