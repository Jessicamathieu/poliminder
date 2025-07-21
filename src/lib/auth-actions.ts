
'use server';

import { 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";
import { auth as firebaseAuth, db as clientDb } from "@/lib/firebase"; // Client SDK
import { auth, db } from "@/lib/firebase-admin"; // Admin SDK
import { User } from "./types";
import { doc, getDoc } from "firebase/firestore";

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
        { email: 'jessica@poliminder.app', password: 'password123', name: 'Jessica', role: 'admin' },
        { email: 'mikael@poliminder.app', password: 'password123', name: 'Mikael', role: 'field' }
    ];

    for (const userData of users) {
        try {
            // Check if user already exists
            const existingUser = await auth.getUserByEmail(userData.email).catch(() => null);
            if (existingUser) {
                console.log(`User ${userData.email} already exists.`);
                // Ensure Firestore doc also exists
                 const userDocRef = db.collection('users').doc(existingUser.uid);
                 const docSnap = await userDocRef.get();
                 if(!docSnap.exists) {
                    await userDocRef.set({
                        name: userData.name,
                        email: userData.email,
                        role: userData.role,
                    });
                     console.log(`Firestore document created for ${userData.email}`);
                 }
                continue;
            }

            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.name,
            });
            console.log('Successfully created new user in Auth:', userRecord.uid);

            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set({
                name: userData.name,
                email: userData.email,
                role: userData.role,
            });
            console.log('Successfully created new user in Firestore:', userRecord.uid);
        } catch (error) {
            console.error('Error creating user:', userData.email, error);
        }
    }
}
