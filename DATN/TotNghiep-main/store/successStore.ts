import { create } from 'zustand';

interface SuccessState {
  successTitle: string;
  successDesc: string;
  successRedirect: string;
  setSuccess: (title: string, desc: string, redirect?: string) => void;
  setSuccessRedirect: (redirect: string) => void;
  resetSuccess: () => void;
}

export const useSuccessStore = create<SuccessState>((set) => ({
  successTitle: '',
  successDesc: '',
  successRedirect: '/auth/sign-in',
  setSuccess: (title, desc, redirect = '/auth/sign-in') => set({ successTitle: title, successDesc: desc, successRedirect: redirect }),
  setSuccessRedirect: (redirect) => set({ successRedirect: redirect }),
  resetSuccess: () => set({ successTitle: '', successDesc: '', successRedirect: '/auth/sign-in' }),
}));
