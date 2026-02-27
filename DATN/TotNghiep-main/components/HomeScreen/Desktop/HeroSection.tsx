'use client';

import { images } from '@/constants';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import FoodChatbot from './FoodChatbot/FoodChatbot';

type HeroTab = 'ban-bep' | 'cam-hung' | 'hoi-dap';

interface HeroSectionProps {
    activeTab: HeroTab;
    onTabChange: (tab: HeroTab) => void;
}

const HeroSection = ({ activeTab, onTabChange }: HeroSectionProps) => {
    const user = useAuthStore((state) => state.user);

    if (!user) return null;

    const renderTabButton = (tab: HeroTab, label: string, extraClass = '') => {
        const isActive = activeTab === tab;

        return (
            <button
                className={`
                    w-1/3 h-[40px] border-b-2
                    ${isActive
                        ? 'bg-customPrimary border-b-white'
                        : 'bg-[#F1EEE8] border-b-transparent'}
                    ${extraClass}
                `}
                onClick={() => onTabChange(tab)}
            >
                <p
                    className={`font-medium text-base ${isActive ? 'text-white' : 'text-customPrimary'
                        }`}
                >
                    {label}
                </p>
            </button>
        );
    };

    return (
        <div className="lg:mx-16 lg:my-4 " >
            {/* ===== HERO ===== */}
            <div className="flex">
                {renderTabButton('ban-bep', 'Bạn Bếp', 'rounded-tl-xl')}
                {renderTabButton('cam-hung', 'Cảm hứng')}
                {renderTabButton('hoi-dap', 'Hỏi đáp gợi ý', 'rounded-tr-xl')}
            </div>
            <div className={`h-[256px] rounded-b-xl overflow-hidden ${activeTab === 'hoi-dap' ? 'hidden' : ''}`}>
                {/* Tabs */}


                {/* Hero content */}
                <div
                    className={`
                        relative bg-customPrimary h-[216px] w-full rounded-b-xl
                        ${activeTab === 'ban-bep' ? 'rounded-tr-xl' : ''}
                        ${activeTab === 'hoi-dap' ? 'rounded-tl-xl' : ''}
                    `}
                >
                    {/* Hero image */}
                    <div className="absolute left-0 bottom-0 w-[200px] h-[200px]">
                        <Image
                            unoptimized
                            src={images.homeHero}
                            alt="home-hero"
                            width={200}
                            height={200}
                        />
                    </div>

                    {/* Message bubble */}
                    <div className="absolute flex flex-col justify-center items-center right-[19px] top-[50px] w-[186px] h-[98px]">
                        <Image
                            unoptimized
                            src={images.messageBubble}
                            alt="message-bubble"
                            fill
                            className="object-contain absolute inset-0 z-0"
                        />

                        <p className="font-medium text-customSecondary max-w-[141px] z-10 relative text-sm text-center">
                            Chào ngày mới,&nbsp;
                            <span className="font-bold text-blue-900 text-base">
                                {user.username}
                            </span>
                        </p>

                        <p className="font-light text-customSecondary max-w-[141px] z-10 relative text-xs text-center">
                            {activeTab === 'ban-bep' &&
                                'Cùng vào xem các công thức mới của Bạn Bếp nào!'}
                            {activeTab === 'cam-hung' &&
                                'Khám phá những ý tưởng nấu ăn đầy cảm hứng nhé!'}
                            {activeTab === 'hoi-dap' &&
                                'Hỏi nguyên liệu, món ăn – mình gợi ý ngay 🍳'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== CHATBOT (CHỈ HIỆN KHI HOI-DAP) ===== */}
            
        </div>
    );
};

export default HeroSection;
