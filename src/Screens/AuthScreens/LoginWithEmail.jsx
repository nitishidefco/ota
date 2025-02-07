import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
  Image,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import AuthScreenHeaders from '../../Components/UI/AuthScreenHeaders';
import CustomInput from '../../Components/UI/CustomInput';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {useNavigation} from '@react-navigation/native';
import {loginUserWithEmail} from '../../Redux/Reducers/AuthSlice';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../Components/Loader/CustomLoader';

const LoginWithEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('tp@yopmail.com');
  const [password, setPassword] = useState('12345678');
  const AuthState = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const validateEmail = value => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email';
    }
    return '';
  };
  const validatePassword = value => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    // if (
    //   !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
    //     value,
    //   )
    // ) {
    //   return 'Password must contain uppercase, lowercase, number and special character';
    // }
    return '';
  };
  const handleEmailChange = value => {
    setEmail(value);
    setErrors(prev => ({...prev, email: validateEmail(value)}));
  };
  const handlePasswordChange = value => {
    setPassword(value);
    setErrors(prev => ({...prev, password: validatePassword(value)}));
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !(emailError || passwordError);
  };

  const onLoginUserPress = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userDetailsForCreateAccount = {
        username: email,
        password,
        login_with_otp: false,
        type: 'user',
      };

      const response = await dispatch(
        loginUserWithEmail({details: userDetailsForCreateAccount}),
      );
      if (response?.payload?.status === true) {

        // navigation.replace('Login');
      } else if (response?.payload?.status === false) {
        Toast.show({
          type: 'error',
          text1: response?.payload?.message,
        });
      }
      console.log('response in login with email account', response);
    } catch (error) {
      console.log('Error', 'login in account', error);
    }
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {AuthState?.isLoading && (
        <CustomLoader
          message="Checking the credentials"
          isVisible={AuthState?.isLoading}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <AuthScreenHeaders title="Login with Email" />
              <View style={styles.inputContainer}>
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  type="password"
                  required
                />
                <Pressable
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.textStyle}>Forgot Password?</Text>
                </Pressable>
                <View style={styles.parentButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      AuthState.isLoading && {opacity: 0.5},
                    ]}
                    onPress={onLoginUserPress}
                    disabled={AuthState?.isLoading}>
                    <Image
                      style={styles.bottomElipseButtonStlye}
                      source={Images.BOTTOM_ELIPSE_BUTTON}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'green',
  },
  scrollViewContent: {
    flexGrow: 1,
    // Add padding to ensure content is visible above keyboard
    //     paddingBottom: Platform.OS === 'ios' ? 50 : Matrics.vs(50),
  },
  container: {
    flex: 1,
    //     paddingHorizontal: 16,
  },
  inputContainer: {
    paddingHorizontal: Matrics.s(10),
    marginTop: Matrics.screenHeight * 0.25,
    flex: 1,
  },
  textStyle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs15,
    color: COLOR.DIM_TEXT_COLOR,
    textDecorationLine: 'underline',
  },
  bottomElipseButtonStlye: {
    //     width: Matrics.screenWidth * 0.3,
    //     height: Matrics.screenHeight * 0.2,
    //     resizeMode: 'contain',
    //     position: 'absolute',
  },
  buttonContainer: {
    width: Matrics.screenWidth * 0.38,
    borderTopLeftRadius: 170,
    right: Matrics.s(-10),
  },
  parentButtonContainer: {
    alignItems: 'flex-end',
  },
});

export default LoginWithEmail;
