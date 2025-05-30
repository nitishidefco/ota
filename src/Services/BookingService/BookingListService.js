import baseApiClient from '../baseApiClient';

export const getBookingList = ({page, limit, isAdmin}) => {
  const url = isAdmin
    ? `/admin/booking/booking-list?page=${page}&limit=${limit}`
    : `/booking/booking-list?isAdmin=${isAdmin}&page=${page}&limit=${limit}`;
  return baseApiClient.get(url);
};

export const cancelBooking = async ({bookingNo, gds}) => {
  try {
    // Create URLSearchParams for proper query parameter handling
    const params = new URLSearchParams({
      booking_no: bookingNo,
      Gds: gds,
    });

    const url = `/booking/cancel-booking?${params.toString()}`;
    const completeURL = `${baseApiClient.defaults.baseURL}${url}`;

    console.log('Cancel booking endpoint:', url);
    console.log('Cancel booking complete URL:', completeURL);
    console.log('Cancel booking params:', {booking_no: bookingNo, Gds: gds});

    const response = await baseApiClient.get(url);
    console.log('response in cancel booking', response);
    return response;
  } catch (error) {
    console.log('error in cancel booking', error);
    throw error;
  }
};
