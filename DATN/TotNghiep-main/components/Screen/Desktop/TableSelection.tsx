'use client';

import { icons } from '@/constants';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackHeader from '../../Common/BackHeader';
import { FormattedRecipeItem } from '@/types/type_index';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  description: string;
  public: boolean;
  recipes: FormattedRecipeItem[];
}

const TableSelection = () => {
  const router = useRouter();
  const params = useSearchParams();
  const collectionId = params?.get('collectionId');

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthStore.getState().token;

  useEffect(() => {
    if (!collectionId) return;

    const fetchCollection = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/collections/${collectionId}/recipes-and-info`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Không lấy được dữ liệu collection');

        const response = await res.json();

        const recipes: FormattedRecipeItem[] = (response.data?.pageRecipeSummaryDTO?.content || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          views: item.views,
          time: `${item.prepTime + item.cookTime} phút`,
          images: item.imageUrl ? [item.imageUrl] : [],
          likes: item.likeCount,
          comments: item.commentCount,
          saves: item.saveCount,
        }));

        setCollection({
          id: collectionId,
          name: response.data?.collectionDTO?.name || 'Bảng món ăn',
          description: response.data?.collectionDTO?.description || '',
          public: response.data?.public ?? true,
          recipes,
        });
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId, token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!collection) return null;

  return (
    <div className="flex-1 bg-backgroundV1 min-h-screen px-4 md:px-16">
      <BackHeader headerTitle="Bảng món ăn" onPress={() => router.back()} />

      {/* Collection Info */}
      <div className="flex w-full flex-col items-center justify-between mt-8 mb-8">
        <p className="font-bold text-black text-center text-3xl">{collection.name}</p>
        <p className="font-light text-black text-center text-base">{collection.description}</p>
      </div>

      {/* Search & Filter */}
      <div className="flex w-full flex-row items-center gap-2 mb-4">
        <div className="flex flex-1 flex-row items-center rounded-lg bg-white h-10 px-3 gap-2">
          <Image unoptimized src={icons.searchIcon} alt="search" width={24} height={24} />
          <input
            placeholder="Tìm kiếm"
            className="flex-1 bg-transparent outline-none text-sm font-medium text-textNeutralV1"
          />
        </div>
        <button className="flex items-center justify-center">
          <Image unoptimized src={icons.downUpIcon} alt="sort" width={32} height={32} />
        </button>
        <button className="flex items-center justify-center">
          <Image unoptimized src={icons.smallPlusIcon} alt="add" width={32} height={32} />
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {collection.recipes.map((item) => (
          <Link
            key={item.id}
            href={`/food-detail?id=${item.id}`}
            className="group w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="relative w-full h-48 md:h-56">
              <Image unoptimized
                src={item.images?.[0] || '/fallback-image.png'}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-2 flex justify-between items-start gap-2">
              <p className="flex-1 font-semibold text-sm text-black line-clamp-2 group-hover:text-orange-500">
                {item.title}
              </p>
              <Image unoptimized
                src={icons.threeDotsIcon}
                alt="more"
                className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
