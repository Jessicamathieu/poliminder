
import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

// This API route replaces the previous Firebase Function.
export async function POST() {
    const users = [
        { email: 'mathieuj787@gmail.com', password: 'Jessmik1985', name: 'Jessica', role: 'admin' },
        { email: 'mikael@poliminder.app', password: 'password123', name: 'Mikael', role: 'field' }
    ];

    try {
        for (const userData of users) {
            let userRecord;
            try {
                userRecord = await auth.getUserByEmail(userData.email);
            } catch (error: any) {
                if (error.code === 'auth/user-not-found') {
                    userRecord = await auth.createUser({
                        email: userData.email,
                        password: userData.password,
                        displayName: userData.name,
                    });
                } else {
                    throw error;
                }
            }

            const userDocRef = db.collection('users').doc(userRecord.uid);
            const docSnap = await userDocRef.get();
            if (!docSnap.exists) {
                await userDocRef.set({
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                });
            }
        }
        return NextResponse.json({ message: 'Users initialized successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error creating or checking users:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        
        if(errorMessage.includes('Failed to determine project ID') || errorMessage.includes('Credential implementation')) {
            return NextResponse.json({ message: "Erreur de configuration Firebase Admin. Vérifiez votre clé de service (.env)." }, { status: 500 });
        }
        return NextResponse.json({ message: `Failed to process users. ${errorMessage}` }, { status: 500 });
    }
}
