import { icons, images } from '@/constants';
import Image from 'next/image';
import { messagesData } from '../mockData';

interface MessageItem {
  id: string;
  userName: string;
  message: string;
  unreadCount?: number;
  hasNotificationDot?: boolean;
}

interface MessageSection {
  id: string;
  title: string;
  messages: MessageItem[];
}

const MessageRow = ({ item }: { item: MessageItem }) => {
  return (
    <button className="flex min-h-10 w-full items-center justify-center gap-2 text-left">
      <div className="h-10 w-10">
        <Image unoptimized
          src={images.sampleAvatar}
          alt="avatar"
          className="h-10 w-10 rounded-full border-2 border-[#E36137] object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-medium text-black text-sm">
            {item.userName}
          </p>
          <p className="truncate text-gray-600 text-xs">
            {item.message}
          </p>
        </div>
        {item.unreadCount ? (
          <div className="min-w-5 h-5 flex justify-center items-center rounded-full bg-[#E36137] text-white text-semibold text-xs px-2 text-center">
            {item.unreadCount > 99 ? '99+' : item.unreadCount}
          </div>
        ) : item.hasNotificationDot ? (
          <div className="h-3 w-3 rounded-full bg-[#E36137]" />
        ) : null}
      </div>
    </button>
  );
};

const MessagesTab = () => {
  const renderMessageSection = (section: MessageSection) => (
    <div key={section.id} className="mt-2 bg-white px-4 py-4 pr-6">
      <p className="font-bold text-black text-base">
        {section.title}
      </p>
      <div className="mt-2">
        {section.messages.map((messageItem, index) => (
          <div key={messageItem.id} className="flex flex-col items-center justify-center gap-2">
            <MessageRow item={messageItem} />
            {index < section.messages.length - 1 && (
              <div className="ml-14 h-px w-full bg-gray-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="bg-white px-4 py-2">
        <div className="flex h-10 items-center gap-4 rounded-md bg-gray-100 px-2">
          <Image unoptimized src={icons.searchIcon} alt="search" className="h-6 w-6 opacity-60" />
          <input
            placeholder="Tìm kiếm"
            className="h-full w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="flex-1 bg-[#F1EEE8]">
        {messagesData.map(renderMessageSection)}
      </div>
    </div>
  );
};

export default MessagesTab;
