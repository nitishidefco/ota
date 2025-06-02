import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import contentTokenReducer from './ContentTokenSlice';
import userProfileReducer from './UserProfileSlice';
import getCityDetailsReducer from './HotelReducer/GetCitySlice';
import hotelsReducer from './HotelReducer/GetHotelSlice';
import deviceLocationReducer from './LocationReducer';
import languageReducer from './LanguageSlice';
import hotelDetailReducer from './HotelReducer/GetHotelDetailSlice';
import roomsReducer from './HotelReducer/RoomsSlice';
import confirmPriceReducer from './HotelReducer/PriceConfirmSlice';
import currencyReducer from './CurrencyReducer';
import facilitiesReducer from './FacilitiesReducer';
import bookingReducer from './HotelReducer/BookHotelSlice';
import bookingListReducer from './BookingOverviewReducer/BookingListSlice';
import supportReducer from './SupportSlice';
import referralListReducer from './ReferralReducer/ReferralListSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  contentToken: contentTokenReducer,
  userProfile: userProfileReducer,
  getCity: getCityDetailsReducer,
  hotelSlice: hotelsReducer,
  deviceLocation: deviceLocationReducer,
  selectedLanguage: languageReducer,
  hotelDetail: hotelDetailReducer,
  rooms: roomsReducer,
  confirmPrice: confirmPriceReducer,
  currency: currencyReducer,
  facilities: facilitiesReducer,
  hotelBooking: bookingReducer,
  bookingList: bookingListReducer,
  support: supportReducer,
  referralList: referralListReducer,
});

export default rootReducer;
