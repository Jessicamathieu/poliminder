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
        console.error("QuickBooks environment variables are not defined. Check QUICKBOOKS_CLIENT_ID and QUICKBOOKS_REDIRECT_URI.");
        return NextResponse.json({ error: "QuickBooks app not configured." }, { status: 500 });
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
