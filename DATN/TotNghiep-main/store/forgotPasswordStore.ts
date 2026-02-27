import { create } from 'zustand';

interface ForgotPasswordState {
  isForgotPassword: boolean;
  setIsForgotPassword: (value: boolean) => void;
  resetIsForgotPassword: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  isForgotPassword: false,
  setIsForgotPassword: (value) => set({ isForgotPassword: value }),
  resetIsForgotPassword: () => set({ isForgotPassword: false }),
}));
