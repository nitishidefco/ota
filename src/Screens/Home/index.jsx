import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Cars from './Cars';
import Flights from './Flights';
import Hotels from './Hotels';
import Tours from './Tours';
import {initializeLanguage} from '../../Redux/Reducers/LanguageSlice';
import {useDispatch, useSelector} from 'react-redux';
import HotelDetail from './HotelDetails/HotelDetail';
import HotelBooking from './HotelDetails/HotelBooking';

const Stack = createNativeStackNavigator();
const HotelStack = createNativeStackNavigator();

const HotelNavigator = () => {
  return (
    <HotelStack.Navigator screenOptions={{headerShown: false}}>
      <HotelStack.Screen name="HotelList" component={Hotels} />
      <HotelStack.Screen name="HotelDetail" component={HotelDetail} />
      <HotelStack.Screen name="HotelBooking" component={HotelBooking} />
    </HotelStack.Navigator>
  );
};
const HomeStack = () => {
  const globalLanguage = useSelector(
    state => state.selectedLanguage.globalLanguage,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [globalLanguage, dispatch]);
  console.log('Global language', globalLanguage);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Hotels" component={HotelNavigator} />
      <Stack.Screen name="Tours" component={Tours} />
      <Stack.Screen name="Cars" component={Cars} />
      <Stack.Screen name="Flights" component={Flights} />
    </Stack.Navigator>
  );
};

export default HomeStack;
