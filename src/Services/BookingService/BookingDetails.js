import baseApiClient from '../baseApiClient';

export const getBookingDetails = async ({bookingNo, provider, bookingId}) => {
  const url = `/booking/booking-details?booking_no=${bookingNo}&provider=${provider}&booking_Id=${bookingId}`;
  console.log('Generated URL:', url);
  console.log('Full URL with base:', baseApiClient.defaults.baseURL + url);
  try {
    const response = await baseApiClient.get(url);
    return response.data;
  } catch (error) {
    console.log('error in get booking details', error);
    throw error;
  }
};
