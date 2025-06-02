import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Profile from './Profile';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import Support from './Support';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="UserProfile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Support" component={Support} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
