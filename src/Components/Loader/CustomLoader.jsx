// CustomLoader.js
import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const CustomLoader = ({
  isVisible = false,
  message = 'Loading...',
  color = COLOR.PRIMARY,
  size = 'large',
  containerStyle,
  textStyle,
}) => {
  if (!isVisible) return null;

  return (
    <View style={[styles.loaderStyle, containerStyle]}>
      <ActivityIndicator size={size} color={color} />
      <Text style={[styles.loaderTextStyle, textStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderStyle: {
    width: Matrics.screenWidth * 0.6,
    height: Matrics.vs(100),
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute',
    zIndex: 10,
    top: Matrics.screenHeight * 0.5,
    left: Matrics.screenWidth * 0.25,
  },
  loaderTextStyle: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.TITLE_COLOR,
    textAlign: 'center',
  },
});

export default CustomLoader;
