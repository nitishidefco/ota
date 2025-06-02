import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
Images;
const FacilitiesCard = ({icon, title}) => {
  const amenititesIcon = {
    'Air conditioning': Images.AC,
    Parking: Images.PARKING,
    ATM: Images.ATM,
    '24-hour reception': Images.RECEPTION,
    'Free Wifi': Images.WIFI,
    Gym: Images.GYM,
    'Hotel Safe': Images.SAFE,
    'Currency Exchange': Images.CURRENCY_EXCHANGE,
    Lifts: Images.CURRENCY_EXCHANGE,
    Café: Images.CASH_ICON,
    'Newspaper kiosk': Images.KIOSK,
    'Small supermarket': Images.SUPERMARKET,
    Shops: Images.SHOPS,
    Hairdresser: Images.HAIRDRESSER,
    'Bar(s)': Images.PUB,
    Nightclub: Images.NIGHTCLUB,
    'Restaurant(s)': Images.RESTRO_WITH_AC,
    'Conference Room': Images.CONFERENCE_ROOM,
    'Internet access': Images.WIFI,
    'WLAN access': Images.WIFI,
    'Room Service': Images.ROOM_SERVICE,
    'Laundry Service': Images.LAUNDRY_SERVICE,
    'Car Park': Images.DOUBLE_BED,
    'Laundry Facilities': Images.LAUNDRY_SERVICE,
  };
  return (
    <View style={styles.facilityContainer}>
      <Image source={amenititesIcon[icon]} style={styles.iconStyle} />
      <Text style={styles.textStyle}>{title}</Text>
    </View>
  );
};

export default FacilitiesCard;
const styles = StyleSheet.create({
  facilityContainer: {
    backgroundColor: COLOR.SMALL_CARD_BACKGROUND,
    flexDirection: 'row',
    paddingVertical: Matrics.s(5),
    paddingHorizontal: Matrics.s(8),
    gap: 5,
    borderRadius: Matrics.s(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 2,
  },
  iconStyle: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  textStyle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.DIM_TEXT_COLOR,
  },
});
