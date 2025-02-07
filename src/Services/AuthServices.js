import axios from 'axios';
const AccountManager = axios.create({
  baseURL: 'https://ota.dev.visionvivante.com:9000',
  headers: {
    'Content-Type': 'application/json',
  },
});
const vendorId = '669a0e9ba89ea4c142cb7db4';
export const createAccount = ({details}) => {
  console.log('Create account details', details);
  return AccountManager.post(`/auth/signup/${vendorId}`, details);
};

export const loginWithEmail = ({details}) => {
  return AccountManager.post(`/auth/login/${vendorId}`, details);
};
