# QCM informatique

Des QCM pour faire le point sur ses connaissances en informatique, et des cours interactifs pour
apprendre à coder. C’est un site statique, sans installation ni serveur : il fonctionne en ouvrant
`index.html` dans un navigateur, ou en ligne via GitHub Pages.

QCM disponibles :

- **Ce que tu sais déjà sur l’ordinateur** (`qcm/positionnement.js`) : QCM de positionnement.
- **Intelligence artificielle et sécurité en ligne** (`qcm/ia-securite.js`).
- **Fichiers, dossiers et terminal** (`qcm/fichiers.js`) : arborescence, commandes `ls`, `cd`, `pwd`,
  `mkdir`, `touch`, `cat`, `nano` dans un terminal simulé, et édition de texte.
- **Les bases du HTML** (`qcm/html.js`) : leçons, questions et exercices de code en direct.
- **L’atelier CSS** (`qcm/css.js`) : leçons et défis créatifs pour décorer ses pages.

## Utilisation

1. **Sessions** : chaque élève crée une session avec son prénom ou un pseudo. Les sessions sont
   enregistrées dans le navigateur (`localStorage`). Chaque réponse y est ajoutée dès qu’elle est donnée.
   Les sessions peuvent être **exportées** en fichier JSON (une seule, ou toutes à la fois), puis
   **importées** sur un autre poste.
2. **Choix du QCM** : la liste des QCM disponibles, avec la progression du QCM en cours. La section
   **Mes résultats** donne une note sur 20 par QCM (celle du dernier passage terminé, avec la
   meilleure note) et la moyenne générale. L’historique liste les passages déjà terminés.
3. **Choix des blocs** : on peut passer tous les thèmes du QCM ou seulement certains. Un QCM interrompu
   peut être repris.
4. **Questions**, puis **résultat** par thème, avec la liste des questions à revoir.

Dans les cours interactifs, chaque bloc commence par une **leçon** avec un exemple modifiable (le
résultat s’affiche en direct) ou un terminal d’entraînement, une liste « À toi d’essayer » de petites
modifications qui se cochent dès qu’elles sont faites, et un lien vers la leçon correspondante sur
W3Schools. Viennent ensuite des questions, puis un **exercice** vérifié automatiquement : l’élève
peut réessayer autant de fois qu’il veut, ou afficher une solution.

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

### Leçons et exercices de code

En plus des questions à choix, un QCM peut contenir deux autres types d’étapes, placées dans
`questions` à l’endroit où elles doivent apparaître :

```js
{ id:"liens-l1", t:"liens", type:"lecon", titre:"Créer un lien",
  contenu:[
    "Un lien s’écrit avec l’élément `<a>`.",          // paragraphe (`code` et **gras** permis)
    { code:`<a href="https://fr.wikipedia.org">Wikipédia</a>` }   // bloc de code
  ],
  exemple:`<a href="https://fr.wikipedia.org">Wikipédia</a>` },  // éditeur en direct (facultatif)

{ id:"liens-c1", t:"liens", type:"code",
  q:"Crée un lien vers Wikipédia.",
  depart:`<p>Pour aller plus loin :</p>`,                // code de départ
  verifs:[
    { msg:"Un lien mène à Wikipédia",
      test:function(doc, code){ return /wikipedia/.test(V.attr(doc, "a", "href")); } }
  ],
  solution:`<p>Pour aller plus loin :</p>
<a href="https://fr.wikipedia.org">Wikipédia</a>`,
  e:"Explication affichée une fois l’exercice terminé." }
```

Une leçon peut aussi proposer des essais et un lien :

```js
essais:[
  { texte:"Remplace `purple` par `red`.",                // coché dès que le test réussit
    test:function(doc, code){ return V.style(V.el(doc, "h1"), "color") === "rgb(255, 0, 0)"; } },
  "Tire le coin du résultat pour le rétrécir."          // simple conseil, sans coche
],
lien:"https://www.w3schools.com/css/css_syntax.asp"
```

Avec `apercu:false`, l’exemple ou l’exercice est un simple éditeur de texte (le test reçoit
`doc = null`). Pour le terminal simulé (`js/terminal.js`), une leçon donne `terminal:{…}` (le contenu
du dossier personnel : un texte est un fichier, un objet un dossier), et un exercice
`type:"terminal"` donne `fs`, une `solution` (liste de commandes, ou `{ nano, texte }`) et des
vérifications `test(etat)` : `etat.estDossier("mon-site")`, `etat.aAffiche("notes.txt")`,
`etat.aVisite("Documents")`, `etat.a_tape(/^pwd$/)`…

Chaque vérification reçoit `doc`, la page réellement rendue (on peut donc lire les styles calculés),
et `code`, le texte tapé par l’élève. Les outils de `js/verifs.js` (`V.texte`, `V.attr`, `V.style`,
`V.couleurChoisie`, `V.selecteur`, `V.proprietes`…) simplifient l’écriture des tests. L’aperçu
n’exécute jamais de script. Les leçons ne comptent pas dans le score ; `etiquette` permet de changer
le petit titre (« Leçon », « Exercice ») affiché au-dessus.

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

`choix` est l’indice de la réponse choisie dans la liste `r` du fichier QCM. Une leçon lue est
enregistrée comme `{ "q": "…", "lu": true }`, un exercice de code comme
`{ "q": "…", "code": "…", "juste": true, "essais": 2 }` : le code tapé par l’élève est conservé
(pour un exercice de terminal, `code` contient les commandes tapées).
L’export de toutes les sessions utilise `"format": "qcm-info/sessions"` avec un tableau `sessions`.
