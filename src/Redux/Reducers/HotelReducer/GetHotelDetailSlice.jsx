import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getHotelDetails} from '../../../Services/HotelService.js/GetHotelDetails';

const initialState = {
  hotel: '',
  loadingHotelDetails: null,
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
      return rejectWithValue('Error getting hotesl', error);
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
        state.hotel = [];
      })
      .addCase(getHotelDetailsThunk.fulfilled, (state, action) => {
        state.loadingHotels = false;
        state.hotel = action.payload;
      })
      .addCase(getHotelDetailsThunk.rejected, (state, action) => {
        state.loadingHotels = false;
        console.log('Rejected hotel request', action.payload);
      });
  },
});

export default hotelDetailSlice.reducer;
