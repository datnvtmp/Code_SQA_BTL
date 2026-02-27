import CustomButton from "@/components/Common/CustomButton";
import { icons, images } from "@/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackHeader from "@/components/Common/BackHeader";

const MobilePremiumScreen = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#2D2D2D]">
      <div className="px-4">
        <BackHeader
          headerTitle="Premium"
          onPress={() => router.back()}
          isDark={true}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-30 px-4 flex flex-col items-start gap-20 mt-10">
        {/* Title Section */}
        <div className="flex flex-col justify-start items-start w-full">
          <span className="font-bold text-white text-xl">
            Chuyển đổi sang gói Premium để trở thành{' '}
            <span className="font-bold text-customPrimary text-xl">
              Vua Đầu Bếp
            </span>
          </span>
          <span className="text-white text-sm">
            Hoàn thiện các công thức nấu ăn của bạn bằng công cụ phân tích gu ăn uống, hiển thị công thức hoàn chỉnh và video các bước thực hành món.
          </span>
        </div>

        {/* Avatar Section */}
        <div className="w-full flex-col justify-start items-center gap-8">
          <div className="flex flex-row justify-center items-end gap-6">
            {/* Regular User Avatar */}
            <Image unoptimized
              src={images.sampleAvatar}
              alt="Regular user"
              width={44}
              height={44}
              quality={100}
              draggable={false}
              className="object-cover w-11 h-11 rounded-full"
            />

            {/* Arrow Icon */}
            <div className="flex flex-row justify-start items-center h-11">
              <Image unoptimized
                src={icons.forwardArrow}
                alt="Arrow"
                width={100}
                height={100}
                quality={100}
                draggable={false}
                className="object-contain h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Premium User Avatar with Crown */}
            <div className="relative w-[53px] h-[65px]">
              <Image unoptimized
                src={images.sampleAvatar}
                alt="Premium user"
                width={44}
                height={44}
                quality={100}
                draggable={false}
                className="object-cover w-11 h-11 rounded-full border-2 border-[#E36137] absolute left-0 top-5"
              />
              {/* Chef Icon */}
              <Image unoptimized
                src={icons.chefIcon}
                alt="Chef"
                width={28}
                height={28}
                quality={100}
                draggable={false}
                className="object-contain w-7 h-7 absolute right-0 top-0"
              />
            </div>
          </div>

          {/* Premium Button */}
          <div className="w-full flex justify-center mt-8">
            <CustomButton
              title="Chuyển đổi thành Premium"
              className="max-w-[265px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePremiumScreen;
