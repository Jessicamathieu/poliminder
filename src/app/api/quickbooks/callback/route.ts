
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
        return NextResponse.json({ error: "Connexion à QuickBooks annulée", description: error }, { status: 400 });
    }
    
    if (!code || !realmId) {
        return NextResponse.json({ error: "Le code d'autorisation ou l'ID de la société est manquant dans le callback." }, { status: 400 });
    }

    try {
        const clientId = process.env.QUICKBOOKS_CLIENT_ID;
        const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

        if (!clientId || !clientSecret || !siteUrl) {
            throw new Error("Les variables d'environnement pour QuickBooks ou l'URL du site ne sont pas entièrement configurées.");
        }

        const redirectUri = `${siteUrl}/api/quickbooks/callback`;
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
            console.error("Erreur lors de l'obtention du token:", errorBody);
            return NextResponse.json({ error: "Échec de l'échange du code d'autorisation contre un token.", details: errorBody }, { status: response.status });
        }

        const tokens = await response.json();
        
        console.log('✅ Tokens QuickBooks reçus, sauvegarde dans Firestore...');

        // Sauvegarde des tokens dans Firestore
        await saveQuickBooksTokens({
            realmId: realmId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in,
            x_refresh_token_expires_in: tokens.x_refresh_token_expires_in,
        });
        
        // Redirection vers la page admin avec un paramètre de succès
        return NextResponse.redirect(`${siteUrl}/admin?quickbooks=success`);

    } catch (error) {
        console.error('Erreur dans le callback QuickBooks:', error);
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
