"use client";

import Loading from "@/components/Common/Loading";
import SignUpScreen from "@/components/Screen/Desktop/SignUpScreen";
import MobileSignUpScreen from "@/components/Screen/Mobile/MobileSignUpScreen";
import useMobile from "@/hooks/useMobile";

export default function SignUpPage() {
    const { isLoading, isMobile } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileSignUpScreen /> : <SignUpScreen />;
}
