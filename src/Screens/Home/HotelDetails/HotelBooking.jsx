import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import {Images} from '../../../Config';
import {RoomContext} from '../../../Context/RoomContext';
import {useNavigation} from '@react-navigation/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView, TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import CustomInput from '../../../Components/UI/CustomInput';
import i18n from '../../../i18n/i18n';
import {countryPhoneLength} from '../../../Utils/countryPhoneLength';
import {CountryPicker} from 'react-native-country-codes-picker';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HotelBooking = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [countryCodeName, setCountryCodeName] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const {guests} = useContext(RoomContext);
  const [selectedGuestIndex, setSelectedGuestIndex] = useState(null);
  const [documentType, setDocumentType] = useState('Select');
  const [show, setShow] = useState(false);
  const [localHolderDetails, setLocalHolderDetails] = useState({});
  const bottomSheetModalRef = useRef(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const snapPoints = useCallback(() => ['30%', '80%'], []);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    documentNumber: '',
    documentType: '',
    address: '',
    city: '',
    countryName: '',
    postalCode: '',
    gender: '',
  });
  const validateForm = () => {
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const ageError = validateAge(age);
    const documentNumberError = validateDocumentNumber(documentNumber);
    const addressError = validateAddress(address);
    const cityError = validateCity(city);
    const countryNameError = validateCountryName(countryName);
    const postalCodeError = validatePostalCode(postalCode);
    const documentTypeError = validateDocumentType(documentType);
    const genderError = validateGender(gender);
    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      phone: phoneError,
      age: ageError,
      documentNumber: documentNumberError,
      documentType: documentTypeError,
      address: addressError,
      city: cityError,
      countryName: countryNameError,
      postalCode: postalCodeError,
      gender: genderError,
    });

    return !(
      firstNameError ||
      emailError ||
      phoneError ||
      lastNameError ||
      ageError ||
      documentNumberError ||
      documentTypeError ||
      addressError ||
      cityError ||
      countryNameError ||
      postalCodeError ||
      genderError
    );
  };
  const handlePresentModalPress = useCallback(index => {
    setSelectedGuestIndex(index);
    bottomSheetModalRef.current?.present();
  }, []);
  const navigation = useNavigation();
  const validateFirstName = value => {
    if (!value.trim()) {
      const error = i18n.t('validationMessages.noName');
      return error;
    }
    if (value.length < 2) {
      const error = i18n.t('validationMessages.shortName');
      return error;
    }
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      const error = i18n.t('validationMessages.invalidName');
      return error;
    }
    return '';
  };
  const validateLastName = value => {
    console.log('Inside last name validate');

    if (!value.trim()) {
      const error = i18n.t('validationMessages.noName');
      return error;
    }
    if (value.length < 2) {
      const error = i18n.t('validationMessages.shortName');
      return error;
    }
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      const error = i18n.t('validationMessages.invalidName');
      return error;
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
  const validateEmail = value => {
    if (!value.trim()) {
      const error = i18n.t('validationMessages.noEmail');
      return error;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      const error = i18n.t('validationMessages.notValidEmail');
      return error;
    }
    return '';
  };
  const validateAge = value => {
    if (!value) {
      const error = 'Age is required';
      return error;
    }
    //TODO: For holder age must be greateer than 18
    if (selectedGuestIndex === 0 && value < 18) {
      const error = 'Holder must be 18 years or older';
      return error;
    }
  };
  const validateDocumentNumber = (value, type) => {
    if (!value) {
      const error = 'Document Number is required';
      return error;
    }
    switch (documentType) {
      case 'driving_license':
        if (value.length < 6 || value.length > 16) {
          return 'Driving License number must be between 6 and 16 characters';
        }
        break;

      case 'passport':
        if (value.length < 6 || value.length > 9) {
          return 'Passport number must be between 6 and 9 characters';
        }
        break;

      default:
        return 'Invalid document type';
    }

    return null;
  };

  const validateAddress = value => {
    if (!value) {
      return 'Address is required';
    }
    if (value.length < 5 || value.length > 100) {
      return 'Address must be between 5 and 100 characters';
    }
    return null; // Valid
  };

  const validateCity = value => {
    if (!value) {
      return 'City is required';
    }
    if (!/^[a-zA-Z\s\-]+$/.test(value)) {
      return 'City name can only contain letters, spaces, and hyphens';
    }
    if (value.length < 2 || value.length > 50) {
      return 'City name must be between 2 and 50 characters';
    }
    return null; // Valid
  };

  const validateCountryName = value => {
    if (!value) {
      return 'Country name is required';
    }
    if (!/^[a-zA-Z\s-]+$/.test(value)) {
      return 'Country name can only contain letters, spaces, and hyphens';
    }
    if (value.length < 2 || value.length > 56) {
      return 'Country name must be between 2 and 56 characters';
    }
    return null;
  };
  const validateGender = value => {
    if (!value) {
      return 'Gender is required';
    }

    return null; // Valid
  };
  // !INFO Code is for countryCode
  const validatePostalCode = (value, code) => {
    if (!value) {
      return 'Postal code is required';
    }

    const postalCodePatterns = {
      US: /^\d{5}(-\d{4})?$/, // 12345 or 12345-6789
      CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, // A1A 1A1
      IN: /^\d{6}$/, // 110001
      UK: /^[A-Za-z\d]{2,4} ?\d[A-Za-z]{2}$/,
      AU: /^\d{4}$/,
    };

    if (countryCode && postalCodePatterns[countryCode]) {
      if (!postalCodePatterns[countryCode].test(value)) {
        return `Invalid postal code for ${countryCode}`;
      }
    } else {
      if (value.length < 3 || value.length > 12) {
        return 'Postal code must be between 3 and 12 characters';
      }
    }

    return null; // Valid
  };

  const validateDocumentType = value => {
    if (!value) {
      return 'Document type is required';
    }

    return null;
  };

  const handlePhoneChange = value => {
    setPhone(value);
    setErrors(prev => ({...prev, phone: validatePhone(value)}));
  };
  const handleFirstNameChange = value => {
    setFirstName(value);
    setErrors(prev => ({...prev, firstName: validateFirstName(value)}));
  };
  const handleLastNameChange = value => {
    setLastName(value);
    setErrors(prev => ({...prev, lastName: validateLastName(value)}));
  };
  const handleEmailChange = value => {
    setEmail(value);
    setErrors(prev => ({...prev, email: validateEmail(value)}));
  };
  const handleAgeChange = value => {
    setAge(value);
    setErrors(prev => ({...prev, age: validateAge(value)}));
  };
  const handleDocumentNumberChange = value => {
    setDocumentNumber(value);
    setErrors(prev => ({
      ...prev,
      documentNumber: validateDocumentNumber(value, documentType),
    }));
  };

  const handleAddressChange = value => {
    setAddress(value);
    setErrors(prev => ({...prev, address: validateAddress(value)}));
  };

  const handleCityChange = value => {
    setCity(value);
    setErrors(prev => ({...prev, city: validateCity(value)}));
  };

  const handleCountryNameChange = value => {
    setCountryName(value);
    setErrors(prev => ({...prev, countryName: validateCountryName(value)}));
  };

  const handlePostalCodeChange = value => {
    setPostalCode(value);
    setErrors(prev => ({
      ...prev,
      postalCode: validatePostalCode(value, countryCode),
    }));
  };

  const renderGenderItem = item => {
    return (
      <View
        style={{
          paddingHorizontal: Matrics.s(12),
          paddingVertical: Matrics.vs(6),
          borderRadius: Matrics.s(10),
        }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            color: COLOR.DARK_TEXT_COLOR,
          }}>
          {item.label}
        </Text>
      </View>
    );
  };
  const renderDocumentItem = item => {
    return (
      <View
        style={{
          paddingHorizontal: Matrics.s(15),
          paddingVertical: Matrics.vs(6),
          borderRadius: Matrics.s(10),
        }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            color: COLOR.DARK_TEXT_COLOR,
          }}>
          {item.label}
        </Text>
      </View>
    );
  };
  const handleSubmittingUserDetails = async () => {
    if (!validateForm()) {
      return;
    }
    if (selectedGuestIndex === 0) {
      try {
        const holderDetails = {
          Name: firstName,
          Surname: lastName,
          Age: age,
          Email: email,
          PhoneNumber: `${phone}`,
          DocumentType: documentType === 'Select' ? '' : documentType,
          DocumentNo: documentNumber,
          Address: address,
          City: city,
          PostalCode: postalCode,
          Country: countryName,
          Gender: gender,
        };
        await AsyncStorage.setItem(
          'holderDetails',
          JSON.stringify(holderDetails),
        );
        setFirstName('');
        setLastName('');
        setAddress('');
        setAge('');
        setPhone('');
        setGender('');
        setEmail('');
        setDocumentType('');
        setDocumentNumber('');
        setCity('');
        setCountryName('');
        setPostalCode('');
        retrieveHolderDetails();
        bottomSheetModalRef.current?.dismiss();

        setErrors({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '',
          documentNumber: '',
          documentType: '',
          address: '',
          city: '',
          countryName: '',
          postalCode: '',
          gender: '',
        });
      } catch (error) {
        console.log('Error', error);
      }
    }
  };

  const retrieveHolderDetails = async () => {
    try {
      const storedHolderDetails = await AsyncStorage.getItem('holderDetails');
      if (storedHolderDetails) {
        console.log('Setting holder details in local states');

        const parsedHolderDetails = JSON.parse(storedHolderDetails);
        if (selectedGuestIndex === 0) {
          setFirstName(parsedHolderDetails?.Name);
          setLastName(parsedHolderDetails?.Surname);
          setGender(parsedHolderDetails?.Gender);
          setAge(parsedHolderDetails?.Age);
          setPhone(parsedHolderDetails?.PhoneNumber);
          setEmail(parsedHolderDetails?.Email);
          setDocumentType(parsedHolderDetails?.DocumentType);
          setDocumentNumber(parsedHolderDetails?.DocumentNo);
          setAddress(parsedHolderDetails?.Address);
          setCity(parsedHolderDetails?.City);
          setCountryName(parsedHolderDetails?.Country);
          setPostalCode(parsedHolderDetails?.PostalCode);
          setLocalHolderDetails(JSON.parse(storedHolderDetails));
        }

        console.log(
          'Retrieved Holder Details:',
          JSON.parse(storedHolderDetails),
        );
      }
    } catch (error) {
      console.error('Error retrieving from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (bottomSheetVisible) {
      console.log('calling holder details');
      retrieveHolderDetails();
    }
  }, [bottomSheetVisible]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <NormalHeader
          rightIconName="Next"
          leftIconName="NOT_CROSS"
          title={'Fill Details'}
          onCrossPress={() => navigation.goBack()}
        />
        <View
          style={{
            marginHorizontal: Matrics.s(10),
            marginTop: Matrics.vs(10),
          }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.SemiBold,
              fontSize: typography.fontSizes.fs22,
            }}>
            Persons
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5}}>
            {Array.from({length: 2}, (_, index) => (
              <View
                key={index}
                style={{
                  paddingHorizontal: Matrics.s(15),
                  paddingVertical: Matrics.vs(15),
                  width: '49%',
                  backgroundColor: COLOR.WHITE,
                  borderRadius: Matrics.s(10),
                }}>
                <View style={{flexDirection: 'row', gap: 5}}>
                  <View>
                    <Image
                      source={Images.FILL_DETAIL_PERSON}
                      style={{
                        width: Matrics.s(20),
                        height: Matrics.vs(20),
                        resizeMode: 'contain',
                        marginTop: 5,
                      }}
                    />
                  </View>
                  <View style={{marginBottom: Matrics.vs(10)}}>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs18,
                        marginBottom: Matrics.vs(3),
                      }}>
                      {`Person ${index + 1}`}
                    </Text>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                        fontSize: typography.fontSizes.fs13,
                        color: COLOR.DARK_TEXT_COLOR,
                      }}>
                      *Adult should be above 18 years
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLOR.PRIMARY,
                      borderRadius: Matrics.s(10),
                      paddingHorizontal: Matrics.s(20),
                      paddingVertical: Matrics.vs(10),
                    }}
                    onPress={() => handlePresentModalPress(index)}
                    activeOpacity={0.7}>
                    <Text
                      style={{
                        color: COLOR.WHITE,
                        textAlign: 'center',
                        fontFamily: typography.fontFamily.Montserrat.SemiBold,
                      }}>
                      + Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
        {selectedGuestIndex === 0 ? (
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints()}
            onAnimate={() => setBottomSheetVisible(true)}
            onDismiss={() => {
              setErrors({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                age: '',
                documentNumber: '',
                documentType: '',
                address: '',
                city: '',
                countryName: '',
                postalCode: '',
                gender: '',
              });
              setFirstName('');
              setLastName('');
              setAddress('');
              setAge('');
              setPhone('');
              setGender('');
              setEmail('');
              setDocumentType('');
              setDocumentNumber('');
              setCity('');
              setCountryName('');
              setPostalCode('');
              setBottomSheetVisible(false);
            }}>
            <BottomSheetScrollView>
              <KeyboardAwareScrollView style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: Matrics.s(8),
                    alignItems: 'center',
                    marginBottom: Matrics.vs(10),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      bottomSheetModalRef?.current?.dismiss();
                      setErrors({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        age: '',
                        documentNumber: '',
                        documentType: '',
                        address: '',
                        city: '',
                        countryName: '',
                        postalCode: '',
                        gender: '',
                      });
                    }}>
                    <Image
                      source={Images.CROSS_BLACK}
                      style={{
                        width: Matrics.s(25),
                        height: Matrics.s(25),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.Montserrat.Bold,
                      fontSize: typography.fontSizes.fs22,
                      color: COLOR.PRIMARY,
                    }}>
                    Add Person {selectedGuestIndex + 1}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      handleSubmittingUserDetails();
                    }}>
                    <Image
                      source={Images.CHECK_BLACK}
                      style={{
                        width: Matrics.s(25),
                        height: Matrics.s(25),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: Matrics.s(15)}}>
                  <CustomInput
                    label={'First Name'}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    placeholder={'Enter your first name'}
                    value={firstName || localHolderDetails?.Name}
                    onChangeText={handleFirstNameChange}
                    type="text"
                    error={errors.firstName}
                  />
                  <CustomInput
                    label={'Last Name'}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    placeholder={'Enter your last name'}
                    value={lastName || localHolderDetails?.Surname}
                    onChangeText={handleLastNameChange}
                    type="text"
                    error={errors.lastName}
                  />
                  <View style={{marginBottom: Matrics.vs(10)}}>
                    <Text
                      style={{
                        fontSize: typography.fontSizes.fs14,
                        marginBottom: Matrics.vs(6),
                        color: COLOR.DIM_TEXT_COLOR,
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                      }}>
                      Gender
                    </Text>
                    <Dropdown
                      style={{
                        borderWidth: 1,
                        borderColor: COLOR.BORDER_COLOR,
                        borderRadius: Matrics.s(10),
                        paddingVertical: Matrics.s(10),
                        paddingHorizontal: Matrics.s(15),
                      }}
                      placeholderStyle={{
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                        color: '#A0A0A0',
                      }}
                      selectedTextStyle={{
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                        color: COLOR.DARK_TEXT_COLOR,
                      }}
                      data={[
                        {label: 'Male', value: 'male'},
                        {label: 'Female', value: 'female'},
                        {label: 'Transgender', value: 'transgender'},
                      ]}
                      renderItem={renderGenderItem}
                      placeholder="Select Gender"
                      value={gender || localHolderDetails?.Gender}
                      onChange={item => {
                        setGender(item.value);
                        setErrors(prev => ({
                          ...prev,
                          gender: validateGender(item.value),
                        }));
                      }}
                      labelField="label"
                      valueField="value"
                    />
                    {errors.gender && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 12,
                          marginTop: 4,
                          fontFamily: typography.fontFamily.Montserrat.Medium,
                          marginLeft: Matrics.s(5),
                        }}>
                        {errors.gender}
                      </Text>
                    )}
                  </View>
                  <CustomInput
                    label={'Age'}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    placeholder={'Enter your age'}
                    type="phone"
                    error={errors.age}
                    onChangeText={handleAgeChange}
                    value={age || localHolderDetails?.Age}
                  />
                  <View style={styles.phoneNumberContainer}>
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={[
                        styles.countryPicker,
                        {
                          marginTop: errors.phone
                            ? Matrics.vs(-5)
                            : Matrics.vs(14),
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
                        value={
                          phone || localHolderDetails?.PhoneNumber?.slice(3)
                        }
                        onChangeText={handlePhoneChange}
                        placeholder={i18n.t('CreateAccount.phonePlaceholder')}
                        type="phone"
                        error={errors.phone}
                        labelStyle={{right: Matrics.screenWidth * 0.21}}
                        containerStyle={styles.phoneNumberField}
                        inputContainerStyle={{
                          backgroundColor: COLOR.WHITE,
                          borderWidth: 1,
                          borderColor: COLOR.BORDER_COLOR,
                        }}
                      />
                    </View>
                  </View>
                  <CustomInput
                    label={i18n.t('CreateAccount.email')}
                    value={email || localHolderDetails?.Email}
                    onChangeText={handleEmailChange}
                    placeholder={i18n.t('CreateAccount.emailPlaceholder')}
                    type="email"
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    error={errors.email}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSizes.fs14,
                        marginBottom: Matrics.vs(6),
                        color: COLOR.DIM_TEXT_COLOR,
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                      }}>
                      Document
                    </Text>
                    <View style={{}}>
                      <Dropdown
                        style={{
                          borderWidth: 1,
                          // flex: 1,
                          borderColor: COLOR.BORDER_COLOR,
                          borderRadius: Matrics.s(10),
                          paddingVertical: Matrics.s(10),
                          paddingHorizontal: Matrics.s(10),
                          // width: Matrics.s(90),
                          marginBottom: Matrics.vs(8),
                        }}
                        placeholderStyle={{
                          fontFamily: typography.fontFamily.Montserrat.Regular,
                          color: '#A0A0A0',
                        }}
                        selectedTextStyle={{
                          fontFamily: typography.fontFamily.Montserrat.Regular,
                          color: COLOR.DARK_TEXT_COLOR,
                        }}
                        data={[
                          {label: 'Driving License', value: 'driving_license'},
                          {label: 'Passport', value: 'passport'},
                        ]}
                        renderItem={renderDocumentItem}
                        placeholder="Select"
                        value={documentType || localHolderDetails?.DocumentType}
                        onChange={item => {
                          setDocumentType(item.value);
                          setErrors(prev => ({
                            ...prev,
                            gender: validateGender(item.value),
                          }));
                        }}
                        labelField="label"
                        valueField="value"
                      />
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: COLOR.BORDER_COLOR,
                          borderRadius: Matrics.s(10),
                          fontSize: 16,
                          fontFamily: typography.fontFamily.Montserrat.Regular,
                          color: '#333',
                          paddingHorizontal: Matrics.s(15),
                          marginBottom: errors.documentNumber
                            ? 0
                            : Matrics.vs(10),
                        }}
                        placeholderTextColor={'#A0a0a0'}
                        placeholder="Enter document number"
                        onChangeText={handleDocumentNumberChange}
                        value={documentNumber || localHolderDetails?.DocumentNo}
                      />
                      {errors.documentNumber && (
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 12,
                            marginTop: 4,
                            fontFamily: typography.fontFamily.Montserrat.Medium,
                            marginLeft: Matrics.s(5),
                            marginBottom: Matrics.vs(10),
                          }}>
                          {errors.documentNumber}
                        </Text>
                      )}
                    </View>
                  </View>

                  <CustomInput
                    label={'Address'}
                    value={address || localHolderDetails?.Address}
                    onChangeText={handleAddressChange}
                    placeholder={'Enter your address'}
                    type="text"
                    error={errors.address}
                    containerStyle={{flex: 1}}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                  />
                  <CustomInput
                    label={'City'}
                    value={city || localHolderDetails?.City}
                    onChangeText={handleCityChange}
                    placeholder={'Enter your city'}
                    type="text"
                    error={errors.city}
                    containerStyle={{flex: 1}}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                  />
                  <View>
                    <CustomInput
                      label={'Country'}
                      value={countryName || localHolderDetails?.Country}
                      onChangeText={handleCountryNameChange}
                      placeholder={'Enter your country'}
                      type="text"
                      error={errors.countryName}
                      containerStyle={{flex: 1}}
                      inputContainerStyle={{
                        backgroundColor: COLOR.WHITE,
                        borderWidth: 1,
                        borderColor: COLOR.BORDER_COLOR,
                      }}
                    />
                    <CustomInput
                      label={'Postal Code'}
                      value={postalCode || localHolderDetails?.PostalCode}
                      onChangeText={handlePostalCodeChange}
                      placeholder={'Enter your Postal Code'}
                      type="phone"
                      error={errors.postalCode}
                      containerStyle={{flex: 1}}
                      inputContainerStyle={{
                        backgroundColor: COLOR.WHITE,
                        borderWidth: 1,
                        borderColor: COLOR.BORDER_COLOR,
                      }}
                    />
                  </View>
                </View>
                <CountryPicker
                  show={show}
                  pickerButtonOnPress={item => {
                    console.log('Selected country:', item);
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
              </KeyboardAwareScrollView>
            </BottomSheetScrollView>
          </BottomSheetModal>
        ) : (
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints()}>
            <BottomSheetScrollView>
              <KeyboardAwareScrollView style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: Matrics.s(8),
                    alignItems: 'center',
                    marginBottom: Matrics.vs(10),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => bottomSheetModalRef?.current?.dismiss()}>
                    <Image
                      source={Images.CROSS_BLACK}
                      style={{
                        width: Matrics.s(25),
                        height: Matrics.s(25),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.Montserrat.Bold,
                      fontSize: typography.fontSizes.fs22,
                      color: COLOR.PRIMARY,
                    }}>
                    Add Person {selectedGuestIndex + 1}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSubmittingUserDetails()}>
                    <Image
                      source={Images.CHECK_BLACK}
                      style={{
                        width: Matrics.s(25),
                        height: Matrics.s(25),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: Matrics.s(15)}}>
                  <CustomInput
                    label={'First Name'}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    placeholder={'Enter your first name'}
                    value={firstName}
                    onChangeText={handleFirstNameChange}
                    type="text"
                    error={errors.firstName}
                  />
                  <CustomInput
                    label={'Last Name'}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    placeholder={'Enter your last name'}
                    value={lastName}
                    onChangeText={handleLastNameChange}
                    type="text"
                    error={errors.lastName}
                  />
                  <View style={{marginBottom: Matrics.vs(10)}}>
                    <Text
                      style={{
                        fontSize: typography.fontSizes.fs14,
                        marginBottom: Matrics.vs(6),
                        color: COLOR.DIM_TEXT_COLOR,
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                      }}>
                      Gender
                    </Text>
                    <Dropdown
                      style={{
                        borderWidth: 1,
                        borderColor: COLOR.BORDER_COLOR,
                        borderRadius: Matrics.s(10),
                        paddingVertical: Matrics.s(10),
                        paddingHorizontal: Matrics.s(15),
                      }}
                      placeholderStyle={{
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                        color: '#A0A0A0',
                      }}
                      selectedTextStyle={{
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                        color: COLOR.DARK_TEXT_COLOR,
                      }}
                      data={[
                        {label: 'Male', value: 'male'},
                        {label: 'Female', value: 'female'},
                        {label: 'Transgender', value: 'transgender'},
                      ]}
                      renderItem={renderGenderItem}
                      placeholder="Select Gender"
                      value={gender}
                      onChange={item => {
                        setGender(item.value);
                        setErrors(prev => ({
                          ...prev,
                          gender: validateGender(item.value),
                        }));
                      }}
                      labelField="label"
                      valueField="value"
                    />
                    {errors.gender && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 12,
                          marginTop: 4,
                          fontFamily: typography.fontFamily.Montserrat.Medium,
                          marginLeft: Matrics.s(5),
                        }}>
                        {errors.gender}
                      </Text>
                    )}
                  </View>
                  <CustomInput
                    label={'Age'}
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    placeholder={'Enter your age'}
                    type="phone"
                    error={errors.age}
                    onChangeText={handleAgeChange}
                  />

                  <CustomInput
                    label={i18n.t('CreateAccount.email')}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder={i18n.t('CreateAccount.emailPlaceholder')}
                    type="email"
                    inputContainerStyle={{
                      backgroundColor: COLOR.WHITE,
                      borderWidth: 1,
                      borderColor: COLOR.BORDER_COLOR,
                    }}
                    error={errors.email}
                  />
                </View>
              </KeyboardAwareScrollView>
            </BottomSheetScrollView>
          </BottomSheetModal>
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default HotelBooking;
const styles = StyleSheet.create({
  phoneNumberContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  countryPicker: {
    width: Matrics.screenWidth * 0.2,
    backgroundColor: '#fff',
    height: Matrics.vs(40),
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
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
});
