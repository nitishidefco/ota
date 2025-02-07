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
import OtpHandler from '../../Components/UI/OtpHandler';
const CheckEmail = () => {
  const [email, setEmail] = useState('');
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
                title="Check Your Email"
                showCreateAccountButton={false}
                showBackButton={false}
              />
              <View style={styles.inputContainer}>
                <Text style={styles.detailText}>
                  We have sent you a password reset link to your email with
                  further instructions. Please check your mail to rest your
                  password.
                </Text>
                <TouchableOpacity style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Back to login</Text>
                </TouchableOpacity>
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
  inputContainer: {
    paddingHorizontal: Matrics.s(10),
    marginTop: Matrics.screenHeight * 0.2,
    flex: 1,
  },
  detailText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    textAlign: 'center',
    color: COLOR.DARK_TEXT_COLOR,
    fontSize: typography.fontSizes.fs15,
  },
  buttonTextStyle: {
    fontSize: typography.fontSizes.fs15,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    textAlign: 'center',
    color: COLOR.DARK_TEXT_COLOR,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  buttonStyle: {
    borderWidth: Matrics.s(1),
    borderColor: COLOR.DARK_TEXT_COLOR,
    borderRadius: Matrics.s(2),
    paddingVertical: Matrics.vs(7),
    marginTop: Matrics.vs(25),
  },
});

export default CheckEmail;
