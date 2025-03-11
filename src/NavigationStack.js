import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import Splash from './splash';
import Login from './Screens/AuthScreens/Login';
import EnterOtp from './Screens/AuthScreens/EnterOtp';
import ForgotPassword from './Screens/AuthScreens/ForgotPassword';
import LoginWithEmail from './Screens/AuthScreens/LoginWithEmail';
import LoginWithPhone from './Screens/AuthScreens/LoginWithPhone';
import CreateAccount from './Screens/AuthScreens/CreateAccount';
import CheckEmail from './Screens/AuthScreens/CheckEmail';
import {
  checkUniversalToken,
  getUniversalToken,
} from './Redux/Reducers/ContentTokenSlice';
import {checkStoredToken} from './Redux/Reducers/AuthSlice';
import Booking from './Screens/Bookings/Booking';
import Referrals from './Screens/Referrals/Referrals';
import {Images} from './Config';
import {Image, Text, View} from 'react-native';
import {COLOR, Matrics, typography} from './Config/AppStyling';
import HomeStack from './Screens/Home';
import ProfileStack from './Screens/Profile';
import {getDeviceLocation} from './Redux/Reducers/LocationReducer';
import {initializeLanguage} from './Redux/Reducers/LanguageSlice';

// Define Stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Screens
const AuthRoutes = {
  Login,
  CheckEmail,
  CreateAccount,
  EnterOtp,
  ForgotPassword,
  LoginWithEmail,
  LoginWithPhone,
};

// Protected Screens
const MainRoutes = {
  Home: HomeStack,
  Booking,
  Referrals,
  Profile: ProfileStack,
};

const tabLabels = {
  Home: 'Home',
  Referrals: 'Referrals',
  Profile: 'Profile',
  Booking: 'My Bookings',
};
// Auth Stack (Login, Register, etc.)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    {Object.keys(AuthRoutes).map(route => (
      <Stack.Screen key={route} name={route} component={AuthRoutes[route]} />
    ))}
  </Stack.Navigator>
);

// Protected Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarLabel: '',
      tabBarStyle: {
        height: Matrics.vs(70),
        paddingBottom: Matrics.vs(10),
        paddingTop: Matrics.vs(8),
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        elevation: 8,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -1},
      },
      tabBarItemStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Matrics.vs(6),
      },
      tabBarIconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarIcon: ({focused}) => {
        let iconSource;

        // Customize icons based on route name
        switch (route.name) {
          case 'HotelsHome':
            iconSource = focused ? Images.HOUSE : Images.HOUSE_INACTIVE;
            break;
          case 'Profile':
            iconSource = focused
              ? Images.USER_PLACEHOLDER
              : Images.USER_PLACEHOLDER;
            break;
          case 'Booking':
            iconSource = focused
              ? Images.BOOKING_ACTIVE
              : Images.BOOKING_INACTIVE;
            break;
          case 'Referrals':
            iconSource = focused
              ? Images.REFERRAL_INACTIVE
              : Images.REFERRAL_INACTIVE;
            break;
          default:
            iconSource = Images.HOUSE_INACTIVE;
        }

        // Return the image component with custom label
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: Matrics.s(90),
            }}>
            <Image
              source={iconSource}
              style={{
                width: focused ? 26 : 24,
                height: focused ? 26 : 24,
                opacity: focused ? 1 : 0.8,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: typography.fontSizes.fs14,
                fontFamily: focused
                  ? typography.fontFamily.Montserrat.Medium
                  : typography.fontFamily.Montserrat.Regular,
                color: focused ? COLOR.PRIMARY : '#8e8e93',
                marginTop: Matrics.vs(4),
                opacity: focused ? 1 : 0.9,
              }}>
              {tabLabels[route.name]}
            </Text>
          </View>
        );
      },
    })}>
    {Object.keys(MainRoutes).map(route => (
      <Tab.Screen key={route} name={route} component={MainRoutes[route]} />
    ))}
  </Tab.Navigator>
);

// Main Navigation Stack
const NavigationStack = () => {
  const dispatch = useDispatch();
  const {userToken} = useSelector(state => state.auth);
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const splashDelay = new Promise(resolve => setTimeout(resolve, 5000));
      const {payload} = await dispatch(checkUniversalToken());
      await dispatch(checkStoredToken());
      if (!payload.token) {
        console.log('No token found, getting new token');
        await dispatch(getUniversalToken())
          .then(result => {
            console.log('Dispatch result:', result);
          })
          .catch(error => {
            console.error('Dispatch error:', error);
          });
      }

      dispatch(getDeviceLocation());
      dispatch(initializeLanguage());
      // Wait for both the token logic and the 5-second delay to complete
      await splashDelay;
      setSplashVisible(false);
    };

    initializeApp();
  }, []);

  if (isSplashVisible) {
    return <Splash />;
  }

  console.log('userToken', userToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!userToken ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;
