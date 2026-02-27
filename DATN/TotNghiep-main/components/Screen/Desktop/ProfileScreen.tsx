'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import CustomButton from '@/components/Common/CustomButton';
import RecipeCard from '@/components/ProfileScreen/RecipeCard';
import RecipeListItem from '@/components/ProfileScreen/RecipeListItem';
import FoodGrid from '@/components/Common/Desktop/FoodGrid';

import { icons, images } from '@/constants';
import ApiHome, { getCurrentUser, getUserById } from '@api/ApiHome';
import { RecipeItem } from '@/types/type_index';
import { useAuthStore } from '@/store/useAuthStore';
import UpgradeChefPopup from '@components/ui/UpgradeChefPopup';

const tabs = ['Bảng', 'Yêu thích', 'Công thức', 'Đang bán'];

const ProfileScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingDishId, setLoadingDishId] = React.useState<number | null>(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(true); // mặc định bật luôn

  const profileId = searchParams.get('id');
  const profileIdNum = profileId ? Number(profileId) : null;
  const { role } = useAuthStore();
  const isChef = role === 'CHEF';


  const [activeTab, setActiveTab] = React.useState('Bảng');
  const LIMIT = 6;

  const [page, setPage] = useState(0);
  const [page2, setPage2] = useState(0);
  /* ================= USER INFO ================= */
  const { data: userData } = useQuery({
    queryKey: ['userProfile', profileIdNum],
    queryFn: () =>
      profileIdNum ? getUserById(profileIdNum) : getCurrentUser(),
  });

  /* ================= COLLECTION ================= */
  const { data: myCollection, isLoading } = useQuery({
    queryKey: ['collection', profileIdNum],
    queryFn: () =>
      profileIdNum
        ? ApiHome.getUserCollection(profileIdNum)
        : ApiHome.getMyCollection(),
    staleTime: 1000 * 60 * 5,
  });

  /* ================= RECIPES ================= */
  const { data: myRecipes, isFetching } = useQuery({
    queryKey: ['userRecipes', profileIdNum, page],
    queryFn: () =>
      profileIdNum
        ? ApiHome.getUserRecipe(profileIdNum, page, LIMIT)
        : ApiHome.getMyRecipe(page, LIMIT),
    staleTime: 1000 * 60 * 5,
    enabled: isChef,
  });


  /* ================= SELLING ================= */
  const token = useAuthStore(state => state.token);
  const userId = userData?.id;

  const { data: sellingDishs } = useQuery({
    queryKey: ['sellingDishs', userId , page2],
    enabled: !!userId && !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/dishs/user/${userId}?page=${page2}&size=${LIMIT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      return json?.data?.content ?? [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });


  const handleAddToCart = async (dishId: number) => {
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoadingDishId(dishId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/cart/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dishId, quantity: 1 }),
        }
      );

      if (!res.ok) throw new Error('Add cart failed');

      alert('✅ Đã thêm vào giỏ hàng');
    } catch (err) {
      alert('❌ Không thể thêm vào giỏ');
    } finally {
      setLoadingDishId(null);
    }
  };

  const handleEditDish = (dishId: number) => {
    router.push(`/edit-dish?id=${dishId}`);
  };


  const isMyProfile = !profileIdNum;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-textNeutralV1">
        Đang tải dữ liệu...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-backgroundV1">
      <div
        className="
          mx-auto max-w-screen-2xl
          px-4 sm:px-6 md:px-10 xl:px-20
          py-6
        "
      >
        {/* ================= PROFILE HEADER ================= */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="
            relative w-24 h-24 md:w-28 md:h-28
            rounded-full overflow-hidden
            ring-4 ring-white shadow
          ">
            <Image
              unoptimized
              src={userData?.avatarUrl || images.sampleAvatar}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>

          <p className="font-bold text-xl md:text-2xl">
            {userData?.username}
          </p>

          <div className="flex gap-2 text-xs md:text-sm text-textNeutralV1">
            <span>Bạn bếp</span>
            <span>•</span>
            <span>Công thức</span>
          </div>

          {isMyProfile && (
            <div className="flex flex-wrap justify-center gap-3">
              <CustomButton
                title="Chỉnh sửa cài đặt"
                onPress={() => router.push('/setting')}
                className="h-10 px-6 !w-fit"
              />
              <CustomButton
                title="Xem thống kê"
                onPress={() => router.push('/dashboard')}
                className="h-10 px-6 !w-fit"
              />
            </div>
          )}
        </div>

        {/* ================= TABS ================= */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-center border-b">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-3 text-sm md:text-base font-semibold
                  transition
                  ${activeTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'text-textNeutralV1 hover:text-black'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ================= SEARCH BAR ================= */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center bg-white rounded-xl px-3 h-10 gap-3 shadow-sm">
              <Image
                unoptimized
                src={icons.searchIcon}
                alt="search"
                width={18}
                height={18}
              />
              <input
                placeholder="Tìm kiếm"
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            <button className="p-2 bg-white rounded-xl shadow-sm">
              <Image
                unoptimized
                src={icons.downUpIcon}
                alt="sort"
                width={20}
                height={20}
              />
            </button>

            <button className="p-2 bg-white rounded-xl shadow-sm">
              <Image
                unoptimized
                src={icons.smallPlusIcon}
                alt="add"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        {activeTab === 'Bảng' && (
          <div className="
            grid gap-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-6
          ">
            {myCollection?.map(item => (
              <RecipeCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {activeTab === 'Yêu thích' && <FoodGrid />}

        {activeTab === 'Công thức' && (
          <>
            {role === 'USER' && showUpgradePopup && (
              <UpgradeChefPopup onClose={() => setShowUpgradePopup(false)} />
            )}

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {myRecipes?.map((item: RecipeItem) => (
                <Link key={item.id} href={`/food-detail?id=${item.id}`}>
                  <RecipeListItem item={item} />
                </Link>
              ))}
            </div>
            {myRecipes && myRecipes.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  className={`min-w-[120px] h-10 rounded-full border text-sm font-medium
        transition-all
        ${page === 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
                    }`}
                >
                  ← Trang trước
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Trang <span className="font-semibold">{page + 1}</span>
                </span>

                <button
                  disabled={isFetching || myRecipes.length < LIMIT}
                  onClick={() => setPage((p) => p + 1)}
                  className={`min-w-[120px] h-10 rounded-full border text-sm font-medium
        transition-all
        ${isFetching || myRecipes.length < LIMIT
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
                    }`}
                >
                  Trang sau →
                </button>
              </div>
            )}

          </>
        )}





        {/* ================= CONTENT ================= */}
        {activeTab === 'Đang bán' && (
          <>
            {/* GRID */}
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {sellingDishs?.map((dish: any) => (
                <div
                  key={dish.id}
                  className="
            group relative bg-white rounded-2xl overflow-hidden
            shadow-sm hover:shadow-xl transition-all duration-300
          "
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      unoptimized
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="
                object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
                    />

                    {/* PRICE */}
                    <div
                      className="
                absolute top-2 right-2
                bg-black/70 text-white
                text-xs font-semibold
                px-2.5 py-1 rounded-full
              "
                    >
                      {dish.price?.toLocaleString()} đ
                    </div>

                    {/* OVERLAY ACTION */}
                    {!isMyProfile && (
                      <div
                        className="
                  absolute inset-0 bg-black/40
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition
                "
                      >
                        <button
                          disabled={loadingDishId === dish.id}
                          onClick={() => handleAddToCart(dish.id)}
                          className={`
                    px-4 py-2 text-xs font-semibold rounded-full
                    backdrop-blur transition
                    ${loadingDishId === dish.id
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-primaryV1 text-white hover:scale-105'
                            }
                  `}
                        >
                          {loadingDishId === dish.id ? 'Đang thêm...' : 'Thêm vào giỏ'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-semibold line-clamp-2">
                      {dish.name}
                    </p>

                    {isMyProfile && (
                      <button
                        onClick={() => handleEditDish(dish.id)}
                        className="
                  mt-2 w-full
                  text-xs font-semibold
                  border border-gray-200
                  rounded-full py-1.5
                  hover:bg-gray-100 transition
                "
                      >
                        Sửa món
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {sellingDishs?.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-6">
                <button
                  disabled={page2 === 0}
                  onClick={() => setPage2((p) => Math.max(p - 1, 0))}
                  className={`
            min-w-[120px] h-10 rounded-full border
            text-sm font-semibold transition-all
            ${page2 === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
                    }
          `}
                >
                  ← Trang trước
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Trang <span className="font-semibold">{page2 + 1}</span>
                </span>

                <button
                  disabled={isFetching || sellingDishs.length < LIMIT}
                  onClick={() => setPage2((p) => p + 1)}
                  className={`
            min-w-[120px] h-10 rounded-full border
            text-sm font-semibold transition-all
            ${isFetching || sellingDishs.length < LIMIT
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
                    }
          `}
                >
                  Trang sau →
                </button>
              </div>
            )}
          </>
        )}






      </div>
    </div>
  );
};

export default ProfileScreen;
