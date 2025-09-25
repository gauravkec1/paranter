import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const en = {
  "common": {
    "welcome": "Welcome",
    "login": "Login",
    "logout": "Logout",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings",
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "print": "Print",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "total": "Total",
    "date": "Date",
    "time": "Time",
    "status": "Status",
    "actions": "Actions"
  },
  "navigation": {
    "home": "Home",
    "teacher": "Teacher Portal",
    "admin": "Admin Portal", 
    "finance": "Finance Portal",
    "driver": "Driver Portal",
    "parent": "Parent Portal"
  },
  "auth": {
    "loginTitle": "School Management System",
    "selectRole": "Select Your Role",
    "enterCredentials": "Enter your credentials to access the portal",
    "email": "Email Address",
    "phone": "Phone Number",
    "password": "Password",
    "schoolId": "School ID",
    "loginButton": "Login",
    "forgotPassword": "Forgot Password?",
    "or": "OR",
    "loginWithOTP": "Login with OTP"
  }
};

const hi = {
  "common": {
    "welcome": "स्वागत",
    "login": "लॉगिन",
    "logout": "लॉगआउट",
    "dashboard": "डैशबोर्ड",
    "profile": "प्रोफाइल",
    "settings": "सेटिंग्स",
    "save": "सेव करें",
    "cancel": "रद्द करें",
    "edit": "संपादित करें",
    "delete": "मिटाएं",
    "view": "देखें",
    "search": "खोजें",
    "filter": "फिल्टर",
    "export": "एक्सपोर्ट",
    "print": "प्रिंट",
    "loading": "लोड हो रहा है...",
    "error": "त्रुटि",
    "success": "सफलता",
    "total": "कुल",
    "date": "दिनांक",
    "time": "समय",
    "status": "स्थिति",
    "actions": "क्रियाएं"
  },
  "navigation": {
    "home": "होम",
    "teacher": "शिक्षक पोर्टल",
    "admin": "एडमिन पोर्टल",
    "finance": "वित्त पोर्टल",
    "driver": "ड्राइवर पोर्टल",
    "parent": "अभिभावक पोर्टल"
  },
  "auth": {
    "loginTitle": "स्कूल प्रबंधन प्रणाली",
    "selectRole": "अपनी भूमिका चुनें",
    "enterCredentials": "पोर्टल तक पहुंचने के लिए अपनी जानकारी दर्ज करें",
    "email": "ईमेल पता",
    "phone": "फोन नंबर",
    "password": "पासवर्ड",
    "schoolId": "स्कूल आईडी",
    "loginButton": "लॉगिन करें",
    "forgotPassword": "पासवर्ड भूल गए?",
    "or": "या",
    "loginWithOTP": "OTP से लॉगिन करें"
  }
};

const kn = {
  "common": {
    "welcome": "ಸ್ವಾಗತ",
    "login": "ಲಾಗಿನ್",
    "logout": "ಲಾಗೌಟ್",
    "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "profile": "ಪ್ರೊಫೈಲ್",
    "settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "save": "ಉಳಿಸಿ",
    "cancel": "ರದ್ದುಗೊಳಿಸಿ",
    "edit": "ಸಂಪಾದಿಸಿ",
    "delete": "ಅಳಿಸಿ",
    "view": "ವೀಕ್ಷಿಸಿ",
    "search": "ಹುಡುಕಿ",
    "filter": "ಫಿಲ್ಟರ್",
    "export": "ರಫ್ತು",
    "print": "ಮುದ್ರಿಸಿ",
    "loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "error": "ದೋಷ",
    "success": "ಯಶಸ್ಸು",
    "total": "ಒಟ್ಟು",
    "date": "ದಿನಾಂಕ",
    "time": "ಸಮಯ",
    "status": "ಸ್ಥಿತಿ",
    "actions": "ಕ್ರಿಯೆಗಳು"
  },
  "navigation": {
    "home": "ಮನೆ",
    "teacher": "ಶಿಕ್ಷಕ ಪೋರ್ಟಲ್",
    "admin": "ಆಡ್ಮಿನ್ ಪೋರ್ಟಲ್",
    "finance": "ಹಣಕಾಸು ಪೋರ್ಟಲ್",
    "driver": "ಚಾಲಕ ಪೋರ್ಟಲ್",
    "parent": "ಪೋಷಕ ಪೋರ್ಟಲ್"
  },
  "auth": {
    "loginTitle": "ಶಾಲಾ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ",
    "selectRole": "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    "enterCredentials": "ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    "email": "ಇಮೇಲ್ ವಿಳಾಸ",
    "phone": "ಫೋನ್ ಸಂಖ್ಯೆ",
    "password": "ಪಾಸ್‌ವರ್ಡ್",
    "schoolId": "ಶಾಲಾ ಗುರುತು ಸಂಖ್ಯೆ",
    "loginButton": "ಲಾಗಿನ್ ಮಾಡಿ",
    "forgotPassword": "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    "or": "ಅಥವಾ",
    "loginWithOTP": "OTP ಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ"
  },
  "dashboard": {
    "overview": "ಅವಲೋಕನ",
    "quickStats": "ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",
    "recentActivity": "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    "announcements": "ಪ್ರಕಟಣೆಗಳು",
    "notifications": "ಸೂಚನೆಗಳು"
  },
  "student": {
    "students": "ವಿದ್ಯಾರ್ಥಿಗಳು",
    "studentName": "ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು",
    "rollNumber": "ರೋಲ್ ಸಂಖ್ಯೆ",
    "class": "ತರಗತಿ",
    "section": "ವಿಭಾಗ",
    "attendance": "ಹಾಜರಾತಿ",
    "grades": "ಗ್ರೇಡ್‌ಗಳು",
    "performance": "ಕಾರ್ಯಕ್ಷಮತೆ"
  },
  "teacher": {
    "teachers": "ಶಿಕ್ಷಕರು",
    "subjects": "ವಿಷಯಗಳು",
    "classes": "ತರಗತಿಗಳು",
    "lessons": "ಪಾಠಗಳು",
    "assignments": "ಕಾರ್ಯಯೋಜನೆಗಳು",
    "examinations": "ಪರೀಕ್ಷೆಗಳು"
  },
  "finance": {
    "fees": "ಶುಲ್ಕಗಳು",
    "payments": "ಪಾವತಿಗಳು",
    "expenses": "ವೆಚ್ಚಗಳು",
    "revenue": "ಆದಾಯ",
    "outstanding": "ಬಾಕಿ",
    "reports": "ಹಣಕಾಸು ವರದಿಗಳು",
    "analytics": "ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ",
    "paymentMethods": "ಪಾವತಿ ವಿಧಾನಗಳು",
    "dueDate": "ನಿಗದಿತ ದಿನಾಂಕ",
    "amount": "ಮೊತ್ತ",
    "receipt": "ರಸೀದಿ"
  },
  "transport": {
    "buses": "ಬಸ್‌ಗಳು",
    "routes": "ಮಾರ್ಗಗಳು",
    "drivers": "ಚಾಲಕರು",
    "tracking": "ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್",
    "location": "ಸ್ಥಳ",
    "eta": "ಅಂದಾಜು ಸಮಯ",
    "emergency": "ತುರ್ತು ಸ್ಥಿತಿ",
    "maintenance": "ನಿರ್ವಹಣೆ"
  },
  "communication": {
    "messages": "ಸಂದೇಶಗಳು",
    "announcements": "ಪ್ರಕಟಣೆಗಳು",
    "notifications": "ಸೂಚನೆಗಳು",
    "circulars": "ಪರಿಪತ್ರಗಳು",
    "broadcast": "ಪ್ರಸಾರ",
    "sendMessage": "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    "recipient": "ಸ್ವೀಕರಿಸುವವರು",
    "subject": "ವಿಷಯ",
    "message": "ಸಂದೇಶ"
  }
};

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'browserLanguage'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;