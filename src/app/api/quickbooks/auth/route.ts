// /src/app/api/quickbooks/auth/route.ts

import { NextRequest, NextResponse } from 'next/server';

const discoveryUrl = 'https://developer.api.intuit.com/.well-known/oauth2_configuration';

async function getAuthUri(): Promise<string> {
    const response = await fetch(discoveryUrl);
    const discoveryDoc = await response.json();
    const authorizationEndpoint = discoveryDoc.authorization_endpoint;

    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI;
    const scopes = 'com.intuit.quickbooks.accounting';
    const responseType = 'code';
    const state = 'security_token_123'; // It's recommended to use a random, unguessable value

    const params = new URLSearchParams({
        client_id: clientId!,
        redirect_uri: redirectUri!,
        scope: scopes,
        response_type: responseType,
        state: state,
    });

    return `${authorizationEndpoint}?${params.toString()}`;
}

export async function GET(req: NextRequest) {
    try {
        const authUri = await getAuthUri();
        return NextResponse.redirect(authUri);
    } catch (error) {
        console.error('Error getting QuickBooks auth URI:', error);
        return NextResponse.json({ error: 'Failed to initiate QuickBooks authentication.' }, { status: 500 });
    }
}
