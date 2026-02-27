'use client';

import { icons, images } from '@/constants';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import NotificationDropdown from '../BellScreen/Desktop/NotificationDropdown';
import { useAuthStore } from '@/store/useAuthStore';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import UpgradeChefPopup from '@components/ui/UpgradeChefPopup';

export default function Header() {

  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout, role } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationTabs = [
    { id: 'plus', icon: icons.plusIcon, activeIcon: icons.activePlusIcon, route: '/create', label: 'Tạo công thức' },
    { id: 'cart', icon: icons.bellIcon, activeIcon: icons.activeBellIcon, route: '/cart', label: 'Cart' },
    { id: 'profile', icon: icons.userIcon, activeIcon: icons.activeUserIcon, label: 'Profile' },

  ];

  const getActiveTab = () => {
    const normalizedPath = pathname.replace(/\/$/, '') || '/';
    if (normalizedPath === '/create') return 'plus';
    if (normalizedPath === '/notification') return 'bell';
    if (normalizedPath === '/profile') return 'profile';
    return 'home';
  };
  const activeTab = getActiveTab();

  const handleTabPress = (tabId: string) => {
    if (tabId === 'plus') router.push('/create');
    if (tabId === 'bell') router.push('/notification');
  };
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-50">

      {showUpgradePopup && (
        <UpgradeChefPopup onClose={() => setShowUpgradePopup(false)} />
      )}
      <div className="mx-auto flex w-full items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image unoptimized
            src={images.logo}
            alt="CookPad Logo"
            className="object-contain h-10 w-10 cursor-pointer"
            quality={100}
            draggable={false}
          />
          <p className="text-2xl cursor-pointer font-bold text-gray-600 hidden sm:flex">
            Cook<span className="text-customPrimary">Pad</span>
          </p>
        </Link>

        {/* Search Field */}
        <Link
          href="/search"
          className="relative flex-[5] mx-4 sm:mx-6"
        >

          <div className="hidden  md:flex border w-full border-customPrimary flex-row items-center justify-start rounded-lg bg-orange-50 h-10 px-2 gap-4 relative z-10">
            <Image unoptimized
              src={icons.searchIcon}
              alt="search"
              width={24}
              height={24}
              style={{ filter: 'invert(41%) sepia(63%) saturate(1216%) hue-rotate(345deg) brightness(96%) contrast(92%)' }}
            />
            <div className="flex flex-row items-center justify-start rounded bg-[rgba(239,68,68,0.2)] px-1 py-0.5 gap-0.5">
              <Image unoptimized src={icons.fireIcon} alt="hot" width={16} height={16} />
              <span className="font-medium text-red-500 text-sm">Hot</span>
            </div>
            <span className="text-sm font-medium text-gray-600 border-none outline-none flex-1 bg-transparent">
              Tìm kiếm...
            </span>
          </div>
          {/* Mobile search icon */}
          <button className="flex md:hidden items-center justify-center h-10 w-10 bg-orange-50 rounded-md">
            <Image unoptimized src={icons.searchIcon} alt="search" width={24} height={24} />
          </button>
        </Link>

        {/* Navigation menu */}
        <nav className="hidden md:flex items-center gap-2">
          {navigationTabs.map((tab) => {
            const isTabActive = activeTab === tab.id;

            // 🔔 Notification
            if (tab.id === 'bell') {
              return (
                <DropdownMenu key={tab.id}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center h-8 w-8 justify-center rounded-md transition-colors bg-orange-50"
                      aria-label={tab.label}
                    >
                      <Image unoptimized
                        src={isTabActive ? tab.activeIcon : tab.icon}
                        alt={tab.label}
                        className="w-5 h-5"
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[400px] p-0 overflow-y-auto">
                    <NotificationDropdown />
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            // 👤 Profile
            if (tab.id === 'profile') {
              return (
                <DropdownMenu key={tab.id}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center h-8 w-8 justify-center rounded-md transition-colors bg-orange-50"
                      aria-label={tab.label}
                    >
                      <Image unoptimized
                        src={isTabActive ? tab.activeIcon : tab.icon}
                        alt={tab.label}
                        className="w-5 h-5"
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48">
                    {isLoggedIn ? (
                      <>
                        {/* ===== ĐƠN HÀNG ===== */}
                        <DropdownMenuItem onClick={() => router.push('/buyer/orders')}>
                          🛒 Đơn hàng của tôi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          if (role === 'CHEF') {
                            router.push('/seller/dishes/create');
                          } else {
                            setShowUpgradePopup(true);
                          }
                        }}>
                          💼 Bán hàng
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => {
                          if (role === 'CHEF') {
                            router.push('/seller/wallet');
                          } else {
                            setShowUpgradePopup(true);
                          }
                        }}>
                          💰 Ví bán hàng
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            if (role === 'CHEF') {
                              router.push('/seller/orders');
                            } else {
                              setShowUpgradePopup(true);
                            }
                          }}
                        >
                          📦 Quản lý đơn bán
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* ===== PROFILE ===== */}
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                          👤 Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            logout();
                            router.push('/');
                            router.refresh();
                          }}
                          className="text-red-600"
                        >
                          🚪 Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push('/auth/sign-in')}>
                        🔐 Login
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>

                </DropdownMenu>
              );
            }

            // 🛒 CART (NÚT MỚI)
            if (tab.id === 'cart') {
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push('/cart')}
                  className="relative flex items-center h-8 w-8 justify-center rounded-md transition-colors bg-orange-50 hover:bg-orange-100"
                  aria-label="Giỏ hàng"
                >
                  <Image unoptimized
                    src={isTabActive ? tab.activeIcon : tab.icon}
                    alt="Cart"
                    className="w-5 h-5"
                  />

                  {/* Badge số lượng (nếu có) */}
                  {/* <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span> */}
                </button>
              );
            }

            // ➕ Các tab còn lại
            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                className="flex items-center h-8 w-8 justify-center rounded-md transition-colors bg-orange-50 hover:bg-orange-100"
                aria-label={tab.label}
              >
                <Image unoptimized
                  src={isTabActive ? tab.activeIcon : tab.icon}
                  alt={tab.label}
                  className="w-5 h-5"
                />
              </button>
            );
          })}
        </nav>


        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center h-10 w-10 bg-orange-50 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Image unoptimized src={mobileMenuOpen ? icons.closeIcon : icons.threeDotsIcon} alt="menu" width={24} height={24} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 w-full absolute top-16 left-0 z-40 p-4 flex flex-col gap-2">
          {/* ===== ĐƠN HÀNG ===== */}
          <button
            onClick={() => {
              router.push('/buyer/orders');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            🛒 Đơn hàng của tôi
          </button>

          <button
            onClick={() => {
              if (role === 'CHEF') {
                router.push('/seller/dishes/create');
              } else {
                setShowUpgradePopup(true);
              }
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            💰 Bán hàng
          </button>

          <button
            onClick={() => {
              if (role === 'CHEF') {
                router.push('/seller/wallet');
              } else {
                setShowUpgradePopup(true);
              }
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            🏦 Ví bán hàng
          </button>

          <button
            onClick={() => {
              if (role === 'CHEF') {
                router.push('/seller/orders');
              } else {
                setShowUpgradePopup(true);
              }
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            📦 Quản lý đơn bán
          </button>

          <hr className="my-2 border-gray-200" />

          {/* ===== PROFILE ===== */}
          <button
            onClick={() => {
              router.push('/profile');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            👤 Profile
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                router.push('/');
              }}
              className="flex items-center gap-2 p-2 rounded text-red-500 hover:bg-gray-100"
            >
              🚪 Logout
            </button>
          ) : (
            <button
              onClick={() => {
                router.push('/auth/sign-in');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            >
              🔐 Login
            </button>
          )}
        </div>
      )}

    </header>

  );
}
