import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';

import DateTimePicker from 'react-native-ui-datepicker';
import Modal from 'react-native-modal';
import {errorToast} from '../../Helpers/ToastMessage';
import {getRooms} from '../../Redux/Reducers/HotelReducer/RoomsSlice';
import {RoomContext} from '../../Context/RoomContext';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../../i18n/i18n';
const ModifyCard = ({provider, hotelId}) => {
  const dispatch = useDispatch();
  const [childAges, setChildAges] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {
    hotelStayStartDate,
    setHotelStayStartDate,
    hotelStayEndDate,
    setHotelStayEndDate,
    guests,
    setGuests,
    rooms,
    setRooms,
    adults,
    setAdults,
  } = useContext(RoomContext);
  const globalLanguage = useSelector(
    state => state.selectedLanguage.globalLanguage,
  );
  /* --------------------------------- States --------------------------------- */

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pluaralChild, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [showGuestsModal, setShowGuestsModal] = useState(false);

  const handleAdults = action => {
    if (action === 'incre') {
      setAdults(adults + 1);
    } else if (action === 'decre' && adults > 1) {
      setAdults(adults - 1);
    }
  };
  useEffect(() => {
    const keyboardShowEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(keyboardShowEvent, () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener(keyboardHideEvent, () => {
      setKeyboardVisible(false);
    });

    // Clean up subscriptions when component unmounts
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const [pickerStates, setPickerStates] = useState(
    Array.from({length: pluaralChild}, () => ({
      open: false,
      value: null,
      items: [
        {label: '0 year old', value: 0},
        {label: '1 year old', value: 1},
        {label: '2 years old', value: 2},
        {label: '3 years old', value: 3},
        {label: '4 years old', value: 4},
        {label: '5 years old', value: 5},
        {label: '6 years old', value: 6},
        {label: '7 years old', value: 7},
        {label: '8 years old', value: 8},
        {label: '9 years old', value: 9},
        {label: '10 years old', value: 10},
        {label: '11 years old', value: 11},
        {label: '12 years old', value: 12},
        {label: '13 years old', value: 13},
        {label: '14 years old', value: 14},
        {label: '15 years old', value: 15},
        {label: '16 years old', value: 16},
        {label: '17 years old', value: 17},
      ],
    })),
  );

  const updatePickerState = (index, field, newValue) => {
    setPickerStates(prevStates =>
      prevStates.map((state, i) =>
        i === index ? {...state, [field]: newValue} : state,
      ),
    );
    if (field === 'value') {
      setChildAges(prevAges =>
        prevAges.map((age, i) => (i === index ? newValue : age)),
      );
    }
  };
  const handleChildren = action => {
    if (action === 'incre') {
      setChildren(prev => {
        const newCount = prev + 1;
        setPickerStates(prevStates => [
          ...prevStates,
          {
            open: false,
            value: null,
            items: [
              {label: '0 year old', value: 0},
              {label: '1 year old', value: 1},
              {label: '2 years old', value: 2},
              {label: '3 years old', value: 3},
              {label: '4 years old', value: 4},
              {label: '5 years old', value: 5},
              {label: '6 years old', value: 6},
              {label: '7 years old', value: 7},
              {label: '8 years old', value: 8},
              {label: '9 years old', value: 9},
              {label: '10 years old', value: 10},
              {label: '11 years old', value: 11},
              {label: '12 years old', value: 12},
              {label: '13 years old', value: 13},
              {label: '14 years old', value: 14},
              {label: '15 years old', value: 15},
              {label: '16 years old', value: 16},
              {label: '17 years old', value: 17},
            ],
          },
        ]);
        setChildAges(prevAges => [...prevAges, null]);
        return newCount;
      });
    } else if (action === 'decre' && pluaralChild > 0) {
      setChildren(prev => {
        const newCount = prev - 1;
        setPickerStates(prevStates => prevStates.slice(0, -1));
        setChildAges(prevAges => prevAges.slice(0, -1));
        return newCount;
      });
    }
  };

  const countGuests = () => {
    const totalGuest = adults + pets + pluaralChild;
    setGuests(totalGuest);
  };
  const handleRooms = action => {
    if (action === 'incre') {
      setRooms(rooms + 1);
    } else if (action === 'decre' && rooms > 1) {
      setRooms(rooms - 1);
    }
  };
  useEffect(() => {
    handleSearchPress();
  }, [hotelId]);
  const handleSearchPress = async () => {
    if (dayjs(hotelStayStartDate).isSameOrBefore(dayjs(), 'day')) {
      const error = i18n.t('toastMessages.checkInFuture');
      errorToast(error);
      return;
    }
    const stayDuration = dayjs
      .duration(dayjs(hotelStayEndDate).diff(dayjs(hotelStayStartDate)))
      .asDays();
    if (stayDuration > 20) {
      const error = i18n.t('toastMessages.stayDuration');
      errorToast(error);
      return;
    }
    const detailsForDestinationSearch = {
      CheckInDate: dayjs(hotelStayStartDate).format('YYYY-MM-DD'),
      CheckOutDate: dayjs(hotelStayEndDate).format('YYYY-MM-DD'),
      RealTimeOccupancy: {
        AdultCount: adults,
        ChildCount: pluaralChild,
        ChildAgeDetails: [],
      },
      Nationality: 'IN',
      Currency: 'USD',
      RoomCount: 1,
      provider: provider,
      HotelID: hotelId,
    };
    const response = await dispatch(
      getRooms({details: detailsForDestinationSearch}),
    );

    if (response.error) {
      errorToast(response.payload);
    }
  };
  return (
    <View style={styles.modifyCardControls}>
      <Text style={styles.cardTitle}>Modify</Text>
      <View
        style={{
          gap: 8,
        }}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
          style={styles.datePickerContainer}>
          <Image
            style={[
              styles.locationPinIcon,
              styles.searchBarIcon,
              styles.calendar,
            ]}
            source={Images.CALENDAR}
          />
          <View style={styles.startEndDateContainer}>
            <View>
              <Text style={styles.date}>
                {hotelStayStartDate ? (
                  dayjs(hotelStayStartDate)
                    ?.locale(globalLanguage || 'en')
                    ?.format('MM-DD-YYYY')
                ) : (
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      color: COLOR.DIM_TEXT_COLOR,
                    }}>
                    {i18n.t('Hotel.mmDDyyyy')}
                  </Text>
                )}
              </Text>
            </View>
            <Image source={Images.RIGHT_ARROW} style={styles.rightArrowIcon} />
            <View>
              <Text style={styles.date}>
                {hotelStayEndDate ? (
                  dayjs(hotelStayEndDate)
                    ?.locale(globalLanguage || 'en')
                    ?.format('MM-DD-YYYY')
                ) : (
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      color: COLOR.DIM_TEXT_COLOR,
                    }}>
                    {i18n.t('Hotel.mmDDyyyy')}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowGuestsModal(true)}
          activeOpacity={0.7}
          style={[styles.datePickerContainer, styles.guestsContainer]}>
          <Image
            style={[
              styles.locationPinIcon,
              styles.searchBarIcon,
              {
                height: Matrics.vs(20),
                width: Matrics.s(20),
              },
            ]}
            source={Images.PEOPLE}
          />
          <Text style={styles.date}>
            {`${adults} ${i18n.t('Hotel.adult')}, ${pluaralChild} ${i18n.t(
              'Hotel.children',
            )} ${i18n.t('Hotel.and')} ${rooms} ${i18n.t('Hotel.room')}`}
          </Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={styles.searchGlassContainer}
            onPress={handleSearchPress}
            activeOpacity={0.7}>
            <Text
              style={{
                color: COLOR.WHITE,
                textAlign: 'center',
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                fontSize: typography.fontSizes.fs16,
              }}>
              {i18n.t('Hotel.search')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={showDatePicker}
        onBackdropPress={() => setShowDatePicker(false)}
        style={styles.datePickerModal}>
        <View>
          <DateTimePicker
            showOutsideDays={false}
            navigationPosition="right"
            mode="range"
            startDate={hotelStayStartDate}
            endDate={hotelStayEndDate}
            onChange={({startDate, endDate}) => {
              setHotelStayStartDate(startDate);
              setHotelStayEndDate(endDate);
            }}
            minDate={dayjs()}
            styles={datePickerStyles}
            containerHeight={250}
          />
        </View>
      </Modal>
      {/* Guests modal */}
      <Modal
        isVisible={showGuestsModal}
        onBackdropPress={() => setShowGuestsModal(false)}
        onBackButtonPress={() => setShowGuestsModal(false)}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={{justifyContent: isKeyboardVisible ? 'flex-start' : 'flex-end'}}
        onModalHide={countGuests}>
        <View style={styles.guestModalContainer}>
          <View style={styles.hr} />
          <Text style={styles.guestModalTitle}>
            {i18n.t('HotelSearchCard.guests')}
          </Text>
          <View style={styles.guestOptions}>
            <View>
              <Text style={styles.guestOptionsTitle}>
                {i18n.t('Hotel.room')}
              </Text>
            </View>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleRooms('decre')}
                activeOpacity={0.7}>
                <Image
                  source={Images.MINUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
              <Text style={styles.guestText}>{rooms}</Text>
              <TouchableOpacity
                onPress={() => handleRooms('incre')}
                activeOpacity={0.7}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.guestOptions}>
            <View>
              <Text style={styles.guestOptionsTitle}>
                {i18n.t('Hotel.adult')}
              </Text>
            </View>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleAdults('decre')}
                activeOpacity={0.7}>
                <Image
                  source={Images.MINUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
              <Text style={styles.guestText}>{adults}</Text>
              <TouchableOpacity
                onPress={() => handleAdults('incre')}
                activeOpacity={0.7}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.guestOptionsLast,
              {
                borderBottomWidth: pluaralChild > 0 ? 1 : 0,
                borderBottomColor:
                  pluaralChild > 0 ? COLOR.BORDER_COLOR : 'none',
                paddingBottom: pluaralChild > 0 ? Matrics.vs(10) : 0,
              },
            ]}>
            <View>
              <Text style={styles.guestOptionsTitle}>
                {i18n.t('Hotel.children')}
              </Text>
            </View>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleChildren('decre')}
                activeOpacity={0.7}>
                {pluaralChild === 0 ? (
                  <Image
                    source={Images.MINUS_DISABLED}
                    style={styles.guestOptionsControllerImages}
                  />
                ) : (
                  <Image
                    source={Images.MINUS}
                    style={styles.guestOptionsControllerImages}
                  />
                )}
              </TouchableOpacity>
              {pluaralChild === 0 ? (
                <Text style={styles.guestText}>-</Text>
              ) : (
                <Text style={styles.guestText}>{pluaralChild}</Text>
              )}
              <TouchableOpacity
                onPress={() => handleChildren('incre')}
                activeOpacity={0.7}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
          {Array.from({length: pluaralChild}, (_, index) => (
            <View key={index} style={styles.pickerContainer}>
              <DropDownPicker
                open={pickerStates[index].open}
                value={pickerStates[index].value}
                items={pickerStates[index].items}
                setOpen={newOpen => updatePickerState(index, 'open', newOpen)}
                setValue={callback => {
                  // The setValue prop expects a callback that receives the current items
                  const newValue = callback(pickerStates[index].items);
                  updatePickerState(index, 'value', newValue);
                }}
                selectedItemLabelStyle={{
                  fontWeight: 'bold',
                }}
                dropDownContainerStyle={{
                  borderColor: COLOR.PRIMARY,
                }}
                arrowIconStyle={{
                  color: COLOR.PRIMARY,
                }}
                style={{
                  borderColor: COLOR.PRIMARY,
                  borderWidth: 2,
                }}
                labelStyle={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                }}
                listItemLabelStyle={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                }}
                placeholderStyle={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                }}
                setItems={newItems =>
                  updatePickerState(index, 'items', newItems)
                }
                placeholder={`Age needed for Child ${index + 1}`}
                onOpen={() => {
                  // Close other pickers when one is opened
                  setPickerStates(prevStates =>
                    prevStates.map((state, i) =>
                      i === index
                        ? {...state, open: true}
                        : {...state, open: false},
                    ),
                  );
                }}
              />
            </View>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default ModifyCard;
const styles = StyleSheet.create({
  pickerContainer: {
    marginTop: Matrics.vs(10),
  },
  mainContainer: {
    backgroundColor: COLOR.WHITE,
    marginHorizontal: Matrics.s(10),
    paddingHorizontal: Matrics.s(15),
    paddingVertical: Matrics.vs(18),
    borderRadius: Matrics.s(15),
    justifyContent: 'space-between',
    height: Matrics.vs(250),
  },
  searchBarContainer: {
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Matrics.s(10),
    borderRadius: Matrics.s(5),
    height: Matrics.vs(45),
    position: 'relative',
  },
  searchBarLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarTextInput: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.BLACK,
  },
  searchBarIcon: {
    resizeMode: 'contain',
  },
  locationPinIcon: {
    width: Matrics.s(16),
  },
  crossIconContainer: {
    position: 'absolute',
    right: 4,
    zIndex: 10,
  },
  closeIcon: {
    width: Matrics.s(25),
  },
  cardTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs16,
    marginBottom: Matrics.s(10),
  },
  datePickerContainer: {
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Matrics.s(10),
    borderRadius: Matrics.s(5),
    height: Matrics.vs(45),
    // flex: 1,
    backgroundColor: 'white',
  },
  dateContainer: {
    // width: Matrics.screenWidth * 0.34,
  },
  guestsContainer: {
    // width: Matrics.screenWidth * 0.25,
  },
  dateAndPeoplePickerContainer: {
    // flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  rightArrowIcon: {
    width: Matrics.s(20),
    height: Matrics.s(20),
    resizeMode: 'contain',
  },
  searchButtonContainer: {
    backgroundColor: COLOR.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Matrics.s(5),
    gap: 10,
    height: Matrics.vs(40),
  },
  searchBarText: {
    color: COLOR.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs18,
  },
  startEndDateContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  date: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.DARK_TEXT_COLOR,
    marginLeft: Matrics.screenWidth < 412 ? Matrics.s(5) : Matrics.s(5),
  },
  guestModalContainer: {
    backgroundColor: COLOR.WHITE,
    padding: Matrics.s(10),
    justifyContent: 'flex-end',
    borderRadius: Matrics.s(10),
  },
  guestOptionsTitle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.BLACK,
  },
  guestModalTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs22,
    color: COLOR.PRIMARY,
  },
  guestOptionsTitleController: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestOptionsControllerImages: {
    resizeMode: 'contain',
    width: Matrics.s(30),
    height: Matrics.vs(30),
  },
  guestOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLOR.BORDER_COLOR,
    borderBottomWidth: 1,
    paddingVertical: Matrics.vs(10),
  },
  guestOptionsLast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Matrics.vs(10),
  },
  modalStyle: {
    justifyContent: 'flex-end',
  },
  hr: {
    width: Matrics.s(55),
    height: Matrics.vs(2),
    backgroundColor: COLOR.PRIMARY,
    alignSelf: 'center',
    marginBottom: Matrics.s(10),
  },
  guestText: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs18,
    width: Matrics.s(30),
    textAlign: 'center',
  },
  container: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: Matrics.s(10),
  },
  dropdownContainer: {
    position: 'absolute',
    top: Matrics.vs(40),
    borderRadius: Matrics.s(10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    height: Matrics.screenHeight * 0.4,
    zIndex: 1000,
    left: Matrics.s(-20),
  },
  flatListStyle: {
    backgroundColor: 'white',
    paddingHorizontal: Matrics.s(20),
    paddingVertical: Matrics.s(10),
    width: Matrics.screenWidth * 0.8,
    borderRadius: Matrics.s(10),
    height: '100%',
    // zIndex: 100,
    // overflow: 'hidden',
  },
  cityItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_COLOR,
    paddingVertical: Matrics.vs(6),
    marginBottom: Matrics.vs(10),
  },
  cityName: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs15,
  },
  destinationName: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  modifyCardControls: {
    backgroundColor: COLOR.GREY,
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(15),
    borderRadius: Matrics.s(10),
  },
  searchGlass: {
    width: Matrics.s(25),
    height: Matrics.vs(25),
    resizeMode: 'contain',
  },
  searchGlassContainer: {
    paddingHorizontal: Matrics.s(20),
    paddingVertical: Matrics.vs(10),
    borderRadius: Matrics.s(10),
    backgroundColor: COLOR.PRIMARY,
  },
  childrenAgeContainer: {
    gap: 5,
    marginTop: 5,
  },
});
const datePickerStyles = StyleSheet.create({
  outside_label: {
    color: COLOR.DARK_TEXT_COLOR,
  },
  disabled: {
    backgroundColor: '#F5F5F5',
    marginVertical: Matrics.s(2),
  },
  disabled_label: {
    color: COLOR.DIM_TEXT_COLOR,
  },
  days: {
    backgroundColor: 'white',
    borderBottomRightRadius: Matrics.s(5),
    borderBottomLeftRadius: Matrics.s(5),
  },
  day: {
    // width: Matrics.s(30), // Fixed width for consistency
    height: Matrics.vs(25), // Reduced height for the day itself
    justifyContent: 'center', // Center the label vertically
    alignItems: 'center',
  },
  day_cell: {
    // width: Matrics.s(30),
    height: Matrics.s(25),
    // backgroundColo: 'red',
  },

  day_label: {
    color: 'black',
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },

  weekdays: {
    //     display: 'none', // Hide week labels
    backgroundColor: COLOR.WHITE,
    height: Matrics.vs(20),
    paddingHorizontal: Matrics.s(10),
  },
  weekday_label: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },

  month_selector_label: {
    fontSize: typography.fontSizes.fs20,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: 'black',
  },
  header: {
    height: Matrics.vs(45),
    backgroundColor: COLOR.WHITE,
    padding: Matrics.s(10),
    borderTopLeftRadius: Matrics.s(5),
    borderTopEndRadius: Matrics.s(5),
  },
  year_selector_label: {
    fontSize: typography.fontSizes.fs20,
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  selected: {
    backgroundColor: COLOR.PRIMARY,
    marginTop: Matrics.vs(5),
    marginLeft: Matrics.s(5),
    borderRadius: Matrics.s(10),
  },
  selected_label: {
    color: 'white',
  },
  range_start: {
    backgroundColor: COLOR.PRIMARY,
    borderTopLeftRadius: Matrics.s(10),
    borderBottomLeftRadius: Matrics.s(10),
    marginLeft: Matrics.s(5),
    marginTop: Matrics.vs(5),
  },
  range_middle: {
    backgroundColor: COLOR.RANGE_MIDDLE,
    marginTop: Matrics.vs(5),
  },
  range_end: {
    backgroundColor: COLOR.PRIMARY,
    marginRight: Matrics.s(5),
    borderTopRightRadius: Matrics.s(10),
    borderBottomRightRadius: Matrics.s(10),
    marginTop: Matrics.vs(5),
  },
  range_start_label: {
    color: COLOR.WHITE,
  },
  range_end_label: {
    color: COLOR.WHITE,
  },
  range_middle_label: {
    color: COLOR.BLACK,
  },
  button_next: {
    // backgroundColor: COLOR.PRIMARY,
    padding: Matrics.s(8),
    borderRadius: Matrics.s(10),
  },
  button_prev: {
    // backgroundColor: COLOR.PRIMARY,
    padding: Matrics.s(8),
    borderRadius: Matrics.s(10),
  },
  button_prev_image: {
    color: COLOR.WHITE,
  },
  today: {
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    borderRadius: Matrics.s(10),
    marginTop: Matrics.vs(5),
    marginLeft: Matrics.s(5),
  },
  today_label: {
    color: COLOR.BLACK,
  },
  months: {
    backgroundColor: 'white',
    borderBottomLeftRadius: Matrics.s(10),
    borderBottomRightRadius: Matrics.s(10),
  },
  month: {
    // position: 'absolute',
    top: -30,
    // left: 15,
  },
  month_label: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  selected_month: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: Matrics.s(),
    paddingVertical: Matrics.vs(5),
    borderRadius: Matrics.s(10),
  },
  selected_month_label: {
    color: COLOR.WHITE,
  },

  years: {
    backgroundColor: 'white',
    borderBottomLeftRadius: Matrics.s(10),
    borderBottomRightRadius: Matrics.s(10),
  },
  year_label: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  selected_year: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: Matrics.s(),
    paddingVertical: Matrics.vs(5),
    borderRadius: Matrics.s(10),
  },
  selected_year_label: {
    color: COLOR.WHITE,
  },
});
