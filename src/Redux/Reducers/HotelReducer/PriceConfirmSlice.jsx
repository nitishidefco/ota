import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {priceConfirm} from '../../../Services/HotelService.js/PriceConfirmService';

const initialState = {
  priceConfirmDetails: null,
  confirmingPrice: null,
};

export const confirmPrice = createAsyncThunk(
  'price/confirmPrice',
  async ({details}, {rejectWithValue}) => {
    try {
      console.log('details', details);
      const response = await priceConfirm({details: details});
      console.log('response', response);

      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting hotesl', error);
    }
  },
);

const confirmPriceSlice = createSlice({
  name: 'roomsSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(confirmPrice.pending, state => {
        state.confirmingPrice = true;
        state.priceConfirmDetails = null;
      })
      .addCase(confirmPrice.fulfilled, (state, action) => {
        state.confirmingPrice = false;
        state.priceConfirmDetails = action.payload;
      })
      .addCase(confirmPrice.rejected, (state, action) => {
        state.confirmingPrice = false;
        console.log('Rejected price confirm request', action.payload);
      });
  },
});

export default confirmPriceSlice.reducer;
