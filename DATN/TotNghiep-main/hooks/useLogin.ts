"use client";

import { useMutation } from "@tanstack/react-query";
import { apiLogin } from "@api/auth";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: apiLogin,

    onSuccess: (data) => {
      setAuth(data.token, data.user);

      // persist
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },

    onError: (err: any) => {
      throw new Error(err?.response?.data?.message || "Login failed");
    },
  });
}
