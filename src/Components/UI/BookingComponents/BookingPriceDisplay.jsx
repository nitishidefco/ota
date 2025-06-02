import {View, Text} from 'react-native';
import React from 'react';
import {COLOR, typography} from '../../../Config/AppStyling';

const BookingPriceDisplay = ({bookingPrice}) => {
  return (
    <View>
      <Text
        style={{
          color: COLOR.PRIMARY,
          fontFamily: typography.fontFamily.Montserrat.Bold,
          fontSize: typography.fontSizes.fs20,
        }}>
        ${bookingPrice}
      </Text>
    </View>
  );
};

export default BookingPriceDisplay;
