import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  changePassword,
  editUserProfile,
  getUserProfile,
} from '../../Services/UserProfileService';

export const getUserProfileData = createAsyncThunk(
  'userProfile/getUserProfileData',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getUserProfile();
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error getting user profile data', error);
    }
  },
);

export const changeUserPassword = createAsyncThunk(
  'userProfile/changePassword',
  async ({details}, {rejectWithValue}) => {
    let response;
    try {
      response = await changePassword({details});
      console.log(response);
      return response.data;
    } catch (error) {
      response = error.response || error;
      console.log(response);
      return rejectWithValue(response?.data);
    }
  },
);
export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async ({details}, {rejectWithValue}) => {
    console.log(details);
    let response;
    try {
      response = await editUserProfile({details: details});
      console.log(response);
      return response.data;
    } catch (error) {
      response = error.response || error;
      console.log(response);
      return rejectWithValue(response?.data);
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
      })
      .addCase(changeUserPassword.pending, state => {
        state.isLoading = true;
        state.isFailure = false;
        state.isSuccess = false;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log('fullfilled', action.payload);
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isFailure = true;
        state.errorMessage = action.payload.message;
      });
  },
});

export default userProfileSlice.reducer;
