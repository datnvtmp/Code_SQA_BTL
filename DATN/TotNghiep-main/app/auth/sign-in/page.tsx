"use client";

import Loading from "@/components/Common/Loading";
import LogInScreen from "@/components/Screen/Desktop/LogInScreen";
import MobileLogInScreen from "@/components/Screen/Mobile/MobileLogInScreen";
import useMobile from "@/hooks/useMobile";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation"; // dùng next/navigation, không phải next/router
import { useEffect } from "react";

export default function SignInPage() {
    const { isLoading, isMobile } = useMobile();
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();

    // Redirect nếu đã login
    useEffect(() => {
        if (isLoggedIn) {
            router.replace("/profile");
        }
    }, [isLoggedIn, router]);

    if (isLoading || isLoggedIn) {
        return <Loading />; 
    }

    return isMobile ? <MobileLogInScreen /> : <LogInScreen />;
}
