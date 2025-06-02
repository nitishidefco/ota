import axios from 'axios';
import {Store} from '../Redux/store';
import {logout} from '../Redux/Reducers/AuthSlice';

const baseApiClient = axios.create({
  baseURL: 'https://otaapi.visionvivante.in',
  headers: {
    'Content-Type': 'application/json',
  },
});

baseApiClient.interceptors.request.use(
  async config => {
    const state = Store.getState();
    const authToken = state.auth.userToken;
    const contentToken = state.contentToken.universalToken;

    if (authToken) {
      config.headers['x-access-token'] = `${authToken}`;
    }

    if (contentToken) {
      config.headers['Content-Token'] = contentToken;
    }
    console.log('config', config);

    return config;
  },
  error => Promise.reject(error),
);

baseApiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      Store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default baseApiClient;
