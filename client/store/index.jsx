import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice';
export const useUserStore = create()((...a) => ({
  ...createAuthSlice(...a),
}));
