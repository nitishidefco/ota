import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ReviewCard from '../../../Components/UI/ReviewCard';
import {Matrics, typography} from '../../../Config/AppStyling';
import ReviewByPersonCard from '../../../Components/ReviewByPersonCard';
import {useSelector} from 'react-redux';

const HotelReviews = () => {
  const additionalDetails = useSelector(
    state => state?.hotelDetail?.additionalDetails,
  );

  return (
    <View style={styles.reviewContainer}>
      <Text style={styles.title}>Reviews</Text>
      <View style={styles.reivewVisuals}>
        <ReviewCard />
        {additionalDetails?.result?.reviews?.map((review, index) => {
          console.log('review', review);
          return (
            <ReviewByPersonCard
              key={index}
              username={review?.user?.username}
              reviewDate={review?.travel_date}
              reviewDescription={review?.text}
              ratingByUser={review?.rating}
            />
          );
        })}
      </View>
    </View>
  );
};

export default HotelReviews;
const styles = StyleSheet.create({
  reviewContainer: {
    padding: Matrics.s(16),
  },
  title: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs18,
    marginBottom: Matrics.vs(10),
    marginTop: Matrics.vs(10),
  },
});
