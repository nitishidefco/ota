import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getContentToken} from '../../Services/ContentTokenService';

import * as Keychain from 'react-native-keychain';

const saveUniversalToken = async token => {
  try {
    await Keychain.setGenericPassword('universal_token', token, {
      service: 'universal_service',
    });
  } catch (error) {
    console.error('Error saving universal token', error);
  }
};

const getUniversalTokenFromKeychain = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'universal_service',
    });

    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error getting universal token', error);
    return null;
  }
};

const removeUniversalToken = async () => {
  try {
    await Keychain.resetGenericPassword({
      service: 'universal_service',
    });
  } catch (error) {
    console.error('Error removing universal token', error);
  }
};

export const getUniversalToken = createAsyncThunk(
  'contentToken/getUniversalToken',
  async (_, {rejectWithValue}) => {
    try {
      console.log('getting universal token');

      const response = await getContentToken();
      console.log(response);

      return response;
    } catch (error) {
      return rejectWithValue('Error getting universal token');
    }
  },
);

export const checkUniversalToken = createAsyncThunk(
  'contentToken/checkUniversalToken',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getUniversalTokenFromKeychain();
      return {token};
    } catch (error) {
      // await removeToken();
      return rejectWithValue('Token validation failed');
    }
  },
);

const initialState = {
  universalToken: '',
  isLoading: false,
  status: null,
};

const contentTokenSlice = createSlice({
  name: 'contentToken',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUniversalToken.pending, state => {
        state.isLoading = true;
        state.status = null;
        state.universalToken = '';
      })
      .addCase(getUniversalToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.universalToken = action.payload.data.data;
        state.status = action.payload.status;
        saveUniversalToken(action.payload.data.data);
      })
      .addCase(getUniversalToken.rejected, (state, action) => {
        state.isLoading = false;
        state.status = action.payload.status;
      })
      .addCase(checkUniversalToken.pending, state => {
        state.isLoading = true;
        state.status = null;
      })
      .addCase(checkUniversalToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.universalToken = action.payload.token;
        state.status = 'Token Found';
      })
      .addCase(checkUniversalToken.rejected, (state, action) => {
        state.isLoading = false;
        state.universalToken = '';
        state.status = action.payload;
      });
  },
});

export default contentTokenSlice.reducer;
