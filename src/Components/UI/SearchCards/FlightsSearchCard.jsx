import React, {useCallback, useEffect, useState} from 'react';
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
} from 'react-native';
import {Images} from '../../../Config';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import debounce from 'lodash/debounce';
/* --------------------------- External libraries --------------------------- */
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
import Modal from 'react-native-modal';

/* ------------------------------- Middlewares ------------------------------ */
import {getCityDetailsThunk} from '../../../Redux/Reducers/HotelReducer/GetCitySlice';
import {useDispatch, useSelector} from 'react-redux';
import {getAllHotelsThunk} from '../../../Redux/Reducers/HotelReducer/GetHotelSlice';
import {errorToast} from '../../../Helpers/ToastMessage';
const FlightsSearchCard = () => {
  const dispatch = useDispatch();
  /* --------------------------------- States --------------------------------- */
  const [hotelStayStartDate, setHotelStayStartDate] = useState(
    dayjs().add(1, 'day'),
  );
  const [hotelStayEndDate, setHotelStayEndDate] = useState(
    dayjs().add(2, 'day'),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [destination, setDestination] = useState('');
  const {cityDetails, loadingCityDetails} = useSelector(state => state.getCity);
  const {loadingHotels} = useSelector(state => state?.hotelSlice);
  const [selectedCityIndex, setSelectedCityIndex] = useState();
  const [showFlatList, setShowFlatList] = useState(false);

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
      setChildren(children + 1);
    } else if (action === 'decre' && children > 0) {
      setChildren(children - 1);
    }
  };
  const handlePets = action => {
    if (action === 'incre') {
      setPets(pets + 1);
    } else if (action === 'decre' && pets > 0) {
      setPets(pets - 1);
    }
  };

  const countGuests = () => {
    const totalGuest = adults + pets + children;
    setGuests(totalGuest);
  };

  const debouncedSearch = useCallback(
    debounce(async searchText => {
      if (searchText.length < 2) return;
      try {
        await dispatch(getCityDetailsThunk({cityName: searchText}));
      } catch (error) {
        console.error('Error getting hotel details', error);
      }
    }, 500),
    [getCityDetailsThunk],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  /* --------------------------- handle search press --------------------------- */
  const handleSearchPress = async () => {
    if (cityDetails.length === 0 || destination === '') {
      errorToast('Please select destination');
      return;
    }

    if (dayjs(hotelStayStartDate).isSameOrBefore(dayjs(), 'day')) {
      console.log('Inside hotel stay start date');
      errorToast('Check-in date must be a future date');
      return;
    }
    const stayDuration = dayjs
      .duration(dayjs(hotelStayEndDate).diff(dayjs(hotelStayStartDate)))
      .asDays();
    if (stayDuration > 20) {
      errorToast('Stay duration cannot be more than 20 days');
      return;
    }
    const detailsForDestinationSearch = {
      cityName: cityDetails[selectedCityIndex].cityName,
      destinationName: cityDetails[selectedCityIndex].destinationName,
      countryCode: cityDetails[selectedCityIndex].countryCode,
      countryName: cityDetails[selectedCityIndex].countryName,
      CheckInDate: dayjs(hotelStayStartDate).format('YYYY-MM-DD'),
      CheckOutDate: dayjs(hotelStayEndDate).format('YYYY-MM-DD'),
      RoomCount: rooms,
      RealTimeOccupancy: {
        AdultCount: adults,
        ChildCount: children,
        ChildAgeDetails: [],
      },
      Nationality: 'IN',
      Currency: 'INR',
    };
    const response = await dispatch(
      getAllHotelsThunk({details: detailsForDestinationSearch}),
    );
    if (response.error) {
      errorToast(response.payload);
    }
  };

  /* ------------------------- handle flastlist press ------------------------- */
  const handleFlatListPress = (cityName, index) => {
    setSelectedCityIndex(index);
    setDestination(cityName);
    setShowFlatList(false);
    // Keyboard.dismiss();
  };

  const handleFlatListShow = text => {
    if (text.length === 0) {
      setShowFlatList(false);
    } else {
      setShowFlatList(true);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.cardTitle}>Flights</Text>
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
              placeholder="Search Destination"
              value={destination}
              onChangeText={text => {
                setDestination(text);
                debouncedSearch(text);
                handleFlatListShow(text);
              }}
              onFocus={() => {
                setDestination('');
                setShowFlatList(false);
              }}
              style={styles.searchBarTextInput}
              keyboardShouldPersistTaps="handled"
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
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.cityItem}
                        onPress={() =>
                          handleFlatListPress(item.cityName, index)
                        }>
                        <Text style={styles.cityName}>{item.cityName}</Text>
                        <Text style={styles.destinationName}>
                          {item.destinationName}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setDestination('');
            setShowFlatList(false);
          }}
          style={styles.crossIconContainer}>
          <Image
            style={[styles.searchBarIcon, styles.closeIcon]}
            source={Images.CLOSE}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.dateAndPeoplePickerContainer}>
        <View style={styles.datePickerContainer}>
          <Image
            style={[styles.locationPinIcon, styles.searchBarIcon]}
            source={Images.CALENDAR}
          />
          <View style={styles.startEndDateContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.date}>
                {dayjs(hotelStayStartDate)?.format('D MMM')}
              </Text>
            </TouchableOpacity>
            <Text>-</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.date}>
                {dayjs(hotelStayEndDate).format('D MMM')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.datePickerContainer}>
          <Image
            style={[styles.locationPinIcon, styles.searchBarIcon]}
            source={Images.PEOPLE}
          />
          <TouchableOpacity onPress={() => setShowGuestsModal(true)}>
            <Text style={styles.date}>{`${guests} Guests`}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.searchButtonContainer}
        onPress={handleSearchPress}
        disabled={loadingHotels}>
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
            <Text style={styles.searchBarText}>Search</Text>
          </>
        )}
      </TouchableOpacity>
      {/* Date picker model */}
      <Modal
        isVisible={showDatePicker}
        onBackdropPress={() => setShowDatePicker(false)}>
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
            styles={datePickerStyles}
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
        style={styles.modalStyle}
        onModalHide={countGuests}>
        <View style={styles.guestModalContainer}>
          <View style={styles.hr} />
          <Text style={styles.guestModalTitle}>Guests</Text>
          <View style={styles.guestOptions}>
            <View>
              <Text style={styles.guestOptionsTitle}>Room</Text>
            </View>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity onPress={() => handleRooms('decre')}>
                <Image
                  source={Images.MINUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
              <Text style={styles.guestText}>{rooms}</Text>
              <TouchableOpacity onPress={() => handleRooms('incre')}>
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
              <TouchableOpacity onPress={() => handleAdults('decre')}>
                <Image
                  source={Images.MINUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
              <Text style={styles.guestText}>{adults}</Text>
              <TouchableOpacity onPress={() => handleAdults('incre')}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.guestOptions}>
            <View>
              <Text style={styles.guestOptionsTitle}>Children</Text>
            </View>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity onPress={() => handleChildren('decre')}>
                {children === 0 ? (
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
              {children === 0 ? (
                <Text style={styles.guestText}>-</Text>
              ) : (
                <Text style={styles.guestText}>{children}</Text>
              )}
              <TouchableOpacity onPress={() => handleChildren('incre')}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.guestOptionsLast}>
            <View>
              <Text style={styles.guestOptionsTitle}>Pets</Text>
            </View>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity onPress={() => handlePets('decre')}>
                {pets === 0 ? (
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
              {pets === 0 ? (
                <Text style={styles.guestText}>-</Text>
              ) : (
                <Text style={styles.guestText}>{pets}</Text>
              )}
              <TouchableOpacity onPress={() => handlePets('incre')}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    // backgroundColor: 'red',
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
    flex: 1,
  },
  dateAndPeoplePickerContainer: {
    flexDirection: 'row',
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
    gap: 5,
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
});
const datePickerStyles = StyleSheet.create({
  outside_label: {
    color: COLOR.DARK_TEXT_COLOR,
  },
  days: {
    backgroundColor: 'white',
    borderBottomRightRadius: Matrics.s(5),
    borderBottomLeftRadius: Matrics.s(5),
  },
  day_cell: {},

  day_label: {
    color: 'black',
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },

  weekdays: {
    //     display: 'none', // Hide week labels
    backgroundColor: COLOR.WHITE,
    height: Matrics.vs(30),
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
    backgroundColor: COLOR.RANGE_START,
  },
  selected_label: {
    color: 'white',
  },
  range_start: {
    backgroundColor: COLOR.RANGE_START,
  },
  range_middle: {
    backgroundColor: COLOR.RANGE_MIDDLE,
  },
  range_end: {
    backgroundColor: COLOR.RANGE_END,
  },
  range_start_label: {
    color: 'white',
  },
  range_end_label: {
    color: 'white',
  },
  range_middle_label: {
    color: 'white',
  },
  button_next: {
    backgroundColor: COLOR.PRIMARY,
    padding: Matrics.s(8),
    borderRadius: Matrics.s(10),
  },
  button_prev: {
    backgroundColor: COLOR.PRIMARY,
    padding: Matrics.s(8),
    borderRadius: Matrics.s(10),
  },
  today: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: Matrics.s(40),
  },
  today_label: {
    color: COLOR.WHITE,
  },
});

export default FlightsSearchCard;
