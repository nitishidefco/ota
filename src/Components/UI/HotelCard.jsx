import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Matrics, typography} from '../../Config/AppStyling';
import LinearGradient from 'react-native-linear-gradient';

// Star Rating Component with Custom Icons
const StarRating = ({
  rating,
  reviewCount,
  fullStarIcon,
  halfStarIcon,
  emptyStarIcon,
  maxStars = 5,
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>

      <View style={styles.starsContainer}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Image
            key={`full-${i}`}
            source={fullStarIcon}
            style={styles.starIcon}
          />
        ))}

        {/* Half star if needed */}
        {halfStar && (
          <Image key="half" source={halfStarIcon} style={styles.starIcon} />
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Image
            key={`empty-${i}`}
            source={emptyStarIcon}
            style={styles.starIcon}
          />
        ))}
      </View>

      <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
    </View>
  );
};

// Amenity Item Component
const AmenityItem = ({iconSource, name}) => {
  return (
    <View style={styles.amenityItem}>
      <Image source={iconSource} style={styles.amenityIcon} />
      <Text style={styles.amenityText}>{name}</Text>
    </View>
  );
};

// Main Hotel Card Component
const HotelCard = ({hotel, icons, onBookPress}) => {
  const {
    imageSource,
    name,
    rating,
    reviewCount,
    amenities,
    price,
    originalPrice,
    currency = '$',
  } = hotel;

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <View style={styles.contentContainer}>
        <Text style={styles.hotelName}>{name}</Text>

        <StarRating
          rating={rating}
          reviewCount={reviewCount}
          fullStarIcon={icons.fullStar}
          halfStarIcon={icons.halfStar}
          emptyStarIcon={icons.emptyStar}
        />

        <View style={styles.amenitiesContainer}>
          {amenities.map((amenity, index) => (
            <AmenityItem
              key={index}
              iconSource={icons.amenities[amenity]}
              name={amenity}
            />
          ))}
        </View>

        <View style={styles.bookingContainer}>
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {currency}
                {Math.floor(price)}
              </Text>
              {originalPrice && (
                <Text style={styles.originalPrice}>
                  {currency}
                  {Math.floor(originalPrice)}
                </Text>
              )}
            </View>
            <Text style={styles.perNight}>1 Night (incl.VAT)</Text>
          </View>

          <TouchableOpacity style={{width: '60%', height:'100%', paddingHorizontal: Matrics.s(10)}} onPress={onBookPress}>
            <LinearGradient
              colors={['#8740AB', '#49225C']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 80,
    elevation: 3,
    margin: 16,
    overflow: 'hidden',
    // width: width - 32,
  },
  image: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  hotelName: {
    fontSize: 22,
    color: '#333',
    marginBottom: 8,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 16,
    marginRight: 4,
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 1,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    // justifyContent: 'space-around',
    rowGap: 5,
    gap: 13,
    // backgroundColor: 'green',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: '30%',
  },
  amenityIcon: {
    width: 20,
    height: 20,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  bookingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  price: {
    fontSize: 28,
    color: '#FFA500',
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  perNight: {
    fontSize: 14,
    color: '#999',
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  bookButton: {
    // paddingVertical: 12,
    // paddingHorizontal: 24,
    borderRadius: 8,
    height: Matrics.vs(35),
    justifyContent:'center'
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
});

export default HotelCard;
