import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface CustomTabTriggerProps {
  isActive: boolean;
  onPress: () => void;
  icon: StaticImageData | string;
  activeIcon: StaticImageData | string;
  iconSize: number;
}

export default function CustomTabTrigger({
  isActive,
  onPress,
  icon,
  activeIcon,
  iconSize
}: CustomTabTriggerProps) {
  return (
    <button
      onClick={onPress}
      className="flex-1 h-10 shrink-0 bg-transparent flex items-center justify-center m-0 p-0"
      aria-pressed={isActive}
    >
      <span className="inline-flex items-center justify-center">
        <Image unoptimized
          src={isActive ? activeIcon : icon}
          alt="tab"
          width={100}
          height={100}
          quality={100}
          draggable={false}
          className="object-contain h-6 w-auto"
        />
      </span>
    </button>
  );
}
