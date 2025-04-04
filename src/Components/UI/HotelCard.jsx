import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Images} from '../../Config';
import {useSelector} from 'react-redux';
import i18n from '../../i18n/i18n';

// Star Rating Component with Custom Icons
const StarRating = ({rating = 0, reviewCount = 0}) => {
  return (
    <View style={styles.ratingContainer}>
      <View
        style={{
          backgroundColor: COLOR.PRIMARY,
          flexDirection: 'row',
          paddingHorizontal: Matrics.s(10),
          paddingVertical: Matrics.vs(3),
          borderRadius: Matrics.s(4),
          alignItems: 'center',
        }}>
        <Text style={styles.ratingNumber}>{rating || 0}</Text>
        <Image
          source={Images.FULL_STAR_WHITE}
          style={{
            width: Matrics.s(17),
            resizeMode: 'contain',
            height: Matrics.vs(17),
          }}
        />
      </View>

      <Text style={styles.reviewCount}>({reviewCount || 0} reviews)</Text>
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
  // console.log('Hotel', hotel);
  const selectedCurrency = useSelector(
    state => state.currency.selectedCurrency,
  );
  const {
    imageSource,
    name,
    rating,
    reviewCount,
    amenities,
    price,
    originalPrice,
    currency = '$',
    category,
  } = hotel;
  const getCurrencySymbol = selectCurrency => {
    return selectCurrency === 'USD' || selectCurrency === 'CAD' ? '$' : '₹';
  };
  const renderStars = cate => {
    const totalStars = 5;
    const stars = [];

    for (let i = 0; i < cate; i++) {
      stars.push(
        <Image
          key={`purple-${i}`}
          source={Images.FULL_PURPLE_STAR}
          style={styles.starIcon}
        />,
      );
    }
    for (let i = cate; i < totalStars; i++) {
      stars.push(
        <Image
          key={`grey-${i}`}
          source={Images.FULL_GREY_STAR}
          style={styles.starIcon}
        />,
      );
    }
    return stars;
  };
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <FastImage
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <Text style={styles.hotelName}>
            <Text style={styles.nameText}>{name}</Text>
            <View style={{flexDirection: 'row'}}>{renderStars(category)}</View>
          </Text>
        </View>

        <StarRating rating={rating} reviewCount={reviewCount} />

        <View style={styles.amenitiesContainer}>
          {amenities?.length > 0 ? (
            amenities.map((amenity, index) => (
              <AmenityItem
                key={index}
                iconSource={icons.amenities[amenity]}
                name={amenity}
              />
            ))
          ) : (
            <Text style={styles.amenityText}>
              {i18n.t('HotelCard.noAmenityAvailable')}
            </Text>
          )}
          {}
        </View>

        <View style={styles.bookingContainer}>
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {getCurrencySymbol(selectedCurrency)}
                {price}
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

          <TouchableOpacity
            style={{
              width: '50%',
            }}
            onPress={onBookPress}
            activeOpacity={0.7}>
            <LinearGradient
              colors={['#8740AB', '#49225C']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.bookButton}>
              <Text style={styles.bookButtonText}>
                {i18n.t('HotelCard.bookNow')}
              </Text>
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
    margin: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageContainer: {
    padding: 13,
  },
  contentContainer: {
    paddingHorizontal: Matrics.s(15),
    paddingBottom: Matrics.vs(10),
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
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.WHITE,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 12,
    height: 12,
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
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLOR.BORDER_COLOR,
    borderWidth: 1,
    borderRadius: Matrics.s(5),
    paddingVertical: Matrics.vs(3),
    paddingRight: Matrics.s(4),
    paddingLeft: Matrics.s(5),
  },
  amenityIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginRight: Matrics.s(5),
  },
  amenityText: {
    fontSize: typography.fontSizes.fs12,
    color: '#666',
    // marginLeft: 6,
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  bookingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    height: Matrics.vs(45),
    justifyContent: 'center',
    marginTop: 6,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    marginRight: 12,
  },
});

export default HotelCard;
