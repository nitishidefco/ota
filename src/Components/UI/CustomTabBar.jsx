import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { COLOR, Matrics, typography } from '../../Config/AppStyling';

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.homeTabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconSource = isFocused
          ? options.activeIcon
          : options.inactiveIcon;

        return (
          <View
            key={route.key}
            style={styles.homeTabs}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            onStartShouldSetResponder={() => true}
            onResponderRelease={onPress}>
            <Image style={styles.homeTabsImage} source={iconSource} />
            <Text style={styles.homeTabsTitle}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
};
export default CustomTabBar;
const styles = StyleSheet.create({
  homeHeaderTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs24,
  },
  homeHeaderSubtitle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs14,
    marginHorizontal: Matrics.s(8),
    width: Matrics.screenWidth * 0.5,
  },
  homeHeaderSecondaryOptions: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginTop: Matrics.vs(10),
  },
  homeHeaderUpperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Matrics.vs(5),
    marginHorizontal: Matrics.s(8),
  },
  secondaryOptionsImages: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  secondaryOptions: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: Matrics.s(12),
    paddingVertical: Matrics.vs(7),
    borderRadius: Matrics.s(10),
    borderColor: COLOR.DIM_TEXT_COLOR,
    borderWidth: 1,
  },
  headerImageStyle: {
    height: Matrics.screenHeight * 0.4,
  },
  homeTabs: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
    borderRadius: Matrics.s(10),
    paddingHorizontal: Matrics.s(10),
    paddingVertical: Matrics.vs(8),
  },
  homeTabsImage: {
    resizeMode: 'contain',
    width: Matrics.s(15),
    height: Matrics.vs(15),
  },
  homeTabsTitle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.WHITE,
  },
  homeTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Matrics.s(10),
    marginTop: Matrics.vs(40),
    marginBottom: Matrics.vs(30),
  },
  emptyFlatListText: {
    fontSize: typography.fontSizes.fs18,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  emptyFlatListImage: {
    width: Matrics.s(100),
    height: Matrics.s(100),
    resizeMode: 'contain',
  },
  emptyFlatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Matrics.screenHeight * 0.3,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: typography.fontSizes.fs18,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
});
