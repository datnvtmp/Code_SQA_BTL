import BottomNavigator from "@/components/Common/BottomNavigator";
import HeroSection from "@/components/SearchScreen/Mobile/HeroSection";
import SearchHistorySection from "@/components/SearchScreen/Mobile/SearchHistorySection";
import SuggestedTopicsSection from "@/components/SearchScreen/Mobile/SuggestedTopicsSection";

const MobileSearchScreen = () => {
    return (
        <div className='bg-backgroundV1 w-full max-w-screen overflow-hidden pb-14'>
            <HeroSection />
            <SearchHistorySection />
            <SuggestedTopicsSection />
            <BottomNavigator />
        </div>
    );
};

export default MobileSearchScreen;
