import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GithubAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  AuthProvider
} from "firebase/auth";

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Log configuration (without revealing keys) to help with debugging
console.log("Firebase initialized with project:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get auth instance with the app
const auth = getAuth(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');
const appleProvider = new OAuthProvider('apple.com');

// Generic SSO sign-in function
export const signInWithProvider = async (providerName: string) => {
  try {
    let provider: AuthProvider;

    switch (providerName) {
      case 'google':
        provider = googleProvider;
        // Add scopes for better user data
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        break;
      case 'github':
        provider = githubProvider;
        githubProvider.addScope('user');
        break;
      case 'twitter':
        provider = twitterProvider;
        break;
      case 'facebook':
        provider = facebookProvider;
        facebookProvider.addScope('email');
        break;
      case 'microsoft':
        provider = microsoftProvider;
        microsoftProvider.addScope('user.read');
        break;
      case 'apple':
        provider = appleProvider;
        appleProvider.addScope('email');
        appleProvider.addScope('name');
        break;
      default:
        throw new Error(`Provider ${providerName} not supported`);
    }

    console.log(`Starting sign-in with ${providerName}...`);
    const result = await signInWithPopup(auth, provider);
    console.log(`Sign-in successful with ${providerName}`);
    
    // Return the user
    return result.user;
  } catch (error: any) {
    console.error(`Error signing in with ${providerName}:`, error);
    
    // Provide better error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('The sign-in popup was closed before completing authentication.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('The sign-in popup was blocked by your browser. Please check your popup settings.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address but different sign-in credentials.');
    } else {
      throw error;
    }
  }
};

// Google Sign-In (keeping for backward compatibility)
export const signInWithGoogle = async () => {
  return signInWithProvider('google');
};

// Email/Password Authentication
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Sign Out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };