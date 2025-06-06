import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Images} from '../../Config';
import colors from '../../Config/AppStyling/colors';
import {Matrics, typography} from '../../Config/AppStyling';
import {useSelector} from 'react-redux';

const LoginOptionButton = ({
  title,
  handlePress,
  iconName,
  isActive,
  paddingHorizontal,
  width,
}) => {
  const globalLanguage = useSelector(
    state => state.selectedLanguage.globalLanguage,
  );
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        style={[
          isActive ? styles.buttonActive : styles.button,
          styles.commanButtonStyle,
          {
            paddingHorizontal:
              globalLanguage === 'ar' ? Matrics.s(0) : Matrics.s(38),
            width: width || Matrics.s(150),
          },
        ]}>
        <Image
          style={[
            styles.imageStyle,
            {height: iconName === 'PHONE' ? Matrics.s(23) : Matrics.s(25)},
            {width: iconName === 'PHONE' ? Matrics.s(23) : Matrics.s(25)},
          ]}
          source={Images[iconName]}
        />
        <Text
          style={[
            isActive ? styles.textActive : styles.text,
            styles.commanTextStyle,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commanButtonStyle: {
    borderRadius: Matrics.s(5), // Scales with width for a consistent rounded shape
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Matrics.vs(10), // Vertical scaling
    gap: Matrics.s(8), // Scales spacing between elements
  },
  buttonActive: {
    backgroundColor: colors.PRIMARY,
  },
  button: {
    backgroundColor: colors.WHITE,
    borderColor: colors.DARK_TEXT_COLOR,
    borderWidth: Matrics.s(1), // Ensure border width is responsive
  },
  commanTextStyle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs16, // Scales text size proportionally
  },
  textActive: {
    color: colors.lightTheme.fontColor,
  },
  text: {
    color: colors.DARK_TEXT_COLOR,
  },
  imageStyle: {
    width: Matrics.s(25),
    resizeMode: 'contain',
    height: Matrics.vs(25),
  },
});

export default LoginOptionButton;
