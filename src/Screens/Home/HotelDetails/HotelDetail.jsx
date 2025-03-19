import React, {useContext, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getHotelDetailsThunk} from '../../../Redux/Reducers/HotelReducer/GetHotelDetailSlice';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import {Images} from '../../../Config';
import {SafeAreaView} from 'react-native-safe-area-context';
import RoomCard from '../../../Components/UI/RoomCard';
import ModifyCard from '../../../Components/UI/ModifyCard';
import FacilitiesCard from '../../../Components/UI/FacilitiesCard';
import HotelCarousel from '../../../Components/UI/HotelCarousel';
import ReviewCard from '../../../Components/UI/ReviewCard';
import EachStarRatingComponent from '../../../Components/UI/EachStarRatingComponent';
import SimpleLoader from '../../../Components/Loader/SimpleLoader';
import CheckoutToast from '../../../Components/UI/CheckoutToast';
import {confirmPrice} from '../../../Redux/Reducers/HotelReducer/PriceConfirmSlice';
import { RoomContext } from '../../../Context/RoomContext';

const HotelDetail = ({route, navigation}) => {
  const dispatch = useDispatch();
    const {ratePlanId} = useContext(RoomContext);
  const {provider, hotelId, GiataId} = route.params;
  const hotelDetail = useSelector(state => state?.hotelDetail);
  const rooms = useSelector(state => state?.rooms);

  const images = [Images.HOTEL1, Images.HOTEL2, Images.HOTEL3];
  const listItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const details = useMemo(
    () =>
      GiataId ? {GiataId: GiataId} : {provider: provider, HotelID: hotelId},
    [GiataId, provider, hotelId],
  );
  const handleCheckoutPress = async () => {
    const detailsForPriceConfirm = {
      RatePlanID: ratePlanId,
      provider: provider,
      HotelID: hotelId,
      CheckInDate: '2025-03-20',
      CheckOutDate: '2025-03-21',
      RoomCount: 1,
      Nationality: 'US',
      Currency: 'USD',
      OccupancyDetails: [
        {
          ChildCount: 0,
          AdultCount: 1,
          RoomNum: 1,
        },
      ],
    };
    dispatch(confirmPrice({details: detailsForPriceConfirm}));
  };

  useEffect(() => {
    try {
      dispatch(getHotelDetailsThunk({details}));
    } catch (error) {
      console.error('Error getting hotel details', error);
    }
  }, [dispatch, details]);
  const renderEmptyList = () => {
    return <Text>No rooms right now</Text>;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <NormalHeader
            title="Detail Page"
            onCrossPress={() => navigation.goBack()}
            showLeftButton={true}
            showRightButton={false}
            leftIconName="BACK_ROUND"
          />
          <View>
            {hotelDetail?.loadingHotels ? (
              <View
                style={{
                  height: Matrics.screenHeight * 0.8,
                  justifyContent: 'center',
                }}>
                <SimpleLoader loadingText="Loading the hotel details" />
              </View>
            ) : (
              <>
                <View style={styles.mainCarouselContainer}>
                  {images?.length > 0 ? (
                    <HotelCarousel images={images} />
                  ) : (
                    <Text>No images available</Text>
                  )}
                </View>
                <View style={styles.hotelInfoContainer}>
                  <Text style={styles.hotelName}>
                    {hotelDetail?.hotel?.Name}
                  </Text>
                  <View style={styles.reviewsContainer}>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.Montserrat.Regular,
                        fontSize: typography.fontSizes.fs14,
                      }}>
                      4.2
                    </Text>
                    <View style={styles.starContainer}>
                      <Image
                        style={styles.startImages}
                        source={Images.FULL_STAR}
                      />
                      <Image
                        style={styles.startImages}
                        source={Images.FULL_STAR}
                      />
                      <Image
                        style={styles.startImages}
                        source={Images.FULL_STAR}
                      />
                      <Image
                        style={styles.startImages}
                        source={Images.FULL_STAR}
                      />
                      <Image
                        style={styles.startImages}
                        source={Images.HALF_STAR}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.Montserrat.Regular,
                          fontSize: typography.fontSizes.fs14,
                        }}>
                        (147)
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addressContainer}>
                    <Image
                      source={Images.LOCATION}
                      style={styles.locationPin}
                    />
                    <Text style={styles.hotelAddress}>
                      Abu Dhabi, United Arab Emirates
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingHorizontal: Matrics.s(16),
                    marginTop: Matrics.vs(25),
                  }}>
                  <ModifyCard provider={provider} hotelId={hotelId} />
                </View>
                <View style={{paddingHorizontal: Matrics.s(16)}}>
                  <Text style={styles.title}>Rooms</Text>
                  {rooms?.loadingRooms === false ? (
                    <FlatList
                      data={rooms.rooms}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => <RoomCard room={item} />}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ListEmptyComponent={renderEmptyList}
                      ItemSeparatorComponent={() => (
                        <View style={{width: 20}} />
                      )}
                    />
                  ) : (
                    <>
                      <SimpleLoader loadingText="Getting rooms for you" />
                    </>
                  )}
                </View>
                <View style={styles.amenitiesContainer}>
                  <Text style={styles.title}>Amenities</Text>
                  <View style={styles.facilitiesList}>
                    {hotelDetail?.hotel?.facilities?.length > 0 ? (
                      hotelDetail?.hotel?.facilities.map((facility, index) => {
                        return (
                          <FacilitiesCard
                            key={index}
                            icon={facility}
                            title={facility}
                          />
                        );
                      })
                    ) : (
                      <Text>No Facilities available</Text>
                    )}
                  </View>
                </View>
                <View style={styles.policiesContainer}>
                  <Text style={styles.title}>Policies</Text>
                  <View>
                    <Text>Property Policies</Text>
                    <Text>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Laudantium voluptas similique quasi, qui non libero
                      deleniti quaerat cumque, minima at aliquid aspernatur nemo
                      id, aut harum impedit quod sunt quibusdam molestias illo
                      sit. Minima dolore praesentium odit molestiae nemo
                      consequatur voluptas ipsum perferendis quibusdam!
                    </Text>
                    {listItems.map((item, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.text}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.reviewContainer}>
                  <Text style={styles.title}>Reviews</Text>
                  <View style={styles.reivewVisuals}>
                    <ReviewCard />
                    <View>
                      <EachStarRatingComponent />
                      <EachStarRatingComponent />
                      <EachStarRatingComponent />
                      <EachStarRatingComponent />
                      <EachStarRatingComponent />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <CheckoutToast handlePress={handleCheckoutPress} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Matrics.vs(20),
  },
  hotelInfoContainer: {
    paddingHorizontal: Matrics.s(16),
  },
  hotelName: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs24,
  },
  hotelAddress: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs14,
    color: '#666',
    flex: 1,
  },
  amenitiesContainer: {
    padding: Matrics.s(16),
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Matrics.s(8),
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: Matrics.vs(5),
  },
  locationPin: {
    resizeMode: 'contain',
    width: Matrics.s(15),
    height: Matrics.s(15),
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  startImages: {
    resizeMode: 'contain',
    height: Matrics.vs(14),
    width: Matrics.s(14),
  },
  starContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  title: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs18,
    marginBottom: Matrics.vs(10),
    marginTop: Matrics.vs(10),
  },
  reivewVisuals: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  policiesContainer: {
    padding: Matrics.s(16),
  },
  reviewContainer: {
    padding: Matrics.s(16),
    width: Matrics.screenWidth * 0.9,
  },
  modalStyle: {
    backgroundColor: COLOR.WHITE,
    width: Matrics.screenWidth * 0.9,
    flexDirection: 'row',
    paddingVertical: Matrics.vs(10),
    borderRadius: Matrics.s(5),
    paddingHorizontal: Matrics.s(5),
    justifyContent: 'space-between',
    position: 'relative',
  },
  modalParent: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'red',
  },
  selectedRoomText: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs16,
  },
});

export default HotelDetail;
