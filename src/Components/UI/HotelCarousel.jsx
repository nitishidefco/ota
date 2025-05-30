import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Matrics, COLOR} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {useNavigation} from '@react-navigation/native';

const BASE_API_URL = 'https://giata.visionvivante.in/image?link=';
const FALLBACK_IMAGES = [Images.HOTEL1, Images.HOTEL2, Images.HOTEL3];

const HotelCarousel = React.memo(({images}) => {
  const navigation = useNavigation();
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const [failedImages, setFailedImages] = useState(0);
  const [currentImages, setCurrentImages] = useState(() => {
    console.log('HotelCarousel received images prop:', images);
    // Filter out null/undefined and ensure we have valid URLs
    const filteredImages =
      images?.filter(
        item =>
          item !== null &&
          item !== undefined &&
          typeof item === 'string' &&
          item.trim() !== '',
      ) || [];
    return filteredImages.length > 0 ? filteredImages : FALLBACK_IMAGES;
  });

  // Process images: Always add BASE_API_URL to all URLs
  const processedImages = currentImages.map(item =>
    typeof item === 'string' ? `${BASE_API_URL}${item}` : item,
  );

  const handleImagePress = item => {
    console.log('Image pressed at index:', activeIndex);
    navigation.navigate('HotelImageGallery', {
      images: processedImages,
      initialIndex: activeIndex,
    });
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleImagePress(item)}
        style={styles.slide}>
        <Image
          source={typeof item === 'string' ? {uri: item} : item}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => {
            setLoadedImages(prev => {
              const newCount = prev + 1;
              if (newCount + failedImages === currentImages.length) {
                setLoading(false);
              }
              return newCount;
            });
          }}
          onError={error => {
            console.log(
              'Image Load Error for:',
              item,
              'Error:',
              error.nativeEvent.error,
            );
            setFailedImages(prev => {
              const newCount = prev + 1;
              if (newCount + loadedImages === currentImages.length) {
                setLoading(false);
                if (newCount === currentImages.length) {
                  console.log(
                    'All images failed, switching to fallback images',
                  );
                  setCurrentImages(FALLBACK_IMAGES);
                }
              }
              return newCount;
            });
          }}
        />
      </TouchableOpacity>
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

  // if (loading) {
  //   return (
  //     <View style={styles.carouselContainer}>
  //       <ActivityIndicator size="large" color={COLOR.PRIMARY} />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}
        width={Matrics.screenWidth}
        height={225}
        data={processedImages}
        renderItem={renderItem}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
        onSnapToItem={index => setActiveIndex(index)}
        style={styles.carousel}
      />
      <View style={styles.carouselControlsContainer}>
        <TouchableOpacity onPress={goToPrevious} activeOpacity={0.7}>
          <Image source={Images.ARROW_BACK} style={styles.controlButtons} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext} activeOpacity={0.7}>
          <Image source={Images.ARROW_NEXT} style={styles.controlButtons} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    borderRadius: Matrics.s(10),
    marginTop: Matrics.s(7),
  },
  image: {
    width: Matrics.screenWidth * 0.95,
    height: Matrics.screenHeight * 0.3,
    borderRadius: Matrics.s(7),
  },
  carousel: {
    width: Matrics.screenWidth,
  },
  carouselContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Matrics.s(20),
    position: 'absolute',
    width: Matrics.screenWidth,
    top: 100,
  },
  controlButtons: {
    width: Matrics.s(30),
    height: Matrics.s(30),
    resizeMode: 'contain',
  },
});

export default HotelCarousel;
