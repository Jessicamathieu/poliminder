// /src/app/api/quickbooks/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

const discoveryUrl = 'https://developer.api.intuit.com/.well-known/oauth2_configuration';

async function getAuthUri(): Promise<string> {
    const response = await fetch(discoveryUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch QuickBooks OAuth2 discovery document: ${response.statusText}`);
    }
    const discoveryDoc = await response.json();
    const authorizationEndpoint = discoveryDoc.authorization_endpoint;

    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI;
    const scopes = 'com.intuit.quickbooks.accounting';
    const responseType = 'code';
    // It's recommended to use a random, unguessable value for state
    const state = 'security_token_which_should_be_random'; 

    if (!clientId || !redirectUri) {
        throw new Error("QUICKBOOKS_CLIENT_ID or QUICKBOOKS_REDIRECT_URI is not defined in .env file");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        response_type: responseType,
        state: state,
    });

    return `${authorizationEndpoint}?${params.toString()}`;
}

export async function GET(req: NextRequest) {
    try {
        const authUri = await getAuthUri();
        // Redirect the user to the QuickBooks authorization URL
        return NextResponse.redirect(authUri);
    } catch (error) {
        console.error('Error getting QuickBooks auth URI:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: 'Failed to initiate QuickBooks authentication.', details: errorMessage }, { status: 500 });
    }
}
