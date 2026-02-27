"use client";
import Header from "@/components/Common/Header";
import Loading from "@/components/Common/Loading";
import SettingScreen from "@/components/Screen/Desktop/SettingScreen";
import MobileSettingScreen from "@/components/Screen/Mobile/MobileSettingScreen";
import useMobile from "@/hooks/useMobile";

export default function SettingPage() {
    const { isLoading, isMobile } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return isMobile ? <MobileSettingScreen /> : (
        <>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <SettingScreen />
            </main>
        </>
    );
}