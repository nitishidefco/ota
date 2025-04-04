import {View, Text, Image} from 'react-native';
import React from 'react';
import {Images} from '../Config';
import {COLOR, Matrics, typography} from '../Config/AppStyling';

const ReviewByPersonCard = ({
  username,
  reviewDate,
  reviewDescription,
  ratingByUser,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
          marginTop: Matrics.vs(10),
        }}>
        <Image
          source={Images.FILL_DETAIL_PERSON}
          style={{
            width: Matrics.s(30),
            resizeMode: 'contain',
            height: Matrics.vs(30),
          }}
        />
        <View>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs16,
            }}>
            {username}
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.Medium,
              fontSize: typography.fontSizes.fs14,
              color: COLOR.DARK_TEXT_COLOR,
            }}>
            {reviewDate}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 2,
          borderBottomColor: COLOR.BORDER_COLOR,
          // marginTop: Matrics.vs(5),
          paddingBottom: Matrics.vs(10),
          gap: 6,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.Montserrat.Medium,
            fontSize: typography.fontSizes.fs14,
            color: COLOR.DARK_TEXT_COLOR,
          }}>
          {ratingByUser}
        </Text>
        <Image
          source={Images.FULL_STAR}
          style={{
            width: Matrics.s(15),
            resizeMode: 'contain',
            height: Matrics.vs(15),
          }}
        />
      </View>
      <View
        style={{
          marginTop: Matrics.vs(10),
        }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.Montserrat.Medium,
            fontSize: typography.fontSizes.fs14,
            color: COLOR.DARK_TEXT_COLOR,
          }}>
          {reviewDescription}
        </Text>
      </View>
    </View>
  );
};

export default ReviewByPersonCard;
