import axios from 'axios';
const ContentTokenManager = axios.create({
  baseURL: 'https://otaapi.visionvivante.in/auth/domain',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getContentToken = () => {
  return ContentTokenManager.get('/ota.visionvivante.in');
};
