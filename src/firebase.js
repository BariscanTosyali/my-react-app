import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Firebase console'dan alacağınız config bilgileri buraya gelecek
  apiKey: "AIzaSyBIZ6YUhn14n-QhOuhxafd7jonAkpDjWzM",
  authDomain: "my-react-app-a6d16.firebaseapp.com",
  projectId: "my-react-app-a6d16",
  storageBucket: "my-react-app-a6d16.firebasestorage.app",
  messagingSenderId: "183794677158",
  appId: "1:183794677158:web:6880a35ef218964cbc4b67",
  measurementId: "G-P01FNZ6STF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 