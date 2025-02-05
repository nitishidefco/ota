import React, {useState, useRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Matrics} from '../../Config/AppStyling';

const OtpHandler = ({length = 4, onComplete}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputsRef = useRef([]);

  // Handle OTP input change
  const handleChangeText = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete && onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputsRef.current[index] = ref)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          placeholder="-"
          placeholderTextColor={'#333'}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  input: {
    width: Matrics.s(70),
    height: Matrics.vs(40),
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    marginHorizontal: Matrics.s(5),
  },
});

export default OtpHandler;
