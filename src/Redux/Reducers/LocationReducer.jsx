import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import GetLocation from 'react-native-get-location';

export const getDeviceLocation = createAsyncThunk(
  'deviceLocation/getDeviceLocation',
  async (_, {rejectWithValue}) => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 60000,
      });

      return location;
    } catch (error) {
      const {code, message} = error;
      return rejectWithValue({code, message});
    }
  },
);

const initialState = {
  loadingLocation: false,
  deviceLocation: '',
  errorMessage: '',
};

const deviceLocationSlice = createSlice({
  name: 'deviceLocation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDeviceLocation.pending, state => {
        state.loadingLocation = true;
        state.deviceLocation = '';
      })
      .addCase(getDeviceLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deviceLocation = action.payload;
      })
      .addCase(getDeviceLocation.rejected, (state, action) => {
        state.loadingLocation = false;
        console.log(action.payload);
        state.errorMessage = action.payload;
      });
  },
});

export default deviceLocationSlice.reducer;
