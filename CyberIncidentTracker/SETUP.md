# Quick Setup Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
cd CyberIncidentTracker
npm install
```

### 2. Install Expo CLI (if not already installed)
```bash
npm install -g expo-cli
```

### 3. Start the App
```bash
npm start
```

### 4. Run on Your Device

#### Option A: Physical Device
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal or browser
3. App will load on your device

#### Option B: Emulator/Simulator
- **iOS**: Press `i` in terminal (requires Xcode on macOS)
- **Android**: Press `a` in terminal (requires Android Studio)
- **Web**: Press `w` in terminal

## Troubleshooting

### Port Already in Use
```bash
expo start --port 19001
```

### Cache Issues
```bash
npm start -- --clear
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### Watchman Issues (macOS)
```bash
brew install watchman
```

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Note
For production builds, you'll need an Expo account. Run `expo login` first.

## Next Steps

1. Customize the app theme in `App.js`
2. Add your organization's branding
3. Configure push notifications (if needed)
4. Set up cloud backup (optional)

Happy incident tracking! 🔒
