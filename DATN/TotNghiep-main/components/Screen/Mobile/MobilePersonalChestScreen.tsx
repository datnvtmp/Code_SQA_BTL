import { images } from '@/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomNavigator from '@/components/Common/BottomNavigator';
import Link from 'next/link';

const actionCardsData = [
    {
        id: '1',
        title: 'Tạo công thức',
        icon: images.menu,
        iconColor: 'red',
        iconSize: 44
    },
    {
        id: '2',
        title: 'Tạo bảng',
        icon: images.table,
        iconColor: 'blue',
        iconSize: 56
    },
];

const MobilePersonalChestScreen = () => {
    const router = useRouter();

    const renderActionCard = ({ item }: { item: typeof actionCardsData[0] }) => (
        <div className="flex flex-col justify-start items-center gap-2">
            <div className="w-[100px] h-[100px] bg-white rounded-lg shadow-xl relative overflow-hidden flex justify-center items-center">
                <Image unoptimized
                    src={item.icon}
                    alt={item.title}
                    width={100}
                    height={100}
                    quality={100}
                    draggable={false}
                    className="object-contain h-[60px] w-auto"
                />
            </div>
            <span className="font-bold text-black text-sm">
                {item.title}
            </span>
        </div>
    );

    return (
        <div className="w-full h-[100vh] relative bg-gray-100 overflow-hidden">
            {/* Background Images */}
            <Image unoptimized
                src={images.personalChestBg}
                alt="Personal chest background"
                width={384}
                height={883}
                quality={100}
                draggable={false}
                className="absolute left-0 top-0 object-cover w-full h-full"
            />
            <Image unoptimized
                src={images.personalChestBanner}
                alt="Personal chest banner"
                width={200}
                height={200}
                quality={100}
                draggable={false}
                className="absolute object-contain top-20 left-1/2 transform -translate-x-1/2"
            />
            {/* Main Content */}
            <div className="w-full px-4 flex flex-col justify-start items-center absolute top-80">
                <span className="font-medium text-center text-black text-xl mb-2">
                    Rương cá nhân
                </span>
                <span className="text-center px-2 text-textNeutralV1 font-light text-base mb-6">
                    Bắt đầu lưu giữ tất cả công thức của bạn với tính năng đăng công thức cá nhân và tạo bảng để lưu trữ các công thức bạn yêu thích
                </span>

                {/* Action Cards */}
                <div className="flex justify-center items-center gap-4">
                    {actionCardsData.map((item) => (
                        <Link
                            key={item.id}
                            href={item.id === '1' ? '/create/recipe' : ''}
                            className="bg-transparent border-none p-0 cursor-pointer"
                        >
                            {renderActionCard({ item })}
                        </Link>
                    ))}
                </div>
            </div>
            <BottomNavigator />
        </div>
    );
};

export default MobilePersonalChestScreen;
