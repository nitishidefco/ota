import React, {useContext, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import {RoomContext} from '../../Context/RoomContext';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const CheckoutToast = ({handlePress}) => {
  const {showCheckoutToast} = useContext(RoomContext);
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showCheckoutToast ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showCheckoutToast]);

  if (!showCheckoutToast) return null;

  return (
    <Animated.View
      style={[styles.toastContainer, {transform: [{translateY: slideAnim}]}]}>
      <View style={styles.toastContent}>
        <Text style={styles.text}>Room selected</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.checkoutButton} onPress={handlePress}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default CheckoutToast;
const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(7),
    paddingHorizontal: Matrics.s(10),
    marginHorizontal: Matrics.s(20),
    paddingVertical: Matrics.vs(10),
  },
  toastContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dismissText: {
    color: 'red',
    marginRight: 10,
    fontSize: 14,
  },
  checkoutButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  checkoutText: {
    color: '#fff',
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
});
