import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Cars from './Cars';
import Flights from './Flights';
import Hotels from './Hotels';
import Tours from './Tours';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Hotels" component={Hotels} />
      <Stack.Screen name="Tours" component={Tours} />
      <Stack.Screen name="Cars" component={Cars} />
      <Stack.Screen name="Flights" component={Flights} />
    </Stack.Navigator>
  );
};

export default HomeStack;
