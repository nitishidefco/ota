import {View, Text, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import {RoomContext} from '../../../Context/RoomContext';
import CheckoutToast from '../../../Components/UI/CheckoutToast';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {confirmPrice} from '../../../Redux/Reducers/HotelReducer/PriceConfirmSlice';
import {errorToast} from '../../../Helpers/ToastMessage';
import {useNavigation} from '@react-navigation/native';
import i18n from '../../../i18n/i18n';

const RoomPolicies = ({roomInfo, provider, hotelId, GiataId}) => {
  // console.log('Room info', roomInfo);
  const dispatch = useDispatch();
  const {selectedRoomId} = useContext(RoomContext);
  const selectedRoom = roomInfo?.find(
    room => room?.RatePlanID === selectedRoomId,
  );

  const {ratePlanId} = useContext(RoomContext);
  const {hotelStayStartDate, hotelStayEndDate, adults, rooms, pluaralChild} =
    useContext(RoomContext);
  const priceConfirmAllState = useSelector(state => state?.confirmPrice);
  const navigation = useNavigation();
  const handleCheckoutPress = async () => {
    if (!hotelStayStartDate || !hotelStayEndDate) {
      const error = 'Please select check-in and check-out dates';
      return errorToast(error);
    }
    const detailsForPriceConfirm = {
      RatePlanID: ratePlanId,
      provider: provider,
      HotelID: hotelId,
      CheckInDate: dayjs(hotelStayStartDate).format('YYYY-MM-DD'),
      CheckOutDate: dayjs(hotelStayEndDate).format('YYYY-MM-DD'),
      RoomCount: rooms,
      Nationality: 'US',
      Currency: 'USD',
      OccupancyDetails: [
        {
          ChildCount: pluaralChild,
          AdultCount: adults,
          RoomNum: rooms,
        },
      ],
    };
    console.log(detailsForPriceConfirm);

    try {
      const response = await dispatch(
        confirmPrice({details: detailsForPriceConfirm}),
      ).unwrap();
      console.log(response);

      console.log(priceConfirmAllState);

      if (priceConfirmAllState.priceConfirmDetails.error) {
        errorToast(priceConfirmAllState.priceConfirmDetails.error);
      } else if (priceConfirmAllState.priceConfirmDetails.HotelID) {
        navigation.navigate('HotelBooking', {
          provider: provider,
          hotelId: hotelId,
          giataId: GiataId,
        });
      }
    } catch (error) {
      console.log('Error in price confirm', error);

      navigation.navigate('PriceConfirmFailed');
    }
  };
  return (
    <View style={{paddingHorizontal: Matrics.s(15), marginTop: Matrics.vs(15)}}>
      <Text
        style={{
          fontFamily: typography.fontFamily.Montserrat.Bold,
          fontSize: typography.fontSizes.fs16,
        }}>
        {i18n.t('hotelDetails.roomPolicies')}
      </Text>
      <View>
        <View>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.SemiBold,
              fontSize: typography.fontSizes.fs14,
            }}>
            {i18n.t('hotelDetails.roomInfo')}
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Regular,
              fontSize: typography.fontSizes.fs14,
              color: COLOR.DARK_TEXT_COLOR,
            }}>
            {selectedRoom?.RoomName}
          </Text>
        </View>
        <View
          style={{
            marginTop: Matrics.vs(5),
          }}>
          {selectedRoom?.facility?.length > 0 &&
            selectedRoom?.facility?.map((item, index) => {
              return (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.facilityText}>{item.Name || item}</Text>
                </View>
              );
            })}
        </View>
        <View>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.SemiBold,
              fontSize: typography.fontSizes.fs14,
              marginLeft: Matrics.s(2),
            }}>
            {i18n.t('hotelDetails.cancellation')}
          </Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                color: COLOR.DARK_TEXT_COLOR,
              }}>
              {i18n.t('hotelDetails.amount')}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                color: COLOR.PRIMARY,
              }}>
              ${selectedRoom?.RatePlanCancellationPolicyList[0]?.Amount}
            </Text>
          </View>
        </View>
        {selectedRoomId && (
          <View>
            <CheckoutToast handlePress={handleCheckoutPress} />
          </View>
        )}
      </View>
    </View>
  );
};

export default RoomPolicies;
const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Matrics.vs(5),
    paddingLeft: Matrics.s(10),
  },
  bullet: {
    width: Matrics.s(6),
    height: Matrics.s(6),
    borderRadius: Matrics.s(3), // Makes it a circle
    backgroundColor: COLOR.PRIMARY,
    marginRight: Matrics.s(8),
  },
  facilityText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.PRIMARY,
    flexShrink: 1, // Ensures text wraps if too long
  },
});
