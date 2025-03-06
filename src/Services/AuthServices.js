import baseApiClient from './baseApiClient';

export const createAccount = ({details, contentToken}) => {
  return baseApiClient.post('/auth/signup', details, {
    headers: {
      'content-token': contentToken,
    },
  });
};

export const loginWithEmail = ({details}) => {
  return baseApiClient.post('/auth/login', details, {});
};

export const loginWithPhone = ({details, contentToken}) => {
  return baseApiClient.post('/auth/send-otp', details, {
    headers: {
      'content-token': contentToken,
    },
  });
};
