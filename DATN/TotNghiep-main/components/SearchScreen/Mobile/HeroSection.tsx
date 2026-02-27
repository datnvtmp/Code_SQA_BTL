import { icons, images } from '@/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HeroSection = () => {
    const router = useRouter();
    return (
        <div className="relative bg-[#E36137] h-64">
            {/* Hero section */}
            <Image unoptimized
                src={images.searchHero}
                alt="Search hero"
                width={100}
                height={100}
                quality={100}
                draggable={false}
                className="absolute right-0 bottom-0 object-contain w-[200px] h-[200px]"
            />

            <div className="absolute justify-center items-center w-[170px] h-[137px] left-[25px] bottom-[48px]">
                <Image unoptimized
                    src={images.messageBubble2}
                    alt="Message bubble"
                    width={100}
                    height={100}
                    quality={100}
                    draggable={false}
                    className="absolute left-0 bottom-0 right-0 top-0 w-full h-full object-contain"
                />
                <span className="absolute font-light text-customSecondary text-xs max-w-[110px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[110px]">
                    Nhập tên món ăn nếu bạn đã lựa chọn được món muốn nấu hoặc nhập tên nguyên liệu để xem gợi ý nhé!
                </span>
            </div>

            {/* Search Field */}
            <div className="relative flex flex-row justify-start items-center rounded-lg px-4 pt-4 h-10 gap-1">
                <div className="flex-1 flex flex-row justify-start items-center bg-white overflow-hidden rounded-lg h-10 px-2">
                    <Image unoptimized
                        src={icons.searchIcon}
                        alt="Search icon"
                        width={100}
                        height={100}
                        quality={100}
                        draggable={false}
                        className="object-contain h-6 w-auto mr-4"
                    />
                    <div className="flex flex-row justify-start items-center bg-red-500/20 rounded px-1 py-0.5 gap-0.5 mr-2">
                        <Image unoptimized
                            src={icons.fireIcon}
                            alt="Fire icon"
                            width={100}
                            height={100}
                            quality={100}
                            draggable={false}
                            className="object-contain h-4 w-auto"
                        />
                        <span className="font-medium text-red-500 text-sm">
                            Hot
                        </span>
                    </div>
                    <input
                        placeholder="Mì tôm thanh long"
                        className="flex-1 text-black font-medium py-0 text-sm"
                        onFocus={() => {
                            router.push('/search/search-bar');
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
