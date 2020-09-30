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
const firebaseDb = firebaseApp.firestore();
const firebaseFunctions = firebaseApp.functions("europe-west2");
firebaseFunctions.useFunctionsEmulator("http://localhost:5001");

// Declare Function references
const functionGetAccountsCallable = firebaseFunctions.httpsCallable(
  "getAccountsCallable"
);
const functionGetCasesCallable = firebaseFunctions.httpsCallable(
  "getCasesCallable"
);
const functionGetCaseDetail = firebaseFunctions.httpsCallable("getCaseDetail");
const functionCreateCaseCallable = firebaseFunctions.httpsCallable(
  "createCaseCallable"
);
const functionsGetCaseDescriptionReason = firebaseFunctions.httpsCallable(
  "getCaseDescriptionReason"
);
const functionsGetCaseDescriptionType = firebaseFunctions.httpsCallable(
  "getCaseDescriptionType"
);
const functionsGetCaseRelated = firebaseFunctions.httpsCallable(
  "getCaseRelated"
);
const functionsGetEmailMessage = firebaseFunctions.httpsCallable(
  "getEmailMessage"
);
const functionsGetEmailMessageRelated = firebaseFunctions.httpsCallable(
  "getEmailMessageRelated"
);
const functionsCreateEmailMessage = firebaseFunctions.httpsCallable(
  "createEmailMessage"
);
const functionsGetSubscriptionRelated = firebaseFunctions.httpsCallable(
  "getSubscriptionRelated"
);

// Declare Firestore references
const userCollection = firebaseDb.collection("users");

export {
  // Services
  firebaseAuth,
  firebaseDb,
  firebaseFunctions,
  // Functions
  functionGetAccountsCallable,
  functionGetCasesCallable,
  functionGetCaseDetail,
  functionsGetCaseDescriptionReason,
  functionsGetCaseDescriptionType,
  functionsGetCaseRelated,
  functionCreateCaseCallable,
  functionsGetEmailMessage,
  functionsGetEmailMessageRelated,
  functionsCreateEmailMessage,
  functionsGetSubscriptionRelated,
  // Collections
  userCollection
};
