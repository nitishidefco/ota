import React, {useEffect} from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
import Splash from './splash';
import Login from './Screens/AuthScreens/Login';
import EnterOtp from './Screens/AuthScreens/EnterOtp';
import ForgotPassword from './Screens/AuthScreens/ForgotPassword';
import LoginWithEmail from './Screens/AuthScreens/LoginWithEmail';
import LoginWithPhone from './Screens/AuthScreens/LoginWithPhone';
import CreateAccount from './Screens/AuthScreens/CreateAccount';
import CheckEmail from './Screens/AuthScreens/CheckEmail';
import HotelsHome from './Screens/Hotels/HotelsHome';

const AuthRoutes = {
  Login,
  CheckEmail,
  CreateAccount,
  EnterOtp,
  ForgotPassword,
  LoginWithEmail,
  LoginWithPhone,
};

const MainRoutes = {
  HotelsHome,
};

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      {Object.keys(AuthRoutes).map(route => (
        <Stack.Screen
          key={route}
          name={route}
          component={AuthRoutes[route]}
          options={{headerShown: false}}
        />
      ))}
    </Stack.Navigator>
  );
};
const NavigationStack = () => {


  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

export default NavigationStack;
