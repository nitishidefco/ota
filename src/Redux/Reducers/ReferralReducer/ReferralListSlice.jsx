import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getReferralList} from '../../../Services/ReferralService/ReferalService';
import {getCashbackList} from '../../../Services/ReferralService/CashbackService';

const initialState = {
  referralList: {
    data: [],
    totalCount: 0,
    currentPage: 1,
    hasMore: true,
  },
  cashbackList: {
    data: [],
    totalCount: 0,
    currentPage: 1,
    hasMore: true,
    total_cashback: 0,
    total_earning: 0,
  },
  isLoading: false,
  error: null,
};

export const getReferralListThunk = createAsyncThunk(
  'referral/getReferralList',
  async (
    {pageCount = 1, limit = 10, statusType = null, isNewFilter = false},
    {rejectWithValue},
  ) => {
    try {
      const response = await getReferralList(pageCount, limit, statusType);
      console.log('Thunk response', response);

      return {
        ...response,
        pageCount,
        isNewFilter,
        limit,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error.message || 'An error occurred',
      );
    }
  },
);

export const getCashbackListThunk = createAsyncThunk(
  'referral/getCashbackList',
  async ({pageCount = 1, limit = 10, type = null}, {rejectWithValue}) => {
    console.log('Cashback list thunk', pageCount, limit, 'type:', type);
    try {
      const response = await getCashbackList(pageCount, limit, type);
      return {
        ...response,
        pageCount,
        limit,
        type,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error.message || 'An error occurred',
      );
    }
  },
);
const referralListSlice = createSlice({
  name: 'referralList',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearReferralList: state => {
      state.referralList = {
        data: [],
        totalCount: 0,
        currentPage: 1,
        hasMore: true,
      };
    },
    resetReferralList: state => {
      state.referralList = {
        data: [],
        totalCount: 0,
        currentPage: 1,
        hasMore: true,
      };
    },
    clearCashbackList: state => {
      state.cashbackList = {
        data: [],
        totalCount: 0,
        currentPage: 1,
        hasMore: true,
        total_cashback: 0,
        total_earning: 0,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(getReferralListThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getReferralListThunk.fulfilled, (state, action) => {
      const {pageCount, isNewFilter, limit} = action.payload;
      const responseData = action.payload;

      if (isNewFilter || pageCount === 1) {
        // Reset list for new filter or first page
        state.referralList.data = responseData;
        state.referralList.currentPage = pageCount;
      } else {
        // Append data for pagination
        state.referralList.data = [...state.referralList.data, ...responseData];
        state.referralList.currentPage = pageCount;
      }
      state.referralList.hasMore = responseData.length === limit;
      state.referralList.totalCount =
        action.payload.totalCount || state.referralList.data.length;

      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getReferralListThunk.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCashbackListThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCashbackListThunk.fulfilled, (state, action) => {
      console.log('Cashback list', action.payload);
      const {data, pageCount, limit} = action.payload;
      const responseData = data || action.payload || [];

      // Always replace cashback data (no pagination needed for cashback typically)
      state.cashbackList.data = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];
      state.cashbackList.currentPage = pageCount || 1;
      state.cashbackList.total_cashback = action.payload.total_amount || 0;
      state.cashbackList.total_earning = action.payload.total_earning || 0;
      state.cashbackList.totalCount =
        action.payload.totalCount || state.cashbackList.data.length;
      state.cashbackList.hasMore = false; // Typically cashback doesn't need pagination

      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCashbackListThunk.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
  },
});

export const {
  clearError,
  clearReferralList,
  resetReferralList,
  clearCashbackList,
} = referralListSlice.actions;
export default referralListSlice.reducer;
