import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {sendSupportMessage} from '../../Services/SupportService';

const initialState = {
  isLoading: false,
  error: null,
  success: false,
};

export const sendSupportMessageThunk = createAsyncThunk(
  'support/sendSupportMessage',
  async (data, {rejectWithValue}) => {
    console.log('data', data);
    try {
      const response = await sendSupportMessage(data);
      console.log('response', response);
      return response;
    } catch (error) {
     console.log('error', error);

      return rejectWithValue(error.response.data);
    }
  },
);

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(sendSupportMessageThunk.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(sendSupportMessageThunk.fulfilled, state => {
      state.isLoading = false;
      state.success = true;
    });
    builder.addCase(sendSupportMessageThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default supportSlice.reducer;
