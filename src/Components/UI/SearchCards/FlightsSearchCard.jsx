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
} from 'react-native';
import {Images} from '../../../Config';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import debounce from 'lodash/debounce';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {getCityDetailsThunk} from '../../../Redux/Reducers/HotelReducer/GetCitySlice'; // Assuming this can be reused for flights
import {errorToast} from '../../../Helpers/ToastMessage';

const FlightsSearchCard = () => {
  const dispatch = useDispatch();

  /* --------------------------------- States --------------------------------- */
  const [isRoundTrip, setIsRoundTrip] = useState(true); // Toggle between One Way and Round Trip
  const [departureDate, setDepartureDate] = useState(dayjs().add(1, 'day'));
  const [returnDate, setReturnDate] = useState(dayjs().add(2, 'day'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState(1); // Simplified guest count
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [focusedField, setFocusedField] = useState(null); // Track which field (from/to) is focused
  const [adults, setAdults] = useState(1); // Minimum 1 adult
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [infantsOnLap, setInfantsOnLap] = useState(0);
  const {cityDetails, loadingCityDetails} = useSelector(state => state.getCity);
  const [selectedFromCityIndex, setSelectedFromCityIndex] = useState(null);
  const [selectedToCityIndex, setSelectedToCityIndex] = useState(null);
  const [showFromFlatList, setShowFromFlatList] = useState(false);
  const [showToFlatList, setShowToFlatList] = useState(false);

  /* ------------------------------ Debounced Search ----------------------------- */
  const debouncedSearch = useCallback(
    debounce(async searchText => {
      if (searchText.length < 2) return;
      try {
        await dispatch(getCityDetailsThunk({cityName: searchText}));
      } catch (error) {
        console.error('Error getting city details', error);
      }
    }, 500),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /* ------------------------------ Handle Guests ----------------------------- */
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

  const handleInfants = action => {
    if (action === 'incre') {
      setInfants(infants + 1);
    } else if (action === 'decre' && infants > 0) {
      setInfants(infants - 1);
    }
  };

  const handleInfantsOnLap = action => {
    if (action === 'incre') {
      setInfantsOnLap(infantsOnLap + 1);
    } else if (action === 'decre' && infantsOnLap > 0) {
      setInfantsOnLap(infantsOnLap - 1);
    }
  };

  const calculateTotalGuests = () => {
    const total = adults + children + infants + infantsOnLap;
    setGuests(total);
  };

  /* --------------------------- Handle Search Press --------------------------- */
  const handleSearchPress = () => {
    if (!fromLocation || !toLocation) {
      errorToast('Please select both departure and arrival locations');
      return;
    }
    if (dayjs(departureDate).isSameOrBefore(dayjs(), 'day')) {
      errorToast('Departure date must be a future date');
      return;
    }
    if (isRoundTrip && dayjs(returnDate).isSameOrBefore(departureDate, 'day')) {
      errorToast('Return date must be after departure date');
      return;
    }
    // Add logic to dispatch flight search API here
    console.log('Searching flights:', {
      from: fromLocation,
      to: toLocation,
      departureDate: dayjs(departureDate).format('YYYY-MM-DD'),
      returnDate: isRoundTrip ? dayjs(returnDate).format('YYYY-MM-DD') : null,
      guests,
    });
  };

  /* ------------------------- Handle FlatList Press ------------------------- */
  const handleFlatListPress = (cityName, index, field) => {
    if (field === 'from') {
      setSelectedFromCityIndex(index);
      setFromLocation(cityName);
      setShowFromFlatList(false);
    } else {
      setSelectedToCityIndex(index);
      setToLocation(cityName);
      setShowToFlatList(false);
    }
  };

  const handleFlatListShow = (text, field) => {
    if (field === 'from') {
      setShowFromFlatList(text.length > 0);
    } else {
      setShowToFlatList(text.length > 0);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.cardTitle}>Flights</Text>
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isRoundTrip && styles.toggleButtonActive,
          ]}
          onPress={() => setIsRoundTrip(false)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.toggleText,
              !isRoundTrip && styles.toggleTextActive,
            ]}>
            One Way
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isRoundTrip && styles.toggleButtonActive,
          ]}
          onPress={() => setIsRoundTrip(true)}
          activeOpacity={0.7}>
          <Text
            style={[styles.toggleText, isRoundTrip && styles.toggleTextActive]}>
            Round Trip
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.searchBarContainer}>
          <Image
            style={[styles.locationPinIcon, styles.searchBarIcon]}
            source={Images.LOCATION_PIN}
          />
          <View style={styles.fromToContainer}>
            <TextInput
              style={[
                styles.searchBarTextInput,
                !fromLocation && styles.placeholderText,
              ]}
              placeholder="From"
              placeholderTextColor={COLOR.DIM_TEXT_COLOR}
              value={fromLocation}
              onChangeText={text => {
                setFromLocation(text);
                debouncedSearch(text);
                handleFlatListShow(text, 'from');
              }}
              onFocus={() => {
                setFocusedField('from');
                setFromLocation('');
                setShowFromFlatList(false);
              }}
            />
            <Image style={styles.swapIcon} source={Images.SWAP} />
            <TextInput
              style={[
                styles.searchBarTextInput,
                !toLocation && styles.placeholderText,
              ]}
              placeholder="To"
              placeholderTextColor={COLOR.DIM_TEXT_COLOR}
              value={toLocation}
              onChangeText={text => {
                setToLocation(text);
                debouncedSearch(text);
                handleFlatListShow(text, 'to');
              }}
              onFocus={() => {
                setFocusedField('to');
                setToLocation('');
                setShowToFlatList(false);
              }}
            />
          </View>
        </View>
        {focusedField && (
          <View style={styles.dropdownContainer}>
            {loadingCityDetails && (showFromFlatList || showToFlatList) ? (
              <View style={styles.flatListStyle}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
              </View>
            ) : (
              (showFromFlatList || showToFlatList) &&
              cityDetails?.length > 0 && (
                <FlatList
                  data={cityDetails}
                  style={styles.flatListStyle}
                  keyExtractor={(item, index) => index.toString()}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={styles.cityItem}
                      onPress={() =>
                        handleFlatListPress(item.cityName, index, focusedField)
                      }
                      activeOpacity={0.7}>
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
        )}
      </View>
      <View style={styles.dateAndPeoplePickerContainer}>
        <View style={styles.datePickerContainer}>
          <Image
            style={[styles.locationPinIcon, styles.searchBarIcon]}
            source={Images.CALENDAR}
          />
          <View style={styles.startEndDateContainer}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}>
              <Text style={styles.date}>
                {dayjs(departureDate).format('D MMM')}
              </Text>
            </TouchableOpacity>
            {isRoundTrip && (
              <>
                <Text>-</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}>
                  <Text style={styles.date}>
                    {dayjs(returnDate).format('D MMM')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={styles.datePickerContainer}>
          <Image
            style={[styles.locationPinIcon, styles.searchBarIcon]}
            source={Images.PEOPLE}
          />
          <TouchableOpacity
            onPress={() => setShowGuestsModal(true)}
            activeOpacity={0.7}>
            <Text style={styles.date}>{`${guests} Guests`}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.searchButtonContainer}
        onPress={handleSearchPress}
        activeOpacity={0.7}>
        <Image
          source={Images.SEARCH_GLASS}
          style={[styles.locationPinIcon, styles.searchBarIcon]}
        />
        <Text style={styles.searchBarText}>Search</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <Modal
        isVisible={showDatePicker}
        onBackdropPress={() => setShowDatePicker(false)}>
        <View>
          <DateTimePicker
            mode={isRoundTrip ? 'range' : 'single'}
            startDate={departureDate}
            endDate={isRoundTrip ? returnDate : null}
            onChange={({startDate, endDate}) => {
              setDepartureDate(startDate);
              if (isRoundTrip && endDate) {
                setReturnDate(endDate);
              }
            }}
            styles={datePickerStyles}
          />
        </View>
      </Modal>

      {/* Guests Modal */}
      <Modal
        isVisible={showGuestsModal}
        onBackdropPress={() => setShowGuestsModal(false)}
        onBackButtonPress={() => setShowGuestsModal(false)}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={styles.modalStyle}
        onModalHide={calculateTotalGuests}>
        <View style={styles.guestModalContainer}>
          <View style={styles.hr} />
          <Text style={styles.guestModalTitle}>Select Traveller</Text>
          <View style={styles.guestOptions}>
            <Text style={styles.guestOptionsTitle}>Adults</Text>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleAdults('decre')}
                activeOpacity={0.7}>
                {adults === 1 ? (
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
          <View style={styles.guestOptions}>
            <Text style={styles.guestOptionsTitle}>Children</Text>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleChildren('decre')}
                activeOpacity={0.7}>
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
              <Text style={styles.guestText}>
                {children === 0 ? '-' : children}
              </Text>
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
          <View style={styles.guestOptions}>
            <Text style={styles.guestOptionsTitle}>Infants</Text>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleInfants('decre')}
                activeOpacity={0.7}>
                {infants === 0 ? (
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
              <Text style={styles.guestText}>
                {infants === 0 ? '-' : infants}
              </Text>
              <TouchableOpacity
                onPress={() => handleInfants('incre')}
                activeOpacity={0.7}>
                <Image
                  source={Images.PLUS}
                  style={styles.guestOptionsControllerImages}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.guestOptionsLast}>
            <Text style={styles.guestOptionsTitle}>Infants (on lap)</Text>
            <View style={styles.guestOptionsTitleController}>
              <TouchableOpacity
                onPress={() => handleInfantsOnLap('decre')}
                activeOpacity={0.7}>
                {infantsOnLap === 0 ? (
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
              <Text style={styles.guestText}>
                {infantsOnLap === 0 ? '-' : infantsOnLap}
              </Text>
              <TouchableOpacity
                onPress={() => handleInfantsOnLap('incre')}
                activeOpacity={0.7}>
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: Matrics.vs(10),
  },
  toggleButton: {
    paddingVertical: Matrics.vs(5),
    paddingHorizontal: Matrics.s(15),
    marginRight: Matrics.s(10),
  },
  toggleButtonActive: {
    backgroundColor: COLOR.PRIMARY,
    borderColor: COLOR.PRIMARY,
    borderRadius: Matrics.s(5),
  },
  toggleText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.PRIMARY,
  },
  toggleTextActive: {
    color: COLOR.WHITE,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBarContainer: {
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Matrics.s(10),
    borderRadius: Matrics.s(5),
    height: Matrics.vs(45),
    flex: 1,
  },
  swapIcon: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    marginHorizontal: Matrics.s(5),
  },
  searchBarTextInput: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.BLACK,
    flex: 1,
  },
  searchBarIcon: {
    resizeMode: 'contain',
  },
  locationPinIcon: {
    width: Matrics.s(20),
    marginRight: Matrics.s(10),
  },
  cardTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs24,
    color: COLOR.PRIMARY,
    marginBottom: Matrics.vs(10),
  },
  datePickerContainer: {
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Matrics.s(10),
    borderRadius: Matrics.s(5),
    height: Matrics.vs(45),
    flex: 1,
  },
  dateAndPeoplePickerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: Matrics.vs(10),
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
    gap: 5,
  },
  date: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.DARK_TEXT_COLOR,
  },
  guestModalContainer: {
    backgroundColor: COLOR.WHITE,
    padding: Matrics.s(10),
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
    flex: 1,
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
  fromToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fromToTouchable: {
    flex: 1,
    paddingVertical: Matrics.vs(5),
  },
  placeholderText: {
    color: COLOR.DIM_TEXT_COLOR,
  },
  dropdownContainer: {
    position: 'absolute',
    top: Matrics.vs(50),
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  flatListStyle: {
    backgroundColor: 'white',
    paddingHorizontal: Matrics.s(20),
    paddingVertical: Matrics.s(10),
    borderRadius: Matrics.s(10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxHeight: Matrics.screenHeight * 0.4,
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
  day_label: {
    color: 'black',
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  weekdays: {
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
