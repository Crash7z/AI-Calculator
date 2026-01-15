# Convert Calculator to Android APK

## Option 1: Online APK Builder (Easiest - Recommended)

### Using AppsGeyser (Free, No Coding Required)
1. Visit: https://appsgeyser.com/
2. Click "Create App Now"
3. Select "Website" template
4. Upload your calculator files OR host them online
5. Customize app name, icon, and settings
6. Click "Create App"
7. Download your APK file

### Using Appy Pie (Alternative)
1. Visit: https://www.appypie.com/app-builder/appmaker
2. Choose "Website to App"
3. Enter your app details
4. Upload your HTML/CSS/JS files
5. Generate and download APK

---

## Option 2: Using Android Studio (Professional Method)

### Prerequisites
- Install Android Studio: https://developer.android.com/studio
- Install Java JDK 11 or higher

### Steps:

#### 1. Install Android Studio
Download from: https://developer.android.com/studio

#### 2. Create New Project
- Open Android Studio
- Select "Empty Activity"
- Name: "Calculator"
- Package name: "com.calculator.app"
- Language: Java or Kotlin
- Minimum SDK: API 21 (Android 5.0)

#### 3. Add WebView to Your App
Replace `activity_main.xml` with the content from `android_project/activity_main.xml`

#### 4. Configure MainActivity
Replace `MainActivity.java` with the content from `android_project/MainActivity.java`

#### 5. Copy Web Files
Copy `index.html`, `style.css`, and `script.js` to:
`app/src/main/assets/`

#### 6. Update AndroidManifest.xml
Add internet permission (see `android_project/AndroidManifest.xml`)

#### 7. Build APK
- Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
- Wait for build to complete
- Click "locate" to find your APK file

---

## Option 3: Using Cordova (Requires Node.js)

### Prerequisites
1. Install Node.js: https://nodejs.org/
2. Install Java JDK
3. Install Android Studio and SDK

### Steps:
```bash
# Install Cordova
npm install -g cordova

# Create Cordova project
cordova create calculator_android com.calculator.app Calculator

# Navigate to project
cd calculator_android

# Add Android platform
cordova platform add android

# Copy your web files to www/ folder
# (Replace index.html, add style.css and script.js)

# Build APK
cordova build android

# APK will be in: platforms/android/app/build/outputs/apk/debug/
```

---

## Recommended Approach

For **quick and easy** conversion without installing anything:
→ Use **Option 1** (Online APK Builder)

For **professional, customizable** app:
→ Use **Option 2** (Android Studio)

For **command-line** workflow:
→ Use **Option 3** (Cordova) - but requires Node.js installation first

---

## Files Prepared for You

I've created the necessary Android project files in the `android_project` folder:
- `activity_main.xml` - Layout file with WebView
- `MainActivity.java` - Java code to load your calculator
- `AndroidManifest.xml` - App configuration
- `build_instructions.txt` - Detailed build steps

You can use these files with Android Studio (Option 2).
