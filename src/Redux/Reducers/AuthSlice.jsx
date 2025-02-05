import {
  createSlice,
  createAsyncThunk,
  rejectWithValue,
} from '@reduxjs/toolkit';
import {createAccount} from '../../Services/AuthServices';
import * as Keychain from 'react-native-keychain';
const initialState = {
  isLoading: false,
  isSuccess: false,
  isFailure: false,
  authData: '',
  userToken: '',
  errorMessage: '',
};
const saveToken = async token => {
  try {
    // Store the token securely
    await Keychain.setGenericPassword('auth_token', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
export const createUserAccount = createAsyncThunk(
  'auth/createAccount',
  async ({details},{ rejectWithValue }) => {
    try {
      const response = await createAccount({details: details});
      return response.data;
    } catch (err) {
      console.error('Error in creating account:', err);  // Added log for error
      return rejectWithValue(
        err.response ? err.response.data : err.message
      );
    }
  },
);

export const checkStoredToken = createAsyncThunk(
  'auth/checkStoredToken',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getToken();

      return {token};
    } catch (error) {
      await removeToken();
      return rejectWithValue('Token validation failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: state => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isSuccess = false;
      removeToken();
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createUserAccount.pending, state => {
        state.isLoading = true;
        state.isFailure = false;
        state.isSuccess = false;
        state.errorMessage = '';
      })
      .addCase(createUserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.authData = action.payload.user;
        state.userToken = action.payload.token;
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetAuth, logout } = authSlice.actions;
export default authSlice.reducer;
