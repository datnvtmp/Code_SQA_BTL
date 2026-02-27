import { icons } from '@/constants';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';

interface RecipeCardProps {
    id: string;
    name: string;
    image: StaticImageData | string;
    time: string;
    likes: number;
    showOverlay?: boolean;
    width?: number;
    height?: number;
    blurDataURL?: string;
    onClick?: () => void;
}

const RecipeCard = ({
    id: _id,
    name,
    image,
    time,
    likes,
    showOverlay = true,
    onClick

}: RecipeCardProps) => {
    const router = useRouter();
    return (
        <div
            onClick={onClick}
            className="flex flex-col cursor-pointer items-start bg-white w-[120px] rounded-lg border border-[#E5E7EB]"
        >
            {/* IMAGE BLOCK */}
            <div className="relative w-full h-[110px] rounded-t-lg overflow-hidden bg-black">
                <Image unoptimized
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    quality={100}
                    draggable={false}
                />

                {showOverlay && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1 py-0.5 bg-black/40">
                        <div className="flex items-center gap-1">
                            <Image unoptimized
                                src={icons.clockIcon}
                                alt="time"
                                width={12}
                                height={12}
                                className="object-contain"
                            />
                            <span className="text-white text-[10px] leading-none">
                                {time}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Image unoptimized
                                src={icons.save2Icon}
                                alt="likes"
                                width={12}
                                height={12}
                                className="object-contain"
                            />
                            <span className="text-white text-[10px] leading-none">
                                {likes}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTENT BLOCK */}
            <div className="w-full px-2 py-2 flex items-center gap-1">
                <p className="flex-1 font-semibold text-black text-xs line-clamp-2 leading-tight">
                    {name}
                </p>

                <Image unoptimized
                    src={icons.threeDotsIcon}
                    alt="more"
                    width={14}
                    height={14}
                    className="object-contain opacity-70"
                />
            </div>
        </div>

    );
};

export default RecipeCard;
