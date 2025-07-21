// app/api/auth/callback/quickbooks/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if not already initialized
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!getApps().length && serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function GET(req: NextRequest) {
  // Import saveQuickBooksTokens inside the handler to ensure Firebase is initialized
  const { saveQuickBooksTokens } = await import('@/lib/firestore/quickbooks-actions');

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const realmId = url.searchParams.get('realmId')

  if (!code || !realmId) {
    return NextResponse.json({ error: 'Missing code or realmId' }, { status: 400 })
  }

  const basicAuth = Buffer.from(
    `${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.QUICKBOOKS_REDIRECT_URI!,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('❌ Token exchange failed:', data)
    return NextResponse.json({ error: 'Token exchange failed', details: data }, { status: 500 })
  }

  console.log('✅ QuickBooks token received:', data)

  // Call saveQuickBooksTokens now that Firebase is likely initialized
  await saveQuickBooksTokens({
    realmId,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    x_refresh_token_expires_in: data.x_refresh_token_expires_in,
  });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`) // Or any success page
}