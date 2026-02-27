"use client";
import useMobile from "@/hooks/useMobile";
import Loading from "@/components/Common/Loading";
import MobileSecurityScreen from "@/components/Screen/Mobile/MobileSecurityScreen";

export default function SecurityProfilePage() {
    const { isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return <MobileSecurityScreen />
}