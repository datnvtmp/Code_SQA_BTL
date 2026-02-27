'use client';

import { useState } from 'react';
import InspirationTab from '../../HomeScreen/Desktop/InspirationTab';
import KitchenTab from '../../HomeScreen/Desktop/KitchenTab';
import ApiUser from '@api/ApiHome';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import 'swiper/css';
import 'swiper/css/pagination';
import HeroSection from '../../HomeScreen/Desktop/HeroSection';
import FoodChatbot from '@components/HomeScreen/Desktop/FoodChatbot/FoodChatbot';

const API_BASE = process.env.NEXT_PUBLIC_API_DATA;

/* ===== type banner ===== */
interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  subTitle: string;
}

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<'ban-bep' | 'cam-hung' | 'hoi-dap'>('ban-bep');

  // 🔥 Gọi API suggested friends
  const { data: suggestedFriendsData = [] } = useQuery({
    queryKey: ['getSuggestedFriends'],
    queryFn: ApiUser.getSuggestedFriends,
    staleTime: 1000 * 60 * 3,
  });

  const { data: bannerData = [], isLoading: loadingBanner } = useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/banners`);
      if (!res.ok) throw new Error('Failed to fetch banners');
      const json = await res.json();
      return json?.success && Array.isArray(json?.data) ? json.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="flex-1 bg-transparent">
      <div className="bg-backgroundV1">

        {/* Banner Section */}
        <div className="relative w-full h-[25vh] md:h-[50vh] max-h-[50vh]">
          {!loadingBanner && bannerData.length > 0 && (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true, el: '.swiper-pagination-banner' }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop
              grabCursor
              className="w-full h-full banner-swiper"
            >
              {bannerData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>

                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      priority
                      className="object-cover"
                    />

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
                      <p className="text-2xl font-semibold text-white text-center">
                        {item.title}
                      </p>
                      <p className="text-lg max-w-3xl text-center text-[#eee] mt-2">
                        {item.subTitle}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="swiper-pagination-banner absolute bottom-4 left-1/2 -translate-x-1/2 z-50" />
        </div>

        {/* Hero + Tabs */}
        <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Bàn bếp */}
        {activeTab === 'ban-bep' && (
          <KitchenTab suggestedFriendsData={suggestedFriendsData} />
        )}

        {/* Tab Cảm hứng */}
        {activeTab === 'cam-hung' && <InspirationTab />}

        {/* Tab Hỏi đáp */}
        {activeTab === 'hoi-dap' && (
          <div className="mt-4 min-h-[calc(100vh-320px)]">
            <FoodChatbot />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
