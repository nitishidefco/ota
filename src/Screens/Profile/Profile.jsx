import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUserProfileData} from '../../Redux/Reducers/UserProfileSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import SimpleLoader from '../../Components/Loader/SimpleLoader';
import {Images} from '../../Config';
import {logout} from '../../Redux/Reducers/AuthSlice';
import {useNavigation} from '@react-navigation/native';

const Profile = () => {
  const userToken = useSelector(state => state.auth.userToken);
  const contentToken = useSelector(state => state.contentToken.universalToken);
  const {isLoading, isSuccess, isFailure, userProfileData, errorMessage} =
    useSelector(state => state.userProfile);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserProfileData({userToken, contentToken}));
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isLoading ? (
        <SimpleLoader />
      ) : (
        <ScrollView>
          <View>
            <ImageBackground
              source={Images.PROFILE_BACKGROUND}
              imageStyle={styles.backgroundImage}
              style={styles.upperContainer}>
              <View>
                {userProfileData?.profile_pic ? (
                  <Image
                    source={userProfileData?.profile_pic}
                    style={styles.userProfilePic}
                  />
                ) : (
                  <Image
                    source={Images.USER_PLACEHOLDER}
                    style={styles.userProfilePic}
                  />
                )}
              </View>
              <View>
                <Text style={styles.userName}>{userProfileData?.name}</Text>
              </View>
              <View style={styles.mainContainer}>
                <View style={styles.additionalUserInfoContainer}>
                  <Image
                    source={Images.EMAIL_WHITE}
                    style={styles.smallImages}
                  />
                  <Text style={styles.userDetails}>
                    {userProfileData?.email}
                  </Text>
                </View>
                <View style={styles.additionalUserInfoContainer}>
                  <Image
                    source={Images.PHONE_WHITE}
                    style={styles.smallImages}
                  />
                  <Text style={styles.userDetails}>
                    {userProfileData?.phone_number}
                  </Text>
                </View>
                <View style={styles.additionalUserInfoContainer}>
                  <Image
                    source={Images.CARD_WHITE}
                    style={styles.smallImages}
                  />
                  <Text style={styles.userDetails}>
                    {userProfileData?.my_referral_code}
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <View style={styles.menuOptionContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('EditProfile')}>
                <Image source={Images.EDIT_PROFILE} style={styles.menuIcon} />
                <Text style={styles.menuTitle}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ChangePassword')}>
                <Image source={Images.LOCK} style={styles.menuIcon} />
                <Text style={styles.menuTitle}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => dispatch(logout())}>
                <Image source={Images.LOGOUT} style={styles.menuIcon} />
                <Text style={styles.menuTitle}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  userProfilePic: {
    width: Matrics.screenWidth * 0.3,
    height: Matrics.vs(100),
  },
  upperContainer: {
    height: Matrics.screenHeight * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    borderBottomLeftRadius: Matrics.s(10),
    borderBottomRightRadius: Matrics.s(10),
  },
  userName: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs24,
    textAlign: 'center',
    marginTop: Matrics.vs(15),
  },
  smallImages: {
    width: Matrics.s(20),
    height: Matrics.s(20),
    resizeMode: 'contain',
  },
  additionalUserInfoContainer: {
    alignItems: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Matrics.vs(30),
  },
  userDetails: {
    color: COLOR.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs14,
    marginTop: Matrics.vs(5),
  },
  menuIcon: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: COLOR.BORDER_COLOR,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs18,
  },

  menuOptionContainer: {
    marginHorizontal: Matrics.s(20),
    marginVertical: Matrics.vs(10),
  },
});
