import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation, CommonActions} from '@react-navigation/native';
import NormalHeader from '../../../Components/UI/NormalHeader';
import Images from '../../../Config/Images';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import dayjs from 'dayjs';
import {RoomContext} from '../../../Context/RoomContext';

const HotelBookingStatus = () => {
  const navigation = useNavigation();
  const {bookingConfirmationDetails} = useSelector(state => state.hotelBooking);
  console.log('bookingConfirmationDetails', bookingConfirmationDetails);
  const {selectedRoom} = useContext(RoomContext);
  const handleHomePress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: {
              screen: 'Home',
              params: {
                screen: 'Hotels',
                params: {
                  screen: 'HotelList',
                },
              },
            },
          },
        ],
      }),
    );
  };

  const handleMyBookingsPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: {
              screen: 'Booking',
              params: {
                screen: 'BookingHome',
              },
            },
          },
        ],
      }),
    );
  };

  return (
    <View style={{flex: 1, paddingTop: '7%'}}>
      <ScrollView>
        <NormalHeader
          title="Booking Status"
          showLeftButton={false}
          showRightButton={false}
        />
        <Image
          source={Images.BOOKING_STATUS_IMAGE}
          style={{width: '100%', height: 200, marginTop: Matrics.vs(20)}}
          resizeMode="contain"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: Matrics.s(10),
            marginTop: Matrics.vs(10),
            justifyContent: 'center',
            gap: Matrics.s(10),
          }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs19,
            }}>
            Your Booking is Confirmed
          </Text>
          <Image
            source={Images.COLOR_CHECK}
            style={{width: 40, height: 40}}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            paddingHorizontal: Matrics.s(10),
            marginVertical: Matrics.vs(7),
            gap: Matrics.s(10),
            marginBottom: Matrics.vs(20),
          }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Regular,
              fontSize: typography.fontSizes.fs14,
              textAlign: 'center',
            }}>
            Your stay at{' '}
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                fontSize: typography.fontSizes.fs14,
              }}>
              {bookingConfirmationDetails?.data?.Hotel_details?.Name}{' '}
            </Text>
            from{' '}
            <Text
              style={{fontFamily: typography.fontFamily.Montserrat.SemiBold}}>
              {dayjs(bookingConfirmationDetails?.data?.CheckInDate).format(
                'DD-MM-YYYY',
              )}{' '}
            </Text>
            to{' '}
            <Text
              style={{fontFamily: typography.fontFamily.Montserrat.SemiBold}}>
              {dayjs(bookingConfirmationDetails?.data?.CheckOutDate).format(
                'DD-MM-YYYY',
              )}{' '}
            </Text>
            is confirmed.
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Regular,
              fontSize: typography.fontSizes.fs14,
              textAlign: 'center',
            }}>
            Need help? Reach out anytime — we're here for you!
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity
            onPress={handleHomePress}
            style={{
              backgroundColor: COLOR.PRIMARY,
              paddingVertical: Matrics.s(15),
              borderRadius: Matrics.s(10),
              width: '40%',
            }}>
            <Text
              style={{
                color: COLOR.WHITE,
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs16,
                textAlign: 'center',
              }}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleMyBookingsPress}
            style={{
              backgroundColor: COLOR.PRIMARY,
              paddingVertical: Matrics.s(15),
              borderRadius: Matrics.s(10),
              width: '40%',
            }}>
            <Text
              style={{
                color: COLOR.WHITE,
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs16,
                textAlign: 'center',
              }}>
              My Bookings
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: Matrics.vs(10), paddingHorizontal: Matrics.s(10)}}>
          <Text
            style={{
              width: Matrics.s(170),
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs18,
            }}>
            Payment Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderStyle: 'dashed',
              borderBottomWidth: 2,
              borderColor: COLOR.BORDER_COLOR,
              paddingBottom: Matrics.vs(10),
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                }}>
                {selectedRoom.RoomName}
              </Text>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                  width: '60%',
                }}>
                {selectedRoom.RoomOccupancy.RoomNum} Room
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 5}}>
              {/* <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                $45
              </Text> */}
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs15,
                }}>
                ${Number(selectedRoom.totalprice).toFixed(2)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: Matrics.vs(5),
            }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                color: COLOR.PRIMARY,
                fontSize: typography.fontSizes.fs18,
              }}>
              Total (incl.VAT)
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                color: COLOR.PRIMARY,
                fontSize: typography.fontSizes.fs18,
              }}>
              ${Number(selectedRoom.totalprice).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HotelBookingStatus;
