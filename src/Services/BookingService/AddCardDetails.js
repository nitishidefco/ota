import baseApiClient from '../baseApiClient';

export const AddCardDetails = async ({details}) => {
  console.log('details in add card details', details);
  const response = await baseApiClient.post('/payment/addCard', details);
  return response.data;
};
