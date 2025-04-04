import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {useSelector} from 'react-redux';

const ReviewCard = () => {
  const additionalDetails = useSelector(
    state => state?.hotelDetail?.additionalDetails,
  );
  return (
    <View style={styles.reviewCardContainer}>
      <View>
        <Text style={styles.starTextTemp}>Stars</Text>
      </View>
      <View style={styles.ratingValueContainer}>
        <Text style={styles.gotRating}>
          {additionalDetails?.result?.rating}
        </Text>
        <Text style={styles.totalRating}>/5</Text>
      </View>
      <View>
        <Text style={styles.contextText}>
          Bassed on {additionalDetails?.result?.total_reviews} review
        </Text>
      </View>
    </View>
  );
};

export default ReviewCard;
const styles = StyleSheet.create({
  reviewCardContainer: {
    backgroundColor: '#f6e4ff',
    width: Matrics.s(120),
    height: Matrics.s(120),
    borderRadius: Matrics.s(10),
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  starTextTemp: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs15,
    color: '#f6ce01',
  },
  gotRating: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs24,
    color: COLOR.PRIMARY,
  },
  totalRating: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs15,
    color: COLOR.DIM_TEXT_COLOR,
    marginLeft: Matrics.s(5),
  },
  contextText: {
    color: COLOR.DIM_TEXT_COLOR,
    fontSize: typography.fontSizes.fs15,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    width: Matrics.s(100),
    textAlign: 'center',
  },
  ratingValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
