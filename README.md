# PoliMindeR - Votre Assistant d'Entreprise Intelligent

Bienvenue dans le projet PoliMindeR ! Cette application est conçue pour aider Jessica et Mikael à gérer leur entreprise de manière efficace et intelligente.

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
- **Fonctionnalités IA (à venir)** : [Genkit](https://firebase.google.com/docs/genkit)

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

## Fonctionnement

1.  **Authentification Basée sur les Rôles** : L'application simule deux rôles : `admin` (Jessica) et `field` (Mikael). Le contexte d'authentification (`src/contexts/auth-context.tsx`) gère l'état de l'utilisateur connecté.
2.  **Interface Conditionnelle** : De nombreux composants, comme la barre de navigation (`Sidebar`), adaptent leur affichage en fonction du rôle de l'utilisateur connecté.
3.  **Pages Protégées** : L'accès à certaines pages est restreint en fonction du rôle pour assurer la sécurité et la pertinence des informations affichées.

---

## Déploiement

Pour déployer les fonctions backend, utilisez la commande suivante depuis la racine du projet :

```bash
firebase deploy --only functions
```

L'application web est déployée séparément sur une plateforme comme Firebase App Hosting ou Vercel.
