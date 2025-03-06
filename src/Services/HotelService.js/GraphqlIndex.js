import axios from 'axios';
import {Store} from '../../Redux/store';
import {logout} from '../../Redux/Reducers/AuthSlice';

const baseApiClientgql = axios.create({
  baseURL: 'https://ota-gds.visionvivante.com:5090/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

baseApiClientgql.interceptors.request.use(
  async config => {
    const state = Store.getState();
    const authToken = state.auth.userToken;
    const contentToken = state.contentToken.universalToken;
    console.log('contentTOken', contentToken, 'authtoken', authToken);

    if (authToken) {
      config.headers['x-access-token'] = `${authToken}`;
    }

    if (contentToken) {
      config.headers['Content-Token'] = contentToken;
    }

    return config;
  },
  error => Promise.reject(error),
);

baseApiClientgql.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      Store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default baseApiClientgql;
