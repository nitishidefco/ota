import axios from 'axios';
const ContentTokenManager = axios.create({
  baseURL: 'https://ota.dev.visionvivante.com:9000/auth/domain',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getContentToken = () => {
  return ContentTokenManager.get('/ota.visionvivante.com');
};
