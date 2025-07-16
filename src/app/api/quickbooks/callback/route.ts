
import { NextRequest, NextResponse } from 'next/server';
import { saveQuickBooksTokens } from '@/lib/firestore/quickbooks-actions';

const tokenEndpoint = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: "QuickBooks login cancelled", description: error }, { status: 400 });
    }
    
    if (!code || !realmId) {
        return NextResponse.json({ error: 'Authorization code or realmId is missing from the callback.' }, { status: 400 });
    }

    try {
        const clientId = process.env.QUICKBOOKS_CLIENT_ID;
        const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
        const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error("QuickBooks environment variables are not fully configured.");
        }

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Basic ${credentials}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Error fetching token:', errorBody);
            return NextResponse.json({ error: 'Failed to exchange authorization code for token.', details: errorBody }, { status: response.status });
        }

        const tokens = await response.json();
        
        console.log('QuickBooks Tokens Received, saving to Firestore...');

        // Save tokens to Firestore
        await saveQuickBooksTokens({
            realmId: realmId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in,
            x_refresh_token_expires_in: tokens.x_refresh_token_expires_in,
        });

        // Redirect to a success page or dashboard
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
        return NextResponse.redirect(`${siteUrl}/admin?quickbooks=success`);


    } catch (error) {
        console.error('Error in QuickBooks callback:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
