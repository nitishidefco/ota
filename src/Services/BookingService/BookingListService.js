import baseApiClient from '../baseApiClient';

export const getBookingList = ({page, limit, isAdmin}) => {
  const url = isAdmin
    ? `/admin/booking/booking-list?page=${page}&limit=${limit}`
    : `/booking/booking-list?isAdmin=${isAdmin}&page=${page}&limit=${limit}`;
  return baseApiClient.get(url);
};

export const cancelBooking = async ({bookingNo, provider}) => {
  try {
    const requestBody = {
      bookingNo: bookingNo,
      provider: provider,
    };
    console.log('requestBody in cancel booking', requestBody);
    const response = await baseApiClient.post(
      '/booking/cancel-booking',
      requestBody,
    );
    console.log('response in cancel booking', response);
    return response;
  } catch (error) {
    console.log('error in cancel booking', error);
    throw error;
  }
};
