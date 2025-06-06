import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {modifyRooms} from '../../../Services/HotelService.js/ModifyRoomsService';

const initialState = {
  rooms: '',
  loadingRooms: null,
};

export const getRooms = createAsyncThunk(
  'rooms/getRooms',
  async ({details}, {rejectWithValue}) => {
    try {
      const response = await modifyRooms({details: details});
      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting hotels', error);
    }
  },
);

const roomsSlice = createSlice({
  name: 'roomsSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRooms.pending, state => {
        state.loadingRooms = true;
        state.rooms = [];
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.loadingRooms = false;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.loadingRooms = false;
        console.log('Rejected rooms request', action.payload);
      });
  },
});

export default roomsSlice.reducer;
