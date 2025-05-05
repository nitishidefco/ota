import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import FilterOption from './FilterOption'; // Import the FilterOption component
import {FilterContext} from '../../../Context/FilterContext';

const Ratings = ({panGestureRef}) => {
  const {selectedStars, setSelectedStars} = useContext(FilterContext);
  console.log('selectedStars', selectedStars);

  const handleStarPress = rating => {
    if (selectedStars.includes(rating)) {
      setSelectedStars(prevStars => prevStars.filter(star => star !== rating));
    } else {
      setSelectedStars(prevStars => [...prevStars, rating]);
    }
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.filterSortContainer}
      simultaneousHandlers={panGestureRef}>
      {['5', '4', '3', '2', '1'].map(rating => (
        <FilterOption
          key={rating}
          title={rating}
          handleStarPress={handleStarPress}
        />
      ))}
    </ScrollView>
  );
};

export default Ratings;

const styles = StyleSheet.create({
  filterSortContainer: {
    flexDirection: 'row',
    paddingHorizontal: Matrics.s(10),
    gap: Matrics.s(10),
    paddingVertical: Matrics.vs(15),
  },
});
