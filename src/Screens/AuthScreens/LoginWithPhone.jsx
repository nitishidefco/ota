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
import React, {useEffect, useState} from 'react';
import AuthScreenHeaders from '../../Components/UI/AuthScreenHeaders';
import CustomInput from '../../Components/UI/CustomInput';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {CountryPicker} from 'react-native-country-codes-picker';
import {loginUserWithPhone} from '../../Redux/Reducers/AuthSlice';
import {
  checkUniversalToken,
  getUniversalToken,
} from '../../Redux/Reducers/ContentTokenSlice';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../Components/Loader/CustomLoader';
import {useNavigation} from '@react-navigation/native';
import i18n from '../../i18n/i18n';

const LoginWithPhone = () => {
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
  });
  const AuthState = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state.contentToken.universalToken);

  // useEffect(() => {
  //   dispatch(getUniversalToken());
  // }, []);
  const validatePhone = value => {
    if (!value.trim()) {
      const error = i18n.t('validationMessages.noPhone');
      return error;
    }
    if (!/^\d{7,15}$/.test(value)) {
      const error = i18n.t('validationMessages.notValidPhone');
      return error;
    }
    return '';
  };
  const handlePhoneChange = value => {
    setPhone(value);
    setErrors(prev => ({...prev, phone: validatePhone(value)}));
  };
  const [countryCode, setCountryCode] = useState('+91');

  const validateForm = () => {
    console.log('validate form');

    const phoneError = validatePhone(phone);
    console.log(phoneError);

    setErrors({
      phone: phoneError,
    });
    return !phoneError;
  };

  const onLoginButtonPress = async () => {
    if (!validateForm()) {
      console.log('Validation failed');

      return;
    }
    console.log('Login button pressed');
    try {
      const loginDetails = {
        phoneNo: phone,
        countryCode: countryCode,
        type: 'user',
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
        loginUserWithPhone({details: loginDetails, contentToken: currentToken}),
      );
      if (response?.payload?.status === 200) {
        navigation.navigate('EnterOtp');
        Toast.show({
          type: 'success',
          text1: i18n.t('Toast.otpSentSuccess'),
        });
      } else if (response?.payload?.status === false) {
        Toast.show({
          type: 'error',
          text1: response?.payload?.error,
        });
      }
      console.log('response in login with phone account', response);
    } catch (error) {
      console.log('Error', 'login in account', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {AuthState?.isLoading && (
        <CustomLoader
          message={i18n.t('validationMessages.checkingCreditionals')}
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
              <AuthScreenHeaders
                title={i18n.t('LoginWithPhone.loginWithPhone')}
                showCreateAccountButton={false}
                showBackButton={true}
              />
              <View style={styles.inputContainer}>
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
                      label={i18n.t('LoginWithPhone.phone')}
                      value={phone}
                      onChangeText={handlePhoneChange}
                      placeholder={i18n.t('LoginWithPhone.phonePlaceholder')}
                      type="phone"
                      required
                      labelStyle={{right: Matrics.screenWidth * 0.2}}
                      error={errors.phone}
                    />
                  </View>
                </View>

                <View style={styles.parentButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      AuthState.isLoading && {opacity: 0.5},
                    ]}
                    onPress={() => onLoginButtonPress()}
                    disabled={AuthState?.isLoading}>
                    <Image
                      style={styles.bottomElipseButtonStlye}
                      source={Images.BOTTOM_ELIPSE_BUTTON}
                    />
                  </TouchableOpacity>
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
    height: Matrics.screenHeight * 0.25,
    resizeMode: 'contain',
  },
  buttonContainer: {
    borderTopLeftRadius: 170,
    marginRight: Matrics.s(-13),
    marginBottom: Matrics.vs(-6),
  },
  parentButtonContainer: {
    alignItems: 'flex-end',
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

export default LoginWithPhone;
