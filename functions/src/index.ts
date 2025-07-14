/**
 * Fichier principal pour les fonctions Cloud de Firebase.
 *
 * @see https://firebase.google.com/docs/functions
 */
import * as dotenv from "dotenv";
dotenv.config();

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import QuickBooks from "node-quickbooks";

// Initialise l'admin SDK pour interagir avec les services Firebase.
admin.initializeApp();

// Pour limiter les coûts et améliorer les performances,
// nous définissons un maximum de 10 instances par fonction.
setGlobalOptions({ maxInstances: 10 });

const qboConfig = {
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
    scopes: process.env.QUICKBOOKS_SCOPES?.split(','),
    environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
};

// Fonction pour initier l'authentification QuickBooks
export const quickbooksAuth = onRequest({ cors: true }, async (request, response) => {
    logger.info("⚡ Fonction quickbooksAuth appelée !");
    
    if (!qboConfig.clientId || !qboConfig.clientSecret || !qboConfig.redirectUri || !qboConfig.scopes) {
        logger.error("Configuration QuickBooks incomplète. Vérifiez les variables d'environnement.");
        response.status(500).send("Erreur de configuration du serveur.");
        return;
    }

    const qbo = new QuickBooks(
        qboConfig.clientId,
        qboConfig.clientSecret,
        '', // Pas de token pour l'instant
        false, // no-token-secret
        '', // realmId
        qboConfig.environment === 'production',
        false, // debug
        4, // minorversion
        '2.0', // oauth version
        '' // refresh token
    );

    const authUri = qbo.getAuthorizationUri(qboConfig.scopes);
    logger.info("Redirection vers l'URI d'authentification QuickBooks:", authUri);
    response.redirect(authUri);
});

// Fonction callback pour gérer la redirection de QuickBooks
export const quickbooksCallback = onRequest(async (request, response) => {
    logger.info("⚡ Fonction quickbooksCallback appelée !");

    if (!qboConfig.clientId || !qboConfig.clientSecret) {
        logger.error("Configuration QuickBooks incomplète pour le callback. Vérifiez les variables d'environnement.");
        response.status(500).send("Erreur de configuration du serveur.");
        return;
    }

    const qbo = new QuickBooks(
        qboConfig.clientId,
        qboConfig.clientSecret,
        '', // Pas de token pour l'instant
        false, // no-token-secret
        '', // realmId
        qboConfig.environment === 'production',
        false, // debug
        4, // minorversion
        '2.0', // oauth version
        '' // refresh token
    );

    try {
        const tokenResponse = await qbo.getBearerToken(request.url);
        const { access_token, refresh_token, realmId } = tokenResponse;

        if (!access_token || !refresh_token || !realmId) {
            throw new Error("Réponse de jeton invalide de QuickBooks.");
        }

        // Sauvegarder les tokens de manière sécurisée (ici, dans Firestore)
        const db = admin.firestore();
        const settingsDocRef = db.collection('settings').doc('quickbooks');
        await settingsDocRef.set({
            connected: true,
            accessToken: access_token,
            refreshToken: refresh_token,
            realmId: realmId,
            expiresAt: new Date(Date.now() + 3600 * 1000), // Access token expires in 1 hour
            refreshedAt: new Date(),
        }, { merge: true });

        logger.info("Tokens QuickBooks reçus et stockés avec succès.");
        
        // Rediriger l'utilisateur vers la page d'administration
        const appAdminUrl = process.env.APP_ADMIN_URL || '/admin';
        response.redirect(appAdminUrl);

    } catch (error) {
        logger.error("Erreur durant le callback QuickBooks:", error);
        response.status(500).send("Erreur lors de la connexion à QuickBooks.");
    }
});


/**
 * helloJessica: une fonction HTTP qui répond avec un message de bienvenue.
 */
export const helloJessica = onRequest((request, response) => {
  logger.info("⚡ Fonction helloJessica appelée !", { structuredData: true });
  response.status(200).send("Ton app est prête Jessica 🎉");
});
