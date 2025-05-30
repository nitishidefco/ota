import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getHotels} from '../../../Services/HotelService.js/GetHotelService';
import reactotron from 'reactotron-react-native';

const initialState = {
  hotels: [],
  loadingHotels: null,
};

export const getAllHotelsThunk = createAsyncThunk(
  'hotels/getAllHotels',
  async ({details}, {rejectWithValue}) => {
    reactotron.log('details', details);
    try {
      const response = await getHotels({
        details: details,
      });
      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting hotels', error);
    }
  },
);

const hotelSlice = createSlice({
  name: 'hotelSlice',
  initialState,
  reducers: {
    resetHotelState: state => {
      state.hotels = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllHotelsThunk.pending, state => {
        state.loadingHotels = true;
        state.hotels = [];
      })
      .addCase(getAllHotelsThunk.fulfilled, (state, action) => {
        state.loadingHotels = false;
        state.hotels = action.payload;
      })
      .addCase(getAllHotelsThunk.rejected, (state, action) => {
        state.loadingHotels = false;
        console.log('Rejected hotel request', action.payload);
      });
  },
});
export const {resetHotelState} = hotelSlice.actions;
export default hotelSlice.reducer;
