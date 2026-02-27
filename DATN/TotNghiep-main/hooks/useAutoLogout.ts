"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function useAutoLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, expiresAt, logout, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;

    const isPublicPage =
      pathname.startsWith("/auth") ||
      pathname.startsWith("/reset-password");

    // Chưa đăng nhập
    if (!token || !expiresAt) {
      if (!isPublicPage) {
        router.replace("/auth/sign-in");
      }
      return;
    }

    const interval = setInterval(() => {
      if (Date.now() >= expiresAt) {
        logout();
        router.replace("/auth/sign-in");
      }
    }, 1000 * 30);

    return () => clearInterval(interval);
  }, [token, expiresAt, pathname, hydrated]);
}
