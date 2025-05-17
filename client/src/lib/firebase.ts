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

/**
 * Firebase configuration and initialization
 * Using a singleton pattern to prevent duplicate initialization
 */

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Get auth instance
const auth = getAuth(app);

// Log for debugging
console.log("Firebase authentication initialized for project:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Auth providers - initialize only when needed
let googleProvider: GoogleAuthProvider;
let githubProvider: GithubAuthProvider;
let twitterProvider: TwitterAuthProvider; 
let facebookProvider: FacebookAuthProvider;
let microsoftProvider: OAuthProvider;
let appleProvider: OAuthProvider;

// Helper to get providers lazily
const getGoogleProvider = () => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
  }
  return googleProvider;
};

const getGithubProvider = () => {
  if (!githubProvider) {
    githubProvider = new GithubAuthProvider();
    githubProvider.addScope('user');
  }
  return githubProvider;
};

const getTwitterProvider = () => {
  if (!twitterProvider) {
    twitterProvider = new TwitterAuthProvider();
  }
  return twitterProvider;
};

const getFacebookProvider = () => {
  if (!facebookProvider) {
    facebookProvider = new FacebookAuthProvider();
    facebookProvider.addScope('email');
  }
  return facebookProvider;
};

const getMicrosoftProvider = () => {
  if (!microsoftProvider) {
    microsoftProvider = new OAuthProvider('microsoft.com');
    microsoftProvider.addScope('user.read');
  }
  return microsoftProvider;
};

const getAppleProvider = () => {
  if (!appleProvider) {
    appleProvider = new OAuthProvider('apple.com');
    appleProvider.addScope('email');
    appleProvider.addScope('name');
  }
  return appleProvider;
};

// Generic SSO sign-in function
export const signInWithProvider = async (providerName: string) => {
  try {
    let provider: AuthProvider;

    // Get the appropriate provider using our lazy loading functions
    switch (providerName) {
      case 'google':
        provider = getGoogleProvider();
        break;
      case 'github':
        provider = getGithubProvider();
        break;
      case 'twitter':
        provider = getTwitterProvider();
        break;
      case 'facebook':
        provider = getFacebookProvider();
        break;
      case 'microsoft':
        provider = getMicrosoftProvider();
        break;
      case 'apple':
        provider = getAppleProvider();
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
    
    // Provide better error messages based on error code
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('The sign-in popup was closed before completing authentication.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('The sign-in popup was blocked by your browser. Please check your popup settings.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address but different sign-in credentials.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('The authentication process was cancelled. Please try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
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
    console.log("Attempting to create user with email:", email);
    
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (userCredential.user) {
      console.log("User created successfully, setting display name:", displayName);
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      console.log("User profile updated successfully");
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up with email:", error);
    
    // Enhanced error handling with specific error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email address is already in use. Please try a different email or log in.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is invalid. Please enter a valid email.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password (at least 6 characters).');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw error;
    }
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log("Attempting to sign in with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Email sign in successful:", userCredential.user.displayName);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in with email:", error);
    
    // Enhanced error handling with specific error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account exists with this email. Please check your email or register.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is invalid. Please enter a valid email.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled. Please contact support.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later or reset your password.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw error;
    }
  }
};

export const resetPassword = async (email: string) => {
  try {
    console.log("Attempting to send password reset email to:", email);
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    
    // Enhanced error handling with specific error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account exists with this email address.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is invalid. Please enter a valid email.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw error;
    }
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