import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Referrals from './Referrals';
import React from 'react';
import Cashback from './Cashback';

const Stack = createNativeStackNavigator();

const ReferralStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Cashback" component={Cashback} />
      <Stack.Screen name="Referral" component={Referrals} />
    </Stack.Navigator>
  );
};

export default ReferralStack;
