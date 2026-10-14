import { getApp, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getDeviceId } from "../storage/cartStorage";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

function getDb() {
  if (!config.apiKey || !config.projectId || !config.appId)
    throw new Error(
      "Firebase is not configured. Copy .env.example to .env and set Firebase values.",
    );
  return getFirestore(getApps().length ? getApp() : initializeApp(config));
}

export async function listSavedProducts() {
  const userId = await getDeviceId();
  const snapshot = await getDocs(
    query(collection(getDb(), "wishlists"), where("userId", "==", userId)),
  );
  return snapshot.docs.map((item) => ({ docId: item.id, ...item.data() }));
}

export async function saveProduct(product) {
  const userId = await getDeviceId();
  const duplicate = await getDocs(
    query(
      collection(getDb(), "wishlists"),
      where("userId", "==", userId),
      where("productId", "==", product.id),
    ),
  );
  if (!duplicate.empty) return { alreadySaved: true, docId: duplicate.docs[0].id };
  const doc = await addDoc(collection(getDb(), "wishlists"), {
    userId,
    productId: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    createdAt: new Date().toISOString(),
  });
  return { alreadySaved: false, docId: doc.id };
}

export function removeSavedProduct(docId) {
  return deleteDoc(doc(getDb(), "wishlists", docId));
}
