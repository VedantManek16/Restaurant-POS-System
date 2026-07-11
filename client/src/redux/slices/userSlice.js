import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage', error);
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('currentUser');
      }
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('currentUser');
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
