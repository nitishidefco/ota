import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getFacilities} from '../../Services/FacilitiesService';

export const getFacilitiesThunk = createAsyncThunk(
  'facilities/getFacilities',
  async (_, {rejectWithValue}) => {
    try {
      const facilitiesResponse = await getFacilities();
      console.log(facilitiesResponse);

      return facilitiesResponse;
    } catch (error) {
      const {code, message} = error;
      return rejectWithValue({code, message});
    }
  },
);

const initialState = {
  loadingFacilities: false,
  facilities: [],
  errorMessage: '',
};

const facilitiesSlice = createSlice({
  name: 'facilities',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getFacilitiesThunk.pending, state => {
        state.loadingFacilities = true;
        state.facilities = [];
      })
      .addCase(getFacilitiesThunk.fulfilled, (state, action) => {
        state.loadingFacilities = false;
        state.facilities = action.payload;
      })
      .addCase(getFacilitiesThunk.rejected, (state, action) => {
        state.loadingFacilities = false;
        state.errorMessage = action.payload;
      });
  },
});

export default facilitiesSlice.reducer;
