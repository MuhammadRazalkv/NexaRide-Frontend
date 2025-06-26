import { createSlice } from '@reduxjs/toolkit';

export type ModalType = 'PAYMENT' | 'RATING' | 'RIDE_CANCELLED' | 'NONE';

interface ModalState {
  type: ModalType;
  payload?: any;
  isOpen: boolean;
}

const initialState: ModalState = {
  type: 'NONE',
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.payload = action.payload.payload || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = 'NONE';
      state.payload = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
