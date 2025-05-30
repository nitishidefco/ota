import {View, Text} from 'react-native';
import React from 'react';
import {Plus} from 'lucide-react-native';
import {COLOR, typography} from '../../../Config/AppStyling';
const AddReviewCard = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
      <Plus color={COLOR.INACTIVE_COLOR} size={20}/>
      <Text
        style={{
          color: COLOR.INACTIVE_COLOR,
          fontFamily: typography.fontFamily.Montserrat.Medium,
        }}>
        Add Reviews
      </Text>
    </View>
  );
};

export default AddReviewCard;
