'use client';

import { icons } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackHeader from "../../Common/BackHeader";

const securityOptions = [
  {
    id: 1,
    title: "Đổi mật khẩu",
    icon: icons.lockIcon,
    hasToggle: false,
    onPress: () => { },
  },
  {
    id: 2,
    title: "Đồng bộ Face /Touch ID",
    icon: icons.faceIcon,
    hasToggle: true,
    onPress: () => { },
  },
];

const SecurityOption = ({ option }: { option: typeof securityOptions[0] }) => {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(option.id === 2);

  return (
    <button
      onClick={option.hasToggle ? undefined : () => router.push('/auth/change-password')}
      className="flex min-h-[40px] flex-row items-center justify-between gap-2 py-2 w-full"
    >
      <div className="flex gap-2">
        <Image unoptimized
          src={option.icon}
          alt={option.title}
          width={24}
          height={24}
        />
        <span className="flex-1 font-bold text-black text-base">
          {option.title}
        </span>
      </div>
      {option.hasToggle ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEnabled(!isEnabled);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-[#E36137]' : 'bg-[#E5E5E5]'
            }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      ) : (
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="#2D2D2D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

type SecurityScreenProps = {
  showHeader?: boolean;
  onBack?: () => void;
  className?: string;
  contentClassName?: string;
};

const SecurityScreen = ({
  showHeader = true,
  onBack,
  className,
  contentClassName,
}: SecurityScreenProps) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col bg-backgroundV1 h-full",
        showHeader ? "min-h-screen" : "rounded-xl border border-[#E7E7E7] bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex-1 overflow-y-auto px-4 pb-[120px] pt-8",
          !showHeader && "overflow-visible px-0 pb-0 pt-0",
          contentClassName,
        )}
      >
        <div className="w-full">
          {securityOptions.map((option) => (
            <SecurityOption key={option.id} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityScreen;
