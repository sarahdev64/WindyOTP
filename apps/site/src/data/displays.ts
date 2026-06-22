export type PhoneDisplayData = {
  path: string;
  summary?: string;
};

export const displays: Record<string, PhoneDisplayData> = {
  main: {
    path: "/phone/main.jpg",
    summary: "Securely manage your 2FA codes with robust encryption. Your data is protected and export support is guarded with device biometrics."
  },
  manage: {
    path: "/phone/manage.jpg",
    summary: "Efficiently manage your codes: rename, delete, or import from QR codes. Full support for migrating TOTP codes from Google Authenticator."
  },
  custom: {
    path: "/phone/customizable.jpg",
    summary: "Tailor your experience with NativeWind. WindyOTP is built with customization in-mind."
  },
  themes: {
    path: "/phone/in-app-themes.jpg",
    summary: "Personalize your app on the go. All theme color variables are changeable directly in-app."
  }
};
