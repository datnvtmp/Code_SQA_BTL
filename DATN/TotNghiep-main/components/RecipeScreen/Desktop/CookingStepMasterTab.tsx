'use client';

import React from 'react';
import { icons } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import DishListBySource from '@components/dish/DishItem';
import { useSearchParams } from 'next/navigation';

export interface StepMasterItem {
  stepNumber: string | number;
  title: string;
  description: string;
  isCompleted?: boolean;
  imageUrls?: string[];
}

interface CookingStepMasterTabProps {
  steps: StepMasterItem[];
  videoUrl?: string;
  u_id: number
}

const CookingStepMasterTab: React.FC<CookingStepMasterTabProps> = ({
  steps,
  videoUrl,
  u_id
}) => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const recipeId = idParam ? parseInt(idParam, 10) : 1;
  console.log("stepsstepssteps", steps)
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* ================= VIDEO VIP ================= */}
      {videoUrl && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 md:px-16 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Image unoptimized src={icons.chefIcon} alt="chef" width={24} height={24} />
            <p className="text-orange-400 font-semibold text-lg">
              Video hướng dẫn từ đầu bếp
            </p>
          </div>

          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Link
              href={`/view-video?recepieId=${recipeId}`}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <Image unoptimized src={icons.playIcon} alt="play" width={36} height={36} />
              </div>
            </Link>

            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ================= COOKING STEPS ================= */}
      <div className="px-4 md:px-16 py-6">
        <h2 className="text-xl font-bold mb-6">
          Các bước thực hiện
        </h2>

        <div className="relative space-y-8">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gray-200" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-6">
              {/* STEP CIRCLE */}
              <div className="relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  ${step.isCompleted
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-700'
                    }`}
                >
                  {step.isCompleted ? (
                    <Image unoptimized
                      src={icons.check2Icon}
                      alt="done"
                      width={18}
                      height={18}
                      className="invert"
                    />
                  ) : (
                    step.stepNumber
                  )}
                </div>
              </div>

              {/* STEP CONTENT */}
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border space-y-3">
                <div>
                  <h3
                    className={`font-semibold text-lg
                    ${step.isCompleted ? 'text-orange-500' : 'text-gray-900'}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* STEP IMAGES */}
                {(step.imageUrls ?? []).length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {(step.imageUrls ?? []).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden"
                      >
                        <Image
                          unoptimized
                          src={img}
                          alt={`step-${index}-${idx}`}
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
