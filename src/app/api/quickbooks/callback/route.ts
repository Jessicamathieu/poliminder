// /src/app/api/quickbooks/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

const discoveryUrl = 'https://developer.api.intuit.com/.well-known/oauth2_configuration';

async function getTokenEndpoint(): Promise<string> {
    const response = await fetch(discoveryUrl);
    const discoveryDoc = await response.json();
    return discoveryDoc.token_endpoint;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is missing.' }, { status: 400 });
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

        return NextResponse.json({
            ...tokens,
            realmId: realmId,
        });

    } catch (error) {
        console.error('Error in QuickBooks callback:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
