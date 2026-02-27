import PostsSwiper2 from '@components/HomeScreen/Desktop/KitchenTab/PostsSwiper2';
import PostItem from './PostItem';
import SuggestedFriendItem from './SuggestedFriendItem';
import CalorieSection from '@components/HomeScreen/Desktop/KitchenTab/CalorieSection';
import RSSAmThucGrid from '@components/HomeScreen/Desktop/KitchenTab/VietnamPlusRecipes';
import PostsSwiper3 from '@components/HomeScreen/Desktop/KitchenTab/PostsSwiper3';
import PostsSwiper from '@components/HomeScreen/Desktop/KitchenTab/PostsSwiper';

interface KitchenTabProps {
    postsData: any[];
    suggestedFriendsData: any[];
}
const youtubeVideos = [
    'https://www.youtube.com/embed/VMfpF58qiWo?si=25iLOtc9ERm4NgzD', // ví dụ link
    'https://www.youtube.com/embed/FKFih1fkST4?si=miY-kIuH987dbStF',
    'https://www.youtube.com/embed/P2w9e6xNiB8?si=HQWvhJMVSHz0TyBy'
];
const KitchenTab = ({ postsData, suggestedFriendsData }: KitchenTabProps) => {
    return (
        <div className="flex flex-col items-center gap-2 mt-2">
            {/* Posts section */}
            {/* <div className="self-stretch py-4 px-4 flex flex-col justify-center items-center gap-4 bg-white">
                <div className="w-full flex flex-col gap-4">
                    {postsData?.map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </div>
            </div> */}
            <PostsSwiper />
            {/* Suggested friends section */}
            <div className="w-full px-4 pt-4 pb-8 flex flex-col justify-start items-start gap-4 bg-white">
                <div className="self-stretch flex flex-row justify-between items-start">
                    <span className="font-bold text-black text-base">
                        Gợi ý Bạn Bếp
                    </span>
                    <span className="text-orange-500 text-sm">
                        Xem thêm
                    </span>
                </div>
                <div className="w-full flex flex-col gap-3">
                    {suggestedFriendsData.map((item) => (
                        <SuggestedFriendItem key={item.id} item={item} />
                    ))}
                </div>
            </div>

            {/* Additional posts section */}
            <PostsSwiper2 />

            <CalorieSection />

            {/* ===== More Posts ===== */}
            <PostsSwiper3 />
            {/* YouTube videos section */}
            <div className="py-12 px-4 sm:px-16 sm:px-16">
                <h2 className="text-2xl font-bold mb-6 text-left">Video dạy nấu ăn nổi bật</h2>
                <div className="flex flex-wrap -mx-4 justify-center">
                    {youtubeVideos.map((video, idx) => (
                        <div key={idx} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
                            <div className="relative" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                                    src={video}
                                    title={`Cooking Video ${idx + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <RSSAmThucGrid />
        </div>
    );
};

export default KitchenTab;
