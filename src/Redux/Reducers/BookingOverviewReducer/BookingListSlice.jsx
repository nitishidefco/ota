import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  cancelBooking,
  getBookingList,
} from '../../../Services/BookingService/BookingListService';
import {getCardDetails} from '../../../Services/BookingService/GetCardDetails';
import {AddCardDetails} from '../../../Services/BookingService/AddCardDetails';
import {getBookingDetails} from '../../../Services/BookingService/BookingDetails';

const initialState = {
  bookingList: [],
  loadingBookingList: null,
  cancelBookingLoading: null,
  currentCancellingBookingId: null,
  savedCard: null,
  loadingSavedCard: null,
  savingCardLoading: null,
  bookingDetails: null,
  loadingBookingDetails: null,
};

export const getBookingListThunk = createAsyncThunk(
  'booking/getBookingList',
  async ({page, limit, isAdmin}, {rejectWithValue}) => {
    console.log(typeof page, typeof limit, typeof isAdmin);

    try {
      const response = await getBookingList({page, limit, isAdmin});
      return response.data;
    } catch (error) {
      return rejectWithValue('Error getting booking list', error);
    }
  },
);

export const cancelBookingThunk = createAsyncThunk(
  'booking/cancelBooking',
  async ({bookingNo, gds}, {rejectWithValue}) => {
    try {
      const response = await cancelBooking({bookingNo, gds});
      return response;
    } catch (error) {
      return rejectWithValue('Error cancelling booking', error);
    }
  },
);

export const getSavedCardThunk = createAsyncThunk(
  'booking/getSavedCard',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getCardDetails();
      console.log('response in get saved card thunk', response);
      if (!response) {
        return rejectWithValue('No card data available');
      }
      return response;
    } catch (error) {
      console.log('getCardDetails error:', error);
      return rejectWithValue(
        error?.response?.data?.message || 'Error getting saved card',
      );
    }
  },
);

export const saveCardThunk = createAsyncThunk(
  'booking/saveCard',
  async ({details}, {rejectWithValue}) => {
    console.log('details in save card thunk', details);
    try {
      const response = await AddCardDetails({details});
      console.log('response in save card thunk', response);

      return response;
    } catch (error) {
      console.log('error in save card thunk', error);
      return rejectWithValue('Error saving card', error);
    }
  },
);

export const getBookingDetailsThunk = createAsyncThunk(
  'booking/getBookingDetailsThunk',
  async ({bookingNo, provider, bookingId}, {rejectWithValue}) => {
    console.log('inside the booking details thunk');
    try {
      const response = await getBookingDetails({
        bookingNo,
        provider,
        bookingId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error getting booking details', error);
    }
  },
);
const bookingListSlice = createSlice({
  name: 'bookingListSlice',
  initialState,
  reducers: {
    resetBookingList: state => {
      state.bookingList = [];
      state.loadingBookingList = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getBookingListThunk.pending, state => {
        state.loadingBookingList = true;
        state.bookingList = [];
      })
      .addCase(getBookingListThunk.fulfilled, (state, action) => {
        state.loadingBookingList = false;
        state.bookingList = action.payload;
      })
      .addCase(getBookingListThunk.rejected, (state, action) => {
        state.loadingBookingList = false;
        console.log('Rejected booking list request', action.payload);
      })
      .addCase(cancelBookingThunk.pending, (state, action) => {
        state.cancelBookingLoading = true;
        state.currentCancellingBookingId = action.meta.arg.bookingNo;
        console.log(
          'Starting cancellation for booking:',
          action.meta.arg.bookingNo,
        );
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.cancelBookingLoading = false;
        state.currentCancellingBookingId = null;
        if (state.bookingList && state.bookingList.data) {
          const bookingIndex = state.bookingList.data.findIndex(
            item => item.BookingID === action.meta.arg.bookingNo,
          );
          if (bookingIndex !== -1) {
            state.bookingList.data[bookingIndex].Status = '3';
          }
        }
        console.log('Booking cancelled successfully:', action.payload);
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.cancelBookingLoading = false;
        state.currentCancellingBookingId = null;
        console.log('Rejected cancel booking request', action.payload);
      })
      .addCase(getSavedCardThunk.pending, state => {
        state.loadingSavedCard = true;
      })
      .addCase(getSavedCardThunk.fulfilled, (state, action) => {
        state.loadingSavedCard = false;
        state.savedCard = action.payload;
      })
      .addCase(getSavedCardThunk.rejected, (state, action) => {
        state.loadingSavedCard = false;
        state.savedCard = null;
        console.log('Rejected get saved card request:', action.payload);
      })
      .addCase(saveCardThunk.pending, state => {
        state.savingCardLoading = true;
      })
      .addCase(saveCardThunk.fulfilled, (state, action) => {
        state.savingCardLoading = false;
        state.savedCard = action.payload;
      })
      .addCase(saveCardThunk.rejected, (state, action) => {
        state.savingCardLoading = false;
        console.log('Rejected save card request:', action.payload);
      })
      .addCase(getBookingDetailsThunk.pending, state => {
        state.loadingBookingDetails = true;
      })
      .addCase(getBookingDetailsThunk.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        state.loadingBookingDetails = false;
        state.bookingDetails = action.payload;
      })
      .addCase(getBookingDetailsThunk.rejected, (state, action) => {
        state.loadingBookingDetails = false;
        console.log('Rejected get booking details request:', action.payload);
      });
  },
});
export const {resetBookingList} = bookingListSlice.actions;
export default bookingListSlice.reducer;
