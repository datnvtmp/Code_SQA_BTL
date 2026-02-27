import MessagesTab from '@/components/BellScreen/Desktop/MessagesTab';
import NotificationTab from '@/components/BellScreen/Desktop/NotificationTab';
import BottomNavigator from '@/components/Common/BottomNavigator';
import { useState } from 'react';

const MobileNotificationScreen = () => {
    const [activeTab, setActiveTab] = useState<'announcement' | 'message'>('announcement');

    const handleTabChange = (tab: 'announcement' | 'message') => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Tab Navigator section */}
            <div className="flex pb-2 flex-row items-center">
                <button
                    className={`w-1/2 flex justify-center items-center min-h-[38px] h-[38px] border-b-2 ${activeTab === 'announcement' ? 'border-[#E36137]' : 'border-transparent'
                        } bg-transparent p-0 cursor-pointer`}
                    onClick={() => handleTabChange('announcement')}
                >
                    <span
                        className={`font-medium text-base ${activeTab === 'announcement' ? 'text-[#E36137]' : 'text-[#979797]'
                            }`}
                    >
                        Thông báo
                    </span>
                </button>
                <button
                    className={`w-1/2 flex justify-center items-center min-h-[38px] h-[38px] border-b-2 ${activeTab === 'message' ? 'border-[#E36137]' : 'border-transparent'
                        } bg-transparent p-0 cursor-pointer`}
                    onClick={() => handleTabChange('message')}
                >
                    <span
                        className={`font-medium text-base ${activeTab === 'message' ? 'text-[#E36137]' : 'text-[#979797]'
                            }`}
                    >
                        Tin nhắn
                    </span>
                </button>
            </div>

            {/* Content của Thông báo */}
            <div className="flex-1 bg-[#EFECE6] mb-6">
                {activeTab === 'announcement' && <NotificationTab />}
                {activeTab === 'message' && <MessagesTab />}
            </div>
            <BottomNavigator />
        </div>
    );
};

export default MobileNotificationScreen;
