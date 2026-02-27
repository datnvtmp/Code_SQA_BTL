'use client';

import { useQuery } from '@tanstack/react-query';

import SuggestedFriendItem from './SuggestedFriendItem';
import PostsSwiper from './PostsSwiper';
import PostsSwiper2 from './PostsSwiper2';
import RSSAmThucGrid from './VietnamPlusRecipes';
import CalorieSection from './CalorieSection';
import PostsSwiper3 from './PostsSwiper3';

/* =======================
   Types
======================= */

interface SuggestedFriendData {
    id: string;
    name: string;
    commonFriends: string[];
    hashtag: string;
    avatarUrl: string;
}

interface YoutubeVideo {
    id: number;
    title: string;
    youtubeUrl: string;
    thumbnail: string | null;
}

interface KitchenTabProps {
    suggestedFriendsData: SuggestedFriendData[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_DATA;

/* =======================
   Utils
======================= */

const normalizeYoutubeEmbedUrl = (url: string): string => {
    if (!url) return '';

    if (url.includes('/embed/')) {
        return url.replace(/"/g, '').trim();
    }

    try {
        const u = new URL(url);
        const videoId = u.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch {
        return '';
    }
};

/* =======================
   Component
======================= */

const KitchenTab = ({ suggestedFriendsData }: KitchenTabProps) => {

    /* ===== Featured YouTube Videos ===== */
    const {
        data: youtubeVideos = [],
        isLoading,
        isError,
    } = useQuery<YoutubeVideo[]>({
        queryKey: ['featured-youtube-videos'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/featured-videos`);
            if (!res.ok) throw new Error('Fetch failed');

            const json = await res.json();
            return json?.success && Array.isArray(json.data) ? json.data : [];
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="bg-backgroundV1 py-4 space-y-12">

            {/* ===== Posts ===== */}
            <PostsSwiper />

            {/* ===== Suggested Friends ===== */}
            <section className=" py-2">
                <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-pink-50 px-6 sm:px-16 pt-4 pb-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-base text-black">
                            Gợi ý Bạn Bếp
                        </h3>
                        <button className="text-sm text-orange-500 hover:underline">
                            Xem thêm
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {suggestedFriendsData.map((item) => (
                            <SuggestedFriendItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== More Posts ===== */}
            <PostsSwiper2 />

            {/* ===== Calories ===== */}
            <CalorieSection />

            {/* ===== More Posts ===== */}
            <PostsSwiper3 />

            {/* ===== YouTube Videos ===== */}
            <section className="py-12 px-6 sm:px-16">
                <h2 className="text-2xl font-bold mb-6">
                    Video dạy nấu ăn nổi bật
                </h2>

                {isLoading && (
                    <p className="text-gray-500">Đang tải video...</p>
                )}

                {isError && (
                    <p className="text-red-500">
                        Không thể tải danh sách video
                    </p>
                )}

                {!isLoading && youtubeVideos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {youtubeVideos.map((video) => {
                            const embedUrl = normalizeYoutubeEmbedUrl(video.youtubeUrl);
                            if (!embedUrl) return null;

                            return (
                                <div key={video.id}>
                                    <div className="relative w-full rounded-lg overflow-hidden shadow-md aspect-video">
                                        <iframe
                                            src={embedUrl}
                                            title={video.title}
                                            className="absolute inset-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    <p className="mt-3 text-sm font-medium text-gray-800 line-clamp-2">
                                        {video.title}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ===== RSS ===== */}
            <RSSAmThucGrid />
        </div>
    );
};

export default KitchenTab;
