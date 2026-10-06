# Neon Drop

Neon Drop is an offline mobile block puzzle game by Arcana. It includes touch controls, hold and ghost-piece helpers, sound effects, light and dark themes, and ten supported languages.

## Play locally

Open `outputs/neon-drop.html` in a modern browser. The game is self-contained and does not require a server or network connection.

## Android

- Package: `com.arcana.neondrop`
- Minimum Android version: Android 8.0 (API 26)
- Target SDK: 36
- Latest release: version 1.0.7, version code 8
- Latest Google Play bundle: `outputs/neon-drop-com.arcana.neondrop-1.0.7.aab`

Android source is under `work/android`. The upload key and signing passwords are intentionally excluded from this repository.

## Build the web game

```powershell
node work/build.cjs
```

The generated game is written to `outputs/neon-drop.html`.

## Tests

```powershell
node work/test.cjs
node work/browser-test.cjs
node work/input-test.cjs
node work/sound-test.cjs
node work/settings-test.cjs
```

## Store assets

Google Play artwork and phone screenshots are available in `outputs`, including the 512×512 icon, 1024×500 feature graphic, and 1080×1920 screenshots.

## Privacy

Neon Drop has no ads, accounts, analytics, or data collection. Game preferences and the best score are stored locally on the device.

