import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBNrfbE89NFDArYXczmycrypZGPZJTAhOs",
  authDomain: "shruti-assignment.firebaseapp.com",
  projectId: "shruti-assignment",
  storageBucket: "shruti-assignment.firebasestorage.app",
  messagingSenderId: "576487363639",
  appId: "1:576487363639:web:d279a4b73d986c835a5bb2",
  measurementId: "G-GJMQJJ0RPL"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Firestore Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Validation / test of connection to Firestore to alert developers early
async function validateDbConnection() {
  try {
    // Attempt standard single-fetch test node to check client connectivity
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client reports as offline. Verify configurations and internet connection.", error);
    }
  }
}
validateDbConnection();

// High fidelity error logging as mandatorily specified in the firebase integration skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Action Blocked: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
