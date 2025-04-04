import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

import 'firebase/firestore';
const firebaseConfig = {
	apiKey: "AIzaSyBQdAxW64FE0ZAOH1oiMhIk_jVQmVROqt4",
	authDomain: "metro-game-474bc.firebaseapp.com",
	projectId: "metro-game-474bc",
	storageBucket: "metro-game-474bc.firebasestorage.app",
	messagingSenderId: "99015817585",
	appId: "1:99015817585:web:e596628b1ff97745a3ded0"
  };

const fireBaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fireBaseApp);
const storage = getStorage(fireBaseApp);
if (location.hostname === "localhost") {
	// Point to the Storage emulator running on localhost.
	connectStorageEmulator(storage, "127.0.0.1", 9199);
  } 
  

export { firebaseConfig, firestore, storage };

