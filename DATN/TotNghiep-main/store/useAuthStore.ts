import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  id:number;
  username: string;
  dob: string;
  bio: string;
  avatarUrl: string;
  roles: { name: string }[];
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  id:number | null;
  token: string | null;
  user: UserInfo;
  isLoggedIn: boolean;
  expiresAt: number | null;
  hydrated: boolean;

  role: string;                  // ⭐ lưu role cuối cùng
  authPopupVisible: boolean;
  openAuthPopup: () => void;
  closeAuthPopup: () => void;

  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
}

const defaultUser = (): UserInfo => ({
  id:0,
  username: "",
  dob: "",
  bio: "",
  avatarUrl: "",
  roles: [{ name: "USER" }],
  createdAt: "",
  lastLogin: "",
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      id:0,
      token: null,
      user: defaultUser(),
      isLoggedIn: false,
      expiresAt: null,
      hydrated: false,

      role: "USER", // ⭐ role mặc định

      authPopupVisible: false,
      openAuthPopup: () => set({ authPopupVisible: true }),
      closeAuthPopup: () => set({ authPopupVisible: false }),

      setAuth: (user, token) =>
        set({
          id : user.id,
          token,
          user: {
            ...user,
            roles: user.roles?.length ? user.roles : [{ name: "USER" }],
          },
          // ⭐ Lấy role cuối cùng trong mảng
          role: user.roles?.length
            ? user.roles[user.roles.length - 1].name
            : "USER",
          isLoggedIn: true,
          expiresAt: Date.now() + 0.5 * 60 * 60 * 1000, // 30 phút
        }),

      logout: () =>
        set({
          id : 0,
          token: null,
          user: defaultUser(),
          role: "USER", // reset role
          isLoggedIn: false,
          expiresAt: null,
        }),
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        id:state.user.id,
        token: state.token,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        expiresAt: state.expiresAt,
        role: state.role,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.hydrated = true;

        if (!state.user.roles || state.user.roles.length === 0) {
          state.user.roles = [{ name: "USER" }];
        }

        // ⭐ restore role cuối cùng
        state.role = state.user.roles[state.user.roles.length - 1].name;
      },
    }
  )
);
