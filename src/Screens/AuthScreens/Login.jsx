import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import LoginOptionButton from '../../Components/UI/LoginOptionButton';
import AuthScreenHeaders from '../../Components/UI/AuthScreenHeaders';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <AuthScreenHeaders title="Welcome to login" />

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <LoginOptionButton
              title={'Email'}
              isActive={true}
              iconName={'EMAIL'}
              handlePress={() => navigation.navigate('LoginWithEmail')}
            />
            <LoginOptionButton
              title={'Phone'}
              isActive={false}
              iconName={'PHONE'}
              handlePress={() => navigation.navigate('LoginWithPhone')}
            />
          </View>
          <View style={styles.lastContainer}>
            <View>
              <Text style={styles.orTextStyle}>or</Text>
            </View>
            <View>
              <Text style={styles.signInWith}>Sign in with</Text>
            </View>
            <View style={styles.socailLoginContainer}>
              <View>
                <Image style={styles.socialIcons} source={Images.GOOGLE} />
              </View>
              <View>
                <Image style={styles.socialIcons} source={Images.FACEBOOK} />
              </View>
              <View>
                <Image style={styles.socialIcons} source={Images.APPLE} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  halfCircle: {
    width: Matrics.screenWidth * 2.5,
    height: Matrics.screenWidth * 2.5,
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    bottom: -Matrics.screenWidth * 1.95,
    left: -Matrics.screenWidth * 0.76,
    borderRadius: Matrics.screenWidth * 1.5,
    //     zIndex: 2,
  },
  topContainer: {
    zIndex: 1,
  },
  headerBottomContainer: {
    position: 'absolute',
    top: Matrics.screenHeight * 0.47,
  },
  appLogoContainer: {
    width: Matrics.screenWidth,
  },
  appLogo: {
    width: Matrics.screenWidth * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  pageTitleText: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs22,
    color: COLOR.TITLE_COLOR,
    textAlign: 'center',
  },
  image: {
    width: Matrics.screenWidth,
    resizeMode: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Matrics.s(9),
    marginTop: Matrics.vs(25),
  },
  socailLoginContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: Matrics.screenHeight * 0.04,
    width: Matrics.screenWidth * 0.6,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  socialIcons: {
    width: Matrics.s(28),
    height: Matrics.vs(28),
    resizeMode: 'contain',
  },
  bottomContainer: {
    position: 'absolute',
    top: Matrics.screenHeight * 0.6,
    width: Matrics.screenWidth,
    height: Matrics.screenHeight * 0.5,
    alignItems: 'center',
    zIndex: 3,
  },
  orTextStyle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    textAlign: 'center',
    fontSize: typography.fontSizes.fs16,
  },
  signInWith: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    textAlign: 'center',
    fontSize: typography.fontSizes.fs18,
  },
  lastContainer: {
    flexDirection: 'column',
    height: Matrics.screenHeight * 0.11,
    justifyContent: 'space-around',
    marginTop: Matrics.screenHeight * 0.03,
  },
});

export default Login;
