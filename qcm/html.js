/* QCM interactif : les bases du HTML.
   Chaque bloc enchaîne une leçon (avec un exemple modifiable), des questions, puis un exercice
   de code vérifié automatiquement (voir js/verifs.js pour les outils V). */
QCM.ajouter({
  id: "html",
  titre: "Les bases du HTML",
  resume: "Leçons, questions et exercices de code en direct pour créer ta première page web, pas à pas.",
  intro: [
    "Chaque bloc commence par une courte leçon, avec un exemple que tu peux modifier : le résultat s’affiche en direct.",
    "Viennent ensuite des questions, puis des exercices où tu écris toi-même du HTML. Clique sur Vérifier pour savoir si ton code est juste : tu peux réessayer autant de fois que tu veux."
  ],

  themes: [
    { id:"bases",        nom:"Découvrir le HTML",        note:"Ce qu’est le HTML et le squelette d’une page." },
    { id:"elements",     nom:"Les éléments",             note:"Balises ouvrantes, fermantes, imbriquées et vides." },
    { id:"attributs",    nom:"Les attributs",            note:"Donner des informations en plus à un élément." },
    { id:"titres",       nom:"Titres et paragraphes",    note:"De `<h1>` à `<h6>`, `<p>`, `<br>` et `<hr>`." },
    { id:"style",        nom:"L’attribut style",         note:"Changer la couleur, la taille et l’alignement." },
    { id:"formatage",    nom:"La mise en forme",         note:"Gras, italique, surligné, barré, indice, exposant." },
    { id:"commentaires", nom:"Les commentaires",         note:"Des notes dans le code, invisibles sur la page." },
    { id:"couleurs",     nom:"Les couleurs",             note:"Noms, `rgb()` et code hexadécimal." },
    { id:"liens",        nom:"Les liens",                note:"Relier les pages entre elles avec `<a>`." },
    { id:"images",       nom:"Les images",               note:"Afficher une image et la décrire." },
    { id:"tableaux",     nom:"Les tableaux",             note:"Ranger des données en lignes et en colonnes." },
    { id:"div",          nom:"Les blocs : div et span",  note:"Des boîtes pour regrouper et décorer." },
    { id:"boutons",      nom:"Les boutons",              note:"Créer et décorer un bouton." },
    { id:"responsive",   nom:"Le responsive",            note:"Une page qui s’adapte au téléphone comme à l’ordinateur." }
  ],

  questions: [
    /* ================= Découvrir le HTML ================= */
    { id:"bases-l1", t:"bases", type:"lecon", titre:"Qu’est-ce que le HTML ?",
      contenu:[
        "Le **HTML** (HyperText Markup Language, « langage de balisage hypertexte ») est le langage qui décrit le contenu d’une page web : ses titres, ses paragraphes, ses images, ses liens…",
        "Ce n’est pas un langage de programmation : il ne calcule rien. Il sert à dire au navigateur **ce qu’est** chaque morceau de la page. Le navigateur (Firefox, Chrome, Safari…) lit ce code et l’affiche.",
        "Pour cela, on entoure le contenu de **balises**. Une balise s’écrit entre chevrons : `<p>` ouvre un paragraphe, `</p>` le ferme. La balise fermante a une barre oblique.",
        { code:`<p>Bonjour tout le monde !</p>` },
        "Pour écrire du HTML, un simple éditeur de texte suffit. On enregistre le fichier avec l’extension `.html`, puis on l’ouvre avec un navigateur. Ici, l’éditeur est intégré : tu tapes ton code, et le résultat s’affiche juste en dessous."
      ],
      exemple:
`<h1>Mon premier titre</h1>
<p>Mon premier paragraphe.</p>
<p>Change ce texte, et regarde le résultat !</p>` },

    { id:"bases-l2", t:"bases", type:"lecon", titre:"Le squelette d’une page",
      contenu:[
        "Toute page HTML suit le même squelette :",
        { code:
`<!DOCTYPE html>
<html>
<head>
  <title>Titre de l’onglet</title>
</head>
<body>
  <h1>Un grand titre</h1>
  <p>Un paragraphe.</p>
</body>
</html>` },
        "`<!DOCTYPE html>` annonce au navigateur que la page est écrite en HTML moderne.",
        "`<html>` contient toute la page. Dedans, `<head>` (la tête) regroupe les informations **sur** la page, invisibles dans la fenêtre : par exemple `<title>`, le titre affiché dans l’onglet.",
        "`<body>` (le corps) contient tout ce qui s’affiche à l’écran."
      ],
      exemple:
`<!DOCTYPE html>
<html>
<head>
  <title>Ma page</title>
</head>
<body>
  <h1>Bienvenue !</h1>
  <p>Tout ce qui est dans body s’affiche ici.</p>
</body>
</html>` },

    { id:"bases-1", t:"bases", q:"Que signifie l’abréviation HTML ?",
      r:["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Making Language", "High Technology Modern Language"], b:0,
      e:"C’est un langage de **balisage** : il décrit le contenu grâce à des balises, sans rien calculer." },

    { id:"bases-2", t:"bases", q:"Avec quelle extension enregistre-t-on une page web ?",
      r:["`.html`", "`.txt`", "`.doc`", "`.jpg`"], b:0,
      e:"Un fichier `index.html` s’ouvre directement dans un navigateur. C’est d’ailleurs le nom de la page d’accueil de la plupart des sites." },

    { id:"bases-3", t:"bases", q:"Dans quelle partie met-on le contenu visible : titres, paragraphes, images ?",
      r:["Dans `<body>`", "Dans `<head>`", "Dans `<title>`", "Avant `<!DOCTYPE html>`"], b:0,
      e:"`<head>` contient les informations sur la page, `<body>` tout ce qui s’affiche." },

    { id:"bases-4", t:"bases", q:"Où s’affiche le texte placé dans `<title>` ?",
      r:["Dans l’onglet du navigateur", "En gros au milieu de la page", "En bas de la page", "Nulle part"], b:0,
      e:"Le titre d’onglet sert aussi aux favoris et aux moteurs de recherche : chaque page devrait en avoir un." },

    { id:"bases-c1", t:"bases", type:"code",
      q:"Complète ce squelette : ajoute le titre d’onglet **Ma page** dans `<head>`, puis un grand titre `<h1>` de ton choix dans `<body>`.",
      depart:
`<!DOCTYPE html>
<html>
<head>

</head>
<body>

</body>
</html>`,
      verifs:[
        { msg:"Un `<title>` contenant « Ma page » se trouve dans `<head>`",
          test:function(doc){ return /^ma page$/i.test(V.texte(doc, "head > title")); } },
        { msg:"Un `<h1>` non vide se trouve dans `<body>`",
          test:function(doc){ return V.texte(doc, "body h1") !== ""; } }
      ],
      solution:
`<!DOCTYPE html>
<html>
<head>
  <title>Ma page</title>
</head>
<body>
  <h1>Bienvenue sur ma page</h1>
</body>
</html>`,
      e:"Tu as écrit ta première page complète ! Ce squelette est le même pour tous les sites du monde." },

    /* ================= Les éléments ================= */
    { id:"elements-l1", t:"elements", type:"lecon", titre:"Balises et éléments",
      contenu:[
        "Un **élément** HTML est formé d’une balise ouvrante, d’un contenu et d’une balise fermante :",
        { code:`<h1>Mon titre</h1>` },
        "Les éléments peuvent s’**imbriquer** : un élément peut en contenir d’autres, comme des poupées russes. Ici, le paragraphe contient un `<strong>` :",
        { code:`<p>Ce mot est <strong>important</strong>.</p>` },
        "Règle d’or : on ferme d’abord ce qu’on a ouvert en dernier. `<p><strong>Salut</p></strong>` est faux, `<p><strong>Salut</strong></p>` est juste.",
        "Certains éléments sont **vides** : ils n’ont ni contenu ni balise fermante. Par exemple `<br>` (retour à la ligne) et `<hr>` (ligne de séparation).",
        "On écrit toujours les balises en minuscules, et on n’oublie jamais de les fermer : le navigateur essaie de deviner, mais pas toujours comme on voudrait."
      ],
      exemple:
`<p>Ce mot est <strong>important</strong>.</p>
<hr>
<p>Première ligne<br>Deuxième ligne</p>` },

    { id:"elements-1", t:"elements", q:"Laquelle de ces lignes est correctement imbriquée ?",
      r:["`<p><strong>Salut</strong></p>`", "`<p><strong>Salut</p></strong>`", "`<strong><p>Salut</strong></p>`", "`<p><strong>Salut</p>`"], b:0,
      e:"Le `<strong>` a été ouvert en dernier, il doit donc être fermé en premier." },

    { id:"elements-2", t:"elements", q:"Lequel de ces éléments est vide, sans balise fermante ?",
      r:["`<br>`", "`<p>`", "`<h1>`", "`<body>`"], b:0,
      e:"`<br>` ne contient rien : il insère simplement un retour à la ligne. `<hr>` et `<img>` sont aussi des éléments vides." },

    { id:"elements-c1", t:"elements", type:"code",
      q:"Ce code a deux erreurs : le `<strong>` est mal fermé, et le deuxième paragraphe n’est pas fermé du tout. Corrige-les.",
      depart:
`<h1>Ma recette</h1>
<p>Préchauffe le four. <strong>Attention, c’est chaud !</p></strong>
<p>Mélange la farine et les œufs.`,
      verifs:[
        { msg:"`</strong>` est fermé avant `</p>`",
          test:function(doc, code){ return !/<\/p>\s*<\/strong>/i.test(code) && /<\/strong>\s*<\/p>/i.test(code); } },
        { msg:"Chaque `<p>` a sa balise fermante `</p>`",
          test:function(doc, code){ return (code.match(/<p[\s>]/gi) || []).length === (code.match(/<\/p>/gi) || []).length; } },
        { msg:"« Attention, c’est chaud ! » est toujours en gras",
          test:function(doc){ return /attention/i.test(V.texte(doc, "p strong")); } }
      ],
      solution:
`<h1>Ma recette</h1>
<p>Préchauffe le four. <strong>Attention, c’est chaud !</strong></p>
<p>Mélange la farine et les œufs.</p>`,
      e:"Bien imbriquer ses balises évite des pages qui s’affichent bizarrement… et des heures à chercher l’erreur." },

    /* ================= Les attributs ================= */
    { id:"attributs-l1", t:"attributs", type:"lecon", titre:"Les attributs",
      contenu:[
        "Les **attributs** donnent des informations supplémentaires sur un élément. Ils s’écrivent toujours dans la **balise ouvrante**, sous la forme `nom=\"valeur\"` :",
        { code:`<a href="https://fr.wikipedia.org">Wikipédia</a>` },
        "Quelques attributs très utilisés :",
        "`href` donne l’adresse d’un lien · `src` le fichier d’une image · `alt` la description d’une image · `width` et `height` sa largeur et sa hauteur.",
        "`title` ajoute une info-bulle, qui apparaît quand on survole l’élément avec la souris.",
        "`lang`, placé sur `<html>`, indique la langue de la page : `<html lang=\"fr\">`. Cela aide les lecteurs d’écran à bien prononcer le texte.",
        "On écrit le nom de l’attribut en minuscules et la valeur **entre guillemets**. Un élément peut avoir plusieurs attributs, séparés par des espaces."
      ],
      exemple:
`<p title="Coucou, je suis une info-bulle !">Passe la souris sur ce paragraphe.</p>
<img src="img/chat.svg" alt="Un chat orange assis" width="160">` },

    { id:"attributs-1", t:"attributs", q:"Où s’écrit un attribut ?",
      r:["Dans la balise ouvrante, sous la forme `nom=\"valeur\"`", "Dans la balise fermante", "Entre les deux balises, avec le texte", "Tout en haut de la page, avant `<html>`"], b:0,
      e:"Par exemple `<img src=\"chat.png\">` : l’attribut `src` est dans la balise, avec sa valeur entre guillemets." },

    { id:"attributs-2", t:"attributs", q:"Que fait l’attribut `title` sur un paragraphe ?",
      r:["Il affiche une info-bulle quand on survole le paragraphe", "Il change le titre de l’onglet", "Il transforme le paragraphe en titre `<h1>`", "Il souligne le texte"], b:0,
      e:"Attention à ne pas confondre l’attribut `title` (une info-bulle) avec l’élément `<title>` (le titre de l’onglet)." },

    { id:"attributs-c1", t:"attributs", type:"code",
      q:"Indique que la page est en français avec l’attribut `lang` sur `<html>`, puis ajoute au paragraphe une info-bulle (`title`) qui dit « Bonjour ! ».",
      depart:
`<!DOCTYPE html>
<html>
<body>
  <p>Passe la souris sur moi !</p>
</body>
</html>`,
      verifs:[
        { msg:"`<html>` a l’attribut `lang` avec la valeur `fr`",
          test:function(doc){ return /^fr\b/i.test(doc.documentElement.getAttribute("lang") || ""); } },
        { msg:"Le paragraphe a une info-bulle qui dit « Bonjour ! »",
          test:function(doc){ return /bonjour/i.test(V.attr(doc, "p", "title")); } },
        { msg:"Les valeurs sont entre guillemets",
          test:function(doc, code){ return /lang\s*=\s*["']/i.test(code) && /title\s*=\s*["']/i.test(code); } }
      ],
      solution:
`<!DOCTYPE html>
<html lang="fr">
<body>
  <p title="Bonjour !">Passe la souris sur moi !</p>
</body>
</html>`,
      e:"Passe la souris sur le paragraphe dans le résultat : ton info-bulle apparaît." },

    /* ================= Titres et paragraphes ================= */
    { id:"titres-l1", t:"titres", type:"lecon", titre:"Les titres",
      contenu:[
        "Il existe six niveaux de titres, de `<h1>` (le plus important) à `<h6>` (le moins important).",
        { code:`<h1>Le titre de la page</h1>
<h2>Une grande partie</h2>
<h3>Une sous-partie</h3>` },
        "En général, une page a **un seul** `<h1>` : son titre principal. Les `<h2>` la découpent en parties, les `<h3>` en sous-parties, comme le plan d’un exposé.",
        "Les titres ne servent pas à écrire en gros : ils donnent la **structure** de la page. Les moteurs de recherche et les lecteurs d’écran des personnes aveugles s’en servent pour comprendre et parcourir la page."
      ],
      exemple:
`<h1>Titre 1</h1>
<h2>Titre 2</h2>
<h3>Titre 3</h3>
<h4>Titre 4</h4>
<h5>Titre 5</h5>
<h6>Titre 6</h6>` },

    { id:"titres-l2", t:"titres", type:"lecon", titre:"Les paragraphes",
      contenu:[
        "Un paragraphe s’écrit avec `<p>`. Le navigateur ajoute automatiquement un peu d’espace avant et après.",
        "Surprise : le navigateur **ignore** les retours à la ligne et les espaces en trop dans ton code. Tout s’affiche à la suite.",
        "Pour aller à la ligne sans changer de paragraphe, on utilise `<br>`. Pour séparer deux parties par une ligne horizontale, on utilise `<hr>`."
      ],
      exemple:
`<p>Ce paragraphe
est écrit sur
plusieurs lignes,      avec plein d’espaces.</p>

<hr>

<p>Ici, on va<br>vraiment<br>à la ligne.</p>` },

    { id:"titres-1", t:"titres", q:"Quel élément donne le titre le plus important ?",
      r:["`<h1>`", "`<h6>`", "`<head>`", "`<title>`"], b:0,
      e:"`<h1>` est le titre principal, `<h6>` le moins important. `<head>` et `<title>` ne s’affichent pas dans la page." },

    { id:"titres-2", t:"titres", q:"Tu écris deux phrases sur deux lignes, dans le même `<p>`. Comment s’affichent-elles ?",
      r:["À la suite, sur la même ligne", "Sur deux lignes, comme dans le code", "Dans deux paragraphes séparés", "Le navigateur affiche une erreur"], b:0,
      e:"Les retours à la ligne du code sont ignorés. Pour aller à la ligne : `<br>`, ou deux paragraphes." },

    { id:"titres-3", t:"titres", q:"Pourquoi ne faut-il pas utiliser `<h1>` juste pour écrire en gros ?",
      r:["Parce que les titres servent à donner le plan de la page, pas à changer la taille", "Parce que `<h1>` est interdit dans `<body>`", "Parce que `<h1>` ralentit la page", "Parce qu’on ne peut mettre qu’un mot dans un `<h1>`"], b:0,
      e:"Pour changer la taille du texte, on utilise le style (`font-size`), qu’on verra un peu plus loin." },

    { id:"titres-c1", t:"titres", type:"code",
      q:"Écris un grand titre `<h1>` « Mes vacances », puis un sous-titre `<h2>` « Le voyage », puis un paragraphe qui raconte ce que tu veux.",
      depart:
`<!-- Écris ton code sous cette ligne -->
`,
      verifs:[
        { msg:"Un `<h1>` contient « Mes vacances »", test:function(doc){ return /mes vacances/i.test(V.texte(doc, "h1")); } },
        { msg:"Un `<h2>` contient « Le voyage »",    test:function(doc){ return /le voyage/i.test(V.texte(doc, "h2")); } },
        { msg:"Il y a un paragraphe non vide",        test:function(doc){ return V.texte(doc, "p") !== ""; } },
        { msg:"Dans l’ordre : `<h1>`, puis `<h2>`, puis `<p>`",
          test:function(doc){ return V.avant(V.el(doc, "h1"), V.el(doc, "h2")) && V.avant(V.el(doc, "h2"), V.el(doc, "p")); } }
      ],
      solution:
`<h1>Mes vacances</h1>
<h2>Le voyage</h2>
<p>Nous sommes partis en train jusqu’à la mer.</p>`,
      e:"Titre, sous-titre, texte : c’est la structure de presque toutes les pages web." },

    { id:"titres-c2", t:"titres", type:"code",
      q:"Écris un petit poème d’au moins trois lignes dans **un seul** paragraphe, en allant à la ligne avec `<br>`.",
      depart:
`<h2>Mon poème</h2>
`,
      verifs:[
        { msg:"Il y a un paragraphe `<p>`",                   test:function(doc){ return !!V.el(doc, "p"); } },
        { msg:"Ce paragraphe contient au moins deux `<br>`",  test:function(doc){ return V.tous(doc, "p").some(function(p){ return p.querySelectorAll("br").length >= 2; }); } },
        { msg:"Il n’y a qu’un seul paragraphe",               test:function(doc){ return V.tous(doc, "p").length === 1; } }
      ],
      solution:
`<h2>Mon poème</h2>
<p>Le chat dort au soleil,<br>
il rêve de souris,<br>
et ronronne à merveille.</p>`,
      e:"`<br>` est parfait pour les poèmes et les adresses, où le retour à la ligne fait partie du texte." },

    /* ================= L’attribut style ================= */
    { id:"style-l1", t:"style", type:"lecon", titre:"L’attribut style",
      contenu:[
        "L’attribut `style` change l’apparence d’un élément : couleur, taille, police, alignement…",
        { code:`<p style="color:red;">Un texte rouge</p>` },
        "Sa valeur contient une ou plusieurs **déclarations** `propriété:valeur;`, séparées par des points-virgules :",
        { code:`<h1 style="color:blue; text-align:center;">Titre bleu centré</h1>` },
        "Les propriétés les plus utiles pour commencer :",
        "`color` : la couleur du texte · `background-color` : la couleur de fond · `font-size` : la taille du texte, par exemple `30px` · `font-family` : la police, par exemple `Arial` ou `Georgia` · `text-align` : l’alignement, `left`, `center` ou `right`.",
        "Ces propriétés font partie du **CSS**, le langage qui gère l’apparence des pages. Un QCM entier lui est consacré !"
      ],
      exemple:
`<body style="background-color:lightyellow;">
  <h1 style="color:darkorange; text-align:center;">Ma page ensoleillée</h1>
  <p style="font-family:Georgia; font-size:22px;">Un texte plus grand, dans une autre police.</p>
</body>` },

    { id:"style-1", t:"style", q:"Quelle écriture est correcte ?",
      r:["`<p style=\"color:red;\">`", "`<p color=\"red\">`", "`<p style=\"color=red\">`", "`<p style:\"color:red\">`"], b:0,
      e:"Attribut `style`, signe égal, guillemets, puis à l’intérieur `propriété:valeur;` avec deux-points." },

    { id:"style-2", t:"style", q:"Quelle propriété change la taille du texte ?",
      r:["`font-size`", "`text-size`", "`font-style`", "`size`"], b:0,
      e:"`font-size:24px;` par exemple. `font-style` sert à mettre en italique." },

    { id:"style-c1", t:"style", type:"code",
      q:"Crée un titre `<h1>` **centré** et de la **couleur de ton choix**, puis un paragraphe dont la taille de texte est `20px`.",
      depart:
`<!-- Écris ton code sous cette ligne -->
`,
      verifs:[
        { msg:"Le `<h1>` est centré",                 test:function(doc){ return V.style(V.el(doc, "h1"), "text-align") === "center"; } },
        { msg:"Le `<h1>` a une couleur (pas noire)",  test:function(doc){ return V.couleurChoisie(V.el(doc, "h1"), "color", [0,0,0]); } },
        { msg:"Le paragraphe a un texte de `20px`",   test:function(doc){ return V.style(V.el(doc, "p"), "font-size") === "20px"; } }
      ],
      solution:
`<h1 style="text-align:center; color:purple;">Mon site</h1>
<p style="font-size:20px;">Bienvenue chez moi !</p>`,
      e:"Essaie d’autres couleurs (`teal`, `crimson`, `royalblue`…) et d’autres tailles : c’est toi le designer." },

    /* ================= La mise en forme ================= */
    { id:"formatage-l1", t:"formatage", type:"lecon", titre:"Mettre le texte en forme",
      contenu:[
        "`<b>` et `<strong>` mettent en gras. `<strong>` dit en plus que le texte est **important**.",
        "`<i>` et `<em>` mettent en italique. `<em>` met l’accent sur un mot, comme quand on insiste à l’oral.",
        "`<mark>` surligne · `<small>` écrit plus petit · `<del>` barre un texte supprimé · `<ins>` souligne un texte ajouté.",
        "`<sub>` met en indice (le 2 de H₂O) et `<sup>` en exposant (le 3 de 2³)."
      ],
      exemple:
`<p><strong>Important</strong> et <b>gras</b></p>
<p><em>Accentué</em> et <i>italique</i></p>
<p><mark>Surligné</mark> et <small>petit</small></p>
<p><del>Barré</del> et <ins>ajouté</ins></p>
<p>H<sub>2</sub>O et 2<sup>3</sup> = 8</p>` },

    { id:"formatage-1", t:"formatage", q:"Quel élément écrit le 2 de H₂O en indice ?",
      r:["`<sub>`", "`<sup>`", "`<small>`", "`<del>`"], b:0,
      e:"**sub** comme « sous » : en dessous de la ligne. **sup** comme « super » : au-dessus." },

    { id:"formatage-2", t:"formatage", q:"Quelle est la différence entre `<strong>` et `<b>` ?",
      r:["Les deux mettent en gras, mais `<strong>` indique en plus que le texte est important", "`<b>` est plus gras que `<strong>`", "`<strong>` souligne le texte", "Aucune, `<b>` n’existe plus"], b:0,
      e:"Le résultat à l’écran est le même, mais un lecteur d’écran peut insister sur un `<strong>`." },

    { id:"formatage-c1", t:"formatage", type:"code",
      q:"C’est les soldes ! Barre l’ancien prix avec `<del>`, surligne le nouveau avec `<mark>`, et écris correctement H₂O avec `<sub>`.",
      depart:
`<p>Ancien prix : 50 €</p>
<p>Nouveau prix : 30 €</p>
<p>Formule de l’eau : H2O</p>`,
      verifs:[
        { msg:"L’ancien prix (50) est barré avec `<del>`",  test:function(doc){ return /50/.test(V.texte(doc, "del")); } },
        { msg:"Le nouveau prix (30) est surligné avec `<mark>`", test:function(doc){ return /30/.test(V.texte(doc, "mark")); } },
        { msg:"Le 2 de H₂O est en indice avec `<sub>`",      test:function(doc){ return V.texte(doc, "sub") === "2"; } }
      ],
      solution:
`<p>Ancien prix : <del>50 €</del></p>
<p>Nouveau prix : <mark>30 €</mark></p>
<p>Formule de l’eau : H<sub>2</sub>O</p>`,
      e:"Ces petits éléments se placent **à l’intérieur** du paragraphe, autour du mot à mettre en forme." },

    /* ================= Les commentaires ================= */
    { id:"commentaires-l1", t:"commentaires", type:"lecon", titre:"Les commentaires",
      contenu:[
        "Un commentaire est une note laissée dans le code. Le navigateur l’ignore complètement : il n’apparaît pas sur la page.",
        { code:`<!-- Ceci est un commentaire -->` },
        "Il commence par `<!--` et se termine par `-->`. Il peut tenir sur plusieurs lignes.",
        "Il sert à expliquer son code, à laisser un pense-bête, ou à **désactiver** un morceau de code sans l’effacer, pour faire un test.",
        "Attention : un commentaire est invisible sur la page, mais il n’est **pas secret** ! N’importe qui peut lire le code d’une page (clic droit, « Afficher le code source de la page »)."
      ],
      exemple:
`<!-- Le titre de ma page -->
<h1>Mon blog</h1>

<!-- <p>Ce paragraphe est désactivé : il ne s’affiche pas.</p> -->

<p>Celui-ci s’affiche.</p>` },

    { id:"commentaires-1", t:"commentaires", q:"Comment écrit-on un commentaire en HTML ?",
      r:["`<!-- mon commentaire -->`", "`// mon commentaire`", "`<comment>mon commentaire</comment>`", "`# mon commentaire`"], b:0,
      e:"`//` sert dans d’autres langages comme JavaScript, et `#` en Python. En HTML, c’est toujours `<!-- … -->`." },

    { id:"commentaires-2", t:"commentaires", q:"Peut-on cacher un mot de passe dans un commentaire HTML ?",
      r:["Non : n’importe qui peut lire le code source d’une page", "Oui, le commentaire est invisible", "Oui, s’il est écrit sur plusieurs lignes", "Oui, si le site est en https"], b:0,
      e:"Le code HTML est envoyé tel quel au navigateur de chaque visiteur. Rien de ce qu’il contient n’est secret." },

    { id:"commentaires-c1", t:"commentaires", type:"code",
      q:"Le paragraphe « Promo secrète » ne doit plus s’afficher : transforme-le en commentaire **sans l’effacer**. Ajoute aussi, tout en haut, un commentaire qui dit qui a écrit la page.",
      depart:
`<h1>Le blog de Sam</h1>
<p>Bienvenue sur mon blog !</p>
<p>Promo secrète : -50 % sur tout !</p>`,
      verifs:[
        { msg:"« Promo secrète » ne s’affiche plus",           test:function(doc){ return !/promo/i.test(doc.body.textContent); } },
        { msg:"Elle est toujours dans le code, en commentaire", test:function(doc, code){ return /<!--[\s\S]*promo[\s\S]*?-->/i.test(code); } },
        { msg:"Il y a au moins deux commentaires",              test:function(doc, code){ return (code.match(/<!--[\s\S]*?-->/g) || []).length >= 2; } },
        { msg:"Le titre et le message de bienvenue s’affichent toujours",
          test:function(doc){ return !!V.el(doc, "h1") && /bienvenue/i.test(doc.body.textContent); } }
      ],
      solution:
`<!-- Page écrite par Sam -->
<h1>Le blog de Sam</h1>
<p>Bienvenue sur mon blog !</p>
<!-- <p>Promo secrète : -50 % sur tout !</p> -->`,
      e:"Désactiver du code avec un commentaire est un réflexe de développeur : on peut le remettre en un instant." },

    /* ================= Les couleurs ================= */
    { id:"couleurs-l1", t:"couleurs", type:"lecon", titre:"Les couleurs",
      contenu:[
        "Les couleurs s’utilisent dans le style, avec `color` (le texte), `background-color` (le fond) ou `border` (la bordure).",
        "Il y a trois façons courantes d’écrire une couleur :",
        "Par son **nom** en anglais : `red`, `tomato`, `gold`, `skyblue`, `violet`… Il en existe 140 !",
        "En **RGB** (rouge, vert, bleu) : `rgb(255, 99, 71)`. Chaque nombre va de 0 à 255 et dit combien on met de chaque lumière. `rgb(0, 0, 0)` est le noir, `rgb(255, 255, 255)` le blanc.",
        "En **hexadécimal** : `#ff6347`. Deux caractères pour le rouge, deux pour le vert, deux pour le bleu, de `00` à `ff`.",
        { code:`<p style="color:tomato;">Par son nom</p>
<p style="color:rgb(255, 99, 71);">En RGB</p>
<p style="color:#ff6347;">En hexadécimal</p>` },
        "Ces trois lignes ont exactement la même couleur : un rouge tomate."
      ],
      exemple:
`<h2 style="background-color:tomato; color:white;">tomato</h2>
<h2 style="background-color:rgb(60, 179, 113); color:white;">rgb(60, 179, 113)</h2>
<h2 style="background-color:#6a5acd; color:white;">#6a5acd</h2>
<p>Change les nombres pour inventer ta couleur !</p>` },

    { id:"couleurs-1", t:"couleurs", q:"Quelle couleur donne `rgb(0, 0, 0)` ?",
      r:["Le noir", "Le blanc", "Le rouge", "Le gris"], b:0,
      e:"Zéro lumière rouge, zéro verte, zéro bleue : c’est le noir. Tout au maximum, `rgb(255, 255, 255)`, donne le blanc." },

    { id:"couleurs-2", t:"couleurs", q:"Que donne `rgb(255, 0, 0)` ?",
      r:["Du rouge", "Du vert", "Du bleu", "Du blanc"], b:0,
      e:"Le premier nombre est le rouge, au maximum ; le vert et le bleu sont éteints." },

    { id:"couleurs-3", t:"couleurs", q:"Quelle propriété change la couleur de fond ?",
      r:["`background-color`", "`color`", "`border-color`", "`fond`"], b:0,
      e:"`color` change la couleur du texte, `background-color` celle du fond." },

    { id:"couleurs-c1", t:"couleurs", type:"code",
      q:"Crée une bannière : un `<h1>` avec une couleur de texte **et** une couleur de fond de ton choix. Utilise au moins une couleur écrite en `rgb(…)` ou en `#hexadécimal`.",
      depart:
`<!-- Écris ton code sous cette ligne -->
`,
      verifs:[
        { msg:"Le `<h1>` a une couleur de texte (pas noire)", test:function(doc){ return V.couleurChoisie(V.el(doc, "h1"), "color", [0,0,0]); } },
        { msg:"Le `<h1>` a une couleur de fond",              test:function(doc){ return V.couleurChoisie(V.el(doc, "h1"), "background-color"); } },
        { msg:"Une couleur est écrite en `rgb(…)` ou en `#hexadécimal`",
          test:function(doc, code){ return /rgba?\s*\(|#[0-9a-f]{3,8}\b/i.test(code); } }
      ],
      solution:
`<h1 style="color:#ffffff; background-color:rgb(255, 99, 71);">Bienvenue chez moi</h1>`,
      e:"Astuce : cherche « color picker » dans un moteur de recherche pour trouver le code de n’importe quelle couleur." },

    /* ================= Les liens ================= */
    { id:"liens-l1", t:"liens", type:"lecon", titre:"Créer un lien",
      contenu:[
        "Les liens font du web une toile : ils permettent de passer d’une page à l’autre d’un simple clic.",
        "Un lien s’écrit avec l’élément `<a>` (de l’anglais anchor, « ancre »). L’adresse de destination se place dans l’attribut `href` :",
        { code:`<a href="https://fr.wikipedia.org">Aller sur Wikipédia</a>` },
        "Le texte entre `<a>` et `</a>` est ce qui s’affiche et sur quoi on clique. Il doit dire où mène le lien : « Voir les horaires » plutôt que « Cliquez ici ».",
        "Avec `target=\"_blank\"`, le lien s’ouvre dans un nouvel onglet."
      ],
      exemple:
`<p>Je cherche souvent sur <a href="https://fr.wikipedia.org" target="_blank">Wikipédia</a>.</p>
<p>Et j’apprends le code sur <a href="https://www.w3schools.com/html/" target="_blank">W3Schools</a>.</p>` },

    { id:"liens-1", t:"liens", q:"Quel attribut indique l’adresse de destination d’un lien ?",
      r:["`href`", "`src`", "`link`", "`url`"], b:0,
      e:"`href` pour les liens, `src` pour les images : les deux sont faciles à confondre !" },

    { id:"liens-2", t:"liens", q:"Que fait `target=\"_blank\"` dans un lien ?",
      r:["Il ouvre la page dans un nouvel onglet", "Il rend le lien invisible", "Il empêche de cliquer sur le lien", "Il écrit le lien en noir"], b:0,
      e:"Pratique pour un lien vers un autre site : ta page reste ouverte dans le premier onglet." },

    { id:"liens-c1", t:"liens", type:"code",
      q:"Crée un lien vers `https://www.w3schools.com` dont le texte est « Apprendre le HTML », et qui s’ouvre dans un nouvel onglet.",
      depart:
`<p>Pour aller plus loin :</p>
`,
      verifs:[
        { msg:"Un lien `<a>` mène à `https://www.w3schools.com`",
          test:function(doc){ return /^https:\/\/www\.w3schools\.com\/?$/i.test(V.attr(doc, "a", "href")); } },
        { msg:"Son texte est « Apprendre le HTML »", test:function(doc){ return /^apprendre le html$/i.test(V.texte(doc, "a")); } },
        { msg:"Il s’ouvre dans un nouvel onglet",    test:function(doc){ return V.attr(doc, "a", "target") === "_blank"; } }
      ],
      solution:
`<p>Pour aller plus loin :</p>
<a href="https://www.w3schools.com" target="_blank">Apprendre le HTML</a>`,
      e:"Clique sur ton lien dans le résultat pour le tester : une seule faute de frappe dans l’adresse, et il ne mène nulle part." },

    /* ================= Les images ================= */
    { id:"images-l1", t:"images", type:"lecon", titre:"Afficher une image",
      contenu:[
        "Une image s’affiche avec l’élément `<img>`. Comme `<br>`, c’est un élément vide : pas de balise fermante.",
        { code:`<img src="img/chat.svg" alt="Un chat orange assis" width="200">` },
        "`src` (source) donne l’adresse du fichier image : un fichier à côté de la page, ou une adresse sur internet.",
        "`alt` (texte alternatif) décrit l’image. Il s’affiche si l’image ne se charge pas, et il est lu à voix haute aux personnes aveugles. Il est obligatoire.",
        "`width` et `height` fixent la largeur et la hauteur, en pixels. Si on n’en donne qu’une, l’autre s’adapte pour ne pas déformer l’image.",
        "Pour rendre une image cliquable, on la place dans un lien : `<a href=\"…\"><img …></a>`."
      ],
      exemple:
`<img src="img/chat.svg" alt="Un chat orange assis" width="150">
<img src="img/introuvable.png" alt="Cette image n’existe pas, alors son texte alt s’affiche">
<p>Change la largeur du chat, ou fais une faute dans src pour voir le texte alt.</p>` },

    { id:"images-1", t:"images", q:"Quel attribut donne l’adresse du fichier image ?",
      r:["`src`", "`href`", "`alt`", "`img`"], b:0,
      e:"`src` comme source. `href` est réservé aux liens." },

    { id:"images-2", t:"images", q:"À quoi sert l’attribut `alt` ?",
      r:["À décrire l’image, pour ceux qui ne peuvent pas la voir", "À choisir la taille de l’image", "À ajouter un cadre autour de l’image", "À rendre l’image cliquable"], b:0,
      e:"Il sert aux personnes aveugles, aux connexions lentes et aux moteurs de recherche." },

    { id:"images-3", t:"images", q:"Laquelle de ces écritures est correcte ?",
      r:["`<img src=\"chat.png\" alt=\"Un chat\">`", "`<img>chat.png</img>`", "`<image href=\"chat.png\">`", "`<img alt=\"chat.png\" src=\"Un chat\">`"], b:0,
      e:"`<img>` est vide : tout passe par ses attributs, `src` pour le fichier et `alt` pour la description." },

    { id:"images-c1", t:"images", type:"code",
      q:"Affiche l’image `img/chat.svg`, avec une description dans `alt`, et une largeur de 120 pixels.",
      depart:
`<h1>Mon animal préféré</h1>
`,
      verifs:[
        { msg:"Une image affiche `img/chat.svg`", test:function(doc){ return V.attr(doc, "img", "src") === "img/chat.svg"; } },
        { msg:"Elle a une description dans `alt`", test:function(doc){ return V.attr(doc, "img", "alt").length >= 3; } },
        { msg:"Elle fait 120 pixels de large",     test:function(doc){ const i = V.el(doc, "img"); return !!i && i.getBoundingClientRect().width === 120; } }
      ],
      solution:
`<h1>Mon animal préféré</h1>
<img src="img/chat.svg" alt="Un chat orange assis dans l’herbe" width="120">`,
      e:"Une bonne description dit ce qu’on voit, en une phrase courte : « Un chat orange assis dans l’herbe »." },

    /* ================= Les tableaux ================= */
    { id:"tableaux-l1", t:"tableaux", type:"lecon", titre:"Les tableaux",
      contenu:[
        "Un tableau s’écrit avec `<table>`. Il se construit **ligne par ligne** : chaque ligne est un `<tr>` (table row).",
        "Dans chaque ligne, une case s’écrit `<td>` (table data). Pour une case d’en-tête, en gras et centrée, on utilise `<th>` (table header).",
        { code:`<table>
  <tr>
    <th>Prénom</th>
    <th>Âge</th>
  </tr>
  <tr>
    <td>Léa</td>
    <td>12</td>
  </tr>
</table>` },
        "Toutes les lignes doivent avoir le même nombre de cases, sinon le tableau devient bancal.",
        "Dans l’exemple, la petite partie `<style>` ajoute des bordures : c’est du CSS, que tu découvriras dans le QCM suivant."
      ],
      exemple:
`<style>
  table, th, td { border: 1px solid black; border-collapse: collapse; padding: 6px; }
</style>

<table>
  <tr>
    <th>Prénom</th>
    <th>Âge</th>
    <th>Animal</th>
  </tr>
  <tr>
    <td>Léa</td>
    <td>12</td>
    <td>Chat</td>
  </tr>
  <tr>
    <td>Tom</td>
    <td>13</td>
    <td>Lapin</td>
  </tr>
</table>` },

    { id:"tableaux-1", t:"tableaux", q:"Dans un tableau, que représente `<tr>` ?",
      r:["Une ligne", "Une colonne", "Une case", "Le titre du tableau"], b:0,
      e:"**t**able **r**ow : une ligne. Les colonnes, elles, apparaissent toutes seules quand on aligne les cases." },

    { id:"tableaux-2", t:"tableaux", q:"Quelle est la différence entre `<th>` et `<td>` ?",
      r:["`<th>` est une case d’en-tête, `<td>` une case de données", "`<th>` est une ligne, `<td>` une colonne", "`<td>` est plus grande que `<th>`", "Aucune, ce sont deux noms pour la même chose"], b:0,
      e:"`<th>` s’affiche en gras et centré, et indique ce que contient la colonne." },

    { id:"tableaux-c1", t:"tableaux", type:"code",
      q:"Complète l’emploi du temps : une ligne d’en-tête avec les cases « Jour » et « Matière », puis au moins deux lignes de données.",
      depart:
`<style>
  table, th, td { border: 1px solid black; border-collapse: collapse; padding: 6px; }
</style>

<table>

</table>`,
      verifs:[
        { msg:"Une case d’en-tête `<th>` « Jour »",    test:function(doc){ return V.tous(doc, "th").some(function(c){ return /jour/i.test(c.textContent); }); } },
        { msg:"Une case d’en-tête `<th>` « Matière »", test:function(doc){ return V.tous(doc, "th").some(function(c){ return /mati[eè]re/i.test(c.textContent); }); } },
        { msg:"Au moins deux lignes de données `<td>`",
          test:function(doc){ return V.tous(doc, "tr").filter(function(tr){ return tr.querySelector("td"); }).length >= 2; } },
        { msg:"Toutes les lignes ont le même nombre de cases",
          test:function(doc){
            const n = V.tous(doc, "tr").map(function(tr){ return tr.children.length; });
            return n.length > 0 && n.every(function(x){ return x === n[0]; });
          } }
      ],
      solution:
`<style>
  table, th, td { border: 1px solid black; border-collapse: collapse; padding: 6px; }
</style>

<table>
  <tr>
    <th>Jour</th>
    <th>Matière</th>
  </tr>
  <tr>
    <td>Lundi</td>
    <td>Technologie</td>
  </tr>
  <tr>
    <td>Mardi</td>
    <td>Mathématiques</td>
  </tr>
</table>`,
      e:"Les tableaux servent à présenter des données : horaires, scores, résultats… pas à mettre en page un site." },

    /* ================= div et span ================= */
    { id:"div-l1", t:"div", type:"lecon", titre:"Les blocs : div et span",
      contenu:[
        "Certains éléments sont des **blocs** : ils commencent sur une nouvelle ligne et prennent toute la largeur. C’est le cas de `<p>`, `<h1>`, `<table>`…",
        "D’autres sont **en ligne** : ils restent dans le texte et ne prennent que la place nécessaire. C’est le cas de `<a>`, `<strong>`, `<img>`…",
        "`<div>` est un bloc qui ne veut rien dire de spécial : c’est une **boîte**, qui sert à regrouper d’autres éléments pour leur donner un style commun.",
        { code:`<div style="background-color:lightblue; padding:10px;">
  <h2>Ma boîte</h2>
  <p>Tout ce qui est dans le div partage son fond bleu.</p>
</div>` },
        "`<span>` est son cousin en ligne : il entoure un morceau de texte pour le décorer, sans aller à la ligne."
      ],
      exemple:
`<div style="background-color:lavender; padding:12px; border-radius:10px;">
  <h2>Super Léa</h2>
  <p>Pouvoir : <span style="color:crimson; font-weight:bold;">voler très vite</span></p>
</div>
<div style="background-color:honeydew; padding:12px; margin-top:10px;">
  <p>Un deuxième div, en dessous du premier.</p>
</div>` },

    { id:"div-1", t:"div", q:"À quoi sert un `<div>` ?",
      r:["À regrouper des éléments dans une boîte, par exemple pour leur donner un style commun", "À afficher une image", "À créer un lien", "À diviser un nombre"], b:0,
      e:"Un site entier est souvent construit avec des `<div>` : l’en-tête, le menu, le contenu, le pied de page…" },

    { id:"div-2", t:"div", q:"Quelle est la différence entre `<div>` et `<span>` ?",
      r:["`<div>` est un bloc qui va à la ligne, `<span>` reste dans la ligne du texte", "`<span>` est plus grand que `<div>`", "`<div>` ne peut contenir que du texte", "Aucune"], b:0,
      e:"Pour colorer un mot au milieu d’une phrase, on prend un `<span>` ; pour une boîte entière, un `<div>`." },

    { id:"div-c1", t:"div", type:"code",
      q:"Crée ta carte de profil : un `<div>` avec une couleur de fond, qui contient un titre `<h2>` (ton pseudo) et un paragraphe. Dans le paragraphe, colore un mot avec un `<span>`.",
      depart:
`<!-- Écris ton code sous cette ligne -->
`,
      verifs:[
        { msg:"Un `<div>` contient un `<h2>` et un `<p>`", test:function(doc){ return !!V.el(doc, "div h2") && !!V.el(doc, "div p"); } },
        { msg:"Le `<div>` a une couleur de fond",          test:function(doc){ return V.tous(doc, "div").some(function(d){ return V.couleurChoisie(d, "background-color"); }); } },
        { msg:"Un `<span>` dans le paragraphe a une couleur", test:function(doc){ return V.tous(doc, "p span").some(function(s){ return V.couleurChoisie(s, "color", [0,0,0]); }); } }
      ],
      solution:
`<div style="background-color:lightyellow; padding:12px;">
  <h2>Pixel_Léa</h2>
  <p>J’adore les <span style="color:green;">jeux de construction</span>.</p>
</div>`,
      e:"Ajoute `padding:12px;` et `border-radius:10px;` au style du div pour une carte encore plus jolie." },

    /* ================= Les boutons ================= */
    { id:"boutons-l1", t:"boutons", type:"lecon", titre:"Les boutons",
      contenu:[
        "`<button>` crée un bouton cliquable. Le texte entre les balises s’affiche sur le bouton, emojis compris 🎉.",
        { code:`<button>Clique-moi</button>` },
        "On le décore avec `style` : `background-color`, `color`, `font-size`, `padding` (l’espace à l’intérieur) et `border-radius` (des coins arrondis).",
        "L’attribut `disabled` le désactive : il devient gris et on ne peut plus cliquer dessus.",
        "Pour qu’un bouton fasse quelque chose quand on clique, il faut un autre langage, **JavaScript**. Ici, on apprend à le créer et à le rendre beau."
      ],
      exemple:
`<button>Bouton normal</button>

<button style="background-color:mediumseagreen; color:white; font-size:20px; padding:10px 24px; border:none; border-radius:12px;">
  Jouer ▶
</button>

<button disabled>Désactivé</button>` },

    { id:"boutons-1", t:"boutons", q:"Que fait l’attribut `disabled` sur un bouton ?",
      r:["Il le désactive : on ne peut plus cliquer dessus", "Il le cache complètement", "Il le colore en rouge", "Il le fait clignoter"], b:0,
      e:"On l’utilise par exemple tant qu’un formulaire n’est pas rempli." },

    { id:"boutons-2", t:"boutons", q:"Quelle propriété arrondit les coins d’un bouton ?",
      r:["`border-radius`", "`round`", "`corner`", "`border-style`"], b:0,
      e:"Plus la valeur est grande, plus c’est arrondi : `border-radius:50px` donne une pilule." },

    { id:"boutons-c1", t:"boutons", type:"code",
      q:"Crée un bouton « Jouer » vraiment stylé : une couleur de fond, une couleur de texte, des coins arrondis, et un texte plus grand que la normale.",
      depart:
`<!-- Écris ton code sous cette ligne -->
`,
      verifs:[
        { msg:"Un `<button>` dit « Jouer »",         test:function(doc){ return /jouer/i.test(V.texte(doc, "button")); } },
        { msg:"Il a une couleur de fond",            test:function(doc){ return V.couleurChoisie(V.el(doc, "button"), "background-color", [239,239,239], [240,240,240]); } },
        { msg:"Il a une couleur de texte (pas noire)", test:function(doc){ return V.couleurChoisie(V.el(doc, "button"), "color", [0,0,0]); } },
        { msg:"Il a des coins arrondis",             test:function(doc){ return parseFloat(V.style(V.el(doc, "button"), "border-top-left-radius")) > 0; } },
        { msg:"Son texte est plus grand (au moins `16px`)", test:function(doc){ return parseFloat(V.style(V.el(doc, "button"), "font-size")) >= 16; } }
      ],
      solution:
`<button style="background-color:tomato; color:white; font-size:24px; padding:10px 30px; border:none; border-radius:20px;">
  Jouer ▶
</button>`,
      e:"Tu viens de dessiner un bouton comme ceux des jeux et des applications. Dans le QCM CSS, tu apprendras à le faire grossir quand on passe la souris dessus." },

    /* ================= Le responsive ================= */
    { id:"responsive-l1", t:"responsive", type:"lecon", titre:"Une page pour tous les écrans",
      contenu:[
        "Une page web est vue sur un téléphone, une tablette ou un grand écran. Une page **responsive** s’adapte à toutes ces tailles.",
        "Étape 1, indispensable : la balise `<meta name=\"viewport\">` dans `<head>`. Elle dit au téléphone d’afficher la page à sa vraie largeur, au lieu de la rapetisser comme un écran d’ordinateur.",
        { code:`<meta name="viewport" content="width=device-width, initial-scale=1">` },
        "Étape 2 : des images qui ne débordent pas. Avec `max-width:100%`, une image rétrécit pour tenir dans l’écran, sans jamais dépasser sa taille d’origine. `height:auto` garde ses proportions.",
        { code:`<img src="img/chat.svg" alt="Un chat" style="max-width:100%; height:auto;">` },
        "Étape 3 : éviter les grandes largeurs fixes en pixels. `max-width:600px` sur un bloc veut dire « 600 pixels au maximum, moins si l’écran est plus petit ».",
        "Pour aller plus loin, le CSS peut changer toute la mise en page selon la taille de l’écran avec `@media`. Tu le verras dans le QCM CSS."
      ],
      exemple:
`<div style="max-width:400px; background-color:aliceblue; padding:10px;">
  <h2>Je fais 400 pixels maximum</h2>
  <img src="img/chat.svg" alt="Un chat orange assis" width="900" style="max-width:100%; height:auto;">
  <p>L’image fait 900 pixels de large, mais elle ne déborde pas !</p>
</div>` },

    { id:"responsive-1", t:"responsive", q:"Que veut dire qu’une page est « responsive » ?",
      r:["Elle s’adapte à la taille de l’écran", "Elle répond aux messages", "Elle se charge très vite", "Elle ne contient pas d’images"], b:0,
      e:"Aujourd’hui, plus de la moitié des visites se font sur téléphone : une page qui ne s’adapte pas est vite abandonnée." },

    { id:"responsive-2", t:"responsive", q:"À quoi sert `max-width:100%` sur une image ?",
      r:["À l’empêcher de déborder de l’écran", "À l’agrandir pour remplir tout l’écran", "À la cacher sur téléphone", "À doubler sa taille"], b:0,
      e:"« Au maximum 100 % de la place disponible » : l’image rétrécit si besoin, mais ne s’agrandit jamais au-delà de sa taille." },

    { id:"responsive-3", t:"responsive", q:"Où place-t-on la balise `<meta name=\"viewport\" …>` ?",
      r:["Dans `<head>`", "Dans `<body>`", "Tout à la fin de la page", "Dans une image"], b:0,
      e:"Comme `<title>`, c’est une information **sur** la page : elle va dans `<head>`." },

    { id:"responsive-c1", t:"responsive", type:"code",
      q:"Rends cette page responsive : ajoute la balise viewport dans `<head>`, et empêche l’image de déborder avec `max-width:100%` et `height:auto`.",
      depart:
`<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Mon chat</title>
</head>
<body>
  <h1>Mon chat</h1>
  <img src="img/chat.svg" alt="Un chat orange assis" width="900">
</body>
</html>`,
      verifs:[
        { msg:"La balise viewport est dans `<head>`",
          test:function(doc){ return /width\s*=\s*device-width/i.test(V.attr(doc, "head meta[name=viewport]", "content")); } },
        { msg:"L’image a `max-width:100%`", test:function(doc){ return V.style(V.el(doc, "img"), "max-width") === "100%"; } },
        { msg:"L’image a `height:auto`",
          test:function(doc){
            const img = V.el(doc, "img");
            return !!img && (img.style.height === "auto" ||
              V.selecteur(doc, /img/).some(function(r){ return r.style.height === "auto"; }));
          } },
        { msg:"L’image ne déborde plus de la page",
          test:function(doc){ const img = V.el(doc, "img"); return !!img && img.getBoundingClientRect().right <= doc.documentElement.clientWidth; } }
      ],
      solution:
`<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Mon chat</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Mon chat</h1>
  <img src="img/chat.svg" alt="Un chat orange assis" width="900" style="max-width:100%; height:auto;">
</body>
</html>`,
      e:"Ces deux réglages suffisent déjà à rendre la plupart des pages lisibles sur un téléphone." }
  ],

  bilans: [
    { min:.84, texte:"Bravo, tu maîtrises les bases du HTML ! Tu es prêt pour le QCM CSS, qui va rendre tes pages vraiment belles." },
    { min:.60, texte:"Tu as de bonnes bases. Relis les leçons des blocs où tu t’es trompé, puis refais leurs exercices." },
    { min:.36, texte:"Les grandes idées sont là, mais plusieurs détails restent à travailler. Refais les exercices : c’est en écrivant du code qu’on apprend." },
    { min:0,   texte:"Le HTML est encore tout neuf pour toi, et c’est normal. Relis les leçons tranquillement et amuse-toi avec les exemples." }
  ]
});
