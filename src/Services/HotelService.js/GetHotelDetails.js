import hotelBaseApiClient from './HotelBaseApiClient';
import {Store} from '../../Redux/store';

export const getHotelDetails = async ({details}) => {
  const state = Store.getState();
  const authToken = state.auth.userToken;
  const contentToken = state.contentToken.universalToken;
  console.log('details in service', details);

  const config = {
    headers: {
      'x-access-token': authToken,
      'Content-Token': contentToken,
    },
  };

  try {
    const response = await hotelBaseApiClient.post(
      '/Hotel-Details',
      details,
      config,
    );
    console.log('response in service', response);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ API Error:', errorMessage);
    throw new Error(errorMessage);
  }
};
