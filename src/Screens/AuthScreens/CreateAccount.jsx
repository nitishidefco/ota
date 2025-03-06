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
} from 'react-native';
import React, {useState} from 'react';
import AuthScreenHeaders from '../../Components/UI/AuthScreenHeaders';
import CustomInput from '../../Components/UI/CustomInput';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {useDispatch, useSelector} from 'react-redux';
import {createUserAccount} from '../../Redux/Reducers/AuthSlice';
import {CountryPicker} from 'react-native-country-codes-picker';
import {useNavigation} from '@react-navigation/native';
import CustomLoader from '../../Components/Loader/CustomLoader';
import {checkUniversalToken} from '../../Redux/Reducers/ContentTokenSlice';
import {errorToast, success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referalCode, setReferalCode] = useState('');
  const [show, setShow] = useState(false);

  const token = useSelector(state => state.contentToken.universalToken);

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
      const error = i18n.t('validationMessages.noName');
      return error;
    }
    if (value.length < 2) {
      const error = i18n.t('validationMessages.shortName');
      return error;
    }
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      const error = i18n.t('validationMessages.invalidName');
      return error;
    }
    return '';
  };

  const validateEmail = value => {
    if (!value.trim()) {
      const error = i18n.t('validationMessages.noEmail');
      return error;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      const error = i18n.t('validationMessages.notValidEmail');
      return error;
    }
    return '';
  };

  const validatePhone = value => {
    if (!value.trim()) {
      const error = i18n.t('validationMessages.noPhone');
      return error;
    }
    if (!/^\d{10}$/.test(value)) {
      const error = i18n.t('validationMessages.validPhoneLength');
      return error;
    }
    return '';
  };

  const validatePassword = value => {
    if (!value) {
      const error = i18n.t('validationMessages.noPassword');
      return error;
    }
    if (value.length < 8) {
      const error = i18n.t('validationMessages.shortPassword');
      return error;
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
      const error = i18n.t('validationMessages.noConfirmPassword');
      return error;
    }
    if (value !== password) {
      const error = i18n.t('validationMessages.noMatch');
      return error;
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
      let currentToken = token;
      if (!currentToken) {
        const tokenResult = await dispatch(checkUniversalToken());
        if (checkUniversalToken.fulfilled.match(tokenResult)) {
          currentToken = tokenResult.payload.token;
        } else {
          // Handle case where token retrieval failed
          console.log('Unable to get authentication token');
          return;
        }
      }

      const response = await dispatch(
        createUserAccount({
          details: userDetailsForCreateAccount,
          contentToken: currentToken,
        }),
      );
      if (response?.payload?.status === true) {
        success(
          i18n.t('Toast.accountCreatedSuccess'),
          i18n.t('Toast.checkEmail'),
        );
        navigation.replace('Login');
      } else if (response?.payload?.status === false) {
        errorToast(response?.payload?.message);
      } else if (response?.error?.message === 'Rejected') {
        errorToast(response?.payload);
      }
    } catch (error) {
      console.log('Error', 'creating account');
    }
  };

  /* -------------------------------- Demo Data ------------------------------- */

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
                title={i18n.t('CreateAccount.createNewAccount')}
                showCreateAccountButton={false}
                showLoginButton={true}
                showBackButton={false}
              />
              <View style={styles.inputContainer}>
                <CustomInput
                  label={i18n.t('CreateAccount.name')}
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder={i18n.t('CreateAccount.namePlaceholder')}
                  type="text"
                  required
                  error={errors.name}
                />
                <CustomInput
                  label={i18n.t('CreateAccount.email')}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder={i18n.t('CreateAccount.emailPlaceholder')}
                  type="email"
                  required
                  error={errors.email}
                />
                <View style={styles.phoneNumberContainer}>
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={[
                      styles.countryPicker,
                      {
                        marginTop: errors.phone
                          ? Matrics.vs(-5)
                          : Matrics.vs(10.9),
                      },
                    ]}>
                    <Text style={styles.countryPickerTextStyle}>
                      {countryCode}
                    </Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <CustomInput
                      label={i18n.t('CreateAccount.phone')}
                      value={phone}
                      onChangeText={handlePhoneChange}
                      placeholder={i18n.t('CreateAccount.phonePlaceholder')}
                      type="phone"
                      required
                      error={errors.phone}
                      labelStyle={{right: Matrics.screenWidth * 0.2}}
                      containerStyle={styles.phoneNumberField}
                    />
                  </View>
                </View>
                <CustomInput
                  label={i18n.t('CreateAccount.password')}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder={i18n.t('CreateAccount.passwordPlaceholder')}
                  type="password"
                  required
                  error={errors.password}
                />
                <CustomInput
                  label={i18n.t('CreateAccount.confirmPassword')}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholder={i18n.t(
                    'CreateAccount.confirmPasswordPlaceholder',
                  )}
                  type="password"
                  required
                  error={errors.confirmPassword}
                />
                <CustomInput
                  label={i18n.t('CreateAccount.referalCode')}
                  value={referalCode}
                  onChangeText={setReferalCode}
                  placeholder={i18n.t('CreateAccount.referalCodePlaceholder')}
                  type="text"
                />
                <View style={styles.lastContainer}>
                  <View style={styles.iconContainer}>
                    <View>
                      <Text style={styles.orTextStyle}>
                        {i18n.t('CreateAccount.or')}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.signInWith}>
                        {i18n.t('CreateAccount.signUpWith')}
                      </Text>
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
              searchMessage={i18n.t('CreateAccount.searchMessage')}
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
    width: Matrics.screenWidth * 0.5,
    height: Matrics.screenHeight * 0.2,
    resizeMode: 'contain',
    //     position: 'absolute',
  },
  iconContainer: {
    paddingLeft: Matrics.s(20),
  },
  buttonContainer: {
    // width: Matrics.screenWidth * 0.38,
    borderTopLeftRadius: 170,
    marginRight: Matrics.s(-3),
  },
  parentButtonContainer: {
    // flexDirection: 'row',
    // width: Matrics.screenWidth * 0.5,
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
  phoneNumberField: {
    backgroundColor: 'white',
  },
});
