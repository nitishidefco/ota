import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {COLOR} from '../../Config/AppStyling';

const CustomStatusBar = () => {
  return (
    <StatusBar
      backgroundColor={COLOR.PRIMARY}
      barStyle="light-content"
      translucent={Platform.OS === 'android'}
    />
  );
};

export default CustomStatusBar;
