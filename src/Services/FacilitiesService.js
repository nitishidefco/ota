import axios from 'axios';
import {Store} from '../Redux/store';

export const getFacilities = async () => {
  try {
    const state = Store.getState();
    const authToken = state.auth.userToken;
    const contentToken = state.contentToken.universalToken;

    const response = await axios.get(
      'https://gds.visionvivante.in/facilites',
      {
        headers: {
          'x-access-token': authToken,
          'content-token': contentToken,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};
