import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {StyleSheet, View} from 'react-native';
import {COLOR, Matrics} from '../../Config/AppStyling';

const KeyboardAwareScrollViewBoilerplate = ({
  children,
  headerComponent,
  footerComponent,
  backgroundColor,
}) => {
  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <BottomSheetModalProvider>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {headerComponent && (
            <View style={styles.headerContainer}>{headerComponent}</View>
          )}
          <View style={styles.contentContainer}>{children}</View>
          {footerComponent && (
            <View style={styles.footerContainer}>{footerComponent}</View>
          )}
        </KeyboardAwareScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Matrics.vs(20),
  },
  headerContainer: {
    // marginBottom: Matrics.vs(10),
  },
  contentContainer: {
    // paddingHorizontal: Matrics.s(8),
  },
  footerContainer: {
    paddingHorizontal: Matrics.s(8),
    marginTop: Matrics.vs(10),
  },
});

export default KeyboardAwareScrollViewBoilerplate;
