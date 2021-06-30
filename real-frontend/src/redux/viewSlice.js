import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const slice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setSidePanel: (state, action) => {
      state.sidePanel = action.payload;
    },
    setProps: (state, action) => {
      state.props = action.payload;
    },
    closeSidePanel: (state) => {
      delete state.sidePanel;
    }
  },
});

export const { actions: { setSidePanel, closeSidePanel, setProps } , reducer } = slice;