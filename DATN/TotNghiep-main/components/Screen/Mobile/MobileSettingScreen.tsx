import BackHeader from "@/components/Common/BackHeader";
import { icons } from "@/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomButton from "@/components/Common/CustomButton";

const settingsSections = [
  {
    id: 1,
    mainTitle: "Tài khoản",
    items: [
      { id: 1, title: "Chỉnh sửa hồ sơ", icon: "arrow" },
      { id: 2, title: "Quản lý tài khoản", icon: "arrow" },
      { id: 3, title: "Chế độ hiển thị", icon: "arrow" },
      { id: 4, title: "Quyền và hoạt động Bạn Bếp", icon: "arrow" },
    ]
  },
  {
    id: 2,
    mainTitle: "Đăng nhập",
    items: [
      { id: 5, title: "Premium", icon: "arrow" },
      { id: 6, title: "Bảo mật", icon: "arrow" },
    ],
    showLogout: true
  },
  {
    id: 3,
    mainTitle: "Hỗ trợ",
    items: [
      { id: 7, title: "Trợ giúp", icon: "external" },
      { id: 8, title: "Xem điều khoản dịch vụ", icon: "external" },
      { id: 9, title: "Xem chính sách quyền riêng tư", icon: "external" },
    ]
  }
];

const SettingItem = ({ item, section, onPress }: { item: any, section: any, onPress?: () => void }) => (
  <button
    onClick={onPress}
    className="flex flex-row justify-start items-center min-h-10 gap-2 py-2 bg-transparent border-none p-0 cursor-pointer w-full"
  >
    <span className="flex-1 font-bold text-black text-base text-left">
      {item.title}
    </span>
    {section.mainTitle === "Hỗ trợ" ? (
      <Image unoptimized
        src={icons.upRightIcon}
        alt="External"
        width={100}
        height={100}
        quality={100}
        draggable={false}
        className="object-contain h-6 w-auto"
      />
    ) : (
      <span className="text-[#2D2D2D] text-xl">›</span>
    )}
  </button>
);

const SettingsSection = ({ section, onItemPress, router }: { section: typeof settingsSections[0], onItemPress: (item: any) => void, router: any }) => (
  <div className="w-full flex-col justify-start items-start gap-2">
    <span className="font-light text-textNeutralV1 text-sm">
      {section.mainTitle}
    </span>
    <div className="w-full">
      {section.items.map((item) => (
        <SettingItem key={item.id} item={item} section={section} onPress={() => onItemPress(item)} />
      ))}
    </div>
    {section.showLogout && (
      <div className="w-full px-0">
        <CustomButton
          title="Đăng xuất"
          bgVariant="ghost"
          textVariant="ghost"
          IconRight={
            <Image unoptimized
              src={icons.signOutIcon}
              alt="Sign out"
              width={100}
              height={100}
              quality={100}
              draggable={false}
              className="object-contain h-6 w-auto"
            />
          }
          onPress={() => router.replace('/auth/sign-in')}
        />
      </div>
    )}
  </div>
);

const MobileSettingScreen = () => {
  const router = useRouter();

  const handleItemPress = (item: any) => {
    switch (item.title) {
      case "Chỉnh sửa hồ sơ":
        router.push("/profile/edit");
        break;
      case "Premium":
        router.push("/profile/premium");
        break;
      case "Bảo mật":
        router.push("/profile/security");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-backgroundV1">
      <div className="px-4">
        <BackHeader
          headerTitle="Cài đặt"
          onPress={() => router.back()}
        />
      </div>
      <div className="flex-1 overflow-y-auto pb-30 px-4 pt-8">
        <div className="flex flex-col justify-start items-start w-full gap-8">
          {settingsSections.map((section) => (
            <SettingsSection key={section.id} section={section} onItemPress={handleItemPress} router={router} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSettingScreen;
