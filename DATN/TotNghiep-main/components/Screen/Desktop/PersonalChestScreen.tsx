'use client';

import { images } from '@/constants';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import UpgradeChefPopup from '@components/ui/UpgradeChefPopup';

const actionCardsData = [
  {
    id: '1',
    title: 'Tạo công thức',
    icon: images.menu,
  },
  {
    id: '2',
    title: 'Đăng bán món ăn',
    icon: images.featuredFood1,
  },
  {
    id: '3',
    title: 'Tạo bảng',
    icon: images.table,
  },
];

const CHEF_REQUIRED_ACTIONS = ['1', '2'];

const PersonalChestScreen = () => {
  const router = useRouter();
  const { isLoggedIn, role, openAuthPopup } = useAuthStore();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  // Tránh flash khi chưa hydrate role
  if (isLoggedIn && role === undefined) return null;

  const handleClick = (itemId: string) => {
    // 1️⃣ Chưa login
    if (!isLoggedIn) {
      openAuthPopup();
      return;
    }

    // 2️⃣ Action cần CHEF nhưng user chưa phải CHEF
    if (CHEF_REQUIRED_ACTIONS.includes(itemId) && role !== 'CHEF') {
      setShowUpgradePopup(true);
      return;
    }

    // 3️⃣ Điều hướng
    switch (itemId) {
      case '1':
        router.push('/create/recipe');
        break;
      case '2':
        router.push('/seller/dishes/create');
        break;
      case '3':
        router.push('/create/categories');
        break;
    }
  };

  const backgroundImageUrl =
    typeof images.personalChestBg === 'string'
      ? images.personalChestBg
      : (images.personalChestBg as StaticImageData)?.src;

  return (
    <div
      className="flex items-center justify-center w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto 150vh',
      }}
    >
      {showUpgradePopup && (
        <UpgradeChefPopup onClose={() => setShowUpgradePopup(false)} />
      )}

      <div className="w-full mt-12 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-9 max-w-2xl">
          <div className="w-[200px] h-[200px] relative">
            <Image unoptimized
              src={images.personalChestBanner}
              alt="banner"
              fill
              className="object-contain"
            />
          </div>

          <div className="px-4 text-center">
            <p className="font-medium text-xl mb-2">Rương cá nhân</p>
            <p className="text-textNeutralV1 mb-6">
              Lưu trữ công thức, đăng bán món ăn và tạo bảng quản lý cá nhân
            </p>

            <div className="flex gap-4 justify-center">
              {actionCardsData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="bg-white w-[100px] h-[100px] rounded-lg shadow-md hover:scale-95 transition">
                    <div className="flex h-full items-center justify-center">
                      <Image unoptimized
                        src={item.icon}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="font-bold text-sm">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalChestScreen;
