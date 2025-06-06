import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {Matrics, COLOR, typography} from '../../Config/AppStyling';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const CalendarModal = ({
  isVisible,
  onClose,
  children = null,
  hotelStayStartDate,
  hotelStayEndDate,
}) => {
  const calculateNights = () => {
    if (!hotelStayStartDate || !hotelStayEndDate) return 0;
    return dayjs(hotelStayEndDate).diff(dayjs(hotelStayStartDate), 'day');
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>{children}</View>
          </TouchableWithoutFeedback>
          {hotelStayStartDate && hotelStayEndDate && (
            <View
              style={{
                flexDirection: 'row',
                gap: Matrics.s(10),
                backgroundColor: COLOR.WHITE,
                width: Matrics.screenWidth * 0.95,
                borderRadius: Matrics.s(10),
                padding: Matrics.s(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontFamily: typography.fontFamily.Montserrat.SemiBold,
                }}>
                {dayjs(hotelStayStartDate).format('DD MMM YYYY')}
              </Text>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontFamily: typography.fontFamily.Montserrat.SemiBold,
                }}>
                -
              </Text>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontFamily: typography.fontFamily.Montserrat.SemiBold,
                }}>
                {dayjs(hotelStayEndDate).format('DD MMM YYYY')}
              </Text>
              <Text
                style={{
                  color: COLOR.PRIMARY,
                  fontFamily: typography.fontFamily.Montserrat.SemiBold,
                }}>
                ({calculateNights()} Night{calculateNights() !== 1 ? 's' : ''}{' '}
                Stay)
              </Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(10),
    width: Matrics.screenWidth * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Matrics.s(5),
    paddingTop: Matrics.s(10),
  },
});

export default CalendarModal;
