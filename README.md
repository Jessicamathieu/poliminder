# Jessica Gestion - Fonctions Firebase

Ce projet contient les fonctions Cloud (Firebase Functions) pour l'application Jessica Gestion.

## Structure du Projet

- `functions/`: Le répertoire principal contenant le code source des fonctions.
  - `src/`: Code source TypeScript.
  - `lib/`: Code JavaScript compilé (généré automatiquement).
  - `package.json`: Dépendances et scripts pour les fonctions.
  - `tsconfig.json`: Configuration TypeScript.

## Déploiement

Pour déployer les fonctions, exécutez la commande suivante depuis la racine du projet :

```bash
firebase deploy --only functions
```

Le projet est configuré pour installer les dépendances et compiler automatiquement le code TypeScript avant chaque déploiement.
