import baseApiClient from './baseApiClient';
export const getUserProfile = () => baseApiClient.get('/profile');
