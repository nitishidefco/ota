import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import HotelSearchCard from '../../Components/UI/SearchCards/HotelSearchCard';
import HotelCard from '../../Components/UI/HotelCard';
import LanguageSelector from '../../Components/UI/LanguageSelector';
import i18n from '../../i18n/i18n';
import {initializeLanguage} from '../../Redux/Reducers/LanguageSlice';
import TourSearchCard from '../../Components/UI/SearchCards/TourSearchCard';
import FlightsSearchCard from '../../Components/UI/SearchCards/FlightsSearchCard';
import CarSearchCard from '../../Components/UI/SearchCards/CarSearchCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import CurrencySelector from '../../Components/UI/CurrencySelector';
import {getUserProfileData} from '../../Redux/Reducers/UserProfileSlice';
import BottomSheet from '../../Components/UI/BottomSheet';
import {FilterContext} from '../../Context/FilterContext';
import Ratings from '../../Components/UI/FilterModal/Ratings';
import Amenities from '../../Components/UI/FilterModal/Amenities';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {errorToast} from '../../Helpers/ToastMessage';
import {RoomContext} from '../../Context/RoomContext';
import {getAllHotelsThunk, resetHotelState} from '../../Redux/Reducers/HotelReducer/GetHotelSlice';
import {HeaderOptionContext} from '../../Context/HeaderOptionContext';
import {TouchableWithoutFeedback} from '@gorhom/bottom-sheet';
const Hotels = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Hotels');
  const {userProfileData} = useSelector(state => state.userProfile);
  const hotelDataS = useSelector(state => state.hotelSlice);
  const {
    setShowFilterModal,
    showFilterModal,
    selectedStars,
    selectedAmenities,
    setSelectedStars,
    setSelectedAmenities,
  } = useContext(FilterContext);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const userToken = useSelector(state => state.auth.userToken);
  const contentToken = useSelector(state => state.contentToken.universalToken);
  const globalLanguage = useSelector(
    state => state.selectedLanguage.globalLanguage,
  );
  const selectedCurrency = useSelector(
    state => state.currency.selectedCurrency,
  );
  const {showModal, setShowModal, setShowCurrencyModal} =
    useContext(HeaderOptionContext);
  const getCity = useSelector(state => state.getCity);
  const cityDetails = useMemo(() => getCity.cityDetails, [getCity.cityDetails]);
  useEffect(() => {
    dispatch(getUserProfileData({userToken, contentToken}));
  }, []);

  const {
    hotelStayStartDate,
    hotelStayEndDate,
    rooms,
    adults,
    pluaralChild,
    selectedCityIndex,
    destination,
  } = useContext(RoomContext);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [globalLanguage, dispatch]);
  useEffect(() => {
    if (hotelDataS.hotels.length > 0) {
      setFilteredHotels(hotelDataS.hotels);
    }
  }, [hotelDataS.hotels]);
  const icons = {
    fullStar: Images.FULL_STAR,
    halfStar: Images.HALF_STAR,
    amenities: {
      'Air conditioning': Images.AC,
      Parking: Images.PARKING,
      ATM: Images.ATM,
      '24-hour reception': Images.RECEPTION,
      'Free Wifi': Images.WIFI,
      Gym: Images.GYM,
      'Hotel Safe': Images.SAFE,
      'Currency Exchange': Images.CURRENCY_EXCHANGE,
      Lifts: Images.CURRENCY_EXCHANGE,
      Café: Images.CAFE,
      'Newspaper kiosk': Images.KIOSK,
    },
  };
  const BASE_IMAGE_URL = 'https://giata.visionvivante.in/image?link=';
  const formatHotelData = hotel => {
    return {
      imageSource:
        hotel?.imageLinks?.length > 0 && hotel.imageLinks[0]
          ? {uri: `${BASE_IMAGE_URL}${hotel.imageLinks[0]}`}
          : Images.HOTEL_CARD_BACKGROUND,
      name: hotel.Name,
      rating: hotel?.rating,
      reviewCount: hotel?.total_reviews,
      amenities:
        hotel.facilities === null ? null : hotel?.facilities?.slice(0, 6),
      price: hotel.totalprice,
      currency: '$',
      category: hotel.category,
    };
  };

  const renderHotelCard = ({item}) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('HotelDetail', {
            provider: item.provider,
            hotelId: item.HotelID,
            GiataId: item.GiataId,
          })
        }>
        <HotelCard
          hotel={formatHotelData(item)}
          icons={icons}
          onBookPress={() =>
            navigation.navigate('HotelDetail', {
              provider: item.provider,
              hotelId: item.HotelID,
              giataId: item.GiataId,
            })
          }
        />
      </Pressable>
    );
  };

  // Custom Tab Component
  const renderTab = (title, activeIcon, inactiveIcon) => (
    <TouchableOpacity
      style={[
        styles.homeTabs,
        {
          backgroundColor: activeTab === title ? 'white' : 'transparent',
          paddingHorizontal:
            Matrics.screenWidth <= 360 ? Matrics.s(5) : Matrics.s(10),
          border: activeTab === title ? 'none' : '#864AA4',
        },
      ]}
      onPress={() => setActiveTab(title)}
      activeOpacity={0.7}>
      <Image
        style={styles.homeTabsImage}
        source={activeTab === title ? activeIcon : inactiveIcon}
      />
      <Text
        style={[
          styles.homeTabsTitle,
          {color: activeTab === title ? COLOR.PRIMARY : 'white'},
        ]}>
        {i18n.t(`Hotel.${title}`)}
      </Text>
    </TouchableOpacity>
  );
  const renderSearchCard = () => {
    switch (activeTab) {
      case 'Hotels':
        return <HotelSearchCard />;
      case 'Tours':
        return <TourSearchCard />;
      case 'Flights':
        return <FlightsSearchCard />;
      case 'Car':
        return <CarSearchCard />;
    }
  };

  /* --------------------- Details for destination search --------------------- */
  const detailsForDestinationSearch = {
    cityName: cityDetails?.[selectedCityIndex]?.cityName,
    destinationName: cityDetails?.[selectedCityIndex]?.destinationName,
    countryCode: cityDetails?.[selectedCityIndex]?.countryCode,
    countryName: cityDetails?.[selectedCityIndex]?.countryName,
    CheckInDate: dayjs(hotelStayStartDate).format('YYYY-MM-DD'),
    CheckOutDate: dayjs(hotelStayEndDate).format('YYYY-MM-DD'),
    RoomCount: rooms,
    RealTimeOccupancy: {
      AdultCount: adults,
      ChildCount: pluaralChild,
      ChildAgeDetails: [],
    },
    Nationality: 'IN',
    Currency: selectedCurrency ?? 'INR',
  };
  if (selectedStars && selectedStars.length > 0) {
    detailsForDestinationSearch.star_rating = selectedStars;
  }
  useEffect(() => {
    const refetchForCurrencyChange = async () => {
      // Only proceed if detailsForDestinationSearch exists
      if (detailsForDestinationSearch.cityName) {
        console.log('refetching for currency change');
        dispatch(resetHotelState());
        try {
          const response = await dispatch(
            getAllHotelsThunk({
              details: detailsForDestinationSearch,
            }),
          );

          // Optional: Handle the response if needed
          if (response.error) {
            console.error('Error fetching hotels:', response.payload);
            // Optionally show an error toast
            // errorToast(response.payload);
          }
        } catch (error) {
          console.error('Unexpected error while fetching hotels:', error);
          // Optionally show an error toast
          // errorToast('An unexpected error occurred. Please try again.');
        }
      }
    };

    refetchForCurrencyChange();
  }, [selectedCurrency]);

  const handleDonePress = async () => {
    if (cityDetails.length === 0 || destination === '') {
      const error = i18n.t('Toast.selectDestination');
      errorToast(error);
      return;
    }

    setShowFilterModal(false);

    try {
      let hotelsToFilter = [];

      if (selectedStars.length > 0) {
        const response = await dispatch(
          getAllHotelsThunk({
            details: detailsForDestinationSearch,
          }),
        );
        if (response.error) {
          errorToast(response.payload);
          return;
        }

        hotelsToFilter = response.payload?.hotels || hotelDataS.hotels || [];
      } else {
        const response = await dispatch(
          getAllHotelsThunk({details: detailsForDestinationSearch}),
        );
        if (response.error) {
          errorToast(response.payload);
          return;
        }
        hotelsToFilter = response.payload?.hotels || hotelDataS.hotels || [];
      }

      if (selectedAmenities.length > 0) {
        const filtered = hotelsToFilter.filter(hotel => {
          if (!hotel.facilities) {
            return false;
          }
          return selectedAmenities.every(amenity =>
            hotel.facilities.includes(amenity),
          );
        });
        setFilteredHotels(filtered);
      } else {
        setFilteredHotels(hotelsToFilter);
      }
    } catch (error) {
      errorToast('An unexpected error occurred. Please try again.');
      console.error('Error in handleDonePress:', error);
    }
  };

  const handleReset = async () => {
    setSelectedStars([]);
    setSelectedAmenities([]);
    setShowFilterModal(false);
    if (destination) {
      dispatch(getAllHotelsThunk({details: detailsForDestinationSearch}));
    }
  };
  const shortenTheName = name => {
    if (!name || typeof name !== 'string') {
      return '';
    }

    const firstName = name.split(' ')[0];

    if (name.length > 9) {
      return `${firstName.substring(0, 7)}...`;
    }

    return name;
  };

  return (
    <SafeAreaView>
      {showFilterModal && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            height: Matrics.screenHeight,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback
          onPress={() => {
            setShowModal(false);
            setShowCurrencyModal(false);
          }}>
          <View>
            <ImageBackground
              source={Images.PROFILE_BACKGROUND}
              imageStyle={styles.headerImageStyle}>
              <View style={styles.homeHeaderUpperContainer}>
                <View>
                  <Text style={styles.homeHeaderTitle}>
                    {i18n.t('Hotel.hi')} {shortenTheName(userProfileData?.name)}
                  </Text>
                </View>
                <View style={styles.homeHeaderSecondaryOptions}>
                  <LanguageSelector />
                  <CurrencySelector />
                  <View style={styles.secondaryOptions}>
                    <Image
                      style={styles.secondaryOptionsImages}
                      source={Images.DOTS}
                    />
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.homeHeaderSubtitle}>
                  {i18n.t('Hotel.bestService')}
                </Text>
              </View>
              <View style={styles.homeTabContainer}>
                {renderTab(
                  'Hotels',
                  Images.HOTELS_ACTIVE,
                  Images.HOTELS_INACTIVE,
                )}
                {renderTab('Tours', Images.TOURS_ACTIVE, Images.TOURS_INACTIVE)}
                {renderTab(
                  'Flights',
                  Images.FLIGHTS_ACTIVE,
                  Images.FLIGHTS_INACTIVE,
                )}
                {renderTab('Car', Images.CARS_ACTIVE, Images.CARS_INACTIVE)}
              </View>
            </ImageBackground>
            {renderSearchCard()}
          </View>
          <View style={styles.filterSortContainer}>
            <TouchableOpacity
              style={styles.filterSortItem}
              onPress={() => {
                setShowFilterModal(true);
                console.log('filtermodalPressed');
              }}
              disabled={filteredHotels.length === 0}>
              {filteredHotels.length > 0 ? (
                <Image
                  source={Images.FILTER_ACTIVE}
                  style={styles.filterImage}
                />
              ) : (
                <Image
                  source={Images.FILTER_INACTIVE}
                  style={styles.filterImage}
                />
              )}
              <Text
                style={[
                  styles.filterSortText,
                  {
                    color:
                      hotelDataS.hotels.length > 0
                        ? COLOR.PRIMARY
                        : COLOR.DARK_TEXT_COLOR,
                  },
                ]}>
                {i18n.t('Hotel.filter')}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.filterSortItem}
              disabled={hotelDataS.hotels.length === 0}>
              {hotelDataS.hotels.length > 0 ? (
                <Image
                  source={Images.SORT_ACTIVE}
                  style={styles.filterSortImage}
                />
              ) : (
                <Image
                  source={Images.SORT_INACTIVE}
                  style={styles.filterSortImage}
                />
              )}
              <Text
                style={[
                  styles.filterSortText,
                  {
                    color: hotelDataS.hotels.length > 0 ? COLOR.PRIMARY : COLOR.DARK_TEXT_COLOR,
                  },
                ]}>
                Sort
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={{height: Matrics.screenHeight}}>
            <FlatList
              data={activeTab === 'Hotels' ? filteredHotels : []}
              renderItem={renderHotelCard}
              keyExtractor={item => item.HotelID.toString()}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                hotelDataS.loadingHotels ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 200,
                    }}>
                    <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                  </View>
                ) : (
                  <View style={styles.emptyFlatListContainer}>
                    <Image
                      style={styles.emptyFlatListImage}
                      source={Images.NO_RESULT_FOUND}
                    />
                    <Text style={styles.emptyFlatListText}>
                      No Result Found
                    </Text>
                    <Text style={styles.emptyFlatListSubText}>
                      Try changing the dates of your search
                    </Text>
                  </View>
                )
              }
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <View
        style={{
          width: Matrics.screenWidth * 0.95,
          marginHorizontal: 'auto',
          zIndex: 1001,
        }}>
        <BottomSheet
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}>
          <View>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalHeaderTitle}>Filter</Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                {selectedAmenities?.length > 0 || selectedStars?.length > 0 ? (
                  <>
                    <Pressable
                      onPress={() => {
                        handleReset();
                      }}>
                      <Text style={styles.filterModalHeaderText}>Reset</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDonePress()}>
                      <Text style={styles.filterModalHeaderText}>Done</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable onPress={() => handleDonePress()}>
                      <Text style={styles.filterModalHeaderText}>Done</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
            <View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLOR.BORDER_COLOR,
                  width: '95%',
                  marginHorizontal: 'auto',
                }}>
                <Text style={styles.filterModalOptions}>Hotel Category</Text>
                <Ratings />
                {/* <Text>Heelo</Text> */}
              </View>
              <View
                style={{
                  width: '95%',
                  marginHorizontal: 'auto',
                  marginBottom: Matrics.vs(370),
                }}>
                <Text
                  style={[
                    styles.filterModalOptions,
                    {
                      marginTop: Matrics.vs(10),
                    },
                  ]}>
                  Hotel Amenity
                </Text>
                <Amenities />
              </View>
            </View>
          </View>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default Hotels;

const styles = StyleSheet.create({
  homeHeaderTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs22,
  },
  homeHeaderSubtitle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs14,
    marginHorizontal: Matrics.s(8),
    width: Matrics.screenWidth * 0.5,
  },
  homeHeaderSecondaryOptions: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginTop: Matrics.vs(10),
    zIndex: 1000,
  },
  homeHeaderUpperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Matrics.vs(5),
    marginHorizontal: Matrics.s(8),
  },
  secondaryOptionsImages: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  secondaryOptions: {
    paddingHorizontal: Matrics.s(6),
    paddingVertical: Matrics.vs(11),
  },
  headerImageStyle: {
    height: Matrics.screenHeight * 0.4,
  },
  homeTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#864AA4',
    borderRadius: Matrics.s(10),
    paddingHorizontal: Matrics.s(10),
    paddingVertical: Matrics.vs(8),
  },
  homeTabsImage: {
    resizeMode: 'contain',
    width: Matrics.s(15),
    height: Matrics.vs(15),
  },
  homeTabsTitle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.WHITE,
  },
  homeTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Matrics.s(10),
    marginTop: Matrics.vs(20),
    marginBottom: Matrics.vs(30),
  },
  emptyFlatListText: {
    fontSize: typography.fontSizes.fs18,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  emptyFlatListImage: {
    width: Matrics.s(100),
    height: Matrics.s(100),
    resizeMode: 'contain',
  },
  emptyFlatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Matrics.screenHeight * 0.3,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginHorizontal: Matrics.s(10),
    margin: 'auto',
    marginTop: Matrics.vs(10),
    width: Matrics.screenWidth * 0.7,
  },
  filterSortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  filterSortText: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: COLOR.PRIMARY,
    fontSize: typography.fontSizes.fs14,
  },
  filterSortImage: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  filterImage: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Matrics.s(10),
    paddingVertical: Matrics.vs(10),
  },
  filterModalHeaderText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.PRIMARY,
    fontSize: typography.fontSizes.fs14,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
    paddingHorizontal: Matrics.s(10),
    paddingVertical: Matrics.vs(5),
    borderRadius: Matrics.s(10),
  },
  filterModalHeaderTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs24,
    color: COLOR.PRIMARY,
  },
  filterModalOptions: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs14,
    color: COLOR.BLACK,
    paddingHorizontal: Matrics.s(10),
    // marginBottom: Matrics.vs(10),
  },
  emptyFlatListSubText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.DIM_TEXT_COLOR,
  },
});
