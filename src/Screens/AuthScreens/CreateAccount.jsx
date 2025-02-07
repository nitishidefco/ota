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
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import AuthScreenHeaders from '../../Components/UI/AuthScreenHeaders';
import CustomInput from '../../Components/UI/CustomInput';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {useDispatch, useSelector} from 'react-redux';
import {createUserAccount} from '../../Redux/Reducers/AuthSlice';
import {CountryPicker} from 'react-native-country-codes-picker';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import CustomLoader from '../../Components/Loader/CustomLoader';

const CreateAccount = () => {
  const [name, setName] = useState('Testing');
  const [countryCode, setCountryCode] = useState('+971');
  const [phone, setPhone] = useState('123456789');
  const [email, setEmail] = useState('t@yopmail.com');
  const [password, setPassword] = useState('12345678');
  const [confirmPassword, setConfirmPassword] = useState('12345678');
  const [referalCode, setReferalCode] = useState('');
  const [show, setShow] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const AuthState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Validation functions
  const validateName = value => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  };

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

  const validatePhone = value => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    if (!/^\d{7,15}$/.test(value)) {
      return 'Please enter a valid phone number';
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

  const validateConfirmPassword = value => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Handle input changes with validation
  const handleNameChange = value => {
    setName(value);
    setErrors(prev => ({...prev, name: validateName(value)}));
  };

  const handleEmailChange = value => {
    setEmail(value);
    setErrors(prev => ({...prev, email: validateEmail(value)}));
  };

  const handlePhoneChange = value => {
    setPhone(value);
    setErrors(prev => ({...prev, phone: validatePhone(value)}));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setErrors(prev => ({...prev, password: validatePassword(value)}));
  };

  const handleConfirmPasswordChange = value => {
    setConfirmPassword(value);
    setErrors(prev => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value),
    }));
  };

  const validateForm = () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !(
      nameError ||
      emailError ||
      phoneError ||
      passwordError ||
      confirmPasswordError
    );
  };

  const onCreateAccountPress = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userDetailsForCreateAccount = {
        name,
        email,
        phone_number: `${countryCode}${phone}`,
        password,
        referal_code: referalCode,
      };

      const response = await dispatch(
        createUserAccount({details: userDetailsForCreateAccount}),
      );
      if (response?.payload?.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Account Successfully Created',
          text2: 'Please check your email to see the activation details',
        });
        navigation.replace('Login');
      } else if (response?.payload?.status === false) {
        Toast.show({
          type: 'error',
          text1: response?.payload?.message,
        });
      }
      console.log('response in create account', response);
    } catch (error) {
      console.log('Error', 'creating account');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {AuthState?.isLoading && (
        <CustomLoader
          message="Checking your details..."
          isVisible={AuthState?.isLoading}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            scrollEnabled={AuthState.isLoading ? false : true}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <AuthScreenHeaders
                title="Create New Account"
                showCreateAccountButton={false}
                showLoginButton={true}
                showBackButton={false}
              />
              <View style={styles.inputContainer}>
                <CustomInput
                  label="Name"
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Enter your name"
                  type="text"
                  required
                  error={errors.name}
                />
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter your email"
                  type="email"
                  required
                  error={errors.email}
                />
                <View style={styles.phoneNumberContainer}>
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={styles.countryPicker}>
                    <Text style={styles.countryPickerTextStyle}>
                      {countryCode}
                    </Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <CustomInput
                      label="Phone"
                      value={phone}
                      onChangeText={handlePhoneChange}
                      placeholder="Enter your Phone Number"
                      type="phone"
                      required
                      error={errors.phone}
                      labelStyle={{right: Matrics.screenWidth * 0.2}}
                    />
                  </View>
                </View>
                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter your password"
                  type="password"
                  required
                  error={errors.password}
                />
                <CustomInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  type="password"
                  required
                  error={errors.confirmPassword}
                />
                <CustomInput
                  label="Referal Code"
                  value={referalCode}
                  onChangeText={setReferalCode}
                  placeholder="Enter Referall code"
                  type="text"
                />
                <View style={styles.lastContainer}>
                  <View style={styles.iconContainer}>
                    <View>
                      <Text style={styles.orTextStyle}>or</Text>
                    </View>
                    <View>
                      <Text style={styles.signInWith}>Sign up with</Text>
                    </View>
                    <View style={styles.socailLoginContainer}>
                      <View>
                        <Image
                          style={styles.socialIcons}
                          source={Images.GOOGLE}
                        />
                      </View>
                      <View>
                        <Image
                          style={styles.socialIcons}
                          source={Images.FACEBOOK}
                        />
                      </View>
                      <View>
                        <Image
                          style={styles.socialIcons}
                          source={Images.APPLE}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.parentButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonContainer,
                        AuthState.isLoading && {opacity: 0.5},
                      ]}
                      onPress={onCreateAccountPress}
                      disabled={AuthState.isLoading}>
                      <Image
                        style={styles.bottomElipseButtonStlye}
                        source={Images.BOTTOM_ELIPSE_BUTTON}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <CountryPicker
              show={show}
              pickerButtonOnPress={item => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
              searchMessage="Search For Country"
              onBackdropPress={() => setShow(false)}
              style={{
                modal: {
                  height: 500,
                },
                textInput: {
                  height: Matrics.vs(40),
                  borderRadius: Matrics.s(7),
                },
              }}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccount;
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
  iconContainer: {
    paddingLeft: Matrics.s(20),
  },
  buttonContainer: {
    width: Matrics.screenWidth * 0.38,
    borderTopLeftRadius: 170,
    marginRight: Matrics.s(15),
  },
  parentButtonContainer: {
    alignItems: 'flex-end',
    width: Matrics.screenWidth * 0.5,
  },
  socailLoginContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: Matrics.screenHeight * 0.02,
    width: Matrics.screenWidth * 0.5,
    justifyContent: 'flex-start',
    gap: Matrics.s(30),
    alignItems: 'center',
  },
  socialIcons: {
    width: Matrics.s(28),
    height: Matrics.vs(28),
    resizeMode: 'contain',
  },
  orTextStyle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    textAlign: 'left',
    fontSize: typography.fontSizes.fs16,
  },
  signInWith: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    textAlign: 'left',
    fontSize: typography.fontSizes.fs18,
  },
  lastContainer: {
    flexDirection: 'row',
    // height: Matrics.screenHeight * 0.3,
    justifyContent: 'center',
    marginTop: Matrics.screenHeight * 0.03,
  },
  countryPicker: {
    width: Matrics.screenWidth * 0.2,
    backgroundColor: '#F5F5F5',
    height: Matrics.vs(40),
    borderRadius: Matrics.s(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Matrics.vs(9),
    marginRight: Matrics.s(5),
  },
  countryPickerTextStyle: {
    color: COLOR.DIM_TEXT_COLOR,
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
});
