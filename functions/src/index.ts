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

// Initialise l'admin SDK pour interagir avec les services Firebase.
admin.initializeApp();

// Pour limiter les coûts et améliorer les performances,
// nous définissons un maximum de 10 instances par fonction.
setGlobalOptions({ maxInstances: 10 });


/**
 * helloJessica: une fonction HTTP qui répond avec un message de bienvenue.
 */
export const helloJessica = onRequest((request, response) => {
  logger.info("⚡ Fonction helloJessica appelée !", { structuredData: true });
  response.status(200).send("Ton app est prête Jessica 🎉");
});
