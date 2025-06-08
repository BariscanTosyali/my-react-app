// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIZ6YUhn14n-QhOuhxafd7jonAkpDjWzM",
  authDomain: "my-react-app-a6d16.firebaseapp.com",
  projectId: "my-react-app-a6d16",
  storageBucket: "my-react-app-a6d16.firebasestorage.app",
  messagingSenderId: "183794677158",
  appId: "1:183794677158:web:6880a35ef218964cbc4b67",
  measurementId: "G-P01FNZ6STF"
};

let app;
let auth;

// Initialize Firebase
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Analytics only in production
  if (process.env.NODE_ENV === 'production') {
    const analytics = getAnalytics(app);
  }

  // Enable logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase initialized in development mode');
  }

  // Add auth state observer
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in:', user.email);
    } else {
      console.log('User is signed out');
    }
  });

} catch (error) {
  console.error("Firebase initialization error:", error.message);
  // Log detailed error in development
  if (process.env.NODE_ENV === 'development') {
    console.error("Detailed error:", error);
  }
}

export { auth };
export default app;