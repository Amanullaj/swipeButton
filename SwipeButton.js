import React from 'react';
import {StyleSheet, Image,} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import {useState} from 'react';
// import { images } from '../../constants/ConstantVariables';

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 1 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SwipeButton = ({onToggle}) => {
  // Animated value for X translation
  const X = useSharedValue(0);
  // Toggled State
  const [toggled, setToggled] = useState(false);

  // Fires when animation ends
  const handleComplete = (isToggled) => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      onToggle(isToggled);
    }
  };

  // Gesture Handler Events
  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = toggled;
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      }
    },
  });

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {};
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,

        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          ['#b7c4fc', '#b7c4fc'],
        ),
        transform: [{translateX: X.value}],
      };
    }),
    // swipeText: useAnimatedStyle(() => {
    //   return {
    //     opacity: interpolate(
    //       X.value,
    //       InterpolateXInput,
    //       [0.7, 0],
    //       Extrapolate.CLAMP,
    //     ),
    //     transform: [
    //       {
    //         translateX: interpolate(
    //           X.value,
    //           InterpolateXInput,
    //           [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
    //           Extrapolate.CLAMP,
    //         ),
    //       },
    //     ],
    //   };
    // }),
  };

  return (
    <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
      <AnimatedLinearGradient
        style={[AnimatedStyles.colorWave, styles.colorWave]}
        colors={[ '#b7c4fc','#ffd7f6',]}
        start={{x: 0.0, y: 0.5}}
        end={{x: 1, y: 0.5}}
      />
      <Animatable.View animation='shake' easing="ease-out" iterationCount="infinite" duration={9000} 
      style={{alignItems : 'center',justifyContent : 'center', position : 'absolute', left : 0,top : 7}}>
      <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>      
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>        
          {/* <Image source={images.newIcons.chevronRight} style={{height :20, width :20, alignSelf : 'center',top : 10}}/>           */}
        </Animated.View>      
      </PanGestureHandler>
      </GestureHandlerRootView>
      </Animatable.View>
      <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
      {'Slide to Request OTP '}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    backgroundColor: '#f3f3f3',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  colorWave: {
    position: 'absolute',
    left: 0,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT,
  },
  swipeable: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    zIndex: 0,
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 12,
    // fontWeight: 'bold',
    zIndex: 2,
    color: 'grey',
    marginLeft : 40
  },
});

export default SwipeButton;