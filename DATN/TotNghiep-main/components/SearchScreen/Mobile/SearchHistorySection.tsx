import RecipeCarousel from '@/components/Common/RecipeCarousel';
import { icons } from '@/constants';
import Image from 'next/image';

const SearchHistorySection = () => {
    return (
        <div className="flex flex-col px-4 pt-4">
            <span className="font-bold text-black text-base mb-2">
                Lịch sử tìm kiếm
            </span>
            <div className="flex flex-row justify-between items-center w-full mb-2">
                <span className="font-light text-textNeutralV1 text-sm">
                    Món bạn đã xem gần đây
                </span>
                <Image unoptimized
                    src={icons.forwardArrow}
                    alt="Forward arrow"
                    width={100}
                    height={100}
                    quality={100}
                    draggable={false}
                    className="object-contain h-5 w-auto"
                />
            </div>
            <RecipeCarousel />
        </div>
    );
};

export default SearchHistorySection;
