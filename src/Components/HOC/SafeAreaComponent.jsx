import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SafeAreaComponent = ({children, style, disable = false}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {flex: 1},
        !disable && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default SafeAreaComponent;
