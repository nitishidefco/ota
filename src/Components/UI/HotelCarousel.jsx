import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Matrics} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {COLOR} from '../../Config/AppStyling';

const BASE_API_URL = 'https://giata.visionvivante.in/image?link=';

const HotelCarousel = React.memo(({images}) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [failedImages, setFailedImages] = useState(0);

  const processedImages = images.map(url => {
    const fullUrl = `${BASE_API_URL}${encodeURIComponent(url)}`;
    return fullUrl;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading Timeout: Images took too long to load');
        setLoading(false);
        setError('Images failed to load due to timeout');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

  const renderItem = ({item}) => {
    console.log('Render Item:', item);

    return (
      <View style={styles.slide}>
        <Image
          source={{uri: item}}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => {
            console.log('Image Loaded Successfully:', item);
            setLoadedImages(prev => {
              const newCount = prev + 1;
              if (newCount + failedImages === images.length) {
                setLoading(false);
              }
              return newCount;
            });
          }}
          onError={error => {
            console.log(
              'Image Load Error for URL:',
              item,
              'Error:',
              error.nativeEvent.error,
            );
            setFailedImages(prev => {
              const newCount = prev + 1;
              if (newCount + loadedImages === images.length) {
                setLoading(false);
                if (newCount === images.length) {
                  setError('All images failed to load');
                }
              }
              return newCount;
            });
          }}
          defaultSource={Images.ROOM_IMAGE_PLACEHOLDER}
        />
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

  if (loading) {
    return (
      <View style={styles.carouselContainer}>
        <ActivityIndicator size="large" color={COLOR.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.carouselContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
          <Image
            source={Images.ARROW_BACK}
            width={Matrics.s(10)}
            height={Matrics.s(10)}
            style={styles.controlButtons}
          />
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
    top: 60,
  },
  controlButtons: {
    width: Matrics.s(30),
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: Matrics.s(16),
    color: 'red',
    textAlign: 'center',
  },
});

export default HotelCarousel;
