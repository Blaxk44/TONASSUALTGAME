// Firebase Configuration for Railway
const getFirebaseConfig = () => {
    // Check for Railway environment variables
    if (typeof process !== 'undefined' && process.env) {
        return {
            apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBOETGieVSUrO9Bx52Eml3Kf0kAXYKiP1c",
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || "ton-assault-game.firebaseapp.com",
            projectId: process.env.FIREBASE_PROJECT_ID || "ton-assault-game",
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "ton-assault-game.firebasestorage.app",
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "879983779292",
            appId: process.env.FIREBASE_APP_ID || "1:879983779292:web:bd0dc7c28d02b145af4319"
        };
    }
    
    // Fallback to hardcoded config
    return {
        apiKey: "AIzaSyBOETGieVSUrO9Bx52Eml3Kf0kAXYKiP1c",
        authDomain: "ton-assault-game.firebaseapp.com",
        projectId: "ton-assault-game",
        storageBucket: "ton-assault-game.firebasestorage.app",
        messagingSenderId: "879983779292",
        appId: "1:879983779292:web:bd0dc7c28d02b145af4319"
    };
};

const FIREBASE_CONFIG = getFirebaseConfig();

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
        console.log("🔥 Firebase initialized for Railway");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Make config available globally

window.FIREBASE_CONFIG = FIREBASE_CONFIG;
