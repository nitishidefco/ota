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
import { useDispatch, useSelector } from 'react-redux';
import { createUserAccount } from '../../Redux/Reducers/AuthSlice';
import { CountryPicker } from 'react-native-country-codes-picker';
const CreateAccount = () => {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword]=useState('')
  const [referalCode, setReferalCode] = useState('');
  const [show, setShow] = useState(false);
  const userDetailsForCreateAccount = {
    name,
    email,
    phone_number: `${countryCode}${phone}`,
    password,
    referal_code: referalCode,
  };

  const AuthState = useSelector(state => state.auth);
  const dispatch = useDispatch()
  const onCreateAccountPress = async () => {
    try {
      
     const response = await  dispatch(createUserAccount({details: userDetailsForCreateAccount}))
console.log('response in create account',response?.payload?.message);

    } catch (error) {
      console.log('Error', 'creating account');
      
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
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
                title="Create New Account"
                showCreateAccountButton={false}
                showLoginButton={true}
              />
              <View style={styles.inputContainer}>
                <CustomInput
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  type="text"
                  required
                />
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  type="email"
                  required
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
                      onChangeText={setPhone}
                      placeholder="Enter your Phone Number"
                      type="phone"
                      required
                      labelStyle={{ right: Matrics.screenWidth * 0.2  }}
                    />
                  </View>
                  </View>
                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  type="password"
                  required
                />
                <CustomInput
                  label="Confirm Password"
                  value={password}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  type="password"
                  required
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
                    <TouchableOpacity style={[styles.buttonContainer, AuthState.isLoading && { opacity: 0.5 }]} onPress={onCreateAccountPress}
                    disabled={AuthState.isLoading}
                    >
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

export default CreateAccount;
