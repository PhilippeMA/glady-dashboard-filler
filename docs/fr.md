# Dashboard Filler

Gladys n'affiche pas les colonnes vides d'un tableau de bord : si vous
configurez trois colonnes et qu'une seule contient des widgets, elle prend
toute la largeur. Cette intégration ajoute un widget **Espace vide** : placé
dans une colonne, il la conserve, et le tableau de bord affiche bien le
nombre de colonnes choisi.

## Installation

1. Installez l'intégration **Dashboard Filler** depuis le catalogue des
   intégrations de Gladys (Gladys 5.1 ou plus récent).
2. Il n'y a rien à configurer : l'écran de configuration indique simplement
   que l'intégration est connectée.

## Utilisation

1. Modifiez votre tableau de bord.
2. Dans chaque colonne qui doit rester vide, ajoutez un widget
   **Widget d'intégration** et choisissez **Espace vide**.
3. Enregistrez.

Réglages du widget (facultatifs) :

- **Hauteur (en lignes)** — hauteur de la zone vide de la carte, de 1 à 20
  lignes de texte (1 par défaut). Utile pour aligner la carte sur ses
  voisines.
- **Texte (optionnel)** — un texte affiché en haut de la carte (« Bientôt
  ici »…). Laissé vide, la carte est vierge.

## Limites

Gladys dessine toujours le cadre et l'en-tête d'une carte de widget
d'intégration : l'intégration ne peut rendre vide que son contenu. Pour un
en-tête le plus discret possible, donnez au widget un **nom** court dans
l'éditeur du tableau de bord (par exemple un simple espace, ou « · ») :
il remplace le nom « Espace vide », l'icône reste affichée.

## Dépannage

- La carte affiche « L'intégration est arrêtée » : démarrez l'intégration
  depuis son écran de configuration.
- Consultez les logs de l'intégration depuis l'interface Gladys (ou
  `docker logs` sur l'hôte), avec `LOG_LEVEL=debug` pour le détail.
