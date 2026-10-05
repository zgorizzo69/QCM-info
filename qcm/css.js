/* QCM interactif : l’atelier CSS.
   Même principe que le QCM HTML (leçon, questions, exercice), mais les exercices sont des défis
   créatifs : les vérifications acceptent n’importe quel choix de couleur, de forme ou d’effet,
   tant que la technique demandée est utilisée. */
(function(){
  // Règles :hover qui changent au moins une propriété.
  function survols(doc){
    return V.selecteur(doc, /:hover/).filter(function(r){ return r.style.length > 0; });
  }

  // Un élément rond : largeur = hauteur, et coins arrondis d’au moins la moitié.
  function rond(el){
    const b = el.getBoundingClientRect();
    if(!b.width || Math.abs(b.width - b.height) > 1) return false;
    const r = V.style(el, "border-top-left-radius");
    return /%$/.test(r) ? parseFloat(r) >= 50 : parseFloat(r) >= b.width / 2;
  }

  function classesDefinies(doc){
    const noms = new Set();
    V.regles(doc).forEach(function(r){
      (r.selectorText || "").replace(/\.([\w-]+)/g, function(_, n){ noms.add(n); });
    });
    return noms;
  }

  QCM.ajouter({
    id: "css",
    titre: "L’atelier CSS : à toi de créer !",
    resume: "Couleurs, dégradés, formes, ombres, animations : des leçons à bidouiller et des défis créatifs pour décorer tes pages web.",
    intro: [
      "Le CSS, c’est la peinture, la décoration et les effets spéciaux de tes pages web.",
      "Chaque bloc commence par une leçon avec un exemple à bidouiller, puis viennent des questions et un défi créatif : il y a plein de bonnes réponses, à toi d’inventer la tienne !",
      "Conseil : fais d’abord le QCM « Les bases du HTML »."
    ],

    themes: [
      { id:"premiers",   nom:"Premiers pas en CSS",     note:"Sélecteurs, propriétés et valeurs : la grammaire du style." },
      { id:"couleurs",   nom:"Couleurs et dégradés",    note:"Transparence et dégradés pour des fonds éclatants." },
      { id:"texte",      nom:"Jouer avec le texte",     note:"Polices, tailles, ombres : crée une affiche de film." },
      { id:"classes",    nom:"Classes et id",           note:"Décorer un élément précis : ta planche de stickers." },
      { id:"boite",      nom:"La boîte magique",        note:"Padding, bordure, marge : ta carte à collectionner." },
      { id:"formes",     nom:"Formes et ombres",        note:"Dessiner avec des div : cercles, visages, planètes." },
      { id:"flex",       nom:"Ranger avec Flexbox",     note:"Mettre des boîtes côte à côte, bien réparties." },
      { id:"survol",     nom:"Survol et transitions",   note:"Des boutons qui réagissent à la souris." },
      { id:"animations", nom:"Les animations",          note:"Faire sauter, tourner, clignoter." },
      { id:"ecrans",     nom:"Tous les écrans",         note:"`@media` : une mise en page spéciale téléphone." },
      { id:"projet",     nom:"Projet libre",            note:"Ta propre page, avec tout ce que tu as appris." }
    ],

    questions: [
      /* ================= Premiers pas ================= */
      { id:"premiers-l1", t:"premiers", type:"lecon", titre:"Qu’est-ce que le CSS ?",
        contenu:[
          "Le HTML dit **ce qu’est** chaque morceau de la page. Le **CSS** (Cascading Style Sheets, « feuilles de style en cascade ») dit **à quoi il ressemble** : couleurs, tailles, polices, positions, animations…",
          "Au lieu de répéter un attribut `style` sur chaque élément, on écrit toutes les règles au même endroit, dans un élément `<style>` :",
          { code:
`<style>
  h1 {
    color: purple;
    font-size: 40px;
  }
</style>` },
          "Une **règle** se lit ainsi : le **sélecteur** (`h1`) dit à quels éléments elle s’applique ; entre accolades `{ }` viennent les déclarations `propriété: valeur;`.",
          "Ici, **tous** les `<h1>` de la page deviennent violets et grands. Une seule règle, et toute la page change : c’est la force du CSS.",
          "Dans une vraie page, `<style>` se place dans `<head>`. Dans nos exercices, on l’écrit tout en haut pour aller plus vite."
        ],
        exemple:
`<style>
  body {
    background-color: #fff8e7;
    font-family: Verdana, sans-serif;
  }
  h1 {
    color: purple;
  }
  p {
    color: teal;
  }
</style>

<h1>Mon univers</h1>
<p>Tous les paragraphes sont bleu-vert.</p>
<p>Même celui-ci ! Change la couleur dans la règle p.</p>` },

      { id:"premiers-1", t:"premiers", q:"Que signifie CSS ?",
        r:["Cascading Style Sheets : des feuilles de style", "Computer Style System", "Creative Site Software", "Colorful Sheet Script"], b:0,
        e:"« En cascade », parce que plusieurs règles peuvent s’appliquer au même élément : elles s’ajoutent, et la plus précise l’emporte." },

      { id:"premiers-2", t:"premiers", q:"Dans `h1 { color: red; }`, que représente `h1` ?",
        r:["Le sélecteur : les éléments concernés par la règle", "La propriété", "La valeur", "Le nom du fichier"], b:0,
        e:"`h1` est le sélecteur, `color` la propriété, `red` la valeur." },

      { id:"premiers-3", t:"premiers", q:"Quel signe termine une déclaration CSS ?",
        r:["Le point-virgule `;`", "Le point `.`", "La virgule `,`", "Le deux-points `:`"], b:0,
        e:"Le deux-points sépare la propriété de sa valeur, le point-virgule termine la déclaration : `color: red;`." },

      { id:"premiers-c1", t:"premiers", type:"code", etiquette:"Défi 🎨",
        q:"Relooke cette page à ton goût : une couleur de fond pour `body` (pas blanche), une couleur pour le titre `h1` et une couleur pour les paragraphes `p`. Tout se passe dans `<style>` !",
        depart:
`<style>
  body {

  }
  h1 {

  }
  p {

  }
</style>

<h1>Ma super page</h1>
<p>Bienvenue dans mon univers !</p>
<p>Ici, c’est moi qui choisis les couleurs.</p>`,
        verifs:[
          { msg:"`body` a une couleur de fond (pas blanche)",
            test:function(doc){ return V.couleurChoisie(doc.body, "background-color", [255,255,255]); } },
          { msg:"Le `h1` a une couleur (pas noire)",
            test:function(doc){ return V.couleurChoisie(V.el(doc, "h1"), "color", [0,0,0]); } },
          { msg:"Les `p` ont une couleur (pas noire)",
            test:function(doc){ return V.couleurChoisie(V.el(doc, "p"), "color", [0,0,0]); } },
          { msg:"Les couleurs sont écrites dans `<style>`, pas dans un attribut",
            test:function(doc){ return !V.el(doc, "[style]") && V.selecteur(doc, /\bh1\b/).some(function(r){ return r.style.color; }); } }
        ],
        solution:
`<style>
  body {
    background-color: #1e1e3f;
  }
  h1 {
    color: gold;
  }
  p {
    color: lightpink;
  }
</style>

<h1>Ma super page</h1>
<p>Bienvenue dans mon univers !</p>
<p>Ici, c’est moi qui choisis les couleurs.</p>`,
        e:"Fond sombre et texte clair, ou fond pastel et texte foncé : vérifie toujours que ton texte se lit bien." },

      /* ================= Couleurs et dégradés ================= */
      { id:"couleurs-l1", t:"couleurs", type:"lecon", titre:"Couleurs et dégradés",
        contenu:[
          "Tu connais les couleurs par leur nom, en `rgb()` et en `#hexadécimal`. Le CSS ajoute la **transparence** : `rgba(255, 0, 0, 0.5)` est un rouge à moitié transparent. Le dernier nombre va de `0` (invisible) à `1` (opaque).",
          "Encore mieux : les **dégradés** ! `linear-gradient` mélange plusieurs couleurs en ligne droite :",
          { code:`background: linear-gradient(orange, purple);` },
          "On peut choisir la direction (`to right`, `45deg`…) et mettre autant de couleurs qu’on veut :",
          { code:`background: linear-gradient(to right, red, orange, yellow, green, blue);` },
          "`radial-gradient` fait un dégradé en cercle, à partir du centre."
        ],
        exemple:
`<style>
  body {
    background: linear-gradient(#ff9a8b, #ff6a88, #6a4cff);
    min-height: 100vh;
    margin: 0;
  }
  h1 {
    color: white;
    text-align: center;
    padding-top: 30px;
  }
  div {
    width: 110px;
    height: 110px;
    margin: 0 auto;
    border-radius: 50%;
    background: radial-gradient(white, gold, orange);
  }
</style>

<h1>Coucher de soleil</h1>
<div></div>` },

      { id:"couleurs-1", t:"couleurs", q:"Que fait `linear-gradient(red, blue)` ?",
        r:["Un fond qui passe progressivement du rouge au bleu", "Un fond moitié rouge, moitié bleu, sans mélange", "Un texte rouge souligné en bleu", "Il choisit au hasard le rouge ou le bleu"], b:0,
        e:"Le navigateur calcule toutes les couleurs intermédiaires : rouge, violet, puis bleu." },

      { id:"couleurs-2", t:"couleurs", q:"Dans `rgba(0, 0, 255, 0.2)`, que veut dire `0.2` ?",
        r:["La couleur est très transparente", "La couleur est très foncée", "La couleur clignote", "La taille du texte"], b:0,
        e:"`a` comme alpha : l’opacité. À `0.2`, on voit surtout ce qu’il y a derrière." },

      { id:"couleurs-c1", t:"couleurs", type:"code", etiquette:"Défi 🎨",
        q:"Peins le ciel de ton choix (coucher de soleil, aurore boréale, fond de l’océan…) : donne à `body` un dégradé d’**au moins trois couleurs**, et choisis pour le titre une couleur qui se voit bien dessus.",
        depart:
`<style>
  body {
    min-height: 100vh;
    margin: 0;
    /* Ton dégradé ici */

  }
  h1 {
    text-align: center;
    padding-top: 40px;
  }
</style>

<h1>Mon ciel</h1>`,
        verifs:[
          { msg:"`body` a un dégradé", test:function(doc){ return /gradient/.test(V.style(doc.body, "background-image")); } },
          { msg:"Le dégradé a au moins trois couleurs",
            test:function(doc){ return (V.style(doc.body, "background-image").match(/rgba?\(/g) || []).length >= 3; } },
          { msg:"Le titre a une couleur (pas noire)", test:function(doc){ return V.couleurChoisie(V.el(doc, "h1"), "color", [0,0,0]); } }
        ],
        solution:
`<style>
  body {
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(#0b1d51, #1b998b, #9cf6c4);
  }
  h1 {
    text-align: center;
    padding-top: 40px;
    color: white;
  }
</style>

<h1>Mon aurore boréale</h1>`,
        e:"Essaie `linear-gradient(45deg, …)` ou `radial-gradient(…)` pour des effets complètement différents." },

      /* ================= Jouer avec le texte ================= */
      { id:"texte-l1", t:"texte", type:"lecon", titre:"Jouer avec le texte",
        contenu:[
          "`font-size` : la taille (`32px`) · `font-family` : la police · `font-weight` : l’épaisseur (`bold`, ou de `100` à `900`) · `font-style: italic` : l’italique.",
          "`text-align` : l’alignement · `text-transform: uppercase` : tout en majuscules · `letter-spacing: 5px` : de l’espace entre les lettres · `line-height` : l’espace entre les lignes.",
          "Et la plus amusante : `text-shadow`, une ombre derrière le texte. On donne le décalage horizontal, le décalage vertical, le flou, puis la couleur :",
          { code:`text-shadow: 3px 3px 0 hotpink;` },
          "Pour la police, on donne une liste : le navigateur prend la première qu’il connaît. On termine par une famille générale : `serif`, `sans-serif`, `monospace` ou `cursive`.",
          { code:`font-family: "Comic Sans MS", cursive;` }
        ],
        exemple:
`<style>
  body {
    background-color: #111;
    text-align: center;
  }
  h1 {
    color: gold;
    font-family: Impact, sans-serif;
    font-size: 56px;
    letter-spacing: 4px;
    text-transform: uppercase;
    text-shadow: 4px 4px 0 crimson;
  }
  p {
    color: white;
    font-family: Georgia, serif;
    font-style: italic;
    font-size: 20px;
  }
</style>

<h1>Le retour du chat</h1>
<p>Bientôt dans toutes les litières.</p>` },

      { id:"texte-1", t:"texte", q:"Quelle propriété ajoute une ombre derrière le texte ?",
        r:["`text-shadow`", "`font-shadow`", "`box-shadow`", "`shadow`"], b:0,
        e:"`box-shadow` existe aussi, mais il met l’ombre autour de la boîte entière : on le verra un peu plus loin." },

      { id:"texte-2", t:"texte", q:"Que fait `text-transform: uppercase;` ?",
        r:["Il écrit tout en majuscules", "Il agrandit le texte", "Il place le texte en haut de la page", "Il retourne le texte à l’envers"], b:0,
        e:"Le texte du HTML ne change pas : seul son affichage passe en majuscules." },

      { id:"texte-c1", t:"texte", type:"code", etiquette:"Défi 🎬",
        q:"Crée l’affiche de ton film imaginaire : invente son titre, mets-le dans un `<h1>` d’au moins `40px` avec une ombre `text-shadow`, et ajoute au moins **deux** autres effets parmi : police, majuscules, espacement des lettres, épaisseur, italique.",
        depart:
`<style>
  body {
    background-color: #1b1b2f;
    text-align: center;
  }
  h1 {
    color: white;

  }
</style>

<h1>Titre de ton film</h1>`,
        verifs:[
          { msg:"Tu as inventé le titre de ton film", test:function(doc){ const t = V.texte(doc, "h1"); return t !== "" && !/titre de ton film/i.test(t); } },
          { msg:"Le titre fait au moins `40px`",      test:function(doc){ return parseFloat(V.style(V.el(doc, "h1"), "font-size")) >= 40; } },
          { msg:"Le titre a une ombre `text-shadow`", test:function(doc){ return V.style(V.el(doc, "h1"), "text-shadow") !== "none"; } },
          { msg:"Au moins deux autres effets de texte",
            test:function(doc){
              const p = V.proprietes(doc);
              return ["font-family","text-transform","letter-spacing","font-weight","font-style","word-spacing"]
                .filter(function(x){ return p.has(x); }).length >= 2;
            } }
        ],
        solution:
`<style>
  body {
    background-color: #1b1b2f;
    text-align: center;
  }
  h1 {
    color: white;
    font-size: 54px;
    font-family: Impact, sans-serif;
    text-transform: uppercase;
    letter-spacing: 6px;
    text-shadow: 0 0 12px deepskyblue, 4px 4px 0 magenta;
  }
</style>

<h1>Les robots du lundi</h1>`,
        e:"Astuce : plusieurs ombres séparées par des virgules donnent un effet néon !" },

      /* ================= Classes et id ================= */
      { id:"classes-l1", t:"classes", type:"lecon", titre:"Classes et id",
        contenu:[
          "Avec `p { … }`, **tous** les paragraphes changent. Et si on veut en décorer un seul ? On lui donne une **classe** :",
          { code:`<p class="alerte">Attention !</p>` },
          "Dans le CSS, une classe s’écrit avec un **point** devant son nom :",
          { code:`.alerte {
  color: red;
  font-weight: bold;
}` },
          "Une classe peut servir sur autant d’éléments qu’on veut, et un élément peut avoir plusieurs classes, séparées par des espaces : `class=\"sticker rose\"`.",
          "Un **id** identifie un élément **unique** dans la page. Il s’écrit avec un dièse : `<div id=\"menu\">` et `#menu { … }`.",
          "Pour les noms : pas d’espaces ni d’accents, par exemple `carte-bleue`."
        ],
        exemple:
`<style>
  .sticker {
    display: inline-block;
    padding: 10px 16px;
    margin: 6px;
    border-radius: 20px;
    font-weight: bold;
  }
  .rose   { background-color: pink; }
  .menthe { background-color: palegreen; }
  .ciel   { background-color: lightskyblue; }
  #titre  { color: darkviolet; }
</style>

<h2 id="titre">Mes stickers</h2>
<span class="sticker rose">Licorne 🦄</span>
<span class="sticker menthe">Cactus 🌵</span>
<span class="sticker ciel">Fusée 🚀</span>` },

      { id:"classes-1", t:"classes", q:"Comment sélectionne-t-on la classe `bouton` en CSS ?",
        r:["`.bouton`", "`#bouton`", "`bouton`", "`class:bouton`"], b:0,
        e:"Le point pour une classe, le dièse pour un id, rien du tout pour un nom de balise." },

      { id:"classes-2", t:"classes", q:"Quelle est la différence entre une classe et un id ?",
        r:["Une classe peut servir plusieurs fois, un id est unique dans la page", "Un id est plus joli", "Une classe ne marche que sur les titres", "Aucune"], b:0,
        e:"Pour décorer, on utilise surtout des classes, qu’on peut réutiliser partout." },

      { id:"classes-c1", t:"classes", type:"code", etiquette:"Défi ✂️",
        q:"Crée ta planche de stickers : au moins **trois** stickers avec des classes, et au moins **deux nouvelles classes** dans le `<style>` pour qu’ils n’aient pas tous la même couleur de fond. Les emojis sont bienvenus !",
        depart:
`<style>
  .sticker {
    display: inline-block;
    padding: 10px 16px;
    margin: 6px;
    border-radius: 20px;
  }
  /* Crée tes propres classes ici */

</style>

<span class="sticker">Mon premier sticker</span>`,
        verifs:[
          { msg:"Au moins trois éléments ont une classe", test:function(doc){ return V.tous(doc, "body [class]").length >= 3; } },
          { msg:"Au moins deux nouvelles classes dans le `<style>`",
            test:function(doc){ const c = classesDefinies(doc); c.delete("sticker"); return c.size >= 2; } },
          { msg:"Tes stickers n’ont pas tous la même couleur de fond",
            test:function(doc){
              const fonds = new Set();
              V.tous(doc, "body [class]").forEach(function(e){
                if(V.couleurChoisie(e, "background-color")) fonds.add(V.style(e, "background-color"));
              });
              return fonds.size >= 2;
            } }
        ],
        solution:
`<style>
  .sticker {
    display: inline-block;
    padding: 10px 16px;
    margin: 6px;
    border-radius: 20px;
  }
  .soleil { background-color: gold; }
  .ocean  { background-color: deepskyblue; color: white; }
  .foret  { background-color: forestgreen; color: white; }
</style>

<span class="sticker soleil">Soleil ☀️</span>
<span class="sticker ocean">Baleine 🐳</span>
<span class="sticker foret">Sapin 🌲</span>`,
        e:"`class=\"sticker soleil\"` combine deux classes : la forme commune, puis la couleur. C’est comme ça que sont construits les grands sites." },

      /* ================= La boîte magique ================= */
      { id:"boite-l1", t:"boite", type:"lecon", titre:"La boîte magique",
        contenu:[
          "Pour le CSS, **chaque élément est une boîte**. Elle a quatre couches, de l’intérieur vers l’extérieur :",
          "le **contenu** (le texte, l’image) · le **padding**, l’espace intérieur · la **bordure** (`border`) · la **marge** (`margin`), l’espace extérieur qui éloigne les autres boîtes.",
          { code:
`.carte {
  width: 200px;
  padding: 20px;
  border: 4px solid gold;
  margin: 30px;
  border-radius: 16px;
}` },
          "`border` se règle en une ligne : l’épaisseur, le style (`solid`, `dashed` pour des tirets, `dotted` pour des points, `double`), puis la couleur.",
          "`border-radius` arrondit les coins. `width` et `height` fixent la largeur et la hauteur.",
          "Astuce de pro : `margin: 0 auto;` centre une boîte qui a une largeur."
        ],
        exemple:
`<style>
  body {
    background-color: #eef;
    font-family: Verdana, sans-serif;
  }
  .carte {
    width: 200px;
    margin: 20px auto;
    padding: 16px;
    background-color: white;
    border: 5px solid gold;
    border-radius: 16px;
    text-align: center;
  }
  .carte h2 {
    margin: 0;
    color: darkorange;
  }
  .stats {
    border-top: 2px dashed #ccc;
    padding-top: 8px;
  }
</style>

<div class="carte">
  <h2>Dracofeu 🐉</h2>
  <p>Type : feu</p>
  <p class="stats">Attaque 90 · Défense 70</p>
</div>` },

      { id:"boite-1", t:"boite", q:"Quelle propriété crée de l’espace **à l’intérieur** de la boîte, entre le texte et la bordure ?",
        r:["`padding`", "`margin`", "`border`", "`width`"], b:0,
        e:"`padding` à l’intérieur de la bordure, `margin` à l’extérieur." },

      { id:"boite-2", t:"boite", q:"Que fait `border: 3px dashed blue;` ?",
        r:["Une bordure bleue de 3 pixels, en tirets", "Une bordure de trois couleurs", "Une ombre bleue", "Un fond bleu rayé"], b:0,
        e:"Épaisseur, style, couleur : toujours dans cet ordre." },

      { id:"boite-c1", t:"boite", type:"code", etiquette:"Défi 🃏",
        q:"Invente ta carte à collectionner (monstre, héros, animal…). La boîte `.carte` doit avoir une **largeur**, une **bordure**, des **coins arrondis** et au moins `10px` de **padding**.",
        depart:
`<style>
  body {
    background-color: #eef;
    font-family: Verdana, sans-serif;
  }
  .carte {
    background-color: white;

  }
</style>

<div class="carte">
  <h2>Nom de ta créature</h2>
  <p>Type : ?</p>
  <p>Pouvoir : ?</p>
</div>`,
        verifs:[
          { msg:"Tu as inventé ta créature", test:function(doc){ const t = V.texte(doc, ".carte h2"); return t !== "" && !/nom de ta cr/i.test(t); } },
          { msg:"`.carte` a une largeur (`width`)", test:function(doc){ return V.selecteur(doc, /\.carte\b/).some(function(r){ return r.style.width; }); } },
          { msg:"Elle a une bordure",
            test:function(doc){ const c = V.el(doc, ".carte"); return V.style(c, "border-top-style") !== "none" && parseFloat(V.style(c, "border-top-width")) > 0; } },
          { msg:"Ses coins sont arrondis", test:function(doc){ return parseFloat(V.style(V.el(doc, ".carte"), "border-top-left-radius")) > 0; } },
          { msg:"Elle a au moins `10px` de padding",
            test:function(doc){ const c = V.el(doc, ".carte"); return parseFloat(V.style(c, "padding-top")) >= 10 && parseFloat(V.style(c, "padding-left")) >= 10; } }
        ],
        solution:
`<style>
  body {
    background-color: #eef;
    font-family: Verdana, sans-serif;
  }
  .carte {
    background-color: white;
    width: 220px;
    margin: 20px auto;
    padding: 16px;
    border: 6px double mediumpurple;
    border-radius: 18px;
    text-align: center;
  }
</style>

<div class="carte">
  <h2>Glaçon le pingouin 🐧</h2>
  <p>Type : glace</p>
  <p>Pouvoir : glisse à 200 km/h</p>
</div>`,
        e:"Tu peux aussi ajouter une image dans ta carte, et une deuxième classe pour une carte « légendaire » dorée !" },

      /* ================= Formes et ombres ================= */
      { id:"formes-l1", t:"formes", type:"lecon", titre:"Dessiner avec des boîtes",
        contenu:[
          "Avec un simple `<div>`, on peut dessiner ! Un carré : une largeur et une hauteur égales, et une couleur de fond.",
          "Un cercle : le même carré, avec `border-radius: 50%;`.",
          "`box-shadow` ajoute une ombre à la boîte : décalage horizontal, décalage vertical, flou, couleur. On peut en mettre plusieurs, séparées par des virgules.",
          { code:`box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);` },
          "Pour placer des formes les unes sur les autres : `position: relative;` sur la boîte qui les contient, puis `position: absolute;` sur chaque forme, placée avec `top` et `left`. C’est comme ça qu’on dessine un visage !"
        ],
        exemple:
`<style>
  .visage {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 20px auto;
    background-color: gold;
    border-radius: 50%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  .oeil {
    position: absolute;
    top: 50px;
    width: 20px;
    height: 20px;
    background-color: #333;
    border-radius: 50%;
  }
  .gauche { left: 45px; }
  .droit  { left: 95px; }
  .bouche {
    position: absolute;
    top: 80px;
    left: 45px;
    width: 70px;
    height: 35px;
    border-bottom: 6px solid #333;
    border-radius: 0 0 50% 50%;
  }
</style>

<div class="visage">
  <div class="oeil gauche"></div>
  <div class="oeil droit"></div>
  <div class="bouche"></div>
</div>` },

      { id:"formes-1", t:"formes", q:"Comment transformer un carré en cercle ?",
        r:["`border-radius: 50%;`", "`shape: circle;`", "`border: round;`", "`circle: true;`"], b:0,
        e:"Des coins arrondis à la moitié de la taille : il ne reste plus aucun angle." },

      { id:"formes-2", t:"formes", q:"Que fait `box-shadow` ?",
        r:["Il ajoute une ombre autour de la boîte", "Il cache la boîte", "Il assombrit le texte", "Il ajoute une bordure noire"], b:0,
        e:"Une ombre légère et floue donne l’impression que la boîte flotte au-dessus de la page." },

      { id:"formes-c1", t:"formes", type:"code", etiquette:"Défi 🪐",
        q:"Dessine une planète (ou un soleil, une balle, un ballon…) : un `<div>` **rond** (largeur = hauteur et `border-radius: 50%`), avec une couleur ou un dégradé, et une ombre `box-shadow`. Bonus : ajoute des cratères ou une lune !",
        depart:
`<style>
  body {
    background-color: #0b0b2b;
  }
  .planete {

  }
</style>

<div class="planete"></div>`,
        verifs:[
          { msg:"Un `<div>` rond (largeur = hauteur, coins à 50 %)", test:function(doc){ return V.tous(doc, "div").some(rond); } },
          { msg:"Il a une couleur ou un dégradé",
            test:function(doc){ return V.tous(doc, "div").filter(rond).some(function(d){
              return V.couleurChoisie(d, "background-color") || /gradient/.test(V.style(d, "background-image")); }); } },
          { msg:"Il a une ombre `box-shadow`",
            test:function(doc){ return V.tous(doc, "div").filter(rond).some(function(d){ return V.style(d, "box-shadow") !== "none"; }); } }
        ],
        solution:
`<style>
  body {
    background-color: #0b0b2b;
  }
  .planete {
    width: 160px;
    height: 160px;
    margin: 40px auto;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #ffd59e, #e8743b, #7a2e12);
    box-shadow: 0 0 40px orange, inset -20px -20px 40px rgba(0, 0, 0, 0.5);
  }
</style>

<div class="planete"></div>`,
        e:"`inset` met l’ombre à l’intérieur : de quoi donner du relief à ta planète, comme si le soleil l’éclairait d’un côté." },

      /* ================= Flexbox ================= */
      { id:"flex-l1", t:"flex", type:"lecon", titre:"Ranger avec Flexbox",
        contenu:[
          "Comment mettre des boîtes côte à côte ? Avec **Flexbox** ! On donne `display: flex;` au **parent**, et ses enfants se rangent en ligne.",
          { code:
`.etagere {
  display: flex;
  gap: 12px;
  justify-content: center;
}` },
          "`gap` met de l’espace entre les enfants · `justify-content` les répartit sur la ligne : `center`, `space-between`, `space-around` · `align-items` les aligne en hauteur · `flex-wrap: wrap;` les fait passer à la ligne quand il n’y a plus de place.",
          "`flex-direction: column;` les range en colonne au lieu d’une ligne."
        ],
        exemple:
`<style>
  .etagere {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 12px;
    background-color: #f3e9ff;
  }
  .case {
    width: 70px;
    height: 70px;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 14px;
  }
</style>

<div class="etagere">
  <div class="case">🍕</div>
  <div class="case">🍩</div>
  <div class="case">🍉</div>
  <div class="case">🧁</div>
</div>
<p>Remplace center par space-between, puis par flex-end !</p>` },

      { id:"flex-1", t:"flex", q:"À quel élément donne-t-on `display: flex;` ?",
        r:["Au parent, qui contient les boîtes à ranger", "À chaque enfant", "Obligatoirement à `<body>`", "À l’élément `<style>`"], b:0,
        e:"Le parent devient un conteneur flex, et c’est lui qui range ses enfants." },

      { id:"flex-2", t:"flex", q:"Que fait `gap: 20px;` dans un conteneur flex ?",
        r:["Il met 20 pixels d’espace entre les enfants", "Il agrandit chaque enfant de 20 pixels", "Il décale tout le conteneur de 20 pixels", "Il cache les enfants trop petits"], b:0,
        e:"Plus besoin de marges compliquées : `gap` espace régulièrement les boîtes." },

      { id:"flex-3", t:"flex", q:"Que fait `justify-content: center;` ?",
        r:["Il regroupe les enfants au milieu de la ligne", "Il centre le texte dans chaque enfant", "Il met les enfants en colonne", "Il agrandit le conteneur"], b:0,
        e:"Pour centrer le texte, c’est `text-align: center;`. `justify-content` déplace les boîtes elles-mêmes." },

      { id:"flex-c1", t:"flex", type:"code", etiquette:"Défi 🧩",
        q:"Crée ta galerie d’emojis : au moins **quatre** cases rangées côte à côte dans `.galerie` avec Flexbox, de l’espace entre elles (`gap`), et réparties avec `justify-content`.",
        depart:
`<style>
  .galerie {

  }
  .case {
    width: 70px;
    height: 70px;
    font-size: 40px;
    text-align: center;
    line-height: 70px;
    background-color: #ffe9c7;
    border-radius: 14px;
  }
</style>

<div class="galerie">
  <div class="case">🐱</div>
</div>`,
        verifs:[
          { msg:"`.galerie` utilise `display: flex`", test:function(doc){ return V.style(V.el(doc, ".galerie"), "display") === "flex"; } },
          { msg:"Elle contient au moins quatre cases", test:function(doc){ const g = V.el(doc, ".galerie"); return !!g && g.children.length >= 4; } },
          { msg:"Il y a de l’espace entre les cases (`gap`)", test:function(doc){ return parseFloat(V.style(V.el(doc, ".galerie"), "column-gap")) > 0; } },
          { msg:"Les cases sont réparties avec `justify-content`",
            test:function(doc){ return ["normal", "flex-start", "start", "left", ""].indexOf(V.style(V.el(doc, ".galerie"), "justify-content")) < 0; } }
        ],
        solution:
`<style>
  .galerie {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .case {
    width: 70px;
    height: 70px;
    font-size: 40px;
    text-align: center;
    line-height: 70px;
    background-color: #ffe9c7;
    border-radius: 14px;
  }
</style>

<div class="galerie">
  <div class="case">🐱</div>
  <div class="case">🐶</div>
  <div class="case">🦊</div>
  <div class="case">🐼</div>
</div>`,
        e:"Ajoute `flex-wrap: wrap;` : sur un petit écran, les cases passeront à la ligne au lieu de déborder." },

      /* ================= Survol et transitions ================= */
      { id:"survol-l1", t:"survol", type:"lecon", titre:"Survol et transitions",
        contenu:[
          "Le CSS peut réagir à la souris ! La **pseudo-classe** `:hover` s’applique quand on survole un élément :",
          { code:`button:hover {
  background-color: orange;
}` },
          "Sans rien de plus, le changement est brutal. `transition` le rend fluide : on indique une durée, par exemple `transition: 0.3s;`, sur l’élément de départ.",
          "`transform` déforme un élément : `scale(1.2)` l’agrandit de 20 %, `rotate(10deg)` le tourne, `translateY(-5px)` le fait monter un peu.",
          "`cursor: pointer;` affiche la petite main, pour montrer qu’on peut cliquer."
        ],
        exemple:
`<style>
  body {
    text-align: center;
    padding-top: 30px;
  }
  .bouton {
    font-size: 22px;
    padding: 12px 28px;
    border: none;
    border-radius: 30px;
    background-color: mediumslateblue;
    color: white;
    cursor: pointer;
    transition: 0.3s;
  }
  .bouton:hover {
    background-color: hotpink;
    transform: scale(1.2) rotate(-4deg);
  }
</style>

<button class="bouton">Passe la souris sur moi !</button>` },

      { id:"survol-1", t:"survol", q:"Quand s’applique la règle `a:hover { … }` ?",
        r:["Quand la souris survole un lien", "Quand on a déjà cliqué sur le lien", "Tout le temps", "Quand la page se charge"], b:0,
        e:"Sur un écran tactile, il n’y a pas de souris : le survol n’existe presque pas. Il faut donc que la page reste claire sans lui." },

      { id:"survol-2", t:"survol", q:"À quoi sert `transition: 0.5s;` ?",
        r:["À rendre le changement fluide, sur une demi-seconde", "À attendre 5 secondes avant d’afficher la page", "À faire tourner l’élément", "À cacher l’élément après une demi-seconde"], b:0,
        e:"Entre 0,2 et 0,4 seconde, l’effet paraît vif sans être lent." },

      { id:"survol-c1", t:"survol", type:"code", etiquette:"Défi ✨",
        q:"Crée un bouton magique : quand on le survole, il change de couleur **et** se transforme (`transform`), en douceur grâce à `transition`. Teste-le avec la souris dans le résultat !",
        depart:
`<style>
  body {
    text-align: center;
    padding-top: 40px;
  }
  .magique {
    font-size: 24px;
    padding: 12px 30px;
    border: none;
    border-radius: 12px;
    background-color: teal;
    color: white;
    cursor: pointer;
  }

</style>

<button class="magique">Abracadabra ✨</button>`,
        verifs:[
          { msg:"Une règle `:hover` existe", test:function(doc){ return survols(doc).length > 0; } },
          { msg:"Au survol, une couleur change",
            test:function(doc){ return survols(doc).some(function(r){
              return r.style.getPropertyValue("background-color") || r.style.getPropertyValue("color") || r.style.getPropertyValue("background-image"); }); } },
          { msg:"Au survol, l’élément se transforme (`transform`)",
            test:function(doc){ return survols(doc).some(function(r){ return r.style.getPropertyValue("transform"); }); } },
          { msg:"Le changement est fluide (`transition`)",
            test:function(doc){ return V.tous(doc, "body *").some(function(e){
              return V.style(e, "transition-duration").split(",").some(function(d){ return parseFloat(d) > 0; }); }); } }
        ],
        solution:
`<style>
  body {
    text-align: center;
    padding-top: 40px;
  }
  .magique {
    font-size: 24px;
    padding: 12px 30px;
    border: none;
    border-radius: 12px;
    background-color: teal;
    color: white;
    cursor: pointer;
    transition: 0.3s;
  }
  .magique:hover {
    background-color: darkorchid;
    transform: scale(1.15) rotate(3deg);
    box-shadow: 0 0 20px violet;
  }
</style>

<button class="magique">Abracadabra ✨</button>`,
        e:"Ce genre d’effet rend une page vivante. Mais pas trop : si tout bouge, plus rien n’attire l’œil !" },

      /* ================= Animations ================= */
      { id:"animations-l1", t:"animations", type:"lecon", titre:"Les animations",
        contenu:[
          "Une animation CSS se joue toute seule, sans la souris. Elle se fait en deux temps.",
          "1. On décrit les étapes avec `@keyframes`, en lui donnant un nom. `from` est le début, `to` la fin ; on peut aussi utiliser des pourcentages (`0%`, `50%`, `100%`) :",
          { code:
`@keyframes sauter {
  from { transform: translateY(0); }
  to   { transform: translateY(-80px); }
}` },
          "2. On applique l’animation à un élément avec `animation` : son nom, sa durée, et combien de fois la jouer (`infinite` pour toujours) :",
          { code:`.balle {
  animation: sauter 1s infinite alternate;
}` },
          "`alternate` la joue à l’aller puis au retour, `ease-in-out` la rend plus douce, `linear` garde une vitesse constante.",
          "`transform` ne marche pas sur un `<span>` ordinaire : on lui ajoute `display: inline-block;`."
        ],
        exemple:
`<style>
  body {
    text-align: center;
  }
  @keyframes sauter {
    from { transform: translateY(0); }
    to   { transform: translateY(-80px); }
  }
  @keyframes tourner {
    to { transform: rotate(360deg); }
  }
  @keyframes arcenciel {
    0%   { color: red; }
    50%  { color: blue; }
    100% { color: green; }
  }
  h1 {
    animation: arcenciel 3s infinite alternate;
  }
  .balle {
    display: inline-block;
    font-size: 50px;
    margin-top: 90px;
    animation: sauter 0.6s infinite alternate ease-in-out;
  }
  .etoile {
    display: inline-block;
    font-size: 50px;
    animation: tourner 2s infinite linear;
  }
</style>

<h1>Ça bouge !</h1>
<span class="balle">⚽</span>
<span class="etoile">⭐</span>` },

      { id:"animations-1", t:"animations", q:"À quoi sert `@keyframes` ?",
        r:["À décrire les étapes d’une animation", "À régler la vitesse de la souris", "À créer un raccourci clavier", "À charger une image"], b:0,
        e:"Les « images clés » : comme en dessin animé, on décrit les positions importantes, et le navigateur dessine tout ce qu’il y a entre." },

      { id:"animations-2", t:"animations", q:"Dans `animation: sauter 2s infinite;`, que veut dire `infinite` ?",
        r:["L’animation se répète sans arrêt", "Elle attend très longtemps avant de commencer", "Elle va infiniment vite", "Elle ne se joue jamais"], b:0,
        e:"Sans `infinite`, elle ne se joue qu’une fois. On peut aussi écrire un nombre : `3` pour trois fois." },

      { id:"animations-c1", t:"animations", type:"code", etiquette:"Défi 🎞️",
        q:"Anime l’élément de ton choix : crée ton propre `@keyframes` (rebond, rotation, clignotement, changement de couleur…), puis applique-le avec `animation`. Il doit se répéter à l’infini.",
        depart:
`<style>
  body {
    text-align: center;
    padding-top: 60px;
  }
  .acteur {
    display: inline-block;
    font-size: 60px;
  }
  /* Écris ton @keyframes ici */

</style>

<span class="acteur">🐸</span>`,
        verifs:[
          { msg:"Un `@keyframes` est défini", test:function(doc){ return V.animations(doc).length > 0; } },
          { msg:"Un élément utilise ton animation",
            test:function(doc){
              const noms = V.animations(doc).map(function(k){ return k.name; });
              return V.tous(doc, "body *").some(function(e){ return noms.indexOf(V.style(e, "animation-name")) >= 0; });
            } },
          { msg:"Elle se répète à l’infini",
            test:function(doc){ return V.tous(doc, "body *").some(function(e){
              return V.style(e, "animation-name") !== "none" && V.style(e, "animation-iteration-count") === "infinite"; }); } }
        ],
        solution:
`<style>
  body {
    text-align: center;
    padding-top: 60px;
  }
  .acteur {
    display: inline-block;
    font-size: 60px;
    animation: saut-grenouille 0.8s infinite alternate ease-in-out;
  }
  @keyframes saut-grenouille {
    from { transform: translateY(0) rotate(0deg); }
    to   { transform: translateY(-60px) rotate(15deg); }
  }
</style>

<span class="acteur">🐸</span>`,
        e:"Combine plusieurs transformations dans une même étape : monter **et** tourner, grossir **et** changer de couleur…" },

      /* ================= Tous les écrans ================= */
      { id:"ecrans-l1", t:"ecrans", type:"lecon", titre:"Tous les écrans avec @media",
        contenu:[
          "Tu sais déjà rendre une image souple avec `max-width: 100%`. Avec `@media`, le CSS va plus loin : il applique des règles **seulement** quand l’écran a une certaine taille.",
          { code:
`@media (max-width: 600px) {
  h1 { font-size: 24px; }
  .colonnes { flex-direction: column; }
}` },
          "Ça se lit : « si l’écran fait 600 pixels de large ou moins, alors… ». Sur un grand écran, ces règles sont ignorées ; sur un téléphone, elles s’appliquent.",
          "On écrit d’abord le style normal, puis on ajoute à la fin les retouches pour les petits écrans.",
          "Pour tester ici : tire le coin en bas à droite du résultat pour le rétrécir. Sur ton propre site, tu peux utiliser le mode « téléphone » des outils de développement (touche F12)."
        ],
        exemple:
`<style>
  .colonnes {
    display: flex;
    gap: 10px;
  }
  .colonne {
    flex: 1;
    padding: 16px;
    border-radius: 10px;
    background-color: lightskyblue;
  }
  @media (max-width: 500px) {
    .colonnes { flex-direction: column; }
    .colonne  { background-color: lightpink; }
  }
</style>

<p>Rétrécis le résultat sous 500 pixels : les colonnes passent l’une sous l’autre et deviennent roses.</p>
<div class="colonnes">
  <div class="colonne">Colonne 1</div>
  <div class="colonne">Colonne 2</div>
  <div class="colonne">Colonne 3</div>
</div>` },

      { id:"ecrans-1", t:"ecrans", q:"Quand s’appliquent les règles de `@media (max-width: 600px) { … }` ?",
        r:["Quand l’écran fait 600 pixels de large ou moins", "Quand l’écran fait plus de 600 pixels", "Tout le temps", "Seulement quand on imprime la page"], b:0,
        e:"`max-width` : « largeur maximale ». Pour viser les grands écrans, on utilise `min-width`." },

      { id:"ecrans-2", t:"ecrans", q:"Pourquoi prévoir une mise en page spéciale pour les petits écrans ?",
        r:["Parce qu’une grande partie des visiteurs utilisent un téléphone", "Pour que le site s’affiche plus vite sur ordinateur", "Pour que la page soit plus lourde", "Ça ne sert à rien"], b:0,
        e:"Trois colonnes côte à côte sont parfaites sur un ordinateur, mais illisibles sur un téléphone." },

      { id:"ecrans-c1", t:"ecrans", type:"code", etiquette:"Défi 📱",
        q:"Ajoute une règle `@media (max-width: 500px)` qui change au moins une chose sur petit écran : la taille du titre, la couleur de fond, le sens des colonnes… Rétrécis le résultat pour tester !",
        depart:
`<style>
  body {
    background-color: #fdf6e3;
  }
  h1 {
    font-size: 48px;
    color: darkslateblue;
  }
  .colonnes {
    display: flex;
    gap: 10px;
  }
  .colonne {
    flex: 1;
    padding: 14px;
    background-color: white;
    border-radius: 10px;
  }

  /* Ta règle @media ici */

</style>

<h1>Mon site</h1>
<div class="colonnes">
  <div class="colonne">🎮 Jeux</div>
  <div class="colonne">🎵 Musique</div>
  <div class="colonne">📚 Livres</div>
</div>`,
        verifs:[
          { msg:"Une règle `@media` avec `max-width` existe",
            test:function(doc){ return V.media(doc).some(function(m){ return /max-width/.test(m.conditionText || m.media.mediaText); }); } },
          { msg:"Elle change au moins une propriété",
            test:function(doc){ return V.media(doc).some(function(m){
              return Array.prototype.some.call(m.cssRules, function(r){ return r.style && r.style.length > 0; }); }); } }
        ],
        solution:
`<style>
  body {
    background-color: #fdf6e3;
  }
  h1 {
    font-size: 48px;
    color: darkslateblue;
  }
  .colonnes {
    display: flex;
    gap: 10px;
  }
  .colonne {
    flex: 1;
    padding: 14px;
    background-color: white;
    border-radius: 10px;
  }

  @media (max-width: 500px) {
    h1 { font-size: 28px; }
    .colonnes { flex-direction: column; }
  }
</style>

<h1>Mon site</h1>
<div class="colonnes">
  <div class="colonne">🎮 Jeux</div>
  <div class="colonne">🎵 Musique</div>
  <div class="colonne">📚 Livres</div>
</div>`,
        e:"Les grands sites ont souvent trois versions : téléphone, tablette et ordinateur, grâce à quelques règles `@media`." },

      /* ================= Projet libre ================= */
      { id:"projet-l1", t:"projet", type:"lecon", etiquette:"Atelier libre", titre:"À toi de jouer !",
        contenu:[
          "Tu as maintenant tous les outils d’un vrai designer web : couleurs, dégradés, polices, boîtes, formes, Flexbox, survols et animations.",
          "Voici une petite page qui utilise presque tout. **Change tout ce que tu veux** : les couleurs, les textes, les emojis, les animations… Il n’y a pas de mauvaise réponse !"
        ],
        exemple:
`<style>
  body {
    margin: 0;
    font-family: Verdana, sans-serif;
    background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
    min-height: 100vh;
    text-align: center;
  }
  h1 {
    color: white;
    font-size: 42px;
    text-shadow: 3px 3px 0 #5b6cff;
    padding-top: 20px;
  }
  .cartes {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .carte {
    width: 120px;
    padding: 14px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transition: 0.3s;
  }
  .carte:hover {
    transform: translateY(-10px) rotate(-3deg);
  }
  .emoji {
    font-size: 48px;
    display: inline-block;
    animation: danser 1s infinite alternate;
  }
  @keyframes danser {
    to { transform: rotate(15deg) scale(1.1); }
  }
</style>

<h1>Mes passions</h1>
<div class="cartes">
  <div class="carte"><span class="emoji">⚽</span><p>Le foot</p></div>
  <div class="carte"><span class="emoji">🎨</span><p>Le dessin</p></div>
  <div class="carte"><span class="emoji">🎮</span><p>Les jeux</p></div>
</div>` },

      { id:"projet-c1", t:"projet", type:"code", etiquette:"Projet final 🏆",
        q:"Crée ta propre page sur un sujet que tu aimes (ton animal, ton jeu, ton sport, ton artiste…). Elle doit utiliser au moins **8 propriétés CSS différentes**, au moins une **classe**, un effet au **survol** (`:hover`), et un **dégradé** ou une **ombre**.",
        depart:
`<style>
  body {
    font-family: Verdana, sans-serif;
  }

</style>

<h1>Ma page sur …</h1>
<p>Raconte ici ce que tu aimes !</p>`,
        verifs:[
          { msg:"Tu as choisi le titre de ta page", test:function(doc){ const t = V.texte(doc, "h1"); return t !== "" && !/ma page sur …$/i.test(t); } },
          { msg:"Au moins 8 propriétés CSS différentes", test:function(doc){ return V.proprietes(doc).size >= 8; } },
          { msg:"Au moins une classe, utilisée dans la page",
            test:function(doc){ return Array.from(classesDefinies(doc)).some(function(n){ return doc.getElementsByClassName(n).length > 0; }); } },
          { msg:"Un effet au survol (`:hover`)", test:function(doc){ return survols(doc).length > 0; } },
          { msg:"Un dégradé ou une ombre",
            test:function(doc){ return V.tous(doc, "body, body *").some(function(e){
              return /gradient/.test(V.style(e, "background-image")) || V.style(e, "box-shadow") !== "none" || V.style(e, "text-shadow") !== "none"; }); } }
        ],
        solution:
`<style>
  body {
    font-family: Verdana, sans-serif;
    background: linear-gradient(#fceabb, #f8b500);
    min-height: 100vh;
    margin: 0;
    text-align: center;
  }
  h1 {
    color: #6b2d00;
    font-size: 40px;
    padding-top: 20px;
  }
  .fait {
    display: inline-block;
    width: 200px;
    margin: 8px;
    padding: 12px;
    background-color: white;
    border-radius: 14px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
  }
  .fait:hover {
    transform: scale(1.08);
  }
</style>

<h1>Ma page sur les abeilles 🐝</h1>
<p class="fait">Une abeille visite jusqu’à 700 fleurs par jour.</p>
<p class="fait">Elles dansent pour indiquer où trouver le nectar.</p>`,
        e:"Bravo, tu as créé ta première page web décorée de A à Z ! Exporte ta session pour garder ton code et le montrer." }
    ],

    bilans: [
      { min:.84, texte:"Incroyable ! Tu as l’œil d’un vrai designer web. Continue à créer : chaque site que tu visites peut te donner des idées." },
      { min:.60, texte:"Belle créativité ! Quelques propriétés te résistent encore : refais les défis ratés en t’aidant des exemples des leçons." },
      { min:.36, texte:"Tu as commencé à apprivoiser le CSS. Rejoue avec les exemples des leçons : modifier un code qui marche est la meilleure façon d’apprendre." },
      { min:0,   texte:"Le CSS est encore tout nouveau pour toi, et c’est normal ! Reprends les leçons une à une et amuse-toi à tout changer dans les exemples." }
    ]
  });
})();
