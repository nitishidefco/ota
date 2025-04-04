// TopContainer.js
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeft} from 'lucide-react-native';
import i18n from '../../i18n/i18n';

const AuthScreenHeaders = ({
  bannerImage = Images.BANNER,
  logo = Images.APP_LOGO,
  title = '',
  customStyles = {},
  showCreateAccountButton = true,
  showLoginButton = false,
  showBackButton = true,
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, customStyles.container]}>
      {showCreateAccountButton && ( // Conditionally render the button
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('CreateAccount')}
          activeOpacity={0.7}>
          <Text style={{color: COLOR.PRIMARY}}>{i18n.t('MainScreen.CA')}</Text>
          <Image
            style={styles.arrowRightSmall}
            source={Images.ARROW_RIGHT_SMALL}
          />
        </TouchableOpacity>
      )}
      {showLoginButton && ( // Conditionally render the button
        <TouchableOpacity
          style={[
            styles.createAccountButton,
            {
              width: Matrics.screenWidth * 0.25,
              // paddingHorizontal: Matrics.s(20),
            },
          ]}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.7}>
          <Text style={{color: COLOR.PRIMARY}}>Login</Text>
          <Image
            style={styles.arrowRightSmall}
            source={Images.ARROW_RIGHT_SMALL}
          />
        </TouchableOpacity>
      )}
      {showBackButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
          activeOpacity={0.7}>
          <ChevronLeft size={Matrics.s(35)} color={COLOR.PRIMARY} />
        </TouchableOpacity>
      )}
      <View style={styles.bannerImageContainer}>
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
    width: Matrics.screenWidth * 0.39,
    paddingVertical: Matrics.vs(4),
    gap: Matrics.s(4),
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(5),
    right: Matrics.screenWidth * 0.04,
    top: Matrics.vs(30),
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
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
    top: Matrics.screenHeight * 0.38,
  },
  appLogoContainer: {
    width: Matrics.screenWidth,
    // backgroundColor: 'red',
  },
  appLogo: {
    width: Matrics.screenWidth * 0.4,
    height: Matrics.screenWidth * 0.35,
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
    width: Matrics.screenWidth * 1.1,
    height: Matrics.screenHeight * 0.6,
    resizeMode: 'cover',
    transform: [{translateY: 0}, {translateX: -5}],
  },
  bannerImageContainer: {
    width: Matrics.screenWidth,
    height: Matrics.screenHeight * 0.4,
    overflow: 'hidden',
  },
  backButtonContainer: {
    width: Matrics.s(39),
    height: Matrics.s(38),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Matrics.s(60),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
    top: Matrics.vs(26),
    left: Matrics.s(10),
  },
});

export default AuthScreenHeaders;
