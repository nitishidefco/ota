import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Matrics} from '../../Config/AppStyling';
import CustomLoader from '../../Components/Loader/CustomLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import NormalHeader from '../../Components/UI/NormalHeader';
import {useNavigation} from '@react-navigation/native';
import CustomInput from '../../Components/UI/CustomInput';
import {changeUserPassword} from '../../Redux/Reducers/UserProfileSlice';
import {useDispatch, useSelector} from 'react-redux';
import {errorToast, success} from '../../Helpers/ToastMessage';

const ChangePassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const {isLoading, isSuccess, isFailure, errorMessage} = useSelector(
    state => state.userProfile,
  );

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const validateOldPassword = value => {
    if (!value) {
      const error = 'Old Password is required';
      return error;
    }
    if (value.length < 8) {
      const error = 'Password must be 8 digits';
      return error;
    }
    return '';
  };

  const validateNewPassword = value => {
    if (!value) {
      const error = 'New Password is required';
      return error;
    }
    if (value.length < 8) {
      const error = 'Password must be 8 digits';
      return error;
    }
    return '';
  };

  const validateConfirmPassword = value => {
    if (!value) {
      const error = 'Confirm Password is required';
      return error;
    }
    if (value !== newPassword) {
      const error = 'Password do not match';
      return error;
    }
  };

  const handleCurrentPasswordChange = value => {
    setCurrentPassword(value);
    setErrors(prev => ({...prev, currentPassword: validateOldPassword(value)}));
  };
  const handleNewPasswordChange = value => {
    setNewPassword(value);
    setErrors(prev => ({...prev, newPassword: validateNewPassword(value)}));
  };
  const handleConfirmPasswordChange = value => {
    setConfirmNewPassword(value);
    setErrors(prev => ({
      ...prev,
      confirmNewPassword: validateConfirmPassword(value),
    }));
  };

  const validatePassword = () => {
    const currentPasswordError = validateOldPassword(currentPassword);
    const newPasswordError = validateNewPassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmNewPassword);
    setErrors({
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmNewPassword: confirmPasswordError,
    });
    return !(currentPasswordError || newPasswordError || confirmPasswordError);
  };
  const onChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }
    const detailsForPasswordChange = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    try {
      const response = await dispatch(
        changeUserPassword({
          details: detailsForPasswordChange,
        }),
      );

      if (response?.error?.message === 'Rejected') {
        errorToast(response?.payload?.message);
        setConfirmNewPassword('');
        setNewPassword('');
        setCurrentPassword('');
      } else if (response?.payload?.message === 'SUCCESS') {
        success('Password Changed Successfully');
        setConfirmNewPassword('');
        setNewPassword('');
        setCurrentPassword('');
        navigation.goBack();
      }
      console.log('response', response);
    } catch (error) {
      console.log('Error in change password screen', error);
    }
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isLoading && (
        <Animated.View
          entering={FadeIn.duration(25)}
          exiting={FadeOut.duration(25)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            height: Matrics.screenHeight,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        />
      )}
      {isLoading && <CustomLoader isVisible={isLoading} />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={{flex: 1}}>
          <NormalHeader
            title="Change Password"
            onCrossPress={() => navigation.goBack()}
            onCheckPress={onChangePassword}
            showLeftButton={true}
            showRightButton={true}
            leftIconName="CROSS"
          />
          <View
            style={{
              marginHorizontal: Matrics.s(10),
              marginTop: Matrics.vs(10),
            }}>
            <CustomInput
              label={'Old Password'}
              value={currentPassword}
              onChangeText={handleCurrentPasswordChange}
              placeholder={'Enter Old Password'}
              type="password"
              error={errors.currentPassword}
            />
            <CustomInput
              label={'New Password'}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              placeholder={'Enter New Password'}
              type="password"
              error={errors.newPassword}
            />
            <CustomInput
              label={'Confirm New Password'}
              value={confirmNewPassword}
              onChangeText={handleConfirmPasswordChange}
              placeholder={'Confirm New Password'}
              type="password"
              error={errors.confirmNewPassword}
              showVisibilityIndicator={false}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ChangePassword;
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
