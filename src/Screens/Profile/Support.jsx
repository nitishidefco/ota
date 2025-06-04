import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import KeyboardAwareScrollViewBoilerplate from '../../Components/UI/KeyboardAwareScrollViewBoilerplate';
import NormalHeader from '../../Components/UI/NormalHeader';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import debounce from 'lodash.debounce';
import i18n from '../../i18n/i18n';
import DocumentPicker from 'react-native-document-picker';
import {errorToast, success} from '../../Helpers/ToastMessage';
import {sendSupportMessageThunk} from '../../Redux/Reducers/SupportSlice';
import {useDispatch} from 'react-redux';
const Support = ({}) => {
  const navigation = useNavigation();
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    attachment: null,
  });

  const debouncedValidate = useCallback((field, value, validateFn) => {
    const debouncedFn = debounce(() => {
      setErrors(prev => ({...prev, [field]: validateFn(value)}));
    }, 300);
    debouncedFn();
  }, []);
  const dispatch = useDispatch();
  const handleTextChange = (field, value, validateFn) => {
    setFormData(prev => ({...prev, [field]: value}));
    debouncedValidate(field, value, validateFn);
  };
  const validateText = (value, fieldName) => {
    if (!value.trim()) {
      return i18n.t(`validationMessages.no${fieldName}`);
    }
    if (fieldName === 'Name' && value.trim().length < 3) {
      return 'Name must be at least 3 characters long';
    }
    return '';
  };
  const validateEmail = value => {
    if (!value.trim()) {
      return i18n.t('validationMessages.noEmail');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return i18n.t('validationMessages.notValidEmail');
    }
    return '';
  };

  const validateDocument = value => {
    if (!value) {
      return 'Please upload a document';
    }
    return '';
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
      });

      console.log('Selected document:', result);

      // Store the file object with binary data structure for FormData
      const fileData = {
        uri: result.uri,
        type: result.type,
        name: result.name,
        size: result.size,
      };

      setFormData(prev => ({...prev, attachment: fileData}));
      setErrors(prev => ({...prev, attachment: ''}));
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Document pick error:', error);
      }
    }
  };

  const handleSubmit = async () => {
    // Trigger validation for all fields
    const nameError = validateText(formData.name, 'Name');
    const emailError = validateEmail(formData.email);
    const messageError = validateText(formData.description, 'Message');
    const documentError = validateDocument(formData.attachment);

    setErrors({
      name: nameError,
      email: emailError,
      message: messageError,
      document: documentError,
    });

    if (!nameError && !emailError && !messageError && !documentError) {
      console.log('inside submit');

      try {
        // Create FormData for binary file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('email', formData.email);
        submitData.append('description', formData.description);

        // Append the attachment as binary data
        if (formData.attachment) {
          submitData.append('attachment', {
            uri: formData.attachment.uri,
            type: formData.attachment.type,
            name: formData.attachment.name,
          });
        }

        // Handle form submission
        const response = await dispatch(
          sendSupportMessageThunk(submitData),
        ).unwrap();
        console.log('Response:', response);

        // Check if the response indicates success
        if (response && response.status === true) {
          // Show success toast
          success(
            'Support Request Sent',
            'Your support request has been submitted successfully',
          );

          // Reset the form
          setFormData({
            name: '',
            email: '',
            description: '',
            attachment: null,
          });

          // Clear any errors
          setErrors({
            name: '',
            email: '',
            message: '',
            document: '',
          });

          // Navigate back or close the screen
          navigation.goBack();
        } else {
          // Show error toast if status is not true
          errorToast(
            'Submission Failed',
            response?.message || 'Failed to submit support request',
          );
        }
      } catch (error) {
        console.error('Support submission error:', error);
        // Show error toast for any caught errors
        errorToast(
          'Submission Failed',
          error?.message || 'An error occurred while submitting your request',
        );
      }
    } else {
      errorToast('Please fill all required fields');
    }
  };

  return (
    <View style={{flex: 1, paddingTop: Platform.OS === 'android' ? '7%' : 0}}>
      <KeyboardAwareScrollViewBoilerplate
        headerComponent={
          <NormalHeader
            title={'Support'}
            onCrossPress={() => navigation.goBack()}
            showLeftButton={true}
            leftIconName="CROSS"
            rightIconName="CHECK"
            onCheckPress={handleSubmit}
            showRightButton={true}
          />
        }
        backgroundColor={COLOR.SMALL_CARD_BACKGROUND}>
        <Image source={Images.SUPPORT_AVATAR} style={styles.avatar} />
        <View style={{paddingHorizontal: Matrics.s(16)}}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Name {''}
              <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={value =>
                handleTextChange('name', value, validateText.bind(null, 'Name'))
              }
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Email {''}
              <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={value =>
                handleTextChange('email', value, validateEmail)
              }
              keyboardType="email-address"
              numberOfLines={1}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Document/Image Upload {''}
              <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: errors.document ? '#e74c3c' : COLOR.BORDER_COLOR,
                borderRadius: Matrics.s(10),
                paddingVertical: Matrics.vs(6),
                paddingHorizontal: Matrics.s(10),
                backgroundColor: COLOR.WHITE,
              }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: formData.attachment ? '#000' : '#999',
                  fontSize: Matrics.s(14),
                  flex: 1,
                  marginRight: Matrics.s(10),
                }}
                numberOfLines={1}>
                {formData.attachment
                  ? formData.attachment.name
                  : 'Upload Image/Document'}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: COLOR.PRIMARY,
                  paddingVertical: Matrics.vs(5),
                  paddingHorizontal: Matrics.s(10),
                  borderRadius: Matrics.s(5),
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: Matrics.s(5),
                }}
                onPress={handleFileUpload}>
                <Text
                  style={{
                    color: COLOR.WHITE,
                    fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    fontSize: Matrics.s(12),
                  }}>
                  Upload
                </Text>
                <Image
                  source={Images.UPLOAD_ICON}
                  style={{width: Matrics.s(20), height: Matrics.s(20)}}
                />
              </TouchableOpacity>
            </View>
            {errors.document ? (
              <Text style={styles.errorText}>{errors.document}</Text>
            ) : null}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Message {''}
              <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.message ? styles.inputError : null,
                {
                  height: 100,
                  maxHeight: 100,
                  textAlignVertical: 'top',
                },
              ]}
              placeholder="Enter your message"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={value =>
                handleTextChange(
                  'description',
                  value,
                  validateText.bind(null, 'Message'),
                )
              }
              numberOfLines={5}
              multiline={true}
            />
            {errors.message ? (
              <Text style={styles.errorText}>{errors.message}</Text>
            ) : null}
          </View>
        </View>
      </KeyboardAwareScrollViewBoilerplate>
    </View>
  );
};

export default Support;
const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLOR.WHITE,
    borderTopLeftRadius: Matrics.s(25),
    borderTopRightRadius: Matrics.s(25),
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.15)',
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_TEXT_COLOR,
  },
  avatar: {
    width: '50%',
    height: Matrics.s(260),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  errorText: {
    fontSize: Matrics.s(12),
    color: '#e74c3c',
    fontFamily: typography.fontFamily.Montserrat.Regular,
    marginTop: Matrics.vs(5),
  },
  inputError: {
    borderWidth: 1, // Add border for errors since no default border
    borderColor: '#e74c3c',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: Matrics.s(10), // Increased from 4px
    padding: Matrics.s(10),
    paddingVertical: Matrics.vs(8),
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.Regular,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
  },
  label: {
    fontSize: Matrics.s(14), // Reduced from 16px
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: '#000', // Black to match screenshot
    marginBottom: Matrics.vs(4), // Reduced from 5px
    textTransform: 'capitalize',
  },
  formGroup: {
    marginBottom: Matrics.vs(15), // Increased spacing between fields
  },
  requiredAsterisk: {
    color: '#e74c3c',
    marginLeft: Matrics.s(5),
  },
});
