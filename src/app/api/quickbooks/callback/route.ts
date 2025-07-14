// /src/app/api/quickbooks/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { temporaryTokenStore } from '@/lib/quickbooks-token-store';

const discoveryUrl = 'https://developer.api.intuit.com/.well-known/oauth2_configuration';

async function getTokenEndpoint(): Promise<string> {
    const response = await fetch(discoveryUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch QuickBooks OAuth2 discovery document');
    }
    const discoveryDoc = await response.json();
    return discoveryDoc.token_endpoint;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: "QuickBooks login cancelled", description: error }, { status: 400 });
    }

    if (!code || !realmId) {
        return NextResponse.json({ error: 'Authorization code or realmId is missing.' }, { status: 400 });
    }

    try {
        const tokenEndpoint = await getTokenEndpoint();
        const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
        const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
        const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI!;

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
            return NextResponse.json({ error: 'Failed to fetch token from QuickBooks', details: errorBody }, { status: response.status });
        }

        const tokens = await response.json();
        
        console.log('QuickBooks Tokens Received:', tokens);

        // Store tokens temporarily for this session
        temporaryTokenStore.setTokens({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            realmId: realmId,
            expiresAt: Date.now() + (tokens.expires_in * 1000),
            refreshTokenExpiresAt: Date.now() + (tokens.x_refresh_token_expires_in * 1000),
        });


        return NextResponse.json({
            message: "Successfully connected to QuickBooks! You can now fetch data.",
            ...tokens,
            realmId: realmId,
        });

    } catch (error) {
        console.error('Error in QuickBooks callback:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
