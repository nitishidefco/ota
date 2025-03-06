import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import HotelSearchCard from '../../Components/UI/HotelSearchCard';
import HotelCard from '../../Components/UI/HotelCard';

const Hotels = () => {
  const [showSearchFlatList, setShowSearchFlatList] = useState(false);
  const {authData} = useSelector(state => state.auth);
  const hotelDataS = useSelector(state => state.hotelSlice);
  const {userProfileData} = useSelector(state => state.userProfile);
  const icons = {
    fullStar: Images.FULL_STAR,
    halfStar: Images.HALF_STAR,
    amenities: {
      'Air Condition': Images.AC,
      Parking: Images.PARKING,
      ATM: Images.ATM,
      '24H. Reception': Images.RECEPTION,
      'Free Wifi': Images.WIFI,
      Gym: Images.GYM,
    },
  };
  console.log('showSearchFaltList', showSearchFlatList);

  const formatHotelData = hotel => ({
    imageSource: Images.HOTEL_CARD_BACKGROUND,
    name: hotel.Name,
    rating: parseFloat(hotel.category),
    reviewCount: 0,
    amenities: [
      'Parking',
      'ATM',
      '24H. Reception',
      'Free Wifi',
      'Gym',
      'Air Condition',
    ],
    price: hotel.price,
    originalPrice: hotel.price * 1.15,
    currency: '$',
  });

  const renderHotelCard = ({item}) => (
    <HotelCard hotel={formatHotelData(item)} icons={icons} />
  );

  const renderHeader = () => (
    <View>
      <ImageBackground
        source={Images.PROFILE_BACKGROUND}
        imageStyle={styles.headerImageStyle}>
        <View style={styles.homeHeaderUpperContainer}>
          <View>
            <Text style={styles.homeHeaderTitle}>
              Hi {userProfileData?.name}
            </Text>
          </View>
          <View style={styles.homeHeaderSecondaryOptions}>
            <View style={styles.secondaryOptions}>
              <Image
                style={styles.secondaryOptionsImages}
                source={Images.TRANSLATE_ICON}
              />
            </View>
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
            We Give Best Service on Lowest Price
          </Text>
        </View>
        <View style={styles.homeTabContainer}>
          <View style={styles.homeTabs}>
            <Image style={styles.homeTabsImage} source={Images.HOTELS_ACTIVE} />
            <Text style={styles.homeTabsTitle}>Hotels</Text>
          </View>
          <View style={styles.homeTabs}>
            <Image
              style={styles.homeTabsImage}
              source={Images.TOURS_INACTIVE}
            />
            <Text style={styles.homeTabsTitle}>Tours</Text>
          </View>
          <View style={styles.homeTabs}>
            <Image
              style={styles.homeTabsImage}
              source={Images.FLIGHTS_INACTIVE}
            />
            <Text style={styles.homeTabsTitle}>Flights</Text>
          </View>
          <View style={styles.homeTabs}>
            <Image style={styles.homeTabsImage} source={Images.CARS_INACTIVE} />
            <Text style={styles.homeTabsTitle}>Car</Text>
          </View>
        </View>
      </ImageBackground>
      <HotelSearchCard setShowSearchFlatList={setShowSearchFlatList} />
    </View>
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView>
        <View>
          <ImageBackground
            source={Images.PROFILE_BACKGROUND}
            imageStyle={styles.headerImageStyle}>
            <View style={styles.homeHeaderUpperContainer}>
              <View>
                <Text style={styles.homeHeaderTitle}>
                  Hi {userProfileData?.name}
                </Text>
              </View>
              <View style={styles.homeHeaderSecondaryOptions}>
                <View style={styles.secondaryOptions}>
                  <Image
                    style={styles.secondaryOptionsImages}
                    source={Images.TRANSLATE_ICON}
                  />
                </View>
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
                We Give Best Service on Lowest Price
              </Text>
            </View>
            <View style={styles.homeTabContainer}>
              <View style={styles.homeTabs}>
                <Image
                  style={styles.homeTabsImage}
                  source={Images.HOTELS_ACTIVE}
                />
                <Text style={styles.homeTabsTitle}>Hotels</Text>
              </View>
              <View style={styles.homeTabs}>
                <Image
                  style={styles.homeTabsImage}
                  source={Images.TOURS_INACTIVE}
                />
                <Text style={styles.homeTabsTitle}>Tours</Text>
              </View>
              <View style={styles.homeTabs}>
                <Image
                  style={styles.homeTabsImage}
                  source={Images.FLIGHTS_INACTIVE}
                />
                <Text style={styles.homeTabsTitle}>Flights</Text>
              </View>
              <View style={styles.homeTabs}>
                <Image
                  style={styles.homeTabsImage}
                  source={Images.CARS_INACTIVE}
                />
                <Text style={styles.homeTabsTitle}>Car</Text>
              </View>
            </View>
          </ImageBackground>
          <HotelSearchCard />
        </View>
        <View style={{height: Matrics.screenHeight}}>
          <FlatList
            // ListHeaderComponent={renderHeader}
            data={hotelDataS.hotels}
            renderItem={renderHotelCard}
            keyExtractor={item => item.HotelID.toString()}
            // contentContainerStyle={{padding: 10}}
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
                <>
                  <View style={styles.emptyFlatListContainer}>
                    <Image
                      style={styles.emptyFlatListImage}
                      source={Images.EMPTY_FLAT_LIST}
                    />
                    <Text style={styles.emptyFlatListText}>
                      Search to find amazing hotels
                    </Text>
                  </View>
                </>
              )
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: 'none',
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
    marginTop: Matrics.vs(40),
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
