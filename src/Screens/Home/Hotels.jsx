import React, {useEffect, useState} from 'react';
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

const Hotels = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Hotels');
  const {userProfileData} = useSelector(state => state.userProfile);
  const hotelDataS = useSelector(state => state.hotelSlice);

  const globalLanguage = useSelector(
    state => state.selectedLanguage.globalLanguage,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [globalLanguage, dispatch]);
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
      Café: Images.CASH_ICON,
      'Newspaper kiosk': Images.KIOSK,
    },
  };

  const formatHotelData = hotel => {
    return {
      imageSource: Images.HOTEL_CARD_BACKGROUND,
      name: hotel.Name,
      rating: parseFloat(hotel.category),
      reviewCount: 0,
      amenities:
        hotel.facilities === null ? null : hotel?.facilities?.slice(0, 6),
      price: hotel.price,
      originalPrice: hotel.totalprice,
      currency: '$',
    };
  };

  const renderHotelCard = ({item}) => (
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
          navigation.navigate('HotelBooking', {
            provider: item.provider,
            hotelId: item.HotelID,
            giataId: item.GiataId,
          })
        }
      />
    </Pressable>
  );

  // Custom Tab Component
  const renderTab = (title, activeIcon, inactiveIcon) => (
    <TouchableOpacity
      style={[
        styles.homeTabs,
        {
          backgroundColor: activeTab === title ? 'white' : COLOR.PRIMARY, // Change background based on activeTab
        },
      ]}
      onPress={() => setActiveTab(title)}>
      <Image
        style={styles.homeTabsImage}
        source={activeTab === title ? activeIcon : inactiveIcon}
      />
      <Text
        style={[
          styles.homeTabsTitle,
          {color: activeTab === title ? COLOR.PRIMARY : 'white'}, // Active: COLOR.PRIMARY, Inactive: white
        ]}>
        {title}
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
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <ImageBackground
            source={Images.PROFILE_BACKGROUND}
            imageStyle={styles.headerImageStyle}>
            <View style={styles.homeHeaderUpperContainer}>
              <View>
                <Text style={styles.homeHeaderTitle}>
                  {i18n.t('Hotel.hi')} {userProfileData?.name}
                </Text>
              </View>
              <View style={styles.homeHeaderSecondaryOptions}>
                <LanguageSelector />
                <View style={styles.secondaryOptions}>
                  <Image
                    style={styles.secondaryOptionsImages}
                    source={Images.CASH_ICON}
                  />
                </View>
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
        <View style={{height: Matrics.screenHeight}}>
          <FlatList
            data={activeTab === 'Hotels' ? hotelDataS.hotels : []}
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
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                <View style={styles.emptyFlatListContainer}>
                  <Image
                    style={styles.emptyFlatListImage}
                    source={Images.EMPTY_FLAT_LIST}
                  />
                  <Text style={styles.emptyFlatListText}>
                    Search to find amazing {activeTab.toLowerCase()}
                  </Text>
                </View>
              )
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Hotels;

const styles = StyleSheet.create({
  homeHeaderTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs24,
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
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: Matrics.s(12),
    paddingVertical: Matrics.vs(7),
    borderRadius: Matrics.s(10),
    borderColor: COLOR.DIM_TEXT_COLOR,
    borderWidth: 1,
  },
  headerImageStyle: {
    height: Matrics.screenHeight * 0.4,
  },
  homeTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
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
});
