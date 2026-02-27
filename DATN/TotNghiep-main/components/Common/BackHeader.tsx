import { icons } from '@/constants';
import Image from 'next/image';
import React from 'react';

interface BackHeaderProps {
  headerTitle: string;
  onPress: () => void;
  isDark?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({ headerTitle, onPress, isDark = false }) => {
  return (
    <div
      className="relative flex w-full items-center justify-center h-10"
    >
      <button
        onClick={onPress}
        className="absolute left-0 w-6 h-6 flex items-center justify-center"
        aria-label="Quay lại"
      >
        <Image unoptimized
          src={icons.caretLeftIcon}
          alt="back"
          className={`w-6 h-6 ${isDark ? 'invert' : ''}`}
        />
      </button>
      <p
        className={`justify-start text-center font-bold ${isDark ? 'text-white' : 'text-black'} text-base`}
      >
        {headerTitle}
      </p>
    </div>
  );
};

export default BackHeader;
