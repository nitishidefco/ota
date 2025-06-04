import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Platform,
  I18nManager,
} from 'react-native';
import {Images} from '../../../Config';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import debounce from 'lodash/debounce';
import DropDownPicker from 'react-native-dropdown-picker';
/* --------------------------- External libraries --------------------------- */
import DateTimePicker, {useDefaultStyles} from 'react-native-ui-datepicker';
import {CalendarList, DateData} from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
import Modal from 'react-native-modal';
import CalendarModal from '../CalendarModal';

/* ------------------------------- Middlewares ------------------------------ */
import {getCityDetailsThunk} from '../../../Redux/Reducers/HotelReducer/GetCitySlice';
import {useDispatch, useSelector} from 'react-redux';
import {getAllHotelsThunk} from '../../../Redux/Reducers/HotelReducer/GetHotelSlice';
import {errorToast} from '../../../Helpers/ToastMessage';
import {RoomContext} from '../../../Context/RoomContext';
import i18n from '../../../i18n/i18n';
import {getFacilitiesThunk} from '../../../Redux/Reducers/FacilitiesReducer';
const HotelSearchCard = () => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector(
    state => state.currency.selectedCurrency,
  );
  /* --------------------------------- States --------------------------------- */
  const {
    hotelStayStartDate,
    setHotelStayStartDate,
    hotelStayEndDate,
    setHotelStayEndDate,
    setGuests,
    rooms,
    setRooms,
    adults,
    setAdults,
    pluaralChild,
    setChildren,
    selectedCityIndex,
    setSelectedCityIndex,
    showFlatList,
    setShowFlatList,
    destination,
    setDestination,
    showDatePicker,
    setShowDatePicker,
    showGuestsModal,
    setShowGuestsModal,
    pets,
  } = useContext(RoomContext);

  const {cityDetails, loadingCityDetails} = useSelector(state => state.getCity);
  const {loadingHotels} = useSelector(state => state?.hotelSlice);
  const [childAges, setChildAges] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const globalLanguage = useSelector(
    state => state.selectedLanguage.globalLanguage,
  );
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
    // If updating the value, sync it to childAges
    if (field === 'value') {
      setChildAges(prevAges =>
        prevAges.map((age, i) => (i === index ? newValue : age)),
      );
    }
  };
  /* ------------------------------ Handle guests ----------------------------- */
  const handleRooms = action => {
    if (action === 'incre') {
      setRooms(rooms + 1);
    } else if (action === 'decre' && rooms > 1) {
      setRooms(rooms - 1);
    }
  };
  const handleAdults = action => {
    if (action === 'incre') {
      setAdults(adults + 1);
    } else if (action === 'decre' && adults > 1) {
      setAdults(adults - 1);
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
  useEffect(() => {
    setChildAges(prevAges => {
      const updatedAges = [...prevAges];

      while (updatedAges.length < pluaralChild) {
        updatedAges.push('');
      }

      return updatedAges.slice(0, pluaralChild);
    });
  }, [pluaralChild]);

  const countGuests = () => {
    const totalGuest = adults + pets + pluaralChild;
    setGuests(totalGuest);
  };

  const debouncedSearch = useCallback(
    debounce(async searchText => {
      if (searchText.length < 2) {
        setShowFlatList(false);
        return;
      }
      try {
        setShowFlatList(true);
        await dispatch(getCityDetailsThunk({cityName: searchText}));
      } catch (error) {
        console.error('Error getting hotel details', error);
      }
    }, 500),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  /* --------------------------- handle search press --------------------------- */
  const handleSearchPress = async () => {
    if (
      destination === ' ' ||
      (cityDetails.length === 0 && !destination.trim()) ||
      destination.length < 3
    ) {
      const error = i18n.t('Toast.selectDestination');
      errorToast(error);
      return;
    }

    if (dayjs(hotelStayStartDate).isSameOrBefore(dayjs(), 'day')) {
      const error = i18n.t('Toast.checkInDateMustBeFuture');
      errorToast(error);
      return;
    }

    if (!hotelStayStartDate) {
      const error = i18n.t('toastMessages.selectCheckInDate');
      errorToast(error);
      return;
    }
    if (!hotelStayEndDate) {
      const error = i18n.t('toastMessages.selectCheckoutDate');
      errorToast(error);
      return;
    }
    const stayDuration = dayjs
      .duration(dayjs(hotelStayEndDate).diff(dayjs(hotelStayStartDate)))
      .asDays();
    if (stayDuration > 20) {
      const error = i18n.t('Toast.stayDurationCannotBeMoreThan20Days');
      errorToast(error);
      return;
    }

    if (
      pluaralChild > 0 &&
      (childAges.length === 0 || childAges.some(age => !age))
    ) {
      const error = i18n.t('toastMessages.enterAgeOfChildren');
      errorToast(error);
      return;
    }
    const detailsForDestinationSearch = {
      cityName: cityDetails[selectedCityIndex].cityName ?? destination.trim(),
      destinationName: cityDetails[selectedCityIndex].destinationName,
      countryCode: cityDetails[selectedCityIndex].countryCode,
      countryName: cityDetails[selectedCityIndex].countryName,
      CheckInDate: dayjs(hotelStayStartDate).format('YYYY-MM-DD'),
      CheckOutDate: dayjs(hotelStayEndDate).format('YYYY-MM-DD'),
      RoomCount: rooms,
      RealTimeOccupancy: {
        AdultCount: adults,
        ChildCount: pluaralChild,
        ChildAgeDetails: childAges,
      },
      Nationality: 'IN',
      Currency: selectedCurrency ?? 'USD',
    };
    await dispatch(getFacilitiesThunk());
    console.log('detailsForDestinationSearch', detailsForDestinationSearch);

    const response = await dispatch(
      getAllHotelsThunk({details: detailsForDestinationSearch}),
    );

    if (response.error) {
      errorToast(response.payload);
    }
  };

  /* ------------------------- handle flastlist press ------------------------- */
  const handleFlatListPress = (cityName, index) => {
    console.log('[handleFlatListPress] Pressed city:', cityName);
    // Dismiss keyboard and update state in a single operation
    Keyboard.dismiss();
    setSelectedCityIndex(index);
    setDestination(cityName);
    setShowFlatList(false);
  };

  // const handleFlatListShow = text => {
  //   console.log('text', text.length);

  //   if (text.length === 0) {
  //     setShowFlatList(false);
  //   } else {
  //     setShowFlatList(true);
  //   }
  // };
  // const defaultStyles = useDefaultStyles();
  const minDate = dayjs();
  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.cardTitle}>{i18n.t('Hotel.Hotels')}</Text>
      </View>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBarLeftContainer}>
          <View>
            <Image
              style={[styles.locationPinIcon, styles.searchBarIcon]}
              source={Images.LOCATION_PIN}
            />
          </View>
          <View style={styles.container}>
            <TextInput
              placeholderTextColor={COLOR.DIM_TEXT_COLOR}
              placeholder={i18n.t('HotelSearchCard.searchMessage')}
              value={destination}
              onChangeText={text => {
                // Trim leading and trailing spaces
                const trimmedText = text.trimStart();
                setDestination(trimmedText);
                debouncedSearch(trimmedText);
              }}
              style={[styles.searchBarTextInput]}
              keyboardShouldPersistTaps="handled"
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
            />
            <View style={styles.dropdownContainer}>
              {loadingCityDetails && showFlatList ? (
                <View style={styles.flatListStyle}>
                  <ActivityIndicator
                    size="large"
                    color={COLOR.PRIMARY}
                    style={styles.loader}
                  />
                </View>
              ) : (
                showFlatList &&
                cityDetails?.length > 0 && (
                  <FlatList
                    data={cityDetails}
                    style={styles.flatListStyle}
                    keyExtractor={(item, index) => index.toString()}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.cityItem}
                        onPress={() =>
                          handleFlatListPress(item.cityName, index)
                        }
                        activeOpacity={0.7}>
                        <Image
                          source={Images.DROPDOWN_LOCATION}
                          style={{
                            width: Matrics.s(30),
                            resizeMode: 'contain',
                            height: Matrics.s(30),
                          }}
                        />
                        <View>
                          <Text style={styles.cityName}>{item.cityName}</Text>
                          <Text style={styles.destinationName}>
                            {item.destinationName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )
              )}
            </View>
          </View>
        </View>
        {destination.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setDestination('');
              setShowFlatList(false);
            }}
            style={styles.crossIconContainer}
            activeOpacity={0.7}>
            <Image
              style={[styles.searchBarIcon, styles.closeIcon]}
              source={Images.CLOSE}
            />
          </TouchableOpacity>
        )}
      </View>
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
        style={styles.datePickerContainer}>
        <Image
          style={[styles.locationPinIcon, styles.searchBarIcon]}
          source={Images.PEOPLE}
        />
        <View>
          <Text
            style={[
              styles.date,
              {
                marginLeft: Matrics.s(5),
                color: COLOR.DIM_TEXT_COLOR,
              },
            ]}>{`${adults} ${i18n.t('Hotel.adult')}, ${pluaralChild} ${i18n.t(
            'Hotel.children',
          )} ${i18n.t('Hotel.and')} ${rooms} ${i18n.t('Hotel.room')} `}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.searchButtonContainer}
        onPress={handleSearchPress}
        disabled={loadingHotels}
        activeOpacity={0.7}>
        {loadingHotels ? (
          <View style={styles.searchBarIcon}>
            <ActivityIndicator size={'large'} color={COLOR.WHITE} />
          </View>
        ) : (
          <>
            <Image
              source={Images.SEARCH_GLASS}
              style={[styles.locationPinIcon, styles.searchBarIcon]}
            />
            <Text style={styles.searchBarText}>
              {i18n.t('HotelSearchCard.search')}
            </Text>
          </>
        )}
      </TouchableOpacity>
      {/* Date picker model */}
      <CalendarModal
        isVisible={showDatePicker}
        hotelStayStartDate={hotelStayStartDate}
        hotelStayEndDate={hotelStayEndDate}
        onClose={() => setShowDatePicker(false)}>
        <CalendarPicker
          allowRangeSelection={true}
          minDate={minDate}
          todayBackgroundColor={COLOR.PRIMARY}
          selectedDayColor={COLOR.PRIMARY}
          selectedDayTextColor={COLOR.WHITE}
          scrollable={true}
          monthTitleStyle={{
            fontFamily: typography.fontFamily.Montserrat.Bold,
            fontSize: typography.fontSizes.fs14,
          }}
          yearTitleStyle={{
            fontFamily: typography.fontFamily.Montserrat.Bold,
            fontSize: typography.fontSizes.fs14,
          }}
          textStyle={{
            fontFamily: typography.fontFamily.Montserrat.Medium,
          }}
          selectedStartDate={hotelStayStartDate}
          selectedEndDate={hotelStayEndDate}
          onDateChange={(date, type) => {
            if (type === 'START_DATE') {
              setHotelStayStartDate(date);
            } else if (type === 'END_DATE') {
              setHotelStayEndDate(date);
            }
          }}
         
        />
      </CalendarModal>
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.guestModalTitle}>Guests</Text>
          </View>
          <View style={styles.guestOptions}>
            <View>
              <Text style={styles.guestOptionsTitle}>Room</Text>
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
              <Text style={styles.guestOptionsTitle}>Adults</Text>
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
                borderBottomWidth: 1,
                borderBottomColor: COLOR.BORDER_COLOR,
                paddingVertical: Matrics.vs(8),
              },
            ]}>
            <View>
              <Text style={styles.guestOptionsTitle}>Children</Text>
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
          <TouchableOpacity
            style={{
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              paddingHorizontal: Matrics.s(10),
              paddingVertical: Matrics.vs(10),
              borderRadius: Matrics.s(5),
              marginTop: Matrics.vs(10),
            }}
            activeOpacity={0.7}
            onPress={() => setShowGuestsModal(false)}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs14,
                color: COLOR.WHITE,
                textAlign: 'center',
              }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginTop: Matrics.vs(10),
  },
  label: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    marginVertical: Matrics.vs(10),
  },
  datePickerModal: {
    // marginBottom: Matrics.vs(120),
  },
  mainContainer: {
    backgroundColor: COLOR.WHITE,
    marginHorizontal: Matrics.s(10),
    paddingHorizontal: Matrics.s(15),
    paddingVertical: Matrics.vs(18),
    borderRadius: Matrics.s(15),
    justifyContent: 'space-between',
    height: Matrics.vs(280),
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
    // backgroundColor: 'red',
    position: 'relative',
  },
  childrenAgeContainer: {
    gap: 5,
    marginTop: 5,
  },
  searchBarLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarTextInput: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.BLACK,
    marginLeft: I18nManager.isRTL ? 0 : -8,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  calendar: {
    width: Matrics.s(18),
    height: Matrics.s(18),
  },
  searchBarIcon: {
    resizeMode: 'contain',
  },
  locationPinIcon: {
    width: Matrics.s(20),
  },
  crossIconContainer: {
    position: 'absolute',
    right: 4,
    zIndex: 10,
    // backgroundColor: 'red',
  },
  closeIcon: {
    width: Matrics.s(25),
  },
  cardTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs24,
    color: COLOR.PRIMARY,
  },
  datePickerContainer: {
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    //     justifyContent: 'space-between',
    paddingHorizontal: Matrics.s(10),
    borderRadius: Matrics.s(5),
    height: Matrics.vs(45),
    // flex: 1,
  },
  dateAndPeoplePickerContainer: {
    // flexDirection: 'row',
    gap: 10,
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
    marginLeft: Matrics.screenWidth < 412 ? Matrics.s(10) : Matrics.s(10),
  },
  date: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.DARK_TEXT_COLOR,
    marginLeft: Matrics.screenWidth < 412 ? 0 : Matrics.s(5),
  },
  guestModalContainer: {
    backgroundColor: COLOR.WHITE,
    padding: Matrics.s(10),
    //     flex: 1,
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
  },
  modalStyle: {
    // justifyContent: 'flex-end',
    // position: 'absolute',
    // width: Matrics.screenWidth * 0.85,
    // top: 0,
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
    top: Matrics.vs(43),
    borderRadius: Matrics.s(10),
    height: Matrics.screenHeight * 0.4,
    zIndex: 1000,
    left: Matrics.s(-20),
  },
  flatListStyle: {
    backgroundColor: 'white',
    left: -15,
    paddingHorizontal: Matrics.s(20),
    // paddingVertical: Matrics.s(10),
    width: Matrics.screenWidth * 0.88,
    borderRadius: Matrics.s(10),
    height: '100%',
    marginHorizontal: 'auto',
    // zIndex: 100,
    // overflow: 'hidden',
  },
  cityItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_COLOR,
    paddingVertical: Matrics.vs(6),
    // marginBottom: Matrics.vs(10),
  },
  cityName: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs15,
  },
  destinationName: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  rightArrowIcon: {
    width: Matrics.s(20),
    height: Matrics.s(20),
    resizeMode: 'contain',
  },
  ageInput: {
    // backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
    borderRadius: Matrics.s(5),
    width: '30%',
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

export default HotelSearchCard;
