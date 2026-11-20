import { useEffect } from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius } from '@/constants/theme';

// A gently pulsing grey block, shown in place of content while it loads.
export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Fade to 45% and back, forever (-1 = repeat infinitely, true = reverse each time).
    opacity.set(withRepeat(withTiming(0.45, { duration: 800 }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return <Animated.View style={[styles.base, style, animatedStyle]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#e3e7ef',
    borderRadius: Radius.sm,
  },
});
