import axios from 'axios';
const AccountManager = axios.create({
  baseURL: 'https://ota.dev.visionvivante.com:9000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createAccount = ({details}) => {
  console.log('Create account details', details);
  return AccountManager.post('/auth/signup/669a0e9ba89ea4c142cb7db4', details);
};
