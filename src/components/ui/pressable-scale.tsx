import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PressSpring } from '@/constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** How small the element shrinks while pressed (1 = no shrink). */
  scaleTo?: number;
};

// A Pressable that shrinks slightly while held and springs back on release.
// The animation runs on the UI thread (via Reanimated), so it stays smooth.
export function PressableScale({ style, scaleTo = 0.96, onPressIn, onPressOut, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(event) => {
        scale.set(withSpring(scaleTo, PressSpring));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, PressSpring));
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}
