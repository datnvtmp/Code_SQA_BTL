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
        <div className="w-full flex flex-col justify-center items-start mb-12 px-4">
            <span className="font-bold text-black text-base mb-2">
                Chủ đề được đề xuất với bạn
            </span>

            <div
                className="w-full gap-4 grid grid-cols-2"
            >
                {popularTopicsData.map((item) => (
                    <div
                        key={item.id}
                        className="h-20 cursor-pointer rounded-lg overflow-hidden relative flex items-center justify-center"
                    >
                        <Image unoptimized
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                        {/* Layer background */}
                        <div
                            className="absolute inset-0 bg-black/40 rounded-lg"
                        />
                        <p
                            className="text-center text-nowrap font-semibold text-white absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-base"
                        >
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedTopicsSection;
