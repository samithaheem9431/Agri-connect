// Import the functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCpAOjfC186w2IkyKorlr7H5W-lI3wMhCE",
  authDomain: "agri-3eda1.firebaseapp.com",
  projectId: "agri-3eda1",
  storageBucket: "agri-3eda1.appspot.com",
  messagingSenderId: "938421286237",
  appId: "1:938421286237:web:378b91e64b34e639d764b4",
  measurementId: "G-RYNNL26S2H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Upload image to Firebase Storage + Save to Firestore
export const uploadImageAndSaveData = async (file, result) => {
  const fileName = `diseases/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "diagnosis_logs"), {
    imageUrl,
    ...result,
    timestamp: serverTimestamp(),
  });
};
