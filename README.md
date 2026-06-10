# [WindyOTP](https://otp.robbryan.dev)

An authenticator app customizable through a sensible tailwind config.
Made possible using [NativeWind](https://www.nativewind.dev/)

## Features
- Rename code display names
- Delete specific codes
- Import from qr code
- Migrate all totp codes from [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1) Or Other WindyOTP install
- Export support guarded with device biometrics
- Great support for different TOTP implementations
### TOTP Support
- digits: 6 | 8
- periods: 15 | 30 | 60
- algorithms: sha1 | sha256 | sha512 | md5

## Requirements
- [MoonRepo](https://moonrepo.dev/)

## Local Development
### Mobile app
```bash
moon mobile:start
```

### Showcase site
```bash
moon site:serve
```

## Building
### Mobile app
Manually go to ``apps/mobile`` and follow one of the guides bellow
- [Build using local machine](https://docs.expo.dev/build-reference/local-builds/)
- [Build remotely using Eas](https://docs.expo.dev/build/introduction/)

### Showcase site
```bash
moon site:build
```
Then serve the new dist folder at ``apps/site/dist``

## Technologies Used
### Mobile app
- React native
- Expo
- Typescript
- NativeWind
- [VanillaTOTP (My Library)](https://github.com/sarahdev64/vanilla-totp)
- protobufjs
- react-native-qrcode-svg

### Showcase site
- HTML
- CSS
- Tailwind
- Javascript
- Typescript
- Vue
