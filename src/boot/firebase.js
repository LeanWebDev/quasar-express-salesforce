import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.LWD_API_KEY,
  authDomain: process.env.LWD_AUTH_DOMAIN,
  databaseURL: process.env.LWD_DATABASE_URL,
  projectId: process.env.LWD_PROJECT_ID,
  storageBucket: process.env.LWD_STORAGE_BUCKET,
  messagingSenderId: process.env.LWD_MESSAGING_SENDER_ID,
  appId: process.env.LWD_APP_ID,
  measurementId: process.env.LWD_MEASUREMENT_ID
};

// Initialise Firebase services
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebaseApp.auth();
const firebaseDb = firebaseApp.database();
const firebaseFunctions = firebaseApp.functions("europe-west2");
firebaseFunctions.useFunctionsEmulator("http://localhost:5001");

// Declare available functions
const functionGetAccountsCallable = firebaseFunctions.httpsCallable(
  "getAccountsCallable"
);
const functionGetCasesCallable = firebaseFunctions.httpsCallable(
  "getCasesCallable"
);

export {
  // Services
  firebaseAuth,
  firebaseDb,
  firebaseFunctions,
  // Available functions
  functionGetAccountsCallable,
  functionGetCasesCallable
};
