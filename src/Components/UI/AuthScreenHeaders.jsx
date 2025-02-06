// TopContainer.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Images } from '../../Config';
import { COLOR, Matrics, typography } from '../../Config/AppStyling';
import { useNavigation } from '@react-navigation/native';

const AuthScreenHeaders = ({
  bannerImage = Images.BANNER,
  logo = Images.APP_LOGO,
  title = '',
  customStyles = {},
  showCreateAccountButton = true,
  showLoginButton = false
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, customStyles.container]}>
      {showCreateAccountButton && ( // Conditionally render the button
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.replace('CreateAccount')}>
          <Text style={{ color: COLOR.PRIMARY }}>Create Account</Text>
          <Image
            style={styles.arrowRightSmall}
            source={Images.ARROW_RIGHT_SMALL}
          />
        </TouchableOpacity>
      )}
      {showLoginButton && ( // Conditionally render the button
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.replace('Login')}>
          <Text style={{ color: COLOR.PRIMARY }}>Login</Text>
          <Image
            style={styles.arrowRightSmall}
            source={Images.ARROW_RIGHT_SMALL}
          />
        </TouchableOpacity>
      )}
      <View>
        <Image
          style={[styles.bannerImage, customStyles.bannerImage]}
          source={bannerImage}
        />
      </View>
      <View style={[styles.halfCircle, customStyles.halfCircle]}></View>
      <View
        style={[
          styles.headerBottomContainer,
          customStyles.headerBottomContainer,
        ]}>
        <View style={styles.appLogoContainer}>
          <Image source={logo} style={[styles.appLogo, customStyles.appLogo]} />
        </View>
        {title && (
          <View>
            <Text style={[styles.pageTitleText, customStyles.pageTitleText]}>
              {title}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //     zIndex: 1,
  },
  createAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Matrics.screenWidth * 0.35,
    paddingVertical: Matrics.vs(4),
    gap: Matrics.s(4),
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(3),
    right: Matrics.screenWidth * 0.04,
    top: Matrics.vs(12),
  },
  arrowRightSmall: {
    width: Matrics.s(17),
    height: Matrics.s(17),
  },
  halfCircle: {
    width: Matrics.screenWidth * 2.5,
    height: Matrics.screenWidth * 2.5,
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    bottom: -Matrics.screenWidth * 2.4,
    left: -Matrics.screenWidth * 0.76,
    borderRadius: Matrics.screenWidth * 1.5,
  },
  headerBottomContainer: {
    position: 'absolute',
    top: Matrics.screenHeight * 0.4,
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
  bannerImage: {
    width: Matrics.screenWidth,
    height: Matrics.screenHeight * 0.4,
    resizeMode: 'cover',
  },
});

export default AuthScreenHeaders;
