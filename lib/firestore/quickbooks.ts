
'use server';
// This file is currently not used due to the temporary in-memory token storage solution.
// It is kept for future reference when switching to a persistent Firestore token storage.

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface QuickBooksTokenData {
  realmId: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
}

export async function saveQuickBooksTokens(data: QuickBooksTokenData) {
  if (!data.realmId) {
    throw new Error('Realm ID is required to save QuickBooks tokens.');
  }

  const docRef = db.collection('quickbooks_credentials').doc(data.realmId);
  
  await docRef.set({
    ...data,
    // Store expiry dates as timestamps for easier querying
    access_token_expires_at: FieldValue.serverTimestamp(), // This will be updated later
    refresh_token_expires_at: FieldValue.serverTimestamp(), // This will be updated later
    updatedAt: FieldValue.serverTimestamp(),
    connected: true
  }, { merge: true });

  // We set placeholder timestamps first, then update them with calculated dates
  const now = new Date();
  const accessTokenExpiresAt = new Date(now.getTime() + data.expires_in * 1000);
  const refreshTokenExpiresAt = new Date(now.getTime() + data.x_refresh_token_expires_in * 1000);

  await docRef.update({
    access_token_expires_at: accessTokenExpiresAt,
    refresh_token_expires_at: refreshTokenExpiresAt,
  });

  console.log(`✅ Successfully saved QuickBooks tokens for realmId: ${data.realmId}`);
}
