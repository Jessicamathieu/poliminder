# PoliMindeR - Votre Assistant d'Entreprise Intelligent

Bienvenue dans le projet PoliMindeR ! Cette application est conçue pour aider Jessica et Mikael à gérer leur entreprise de manière efficace et intelligente.

---

## Architecture Générale

L'application est construite sur une architecture "full-stack" moderne :

- **Frontend** : Une interface utilisateur web interactive et réactive, développée avec Next.js.
- **Backend** : Une logique serveur robuste et sans serveur, alimentée par Firebase Functions.
- **Base de données** : Une base de données NoSQL flexible avec Firebase Firestore.
- **Authentification** : Gestion sécurisée des utilisateurs avec Firebase Authentication.

---

## Technologies Utilisées (Stack Technique)

- **Framework Frontend** : [Next.js](https://nextjs.org/) (avec React)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style & UI** : [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Backend** : [Firebase Functions](https://firebase.google.com/docs/functions)
- **Base de données** : [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentification** : [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Fonctionnalités IA** : [Genkit](https://firebase.google.com/docs/genkit)

---

## Structure du Projet

Le projet est organisé comme suit pour une maintenance et une évolution claires :

- `src/`: Contient tout le code source de l'application web Next.js (le frontend).
  - `app/`: Pages et routes de l'application. La structure des dossiers définit les URL.
  - `components/`: Composants React réutilisables (ex: `layout`, `ui`, composants métier).
  - `contexts/`: Contextes React pour la gestion d'état global (ex: `auth-context.tsx`).
  - `hooks/`: Hooks React personnalisés pour la logique réutilisable (ex: `use-auth.ts`).
  - `lib/`: Fonctions utilitaires, définitions de types (`types.ts`) et données (`data.ts`).
- `functions/`: Contient le code source des fonctions Firebase (le backend).
  - `src/`: Le code TypeScript de vos fonctions.
  - `package.json`: Les dépendances spécifiques au backend.
- `public/`: Fichiers statiques (images, polices, etc.).

---

## État d'Avancement du Projet (Juillet 2024)

### ✅ Ce qui est Fait (Les Fondations Solides)

*   **Structure du Projet** : Une base propre séparant le frontend (Next.js) du backend (Firebase Functions).
*   **Interface Utilisateur de Base** : L'architecture des pages, le design général (Tailwind/ShadCN) et la navigation sont fonctionnels.
*   **Simulation d'Authentification** : Un système de connexion à deux rôles (admin/field) est en place et permet d'adapter l'interface.
*   **Affichage de Données Statiques** : Les pages affichent correctement des données de démonstration, ce qui a permis de construire l'interface rapidement.
*   **Backend Prêt** : Le projet est correctement configuré pour le déploiement de fonctions TypeScript sur Firebase.

En résumé : **Nous avons un prototype interactif et visuellement complet.**

### 🎯 Ce qui Reste à Faire (Les Prochaines Étapes Clés)

1.  **Connecter la Vraie Base de Données (Firestore)** :
    *   Créer les formulaires pour ajouter/modifier des clients, rendez-vous, etc.
    *   Remplacer les données statiques en lisant/écrivant directement dans Firestore.
2.  **Mettre en Place la Vraie Authentification** :
    *   Remplacer la simulation actuelle par le service **Firebase Authentication** pour des comptes utilisateurs sécurisés.
3.  **Implémenter les Fonctionnalités d'IA** :
    *   Connecter les composants d'interface (formulaire de dépenses, palette de commandes) à des **flux Genkit** pour le traitement du langage naturel et l'automatisation.

### 🚀 Ce qui Peut Être Amélioré (Pour une Application Professionnelle)

*   **Gestion des Erreurs et des Chargements** : Ajouter des messages d'erreur clairs pour l'utilisateur et des indicateurs de chargement plus fluides (squelettes d'interface).
*   **Sécurité des Données** : Affiner les **règles de sécurité Firestore** pour garantir que chaque utilisateur ne puisse accéder qu'aux données autorisées par son rôle.
*   **Validation des Formulaires** : Utiliser `zod` pour s'assurer que les données saisies par les utilisateurs sont valides avant de les envoyer à la base de données.

---

## Déploiement

Pour déployer les fonctions backend, utilisez la commande suivante depuis la racine du projet :

```bash
firebase deploy --only functions
```

L'application web est déployée séparément sur une plateforme comme Firebase App Hosting ou Vercel.
