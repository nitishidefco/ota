import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import NormalHeader from '../../Components/UI/NormalHeader';
import CustomInput from '../../Components/UI/CustomInput';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {updateUserProfile} from '../../Redux/Reducers/UserProfileSlice'; // Assume action exists
import {launchImageLibrary} from 'react-native-image-picker'; // For picking images
import {Images} from '../../Config';
import {COLOR, Matrics} from '../../Config/AppStyling';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userProfileData} = useSelector(state => state.userProfile);

  // Form State
  const [formData, setFormData] = useState({
    email: userProfileData?.email || '',
    phone: userProfileData?.phone_number?.toString() || '',
    city: userProfileData?.city || '',
    state: userProfileData?.state || '',
    zipCode: userProfileData?.zip_code || '',
  });

  const [profilePic, setProfilePic] = useState(userProfileData?.profile_pic);

  // Handle Input Change
  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  // Handle Image Selection
  const handleProfilePicture = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && response.assets) {
        setProfilePic(response.assets[0].uri);
      }
    });
  };

  // Handle Profile Update
  const editProfile = () => {
    if (!formData.email || !formData.phone) {
      Alert.alert('Validation Error', 'Email and Phone are required.');
      return;
    }

    dispatch(updateUserProfile({...formData, profilePic}))
      .then(() => {
        Alert.alert('Success', 'Profile updated successfully.');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <NormalHeader
            title="Edit Profile"
            onCrossPress={() => navigation.goBack()}
            onCheckPress={editProfile}
            showLeftButton={true}
            showRightButton={true}
            leftIconName="CROSS"
          />

          {/* Profile Picture */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleProfilePicture}>
            <Image
              style={styles.image}
              source={profilePic ? {uri: profilePic} : Images.USER_PLACEHOLDER}
            />
            <View style={styles.editIconContainer}>
              <Image
                source={Images.EDIT_PROFILE_PICTURE}
                style={styles.editIcon}
              />
            </View>
          </TouchableOpacity>

          {/* Input Fields */}
          <View style={styles.detailsContainer}>
            <CustomInput
              label="Email"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              type="email"
              required
            />
            <CustomInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={text => handleChange('phone', text)}
              type="phone"
              required
            />
            <CustomInput
              label="City"
              value={formData.city}
              onChangeText={text => handleChange('city', text)}
            />
            <CustomInput
              label="State"
              value={formData.state}
              onChangeText={text => handleChange('state', text)}
            />
            <CustomInput
              label="Zip Code"
              value={formData.zipCode}
              onChangeText={text => handleChange('zipCode', text)}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
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
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  editIcon: {
    width: Matrics.s(30),
    height: Matrics.vs(30),
    resizeMode: 'contain',
  },
  detailsContainer: {
    paddingHorizontal: Matrics.s(15),
  },
});
