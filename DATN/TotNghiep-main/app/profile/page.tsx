"use client";

import ProfileScreen from "@/components/Screen/Desktop/ProfileScreen";
import Header from "@/components/Common/Header";
import useMobile from "@/hooks/useMobile";
import Loading from "@/components/Common/Loading";
import MobileProfileScreen from "@/components/Screen/Mobile/MobileProfileScreen";
import BottomNavigator from "@/components/Common/BottomNavigator";

export default function ProfilePage() {
    const { isLoading, isMobile } = useMobile();

    if (isLoading) {
        return <Loading />;
    }

    if (isMobile) {
        return (
            <>
                <MobileProfileScreen />
                <BottomNavigator />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <ProfileScreen />
            </main>
        </>
    );
}
