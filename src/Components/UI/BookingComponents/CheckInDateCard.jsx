import {View, Text} from 'react-native';
import React from 'react';
import {Calendar} from 'lucide-react-native';
import {COLOR, typography} from '../../../Config/AppStyling';
import dayjs from 'dayjs';

const CheckInDateCard = ({date}) => {
  const formattedDate = dayjs(date).format('D MMM YYYY');
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
      <Calendar color={COLOR.DARK_TEXT_COLOR} size={20} />
      <Text
        style={{
          fontFamily: typography.fontFamily.Montserrat.Medium,
          color: COLOR.DARK_TEXT_COLOR,
        }}>
        {formattedDate}
      </Text>
    </View>
  );
};

export default CheckInDateCard;
