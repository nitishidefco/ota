import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Images} from '../../Config';
import * as Progress from 'react-native-progress';
import {COLOR, typography} from '../../Config/AppStyling';
const EachStarRatingComponent = () => {
  return (
    <View>
      <View style={styles.oneCompleteBarContainer}>
        <Text style={styles.starIndexTitle}>5</Text>
        <Image style={styles.starIcon} source={Images.FULL_STAR} />
        <Progress.Bar
          progress={0.7}
          width={130}
          height={20}
          color={COLOR.PRIMARY}
        />
        <Text style={styles.ratingReceived}>15</Text>
      </View>
    </View>
  );
};

export default EachStarRatingComponent;
const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIndex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oneCompleteBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    margin: 'auto',
  },
  starIcon: {
    width: '30',
    height: '30',
    resizeMode: 'contain',
  },
  ratingReceived: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs18,
  },
  starIndexTitle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs18,
    color: COLOR.DIM_TEXT_COLOR,
  },
});
