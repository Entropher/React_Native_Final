import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, Radius } from '@/constants/theme';

type Source = 'camera' | 'library';

type Props = {
  initials: string;
};

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

// Profile photo that can be taken with the camera or chosen from the gallery.
// Both need a runtime permission, which is requested the first time each button is used.
// Styled to sit on the blue gradient header of the Profile screen.
export function AvatarPicker({ initials }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  // True when the user permanently denied access, so only the Settings app can grant it.
  const [needsSettings, setNeedsSettings] = useState(false);

  const pickPhoto = async (source: Source) => {
    setError('');
    setNeedsSettings(false);

    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError(
        source === 'camera'
          ? 'კამერაზე წვდომა არ არის ნებადართული.'
          : 'ფოტოებზე წვდომა არ არის ნებადართული.',
      );
      setNeedsSettings(!permission.canAskAgain);
      return;
    }

    try {
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
          : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      // e.g. the iOS Simulator has no camera.
      setError('ფოტოს მიღება ვერ მოხერხდა.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarRing} importantForAccessibility="no-hide-descendants">
        <View style={styles.avatar}>
          {photoUri ? (
            <Animated.View key={photoUri} entering={FadeIn.duration(300)} style={styles.photo}>
              <Image style={styles.photo} source={photoUri} contentFit="cover" />
            </Animated.View>
          ) : (
            <Text style={styles.initials}>{initials}</Text>
          )}
        </View>
      </View>

      <View style={styles.buttons}>
        <PickerButton label="ფოტოს გადაღება" icon={Camera} onPress={() => pickPhoto('camera')} />
        <PickerButton
          label="გალერეიდან არჩევა"
          icon={ImageIcon}
          onPress={() => pickPhoto('library')}
        />
      </View>

      {error !== '' && (
        <Animated.View entering={FadeInDown.duration(200)} style={styles.errorPill}>
          <Text style={styles.error} accessibilityRole="alert">
            {error}
            {needsSettings && (
              <>
                {' '}
                <Text style={styles.settingsLink} onPress={() => Linking.openSettings()}>
                  პარამეტრების გახსნა
                </Text>
              </>
            )}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

function PickerButton({
  label,
  icon: Icon,
  onPress,
}: {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
}) {
  return (
    <PressableScale style={styles.button} onPress={onPress} accessibilityRole="button">
      <Icon size={15} color="#fff" />
      <Text style={styles.buttonText}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  avatar: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 52,
    backgroundColor: '#fff',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '800',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  errorPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#fff',
  },
  error: {
    color: Colors.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  settingsLink: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
