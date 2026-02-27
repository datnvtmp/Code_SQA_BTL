'use client';

import React from 'react';
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

const tabs = ['Bảng', 'Yêu thích', 'Công thức', 'Đang bán'];

const ProfileScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const profileId = searchParams.get('id');
  const profileIdNum = profileId ? Number(profileId) : null;
  const isMyProfile = !profileId;

  const [activeTab, setActiveTab] = React.useState('Bảng');

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
  const { data: myRecipes } = useQuery({
    queryKey: ['userRecipes', profileIdNum],
    queryFn: () =>
      profileIdNum
        ? ApiHome.getUserRecipe(profileIdNum)
        : ApiHome.getMyRecipe(),
    staleTime: 1000 * 60 * 5,
  });

  /* ================= SELLING ================= */
  const token = useAuthStore(state => state.token);
  const userId = userData?.id;

  const { data: sellingDishs } = useQuery({
    queryKey: ['sellingDishs', userId],
    enabled: !!userId && !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/dishs/user/${userId}`,
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
          <div className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
          ">
            {myRecipes?.map((item: RecipeItem) => (
              <Link key={item.id} href={`/food-detail?id=${item.id}`}>
                <RecipeListItem item={item} />
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'Đang bán' && (
          <div
            className="
      grid gap-4
      grid-cols-2
      sm:grid-cols-3
      md:grid-cols-4
      xl:grid-cols-6
    "
          >
            {sellingDishs?.map((dish: any) => (
              <div
                key={dish.id}
                className="
          rounded-xl bg-white overflow-hidden
          shadow-sm hover:shadow transition
        "
              >
                {/* IMAGE */}
                <div className="relative aspect-square">
                  <Image
                    unoptimized
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-2 space-y-1">
                  <p className="text-sm font-semibold line-clamp-1">
                    {dish.name}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primaryV1">
                      {dish.price?.toLocaleString()} đ
                    </span>

                    <span
                      className={`
                text-[10px] px-2 py-0.5 rounded-full
                ${dish.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                        }
              `}
                    >
                      {dish.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileScreen;
