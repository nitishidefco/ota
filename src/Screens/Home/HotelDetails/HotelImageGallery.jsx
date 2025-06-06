import React, {useCallback, useRef} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Matrics} from '../../../Config/AppStyling';

const renderItem = ({item}) => {
  const imageSource = typeof item === 'string' ? {uri: item} : item;
  return (
    <Image source={imageSource} style={styles.image} resizeMode="contain" />
  );
};

const HotelImageGallery = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {images, initialIndex = 0} = route.params;
  const gallery = useRef(null);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Gallery
        ref={gallery}
        data={images}
        keyExtractor={item => item}
        renderItem={renderItem}
        initialIndex={initialIndex}
        numToRender={3}
        doubleTapInterval={150}
        onSwipeToClose={goBack}
        onScaleEnd={scale => {
          if (scale < 0.8) {
            goBack();
          }
        }}
        initialScale={1}
        minScale={1}
        maxScale={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: Matrics.screenWidth,
    height: Matrics.screenHeight,
    backgroundColor: '#000',
  },
});

export default HotelImageGallery;
