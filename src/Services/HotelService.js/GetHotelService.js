import hotelBaseApiClient from './HotelBaseApiClient';
import {Store} from '../../Redux/store';

// const API_TIMEOUT = 15000;

export const getHotels = async ({details}) => {
  const state = Store.getState();
  const authToken = state.auth.userToken;
  const contentToken = state.contentToken.universalToken;
  console.log('details of get all hotels', details);

  const config = {
    headers: {
      'x-access-token': authToken,
      'Content-Token': contentToken,
    },
    // timeout: API_TIMEOUT,
  };

  try {
    const response = await hotelBaseApiClient.post('/hotels', details, config);
    console.log('response in get hotels', response.data);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ API Error:', errorMessage);
    throw new Error(errorMessage);
  }
};
