import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Images} from '../../../Config';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';

const CancelBookingModal = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: Matrics.s(20),
        paddingVertical: Matrics.vs(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Matrics.vs(10),
        width: '95%',
        margin: 'auto',
        gap: Matrics.vs(20),
      }}>
      <Image
        source={Images.RED_CROSS}
        style={{
          width: Matrics.s(40),
          resizeMode: 'contain',
          height: Matrics.s(40),
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: typography.fontFamily.Montserrat.SemiBold,
          fontSize: typography.fontSizes.fs18,
          color: COLOR.PRIMARY,
        }}>
        Are you sure you want to cancel the booking?
      </Text>
      <View style={{flexDirection: 'row', gap: Matrics.vs(10)}}>
        <TouchableOpacity
          style={{
            backgroundColor: COLOR.PRIMARY,
            paddingVertical: Matrics.vs(10),
            paddingHorizontal: Matrics.vs(40),
            borderRadius: Matrics.vs(5),
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: typography.fontFamily.Montserrat.SemiBold,
              fontSize: typography.fontSizes.fs16,
              color: COLOR.WHITE,
            }}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: COLOR.DIM_TEXT_COLOR,
            paddingVertical: Matrics.vs(10),
            paddingHorizontal: Matrics.vs(40),
            borderRadius: Matrics.vs(5),
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: typography.fontFamily.Montserrat.SemiBold,
              fontSize: typography.fontSizes.fs16,
              color: COLOR.WHITE,
            }}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CancelBookingModal;
