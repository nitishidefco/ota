import React, {useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {RoomContext} from '../../Context/RoomContext';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';

const CheckoutToast = ({handlePress}) => {
  return (
    <TouchableOpacity
      style={styles.checkoutButton}
      onPress={handlePress}
      activeOpacity={0.7}>
      <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      <Image
        source={Images.RIGHT_ARROW_TAIL}
        style={{
          width: Matrics.s(20),
          height: Matrics.s(20),
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default CheckoutToast;
const styles = StyleSheet.create({
  checkoutButton: {
    backgroundColor: COLOR.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'ios' ? 'center' : none,
    marginTop: Matrics.vs(10),
  },
  checkoutText: {
    color: '#fff',
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
});
