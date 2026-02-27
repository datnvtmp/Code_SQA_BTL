import { images } from '@/constants';
import { Topic } from '@/types/type_index';
import ApiHome from '@api/ApiHome';
import QUERY_KEY from '@api/QueryKey';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';


const SuggestedTopicsSection = () => {
  const { data: popularTopicsData = [], isLoading, error } = useQuery<Topic[]>({
    queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + 'GetCategories'],
    queryFn: () => ApiHome.getPopularTopicsData(),
    staleTime: 1000 * 60 * 5,
  });


  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi khi tải thông báo</div>;

  return (
    <div className="w-full flex flex-col items-start justify-center">
      <p className="mb-2 font-bold text-black text-base">
        Chủ đề được đề xuất với bạn
      </p>

      <div className="w-full gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {popularTopicsData.map((item) => (
          <div
            key={item.id}
            className="h-20 sm:h-24 md:h-28 lg:h-32 cursor-pointer rounded-lg overflow-hidden relative flex items-center justify-center"
          >
            <Image unoptimized
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg" />
            <p className="text-center font-bold text-white absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-xs sm:text-sm md:text-base">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedTopicsSection;
