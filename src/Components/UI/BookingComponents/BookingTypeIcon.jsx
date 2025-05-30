import {View, Text} from 'react-native';
import React from 'react';
import {Hotel, Plane, CarFront, TentTree} from 'lucide-react-native';
import {COLOR} from '../../../Config/AppStyling';

const BookingTypeIcon = ({bookingType}) => {
  const returnIcon = () => {
    switch (bookingType) {
      case 'hotel':
        return <Hotel color={COLOR.INACTIVE_COLOR} size={23} />;
      case 'flight':
        return <Plane color={COLOR.INACTIVE_COLOR} size={23} />;
      case 'car':
        return <CarFront color={COLOR.INACTIVE_COLOR} size={23} />;
      case 'tour':
        return <TentTree color={COLOR.INACTIVE_COLOR} size={23} />;
    }
  };
  return <View>{returnIcon()}</View>;
};

export default BookingTypeIcon;
