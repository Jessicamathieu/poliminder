import { NextRequest, NextResponse } from 'next/server';

const authorizationEndpoint = 'https://appcenter.intuit.com/connect/oauth2';

export async function GET(req: NextRequest) {
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

    const authUri = `${authorizationEndpoint}?${params.toString()}`;
    
    // Redirect the user to the QuickBooks authorization URL
    return NextResponse.redirect(authUri);
}
