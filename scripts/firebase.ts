import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import 'firebase/firestore';
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: `${process.env.FIREBASE}.firebaseapp.com`,
	projectId: process.env.FIREBASE,
	storageBucket: `${process.env.FIREBASE}.firebasestorage.com`,
	messagingSenderId: "137678094895",
	appId: process.env.FIREBASE_APP_ID,
	measurementId: "G-MWQ2Q9DK3V"
  };

const fireBaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fireBaseApp);
const storage = getStorage(fireBaseApp);


export { firebaseConfig, storage };

