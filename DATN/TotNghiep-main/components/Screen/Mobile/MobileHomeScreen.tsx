import { useState } from 'react';
import { suggestedFriendsData } from '@/components/HomeScreen/mockData';
import KitchenTab from '@/components/HomeScreen/Mobile/KitchenTab';
import HeroSection from '@/components/HomeScreen/Mobile/HeroSection';
import InspirationTab from '@/components/HomeScreen/Mobile/InspirationTab';
import BottomNavigator from '@/components/Common/BottomNavigator';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome from '@api/ApiHome';
import ApiUser from '@api/ApiHome';
import { images, onboarding } from '@constants/index';

const MobileHomeScreen = () => {
    const {
        data: postsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE],
        queryFn: () => ApiHome.getRecipesFollowing(0, 50), // page = 0, size = 10
        staleTime: 1000 * 60 * 5,
    });
    const [activeTab, setActiveTab] = useState<'ban-bep' | 'cam-hung' | 'hoi-dap'>('ban-bep');


        // 🔥 Gọi API suggested friends
    const {
        data: suggestedFriendsData = [],
        isLoading: loadingSuggested,
        error: suggestedError,
    } = useQuery({
        queryKey: ['getSuggestedFriends'],
        queryFn: ApiUser.getSuggestedFriends,
        staleTime: 1000 * 60 * 3,
    });
    console.log(suggestedFriendsData)
    // 📌 Giữ nguyên banner
    const bannerData = [
        { banner: images.banner1, ...onboarding[0] },
        { banner: images.banner2, ...onboarding[1] },
        { banner: images.banner3, ...onboarding[2] },
    ];
    return (
        <div className='bg-backgroundV1 w-full max-w-screen overflow-hidden pb-14'>
            <HeroSection
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {activeTab === 'ban-bep' && (
                <KitchenTab
                    postsData={postsData}
                    suggestedFriendsData={suggestedFriendsData}
                />
            )}
            {activeTab === 'cam-hung' && <InspirationTab />}
            <BottomNavigator />
        </div>
    );
};

export default MobileHomeScreen;