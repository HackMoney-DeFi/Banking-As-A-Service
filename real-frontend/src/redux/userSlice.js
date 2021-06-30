import { createSlice } from '@reduxjs/toolkit';

const loggedInState = {
    adminPoolIds: ['w243f3'],
    userId: 'sdf3fsa'
};


const slice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setAdminPoolIds: (state, action) => {
      state.adminPoolIds = action.payload;
    },
    login: (state, action) => {
      state.userId = loggedInState.userId;
    }
  },
});

export const { actions: { setAdminPoolIds, login } , reducer } = slice;