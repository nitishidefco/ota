import {Text, StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {amenityIcons, defaultIcon} from '../../Helpers/amenityIcons';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const AmenityCard = ({title, id}) => {
  const renderContent = () => {
    const iconSource = amenityIcons[title] || defaultIcon;
    return (
      <>
        <Image style={styles.filterStarImage} source={iconSource} />
        <Text style={[styles.filterStarText]}>{title}</Text>
      </>
    );
  };

  return <View style={[styles.filterStarItem]}>{renderContent()}</View>;
};

export default AmenityCard;

const styles = StyleSheet.create({
  filterStarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
    borderRadius: Matrics.s(8),
    paddingHorizontal: Matrics.s(8),
    paddingVertical: Matrics.vs(8),
    width: 'auto',
  },
  filterStarImage: {
    width: Matrics.s(15),
    height: Matrics.s(15),
    marginRight: Matrics.s(5),
  },
  filterStarText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.DARK_TEXT_COLOR,
  },
});
