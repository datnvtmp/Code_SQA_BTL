import { icons, images } from '@/constants';
import { getScaleFactor } from '@/lib/scaling';
import { FormattedRecipeItem } from '@/types/type_index';
import { getLikedRecipes } from '@api/ApiHome';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';


interface FoodGridProps {
    featuredRecipesData?: FormattedRecipeItem[];
}

const MobileFoodGrid = ({ featuredRecipesData }: FoodGridProps) => {
    const { data: searchedDishesData, isLoading, error } = useQuery({
        queryKey: ['likedRecipes'],
        queryFn: () => getLikedRecipes(0, 10),
    });

    // Sử dụng type assertion
    const data: FormattedRecipeItem[] = (featuredRecipesData || searchedDishesData) as FormattedRecipeItem[];

    const columns: FormattedRecipeItem[][] = [[], [], [], [], [], []];
    data?.forEach((item, index) => {
        columns[index % 6].push(item);
    });

    // Generate random heights for masonry effect
    const getRandomHeight = (index: number) => {
        const heights = [200, 240, 280, 320, 180, 260, 300, 220];
        return getScaleFactor() * heights[index % heights.length];
    };

    return (
        <div
            className="masonry-grid pb-10"
            style={{
                columnCount: 2,
                columnGap: '8px',
                columnFill: 'balance'
            }}
        >
            {data?.map((item, index) => (
                <Link
                    key={item.id}
                    href="/food-detail"
                    className="w-full bg-white flex flex-col justify-start items-start shadow-lg hover:shadow-xl transition-shadow rounded-lg mb-2 break-inside-avoid"
                    style={{
                        
                        width: '100%'
                    }}
                >
                    <div
                        className="w-full relative overflow-hidden rounded-t-lg"
                        style={{
                            height: getRandomHeight(index) - 60 // Subtract space for text content
                        }}
                    >
                        <Image unoptimized
                            src={item.images[0]}
                            alt={item.title}
                            width={100}
                            height={100}
                            quality={100}
                            draggable={false}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full flex flex-row justify-center items-center pl-2 pr-1.5 py-2 rounded-b-lg gap-1">
                        <span className="flex-1 font-semibold text-black text-xs truncate">
                            {item.title}
                        </span>
                        <Image unoptimized
                            src={icons.threeDotsIcon}
                            alt="More options"
                            width={100}
                            height={100}
                            quality={100}
                            draggable={false}
                            className="object-contain w-auto h-4"
                        />
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MobileFoodGrid;