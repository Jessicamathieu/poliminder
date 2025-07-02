# **App Name**: PoliMindeR

## Core Features:

- Authentification Utilisateur Sécurisée: Authentification utilisateur sécurisée utilisant Firebase Auth pour un accès sécurisé avec des rôles utilisateur.
- Tableau de Bord Personnalisé: Tableau de bord affichant les indicateurs clés tels que les revenus, les dépenses, les factures en retard et les rendez-vous à venir, personnalisé pour Jessica et Mikael.
- Outils de Gestion: Gestion des clients, des services, des rendez-vous et des projets.
- Facturation Automatisée: Création automatisée de factures dans QuickBooks à partir des rendez-vous complétés, compatible avec QuickBooks Canada.
- Suivi des Dépenses par IA: Ajout de dépenses via l'IA en utilisant le traitement du langage naturel (par exemple, 'Ajoute une dépense essence 80$ chez Shell'), en publiant les données sur QuickBooks. LLM utilise un 'outil' pour déterminer si les détails des dépenses ont été correctement spécifiés par l'utilisateur.
- Traitement des Commandes IA: Traitement des commandes IA (par exemple, 'Montre-moi les revenus de mai', 'Facture les rendez-vous de cette semaine', 'Ajoute une dépense d'entretien'). LLM utilise un 'outil' pour déterminer si la commande a du sens.
- Accès Basés sur les Rôles: Autorisations basées sur les rôles utilisateur pour deux utilisateurs, Jessica et Mikael, en fonction de leurs horaires et rôles individuels.
- Page d’Administration: Page d’administration complète pour Jessica (admin) avec accès à toutes les fonctionnalités et données.
- Vue Simplifiée: Vue simplifiée pour Mikael (terrain) avec accès limité aux informations et fonctionnalités essentielles à son rôle.

## Style Guidelines:

- Couleur primaire : Bleu électrique (#2743E3) pour une sensation moderne et engageante.
- Couleur de fond : Mauve clair (#E2D9EB) pour offrir un contraste doux, éviter la dureté et favoriser une expérience utilisateur confortable.
- Couleur d'accent : Fuchsia (#FF00FF) pour les mises en évidence et les appels à l'action, offrant un contraste visuellement saisissant qui attire l'attention.
- Association de polices : 'Poppins' (sans-serif) pour les titres et 'PT Sans' (sans-serif) pour le corps du texte. Remarque : seules les polices Google sont actuellement prises en charge.
- Une interface moderne, propre et fluide optimisée pour les appareils mobiles et de bureau, offrant une expérience utilisateur transparente sur tous les appareils.
- Icônes simples et claires qui communiquent rapidement la fonction et l'état des différents éléments, améliorant la reconnaissance et la navigation dans l'application.
- Transitions et animations subtiles pour fournir un retour d'information à l'utilisateur, en maintenant une sensation de douceur et de fluidité sans distractions inutiles.