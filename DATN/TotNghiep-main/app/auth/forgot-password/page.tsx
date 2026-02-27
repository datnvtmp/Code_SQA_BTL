"use client";

import Loading from "@/components/Common/Loading";
import ForgotPasswordScreen from "@/components/Screen/Desktop/ForgotPasswordScreen";
import MobileForgotPasswordScreen from "@/components/Screen/Mobile/MobileForgotPasswordScreen";
import useMobile from "@/hooks/useMobile";

export default function ForgotPasswordScreenPage() {
    const { isLoading, isMobile } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileForgotPasswordScreen /> : <ForgotPasswordScreen />;
}