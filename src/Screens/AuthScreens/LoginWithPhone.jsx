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
import {CountryPicker} from 'react-native-country-codes-picker';
const LoginWithPhone = () => {
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);

  const [countryCode, setCountryCode] = useState('+971');
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
                title="Login with Phone Number"
                showCreateAccountButton={false}
                showBackButton={true}
              />
              <View style={styles.inputContainer}>
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
                    />
                  </View>
                </View>

                <View style={styles.parentButtonContainer}>
                  <TouchableOpacity style={styles.buttonContainer}>
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
    // right: Matrics.s(-10),
  },
  parentButtonContainer: {
    // position: 'absolute',
    height: Matrics.screenHeight * 0.3,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    bottom: 0,
    right: -1.3,
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
