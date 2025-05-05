import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import AmenityCard from './AmenityCard';

const RoomAmenities = ({hotelDetail}) => {
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const maxInitialFacilities = 6; // Limit to 6 facilities initially

  const facilities = hotelDetail?.roomfacilities || [];
  const displayedFacilities = showAllFacilities
    ? facilities
    : facilities.slice(0, maxInitialFacilities);

  const toggleFacilities = () => {
    setShowAllFacilities(!showAllFacilities);
  };
  return (
    <View style={{marginBottom: Matrics.s(20)}}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
        }}>
        {displayedFacilities.map((facility, index) => {
          console.log('Facility', facility);
          return (
            <View key={index}>
              <AmenityCard title={facility} />
            </View>
          );
        })}
        {facilities.length > maxInitialFacilities && (
          <Pressable
            style={{
              backgroundColor: COLOR.PRIMARY,
              borderRadius: Matrics.s(10),
              paddingHorizontal: Matrics.s(10),
              paddingVertical: Matrics.vs(5),
              marginTop: Matrics.vs(5),
            }}
            onPress={toggleFacilities}>
            <Text
              style={{
                color: '#fff', // White text for contrast on primary background
                fontFamily: typography.fontFamily.Montserrat.Regular,
                fontSize: typography.fontSizes.fs14, // Adjust size as needed
              }}>
              {showAllFacilities ? 'See Less' : 'See More'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default RoomAmenities;
