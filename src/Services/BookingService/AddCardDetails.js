import baseApiClient from '../baseApiClient';

export const AddCardDetails = async ({details}) => {
  console.log('details in add card details', details);
  const response = await baseApiClient.post('/payment/addCard', details);
  console.log('Full axios response in AddCardDetails:', response);
  console.log('response.data in AddCardDetails:', response.data);
  console.log('typeof response.data:', typeof response.data);
  return response.data;
};
