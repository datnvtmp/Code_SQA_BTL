'use client';

import CustomButton from "@/components/Common/CustomButton";
import { icons, images } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BackHeader from "../../Common/BackHeader";

type PremiumScreenProps = {
  showHeader?: boolean;
  onBack?: () => void;
  className?: string;
  contentClassName?: string;
};

const PremiumScreen = ({
  showHeader = true,
  onBack,
  className,
  contentClassName,
}: PremiumScreenProps) => {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <div
      className={cn(
        "flex flex-1 flex-col bg-[#2D2D2D] text-white h-full",
        showHeader ? "min-h-dvh" : "rounded-xl p-6 shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-1 flex-col items-start gap-[80px] px-4 pb-[120px] pt-8",
          !showHeader && "px-0 pb-0 pt-0",
          contentClassName,
        )}
      >
        {/* Title Section */}
        <div
          className="flex w-full flex-col items-start justify-start"
        >
          <p className="font-bold text-white text-xl">
            Chuyển đổi sang gói Premium để trở thành{" "}
            <span className="font-bold text-customPrimary text-xl">
              Vua Đầu Bếp
            </span>
          </p>
          <p className="text-white text-sm">
            Hoàn thiện các công thức nấu ăn của bạn bằng công cụ phân tích gu ăn uống, hiển thị công thức hoàn chỉnh và video các bước thực hành món.
          </p>
        </div>

        {/* Avatar Section */}
        <div
          className="flex w-full flex-col items-center justify-start gap-8"
        >
          <div
            className="flex flex-row items-end justify-center gap-4"
          >
            {/* Regular User Avatar */}
            <Image unoptimized
              src={images.sampleAvatar}
              alt="user"
              className="h-11 w-11 rounded-full"
            />

            {/* Arrow Icon */}
            <div
              className="flex h-11 flex-row items-center justify-start"
            >
              <Image unoptimized
                src={icons.forwardArrow}
                alt="arrow"
                className="h-6 w-6 invert"
              />
            </div>

            {/* Premium User Avatar with Crown */}
            <div
              className="relative h-[65px] w-[53px]"
            >
              <Image unoptimized
                src={images.sampleAvatar}
                alt="premium-user"
                className="absolute left-0 top-[21px] h-11 w-11 rounded-full border-2 border-[#E36137]"
              />
              {/* Chef Icon */}
              <Image unoptimized
                src={icons.chefIcon}
                alt="chef"
                className="absolute right-0 top-0 h-7 w-7"
              />
            </div>
          </div>

          {/* Premium Button */}
          <div className="flex w-full justify-center">
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

export default PremiumScreen;
