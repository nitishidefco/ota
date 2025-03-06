import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getUserProfile} from '../../Services/UserProfileService';

export const getUserProfileData = createAsyncThunk(
  'userProfile/getUserProfileData',
  async ({userToken, contentToken}, {rejectWithValue}) => {
    try {
      const response = await getUserProfile({
        userToken,
        contentToken,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error getting user profile data', error);
    }
  },
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFailure: false,
  userProfileData: {},
  errorMessage: '',
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserProfileData.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isFailure = false;
        state.errorMessage = '';
      })
      .addCase(getUserProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userProfileData = action.payload;
      })
      .addCase(getUserProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.isFailure = true;
        state.errorMessage = action.payload;
      });
  },
});

export default userProfileSlice.reducer;
