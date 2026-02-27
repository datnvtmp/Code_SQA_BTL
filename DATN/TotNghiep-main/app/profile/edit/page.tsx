"use client";
import useMobile from "@/hooks/useMobile";
import Loading from "@/components/Common/Loading";
import MobileEditProfileScreen from "@/components/Screen/Mobile/MobileEditProfileScreen";

export default function EditProfilePage() {
    const { isLoading } = useMobile();
    if (isLoading) {
        return <Loading />;
    }
    return <MobileEditProfileScreen />
}