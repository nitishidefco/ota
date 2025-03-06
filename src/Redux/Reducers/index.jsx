import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import contentTokenReducer from './ContentTokenSlice';
import userProfileReducer from './UserProfileSlice';
import getCityDetailsReducer from './HotelReducer/GetCitySlice';
import hotelsReducer from './HotelReducer/GetHotelSlice';
import deviceLocationReducer from './LocationReducer';
const rootReducer = combineReducers({
  auth: authReducer,
  contentToken: contentTokenReducer,
  userProfile: userProfileReducer,
  getCity: getCityDetailsReducer,
  hotelSlice: hotelsReducer,
  deviceLocation: deviceLocationReducer,
});

export default rootReducer;
