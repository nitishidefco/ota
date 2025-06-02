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
import React, {useState, useEffect} from 'react';
import AuthScreenHeaders from '../../Components/UI/AuthScreenHeaders';
import {Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import OtpHandler from '../../Components/UI/OtpHandler';
import i18n from '../../i18n/i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {errorToast} from '../../Helpers/ToastMessage';

const EnterOtp = () => {
  const [resendTimer, setResendTimer] = useState(60); // Timer starts at 60 seconds
  const [canResend, setCanResend] = useState(false); // Tracks if resend is active
  const [otp, setOtp] = useState(''); // Tracks the OTP value
  const [otpError, setOtpError] = useState('');
  // Timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000); // Decrease every second
      return () => clearInterval(timer); // Cleanup on unmount or re-render
    } else {
      setCanResend(true); // Enable resend when timer reaches 0
    }
  }, [resendTimer]);

  // Handle resend OTP click
  const handleResendOtp = () => {
    if (canResend) {
      console.log('Resending OTP...');
      // Add your resend OTP logic here (e.g., API call to resend OTP)
      setResendTimer(60); // Reset timer to 60 seconds
      setCanResend(false); // Disable resend again
      setOtp(''); // Clear OTP field on resend
      setOtpError('');
    }
  };
  const validateOtp = value => {
    if (!value.trim()) {
      const error = 'OTP is required';
      return errorToast(error);
    }
    if (value.length < 4) {
      const error = 'OTP is incomplete';
      return errorToast(error);
    }
    return '';
  };

  const handleSubmitOtp = () => {
    const error = validateOtp(otp);
    setOtpError(error);
    if (!error) {
      console.log('Submitting OTP:', otp);
      // Add your OTP submission logic here (e.g., API call)
    }
  };

  const renderContent = () => (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
        <KeyboardAwareScrollView style={styles.keyboardAvoidingView}>
          <View style={styles.container}>
            <AuthScreenHeaders
              title={i18n.t('EnterOtp.LoginWithPhone')}
              showCreateAccountButton={false}
              showBackButton={true}
            />
            <View style={styles.inputContainer}>
              <View style={styles.otpHandlerContainer}>
                <Text style={styles.otpTitle}>{i18n.t('EnterOtp.otp')}</Text>
                <OtpHandler
                  length={4}
                  onComplete={otp => console.log('Entered OTP:', otp)}
                />
              </View>

              {/* Resend OTP Section */}
              <View style={styles.resendContainer}>
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={!canResend}
                  style={[
                    styles.resendButton,
                    !canResend && styles.resendButtonDisabled,
                  ]}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.resendText,
                      !canResend && styles.resendTextDisabled,
                    ]}>
                    {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.parentButtonContainer}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  activeOpacity={0.7}
                  onPress={handleSubmitOtp}>
                  <Image
                    style={styles.bottomElipseButtonStlye}
                    source={Images.BOTTOM_ELIPSE_BUTTON}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
  return Platform.OS === 'android' ? (
    <SafeAreaView style={styles.safeAreaView}>{renderContent()}</SafeAreaView>
  ) : (
    <View style={{flex: 1}}>{renderContent()}</View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    paddingHorizontal: Matrics.s(10),
    marginTop: Matrics.vs(165),
    flex: 1,
    justifyContent: 'space-between',
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
    marginTop: Matrics.vs(50),
  },
  buttonContainer: {
    width: Matrics.screenWidth * 0.438,
    borderTopLeftRadius: 170,
  },
  otpTitle: {
    marginHorizontal: Matrics.s(10),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  otpHandlerContainer: {
    justifyContent: 'flex-start',
  },
  bottomElipseButtonStlye: {
    width: Matrics.screenWidth * 0.5,
    height: Matrics.screenHeight * 0.2,
    resizeMode: 'contain',
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: Matrics.vs(20),
  },
  resendButton: {
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(20),
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: '#007AFF', // Blue color for active state
    textDecorationLine: 'underline',
  },
  resendTextDisabled: {
    color: '#A9A9A9', // Gray color for disabled state
  },
});

export default EnterOtp;
