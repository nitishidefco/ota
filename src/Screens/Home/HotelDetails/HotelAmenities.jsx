import {View, Text} from 'react-native';
import React from 'react';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import i18n from '../../../i18n/i18n';

const HotelAmenities = ({hotelDetail}) => {
  return (
    <View
      style={{
        paddingHorizontal: Matrics.s(20),
        marginVertical: Matrics.vs(15),
      }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.Montserrat.Bold,
          fontSize: typography.fontSizes.fs18,
          marginBottom: Matrics.vs(10),
        }}>
        {i18n.t('hotelDetails.hotelAmenities')}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.Montserrat.Medium,
          fontSize: typography.fontSizes.fs16,
          marginBottom: Matrics.vs(10),
          color: COLOR.DARK_TEXT_COLOR,
        }}>
        {i18n.t('hotelDetails.noAmenityAvailable')}
      </Text>
    </View>
  );
};

export default HotelAmenities;
