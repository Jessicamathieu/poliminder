
'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

interface QuickBooksTokenData {
  realmId: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
}

const getCredentialsDoc = async () => {
    // For now, we assume only one QBO connection for the whole app.
    // In a multi-user environment, you'd pass a userId here.
    const snapshot = await db.collection('quickbooks_credentials').limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0];
}

export async function saveQuickBooksTokens(data: QuickBooksTokenData) {
  if (!data.realmId) {
    throw new Error('Realm ID is required to save QuickBooks tokens.');
  }

  const docRef = db.collection('quickbooks_credentials').doc(data.realmId);
  
  const now = new Date();
  const accessTokenExpiresAt = new Date(now.getTime() + data.expires_in * 1000);
  const refreshTokenExpiresAt = new Date(now.getTime() + data.x_refresh_token_expires_in * 1000);

  await docRef.set({
    ...data,
    access_token_expires_at: Timestamp.fromDate(accessTokenExpiresAt),
    refresh_token_expires_at: Timestamp.fromDate(refreshTokenExpiresAt),
    updatedAt: FieldValue.serverTimestamp(),
    connected: true
  }, { merge: true });

  console.log(`✅ Successfully saved QuickBooks tokens for realmId: ${data.realmId}`);
}

export async function getValidQuickBooksToken(): Promise<{accessToken: string, realmId: string} | null> {
    const doc = await getCredentialsDoc();
    if (!doc) return null;

    const credentials = doc.data();

    const accessTokenExpiresAt = (credentials.access_token_expires_at as Timestamp).toDate();

    // Simple check for expiration. A real app should handle token refresh.
    if (new Date() > accessTokenExpiresAt) {
        console.warn('QuickBooks access token expired. Refresh logic needed.');
        // TODO: Implement refresh token logic here.
        // For now, we'll fail and require re-authentication.
        return null; 
    }

    return {
        accessToken: credentials.access_token,
        realmId: credentials.realmId
    };
}

export async function checkQuickBooksConnection(): Promise<boolean> {
    const doc = await getCredentialsDoc();
    return !!doc && doc.data()?.connected === true;
}

export async function disconnectQuickBooks(): Promise<void> {
    const doc = await getCredentialsDoc();
    if (doc) {
        await doc.ref.update({
            connected: false,
            access_token: null,
            refresh_token: null,
        });
        console.log(`Disconnected QuickBooks for realmId: ${doc.id}`);
    }
}
