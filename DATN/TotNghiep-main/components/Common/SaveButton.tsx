'use client';
import { useState } from 'react';

interface SaveButtonProps {
  initialSaves?: number;
}

const SaveButton = ({ initialSaves = 0 }: SaveButtonProps) => {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    setSaved(!saved);
  };

  return (
    <button
      type="button"
      className="bg-transparent border-none p-0 flex items-center gap-1 cursor-pointer"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={saved ? '#FFC107' : 'none'} // màu vàng khi save
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    </button>
  );
};

export default SaveButton;
