
'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface QuickBooksTokenData {
  realmId: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
}

const TOKEN_COLLECTION = 'quickbooks_credentials';

/**
 * Saves or updates QuickBooks tokens in Firestore.
 */
export async function saveQuickBooksTokens(data: QuickBooksTokenData) {
  if (!db) {
    throw new Error('Firebase Admin is not initialized.');
  }
  if (!data.realmId) {
    throw new Error('Realm ID is required to save QuickBooks tokens.');
  }

  const docRef = db.collection(TOKEN_COLLECTION).doc('primary'); // Store as a single doc for this app structure

  const now = new Date();
  const accessTokenExpiresAt = new Date(now.getTime() + data.expires_in * 1000);
  const refreshTokenExpiresAt = new Date(now.getTime() + data.x_refresh_token_expires_in * 1000);

  await docRef.set({
    realmId: data.realmId,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: Timestamp.fromDate(accessTokenExpiresAt),
    refreshTokenExpiresAt: Timestamp.fromDate(refreshTokenExpiresAt),
    updatedAt: FieldValue.serverTimestamp(),
    connected: true,
  }, { merge: true });

  console.log(`✅ Successfully saved QuickBooks tokens for realmId: ${data.realmId}`);
}

/**
 * Retrieves a valid QuickBooks access token, refreshing it if necessary.
 * @returns The active access token and realmId.
 */
export async function getValidQuickBooksToken(): Promise<{ accessToken: string; realmId: string } | null> {
    if (!db) {
        throw new Error('Firebase Admin is not initialized.');
    }
    const docRef = db.collection(TOKEN_COLLECTION).doc('primary');
    const doc = await docRef.get();

    if (!doc.exists) {
        console.log('No QuickBooks credentials found.');
        return null;
    }

    const credentials = doc.data()!;
    const now = new Date();
    const accessTokenExpiresAt = (credentials.accessTokenExpiresAt as Timestamp).toDate();

    // If token is still valid, return it
    if (now < accessTokenExpiresAt) {
        return { accessToken: credentials.accessToken, realmId: credentials.realmId };
    }

    // --- Token Refresh Logic ---
    console.log('Access token expired, refreshing...');
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
    const credentialsB64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentialsB64}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: credentials.refreshToken,
        }),
    });

    if (!response.ok) {
        console.error('Failed to refresh QuickBooks token:', await response.json());
        await docRef.update({ connected: false });
        throw new Error('Could not refresh QuickBooks token.');
    }

    const newTokens = await response.json();

    // Save the new tokens
    await saveQuickBooksTokens({
        realmId: credentials.realmId,
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_in: newTokens.expires_in,
        x_refresh_token_expires_in: newTokens.x_refresh_token_expires_in,
    });
    
    console.log('✅ Token refreshed successfully.');
    return { accessToken: newTokens.access_token, realmId: credentials.realmId };
}


/**
 * Checks if there's an active QuickBooks connection.
 */
export async function checkQuickBooksConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    const tokenData = await getValidQuickBooksToken();
    return !!tokenData;
  } catch (error) {
    console.warn("Check connection failed, likely due to expired refresh token:", error);
    return false;
  }
}

/**
 * Deletes the QuickBooks credentials from Firestore.
 */
export async function disconnectQuickBooks(): Promise<void> {
    if (!db) {
        throw new Error('Firebase Admin is not initialized.');
    }
    const docRef = db.collection(TOKEN_COLLECTION).doc('primary');
    await docRef.delete();
    console.log('QuickBooks credentials have been disconnected.');
}
