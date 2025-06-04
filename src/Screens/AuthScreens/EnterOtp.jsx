import {
  SafeAreaView,
  View,
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
import {Matrics, typography, COLOR} from '../../Config/AppStyling';
import {Images} from '../../Config';
import OtpHandler from '../../Components/UI/OtpHandler';
import i18n from '../../i18n/i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {errorToast, success} from '../../Helpers/ToastMessage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {sendOtpToBackendThunk} from '../../Redux/Reducers/AuthSlice';

const EnterOtp = () => {
  const {phone, countryCode} = useRoute().params;
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpComplete, setOtpComplete] = useState(false);
  const dispatch = useDispatch();
  const contentToken = useSelector(state => state.contentToken.universalToken);
  // Animation values
  const submitButtonScale = useSharedValue(1);
  const submitButtonOpacity = useSharedValue(0.7);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Animate submit button based on OTP completion
    if (otpComplete && otp.length === 4) {
      submitButtonOpacity.value = withTiming(1, {duration: 300});
      submitButtonScale.value = withSpring(1, {damping: 8, stiffness: 200});
    } else {
      submitButtonOpacity.value = withTiming(0.7, {duration: 300});
      submitButtonScale.value = withSpring(0.95, {damping: 8, stiffness: 200});
    }
  }, [otpComplete, otp, submitButtonOpacity, submitButtonScale]);

  const handleResendOtp = async () => {
    if (canResend && !isResending) {
      try {
        setIsResending(true);

        setResendTimer(60);
        setCanResend(false);
        setOtp('');
        setOtpError('');
        setOtpComplete(false);

        success('OTP has been resent to your phone');
      } catch (err) {
        errorToast('Failed to resend OTP. Please try again.');
      } finally {
        setIsResending(false);
      }
    }
  };

  const validateOtp = value => {
    if (!value.trim()) {
      return 'OTP is required';
    }
    if (value.length < 4) {
      return 'Please enter complete OTP';
    }
    if (!/^\d{4}$/.test(value)) {
      return 'OTP should contain only numbers';
    }
    return '';
  };

  const handleOtpChange = value => {
    setOtp(value);
    setOtpComplete(value.length === 4);

    if (otpError && value.length > 0) {
      setOtpError('');
    }
  };

  const handleOtpComplete = async value => {
    setOtp(value);
    setOtpComplete(true);

    // Auto-submit when OTP is complete
    setTimeout(() => {
      if (!isSubmitting) {
        handleSubmitOtp(value);
      }
    }, 300); // Reduced delay for faster auto-submit
  };

  const handleSubmitOtp = async (otpValue = otp) => {
    if (isSubmitting) return;

    const error = validateOtp(otpValue);
    if (error) {
      setOtpError(error);
      errorToast(error);
      return;
    }

    try {
      setIsSubmitting(true);
      setOtpError('');
      const details = {
        phone_number: Number(phone),
        otp: Number(otpValue),
        type: 'user',
        login_with_otp: true,
      };
      const response = await dispatch(
        sendOtpToBackendThunk({details, contentToken: contentToken}),
      );
      console.log('response', response);
      if (response?.error?.message === 'Rejected') {
        errorToast('Invalid OTP. Please try again.');
        setOtpError('Invalid OTP. Please try again.');
        setOtpComplete(false);
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      const errorMessage = err.message || 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
      errorToast(errorMessage);
      setOtpComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: submitButtonScale.value}],
    opacity: submitButtonOpacity.value,
  }));

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
              <View style={styles.otpSection}>
                <Text style={styles.otpTitle}>{i18n.t('EnterOtp.otp')}</Text>
                <Text style={styles.otpSubtitle}>
                  Enter the 4-digit code sent to your phone
                </Text>

                <OtpHandler
                  length={4}
                  onComplete={handleOtpComplete}
                  onOtpChange={handleOtpChange}
                  hasError={!!otpError}
                  disabled={isSubmitting}
                  clearOtp={otp === '' && !otpComplete}
                />

                {otpError ? (
                  <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(300)}
                    style={styles.errorContainer}>
                    <Text style={styles.errorText}>{otpError}</Text>
                  </Animated.View>
                ) : null}
              </View>

              <View style={styles.resendContainer}>
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={!canResend || isResending}
                  style={[
                    styles.resendButton,
                    (!canResend || isResending) && styles.resendButtonDisabled,
                  ]}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.resendText,
                      (!canResend || isResending) && styles.resendTextDisabled,
                    ]}>
                    {canResend && !isResending
                      ? 'Resend OTP'
                      : isResending
                      ? 'Sending...'
                      : `Resend OTP in ${resendTimer}s`}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.parentButtonContainer}>
                <Animated.View style={getSubmitButtonAnimatedStyle}>
                  <TouchableOpacity
                    style={[
                      styles.buttonContainer,
                      !otpComplete && styles.buttonDisabled,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleSubmitOtp()}
                    disabled={!otpComplete}>
                    <Image
                      style={styles.bottomElipseButtonStlye}
                      source={Images.BOTTOM_ELIPSE_BUTTON}
                    />
                  </TouchableOpacity>
                </Animated.View>
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
    paddingTop: Platform.OS === 'android' ? Matrics.vs(20) : 0,
  },
  otpSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Matrics.vs(20),
  },
  otpTitle: {
    marginHorizontal: Matrics.s(10),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs18,
    color: COLOR.PRIMARY_TEXT_COLOR,
    marginBottom: Matrics.vs(8),
  },
  otpSubtitle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.DIM_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: Matrics.vs(20),
    lineHeight: 20,
  },
  errorContainer: {
    marginTop: Matrics.vs(10),
    paddingHorizontal: Matrics.s(20),
  },
  errorText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  parentButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: Matrics.vs(30),
  },
  buttonContainer: {
    width: Matrics.screenWidth * 0.438,
    borderTopLeftRadius: 170,
    position: 'relative',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  bottomElipseButtonStlye: {
    width: Matrics.screenWidth * 0.5,
    height: Matrics.screenHeight * 0.2,
    resizeMode: 'contain',
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: Matrics.vs(30),
  },
  resendButton: {
    paddingVertical: Matrics.vs(12),
    paddingHorizontal: Matrics.s(24),
    borderRadius: Matrics.s(25),
    backgroundColor: '#F0F8FF',
  },
  resendButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  resendText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs16,
    color: '#007AFF',
  },
  resendTextDisabled: {
    color: '#A9A9A9',
  },
});

export default EnterOtp;
