import {View, Text, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {ConfirmationModalContext} from '../../Context/ConfirmationModalContext';

const ConfirmationModal = ({title, handleYesPressed}) => {
  const {showCancelModal, setShowCancelModal} = useContext(
    ConfirmationModalContext,
  );
  return (
    <Animated.View
      entering={FadeIn.duration(25)}
      exiting={FadeOut.duration(25)}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: Matrics.screenHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}>
      <View
        style={{
          backgroundColor: COLOR.WHITE,
          width: Matrics.screenWidth * 0.9,
          margin: 'auto',
          paddingHorizontal: Matrics.s(20),
          paddingVertical: Matrics.vs(20),
          borderRadius: Matrics.s(10),
        }}>
        <View>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs15,
            }}>
            {title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: Matrics.vs(20),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLOR.RED,
              paddingVertical: Matrics.vs(10),
              paddingHorizontal: Matrics.s(20),
              borderRadius: Matrics.s(5),
            }}
            activeOpacity={0.7}
            onPress={() => setShowCancelModal(!showCancelModal)}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs15,
                color: COLOR.WHITE,
              }}>
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLOR.SUCCESS,
              paddingVertical: Matrics.vs(10),
              paddingHorizontal: Matrics.s(20),
              borderRadius: Matrics.s(5),
            }}
            activeOpacity={0.7}
            onPress={handleYesPressed}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs15,
                color: COLOR.WHITE,
              }}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default ConfirmationModal;
