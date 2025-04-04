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
  error, // This is the error passed from the parent
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  showVisibilityIndicator = true,
  inputContainerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  // Use the error prop directly if provided; otherwise, fall back to internal validation
  const currentError = error || (touched ? error : '');

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
          inputContainerStyle,
        ]}>
        <TextInput
          style={[styles.input, inputStyle, {}]}
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
          onFocus={() => {
            setTouched(true);
            setIsFocused(true);
          }}
          onBlur={handleBlur}
        />

        {type === 'password' && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}>
            {showVisibilityIndicator ? (
              showPassword ? (
                <Eye size={20} color="#666" />
              ) : (
                <EyeOff size={20} color="#666" />
              )
            ) : null}
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
    // backgroundColor: 'blue',
    // height: Matrics.vs(20),
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
