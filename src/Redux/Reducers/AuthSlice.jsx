import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  createAccount,
  loginWithEmail,
  loginWithPhone,
} from '../../Services/AuthServices';
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
    await Keychain.setGenericPassword('auth_token', token, {
      service: 'auth_service',
    });
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'auth_service',
    });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword({
      service: 'auth_service',
    });
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
export const createUserAccount = createAsyncThunk(
  'auth/createAccount',
  async ({details, contentToken}, {rejectWithValue}) => {
    try {
      const response = await createAccount({
        details: details,
        contentToken: contentToken,
      });
      return response.data;
    } catch (err) {
      console.error('Error in creating account:', err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

export const loginUserWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({details, contentToken}, {rejectWithValue}) => {
    console.log('details', details);

    try {
      const response = await loginWithEmail({
        details: details,
        contentToken: contentToken,
      });
      console.log('response of login email', response);

      return response.data;
    } catch (err) {
      console.error('Error in login with email:', err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

export const loginUserWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async ({details, contentToken}, {rejectWithValue}) => {
    try {
      console.log('Details', details, contentToken);

      const response = await loginWithPhone({
        details: details,
        contentToken: contentToken,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const checkStoredToken = createAsyncThunk(
  'auth/checkStoredToken',
  async (_, {rejectWithValue}) => {
    try {
      console.log('checking for stored token');

      const token = await getToken();
      console.log(token);

      return {token};
    } catch (error) {
      // await removeToken();
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
      state.authData = null;
      state.userToken = null;
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
        // state.userToken = action.payload.token;
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(loginUserWithEmail.pending, state => {
        state.isLoading = true;
        state.isFailure = false;
        state.isSuccess = false;
        state.errorMessage = '';
      })
      .addCase(loginUserWithEmail.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.authData = action.payload.data;
        state.userToken = action.payload.data.token;
        saveToken(action.payload.data.token);
      })
      .addCase(loginUserWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(loginUserWithPhone.pending, state => {
        state.isLoading = true;
        state.isFailure = false;
        state.isSuccess = false;
        state.errorMessage = '';
      })
      .addCase(loginUserWithPhone.fulfilled, (state, action) => {
        console.log('action.payload login user with phone', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.authData = action.payload.data;
        state.userToken = action.payload.data.token;
      })
      .addCase(loginUserWithPhone.rejected, (state, action) => {
        console.log('action.pyaload login user with phone', action.payload);

        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(checkStoredToken.pending, state => {
        state.isLoading = true;
        state.isFailure = false;
        state.isSuccess = false;
        state.errorMessage = '';
      })
      .addCase(checkStoredToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userToken = action.payload.token;
      })
      .addCase(checkStoredToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const {resetAuth, logout} = authSlice.actions;
export default authSlice.reducer;
