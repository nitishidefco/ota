import {View, Text} from 'react-native';
import React from 'react';
import LoginOptionButton from './Components/UI/LoginOptionButton';
import colors from './Config/AppStyling/colors';
import {Matrics, typography} from './Config/AppStyling';
import Splash from './splash';
import Login from './Screens/AuthScreens/Login';
import LoginWithEmail from './Screens/AuthScreens/LoginWithEmail';
import LoginWithPhone from './Screens/AuthScreens/LoginWithPhone';
import EnterOtp from './Screens/AuthScreens/EnterOtp';
import ForgotPassword from './Screens/AuthScreens/ForgotPassword';
import CheckEmail from './Screens/AuthScreens/CheckEmail';
import CreateAccount from './Screens/AuthScreens/CreateAccount';
import NavigationStack from './NavigationStack';
import Toast from 'react-native-toast-message';
const App = () => {
  return (
    <>
      <NavigationStack />
      <Toast />
    </>
  );
};

export default App;
