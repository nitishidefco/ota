import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {Matrics, typography, COLOR} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {RoomContext} from '../../Context/RoomContext';

const RoomCard = ({room}) => {

  const {
    selectedRoomId,
    setSelectedRoomId,
    setShowCheckoutToast,
    setRatePlanId,
  } = useContext(RoomContext);

  const isSelected = selectedRoomId === room.RatePlanID;

  const handleRoomSelection = () => {
    if (selectedRoomId === room.RatePlanID) {
      setSelectedRoomId(null);
      setShowCheckoutToast(false);
      setRatePlanId(null);
    } else {
      setRatePlanId(room.RatePlanID);
      setSelectedRoomId(room.RatePlanID);
      setShowCheckoutToast(true);
    }
  };

  return (
    <View style={styles.roomCard}>
      <Image
        source={Images.HOTEL1}
        style={styles.roomImage}
        resizeMode="cover"
      />
      <View style={styles.roomDetails}>
        <Text style={styles.roomType}>{room.RoomName}</Text>
        <View style={styles.amenitiesContainer}>
          {room.facility?.map((facility, index) => (
            <View key={index} style={styles.amenityItem}>
              <Image
                source={Images.COLOR_CHECK}
                style={styles.amenityIcon}
                resizeMode="contain"
              />
              <Text style={styles.amenityText}>{facility.Name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.priceDetails}>
            <View style={styles.priceNumber}>
              <Text style={styles.price}>{room.price}</Text>
              <Text style={styles.oldPrice}>{room.totalprice}</Text>
            </View>
            <Text style={styles.vat}>1 Night (incl. VAT)</Text>
          </View>
          <Text style={styles.infoText}>Only {room.InventoryCount} Left</Text>
        </View>

        {/* Selection Button */}
        <TouchableOpacity
          style={isSelected ? styles.bookedButton : styles.bookButton}
          onPress={handleRoomSelection}>
          <Text style={styles.bookButtonText}>
            {isSelected ? 'Room Selected' : 'Select Room'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roomCard: {
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: Matrics.vs(16),
    width: Matrics.screenWidth * 0.8,
  },
  roomImage: {
    width: '100%',
    height: Matrics.vs(150),
  },
  roomDetails: {
    paddingHorizontal: Matrics.s(13),
    paddingVertical: Matrics.vs(10),
  },
  roomType: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs18,
    marginBottom: Matrics.vs(8),
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    paddingVertical: Matrics.vs(4),
    borderRadius: Matrics.s(6),
  },
  amenityIcon: {
    width: Matrics.s(16),
    height: Matrics.s(16),
    marginRight: Matrics.s(4),
  },
  amenityText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.GRAY,
    width: Matrics.screenWidth * 0.27,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Matrics.vs(5),
  },
  priceNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  price: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs24,
    color: COLOR.ORANGE_LIGHT,
  },
  oldPrice: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs15,
    color: COLOR.DIM_TEXT_COLOR,
    textDecorationLine: 'line-through',
  },
  vat: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.DIM_TEXT_COLOR,
  },
  infoText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.RED,
  },
  bookButton: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: Matrics.s(20),
    paddingVertical: Matrics.vs(10),
    borderRadius: Matrics.s(8),
    marginTop: Matrics.vs(8),
  },
  bookedButton: {
    backgroundColor: COLOR.DIM_TEXT_COLOR,
    paddingHorizontal: Matrics.s(20),
    paddingVertical: Matrics.vs(10),
    borderRadius: Matrics.s(8),
    marginTop: Matrics.vs(8),
  },
  bookButtonText: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.WHITE,
    textAlign: 'center',
  },
});

export default RoomCard;
