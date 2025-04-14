import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import 'firebase/firestore';
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: `${process.env.FIREBASE}.firebaseapp.com`,
	projectId: process.env.FIREBASE,
	storageBucket: `${process.env.FIREBASE}.firebasestorage.com`,
	messagingSenderId: process.env.FIREBASE_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
  };

const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp);


export { firebaseConfig, storage };

