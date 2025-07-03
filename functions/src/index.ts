/**
 * Fichier principal pour les fonctions Cloud de Firebase.
 *
 * @see https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions/v2";

// Initialise l'admin SDK pour interagir avec les services Firebase.
import * as admin from "firebase-admin";
admin.initializeApp();

// Pour limiter les coûts et améliorer les performances,
// nous définissons un maximum de 10 instances par fonction.
setGlobalOptions({ maxInstances: 10 });

/**
 * helloJessica: une fonction HTTP qui répond avec un message de bienvenue.
 *
 * Cette fonction est accessible via une URL publique et peut être testée
 * directement dans le navigateur ou avec un outil comme cURL.
 */
export const helloJessica = onRequest((request, response) => {
  // Journalise l'appel de la fonction (utile pour le débogage dans les logs
  // Firebase).
  logger.info("⚡ Fonction helloJessica appelée !", { structuredData: true });

  // Envoie la réponse HTTP au client. Le code de statut 200 indique que la
  // requête a été traitée avec succès.
  response.status(200).send("Ton app est prête Jessica 🎉");
});
