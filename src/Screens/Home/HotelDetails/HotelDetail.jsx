import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {getHotelDetailsThunk} from '../../../Redux/Reducers/HotelReducer/GetHotelDetailSlice';
import {useDispatch, useSelector} from 'react-redux';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {Matrics} from '../../../Config/AppStyling';
import Carousel from 'react-native-reanimated-carousel';
import {Images} from '../../../Config';
import {FlatList} from 'react-native-gesture-handler';

const HotelDetail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {provider, hotelId, GiataId} = route.params;
  const hotelDetail = useSelector(state => state?.hotelDetail);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Use hotel images from API if available, otherwise use default images
  const images = [Images.HOTEL1, Images.HOTEL2, Images.HOTEL3];
  console.log('Images', images);

  const details = useMemo(
    () =>
      GiataId
        ? {
            GiataId: GiataId,
          }
        : {
            provider: provider,
            HotelID: hotelId,
          },
    [GiataId, provider, hotelId],
  );

  useEffect(() => {
    try {
      dispatch(getHotelDetailsThunk({details}));
    } catch (error) {
      console.error('Error getting hotel details', error);
    }
  }, [dispatch, details]);

  const renderItem = ({item}) => {
    console.log('Item', item);

    return (
      <View style={styles.slide}>
        <Image source={item} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <NormalHeader
          title="Hotel Details"
          onCrossPress={() => navigation.goBack()}
          showLeftButton={true}
          showRightButton={false}
          leftIconName="BACK_ROUND"
        />
        <View>
          {hotelDetail?.loadingHotels ? (
            <Text>Loading</Text>
          ) : (
            <>
              <View style={styles.hotelInfoContainer}>
                <Text style={styles.hotelName}>{hotelDetail?.hotel?.Name}</Text>
                <Text style={styles.hotelAddress}>
                  {hotelDetail?.hotel?.address}
                </Text>
              </View>

              <View>
                {images?.length > 0 ? (
                  <View style={styles.carouselContainer}>
                    <Carousel
                      ref={carouselRef}
                      width={Matrics.screenWidth * 0.8}
                      height={200}
                      data={images}
                      renderItem={renderItem}
                      loop={true}
                      autoPlay={true}
                      autoPlayInterval={3000}
                      onSnapToItem={index => setActiveIndex(index)}
                      style={styles.carousel}
                    />
                    {/* <Carousel /> */}
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          activeIndex === 0 && styles.disabledButton,
                        ]}
                        onPress={goToPrevious}
                        disabled={
                          activeIndex === 0 && !carouselRef.current?.loop
                        }>
                        <Text style={styles.buttonText}>Previous</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          activeIndex === images?.length - 1 &&
                            styles.disabledButton,
                        ]}
                        onPress={goToNext}
                        disabled={
                          activeIndex === images?.length - 1 &&
                          !carouselRef.current?.loop
                        }>
                        <Text style={styles.buttonText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text>No images available</Text>
                )}
              </View>
              <View style={styles.amenitiesContainer}>
                <Text style={styles.amenitiesTitle}>Amenities</Text>
                <View style={styles.facilitiesList}>
                  {hotelDetail?.hotel?.facilities?.map((item, index) => (
                    <Text key={index} style={styles.facilityItem}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HotelDetail;

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
    padding: Matrics.s(16),
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Matrics.vs(8),
  },
  hotelAddress: {
    fontSize: 16,
    color: '#666',
  },
  carouselContainer: {
    alignItems: 'center',
    marginVertical: Matrics.vs(16),
  },
  slide: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Matrics.s(16),
  },
  image: {
    width: Matrics.screenWidth,
    resizeMode: 'cover',
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: Matrics.vs(16),
  },
  button: {
    backgroundColor: '#007AFF',
    padding: Matrics.s(10),
    borderRadius: Matrics.s(8),
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  amenitiesContainer: {
    padding: Matrics.s(16),
  },
  amenitiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Matrics.vs(12),
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Matrics.s(8),
  },
  facilityItem: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: Matrics.s(8),
    borderRadius: Matrics.s(4),
  },
  carousel: {
    width: Matrics.screenWidth,
  },
});
