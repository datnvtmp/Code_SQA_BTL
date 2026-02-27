'use client';

import { images } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import FoodChatbot from '../Desktop/FoodChatbot/FoodChatbot';

type HeroTab = 'ban-bep' | 'cam-hung' | 'hoi-dap';

interface HeroSectionProps {
    activeTab: HeroTab;
    onTabChange: (tab: HeroTab) => void;
}

const HeroSection = ({ activeTab, onTabChange }: HeroSectionProps) => {
    const user = useAuthStore((state) => state.user);
    if (!user) return null;

    return (
        <>
            {/* ===== HERO ===== */}
            <div className="h-64 bg-[#E36137] relative w-full">
                {/* Hero image */}
                <div className="absolute left-0 bottom-0 w-[200px] h-[200px]">
                    <Image
                        unoptimized
                        src={images.homeHero}
                        alt="Hero"
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                </div>

                {/* Message bubble */}
                <div className="absolute right-5 top-12">
                    <div className="relative w-[186px] h-[98px] flex flex-col justify-center items-center">
                        <Image
                            unoptimized
                            src={images.messageBubble}
                            alt="Message bubble"
                            fill
                            className="object-contain absolute inset-0"
                        />

                        <span className="font-medium text-customSecondary text-sm max-w-[141px] relative z-10 text-center">
                            Chào ngày mới,&nbsp;
                            <span className="font-bold text-blue-900 text-base">
                                {user.username}
                            </span>
                        </span>

                        <span className="font-light text-customSecondary text-xs max-w-[141px] relative z-10 text-center">
                            {activeTab === 'ban-bep' &&
                                'Cùng vào xem các công thức mới của Bạn Bếp nào!'}
                            {activeTab === 'cam-hung' &&
                                'Khám phá những ý tưởng nấu ăn đầy cảm hứng nhé!'}
                            {activeTab === 'hoi-dap' &&
                                'Đặt câu hỏi để nhận gợi ý món ăn phù hợp cho bạn!'}
                        </span>
                    </div>
                </div>

                {/* ===== TAB NAV ===== */}
                <div className="flex fixed top-0 left-0 right-0 z-50 bg-[#E36137]">
                    {[
                        { key: 'ban-bep', label: 'Bạn Bếp' },
                        { key: 'cam-hung', label: 'Cảm hứng' },
                        { key: 'hoi-dap', label: 'Hỏi đáp' },
                    ].map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => onTabChange(tab.key as HeroTab)}
                                className={`
                                    w-1/3 h-[38px] flex justify-center items-center
                                    border-b-2
                                    ${
                                        isActive
                                            ? 'border-b-white'
                                            : 'border-b-transparent'
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        font-medium text-base
                                        ${
                                            isActive
                                                ? 'text-white'
                                                : 'text-white/50'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ===== SECTION HỎI ĐÁP ===== */}
            {activeTab === 'hoi-dap' && (
                <div className="xl:px-4 pb-4 -mt-15">
                    <FoodChatbot />
                </div>
            )}
        </>
    );
};

export default HeroSection;
