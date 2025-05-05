import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const NormalHeader = ({
  title,
  onCrossPress,
  onCheckPress,
  showLeftButton = true,
  showRightButton = true,
  leftIconName = 'CROSS',
  rightIconName = 'CHECK',
}) => {
  return (
    <ImageBackground
      style={styles.headerBackground}
      source={Images.PROFILE_BACKGROUND}>
      {/* Left Button */}
      {showLeftButton ? (
        <TouchableOpacity onPress={onCrossPress} activeOpacity={0.7}>
          <Image
            source={leftIconName === 'CROSS' ? Images.CROSS : Images.BACK_ROUND}
            style={styles.headerOptions}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Right Button */}
      {showRightButton ? (
        <TouchableOpacity onPress={onCheckPress} activeOpacity={0.7}>
          {rightIconName === 'CHECK' ? (
            <Image source={Images.CHECK} style={styles.headerOptions} />
          ) : (
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                color: COLOR.WHITE,
                fontSize: typography.fontSizes.fs14,
              }}>
              {rightIconName}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </ImageBackground>
  );
};

export default NormalHeader;

const styles = StyleSheet.create({
  headerBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Matrics.s(15),
    height: Matrics.screenHeight * 0.08,
  },
  headerOptions: {
    width: Matrics.s(30),
    height: Matrics.vs(30),
    resizeMode: 'contain',
  },
  headerTitle: {
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs20,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  placeholder: {
    width: Matrics.s(30), // To maintain layout spacing when buttons are hidden
  },
});
