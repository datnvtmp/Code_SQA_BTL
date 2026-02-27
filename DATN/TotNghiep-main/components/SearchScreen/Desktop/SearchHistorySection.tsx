import { icons } from '@/constants';
import Image from 'next/image';
import RecipeCarousel from '../../Common/RecipeCarousel';
import HistoryRecipe from '@components/Common/HistoryRecipe';

const SearchHistorySection = () => {
    return (
        <div
            className='flex flex-col'
        >
            <p
                className="font-bold text-black mb-2 text-base"
            >
                Lịch sử tìm kiếm
            </p>
            <div
                className='flex w-full flex-row items-center justify-between mb-2'
            >
                <p
                    className="font-light text-textNeutralV1 text-sm"
                >
                    Món bạn đã xem gần đây
                </p>
                <Image unoptimized
                    src={icons.forwardArrow}
                    alt="forward"
                    width={24}
                    height={24}
                    className='cursor-pointer'
                />
            </div>
            <HistoryRecipe />
        </div>
    );
};

export default SearchHistorySection;
