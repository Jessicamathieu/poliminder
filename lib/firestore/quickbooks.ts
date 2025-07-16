// lib/firestore/quickbooks.ts

import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'

let appInitialized = false

if (!appInitialized) {
  initializeApp({
    credential: applicationDefault(), // or use cert() if you have a service account
  })
  appInitialized = true
}

const db = getFirestore()

export async function saveQuickBooksTokens(data: {
  realmId: string | null
  access_token: string
  refresh_token: string
  expires_in: number
  x_refresh_token_expires_in: number
}) {
  if (!data.realmId) throw new Error('Missing realmId')

  const docRef = db.collection('quickbooks_tokens').doc(data.realmId)
  await docRef.set(
    {
      ...data,
      timestamp: new Date(),
    },
    { merge: true }
  )

  console.log(`✅ Tokens saved for realmId: ${data.realmId}`)
}