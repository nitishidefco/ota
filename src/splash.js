// Splash.js
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Images from './Config/Images';
import colors from './Config/AppStyling/colors';
import {Matrics, typography} from './Config/AppStyling';
import FastImage from 'react-native-fast-image';
const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 5000);
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.topElipseContainer}>
          <Image source={Images.TOP_ELIPSE} />
        </View>
        <FastImage
          source={Images.SPLASH_GIF}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.bottomElipseContainer}>
          <Image source={Images.BOTTOM_ELIPSE} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: Matrics.vs(350),
  },
  bottomElipseContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  topElipseContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Splash;
