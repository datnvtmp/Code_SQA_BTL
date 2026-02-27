import { icons } from "@/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import BackHeader from "@/components/Common/BackHeader";
import { Switch } from "@/components/ui/switch";

const securityOptions = [
  {
    id: 1,
    title: "Đổi mật khẩu",
    icon: icons.lockIcon,
    hasToggle: false,
    route: '/auth/change-password',
  },
  {
    id: 2,
    title: "Đồng bộ Face /Touch ID",
    icon: icons.faceIcon,
    hasToggle: true,
    route: '',
  },
];

const SecurityOption = ({ option }: { option: typeof securityOptions[0] }) => {
  const [isEnabled, setIsEnabled] = useState(option.id === 2);
  const router = useRouter();

  return (
    <button
      onClick={option.hasToggle ? undefined : () => router.push(option.route)}
      className="flex flex-row justify-between items-center min-h-10 gap-2 py-2 bg-transparent border-none p-0 cursor-pointer w-full"
    >
      <Image unoptimized
        src={option.icon}
        alt={option.title}
        width={100}
        height={100}
        quality={100}
        draggable={false}
        className="object-contain h-6 w-auto"
      />
      <span className="flex-1 font-bold text-black text-base text-left">
        {option.title}
      </span>
      {option.hasToggle ? (
        <Switch />
      ) : (
        <Image unoptimized
          src={icons.caretLeftIcon}
          alt="back"
          width={100}
          height={100}
          quality={100}
          draggable={false}
          className="h-6 w-auto object-contain scale-x-[-1]"
        />
      )}
    </button>
  );
};

const MobileSecurityScreen = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-backgroundV1">
      <div className="px-4">
        <BackHeader
          headerTitle="Bảo mật"
          onPress={() => router.back()}
        /></div>

      <div className="flex-1 overflow-y-auto pb-30 px-4 pt-8">
        <div className="w-full">
          {securityOptions.map((option) => (
            <SecurityOption key={option.id} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSecurityScreen;
