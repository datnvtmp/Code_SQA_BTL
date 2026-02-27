import { icons } from '@/constants';
import { useSuccessStore } from '@/store/successStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import BackHeader from '@/components/Common/BackHeader';
import Input from '@/components/Common/Input';
import TextArea from '@/components/Common/TextArea';
import CustomButton from '@/components/Common/CustomButton';

const ingredientsData = [
    { id: '1', name: 'Thành phần 1', amount: '250g bột' },
    { id: '2', name: 'Thành phần 2', amount: '250g bột' },
];

const cookingStepsData = [
    { id: '1', step: 'Bước 1', description: 'Miêu tả bước 1' },
    { id: '2', step: 'Bước 2', description: 'Miêu tả bước 2' },
];

const MobileCreateRecipeScreen = () => {
    const router = useRouter();
    const setSuccess = useSuccessStore((state) => state.setSuccess);
    const [description, setDescription] = useState('');

    const handlePublish = () => {
        setSuccess(
            'Tạo công thức thành công!',
            'Công thức của bạn đã được đăng tải và sẽ hiển thị cho mọi người.',
            '/'
        );
        router.replace('/success');
    };

    return (
        <div className="flex-1 bg-white min-h-screen relative w-full max-w-screen overflow-hidden pt-10">
            <div className='bg-white w-full px-4 fixed top-0 left-0 right-0 z-50'>
                <BackHeader
                    headerTitle="Công thức món ăn"
                    onPress={() => router.back()}
                />

            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col justify-center items-center gap-2 pt-2 pb-14 bg-[#F1EEE8] min-h-full">
                    {/* Main Form */}
                    <div className="w-full p-4 flex flex-col justify-center items-start gap-4">
                        {/* Image Upload */}
                        <div className="w-full h-48 relative bg-white rounded-lg overflow-hidden flex justify-center items-center">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center gap-2">
                                <Image unoptimized
                                    src={icons.cameraIcon}
                                    alt="Camera icon"
                                    width={100}
                                    height={100}
                                    quality={100}
                                    draggable={false}
                                    className="object-contain h-6 w-auto"
                                />
                                <span className="font-medium text-textNeutralV1 text-sm text-nowrap">
                                    Đăng hình đại diện món ăn
                                </span>
                            </div>
                        </div>

                        {/* Recipe Name */}
                        <div className="w-full flex flex-col justify-center items-start gap-1">
                            <span className="font-bold text-black text-base">
                                Tên món ăn
                            </span>
                            <Input
                                placeholder="Tên món ngon nhất nhà mình"
                                value=""
                                onChangeText={(text: string) => {
                                }}
                            />
                        </div>

                        {/* Recipe Description */}
                        <div className="w-full h-40 flex flex-col justify-center items-start gap-1">
                            <span className="font-bold text-black text-base">
                                Giới thiệu món ăn
                            </span>
                            <TextArea
                                placeholder="Hãy chia sẻ với mọi người về món này của bạn nhé. Ai hay điều gì đã truyền cảm hứng cho bạn nấu nó? Tại sao nó đặc biệt? Bạn thích thưởng thức nó theo cách nào?"
                                value={description}
                                onChangeText={setDescription}
                                className="w-full flex-1 p-2 pb-7 bg-white rounded-lg font-light text-textNeutralV1 text-base min-h-0 h-full resize-none !focus:ring-2 !focus:ring-custom-primary"
                                rows={6}
                            />
                        </div>

                        {/* Portion and Time */}
                        <div className="w-full flex flex-row justify-center items-start gap-4">
                            {/* Portion */}
                            <div className="flex-1 flex flex-col justify-center items-start gap-1">
                                <span className="font-bold text-black text-base">
                                    Khẩu phần
                                </span>
                                <div className="w-full h-10 px-2 bg-white rounded-lg border border-gray-200 flex flex-row justify-between items-center gap-2">
                                    <button
                                        onClick={() => router.back()}
                                        className="w-6 h-6 bg-gray-100 rounded flex justify-center items-center"
                                    >
                                        <span className="text-black text-lg">‹</span>
                                    </button>
                                    <span className="text-center text-textNeutralV1 text-base">
                                        2
                                    </span>
                                    <button className="w-6 h-6 bg-gray-100 rounded flex justify-center items-center">
                                        <span className="text-black text-lg">›</span>
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-4 relative" />

                            {/* Time */}
                            <div className="flex-1 flex flex-col justify-center items-start gap-1">
                                <span className="font-bold text-black text-base">
                                    Thời gian
                                </span>
                                <div className="w-full h-10 p-2 bg-white rounded-lg border border-gray-200 flex flex-row justify-start items-center gap-2">
                                    <span className="text-textNeutralV1 text-base">
                                        Giờ/Phút
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="w-full p-2 flex flex-col gap-2">
                        {/* Phần Nguyên liệu */}
                        <div className="w-full px-2 py-4 bg-white rounded-lg flex flex-col justify-center items-start gap-4">
                            <span className="font-bold text-black text-base">
                                Nguyên liệu
                            </span>

                            <div className="w-full flex flex-col justify-center items-start gap-2">
                                <div className="w-full flex flex-col justify-center items-start gap-1">
                                    <span className="font-medium text-black text-sm">
                                        Thành phần 1
                                    </span>
                                    <div className="w-full h-10 p-2 bg-[#F5F5F5] rounded-lg border border-[#E5E5E5] flex flex-row justify-start items-center gap-2">
                                        <span className="text-textNeutralV1 text-base">
                                            Thành phần 1
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    {ingredientsData.map((item) => (
                                        <div key={item.id} className="w-full flex flex-row justify-center items-center gap-2">
                                            <Image unoptimized
                                                src={icons.activeFunnelIcon}
                                                alt="Ingredient icon"
                                                width={100}
                                                height={100}
                                                quality={100}
                                                draggable={false}
                                                className="object-contain h-6 w-auto"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }}
                                            />
                                            <div className="flex-1 px-4 py-2 bg-gray-100 rounded-lg flex flex-row justify-center items-center gap-2">
                                                <span className="text-textNeutralV1 text-base">
                                                    {item.amount}
                                                </span>
                                            </div>
                                            <Image unoptimized
                                                src={icons.threeDotsIcon}
                                                alt="More options"
                                                width={100}
                                                height={100}
                                                quality={100}
                                                draggable={false}
                                                className="object-contain h-6 w-auto rotate-90"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full flex flex-row justify-center items-start gap-4">
                                <button className="w-1/2 flex flex-row justify-center items-center gap-2 p-1">
                                    <Image unoptimized
                                        src={icons.plusIcon}
                                        alt="Plus icon"
                                        width={100}
                                        height={100}
                                        quality={100}
                                        draggable={false}
                                        className="object-contain h-6 w-auto"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }}
                                    />
                                    <span className="font-bold text-black text-sm">
                                        Nguyên liệu
                                    </span>
                                </button>
                                <button className="w-1/2 flex flex-row justify-center items-center gap-2 p-1">
                                    <Image unoptimized
                                        src={icons.plusIcon}
                                        alt="Plus icon"
                                        width={100}
                                        height={100}
                                        quality={100}
                                        draggable={false}
                                        className="object-contain h-6 w-auto"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }}
                                    />
                                    <span className="font-bold text-black text-sm">
                                        Phần
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Phần cách làm */}
                        <div className="w-full p-4 bg-white rounded-lg flex flex-col justify-center items-start gap-4">
                            <span className="font-bold text-black text-base">
                                Cách làm
                            </span>

                            {/* Video Upload */}
                            <div className="w-full h-48 relative bg-[#EEEEEE] rounded-lg overflow-hidden flex justify-center items-center">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center gap-2">
                                    <Image unoptimized
                                        src={icons.videoIcon}
                                        alt="Video icon"
                                        width={100}
                                        height={100}
                                        quality={100}
                                        draggable={false}
                                        className="object-contain h-6 w-auto"
                                    />
                                    <span className="font-medium text-textNeutralV1 text-sm text-nowrap">
                                        Thêm video nấu món ăn
                                    </span>
                                </div>
                            </div>

                            {/* Cooking Steps */}
                            <div className="w-full flex flex-col justify-center items-start gap-2">
                                {cookingStepsData.map((item) => (
                                    <div key={item.id} className="w-full flex flex-col justify-center items-start gap-2">
                                        <div className="w-full flex flex-col justify-center items-start gap-1">
                                            <span className="font-medium text-black text-sm">
                                                {item.step}
                                            </span>
                                            <div className="w-full h-10 p-2 bg-gray-100 rounded-lg border border-gray-200 flex flex-row justify-start items-center gap-2">
                                                <span className="text-textNeutralV1 text-base">
                                                    {item.description}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center">
                                            <Image unoptimized
                                                src={icons.cameraIcon}
                                                alt="Camera icon"
                                                width={100}
                                                height={100}
                                                quality={100}
                                                draggable={false}
                                                className="object-contain h-6 w-auto"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Step Button */}
                            <div className="w-full flex flex-row justify-center items-start gap-4">
                                <button className="w-full flex flex-row justify-center items-center gap-2 p-1">
                                    <Image unoptimized
                                        src={icons.plusIcon}
                                        alt="Plus icon"
                                        width={100}
                                        height={100}
                                        quality={100}
                                        draggable={false}
                                        className="object-contain h-6 w-auto"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }}
                                    />
                                    <span className="font-bold text-black text-sm">
                                        Thêm bước
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 shadow-lg flex flex-col justify-center items-start">
                <div className="w-full px-4 py-2 bg-white rounded-t-lg flex flex-row justify-center items-start gap-2">
                    <div className="w-[48%]">
                        <CustomButton
                            title="Lưu nháp"
                            bgVariant="ghost"
                            textVariant="ghost"
                        />
                    </div>
                    <div className="w-[48%]">
                        <CustomButton
                            title="Đăng tải"
                            bgVariant="primary"
                            textVariant="primary"
                            onPress={handlePublish}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileCreateRecipeScreen;
