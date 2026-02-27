'use client';

import { icons } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { StepItem } from '@/types/type_index';
import DishListBySource from '@components/dish/DishItem';

interface CookingStepMasterTabProps {
  steps: StepItem[];
  videoUrl?: string;
  onBackPress?: () => void;
  u_id:number
}

const CookingStepMasterTab = ({
  steps,
  videoUrl,
  u_id
}: CookingStepMasterTabProps) => {
  return (
    <div className="overflow-y-auto pb-12 bg-gray-50">

      {/* ================= VIDEO VIP ================= */}
      {videoUrl && (
        <div className="px-4 pt-4 pb-6 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Image unoptimized
              src={icons.chefIcon}
              alt="chef"
              width={24}
              height={24}
            />
            <p className="font-semibold text-orange-400 text-lg">
              Video hướng dẫn từ đầu bếp
            </p>
          </div>

          <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow-lg">
            <Link
              href="/view-video"
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <Image unoptimized
                  src={icons.playIcon}
                  alt="play"
                  width={36}
                  height={36}
                />
              </div>
            </Link>

            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ================= STEPS ================= */}
      <div className="px-4 pt-6">
        <h2 className="text-xl font-bold mb-6">
          Các bước thực hiện
        </h2>

        <div className="relative space-y-8">
          {/* Vertical timeline */}
          <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-gray-200" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-5">
              {/* Step circle */}
              <div className="relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm
                    ${step.isCompleted
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-700'
                    }`}
                >
                  {step.isCompleted ? (
                    <Image unoptimized
                      src={icons.check2Icon}
                      alt="done"
                      width={16}
                      height={16}
                      className="invert"
                    />
                  ) : (
                    step.stepNumber
                  )}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border space-y-3">
                <div>
                  <p
                    className={`font-semibold text-lg
                      ${step.isCompleted ? 'text-orange-500' : 'text-gray-900'}
                    `}
                  >
                    {step.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Images */}
                {step.imageUrls && step.imageUrls.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {step.imageUrls.map((imgSrc, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="relative aspect-square rounded-xl overflow-hidden"
                      >
                        <Image unoptimized
                          src={imgSrc}
                          alt={`step-${index}-${imgIndex}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= DISH SUGGEST ================= */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">
            Món gợi ý từ đầu bếp
          </h3>
          <DishListBySource userId={u_id} />
        </div>
      </div>
    </div>
  );
};

export default CookingStepMasterTab;
