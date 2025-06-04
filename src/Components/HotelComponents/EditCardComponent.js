import {View, Text, Image} from 'react-native';
import React from 'react';
import {Images} from '../../Config';
import {Matrics, typography} from '../../Config/AppStyling';

const EditCardComponent = ({savedCardDetails}) => {
  console.log('savedCardDetails', savedCardDetails);
  return (
    <View style={{marginTop: Matrics.s(20)}}>
      <Text
        style={{
          fontFamily: typography.fontFamily.Montserrat.Bold,
          fontSize: typography.fontSizes.fs16,
        }}>
        Saved Card
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '2px 3px 8px 3px rgba(0,0,0,0.22)',
          paddingHorizontal: Matrics.s(15),
          paddingVertical: Matrics.s(20),
          borderRadius: Matrics.s(10),
          marginTop: Matrics.s(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Matrics.s(10),
          }}>
          <Image source={Images.SAVED_CARD} style={{width: 40, height: 40}} />
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs16,
            }}>
            **** **** **** {savedCardDetails?.data?.last4}
          </Text>
        </View>
        <Image source={Images.EDIT} style={{width: 25, height: 25}} />
      </View>
    </View>
  );
};

export default EditCardComponent;
