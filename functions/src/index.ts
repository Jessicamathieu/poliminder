/**
 * Fichier principal pour les fonctions Cloud de Firebase.
 *
 * @see https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions/v2";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import QuickBooks from "node-quickbooks";

// Initialise l'admin SDK pour interagir avec les services Firebase.
admin.initializeApp();

// Pour limiter les coûts et améliorer les performances,
// nous définissons un maximum de 10 instances par fonction.
setGlobalOptions({ maxInstances: 10 });

const qboConfig = {
    clientId: functions.config().quickbooks.client_id,
    clientSecret: functions.config().quickbooks.client_secret,
    redirectUri: functions.config().quickbooks.redirect_uri,
    scopes: functions.config().quickbooks.scopes.split(','),
    environment: functions.config().quickbooks.environment || 'sandbox',
};

// Fonction pour initier l'authentification QuickBooks
export const quickbooksAuth = onRequest(async (request, response) => {
    logger.info("⚡ Fonction quickbooksAuth appelée !");

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
    logger.info("Redirecting to QuickBooks auth URI:", authUri);
    response.redirect(authUri);
});

// Fonction callback pour gérer la redirection de QuickBooks
export const quickbooksCallback = onRequest(async (request, response) => {
    logger.info("⚡ Fonction quickbooksCallback appelée !");

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
            throw new Error("Invalid token response from QuickBooks.");
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
        });

        logger.info("Successfully received and stored QuickBooks tokens.");
        
        // Rediriger l'utilisateur vers la page d'administration
        // Remplacez par l'URL de votre application
        response.redirect('YOUR_APP_ADMIN_URL_HERE');

    } catch (error) {
        logger.error("Error during QuickBooks callback:", error);
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

