'use client';

import React, { useState } from 'react';
import CustomButton from '@/components/Common/CustomButton';
import { icons, images } from '@/constants';
import Image from 'next/image';
import DishListBySource from '@components/dish/DishItem';
import UpgradeChefPopup from '@components/ui/UpgradeChefPopup';
import { useAuthStore } from '@/store/useAuthStore';

export interface StepItem {
  stepNumber: string | number;
  title: string;
  description: string;
  isCompleted?: boolean;
  showLine?: boolean;
  imageUrls?: string[];
}

interface CookingStepTabProps {
  steps: StepItem[];
  onMasterChefPress?: () => void;
  u_id:number
}

const CookingStepTab: React.FC<CookingStepTabProps> = ({ steps , u_id }) => {
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const {  role } = useAuthStore();
  return (
    <div className="px-4 md:px-16">
      <div className="flex flex-col pt-4 gap-4">
        {/* Master Chef Banner */}
        <div className="bg-white rounded-lg p-4 gap-2 relative">
          <div className="relative w-full h-[138px]">
            <Image unoptimized
              src={images.onboarding1}
              alt="onboarding"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-black text-sm text-center">
              Xem công thức món ăn cùng ảnh và video hướng dẫn chi tiết với tính năng của{' '}
              <span className="text-customPrimary text-sm font-semibold">
                Master Chef
              </span>
            </p>
            <CustomButton
              title="Đăng ký Master Chef"
              onClick={() => setShowUpgradePopup(true)}
              className="!w-fit !mx-auto"
            />

            {/* POPUP */}
            {showUpgradePopup && role == "USER" && (
              <UpgradeChefPopup
                onClose={() => setShowUpgradePopup(false)}
              />
            )}
          </div>
          <button className="absolute top-2 right-2 w-6 h-6 rounded-xl bg-white/90 flex items-center justify-center">
            <Image unoptimized
              src={icons.closeIcon}
              alt="close"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* Cooking Steps */}
        <div className="flex flex-col gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-row gap-4">
              <div className="flex flex-col items-center gap-1 pb-1">
                <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${step.isCompleted ? 'bg-[#E36137]' : 'bg-[#D9D9DB]'}`}>
                  {step.isCompleted ? (
                    <Image unoptimized
                      src={icons.check2Icon}
                      alt="check"
                      width={16}
                      height={16}
                      className="brightness-0 invert"
                    />
                  ) : (
                    <span className="text-white text-sm font-semibold">{step.stepNumber}</span>
                  )}
                </div>
                {step.showLine && index < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 ${step.isCompleted ? 'bg-[#E36137]' : 'bg-[#E5E7EB]'}`} />
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2 pb-4">
                <div className="flex flex-col gap-1">
                  <p className={step.isCompleted ? 'font-bold text-customPrimary text-base' : 'font-bold text-black text-base'}>
                    {step.title}
                  </p>
                  <p className={step.isCompleted ? 'text-black text-base' : 'text-[#666666] text-base'}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DishListBySource userId={u_id} />

      </div>
    </div>
  );
};

export default CookingStepTab;
