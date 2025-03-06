import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getCityDetails} from '../../../Services/HotelService.js/GetCitiesService';

const initialState = {
  loadingCityDetails: false,
  cityDetails: [],
};

export const getCityDetailsThunk = createAsyncThunk(
  'hotel/getCityDetails',
  async ({cityName}, {rejectWithValue}) => {
    try {
      const response = await getCityDetails({
        cityName,
      });
      return response.data;
    } catch (err) {
      console.error('Error in  getting city details:', err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

const getCitySlice = createSlice({
  name: 'getCity',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCityDetailsThunk.pending, state => {
        state.loadingCityDetails = true;
        state.cityDetails = [];
      })
      .addCase(getCityDetailsThunk.fulfilled, (state, action) => {
        state.loadingCityDetails = false;
        state.cityDetails = action.payload.data.getCities;
      })
      .addCase(getCityDetailsThunk.rejected, (state, action) => {
        state.loadingCityDetails = false;
        state.cityDetails = [];
      });
  },
});

export default getCitySlice.reducer;
