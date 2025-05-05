import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NormalHeader from '../../Components/UI/NormalHeader';
import CustomInput from '../../Components/UI/CustomInput';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {updateUserProfile} from '../../Redux/Reducers/UserProfileSlice';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import i18n from '../../i18n/i18n'; // Assuming i18n is available for translations
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {CountryPicker} from 'react-native-country-codes-picker';
import {countryPhoneLength} from '../../Utils/countryPhoneLength';
import {ConfirmationModalContext} from '../../Context/ConfirmationModalContext';
import ConfirmationModal from '../../Components/UI/ConfirmationModal';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userProfileData} = useSelector(state => state.userProfile);

  const initialProfile = {
    email: userProfileData?.email || '',
    phone: userProfileData?.phone_number?.toString() || '',
    city: userProfileData?.city || 'Delhi',
    state: userProfileData?.state || 'Delhi',
    zipCode: userProfileData?.zip_code || '335511',
    profilePic: userProfileData?.profile_pic || '',
    countryCode: userProfileData?.country_code || '',
    countryCodeName: userProfileData?.country_code_name || '',
  };
  // Individual state for each field
  const [email, setEmail] = useState(userProfileData?.email || '');
  const [phone, setPhone] = useState(
    userProfileData?.phone_number?.toString() || '',
  );
  const [city, setCity] = useState(userProfileData?.city || 'Delhi');
  const [state, setState] = useState(userProfileData?.state || 'Delhi');
  const [zipCode, setZipCode] = useState(userProfileData?.zip_code || '335511');
  const [profilePic, setProfilePic] = useState(userProfileData?.profile_pic);
  const [countryCode, setCountryCode] = useState(userProfileData?.country_code);
  const [countryCodeName, setCountryCodeName] = useState('');
  const [show, setShow] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const {showCancelModal, setShowCancelModal} = useContext(
    ConfirmationModalContext,
  );
  const bottomSheetModalRef = useRef(null);

  const updateHasChanges = (field, newValue) => {
    const initialValue = initialProfile[field];
    // Only update hasChanges if the new value differs from the initial value
    if (newValue !== initialValue) {
      setHasChanges(true);
    } else {
      // Recheck all fields to see if any still differ
      const currentProfile = {
        email,
        phone,
        city,
        state,
        zipCode,
        profilePic,
        countryCode,
        countryCodeName,
      };
      currentProfile[field] = newValue; // Update with the new value
      const noChanges = Object.keys(currentProfile).every(
        key => currentProfile[key] === initialProfile[key],
      );
      setHasChanges(!noChanges);
    }
  };

  // Validation functions inspired by LoginWithEmail
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

  const validatePhone = value => {
    if (!value.trim()) {
      return i18n.t('validationMessages.noPhone');
    }

    // Find the selected country from the list
    const country = countryPhoneLength.find(
      c => c.phone === countryCode.replace('+', ''),
    );
    setCountryCodeName(country.code);

    if (!country) {
      return i18n.t('validationMessages.validPhoneLength');
    }

    const phoneLength =
      country.phoneLength ||
      (country.min && country.max ? [country.min, country.max] : null);

    // Handle different phoneLength formats
    if (Array.isArray(phoneLength)) {
      if (!phoneLength.includes(value.length)) {
        return i18n
          .t('validationMessages.validPhoneLength')
          .replace('{length}', phoneLength.join(' or '));
      }
    } else if (typeof phoneLength === 'number') {
      if (value.length !== phoneLength) {
        return i18n
          .t('validationMessages.validPhoneLength')
          .replace('{length}', phoneLength);
      }
    } else if (country.min && country.max) {
      if (value.length < country.min || value.length > country.max) {
        return i18n
          .t('validationMessages.validPhoneLength')
          .replace('{length}', `${country.min}-${country.max}`);
      }
    }

    if (!/^\d+$/.test(value)) {
      return i18n.t('validationMessages.validPhoneLength');
    }
    return '';
  };

  const validateCity = value => {
    if (value && value.length < 2) {
      return i18n.t('validationMessages.shortCity');
    } // Optional field validation
    return '';
  };

  const validateState = value => {
    if (value && value.length < 2) {
      return i18n.t('validationMessages.shortState');
    } // Optional field validation
    return '';
  };

  const validateZipCode = value => {
    if (value && !/^\d{6}$/.test(value)) {
      return i18n.t('validationMessages.invalidZip');
    } // 5-digit ZIP
    return '';
  };

  // Handle input changes with validation
  const handleEmailChange = value => {
    setEmail(value);
    setErrors(prev => ({...prev, email: validateEmail(value)}));
    updateHasChanges('email', value);
  };

  const handlePhoneChange = value => {
    setPhone(value);
    setErrors(prev => ({...prev, phone: validatePhone(value)}));
    updateHasChanges('phone', value);
  };

  const handleCityChange = value => {
    setCity(value);
    setErrors(prev => ({...prev, city: validateCity(value)}));
    updateHasChanges('city', value);
  };

  const handleStateChange = value => {
    setState(value);
    setErrors(prev => ({...prev, state: validateState(value)}));
    updateHasChanges('state', value);
  };

  const handleZipCodeChange = value => {
    setZipCode(value);
    setErrors(prev => ({...prev, zipCode: validateZipCode(value)}));
    updateHasChanges('zipCode', value);
  };

  // Validate entire form before submission
  const validateForm = () => {
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const cityError = validateCity(city);
    const stateError = validateState(state);
    const zipCodeError = validateZipCode(zipCode);

    setErrors({
      email: emailError,
      phone: phoneError,
      city: cityError,
      state: stateError,
      zipCode: zipCodeError,
    });

    return !(
      emailError ||
      phoneError ||
      cityError ||
      stateError ||
      zipCodeError
    );
  };

  // Bottom Sheet Snap Points
  const snapPoints = useCallback(() => ['20%', '40%'], []);

  // Handle Modal Presentation
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleProfilePictureFromLibrary = () => {
    bottomSheetModalRef.current?.dismiss();
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && response.assets) {
        const newPic = response.assets[0].uri;
        setProfilePic(newPic);
        updateHasChanges('profilePic', newPic);
      }
    });
  };

  // Handle Image Selection from Camera
  const handleProfilePictureFromCamera = () => {
    bottomSheetModalRef.current?.dismiss();
    launchCamera({mediaType: 'photo', cameraType: 'back'}, response => {
      if (!response.didCancel && response.assets) {
        const newPic = response.assets[0].uri;
        setProfilePic(newPic);
        updateHasChanges('profilePic', newPic);
      }
    });
  };

  // Handle Profile Update
  const editProfile = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('phone_number', phone);
    formData.append('city', city || '');
    formData.append('state', state || '');
    formData.append('zip_code', zipCode || '');
    formData.append('country_code', countryCode || '');
    formData.append('country_code_name', countryCodeName || '');

    // Handle profile picture (if it’s a URI from image picker)
    if (profilePic && profilePic.startsWith('file://')) {
      formData.append('picture', {
        uri: profilePic,
        type: 'image/jpeg', // Adjust based on actual image type if needed
        name: 'profile_picture.jpg', // Arbitrary name
      });
    } else if (profilePic) {
      formData.append('picture', profilePic); // If it’s already a URL or null
    }
    dispatch(updateUserProfile({details: formData}))
      .then(() => {
        Alert.alert('Success', 'Profile updated successfully.');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      });
  };
  const handleCrossPress = () => {
    if (hasChanges) {
      setShowCancelModal(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {showCancelModal && (
        <ConfirmationModal
          title={'Are you sure you want to discard changes?'}
          handleYesPressed={() => {
            navigation.goBack();
            setShowCancelModal(false);
          }}
        />
      )}
      <BottomSheetModalProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView style={styles.containerMain}>
            <NormalHeader
              title={i18n.t('EditProfile.title')}
              onCrossPress={handleCrossPress}
              onCheckPress={editProfile}
              showLeftButton={true}
              showRightButton={hasChanges && true}
              leftIconName="CROSS"
            />
            {/* Profile Picture */}
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={handlePresentModalPress}
              activeOpacity={0.7}>
              <Image
                style={styles.image}
                source={
                  profilePic ? {uri: profilePic} : Images.USER_PLACEHOLDER
                }
              />
              <View style={styles.editIconContainer}>
                <Image
                  source={Images.EDIT_PROFILE_PICTURE}
                  style={styles.editIcon}
                />
              </View>
            </TouchableOpacity>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <CustomInput
                label={i18n.t('EditProfile.email')} // Add to i18n
                value={email}
                onChangeText={handleEmailChange}
                placeholder={i18n.t('EditProfile.emailPlaceholder')} // Add to i18n
                type="email"
                error={errors.email}
                required
              />
              <View style={styles.phoneNumberContainer}>
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={[
                    styles.countryPicker,
                    {
                      marginTop: errors.phone
                        ? Matrics.vs(-5)
                        : Matrics.vs(12.8),
                    },
                  ]}
                  activeOpacity={0.7}>
                  <Text style={styles.countryPickerTextStyle}>
                    {countryCode}
                  </Text>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                  <CustomInput
                    label={i18n.t('CreateAccount.phone')}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder={i18n.t('CreateAccount.phonePlaceholder')}
                    type="phone"
                    required
                    error={errors.phone}
                    labelStyle={{right: Matrics.screenWidth * 0.21}}
                    containerStyle={styles.phoneNumberField}
                    // inputStyle={{marginBottom: Matrics.s(3)}}
                  />
                </View>
              </View>
              <CustomInput
                label={i18n.t('EditProfile.city')} // Add to i18n
                value={city}
                onChangeText={handleCityChange}
                placeholder={i18n.t('EditProfile.cityPlaceholder')} // Add to i18n
                error={errors.city}
              />
              <CustomInput
                label={i18n.t('EditProfile.state')} // Add to i18n
                value={state}
                onChangeText={handleStateChange}
                placeholder={i18n.t('EditProfile.statePlaceholder')} // Add to i18n
                error={errors.state}
              />
              <CustomInput
                label={i18n.t('EditProfile.zipCode')} // Add to i18n
                value={zipCode}
                onChangeText={handleZipCodeChange}
                placeholder={i18n.t('EditProfile.zipCodePlaceholder')} // Add to i18n
                error={errors.zipCode}
              />
              <CountryPicker
                show={show}
                pickerButtonOnPress={item => {
                  setCountryCode(item.dial_code);
                  setShow(false);
                }}
                popularCountries={['en', 'ua', 'pl']}
                searchMessage={i18n.t('CreateAccount.searchMessage')}
                onBackdropPress={() => setShow(false)}
                enableModalAvoiding={true}
                androidWindowSoftInputMode="pan"
                style={{
                  modal: {
                    height: 350,
                  },
                  textInput: {
                    height: Matrics.vs(40),
                    borderRadius: Matrics.s(7),
                    fontFamily: typography.fontFamily.Montserrat.Regular,
                    paddingLeft: Matrics.s(10),
                  },
                  countryName: {
                    fontFamily: typography.fontFamily.Montserrat.Regular,
                  },
                  dialCode: {
                    fontFamily: typography.fontFamily.Montserrat.Regular,
                  },
                  countryButtonStyles: {
                    height: Matrics.vs(50),
                  },
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>

        {/* Bottom Sheet Modal */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints()}
          // onChange={handleSheetChanges}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}>
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>
              {i18n.t('EditProfile.updatePicture')}
            </Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleProfilePictureFromCamera}>
              <Text style={styles.optionText}>
                {i18n.t('EditProfile.takePhoto')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleProfilePictureFromLibrary}>
              <Text style={styles.optionText}>
                {i18n.t('EditProfile.chooseFromLibrary')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Text style={styles.cancelText}>
                {i18n.t('EditProfile.cancel')}
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Matrics.vs(20),
  },
  imageContainer: {
    alignSelf: 'center',
    marginVertical: Matrics.vs(20),
    position: 'relative',
  },
  image: {
    width: Matrics.s(130),
    height: Matrics.vs(130),
    borderRadius: Matrics.s(65),
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLOR.WHITE,
    width: Matrics.s(40),
    height: Matrics.vs(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Matrics.s(40),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  editIcon: {
    width: Matrics.s(30),
    height: Matrics.vs(30),
    resizeMode: 'contain',
  },
  inputContainer: {
    paddingHorizontal: Matrics.s(10), // Inspired by LoginWithEmail
    marginTop: Matrics.vs(20), // Adjusted for spacing
    flex: 1,
    gap: Matrics.vs(10), // Consistent spacing between inputs
  },
  bottomSheetBackground: {
    backgroundColor: COLOR.WHITE,
    borderTopLeftRadius: Matrics.s(25),
    borderTopRightRadius: Matrics.s(25),
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  handleIndicator: {
    backgroundColor: COLOR.PRIMARY,
    width: Matrics.s(50),
    height: Matrics.vs(5),
    borderRadius: Matrics.s(2.5),
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Matrics.vs(25),
    paddingHorizontal: Matrics.s(20),
    backgroundColor: COLOR.LIGHT_GRAY,
    borderTopLeftRadius: Matrics.s(25),
    borderTopRightRadius: Matrics.s(25),
  },
  bottomSheetTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs20,
    color: COLOR.PRIMARY,
    marginBottom: Matrics.vs(25),
    textTransform: 'uppercase',
  },
  optionButton: {
    width: '100%',
    paddingVertical: Matrics.vs(10),
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(10),
    marginVertical: Matrics.vs(8),
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 0},
    // shadowOpacity: 0.1,
    // shadowRadius: Matrics.s(10),
  },
  optionText: {
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.PRIMARY,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: Matrics.vs(10),
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(10),
    marginVertical: Matrics.vs(8),
    borderWidth: 1,
    borderColor: COLOR.RED,
  },
  cancelText: {
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.RED,
  },
  countryPicker: {
    width: Matrics.screenWidth * 0.2,
    backgroundColor: '#F5F5F5',
    height: Matrics.vs(40),
    borderRadius: Matrics.s(7),
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: Matrics.vs(15),
    marginRight: Matrics.s(5),
  },
  countryPickerTextStyle: {
    color: COLOR.DIM_TEXT_COLOR,
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
});
