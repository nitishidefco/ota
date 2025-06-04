import baseApiClient from '../baseApiClient';

export const getBookingList = ({page, limit, isAdmin}) => {
  const url = isAdmin
    ? `/admin/booking/booking-list?page=${page}&limit=${limit}`
    : `/booking/booking-list?isAdmin=${isAdmin}&page=${page}&limit=${limit}`;
  return baseApiClient.get(url);
};

export const cancelBooking = async ({bookingNo, gds}) => {
  try {
    const requestBody = {
      booking_no: bookingNo,
      Gds: gds,
    };

    const response = await baseApiClient.get(
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
