import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

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
      <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
        {photoUri ? (
          <Image style={styles.photo} source={photoUri} contentFit="cover" />
        ) : (
          <Text style={styles.initials}>{initials}</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <PickerButton
          label="ფოტოს გადაღება"
          icon={<Camera size={16} color={Colors.brand} />}
          onPress={() => pickPhoto('camera')}
        />
        <PickerButton
          label="გალერეიდან არჩევა"
          icon={<ImageIcon size={16} color={Colors.brand} />}
          onPress={() => pickPhoto('library')}
        />
      </View>

      {error !== '' && (
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
      )}
    </View>
  );
}

function PickerButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
      accessibilityRole="button">
      {icon}
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 48,
    backgroundColor: '#e7edff',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#294bb3',
    fontSize: 28,
    fontWeight: '700',
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
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#c9d4f5',
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  buttonPressed: {
    backgroundColor: '#e7edff',
  },
  buttonText: {
    color: Colors.brand,
    fontSize: 13,
    fontWeight: '600',
  },
  error: {
    color: Colors.error,
    fontSize: 13,
    textAlign: 'center',
  },
  settingsLink: {
    color: Colors.brand,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
