import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Booking from './Booking';
import React from 'react';
import BookingDetail from './BookingDetail';

const Stack = createNativeStackNavigator();
const BookingStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BookingHome" component={Booking} />
      <Stack.Screen name="BookingDetails" component={BookingDetail} />
    </Stack.Navigator>
  );
};

export default BookingStack;
