
'use server';

import { 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase"; // Client SDK for sign-in
import { auth, db } from "@/lib/firebase-admin"; // Admin SDK for user creation/management
import { User } from "./types";

// This is a server-side only function that interacts with Firebase Admin SDK
export async function getUserData(uid: string): Promise<User | null> {
    try {
        const userDocRef = db.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            return {
                uid: docSnap.id,
                ...docSnap.data()
            } as User;
        }
        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        throw new Error("Impossible de récupérer les données de l'utilisateur.");
    }
}

// Note: This function uses the client SDK for authentication.
// It is designed to be called from a client component but will execute on the server.
export async function loginWithEmailAndPassword(email: string, pass: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
        return { user: userCredential.user };
    } catch (error: any) {
        console.error("Firebase Auth Error:", error.code, error.message);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error('Adresse e-mail ou mot de passe invalide.');
        }
        throw new Error("Une erreur s'est produite lors de la connexion.");
    }
}

export async function logout() {
  // In a real app with server-side sessions, you would clear the session cookie here.
  // For this setup, we mainly rely on client-side sign-out.
  // This function is kept for structural consistency.
  return Promise.resolve();
}

// Function to run once to create users in Firebase Authentication and Firestore
// This is not meant to be part of the app's regular flow.
export async function createInitialUsers() {
    const users = [
        { email: 'info@estheticaspa.com', password: 'Jessmik1985', name: 'Jessica', role: 'admin' },
        { email: 'mikael@poliminder.app', password: 'password123', name: 'Mikael', role: 'field' }
    ];

    for (const userData of users) {
        try {
            // Check if user already exists in Auth
            let userRecord;
            try {
                userRecord = await auth.getUserByEmail(userData.email);
                console.log(`User ${userData.email} already exists in Auth.`);
            } catch (error: any) {
                if (error.code === 'auth/user-not-found') {
                    // Create user in Firebase Auth if not found
                    userRecord = await auth.createUser({
                        email: userData.email,
                        password: userData.password,
                        displayName: userData.name,
                    });
                    console.log('Successfully created new user in Auth:', userRecord.uid);
                } else {
                    throw error; // Rethrow other auth errors
                }
            }

            // Check if user document exists in Firestore and create/update it
            const userDocRef = db.collection('users').doc(userRecord.uid);
            const docSnap = await userDocRef.get();
            if (!docSnap.exists) {
                await userDocRef.set({
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                });
                console.log('Successfully created new user in Firestore:', userRecord.uid);
            } else {
                 console.log(`Firestore document for ${userData.email} already exists.`);
            }

        } catch (error) {
            console.error('Error creating or checking user:', userData.email, error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            // Check for specific error that might indicate service account key issue
            if(errorMessage.includes('Failed to determine project ID') || errorMessage.includes('Credential implementation')) {
                throw new Error("Erreur de configuration Firebase Admin. Vérifiez votre clé de service (.env).");
            }
            throw new Error(`Failed to process user ${userData.email}.`);
        }
    }
}
