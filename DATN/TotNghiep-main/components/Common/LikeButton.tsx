'use client';

import { useState } from 'react';
import api from '@/services/axios';

interface HeartButtonProps {
  initialLikes?: number;
  islike: boolean;
  recipeId: number;
}

const HeartButton = ({
  initialLikes = 0,
  islike = false,
  recipeId,
}: HeartButtonProps) => {
  const [liked, setLiked] = useState(islike);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || !recipeId) return;

    try {
      setLoading(true);

      // 🔥 phân biệt like / dislike
      if (liked) {
        // dislike
        await api.delete(`/api/recipes/${recipeId}/like`);
        setLiked(false);
        setLikes(prev => Math.max(prev - 1, 0));
      } else {
        // like
        await api.post(`/api/recipes/${recipeId}/like`);
        setLiked(true);
        setLikes(prev => prev + 1);
      }
    } catch (error) {
      console.error('Like/Dislike recipe error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1 disabled:opacity-60"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={liked ? 'red' : 'none'}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 transition-transform duration-200 ${
          liked ? 'scale-110' : 'scale-100'
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>

      <span className="text-black text-sm font-medium">
        {likes}
      </span>
    </button>
  );
};

export default HeartButton;
