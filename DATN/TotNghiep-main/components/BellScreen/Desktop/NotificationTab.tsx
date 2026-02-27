import Image, { StaticImageData } from 'next/image';
import { images } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome from '@api/ApiHome';

interface NotificationItemProps {
  id: string;
  avatarUrl: string | StaticImageData;
  userName: string;
  content: string;
  timestamp: string;
}

interface NotificationGroup {
  id: string;
  title: string;
  notifications: NotificationItemProps[];
}

const NotificationItem = ({ item }: { item: NotificationItemProps }) => {
  return (
    <button className="flex flex-row items-start justify-start pt-2 pb-2 w-full">
      <div className="w-10 h-10">
        <Image unoptimized
          src={item.avatarUrl}
          alt={item.userName}
          className="w-10 h-10 rounded-full border-2 border-[#E36137] object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col items-start justify-start ml-3">
        <p className="w-full mb-1 text-start text-sm">
          <span className="font-semibold text-black text-sm">{item.userName} </span>
          <span className="text-textNeutralV1 text-sm ml-1">{item.content}</span>
        </p>
        <span className="text-textNeutralV1 text-xs line-height-4">{item.timestamp}</span>
      </div>
    </button>
  );
};

const NotificationTab = () => {
  const { data: notificationsData = [], isLoading, error } = useQuery<NotificationGroup[]>({
    queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + 'RecipeDetail'],
    queryFn: () => ApiHome.getFormattedNotifications(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi khi tải thông báo</div>;

  return (
    <div className="flex-1 bg-[#F1EEE8]">
      {notificationsData.map((group) => (
        <div key={group.id} className="mt-2 bg-white">
          <div className="px-4 pt-2 pb-2 pr-6">
            <p className="font-bold text-black text-base">{group.title}</p>
            {group.notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem item={notification} />
                {index < group.notifications.length - 1 && (
                  <div className="ml-[68px] h-px bg-[#F3F4F6]" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationTab;
