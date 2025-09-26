import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  "welcome": {
    "title": "Welcome to Paranter",
    "subtitle": "Choose your portal to access the school management system and stay connected with your educational community"
  },
  "auth": {
    "loginTitle": "Paranter Management System",
    "selectRole": "Select Your Role",
    "enterCredentials": "Enter your credentials to access the portal",
    "login": "Login",
    "signup": "Sign Up",
    "email": "Email / Phone / School ID",
    "password": "Password",
    "fullName": "Full Name",
    "createAccount": "Create Account",
    "loginWithOTP": "Login with OTP",
    "forgotPassword": "Forgot Password?",
    "pleaseWait": "Please wait..."
  },
  "roles": {
    "parent": "Parent Portal",
    "teacher": "Teacher Portal",
    "admin": "Admin Portal",
    "staff": "Finance Portal",
    "driver": "Driver Portal",
    "parentDesc": "Track student progress, fees, and communicate with teachers",
    "teacherDesc": "Manage classes, assignments, and student assessments",
    "adminDesc": "Complete school administration and management",
    "staffDesc": "Financial management, fees, and accounting",
    "driverDesc": "Transport management and route tracking"
  },
  "dashboard": {
    "home": "Home",
    "announcements": "Announcements",
    "messages": "Messages",
    "profile": "Profile",
    "attendance": "Attendance",
    "grades": "Grades",
    "quickActions": "Quick Actions",
    "schoolAnnouncements": "School Announcements",
    "comingSoon": "Coming soon",
    "directMessaging": "Direct messaging with teachers",
    "profileManagement": "Student & parent profile management"
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "search": "Search",
    "close": "Close",
    "present": "Present",
    "absent": "Absent",
    "percentage": "Percentage",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "overallGrade": "Overall Grade",
    "lastTest": "Last Test",
    "upcomingTest": "Upcoming Test",
    "viewDetails": "View Details",
    "payFees": "Pay Fees",
    "messageTeacher": "Message Teacher",
    "viewSchedule": "View Schedule",
    "downloadReport": "Download Report",
    "from": "From",
    "posted": "posted",
    "today": "today",
    "yesterday": "yesterday",
    "daysAgo": "days ago"
  }
};

// Kannada translations
const kannada = {
  "welcome": {
    "title": "ಪ್ಯಾರೆಂಟರ್‌ಗೆ ಸ್ವಾಗತ",
    "subtitle": "ಶಾಲಾ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆಯನ್ನು ಪ್ರವೇಶಿಸಲು ಮತ್ತು ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಸಮುದಾಯದೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಲು ನಿಮ್ಮ ಪೋರ್ಟಲ್ ಆಯ್ಕೆ ಮಾಡಿ"
  },
  "auth": {
    "loginTitle": "ಪ್ಯಾರೆಂಟರ್ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ",
    "selectRole": "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    "enterCredentials": "ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
    "login": "ಲಾಗಿನ್",
    "signup": "ಸೈನ್ ಅಪ್",
    "email": "ಇಮೇಲ್ / ಫೋನ್ / ಶಾಲಾ ಗುರುತು ಸಂಖ್ಯೆ",
    "password": "ಪಾಸ್‌ವರ್ಡ್",
    "fullName": "ಪೂರ್ಣ ಹೆಸರು",
    "createAccount": "ಖಾತೆ ತೆರೆಯಿರಿ",
    "loginWithOTP": "OTP ಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    "forgotPassword": "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    "pleaseWait": "ದಯವಿಟ್ಟು ಕಾಯಿರಿ..."
  },
  "roles": {
    "parent": "ಪೋಷಕ ಪೋರ್ಟಲ್",
    "teacher": "ಶಿಕ್ಷಕ ಪೋರ್ಟಲ್",
    "admin": "ಆಡ್ಮಿನ್ ಪೋರ್ಟಲ್",
    "staff": "ಹಣಕಾಸು ಪೋರ್ಟಲ್",
    "driver": "ಚಾಲಕ ಪೋರ್ಟಲ್",
    "parentDesc": "ವಿದ್ಯಾರ್ಥಿಯ ಪ್ರಗತಿ, ಶುಲ್ಕ ಮತ್ತು ಶಿಕ್ಷಕರೊಂದಿಗೆ ಸಂವಾದವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "teacherDesc": "ತರಗತಿಗಳು, ಕಾರ್ಯಯೋಜನೆಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ಮೌಲ್ಯಮಾಪನಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    "adminDesc": "ಸಂಪೂರ್ಣ ಶಾಲಾ ಆಡಳಿತ ಮತ್ತು ನಿರ್ವಹಣೆ",
    "staffDesc": "ಹಣಕಾಸಿನ ನಿರ್ವಹಣೆ, ಶುಲ್ಕ ಮತ್ತು ಲೆಕ್ಕಪತ್ರ",
    "driverDesc": "ಸಾರಿಗೆ ನಿರ್ವಹಣೆ ಮತ್ತು ಮಾರ್ಗ ಟ್ರ್ಯಾಕಿಂಗ್"
  },
  "dashboard": {
    "home": "ಮನೆ",
    "announcements": "ಪ್ರಕಟಣೆಗಳು",
    "messages": "ಸಂದೇಶಗಳು",
    "profile": "ಪ್ರೊಫೈಲ್",
    "attendance": "ಹಾಜರಾತಿ",
    "grades": "ಗ್ರೇಡ್‌ಗಳು",
    "quickActions": "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    "schoolAnnouncements": "ಶಾಲಾ ಪ್ರಕಟಣೆಗಳು",
    "comingSoon": "ಶೀಘ್ರದಲ್ಲೇ ಬರುವುದು",
    "directMessaging": "ಶಿಕ್ಷಕರೊಂದಿಗೆ ನೇರ ಸಂದೇಶ ಕಳುಹಿಸುವಿಕೆ",
    "profileManagement": "ವಿದ್ಯಾರ್ಥಿ ಮತ್ತು ಪೋಷಕರ ಪ್ರೊಫೈಲ್ ನಿರ್ವಹಣೆ"
  },
  "common": {
    "loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "save": "ಉಳಿಸಿ",
    "cancel": "ರದ್ದುಗೊಳಿಸಿ",
    "edit": "ಸಂಪಾದಿಸಿ",
    "delete": "ಅಳಿಸಿ",
    "view": "ವೀಕ್ಷಿಸಿ",
    "search": "ಹುಡುಕಿ",
    "close": "ಮುಚ್ಚಿ",
    "present": "ಹಾಜರು",
    "absent": "ಗೈರು",
    "percentage": "ಶೇಕಡಾವಾರು",
    "thisWeek": "ಈ ವಾರ",
    "thisMonth": "ಈ ತಿಂಗಳು",
    "overallGrade": "ಒಟ್ಟಾರೆ ಗ್ರೇಡ್",
    "lastTest": "ಕೊನೆಯ ಪರೀಕ್ಷೆ",
    "upcomingTest": "ಮುಂಬರುವ ಪರೀಕ್ಷೆ",
    "viewDetails": "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "payFees": "ಶುಲ್ಕ ಪಾವತಿ",
    "messageTeacher": "ಶಿಕ್ಷಕರಿಗೆ ಸಂದೇಶ",
    "viewSchedule": "ವೇಳಾಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ",
    "downloadReport": "ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    "from": "ನಿಂದ",
    "posted": "ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ",
    "today": "ಇಂದು",
    "yesterday": "ನಿನ್ನೆ",
    "daysAgo": "ದಿನಗಳ ಹಿಂದೆ"
  }
};

const resources = {
  en: { translation: en },
  kn: { translation: kannada }
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