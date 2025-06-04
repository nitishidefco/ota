import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Vibration,
  Platform,
} from 'react-native';
import {Matrics, COLOR, typography} from '../../Config/AppStyling';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const OtpHandler = ({
  length = 4,
  onComplete,
  onOtpChange,
  hasError = false,
  disabled = false,
  clearOtp = false,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputsRef = useRef([]);

  // Create individual shared values for each input (up to 6 inputs)
  const scale0 = useSharedValue(1);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);
  const scale5 = useSharedValue(1);

  const borderColor0 = useSharedValue(0);
  const borderColor1 = useSharedValue(0);
  const borderColor2 = useSharedValue(0);
  const borderColor3 = useSharedValue(0);
  const borderColor4 = useSharedValue(0);
  const borderColor5 = useSharedValue(0);

  const backgroundColor0 = useSharedValue(0);
  const backgroundColor1 = useSharedValue(0);
  const backgroundColor2 = useSharedValue(0);
  const backgroundColor3 = useSharedValue(0);
  const backgroundColor4 = useSharedValue(0);
  const backgroundColor5 = useSharedValue(0);

  // Success animation
  const successScale = useSharedValue(1);

  // Animated styles for each input
  const animatedStyle0 = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColor0.value,
      [0, 1, 2, 3], // 0: Default, 1: Error (now Default), 2: Focused, 3: Filled
      ['#E5E5E5', '#E5E5E5', '#CCCCCC', COLOR.PRIMARY],
    );
    const backgroundColor = interpolateColor(
      backgroundColor0.value,
      [0, 1, 2, 3], // 0: Default, 1: Error (now Default), 2: Focused, 3: Filled
      ['#F8F9FA', '#F8F9FA', '#F5F5F5', COLOR.PRIMARY + '10'],
    );
    return {
      transform: [{scale: scale0.value}],
      borderColor,
      backgroundColor,
      borderWidth: 2,
    };
  });

  const animatedStyle1 = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColor1.value,
      [0, 1, 2, 3],
      ['#E5E5E5', '#E5E5E5', '#CCCCCC', COLOR.PRIMARY],
    );
    const backgroundColor = interpolateColor(
      backgroundColor1.value,
      [0, 1, 2, 3],
      ['#F8F9FA', '#F8F9FA', '#F5F5F5', COLOR.PRIMARY + '10'],
    );
    return {
      transform: [{scale: scale1.value}],
      borderColor,
      backgroundColor,
      borderWidth: 2,
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColor2.value,
      [0, 1, 2, 3],
      ['#E5E5E5', '#E5E5E5', '#CCCCCC', COLOR.PRIMARY],
    );
    const backgroundColor = interpolateColor(
      backgroundColor2.value,
      [0, 1, 2, 3],
      ['#F8F9FA', '#F8F9FA', '#F5F5F5', COLOR.PRIMARY + '10'],
    );
    return {
      transform: [{scale: scale2.value}],
      borderColor,
      backgroundColor,
      borderWidth: 2,
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColor3.value,
      [0, 1, 2, 3],
      ['#E5E5E5', '#E5E5E5', '#CCCCCC', COLOR.PRIMARY],
    );
    const backgroundColor = interpolateColor(
      backgroundColor3.value,
      [0, 1, 2, 3],
      ['#F8F9FA', '#F8F9FA', '#F5F5F5', COLOR.PRIMARY + '10'],
    );
    return {
      transform: [{scale: scale3.value}],
      borderColor,
      backgroundColor,
      borderWidth: 2,
    };
  });

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: successScale.value}],
  }));

  // Get the correct style for each index
  const getStyleForIndex = index => {
    const styles = [
      animatedStyle0,
      animatedStyle1,
      animatedStyle2,
      animatedStyle3,
    ];
    return styles[index] || animatedStyle0;
  };

  // Helper function to get the correct animated values for each index
  const getAnimatedValues = React.useCallback(
    index => {
      const scales = [scale0, scale1, scale2, scale3, scale4, scale5];
      const borderColors = [
        borderColor0,
        borderColor1,
        borderColor2,
        borderColor3,
        borderColor4,
        borderColor5,
      ];
      const backgroundColors = [
        backgroundColor0,
        backgroundColor1,
        backgroundColor2,
        backgroundColor3,
        backgroundColor4,
        backgroundColor5,
      ];

      return {
        scale: scales[index],
        borderColor: borderColors[index],
        backgroundColor: backgroundColors[index],
      };
    },
    [
      scale0,
      scale1,
      scale2,
      scale3,
      scale4,
      scale5,
      borderColor0,
      borderColor1,
      borderColor2,
      borderColor3,
      borderColor4,
      borderColor5,
      backgroundColor0,
      backgroundColor1,
      backgroundColor2,
      backgroundColor3,
      backgroundColor4,
      backgroundColor5,
    ],
  );

  useEffect(() => {
    // Auto focus first input on mount
    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 300);
  }, []);

  useEffect(() => {
    // Handle OTP clearing from parent component
    if (clearOtp && otp.some(digit => digit !== '')) {
      const clearedOtp = new Array(length).fill('');
      setOtp(clearedOtp);
      setFocusedIndex(0);
      // Focus first input after clearing
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [clearOtp, length, otp]);

  useEffect(() => {
    // Update border colors based on states
    for (let index = 0; index < length; index++) {
      const isFocused = focusedIndex === index;
      const isFilled = otp[index] !== '';
      const animValues = getAnimatedValues(index);

      if (hasError) {
        // If parent says there's an error, inputs are red
        animValues.borderColor.value = withTiming(1); // Error state
        animValues.backgroundColor.value = withTiming(1);
      } else if (isFilled) {
        animValues.borderColor.value = withTiming(3); // Filled state (Primary Color)
        animValues.backgroundColor.value = withTiming(3);
      } else if (isFocused) {
        animValues.borderColor.value = withTiming(2); // Focused state (Subtle Gray)
        animValues.backgroundColor.value = withTiming(2);
      } else {
        animValues.borderColor.value = withTiming(0); // Default state
        animValues.backgroundColor.value = withTiming(0);
      }
    }
  }, [focusedIndex, otp, hasError, length, getAnimatedValues]);

  const triggerHapticFeedback = () => {
    // Use built-in Vibration API for light haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    } else {
      Vibration.vibrate(50);
    }
  };

  const triggerSuccessAnimation = () => {
    // Success vibration
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 50, 50, 50]);
    } else {
      Vibration.vibrate([0, 100, 50, 100]);
    }

    // Success animation
    successScale.value = withSequence(
      withSpring(1.1, {damping: 8, stiffness: 200}),
      withSpring(1, {damping: 8, stiffness: 200}),
    );

    // Auto dismiss keyboard
    setTimeout(() => {
      Keyboard.dismiss();
    }, 100);
  };

  const handleChangeText = (text, index) => {
    if (disabled) return;

    // Handle paste scenario
    if (text.length > 1) {
      const pastedOtp = text.slice(0, length).split('');
      const newOtp = new Array(length).fill('');
      pastedOtp.forEach((digit, i) => {
        if (i < length && /^\d$/.test(digit)) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus last filled input or next empty
      const lastFilledIndex = newOtp.findLastIndex(digit => digit !== '');
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const targetIndex =
        nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex;

      if (targetIndex >= 0 && targetIndex < length) {
        setTimeout(() => {
          inputsRef.current[targetIndex]?.focus();
          setFocusedIndex(targetIndex);
        }, 50);
      }

      if (newOtp.every(digit => digit !== '')) {
        runOnJS(triggerSuccessAnimation)();
        onComplete && onComplete(newOtp.join(''));
      }

      onOtpChange && onOtpChange(newOtp.join(''));
      return;
    }

    // Regular single digit input
    if (text && !/^\d$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    runOnJS(triggerHapticFeedback)();

    // Scale animation for current input
    const animValues = getAnimatedValues(index);
    animValues.scale.value = withSequence(
      withSpring(1.1, {damping: 8, stiffness: 200}),
      withSpring(1, {damping: 8, stiffness: 200}),
    );

    // Move to next input if text is entered
    if (text && index < length - 1) {
      setTimeout(() => {
      inputsRef.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }, 50);
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      setTimeout(() => {
        runOnJS(triggerSuccessAnimation)();
      onComplete && onComplete(newOtp.join(''));
      }, 100);
    }

    onOtpChange && onOtpChange(newOtp.join(''));
  };

  const handleKeyPress = (e, index) => {
    if (disabled) return;

    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);

        setTimeout(() => {
      inputsRef.current[index - 1]?.focus();
          setFocusedIndex(index - 1);
        }, 50);

        onOtpChange && onOtpChange(newOtp.join(''));
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onOtpChange && onOtpChange(newOtp.join(''));
      }
    }
  };

  const handleFocus = index => {
    setFocusedIndex(index);

    // Scale animation on focus
    const animValues = getAnimatedValues(index);
    animValues.scale.value = withSpring(1.05, {
      damping: 8,
      stiffness: 200,
    });
  };

  const handleBlur = index => {
    const animValues = getAnimatedValues(index);
    animValues.scale.value = withSpring(1, {
      damping: 8,
      stiffness: 200,
    });
  };

  return (
    <Animated.View style={[styles.container, successAnimatedStyle]}>
      {otp.map((digit, index) => (
        <AnimatedTextInput
          key={index}
          ref={ref => (inputsRef.current[index] = ref)}
          style={[styles.input, getStyleForIndex(index)]}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          onBlur={() => handleBlur(index)}
          placeholder=""
          placeholderTextColor="#C7C7CC"
          autoFocus={index === 0}
          editable={!disabled}
          selectTextOnFocus={true}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Matrics.vs(20),
    marginBottom: Matrics.vs(10),
  },
  input: {
    width: Matrics.s(60),
    height: Matrics.s(60),
    textAlign: 'center',
    fontSize: typography.fontSizes.fs20,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    borderRadius: Matrics.s(12),
    marginHorizontal: Matrics.s(8),
    color: '#1A1A1A',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
});

export default OtpHandler;
