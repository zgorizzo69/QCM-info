/* Module JavaScript 5 : rendre la page vivante avec le DOM (querySelector, textContent, style,
   classList, addEventListener, value, createElement). Les exercices s’exécutent sur une vraie
   page (champ « page ») ; les sondes cliquent sur les boutons et remplissent les champs. */
(function(){
  const logs = function(r){ return r.logs.join("\n"); };
  // Le texte d’un élément dans le HTML renvoyé par la page (r.html).
  const pageDe = function(r){ return new DOMParser().parseFromString(r.html, "text/html"); };
  const texteDans = function(r, id){
    const e = pageDe(r).querySelector("#" + id);
    return e ? e.textContent.trim() : "";
  };
  const CONFETTI = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";

  QCM.ajouter({
    id: "js-5",
    titre: "JavaScript 5 · Rendre la page vivante",
    resume: "Module 5 sur 5. Sors de la console : change les textes et les couleurs d’une page, réagis aux clics, lis ce que tape l’utilisateur et crée des éléments. Tes pages deviennent des applications !",
    intro: [
      "✨ Jusqu’ici, tes programmes parlaient dans la console. Dans ce dernier module, JavaScript prend le contrôle de la **page web** : il change les textes, les couleurs, réagit aux clics et fabrique de nouveaux éléments. C’est le **DOM**.",
      "📚 Il vaut mieux avoir terminé les modules 1 à 4 (et connaître un peu de HTML et de CSS). À la fin : un animal virtuel, un créateur d’avatars ou un jeu de rapidité… avec des confettis ! 🎉"
    ],
    aideMemoire: `
// Trouver un élément (mêmes sélecteurs qu'en CSS)
const titre = document.querySelector("#titre");     // par son id
const carte = document.querySelector(".carte");     // par sa classe
const bouton = document.querySelector("button");    // par sa balise

// Lire ou changer le texte
titre.textContent = "Nouveau titre";

// Changer le style
titre.style.color = "tomato";
titre.style.fontSize = "40px";          // font-size devient fontSize
carte.classList.add("visible");         // ajouter une classe CSS
carte.classList.remove("visible");      // l'enlever
carte.classList.toggle("visible");      // l'ajouter ou l'enlever

// Réagir à un clic
bouton.addEventListener("click", function () {
  console.log("Clic !");
});

// Lire un champ de texte
const champ = document.querySelector("#prenom");
const prenom = champ.value;              // toujours un texte
const age = Number(champ.value);         // en nombre

// Créer un élément et l'ajouter dans la page
const li = document.createElement("li");
li.textContent = "Nouvel élément";
document.querySelector("#liste").appendChild(li);

// Répéter une action toutes les secondes
setInterval(function () { … }, 1000);`,

    themes: [
      { id:"trouver",  nom:"Trouver un élément",   note:"🔍 `querySelector` et `textContent`." },
      { id:"style",    nom:"Changer le style",     note:"🎨 `style` et `classList`." },
      { id:"clic",     nom:"Réagir aux clics",     note:"🖱️ `addEventListener` : quand on clique…" },
      { id:"champs",   nom:"Lire un champ",        note:"⌨️ `value` : récupérer ce que tape l’utilisateur." },
      { id:"elements", nom:"Créer des éléments",   note:"🧱 `createElement` et `appendChild`." },
      { id:"projet",   nom:"Projet final",         note:"🏁 Une vraie application web, avec une librairie." }
    ],

    questions: [
      /* ================= Trouver un élément ================= */
      { id:"trouver-l1", t:"trouver", type:"lecon", titre:"Trouver un élément de la page",
        contenu:[
          "🌳 Pour JavaScript, une page web est un grand **arbre** d’éléments : le `<body>` contient un `<h1>`, des `<p>`, des `<div>` qui contiennent eux-mêmes d’autres éléments… (comme les dossiers et sous-dossiers de ton ordinateur !). Cet arbre s’appelle le **DOM**.",
          "🔍 Pour agir sur un élément, il faut d’abord le **trouver**, avec `document.querySelector(…)` et les mêmes sélecteurs qu’en CSS : `\"#titre\"` pour l’id titre, `\".message\"` pour la classe message, `\"h1\"` pour la balise.",
          "📦 On range l’élément trouvé dans une variable : `const titre = document.querySelector(\"#titre\");`",
          "✏️ `titre.textContent` donne le texte de l’élément… et permet de le **changer** : `titre.textContent = \"Nouveau titre\";`. La page se met à jour tout de suite !",
          "⚠️ Si le sélecteur ne trouve rien (une faute de frappe, un # oublié), `querySelector` renvoie `null`, et la ligne suivante provoque une erreur."
        ],
        page:
`<h1 id="titre">Bonjour !</h1>
<p class="message">Je suis un paragraphe tout à fait normal.</p>`,
        js:
`const titre = document.querySelector("#titre");
console.log("Ancien titre : " + titre.textContent);

titre.textContent = "JavaScript a changé ce titre ! 🪄";

const message = document.querySelector(".message");
message.textContent = "Et moi aussi, j'ai été transformé.";`,
        essais:[
          { texte:"Écris ton prénom dans le titre.", test:function(r){ const t = texteDans(r, "titre"); return t !== "" && !/Bonjour|JavaScript a changé/.test(t); } },
          { texte:"Oublie le `#` dans `\"#titre\"` et exécute : lis l’erreur, puis corrige.", test:function(r){ return r.erreurs.some(function(e){ return /null/.test(e.message); }); } },
          "Remplace `\".message\"` par `\"p\"` : est-ce que ça marche aussi ? Pourquoi ?"
        ],
        lien:"https://www.w3schools.com/js/js_htmldom_elements.asp" },

      { id:"trouver-1", t:"trouver", q:"Quel sélecteur trouve l’élément `<p id=\"score\">` ?",
        r:["\"#score\"", "\".score\"", "\"score\"", "\"p.score\""], b:0,
        e:"Comme en CSS : `#` pour un id, `.` pour une classe, rien pour une balise." },

      { id:"trouver-2", t:"trouver", q:"Que fait `titre.textContent = \"Salut\";` ?",
        r:["Elle remplace le texte de l’élément titre par « Salut »", "Elle affiche « Salut » dans la console", "Elle crée un nouveau titre", "Elle change la couleur du titre"], b:0,
        e:"`textContent` est le texte à l’intérieur de l’élément : en le changeant, la page se met à jour." },

      { id:"trouver-3", t:"trouver", q:"Que renvoie `document.querySelector(\"#introuvable\")` si aucun élément n’a cet id ?",
        r:["null", "Une erreur", "Un élément vide créé exprès", "\"#introuvable\""], b:0,
        e:"`null` veut dire « rien ». Utiliser ensuite `.textContent` sur `null` provoque l’erreur « Cannot set properties of null »." },

      { id:"trouver-c1", t:"trouver", type:"js",
        q:"🪪 Remplis la carte de membre ! Change le titre `#titre` en « 🪪 Ma carte de membre », écris ton prénom dans `#prenom` et ton âge dans `#age`.",
        page:
`<div class="carte">
  <h2 id="titre">Titre</h2>
  <p>Prénom : <b id="prenom">?</b></p>
  <p>Âge : <b id="age">?</b></p>
</div>`,
        depart:"// Trouve les éléments avec document.querySelector, puis change leur textContent\n",
        verifs:[
          { msg:"Le titre est « 🪪 Ma carte de membre »", dans:function(p){ return /Ma carte de membre/.test(p.texte("#titre")); } },
          { msg:"Ton prénom est écrit dans `#prenom`", dans:function(p){ var t = p.texte("#prenom"); return t !== "" && t !== "?"; } },
          { msg:"Ton âge (un nombre) est écrit dans `#age`", dans:function(p){ return /\d/.test(p.texte("#age")); } },
          { msg:"Tu utilises `querySelector` et `textContent`", test:function(r){ return /querySelector/.test(r.sans) && /textContent/.test(r.sans); } }
        ],
        solution:
`// Trouve les éléments avec document.querySelector, puis change leur textContent
document.querySelector("#titre").textContent = "🪪 Ma carte de membre";
document.querySelector("#prenom").textContent = "Inès";
document.querySelector("#age").textContent = 12;`,
        e:"On peut enchaîner directement `document.querySelector(…).textContent = …`, ou passer par une variable si on utilise l’élément plusieurs fois." },

      /* ================= Changer le style ================= */
      { id:"style-l1", t:"style", type:"lecon", titre:"Changer le style",
        contenu:[
          "🎨 Chaque élément a une propriété `style` qui permet de changer son CSS : `titre.style.color = \"tomato\";`",
          "🐫 Les propriétés CSS avec un tiret s’écrivent en **camelCase** : `background-color` devient `backgroundColor`, `font-size` devient `fontSize`. Et les valeurs s’écrivent entre guillemets, avec leur unité : `\"40px\"`.",
          "🏷️ Encore mieux : on prépare des **classes** dans le CSS, et JavaScript les ajoute ou les enlève avec `classList` :",
          { code:
`element.classList.add("nuit");       // ajoute la classe
element.classList.remove("nuit");    // l'enlève
element.classList.toggle("nuit");    // l'ajoute si elle n'y est pas, l'enlève sinon` },
          "🧠 C’est la méthode des pros : le CSS s’occupe de la décoration, et JavaScript ne fait qu’allumer ou éteindre les classes, comme des interrupteurs."
        ],
        page:
`<style>
  .boite { padding: 20px; border-radius: 12px; background: #FFF3C4; transition: all .4s; }
  .nuit { background: #1D2340; color: white; }
</style>
<div class="boite" id="boite">
  <h2 id="titre">☀️ Bonjour !</h2>
  <p>Une boîte qui change de style.</p>
</div>`,
        js:
`const titre = document.querySelector("#titre");
titre.style.color = "tomato";
titre.style.fontSize = "40px";

const boite = document.querySelector("#boite");
boite.classList.add("nuit");
titre.textContent = "🌙 Bonsoir !";`,
        essais:[
          { texte:"Change la couleur du titre en `\"gold\"`.", test:function(r){ return /color\s*=\s*["']gold["']/.test(r.sans); } },
          { texte:"Remplace `add` par `remove` : la boîte redevient-elle claire ?", test:function(r){ return /classList\.remove\(\s*["']nuit["']\s*\)/.test(r.sans); } },
          { texte:"Ajoute une bordure avec `boite.style.border = \"5px dashed hotpink\";`.", test:function(r){ return /style\.border\s*=/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_htmldom_css.asp" },

      { id:"style-1", t:"style", q:"Comment écrit-on la propriété CSS `font-size` en JavaScript ?",
        r:["element.style.fontSize", "element.style.font-size", "element.style.FontSize", "element.fontsize"], b:0,
        e:"En JavaScript, le tiret serait une soustraction ! On colle les mots avec une majuscule : c’est le camelCase." },

      { id:"style-2", t:"style", q:"Que fait `boite.classList.toggle(\"cachee\")` ?",
        r:["Elle ajoute la classe si elle n’y est pas, et l’enlève si elle y est", "Elle cache la boîte pour toujours", "Elle supprime la boîte", "Elle change le texte de la boîte"], b:0,
        e:"Toggle veut dire « basculer » : c’est un interrupteur, parfait pour un bouton qui allume et éteint." },

      { id:"style-c1", t:"style", type:"js",
        q:"🚦 Le feu tricolore ! Allume le feu **vert** en lui ajoutant la classe `allume` avec `classList`, et écris « 🚗 Tu peux passer ! » dans `#panneau`.",
        page:
`<style>
  .feu { display: inline-block; width: 46px; height: 46px; margin: 4px; border-radius: 50%; background: #555; }
  #rouge.allume { background: red; }
  #orange.allume { background: orange; }
  #vert.allume { background: limegreen; }
</style>
<div style="background:#222;padding:8px;border-radius:30px;display:inline-block">
  <span class="feu" id="rouge"></span><span class="feu" id="orange"></span><span class="feu" id="vert"></span>
</div>
<p id="panneau">⛔ Attends…</p>`,
        depart:"// Allume le feu vert et change le panneau\n",
        verifs:[
          { msg:"Le feu vert a la classe `allume`", dans:function(p){ return p.el("#vert").classList.contains("allume"); } },
          { msg:"Le feu rouge reste éteint", dans:function(p){ return !p.el("#rouge").classList.contains("allume"); } },
          { msg:"Le panneau dit « 🚗 Tu peux passer ! »", dans:function(p){ return /peux passer/.test(p.texte("#panneau")); } },
          { msg:"Tu utilises `classList.add`", test:function(r){ return /classList\.(add|toggle)\(\s*["']allume["']\s*\)/.test(r.sans); } }
        ],
        solution:
`// Allume le feu vert et change le panneau
document.querySelector("#vert").classList.add("allume");
document.querySelector("#panneau").textContent = "🚗 Tu peux passer !";`,
        e:"Le CSS sait déjà à quoi ressemble un feu allumé : JavaScript n’a qu’à ajouter la classe." },

      /* ================= Réagir aux clics ================= */
      { id:"clic-l1", t:"clic", type:"lecon", titre:"Réagir aux clics",
        contenu:[
          "🖱️ Une page devient vraiment vivante quand elle **réagit** à ce que fait l’utilisateur : un clic, une touche, un mouvement de souris… Ce sont des **événements**.",
          { code:
`bouton.addEventListener("click", function () {
  // ce qui se passe à chaque clic
});` },
          "🔔 `addEventListener` veut dire « ajoute un écouteur d’événement ». C’est comme une **sonnette** : on installe la sonnette une fois, et à chaque fois que quelqu’un appuie, la fonction s’exécute.",
          "⏳ La fonction n’est **pas** exécutée tout de suite : elle attend patiemment le clic. Elle peut s’exécuter 0 fois, ou 100 fois !",
          "🔢 Une variable créée **en dehors** de la fonction (comme `clics`) garde sa valeur d’un clic à l’autre : parfait pour un compteur."
        ],
        page:
`<button id="bouton" style="font-size:20px;padding:10px 20px">👆 Clique-moi !</button>
<p id="compteur" style="font-size:22px">0 clic</p>`,
        js:
`const bouton = document.querySelector("#bouton");
const compteur = document.querySelector("#compteur");
let clics = 0;

bouton.addEventListener("click", function () {
  clics = clics + 1;
  compteur.textContent = clics + " clic(s) 🎉";
  console.log("Clic n°" + clics);
});`,
        essais:[
          { texte:"Clique 5 fois sur le bouton, dans la page.", test:function(r){ return /^5 clic/.test(texteDans(r, "compteur")); } },
          { texte:"Fais grossir le texte du bouton à chaque clic (`bouton.style.fontSize = (20 + clics) + \"px\";`).", test:function(r){ return /style\.fontSize\s*=/.test(r.sans); } },
          { texte:"Ajoute un `if` : au 10e clic, le compteur affiche « 🏆 Champion du clic ! ».", test:function(r){ return /Champion/.test(texteDans(r, "compteur")); } }
        ],
        lien:"https://www.w3schools.com/js/js_htmldom_eventlistener.asp" },

      { id:"clic-1", t:"clic", q:"Quand s’exécute la fonction donnée à `bouton.addEventListener(\"click\", …)` ?",
        r:["À chaque clic sur le bouton", "Une seule fois, au chargement de la page", "Jamais", "Toutes les secondes"], b:0,
        e:"La fonction attend : elle s’exécute à chaque fois que l’événement « click » arrive sur ce bouton." },

      { id:"clic-2", t:"clic", q:"Pourquoi la variable `clics` est-elle créée **en dehors** de la fonction du clic ?",
        r:["Pour garder sa valeur d’un clic à l’autre", "Parce que c’est interdit dedans", "Pour qu’elle s’affiche dans la console", "Pour aller plus vite"], b:0,
        e:"Créée dans la fonction, elle repartirait de 0 à chaque clic, et le compteur resterait bloqué à 1 !" },

      { id:"clic-c1", t:"clic", type:"js",
        q:"💡 L’interrupteur ! À chaque clic sur `#interrupteur`, ajoute ou enlève la classe `allumee` à `#ampoule` (avec `toggle`). Bonus obligatoire : le texte `#etat` doit afficher « Allumée » quand l’ampoule est allumée, et « Éteinte » sinon.",
        page:
`<style>
  #ampoule { font-size: 60px; filter: grayscale(1); opacity: .4; transition: all .3s; }
  #ampoule.allumee { filter: none; opacity: 1; text-shadow: 0 0 30px gold; }
</style>
<div id="ampoule">💡</div>
<button id="interrupteur">Interrupteur</button>
<p id="etat">Éteinte</p>`,
        depart:
`const ampoule = document.querySelector("#ampoule");
const interrupteur = document.querySelector("#interrupteur");
const etat = document.querySelector("#etat");

// À chaque clic…
`,
        verifs:[
          { msg:"Un clic allume l’ampoule (classe `allumee`)", dans:function(p){ p.cliquer("#interrupteur"); return p.el("#ampoule").classList.contains("allumee"); } },
          { msg:"Un deuxième clic l’éteint", dans:function(p){ p.cliquer("#interrupteur"); p.cliquer("#interrupteur"); return !p.el("#ampoule").classList.contains("allumee"); } },
          { msg:"Après un clic, `#etat` affiche « Allumée »", dans:function(p){ p.cliquer("#interrupteur"); return /Allumée/.test(p.texte("#etat")); } },
          { msg:"Après deux clics, `#etat` affiche « Éteinte »", dans:function(p){ p.cliquer("#interrupteur"); p.cliquer("#interrupteur"); return /Éteinte/.test(p.texte("#etat")); } },
          { msg:"Tu utilises `addEventListener`", test:function(r){ return /addEventListener\(\s*["']click["']/.test(r.sans); } }
        ],
        solution:
`const ampoule = document.querySelector("#ampoule");
const interrupteur = document.querySelector("#interrupteur");
const etat = document.querySelector("#etat");

// À chaque clic…
interrupteur.addEventListener("click", function () {
  ampoule.classList.toggle("allumee");
  if (ampoule.classList.contains("allumee")) {
    etat.textContent = "Allumée";
  } else {
    etat.textContent = "Éteinte";
  }
});`,
        e:"`classList.contains(\"allumee\")` répond vrai ou faux : on peut s’en servir dans un `if`." },

      /* ================= Lire un champ ================= */
      { id:"champs-l1", t:"champs", type:"lecon", titre:"Lire un champ de texte",
        contenu:[
          "⌨️ Fini le `prompt` ! Sur une vraie page, on demande des informations avec un champ : `<input id=\"prenom\">`.",
          "📥 En JavaScript, `champ.value` contient ce que l’utilisateur a tapé. Comme avec `prompt`, c’est **toujours un texte** : pour un nombre, on utilise `Number(champ.value)`.",
          "🖱️ On lit la valeur **au moment du clic** sur un bouton (dans la fonction de `addEventListener`), sinon on lirait le champ encore vide, au chargement de la page !",
          "🧽 Pour vider le champ après usage : `champ.value = \"\";`"
        ],
        page:
`<input id="prenom" placeholder="Ton prénom" style="font-size:18px;padding:6px">
<button id="valider" style="font-size:18px">Valider</button>
<h2 id="salut"></h2>`,
        js:
`const champ = document.querySelector("#prenom");
const bouton = document.querySelector("#valider");
const salut = document.querySelector("#salut");

bouton.addEventListener("click", function () {
  const prenom = champ.value;
  salut.textContent = "Bienvenue, " + prenom + " ! 👋";
  console.log("Prénom tapé : " + prenom);
});`,
        essais:[
          { texte:"Tape ton prénom dans le champ de la page, puis clique sur Valider.", test:function(r){ return /Bienvenue, \S/.test(texteDans(r, "salut")); } },
          { texte:"Affiche le prénom en MAJUSCULES.", test:function(r){ return /toUpperCase\(\)/.test(r.sans); } },
          { texte:"Vide le champ après le clic, avec `champ.value = \"\";`.", test:function(r){ return /champ\.value\s*=\s*["']{2}/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/jsref/prop_text_value.asp" },

      { id:"champs-1", t:"champs", q:"Quelle propriété contient ce que l’utilisateur a tapé dans un `<input>` ?",
        r:["value", "textContent", "text", "input"], b:0,
        e:"`champ.value` : la valeur du champ. `textContent` sert pour le texte des autres éléments." },

      { id:"champs-2", t:"champs", q:"Avec deux champs qui contiennent 2 et 3, `champA.value + champB.value` donne…",
        r:["\"23\"", "5", "\"5\"", "Une erreur"], b:0,
        e:"Les valeurs des champs sont des textes : le + les colle. Il faut `Number(champA.value) + Number(champB.value)`." },

      { id:"champs-c1", t:"champs", type:"js",
        q:"➕ La calculatrice d’addition ! Quand on clique sur `#plus`, affiche dans `#resultat` la **somme** des nombres tapés dans `#a` et `#b`. Attention au piège : 2 + 3 doit donner 5, pas 23 !",
        page:
`<input id="a" type="number" value="2" style="width:70px;font-size:18px"> +
<input id="b" type="number" value="3" style="width:70px;font-size:18px">
<button id="plus" style="font-size:18px">=</button>
<b id="resultat" style="font-size:22px">?</b>`,
        depart:
`const a = document.querySelector("#a");
const b = document.querySelector("#b");
const resultat = document.querySelector("#resultat");

// Quand on clique sur #plus…
`,
        verifs:[
          { msg:"2 + 3 affiche 5", dans:function(p){ p.taper("#a", "2"); p.taper("#b", "3"); p.cliquer("#plus"); return p.texte("#resultat") === "5"; } },
          { msg:"10 + 15 affiche 25", dans:function(p){ p.taper("#a", "10"); p.taper("#b", "15"); p.cliquer("#plus"); return p.texte("#resultat") === "25"; } },
          { msg:"Le résultat change à chaque clic (7 + 8 puis 1 + 1)", dans:function(p){
              p.taper("#a", "7"); p.taper("#b", "8"); p.cliquer("#plus");
              var premier = p.texte("#resultat");
              p.taper("#a", "1"); p.taper("#b", "1"); p.cliquer("#plus");
              return premier === "15" && p.texte("#resultat") === "2"; } }
        ],
        solution:
`const a = document.querySelector("#a");
const b = document.querySelector("#b");
const resultat = document.querySelector("#resultat");

// Quand on clique sur #plus…
document.querySelector("#plus").addEventListener("click", function () {
  resultat.textContent = Number(a.value) + Number(b.value);
});`,
        e:"Les valeurs sont lues **dans** la fonction du clic : à chaque clic, on récupère ce qui est écrit à ce moment-là." },

      /* ================= Créer des éléments ================= */
      { id:"elements-l1", t:"elements", type:"lecon", titre:"Créer des éléments",
        contenu:[
          "🧱 JavaScript peut aussi **fabriquer** de nouveaux éléments, en trois étapes :",
          { code:
`const li = document.createElement("li");      // ① fabriquer l'élément
li.textContent = "🐼 Panda";                   // ② le remplir
document.querySelector("#liste").appendChild(li); // ③ l'ajouter dans la page` },
          "📮 Tant que l’élément n’est pas ajouté avec `appendChild` (« ajoute un enfant »), il n’apparaît pas : c’est comme une lettre écrite mais pas encore postée.",
          "🔁 Avec une boucle sur un tableau, on peut créer toute une liste d’un coup. C’est comme ça que les sites affichent des centaines de produits, de messages ou de vidéos !",
          "🗑️ Pour supprimer un élément : `element.remove();`. Pour vider une liste : `liste.textContent = \"\";`"
        ],
        page:
`<h3>Mes animaux préférés</h3>
<ul id="liste"></ul>
<button id="ajouter">➕ Ajouter une licorne</button>`,
        js:
`const liste = document.querySelector("#liste");
const animaux = ["🐼 Panda", "🦊 Renard", "🐙 Pieuvre"];

for (const animal of animaux) {
  const li = document.createElement("li");
  li.textContent = animal;
  liste.appendChild(li);
}

document.querySelector("#ajouter").addEventListener("click", function () {
  const li = document.createElement("li");
  li.textContent = "🦄 Licorne";
  liste.appendChild(li);
});`,
        essais:[
          { texte:"Ajoute deux animaux au tableau.", test:function(r){ return pageDe(r).querySelectorAll("#liste li").length >= 5; } },
          { texte:"Clique trois fois sur le bouton de la page.", test:function(r){ return (r.html.match(/Licorne/g) || []).length >= 3; } },
          { texte:"Fais que chaque clic sur un animal de la liste le supprime (`li.addEventListener(\"click\", function () { li.remove(); });`).", test:function(r){ return /\.remove\(\)/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_htmldom_nodes.asp" },

      { id:"elements-1", t:"elements", q:"Après `const p = document.createElement(\"p\");`, le paragraphe est-il visible dans la page ?",
        r:["Non, il faut d’abord l’ajouter avec appendChild", "Oui, tout de suite", "Oui, mais tout en haut", "Non, il faut recharger la page"], b:0,
        e:"`createElement` fabrique l’élément, mais il reste « dans la main » de JavaScript tant qu’on ne l’a pas ajouté à la page." },

      { id:"elements-2", t:"elements", q:"Que fait `liste.appendChild(li)` ?",
        r:["Elle ajoute l’élément li à la fin de liste", "Elle supprime li", "Elle copie liste dans li", "Elle crée un nouvel élément"], b:0,
        e:"« Append child » : ajoute un enfant, à la fin de l’élément parent." },

      { id:"elements-c1", t:"elements", type:"js",
        q:"📝 La liste de tâches ! Quand on clique sur `#ajouter`, crée un `<li>` qui contient le texte tapé dans `#tache`, ajoute-le dans `#taches`, puis **vide** le champ.",
        page:
`<input id="tache" placeholder="Une tâche…" style="font-size:16px;padding:5px">
<button id="ajouter" style="font-size:16px">Ajouter</button>
<ul id="taches"></ul>`,
        depart:
`const champ = document.querySelector("#tache");
const liste = document.querySelector("#taches");

// Quand on clique sur #ajouter…
`,
        verifs:[
          { msg:"Un clic ajoute une tâche avec le bon texte", dans:function(p){
              p.taper("#tache", "Promener le chien"); p.cliquer("#ajouter");
              var li = p.tous("#taches li"); return li.length === 1 && /Promener le chien/.test(li[0].textContent); } },
          { msg:"Deux clics ajoutent deux tâches, dans l’ordre", dans:function(p){
              p.taper("#tache", "Ranger ma chambre"); p.cliquer("#ajouter");
              p.taper("#tache", "Faire mes devoirs"); p.cliquer("#ajouter");
              var li = p.tous("#taches li"); return li.length === 2 && /devoirs/.test(li[1].textContent); } },
          { msg:"Le champ est vidé après l’ajout", dans:function(p){ p.taper("#tache", "Lire"); p.cliquer("#ajouter"); return p.el("#tache").value === ""; } },
          { msg:"Tu utilises `createElement` et `appendChild`", test:function(r){ return /createElement\(/.test(r.sans) && /appendChild\(/.test(r.sans); } }
        ],
        solution:
`const champ = document.querySelector("#tache");
const liste = document.querySelector("#taches");

// Quand on clique sur #ajouter…
document.querySelector("#ajouter").addEventListener("click", function () {
  const li = document.createElement("li");
  li.textContent = champ.value;
  liste.appendChild(li);
  champ.value = "";
});`,
        e:"Tu viens de programmer le cœur d’une vraie application ! Pour aller plus loin : refuser les tâches vides avec un `if`, ou barrer une tâche quand on clique dessus." },

      /* ================= Projet final ================= */
      { id:"projet-5", t:"projet", type:"projet", titre:"Ton projet : une vraie application web",
        contenu:[
          "🎉 Bravo, tu as terminé les cinq modules JavaScript ! Tu sais trouver des éléments, changer leur style, réagir aux clics, lire des champs et créer des éléments : de quoi programmer de vraies applications.",
          "📚 Ces projets utilisent une **librairie** : du code écrit par d’autres développeurs, qu’on importe dans la page avec une balise `<script src=\"…\">`. Ici, `canvas-confetti` lance des confettis avec une seule ligne : `confetti();` 🎊 (il faut être connecté à internet).",
          "🛠️ Choisis un projet, télécharge-le, et réalise-le dans **Visual Studio Code**. Cette fois, tu peux modifier les trois fichiers : `index.html`, `style.css` et `script.js`."
        ],
        projets:[
          { id:"mon-tamagotchi", emoji:"🐣", titre:"Mon animal virtuel",
            accroche:"Un Tamagotchi à toi : nourris-le, joue avec lui… et garde-le heureux !",
            description:"Une page avec ton animal virtuel et ses trois jauges : faim, bonheur et énergie. Les boutons Nourrir, Jouer et Dormir changent les jauges, et l’animal change de tête selon son humeur. Avec le temps, il a faim et s’ennuie : à toi de t’en occuper ! Et quand il est au top, confettis !",
            missions:[
              "Personnalise ton animal : son nom et son emoji dans `index.html`, ses couleurs dans `style.css`.",
              "Le bouton **Nourrir** marche déjà : lis bien son code dans `script.js`, puis programme les boutons **Jouer** (bonheur + 15, énergie − 10) et **Dormir** (énergie + 30).",
              "Complète la fonction `mettreAJour()` pour que les trois barres et leurs nombres affichent les bonnes valeurs.",
              "Change l’emoji de l’animal selon son humeur, avec des `if` : 😄 si le bonheur dépasse 70, 😢 s’il est sous 30, 😐 sinon.",
              "Avec `setInterval`, toutes les 3 secondes, la faim augmente et le bonheur baisse un peu. Lance des **confettis** 🎊 quand le bonheur atteint 100 !"
            ],
            defis:[
              { n:1, texte:"Empêche les jauges de sortir des limites : jamais en dessous de 0, jamais au-dessus de 100 (`Math.min` et `Math.max`)." },
              { n:2, texte:"Les barres changent de couleur : vertes au-dessus de 60, orange entre 30 et 60, rouges en dessous (ajoute ou enlève des classes CSS)." },
              { n:2, texte:"Ajoute un champ pour **renommer** ton animal, avec un bouton « Baptiser »." },
              { n:3, texte:"Fais évoluer ton animal : après 20 repas, l’œuf 🥚 devient un poussin 🐣, puis un poulet 🐔 (ou un dragon 🐉 !). Compte les repas dans une variable." }
            ],
            idees:[
              "Invente un animal fantastique, avec une 4e jauge à lui (la « magie » d’une licorne, le « feu » d’un dragon…).",
              "Ajoute un bouton secret qui déclenche une danse (une animation CSS).",
              "Affiche un journal de ce que fait ton animal, avec `createElement`."
            ],
            fichiers:{
              "index.html":
`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mon animal virtuel</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="carte">
    <h1 id="nom">Pixel</h1>
    <div id="animal" class="animal">🐣</div>
    <p id="message">Bonjour ! Occupe-toi bien de moi.</p>

    <div class="jauges">
      <label>🍗 Faim <span id="faim-nombre">50</span></label>
      <div class="barre"><div id="faim-barre" class="remplissage"></div></div>

      <label>💖 Bonheur <span id="bonheur-nombre">50</span></label>
      <div class="barre"><div id="bonheur-barre" class="remplissage"></div></div>

      <label>⚡ Énergie <span id="energie-nombre">80</span></label>
      <div class="barre"><div id="energie-barre" class="remplissage"></div></div>
    </div>

    <div class="boutons">
      <button id="nourrir">🍗 Nourrir</button>
      <button id="jouer">⚽ Jouer</button>
      <button id="dormir">😴 Dormir</button>
    </div>
  </main>

  <!-- La librairie canvas-confetti : elle ajoute la fonction confetti() 🎊 (il faut internet) -->
  <script src="${CONFETTI}"></script>
  <!-- Ton programme -->
  <script src="script.js"></script>
</body>
</html>
`,
              "style.css":
`/* 🎨 Change ces couleurs pour personnaliser ton animal ! */
:root {
  --fond: #FFF1E6;
  --carte: #FFFFFF;
  --principal: #F4845F;
  --barre: #7BC67B;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--fond);
  font-family: "Segoe UI", system-ui, sans-serif;
}

.carte {
  width: min(380px, 92vw);
  padding: 24px;
  background: var(--carte);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  text-align: center;
}

h1 { margin: 0; color: var(--principal); }

.animal {
  font-size: 110px;
  margin: 10px 0;
  transition: transform 0.2s;
}
.animal:hover { transform: scale(1.1) rotate(-5deg); }

.jauges { text-align: left; }
.jauges label { display: flex; justify-content: space-between; margin-top: 12px; font-weight: bold; }

.barre {
  height: 16px;
  background: #EEE;
  border-radius: 8px;
  overflow: hidden;
}
.remplissage {
  width: 50%;
  height: 100%;
  background: var(--barre);
  transition: width 0.4s;
}

.boutons { display: flex; gap: 8px; margin-top: 20px; }
.boutons button {
  flex: 1;
  padding: 12px 6px;
  font: inherit;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  background: var(--principal);
  color: white;
  cursor: pointer;
}
.boutons button:active { transform: translateY(2px); }
`,
              "script.js":
`// 🐣 MON ANIMAL VIRTUEL
// Lis le README.md pour connaître tes missions !

// Les jauges de l'animal (de 0 à 100)
let faim = 50;
let bonheur = 50;
let energie = 80;

// Les éléments de la page
const animal = document.querySelector("#animal");
const message = document.querySelector("#message");

// ✅ Mission 3 : afficher les jauges dans la page
function mettreAJour() {
  document.querySelector("#faim-nombre").textContent = faim;
  document.querySelector("#faim-barre").style.width = faim + "%";
  // fais pareil pour le bonheur et l'énergie…

  // ✅ Mission 4 : l'emoji change selon l'humeur

}

// ✅ Mission 2 : les boutons
document.querySelector("#nourrir").addEventListener("click", function () {
  faim = faim - 20;
  bonheur = bonheur + 5;
  message.textContent = "Miam, merci ! 😋";
  mettreAJour();
});

// le bouton Jouer…

// le bouton Dormir…


// ✅ Mission 5 : le temps passe (toutes les 3 secondes)


// Pour lancer des confettis : confetti();

mettreAJour();
`
            } },

          { id:"createur-d-avatars", emoji:"🎨", titre:"Le créateur d’avatars",
            accroche:"Compose ton personnage : visage, coiffure, accessoire, couleurs… et prends la pose !",
            description:"Une page qui permet de composer un avatar avec des emojis superposés : un visage, une coiffure ou un chapeau, un accessoire, un fond de couleur. Des boutons font défiler les choix, un bouton « Surprise » crée un avatar au hasard, et un champ permet de lui donner un nom. Chaque création réussie mérite des confettis !",
            missions:[
              "Remplis les tableaux `visages`, `chapeaux` et `accessoires` avec tes emojis préférés (au moins 5 chacun).",
              "Le bouton « Visage suivant » marche déjà : lis son code, puis programme « Chapeau suivant » et « Accessoire suivant » sur le même modèle.",
              "Quand on arrive au bout d’un tableau, on revient au début (un `if` qui remet l’indice à 0).",
              "Le sélecteur de couleur `#couleur` change la couleur de fond de l’avatar (événement `\"input\"`, et `style.background`).",
              "Le bouton « Surprise » tire un visage, un chapeau et un accessoire au hasard, et lance des confettis 🎊."
            ],
            defis:[
              { n:1, texte:"Le champ `#nom` et le bouton « Baptiser » écrivent le nom de l’avatar sous l’image." },
              { n:2, texte:"Ajoute des boutons « précédent » ◀ pour revenir en arrière dans chaque liste (et passer de 0 au dernier élément)." },
              { n:2, texte:"Ajoute un bouton « Sauvegarder » qui ajoute une miniature de l’avatar dans une galerie, avec `createElement`." },
              { n:3, texte:"Ajoute une 4e couche (un animal de compagnie à côté de l’avatar, par exemple) avec ses propres boutons, sans copier-coller : écris **une seule fonction** `suivant(liste, indice)` qui renvoie le prochain indice." }
            ],
            idees:[
              "Choisis un thème : super-héros, monstres, astronautes, chevaliers, animaux…",
              "Fais tourner l’avatar quand on clique dessus (une animation CSS ajoutée avec `classList`).",
              "Organise un concours d’avatars dans ta classe !"
            ],
            fichiers:{
              "index.html":
`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Le créateur d'avatars</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🎨 Le créateur d'avatars</h1>

  <main class="atelier">
    <div id="avatar" class="avatar">
      <span id="chapeau" class="couche chapeau">🎩</span>
      <span id="visage" class="couche visage">😀</span>
      <span id="accessoire" class="couche accessoire">🎸</span>
    </div>
    <p id="nom-avatar" class="nom">Mon avatar</p>

    <div class="commandes">
      <button id="visage-suivant">😀 Visage suivant</button>
      <button id="chapeau-suivant">🎩 Chapeau suivant</button>
      <button id="accessoire-suivant">🎸 Accessoire suivant</button>
      <label>🖌️ Couleur du fond <input id="couleur" type="color" value="#BDE0FE"></label>
      <div class="ligne">
        <input id="nom" placeholder="Le nom de ton avatar">
        <button id="baptiser">Baptiser</button>
      </div>
      <button id="surprise" class="surprise">🎲 Surprise !</button>
    </div>
  </main>

  <!-- La librairie canvas-confetti : elle ajoute la fonction confetti() 🎊 (il faut internet) -->
  <script src="${CONFETTI}"></script>
  <!-- Ton programme -->
  <script src="script.js"></script>
</body>
</html>
`,
              "style.css":
`/* 🎨 Change ces couleurs comme tu veux ! */
:root {
  --fond: #F8F4FF;
  --principal: #7B5CD6;
}

body {
  margin: 0;
  padding: 24px 16px;
  background: var(--fond);
  font-family: "Segoe UI", system-ui, sans-serif;
  text-align: center;
}

h1 { color: var(--principal); }

.atelier {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
}

.avatar {
  position: relative;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #BDE0FE;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Les couches de l'avatar sont posées les unes sur les autres */
.couche { position: absolute; left: 50%; transform: translateX(-50%); }
.visage { top: 55px; font-size: 110px; }
.chapeau { top: 0; font-size: 80px; z-index: 2; }
.accessoire { bottom: 0; left: 78%; font-size: 56px; z-index: 3; }

.nom { width: 100%; font-size: 1.4rem; font-weight: bold; margin: 0; }

.commandes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 240px;
}

button, input {
  font: inherit;
  padding: 10px 14px;
  border-radius: 10px;
}
button {
  border: none;
  background: var(--principal);
  color: white;
  font-weight: bold;
  cursor: pointer;
}
input { border: 2px solid #DDD; }
input[type="color"] { padding: 0; width: 50px; height: 34px; vertical-align: middle; }
.ligne { display: flex; gap: 6px; }
.ligne input { flex: 1; min-width: 0; }
.surprise { background: #FF8FAB; font-size: 1.2rem; }
`,
              "script.js":
`// 🎨 LE CRÉATEUR D'AVATARS
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : les listes d'emojis (au moins 5 chacune)
const visages = ["😀", "😎", "🤓", "🥳", "🤠"];
const chapeaux = ["🎩", "👑", "🧢"];
const accessoires = ["🎸", "⚽", "🪄"];

// L'indice de l'élément choisi dans chaque liste
let indiceVisage = 0;
let indiceChapeau = 0;
let indiceAccessoire = 0;

// Les éléments de la page
const visage = document.querySelector("#visage");
const chapeau = document.querySelector("#chapeau");
const accessoire = document.querySelector("#accessoire");

// ✅ Missions 2 et 3 : les boutons « suivant »
document.querySelector("#visage-suivant").addEventListener("click", function () {
  indiceVisage = indiceVisage + 1;
  if (indiceVisage >= visages.length) {
    indiceVisage = 0;   // retour au début de la liste
  }
  visage.textContent = visages[indiceVisage];
});

// le bouton « Chapeau suivant »…

// le bouton « Accessoire suivant »…


// ✅ Mission 4 : la couleur du fond


// ✅ Mission 5 : la surprise 🎲 (et des confettis : confetti();)
`
            } },

          { id:"attrape-l-etoile", emoji:"🌟", titre:"Attrape l’étoile !",
            accroche:"Un jeu de rapidité : clique sur l’étoile qui bouge avant la fin du chrono.",
            description:"Un jeu d’arcade : une étoile apparaît à un endroit au hasard dans le terrain de jeu. Chaque clic dessus rapporte un point et la fait sauter ailleurs. Un chrono de 30 secondes défile : quand il arrive à zéro, la partie s’arrête et ton score s’affiche… avec des confettis si tu bats le record !",
            missions:[
              "Le bouton « Jouer » et le clic sur l’étoile marchent déjà : lis bien le code de `script.js` et essaie le jeu.",
              "Complète la fonction `deplacerEtoile()` : elle place l’étoile à une position **au hasard** dans le terrain (`style.left` et `style.top`, en pixels).",
              "Programme le **chrono** avec `setInterval` : toutes les secondes, le temps baisse de 1 et s’affiche dans `#temps`.",
              "Quand le temps arrive à 0 : arrête le chrono avec `clearInterval(chrono)`, cache l’étoile et affiche le score final.",
              "Garde le **record** dans une variable, et lance des confettis 🎊 quand il est battu."
            ],
            defis:[
              { n:1, texte:"Change l’emoji de la cible et ajoute un son ou une animation CSS quand on l’attrape." },
              { n:2, texte:"Plus on marque de points, plus l’étoile rapetisse (`style.fontSize`)." },
              { n:2, texte:"Ajoute un piège 💣 qui apparaît aussi au hasard : cliquer dessus fait perdre 3 points." },
              { n:3, texte:"L’étoile bouge toute seule, de plus en plus vite : un deuxième `setInterval` la déplace, et son délai diminue à chaque point." }
            ],
            idees:[
              "Invente ton thème : attrape les fantômes 👻, les poissons 🐟, les ballons 🎈…",
              "Ajoute des niveaux : Facile (45 s), Normal (30 s), Difficile (15 s).",
              "Affiche un message différent selon le score (« Escargot 🐌 », « Guépard 🐆 », « Éclair ⚡ »)."
            ],
            fichiers:{
              "index.html":
`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attrape l'étoile !</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>🌟 Attrape l'étoile !</h1>
    <div class="infos">
      <span>⭐ Score : <b id="score">0</b></span>
      <span>⏱️ Temps : <b id="temps">30</b> s</span>
      <span>🏆 Record : <b id="record">0</b></span>
    </div>
    <button id="jouer">▶ Jouer</button>
    <p id="message">Clique sur Jouer, puis attrape l'étoile le plus de fois possible !</p>
  </header>

  <div id="terrain" class="terrain">
    <button id="etoile" class="etoile" hidden>🌟</button>
  </div>

  <!-- La librairie canvas-confetti : elle ajoute la fonction confetti() 🎊 (il faut internet) -->
  <script src="${CONFETTI}"></script>
  <!-- Ton programme -->
  <script src="script.js"></script>
</body>
</html>
`,
              "style.css":
`/* 🎨 Change ces couleurs pour personnaliser ton jeu ! */
:root {
  --fond: #0B1D3A;
  --terrain: #13294B;
  --texte: #F1F5FF;
  --principal: #FFC300;
}

body {
  margin: 0;
  padding: 16px;
  background: var(--fond);
  color: var(--texte);
  font-family: "Segoe UI", system-ui, sans-serif;
  text-align: center;
}

h1 { margin: 6px 0; color: var(--principal); }

.infos {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

#jouer {
  font: inherit;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 10px 28px;
  border: none;
  border-radius: 12px;
  background: var(--principal);
  color: #222;
  cursor: pointer;
}

/* Le terrain de jeu : l'étoile se place dedans grâce à left et top */
.terrain {
  position: relative;
  width: min(700px, 100%);
  height: 420px;
  margin: 12px auto 0;
  background: var(--terrain);
  border-radius: 16px;
  overflow: hidden;
}

.etoile {
  position: absolute;
  left: 40%;
  top: 40%;
  font-size: 48px;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.1s;
}
.etoile:active { transform: scale(0.8); }
`,
              "script.js":
`// 🌟 ATTRAPE L'ÉTOILE !
// Lis le README.md pour connaître tes missions !

let score = 0;
let temps = 30;
let record = 0;
let chrono = null;   // le numéro du setInterval, pour pouvoir l'arrêter

// Les éléments de la page
const terrain = document.querySelector("#terrain");
const etoile = document.querySelector("#etoile");
const message = document.querySelector("#message");

// ✅ Mission 2 : placer l'étoile au hasard dans le terrain
function deplacerEtoile() {
  const largeurMax = terrain.clientWidth - 60;    // la largeur du terrain, moins la taille de l'étoile
  const hauteurMax = terrain.clientHeight - 60;
  // tire une position au hasard, puis :
  // etoile.style.left = … + "px";
  // etoile.style.top = … + "px";
}

// Le bouton Jouer
document.querySelector("#jouer").addEventListener("click", function () {
  score = 0;
  temps = 30;
  document.querySelector("#score").textContent = score;
  message.textContent = "Vite, attrape-la !";
  etoile.hidden = false;
  deplacerEtoile();

  // ✅ Mission 3 : le chrono (toutes les 1000 millisecondes)
  // chrono = setInterval(function () { … }, 1000);
});

// Un clic sur l'étoile
etoile.addEventListener("click", function () {
  score = score + 1;
  document.querySelector("#score").textContent = score;
  deplacerEtoile();
});

// ✅ Mission 4 : la fin de la partie (quand temps arrive à 0)


// ✅ Mission 5 : le record (et des confettis : confetti();)
`
            } }
        ] }
    ],

    bilans: [
      { min:.84, texte:"Félicitations, tu as terminé les cinq modules ! Tu sais programmer de vraies pages interactives. Réalise ton projet, et montre-le à tout le monde 🎉." },
      { min:.60, texte:"Très bien ! Le DOM demande un peu de pratique : refais les exercices ratés, en vérifiant tes sélecteurs (# pour un id, . pour une classe)." },
      { min:.36, texte:"Certaines notions restent floues : reprends les leçons et joue avec les pages d’exemple, en cliquant et en modifiant le code." },
      { min:0,   texte:"Le DOM, c’est beaucoup de nouveautés d’un coup. Reprends une leçon à la fois : trouver un élément, puis changer son texte, puis réagir à un clic." }
    ]
  });
})();
