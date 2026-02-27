'use client';

import Image from 'next/image';
import { useState } from 'react';
import api from '@/services/axios';

interface SuggestedFriendItemProps {
  item: {
    id: string;
    name: string;
    commonFriends: string[];
    hashtag: string;
    avatarUrl: string;
    isFollowed?: boolean;
  };
}

const SuggestedFriendItem = ({ item }: SuggestedFriendItemProps) => {
  const [followed, setFollowed] = useState(!!item.isFollowed);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnfollow, setLoadingUnfollow] = useState(false);

  /* ======================
     FOLLOW
  ====================== */
  const handleFollow = async () => {
    if (loadingFollow || followed) return;

    try {
      setLoadingFollow(true);
      await api.post(`/api/user/follow/${item.id}`);
      setFollowed(true);
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setLoadingFollow(false);
    }
  };

  /* ======================
     UNFOLLOW
  ====================== */
  const handleUnfollow = async () => {
    if (loadingUnfollow || !followed) return;

    try {
      setLoadingUnfollow(true);
      await api.delete(`/api/user/unfollow/${item.id}`);
      setFollowed(false);
    } catch (err) {
      console.error('Unfollow error:', err);
    } finally {
      setLoadingUnfollow(false);
    }
  };

  return (
    <div
      className="
        w-full flex items-center gap-4
        rounded-2xl border border-gray-100
        bg-white p-4
        hover:shadow-md transition
      "
    >
      {/* AVATAR */}
      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
        <Image
          unoptimized
          src={item.avatarUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="font-semibold text-gray-900 text-sm">
          {item.name}
        </span>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="mt-2 space-y-1">
            {item.commonFriends.map((tag: string, idx: number) => (
              <div
                key={idx}
                className="text-sm text-orange-700 bg-orange-100 px-2 py-1 rounded-md w-fit"
              >
                {tag}
              </div>
            ))}
          </div>
          <span className="text-blue-500 font-medium">
            #{item.hashtag}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleFollow}
            disabled={loadingFollow || followed}
            className={`
              flex-1 h-8 rounded-lg text-xs font-semibold
              transition
              ${followed
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-[#E36137] text-white hover:opacity-90'
              }
              ${loadingFollow ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {followed
              ? '✓ Đã thêm'
              : loadingFollow
                ? 'Đang thêm...'
                : 'Thêm bạn bếp'}
          </button>

          {followed && (
            <button
              onClick={handleUnfollow}
              disabled={loadingUnfollow}
              className="
                h-8 px-3 rounded-lg
                bg-gray-100 text-gray-600
                text-xs font-semibold
                hover:bg-gray-200 transition
              "
            >
              {loadingUnfollow ? '...' : 'Gỡ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestedFriendItem;
