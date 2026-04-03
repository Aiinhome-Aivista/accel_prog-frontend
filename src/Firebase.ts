// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_Uk4iDyBrgG7fnc9Jk0EQZyWaBOhVBvo",
  authDomain: "accel-prog.firebaseapp.com",
  projectId: "accel-prog",
  storageBucket: "accel-prog.firebasestorage.app",
  messagingSenderId: "724942319477",
  appId: "1:724942319477:web:a5c0d6e4e90294fb7ced3c",
  measurementId: "G-E3H577P90L"
};

console.log("%c[Firebase Diagnostic] Using Config:", "color: #f39c12; font-weight: bold;");
console.table({
  "Project ID": firebaseConfig.projectId,
  "Auth Domain": firebaseConfig.authDomain,
  "API Key": firebaseConfig.apiKey.substring(0, 10) + "..."
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };


