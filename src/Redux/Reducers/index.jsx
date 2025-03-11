import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import contentTokenReducer from './ContentTokenSlice';
import userProfileReducer from './UserProfileSlice';
import getCityDetailsReducer from './HotelReducer/GetCitySlice';
import hotelsReducer from './HotelReducer/GetHotelSlice';
import deviceLocationReducer from './LocationReducer';
import languageReducer from './LanguageSlice';
import hotelDetailReducer from './HotelReducer/GetHotelDetailSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  contentToken: contentTokenReducer,
  userProfile: userProfileReducer,
  getCity: getCityDetailsReducer,
  hotelSlice: hotelsReducer,
  deviceLocation: deviceLocationReducer,
  selectedLanguage: languageReducer,
  hotelDetail: hotelDetailReducer,
});

export default rootReducer;
