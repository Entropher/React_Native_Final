# Fake Store (React Native)

A Georgian-language storefront app for iOS and Android, built with Expo and React Native. It is the mobile version of the [ReactJS_Final](https://github.com/Entropher/ReactJS_Final) Next.js web project: browse products from the Fake Store API, view product details, manage a shopping cart that survives app restarts, and try the mock login and registration flows.

## Features

- **Product catalog**: up to 20 products in a two-column grid, with loading skeletons, an error state, and a retry button
- **Product details**: image, category, star rating, description, and a sticky bar with the price and add-to-cart control
- **Cart**: add products, change quantities (capped at 10 per product), and remove items. Totals are always visible. The cart is saved with **AsyncStorage**, so it is still there after the app is closed and reopened
- **Temporary removal**: remove products from the catalog and restore them during the current session
- **Login**: React Hook Form with Yup validation, prefilled with the Fake Store API demo account (`johnd` / `m38rmF$`). Includes a show/hide password toggle and a **Remember me** checkbox. A remembered login is detected when you reopen the Login tab, which then offers "view profile" and "log out"
- **Registration**: React Hook Form with Yup validation for username, email, and password, plus a collapsible section of optional profile details
- **Profile**: demo user loaded from the Fake Store API. You can set a profile photo with the **camera** or from the **photo library**, which uses runtime permissions (see [Permissions](#permissions))
- **Animations and feel**: staggered list entrances, animated removal and reordering, press feedback on buttons, an add-to-cart button that morphs into a quantity stepper, animated form states, and haptic (vibration) feedback. Animations are skipped automatically when the device's "Reduce motion" setting is on

## Tech Stack

- Expo SDK 58, React Native 0.88, React 19
- TypeScript
- Expo Router (file-based navigation: bottom tabs and a stack)
- Redux Toolkit and React Redux (cart state)
- AsyncStorage (`@react-native-async-storage/async-storage`) for persisting the cart
- React Hook Form, Yup, and `@hookform/resolvers`
- Expo Secure Store (Remember me token)
- Expo Image Picker (camera and photo library)
- React Native Reanimated 4 (animations)
- Expo Haptics, Expo Image, Lucide React Native (icons)
- Fake Store API and DummyJSON mock API

## Screens

| Screen | File | Description |
| --- | --- | --- |
| Home (tab) | `src/app/(tabs)/index.tsx` | Product catalog and removed-products section |
| Product details | `src/app/product/[id].tsx` | Details for an individual product |
| Cart (tab) | `src/app/(tabs)/cart.tsx` | Cart contents, quantity controls, and totals |
| Profile (tab) | `src/app/(tabs)/profile.tsx` | Demo profile for Fake Store API user 3, with photo picker |
| Login (tab) | `src/app/(tabs)/login.tsx` | Mock login form with Remember me |
| Register | `src/app/register.tsx` | Validated registration form, opened from Login |

The bottom tab bar shows the number of items in the cart as a badge on the Cart tab.

## Data and Storage

- The catalog fetches `https://fakestoreapi.com/products`, and the details screen fetches `https://fakestoreapi.com/products/[id]`.
- The profile screen always shows the demo user at `https://fakestoreapi.com/users/3`.
- Login is sent to `https://fakestoreapi.com/auth/login`. With **Remember me** checked, the returned token is stored in Expo Secure Store (the iOS Keychain / Android Keystore). The token is only used to show the logged-in state on the Login tab; it does not protect screens or authorize other requests.
- Registration sends the username and email, plus any optional details provided, to `https://dummyjson.com/users/add`. The password is validated locally and is not sent. DummyJSON is a mock service and does not save the account; a successful response returns the user to the catalog.
- The **cart** is kept in Redux while the app runs and saved to AsyncStorage on every change (`src/store/cart-storage.ts`). It is loaded back when the app starts.
- Removed catalog products and the chosen profile photo are kept in memory only and reset when the app restarts.
- An internet connection is required to load products and the profile and to use the mock login and registration endpoints.

## Permissions

The profile photo feature uses `expo-image-picker`, which asks for permission at runtime the first time each option is used:

| Permission | Used for | iOS message |
| --- | --- | --- |
| Camera | "ფოტოს გადაღება" (take a photo) | Fake Store uses your camera to take a profile photo. |
| Photo library | "გალერეიდან არჩევა" (choose from gallery) | Fake Store uses your photo library to choose a profile photo. |

If permission is denied, an error message is shown. If it is denied permanently, the message includes a link to open the device settings. Microphone access is explicitly disabled because the app never records video. The permission messages are configured in `app.json`.

## Project Structure

```text
src/
├── app/                      # Screens (Expo Router: every file is a route)
│   ├── _layout.tsx           # Root stack, Redux provider, cart restore
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom tab bar
│   │   ├── index.tsx         # Home / catalog
│   │   ├── profile.tsx
│   │   ├── cart.tsx
│   │   └── login.tsx
│   ├── product/
│   │   └── [id].tsx          # Product details
│   └── register.tsx
├── components/
│   ├── ui/                   # Generic building blocks
│   │   ├── button.tsx
│   │   ├── empty-state.tsx
│   │   ├── pressable-scale.tsx
│   │   └── skeleton.tsx
│   ├── add-to-cart-button.tsx
│   ├── avatar-picker.tsx     # Camera / gallery photo picker (permissions)
│   ├── form-field.tsx        # TextInput connected to React Hook Form
│   ├── product-card.tsx
│   └── quantity-stepper.tsx
├── constants/
│   ├── theme.ts              # Colors, radii, shadows
│   ├── motion.ts             # Shared animation settings
│   └── auth-styles.ts        # Styles shared by login and register
├── store/
│   ├── store.ts              # Redux store and typed hooks
│   ├── cart-slice.ts         # Cart reducers and selectors
│   └── cart-storage.ts       # AsyncStorage persistence for the cart
└── types/
    └── product.ts
```

## Getting Started

Requirements: Node.js and the **Expo Go** app on an iOS or Android phone (or an iOS Simulator / Android emulator).

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to open the app. Every library used is included in Expo Go, so no custom build is needed for development. The camera option needs a real device, because the iOS Simulator has no camera.

## Available Scripts

```bash
npm start          # Start the Expo development server
npm run android    # Start and open on an Android device/emulator
npm run ios        # Start and open on an iOS simulator
npm run lint       # Run ESLint
npx tsc --noEmit   # Type-check the project
```

The app targets iOS and Android. It is not designed for the web: Expo Secure Store, used by Remember me, is not available in browsers.

## Building for the App Stores

The project is linked to an Expo (EAS) project in `app.json`. Builds are made in the cloud with EAS:

```bash
npx eas-cli@latest build --platform all
npx eas-cli@latest submit
```

Before the first store build, an iOS `bundleIdentifier` and an Android `package` name must be added to `app.json`.

This project is a learning/demo storefront, not a production e-commerce application.
