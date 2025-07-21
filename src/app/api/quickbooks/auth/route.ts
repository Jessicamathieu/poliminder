import { NextRequest, NextResponse } from 'next/server';

const authorizationEndpoint = 'https://appcenter.intuit.com/connect/oauth2';

export async function GET(req: NextRequest) {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    // La redirection URI est maintenant construite dynamiquement à partir de l'URL du site
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/quickbooks/callback`;
    const scopes = 'com.intuit.quickbooks.accounting';
    const responseType = 'code';
    // Il est recommandé d'utiliser une valeur aléatoire et non devinable pour l'état
    const state = 'security_token_which_should_be_random'; 

    if (!clientId) {
        console.error("La variable d'environnement QUICKBOOKS_CLIENT_ID n'est pas définie.");
        return NextResponse.json({ error: "L'application QuickBooks n'est pas configurée côté serveur." }, { status: 500 });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        response_type: responseType,
        state: state,
    });

    const authUri = `${authorizationEndpoint}?${params.toString()}`;
    
    // Redirige l'utilisateur vers l'URL d'autorisation de QuickBooks
    return NextResponse.redirect(authUri);
}
