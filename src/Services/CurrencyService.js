import baseApiClient from './baseApiClient';

// This provides both currency and language
export const getCurrency = () => {
  return baseApiClient.get('/agency/language-list');
};
