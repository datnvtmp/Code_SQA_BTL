'use client';

import { icons } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import CustomTabTrigger from './CustomTabTrigger';

const navigationTabs = [
    {
        id: "home",
        icon: icons.homeIcon,
        activeIcon: icons.activeHomeIcon,
        route: "/",
        size: 24
    },
    {
        id: "search",
        icon: icons.searchIcon,
        activeIcon: icons.activeSearchIcon,
        route: "/search",
        size: 24
    },
    {
        id: "plus",
        icon: icons.plusIcon,
        activeIcon: icons.activePlusIcon,
        route: "/create",
        size: 24
    },
    {
        id: "bell",
        icon: icons.bellIcon,
        activeIcon: icons.activeBellIcon,
        route: "/notification",
        size: 24
    },
    {
        id: "profile",
        icon: icons.userIcon,
        activeIcon: icons.activeUserIcon,
        route: "/profile",
        size: 24
    }
];

export default function BottomNavigator() {
    const pathname = usePathname();
    const router = useRouter();

    const getActiveTab = () => {
        const normalizedPath = pathname.replace(/\/$/, '') || '/';
        if (normalizedPath === '/' || normalizedPath === "/" || normalizedPath === "") return "home";
        if (normalizedPath === "/search") return "search";
        if (normalizedPath === "/create" || normalizedPath.includes('/create')) return "plus";
        if (normalizedPath === "/notification") return "bell";
        if (normalizedPath === "/profile") return "profile";

        if (normalizedPath.includes('/')) return "home";
        if (normalizedPath.includes('/search')) return "search";
        if (normalizedPath.includes('/create')) return "plus";
        if (normalizedPath.includes('/notification')) return "bell";
        if (normalizedPath.includes('/profile')) return "profile";

        return "home";
    };

    const activeTab = getActiveTab();

    const handleTabPress = (route: string) => {
        router.push(route);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t-0 shadow-none">
            <div className="bg-white h-14 flex flex-row items-center w-full m-0 p-0 px-2">
                {navigationTabs.map((tab) => {
                    const isTabActive = activeTab === tab.id;
                    return (
                        <CustomTabTrigger
                            key={tab.id}
                            isActive={isTabActive}
                            onPress={() => handleTabPress(tab.route)}
                            icon={tab.icon}
                            activeIcon={tab.activeIcon}
                            iconSize={tab.size}
                        />
                    );
                })}
            </div>
        </div>
    );
}
