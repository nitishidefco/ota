import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  ScrollView as GestureScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {FilterContext} from '../../Context/FilterContext';
import {COLOR, Matrics} from '../../Config/AppStyling';

const BottomSheet = ({
  visible,
  onClose,
  children,
  backgroundColor = 'white',
}) => {
  const {showFilterModal, setShowFilterModal} = useContext(FilterContext);

  // Define modal heights
  const MINIMIZED_HEIGHT = Matrics.screenHeight * 0.4; // 40% of screen height
  const MAXIMIZED_HEIGHT = Matrics.screenHeight * 0.6; // 60% of screen height
  const HIDDEN_POSITION = MINIMIZED_HEIGHT; // Position when hidden (off-screen)

  // Reanimated shared values
  const translateY = useSharedValue(HIDDEN_POSITION); // Start off-screen
  const opacity = useSharedValue(0); // Start with opacity 0 (hidden)

  // Reference to the PanGestureHandler
  const panGestureRef = useRef(null);

  // Animation when showFilterModal changes
  useEffect(() => {
    if (visible) {
      // Show with slide-up and fade-in to minimized state (40% height)
      translateY.value = withTiming(0, {duration: 300}); // Slide to minimized position
      opacity.value = withTiming(1, {duration: 300}); // Fade in
    } else {
      // Hide with slide-down and fade-out
      translateY.value = withTiming(HIDDEN_POSITION, {duration: 300}); // Slide off-screen
      opacity.value = withTiming(0, {duration: 300}); // Fade out
    }
  }, [visible]);

  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startHeight = MINIMIZED_HEIGHT - translateY.value; // Store initial height
    },
    onActive: (event, ctx) => {
      let newHeight = ctx.startHeight - event.translationY;

      // Clamp the height between MINIMIZED and MAXIMIZED
      if (newHeight < MINIMIZED_HEIGHT) newHeight = MINIMIZED_HEIGHT;
      if (newHeight > MAXIMIZED_HEIGHT) newHeight = MAXIMIZED_HEIGHT;

      translateY.value = MINIMIZED_HEIGHT - newHeight; // Adjust height instead of position
    },
    onEnd: event => {
      if (event.translationY < -50) {
        translateY.value = withSpring(MINIMIZED_HEIGHT - MAXIMIZED_HEIGHT);
      } else if (event.translationY > 50) {
        if (event.translationY > 100) {
          translateY.value = withTiming(MINIMIZED_HEIGHT, {duration: 300});
          opacity.value = withTiming(0, {duration: 300}, () => {
            runOnJS(setShowFilterModal)(false);
          });
        } else {
          translateY.value = withSpring(0);
        }
      } else {
        if (translateY.value < -(MAXIMIZED_HEIGHT - MINIMIZED_HEIGHT) / 2) {
          translateY.value = withSpring(MINIMIZED_HEIGHT - MAXIMIZED_HEIGHT);
        } else {
          translateY.value = withSpring(0);
        }
      }
    },
  });

  // Animated style for the modal
  const animatedStyle = useAnimatedStyle(() => {
    const currentHeight = MINIMIZED_HEIGHT - translateY.value;

    return {
      opacity: opacity.value,
      height: Math.min(currentHeight, MAXIMIZED_HEIGHT), // Expands upwards
      transform: [{translateY: translateY.value > 0 ? translateY.value : 0}], // Moves down only when hiding
    };
  });

  // Only render the Animated.View when showFilterModal is true or during animation
  if (!showFilterModal) {
    return null;
  }

  return (
    <PanGestureHandler ref={panGestureRef} onGestureEvent={gestureHandler}>
      <Animated.View
        style={[styles.modalContent, animatedStyle, {backgroundColor}]}>
        <View style={styles.handle} />
        {React.Children.map(children, child =>
          React.cloneElement(child, {panGestureRef}),
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    backgroundColor: COLOR.WHITE,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});
