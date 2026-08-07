# I miss them, but...

A private, on-device app to help you heal after a breakup or painful falling-out — focused
entirely on the person doing the healing, not on the other person.

## Features

- **No-contact streak tracker** — counts days since last contact, with a compassionate,
  no-shame reset if you slip.
- **Guided journaling** — a rotating set of reflective prompts, with a private history of past
  entries.
- **Mood check-ins** — a daily emoji-based mood log with a 14-day trend view.
- **Coping toolkit** — CBT-style thought reframing, a guided "urge surfing" timer for moments you
  want to reach out, and unsent letters you write but never send.
- **Optional app lock** — Face ID / Touch ID / device passcode, powered entirely by the OS.
- **Privacy by design** — no accounts, no analytics, no backend. Everything lives in local app
  storage on your device. Export or wipe your data anytime from Settings.

## Tech stack

React Native + Expo (TypeScript), React Navigation, `@react-native-async-storage/async-storage`
for local persistence, `expo-local-authentication` for the optional app lock.

## Getting started

```bash
npm install
npm start        # then press i for iOS simulator, a for Android emulator, or scan the QR code
                  # in Expo Go on a physical device
```

## Building for the App Store / Play Store

This project uses [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```

### Before you submit

1. **Host the privacy policy and terms.** Store listings require a public URL — the simplest
   option is enabling GitHub Pages for this repo (Settings → Pages → deploy from `/docs`), which
   serves `docs/privacy-policy.html` and `docs/terms.html` as ready-to-use pages. The same content
   is also shown in-app under Settings.
2. **Play Console → App content → Data safety**: since the app collects no data at all, you can
   answer "No data collected" for every category.
3. **App Store Connect → App Privacy**: same answer — "Data Not Collected."
4. Update the bundle identifiers in `app.json` (`ios.bundleIdentifier`, `android.package`) if you
   want a different reverse-DNS name than `com.geniusmode.imissthembut`.
5. Replace the placeholder icons/splash assets in `/assets` with final artwork before submitting.

## Security & compliance notes

- No network requests are made by the app itself — all data operations are local.
- Biometric/passcode authentication is delegated entirely to the OS via
  `expo-local-authentication`; the app never sees or stores biometric data.
- `docs/privacy-policy.html` and `docs/terms.html`, plus the in-app equivalents in Settings,
  are written to satisfy Apple App Review and Google Play policy requirements for apps that
  handle sensitive personal reflections but collect no data off-device.
- The app includes an explicit in-app disclaimer and crisis-resources screen since this is a
  mental-health-adjacent tool, not a clinical or crisis service.
