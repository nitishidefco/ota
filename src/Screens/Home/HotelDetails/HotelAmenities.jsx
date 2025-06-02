import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import i18n from '../../../i18n/i18n';
import AmenityCard from '../../../Components/UI/AmenityCard';

const HotelAmenities = ({hotelDetail}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const maxLength = 200; 

  const paragraph = hotelDetail?.content?.section[1].para || '';
  const isLongText = paragraph.length > maxLength;

  const truncatedText =
    isLongText && !isExpanded
      ? `${paragraph.substring(0, maxLength)}...`
      : paragraph;

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const maxInitialFacilities = 6;

  const facilities = hotelDetail?.facilities || [];
  const displayedFacilities = showAllFacilities
    ? facilities
    : facilities.slice(0, maxInitialFacilities);
console.log(displayedFacilities);

  const toggleFacilities = () => {
    setShowAllFacilities(!showAllFacilities);
  };
  return (
    <View
      style={{
        paddingHorizontal: Matrics.s(20),
        marginVertical: Matrics.vs(15),
      }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.Montserrat.Bold,
          fontSize: typography.fontSizes.fs18,
          marginBottom: Matrics.vs(3),
        }}>
        {i18n.t('hotelDetails.hotelAmenities')}
      </Text>
      <Text
        style={{
          color: COLOR.DARK_TEXT_COLOR,
          fontFamily: typography.fontFamily.Montserrat.Medium,
          fontSize: typography.fontSizes.fs14,
        }}>
        {!truncatedText  ? <>No details avaliable</> : truncatedText}
      </Text>
      {isLongText && (
        <Pressable onPress={toggleText}>
          <Text
            style={{
              color: COLOR.PRIMARY,
              fontFamily: typography.fontFamily.Montserrat.Medium,
              fontSize: typography.fontSizes.fs14,
              marginTop: Matrics.vs(5),
            }}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </Pressable>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
          marginTop: Matrics.vs(10),
        }}>
        {displayedFacilities.map((facility, index) => {
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
                color: '#fff', 
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

export default HotelAmenities;
