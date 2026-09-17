# NEON DROP Android

Offline Android WebView application, package `com.arcana.neondrop`, version 1.0.5 (6).
The bundled `app/src/main/assets/neon-drop.html` includes the game, audio, 10 languages and theme preferences. No network permission or external assets are required.

## Rebuild

Use JDK 17, Gradle 8.13, Android SDK Platform 36 and Build Tools 35.0.0.
Set `ANDROID_HOME` to your SDK directory. Set the following environment variables before building:

- `NEON_KEYSTORE`: absolute path to your upload JKS file
- `NEON_STORE_PASSWORD`: keystore password
- `NEON_KEY_PASSWORD`: key password (same password for the supplied key)

The key alias is `neondrop-upload`. Keep the signing backup private and retain it for future releases.

Run `gradle bundleRelease assembleRelease` from this directory.
Release artifacts are in `app/build/outputs/bundle/release/` and `app/build/outputs/apk/release/`.

To update the game, replace the bundled HTML and increase versionCode before uploading an update. Preserve the package ID and signing identity after first publication.

Minimum Android version: Android 8.0 / API 26. A current Android System WebView is required for modern canvas/dialog/JavaScript support.

Validation performed on delivery: release compilation, JAR signature verification, bundletool bundle validation and manifest inspection. No connected Android device was available for on-device execution testing.

