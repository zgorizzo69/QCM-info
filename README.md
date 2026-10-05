# QCM informatique

Des QCM pour faire le point sur ses connaissances en informatique. C’est un site statique, sans
installation ni serveur : il fonctionne en ouvrant `index.html` dans un navigateur, ou en ligne via
GitHub Pages.

## Utilisation

1. **Sessions** : chaque élève crée une session avec son prénom ou un pseudo. Les sessions sont
   enregistrées dans le navigateur (`localStorage`). Chaque réponse y est ajoutée dès qu’elle est donnée.
   Les sessions peuvent être **exportées** en fichier JSON (une seule, ou toutes à la fois), puis
   **importées** sur un autre poste.
2. **Choix du QCM** : la liste des QCM disponibles, avec le dernier score ou la progression du QCM en
   cours, ainsi que l’historique des passages déjà terminés.
3. **Choix des blocs** : on peut passer tous les thèmes du QCM ou seulement certains. Un QCM interrompu
   peut être repris.
4. **Questions**, puis **résultat** par thème, avec la liste des questions à revoir.

## Publier sur GitHub Pages

Dans le dépôt GitHub : *Settings → Pages → Build and deployment*, choisir *Deploy from a branch*,
la branche `master` et le dossier `/ (root)`. Le site est ensuite servi à
`https://<utilisateur>.github.io/QCM-info/`.

Pour tester en local : ouvrir `index.html`, ou lancer `python3 -m http.server` et aller sur
<http://localhost:8000>.

## Ajouter un QCM

1. Créer un fichier dans `qcm/`, par exemple `qcm/tableur.js` :

   ```js
   QCM.ajouter({
     id: "tableur",                       // identifiant unique, enregistré dans les sessions
     titre: "Les bases du tableur",
     resume: "Cellules, formules et graphiques.",
     intro: ["Une seule réponse est bonne à chaque fois."],
     themes: [
       { id:"cellules", nom:"Les cellules", note:"Lignes, colonnes et références." }
     ],
     questions: [
       { id:"cellules-1", t:"cellules", q:"Comment s’appelle la case en haut à gauche ?",
         r:["A1", "1A", "Z1", "A0"], b:0,
         e:"Une cellule est désignée par sa colonne (une lettre) puis sa ligne (un nombre)." }
     ],
     bilans: [
       { min:.8, texte:"Très bien !" },
       { min:0,  texte:"C’est un début." }
     ]
   });
   ```

2. Ajouter la ligne `<script src="qcm/tableur.js"></script>` dans `index.html`, avec les autres QCM.

Pour chaque question : `t` est l’id du thème, `r` les réponses (de 2 à 6), `b` l’indice de la bonne
réponse dans `r` (l’ordre est mélangé à l’affichage), `e` l’explication montrée après la réponse.

L’`id` de chaque question est ce qui est enregistré dans les sessions : on peut corriger le texte
d’une question sans perdre l’historique, mais il ne faut pas réutiliser un ancien id pour une
question différente. Une erreur dans un fichier QCM (id en double, thème inconnu…) est signalée dans
la console du navigateur, et ce QCM n’est pas affiché.

## Format des sessions exportées

```json
{
  "format": "qcm-info/session",
  "version": 1,
  "exporteLe": "2026-10-05T09:12:00.000Z",
  "session": {
    "id": "…", "nom": "Lucas", "creeLe": "…", "majLe": "…",
    "tentatives": [
      { "id": "…", "qcm": "positionnement", "debut": "…", "fin": "…",
        "themes": ["vocab", "pc"],
        "ordre": [ { "q": "vocab-1", "p": [2, 0, 3, 1] } ],
        "reponses": [ { "q": "vocab-1", "choix": 0, "juste": true, "le": "…" } ] }
    ]
  }
}
```

`choix` est l’indice de la réponse choisie dans la liste `r` du fichier QCM. L’export de toutes les
sessions utilise `"format": "qcm-info/sessions"` avec un tableau `sessions`.
