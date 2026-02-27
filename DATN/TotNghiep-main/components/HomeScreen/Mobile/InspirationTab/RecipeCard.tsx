import { icons } from '@/constants';
import Image from 'next/image';

interface RecipeCardProps {
    id: string;
    name: string;
    image: any;
    time: string;
    likes: number;
    showOverlay?: boolean;
}

const RecipeCard = ({
    id,
    name,
    image,
    time,
    likes,
    showOverlay = true
}: RecipeCardProps) => {
    return (
        <div className="w-[120px] bg-white rounded-lg flex flex-col items-start border border-[#E5E7EB]">
            <div className="w-full h-[110px] relative rounded-t-lg overflow-hidden">
                <Image unoptimized
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                />
                {showOverlay && (
                    <div className="absolute bottom-0 left-0 right-0 h-6 px-1 flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-0.5">
                            <Image unoptimized
                                src={icons.clockIcon}
                                alt="Time"
                                width={10}
                                height={10}
                                className="object-contain"
                            />
                            <span className="text-white text-xs">
                                {time}
                            </span>
                        </div>
                        <div className="flex flex-row items-center gap-0.5">
                            <Image unoptimized
                                src={icons.save2Icon}
                                alt="Likes"
                                width={10}
                                height={10}
                                className="object-contain"
                            />
                            <span className="text-white text-xs">
                                {likes}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full px-2 py-1.5 flex flex-row justify-center items-center gap-1">
                <span className="flex-1 font-semibold text-black text-xs line-clamp-2">
                    {name}
                </span>
                <Image unoptimized
                    src={icons.threeDotsIcon}
                    alt="More"
                    width={16}
                    height={16}
                />
            </div>
        </div>
    );
};

export default RecipeCard;
