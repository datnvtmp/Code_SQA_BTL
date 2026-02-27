'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import BackHeader from '../../Common/BackHeader';
import CookingStepMasterTab from '../../RecipeScreen/Desktop/CookingStepMasterTab';
import CookingStepTab, { StepItem } from '../../RecipeScreen/Desktop/CookingStepTab';
import MaterialTab from '../../RecipeScreen/Desktop/MaterialTab';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome from '@api/ApiHome';
import { IngredientItem } from '@/types/type_index';
import { videos } from '@constants/index';
import { useAuthStore } from '@/store/useAuthStore';

const RecipeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'materials' | 'cooking'>('materials');
  const { role } = useAuthStore();
  const showMasterChef = role;
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const recipeId = idParam ? parseInt(idParam, 10) : 1;
  const { data: recipeData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + 'RecipeDetail' + recipeId],
    queryFn: () => ApiHome.getIngredientsData(recipeId),
    staleTime: 1000 * 60 * 5,
  });

  const ingredients: IngredientItem[] = recipeData?.data.ingredients ?? [];

  const steps: StepItem[] = recipeData?.data.steps?.map((s, i) => ({
    stepNumber: s.stepNumber,
    title: `Bước ${s.stepNumber}`,
    description: s.description,
    isCompleted: false,
    showLine: i < (recipeData?.data.steps.length ?? 0) - 1,
    imageUrls: s.imageUrls ?? [],
  })) ?? [];
  const videoUrl = recipeData?.data.videoUrl ?? videos.videoTutorial;
  const u_id = recipeData?.data.user.id;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="w-full pl-4">
        <BackHeader headerTitle="Công thức món ăn" onPress={() => router.back()} />
      </div>

      <div className="flex flex-row gap-2 px-16 bg-transparent">
        <div className={`flex-1 ${activeTab === 'materials' ? 'bg-white border-b-customPrimary border-b-2' : 'bg-transparent'}`}>
          <button className="flex w-full items-center justify-center" onClick={() => setActiveTab('materials')}>
            <p className={`font-semibold text-base ${activeTab === 'materials' ? 'text-customPrimary' : 'text-textNeutralV1'}`}>
              Nguyên liệu
            </p>
          </button>
        </div>
        <div className={`flex-1 py-1 ${activeTab === 'cooking' ? 'bg-white border-b-customPrimary border-b-2' : 'bg-transparent'}`}>
          <button className="flex w-full items-center justify-center" onClick={() => setActiveTab('cooking')}>
            <p className={`font-semibold text-base ${activeTab === 'cooking' ? 'text-customPrimary' : 'text-textNeutralV1'}`}>
              Cách làm
            </p>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-backgroundV1">
        {activeTab === 'materials' ? (
          <MaterialTab data={ingredients} />
        ) : showMasterChef ? (
          <CookingStepMasterTab steps={steps} videoUrl={videoUrl} u_id = {u_id} />
        ) : (
          <CookingStepTab steps={steps} u_id = {u_id} />
        )}
      </div>
    </div>
  );
};

export default RecipeScreen;
