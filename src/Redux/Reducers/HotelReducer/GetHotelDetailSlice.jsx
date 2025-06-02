import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getHotelDetails} from '../../../Services/HotelService.js/GetHotelDetails';
import {getAdditionalDetails} from '../../../Services/HotelService.js/GetAdditionalDetailsService';

const initialState = {
  hotel: null,
  loadingHotels: null,
  additionalDetails: {},
  loadingAdditionalDetails: null,
};

export const getHotelDetailsThunk = createAsyncThunk(
  'hotels/getHotelDetail',
  async ({details}, {rejectWithValue}) => {
    try {
      console.log('details', details);
      const response = await getHotelDetails({details: details});
      console.log('response', response);

      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting hotels', error);
    }
  },
);

export const getAdditionalDetail = createAsyncThunk(
  'hotels/additionalDetails',
  async ({details}, {rejectWithValue}) => {
    try {
      const response = await getAdditionalDetails({details: details});
      console.log('Additional details response', response);

      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting additional details', error);
    }
  },
);

const hotelDetailSlice = createSlice({
  name: 'hotelDetailSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getHotelDetailsThunk.pending, state => {
        state.loadingHotels = true;
        state.hotel = null;
      })
      .addCase(getHotelDetailsThunk.fulfilled, (state, action) => {
        state.loadingHotels = false;
        state.hotel = action.payload;
      })
      .addCase(getHotelDetailsThunk.rejected, (state, action) => {
        state.loadingHotels = false;
        console.log('Rejected hotel request', action.payload);
      })
      .addCase(getAdditionalDetail.pending, state => {
        state.loadingAdditionalDetails = true;
      })
      .addCase(getAdditionalDetail.fulfilled, (state, action) => {
        state.loadingAdditionalDetails = false;
        console.log('Additional details fulfilled', action.payload);

        state.additionalDetails = action.payload;
      })
      .addCase(getAdditionalDetail.rejected, (state, action) => {
        state.loadingAdditionalDetails = false;
        console.log('Rejected additional details request', action.payload);
      });
  },
});

export default hotelDetailSlice.reducer;
