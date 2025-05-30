import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import i18n from '../../../i18n/i18n';

const CancelBookingButton = ({cancelBooking, isLoading = false}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        backgroundColor: 'red',
        paddingHorizontal: Matrics.s(8),
        paddingVertical: Matrics.s(5),
        borderRadius: Matrics.s(5),
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: Matrics.s(60), // Ensure consistent width
        minHeight: Matrics.vs(30), // Ensure consistent height
      }}
      onPress={cancelBooking}
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={COLOR.WHITE} />
      ) : (
        <Text
          style={{
            color: COLOR.WHITE,
            fontFamily: typography.fontFamily.Montserrat.Medium,
            fontSize: typography.fontSizes.fs12,
          }}>
          {i18n.t('Booking.cancelBookingButton')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CancelBookingButton;
