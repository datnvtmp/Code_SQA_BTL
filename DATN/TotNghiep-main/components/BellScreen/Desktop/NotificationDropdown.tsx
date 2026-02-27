'use client';

import { useState } from 'react';
import MessagesTab from './MessagesTab';
import NotificationTab from './NotificationTab';

const NotificationDropdown = () => {
    const [activeTab, setActiveTab] = useState<'announcement' | 'message'>('announcement');

    const handleTabChange = (tab: 'announcement' | 'message') => {
        setActiveTab(tab);
    };

    return (
        <div className="flex min-h-dvh flex-1 bg-backgroundV1 w-[400px] max-w-[400px] overflow-y-auto overflow-x-hidden">
            <div className="w-full">
                {/* Tab Navigator section */}
                <div className='flex flex-row items-center pb-2 bg-white'>
                    <button
                        className={`w-1/2 items-center justify-center min-h-[40px] h-[40px] border-b-2 ${activeTab === 'announcement' ? 'border-[#E36137]' : 'border-transparent'
                            }`}
                        onClick={() => handleTabChange('announcement')}
                    >
                        <p
                            className={`font-medium text-base ${activeTab === 'announcement' ? 'text-[#E36137]' : 'text-[#979797]'
                                }`}
                        >
                            Thông báo
                        </p>
                    </button>
                    <button
                        className={`w-1/2 items-center justify-center min-h-[40px] h-[40px] border-b-2 ${activeTab === 'message' ? 'border-[#E36137]' : 'border-transparent'
                            }`}
                        onClick={() => handleTabChange('message')}
                    >
                        <p
                            className={`font-medium text-base ${activeTab === 'message' ? 'text-[#E36137]' : 'text-[#979797]'
                                }`}
                        >
                            Tin nhắn
                        </p>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#EFECE6]">
                    {activeTab === 'announcement' && <NotificationTab />}
                    {activeTab === 'message' && <MessagesTab />}
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;