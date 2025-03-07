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
const ForgotPassword = () => {
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
                title="Forgot Password"
                showCreateAccountButton={false}
                showBackButton={true}
              />
              <View style={styles.inputContainer}>
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  type="email"
                  required
                />

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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  parentButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  buttonContainer: {
    width: Matrics.screenWidth * 0.38,
    borderTopLeftRadius: 170,
  },
  otpTitle: {
    marginHorizontal: Matrics.s(10),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  otpHandlerContainer: {
    justifyContent: 'flex-start',
  },
});

export default ForgotPassword;
