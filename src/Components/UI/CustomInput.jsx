import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  type = 'default',
  error,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateInput = text => {
    if (!text && required) {
      return `${label} is required`;
    }

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          return 'Please enter a valid email';
        }
        break;

      case 'password':
        if (text && text.length < 8) {
          return 'Password must be at least 8 characters';
        }
        break;

      case 'phone':
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(text)) {
          return 'Please enter a valid phone number';
        }
        break;
    }
    return '';
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  const currentError = touched ? error || validateInput(value) : '';

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          currentError && styles.inputError,
        ]}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={
            type === 'email'
              ? 'email-address'
              : type === 'phone'
              ? 'phone-pad'
              : 'default'
          }
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />

        {type === 'password' && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color="#666" />
            ) : (
              <Eye size={20} color="#666" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {currentError && <Text style={styles.errorText}>{currentError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Matrics.vs(10),
  },
  label: {
    fontSize: typography.fontSizes.fs14,
    marginBottom: Matrics.vs(6),
    color: COLOR.DIM_TEXT_COLOR,
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  required: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: Matrics.s(7),
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: Matrics.vs(40),
    fontSize: 16,
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: '#333',
  },
  inputFocused: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
});

export default CustomInput;
