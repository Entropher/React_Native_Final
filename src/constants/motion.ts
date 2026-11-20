import { FadeInDown, LinearTransition } from 'react-native-reanimated';

// Shared animation settings, so everything in the app moves with the same "feel".
// Reanimated automatically skips these when the phone's "Reduce motion" setting is on.

/** Spring used when a button is pressed down / released. */
export const PressSpring = { damping: 18, stiffness: 320 };

/** Smoothly moves items into their new position when a list changes (e.g. an item is removed). */
export const layoutTransition = LinearTransition.springify().damping(18).stiffness(160);

/** Fade + slide up, delayed by position so list items appear one after another. */
export const enterStaggered = (index: number) =>
  FadeInDown.delay(Math.min(index, 6) * 60)
    .springify()
    .damping(18)
    .stiffness(160);
