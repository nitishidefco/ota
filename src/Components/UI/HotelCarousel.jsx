import React, {useRef, useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Matrics} from '../../Config/AppStyling';
import {Images} from '../../Config';

const HotelCarousel = React.memo(({images}) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({item}) => (
    <View style={styles.slide}>
      <Image source={item} style={styles.image} resizeMode="cover" />
    </View>
  );

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
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}
        width={Matrics.screenWidth}
        height={280}
        data={images}
        renderItem={renderItem}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
        onSnapToItem={index => setActiveIndex(index)}
        style={styles.carousel}
      />
      <View style={styles.carouselControlsContainer}>
        <TouchableOpacity onPress={goToPrevious}>
          <Image
            source={Images.ARROW_BACK}
            width={Matrics.s(10)}
            height={Matrics.s(10)}
            style={styles.controlButtons}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext}>
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
    resizeMode: 'cover',
    height: Matrics.screenHeight * 0.3,
    borderRadius: Matrics.s(7),
  },
  carousel: {
    width: Matrics.screenWidth,
  },
  carouselContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  carouselControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Matrics.s(20),
    position: 'absolute',
    width: Matrics.screenWidth,
  },
  controlButtons: {
    width: Matrics.s(30),
    resizeMode: 'contain',
  },
});

export default HotelCarousel;
