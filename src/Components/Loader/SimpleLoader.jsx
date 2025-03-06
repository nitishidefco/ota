import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const SimpleLoader = () => {
  return (
    <View style={styles.simpleLoader}>
      <ActivityIndicator size={'large'} color={COLOR.PRIMARY} />
      <Text style={styles.loaderText}>Just a moment...</Text>
    </View>
  );
};

export default SimpleLoader;

const styles = StyleSheet.create({
  simpleLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    marginTop: Matrics.vs(10),
  },
});
