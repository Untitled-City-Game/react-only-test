import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import 'firebase/firestore';
const firebaseConfig = {
	apiKey: "AIzaSyBQdAxW64FE0ZAOH1oiMhIk_jVQmVROqt4",
	authDomain: `${process.env.FIREBASE}.firebaseapp.com`,
	projectId: process.env.FIREBASE,
	storageBucket: process.env.STORAGE,
	messagingSenderId: "99015817585",
	appId: process.env.FIREBASE_APP_ID
	//appId: "1:99015817585:web:e596628b1ff97745a3ded0"
  };

const fireBaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fireBaseApp);
const storage = getStorage(fireBaseApp);


export { firebaseConfig, firestore, storage };

