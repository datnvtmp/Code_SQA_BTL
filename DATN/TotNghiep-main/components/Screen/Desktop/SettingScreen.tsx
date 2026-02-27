'use client';

import EditProfileScreen from "@/components/Screen/Desktop/EditProfileScreen";
import PremiumScreen from "@/components/Screen/Desktop/PremiumScreen";
import SecurityScreen from "@/components/Screen/Desktop/SecurityScreen";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Recipe } from "@/types/type_index";
import axios from "axios";
import type { Icon } from "iconsax-reactjs";
import {
  ArrowRight2,
  Crown,
  DocumentText,
  LogoutCurve,
  MessageQuestion,
  Moon,
  ProfileCircle,
  ReceiptSquare,
  Setting2,
  ShieldSecurity,
  ShieldTick,
  UserTag,
} from "iconsax-reactjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type SidebarContentKey = "edit-profile" | "premium" | "security" | "account-recipes";

type SettingAction = "logout";

type SettingItemData = {
  id: string;
  title: string;
  icon: Icon;
  contentKey?: SidebarContentKey;
  description?: string;
  href?: string;
  external?: boolean;
  action?: SettingAction;
};

type SettingsSectionData = {
  id: number;
  mainTitle: string;
  items: SettingItemData[];
};

interface RecipePage {
  content: Recipe[];
  totalPages: number;
  number: number;
}
const recipesData = async (page = 0, size = 6): Promise<RecipePage> => {
  const token = useAuthStore.getState().token;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/my`,
    {
      params: { page, size },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data;
};

/* ================= COMPONENT ================= */
const RecipesGrid = () => {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const LIMIT = 6;

  /* 🔥 FETCH THEO PAGE */
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await recipesData(page, LIMIT);
        setRecipes(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Fetch recipes error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page]);

  if (loading) {
    return <p className="text-center">Đang tải công thức...</p>;
  }

  return (
    <div className="w-full">
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:mx-16 lg:my-4">
        {recipes.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            Không có công thức nào
          </p>
        ) : (
          recipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => router.push(`/recipes/edit/${recipe.id}`)}
              className="
                bg-white rounded-xl shadow-md overflow-hidden
                hover:shadow-xl transition cursor-pointer
              "
            >
              <div className="relative w-full h-48">
                <Image
                  unoptimized
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-black">
                  {recipe.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-4">
                  {recipe.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6 pb-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className={`
              min-w-[120px] h-10 rounded-full border
              text-sm font-semibold transition
              ${
                page === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 active:scale-95'
              }
            `}
          >
            ← Trang trước
          </button>

          <span className="text-sm font-medium text-gray-600">
            Trang <b>{page + 1}</b> / {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className={`
              min-w-[120px] h-10 rounded-full border
              text-sm font-semibold transition
              ${
                page >= totalPages - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 active:scale-95'
              }
            `}
          >
            Trang sau →
          </button>
        </div>
      )}
    </div>
  );
};

const settingsSections: SettingsSectionData[] = [
  {
    id: 1,
    mainTitle: "Tài khoản",
    items: [
      {
        id: "edit-profile",
        title: "Chỉnh sửa hồ sơ",
        icon: ProfileCircle,
        contentKey: "edit-profile",
      },
      {
        id: "account-management",
        title: "Quản lý tài khoản",
        icon: Setting2,
      },
      {
        id: "account-recipes",
        title: "Quản lý công thức nấu ăn",
        icon: ReceiptSquare,
        contentKey: "account-recipes",
      },
      {
        id: "display-mode",
        title: "Chế độ hiển thị",
        icon: Moon,
      },
      {
        id: "kitchen-permission",
        title: "Quyền và hoạt động Bạn Bếp",
        icon: UserTag,
      },
    ],
  },
  {
    id: 2,
    mainTitle: "Đăng nhập",
    items: [
      {
        id: "premium",
        title: "Premium",
        icon: Crown,
        contentKey: "premium",
        description: "Khám phá đặc quyền Premium dành riêng cho đầu bếp sáng tạo.",
      },
      {
        id: "security",
        title: "Bảo mật",
        icon: ShieldSecurity,
        contentKey: "security",
        description: "Bảo vệ tài khoản với các tuỳ chọn bảo mật nâng cao.",
      },
      {
        id: "logout",
        title: "Đăng xuất",
        icon: LogoutCurve,
        action: "logout",
      },
    ],
  },
  {
    id: 3,
    mainTitle: "Hỗ trợ",
    items: [
      {
        id: "support",
        title: "Trợ giúp",
        icon: MessageQuestion,
        description: "Tìm lời giải cho các câu hỏi thường gặp khi sử dụng CookPad.",
      },
      {
        id: "terms",
        title: "Xem điều khoản dịch vụ",
        icon: DocumentText,
        description: "Đọc chi tiết về điều khoản sử dụng và quyền lợi của bạn.",
      },
      {
        id: "privacy",
        title: "Xem chính sách quyền riêng tư",
        icon: ShieldTick,
        description: "Tìm hiểu cách CookPad bảo vệ dữ liệu cá nhân của bạn.",
      },
    ],
  },
];

const SettingItem = ({
  item,
  isActive,
  onClick,
}: {
  item: SettingItemData;
  isActive: boolean;
  onClick: () => void;
}) => {
  const LeadingIcon = item.icon;
  const isLogout = item.action === "logout";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
        isLogout ? "hover:bg-[#FFEDE6]" : "hover:bg-[#F5F5F5]",
        isActive && !isLogout && "bg-[#FFEDE6]",
      )}
    >
      <LeadingIcon
        size={22}
        variant="Linear"
        color={isLogout ? "#E36137" : isActive ? "#E36137" : "#7A7A7A"}
      />
      <p
        className={cn(
          "flex-1 font-semibold text-black transition-colors text-base",
          isLogout && "text-[#E36137]",
          isActive && !isLogout && "text-customPrimary",
        )}
      >
        {item.title}
      </p>
      {!isLogout && (
        <ArrowRight2
          size={18}
          variant="Linear"
          color={isActive ? "#E36137" : "#B3B3B3"}
        />
      )}
    </button>
  );
};

const SettingsSection = ({
  section,
  activeItemId,
  onItemPress,
}: {
  section: SettingsSectionData;
  activeItemId: string;
  onItemPress: (item: SettingItemData) => void;
}) => (
  <div className="flex w-full flex-col gap-3">
    <p className="font-semibold text-textNeutralV1 text-sm">
      {section.mainTitle}
    </p>
    <div className="w-full space-y-1">
      {section.items.map((item) => (
        <SettingItem
          key={item.id}
          item={item}
          isActive={activeItemId === item.id}
          onClick={() => onItemPress(item)}
        />
      ))}
    </div>
  </div>
);

const PlaceholderCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] bg-white px-6 py-12 text-center">
    <p className="font-bold text-black text-lg">
      {title}
    </p>
    <p className="mt-3 text-textNeutralV1 text-sm">
      {description}
    </p>
  </div>
);

const SettingScreen = () => {
  const router = useRouter();

  const allItems = useMemo(
    () => settingsSections.flatMap((section) => section.items),
    [],
  );
  const [activeItemId, setActiveItemId] = useState<string>(
    allItems.find((item) => item.contentKey)?.id ?? allItems[0]?.id ?? "",
  );

  const sidebarContents: Record<SidebarContentKey, ReactNode> = {
    "edit-profile": (
      <EditProfileScreen
        showHeader={false}
      />
    ),
    premium: (
      <PremiumScreen
        showHeader={false}
      />
    ),
    security: (
      <SecurityScreen
        showHeader={false}
      />
    ),
    "account-recipes": <RecipesGrid />,
  };

  const activeItem = allItems.find((item) => item.id === activeItemId);
  const activeContent =
    (activeItem?.contentKey && sidebarContents[activeItem.contentKey]) ?? (
      <PlaceholderCard
        title={activeItem?.title ?? "Cài đặt"}
        description={
          activeItem?.description ??
          "Chức năng này đang trong quá trình hoàn thiện. Vui lòng quay lại sau."
        }
      />
    );

  const handleItemPress = (item: SettingItemData) => {
    if (item.action === "logout") {
      router.replace("/sign-in");
      return;
    }

    if (item.href) {
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
      return;
    }

    setActiveItemId(item.id);
  };

  return (
    <div className="flex-1 bg-backgroundV1">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-4 px-16 mt-4 items-stretch">
        <aside className="w-full border-b border-[#F0F0F0] rounded-xl bg-white p-4">
          <div className="flex flex-col gap-8">
            {settingsSections.map((section) => (
              <SettingsSection
                key={section.id}
                section={section}
                activeItemId={activeItemId}
                onItemPress={handleItemPress}
              />
            ))}
          </div>
        </aside>
        <main className="flex-1">
          {activeContent}
        </main>
      </div>
    </div>
  );
};

export default SettingScreen;
