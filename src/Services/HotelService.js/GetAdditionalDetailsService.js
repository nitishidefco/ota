import hotelBaseApiClient from './HotelBaseApiClient';
import {Store} from '../../Redux/store';

export const getAdditionalDetails = async ({details}) => {
  const state = Store.getState();
  const authToken = state.auth.userToken;
  const contentToken = state.contentToken.universalToken;

  const config = {
    headers: {
      'x-access-token': authToken,
      'Content-Token': contentToken,
    },
  };

  try {
    const response = await hotelBaseApiClient.post(
      '/additional-Details',
      details,
      config,
    );
    console.log('response in additional details service', response);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ API Error:', errorMessage);
    throw new Error(errorMessage);
  }
};
