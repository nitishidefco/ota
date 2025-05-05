import {View, Text, Image} from 'react-native';
import React, {useContext} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../../Config';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import {useSelector} from 'react-redux';
import {RoomContext} from '../../../Context/RoomContext';
import dayjs from 'dayjs';
import PaymentForm from '../../../Components/PaymentForm';

const HotelPaymentsPage = () => {
  const navigation = useNavigation();
  const hotelDetail = useSelector(state => state?.hotelDetail?.hotel);
  const {
    ratePlanId,
    guests,
    hotelStayStartDate,
    hotelStayEndDate,
    selectedRoom,
  } = useContext(RoomContext);
  console.log('Selected Room', selectedRoom);

  return (
    <>
      <NormalHeader
        title={'Payment'}
        showRightButton={false}
        leftIconName="BACK"
        onCrossPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView style={{paddingHorizontal: Matrics.s(10)}}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Matrics.s(20),
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                width: Matrics.s(170),
                fontFamily: typography.fontFamily.Montserrat.Bold,
                fontSize: typography.fontSizes.fs18,
              }}>
              {hotelDetail?.Name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: Matrics.vs(10),
                gap: 10,
              }}>
              <Image
                source={Images.LOCATION}
                style={{
                  width: Matrics.s(20),
                  resizeMode: 'contain',
                  height: Matrics.s(20),
                }}
              />
              <Text
                style={{fontFamily: typography.fontFamily.Montserrat.Regular}}>
                {hotelDetail?.address
                  ? hotelDetail?.address
                  : 'No address available'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: Matrics.vs(10),
                gap: 10,
              }}>
              <Image
                source={Images.PERSON}
                style={{
                  width: Matrics.s(20),
                  resizeMode: 'contain',
                  height: Matrics.s(20),
                }}
              />
              <Text
                style={{fontFamily: typography.fontFamily.Montserrat.Regular}}>
                {guests.length > 1 ? `${guests} Persons` : `${guests} Person`}{' '}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: Matrics.vs(10),
                gap: 10,
              }}>
              <Image
                source={Images.CALENDAR_PURPLE}
                style={{
                  width: Matrics.s(20),
                  resizeMode: 'contain',
                  height: Matrics.s(20),
                }}
              />
              <Text
                style={{fontFamily: typography.fontFamily.Montserrat.Regular}}>
                {dayjs(hotelStayStartDate).format('DD MMM YYYY')}{' '}
                {dayjs(hotelStayEndDate).format('DD MMM YYYY')}
              </Text>
            </View>
          </View>
          <Image
            source={Images.BANNER}
            style={{
              width: Matrics.s(100),
              height: Matrics.s(70),
              resizeMode: 'cover',
              borderRadius: Matrics.s(10),
            }}
          />
        </View>
        <View style={{marginTop: Matrics.vs(10)}}>
          <Text
            style={{
              width: Matrics.s(170),
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs18,
            }}>
            Price
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
                }}>
                {selectedRoom.RoomOccupancy.RoomNum}
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
                ${selectedRoom.totalprice}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
              ${selectedRoom.totalprice}
            </Text>
          </View>
        </View>
        <View>
          <PaymentForm />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default HotelPaymentsPage;
