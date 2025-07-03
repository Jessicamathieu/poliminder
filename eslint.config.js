// eslint.config.js
import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Règles de formatage de base
      "indent": ["error", 2], // Utilise 2 espaces pour l'indentation
      "quotes": ["error", "double"], // Utilise des guillemets doubles
      "semi": ["error", "always"], // Exige des points-virgules à la fin des déclarations
      "no-trailing-spaces": "error", // Interdit les espaces en fin de ligne
      "eol-last": ["error", "always"], // Exige une nouvelle ligne à la fin du fichier
      "object-curly-spacing": ["error", "always"], // Exige des espaces à l'intérieur des accolades d'objets
      "array-bracket-spacing": ["error", "always"], // Exige des espaces à l'intérieur des crochets de tableau
      "space-in-parens": ["error", "never"], // Interdit les espaces à l'intérieur des parenthèses
      "comma-spacing": ["error", { "before": false, "after": true }], // Exige un espace après les virgules, interdit avant
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }], // Exige un espace après les deux points dans les propriétés d'objet
      "arrow-spacing": ["error", { "before": true, "after": true }], // Exige un espace avant et après les flèches des fonctions fléchées
      "block-spacing": ["error", "always"], // Exige un espace à l'intérieur des blocs de code
      "brace-style": ["error", "1tbs"], // Style d'accolades
      "keyword-spacing": ["error", { "before": true, "after": true }], // Exige un espace autour des mots-clés

      // Désactiver ou modifier certaines règles recommandées si nécessaire
      // Par exemple, si max-len pose problème :
      // "max-len": ["warn", { "code": 120, "ignoreUrls": true }],
    }
  }
];