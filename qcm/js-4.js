/* Module JavaScript 4 : ranger son code avec des fonctions (définir, appeler, paramètres,
   return, fonctions qui utilisent d’autres fonctions, variables locales). Les sondes des
   exercices appellent directement les fonctions écrites par l’élève. */
(function(){
  const logs = function(r){ return r.logs.join("\n"); };

  QCM.ajouter({
    id: "js-4",
    titre: "JavaScript 4 · Les fonctions",
    resume: "Module 4 sur 5. Range ton code dans des fonctions : des mini-programmes réutilisables, qui reçoivent des informations et renvoient des résultats. Comme les pros !",
    intro: [
      "🧩 Une fonction, c’est un bout de code auquel on donne un nom, pour s’en servir autant de fois qu’on veut. C’est l’outil préféré des développeurs pour garder un programme clair et éviter de se répéter.",
      "📚 Il vaut mieux avoir terminé les modules 1 à 3. À la fin : un combat de monstres au tour par tour, un grimoire de potions, ou ta propre boîte à outils."
    ],
    aideMemoire: `
// Créer une fonction (la recette)…
function direBonjour() {
  console.log("Bonjour !");
}
// … puis l'appeler (la cuisiner), autant de fois qu'on veut
direBonjour();

// Avec des paramètres (les ingrédients)
function saluer(prenom, emoji) {
  console.log("Salut " + prenom + " " + emoji);
}
saluer("Zoé", "👋");

// Avec un résultat renvoyé par return
function double(nombre) {
  return nombre * 2;
}
const resultat = double(21);   // 42

// Une fonction peut en utiliser une autre
function lancerDe(faces) {
  return Math.floor(Math.random() * faces) + 1;
}
function lancerDeuxDes() {
  return lancerDe(6) + lancerDe(6);
}

// Une variable créée dans une fonction n'existe que dedans (variable locale)`,

    themes: [
      { id:"creer",       nom:"Créer une fonction",          note:"🧩 Donner un nom à un bout de code, et l’appeler." },
      { id:"parametres",  nom:"Les paramètres",              note:"🎛️ Donner des informations à une fonction." },
      { id:"retour",      nom:"Renvoyer un résultat",        note:"↩️ `return` : une fonction qui calcule et répond." },
      { id:"combiner",    nom:"Combiner les fonctions",      note:"🔧 Des fonctions qui utilisent d’autres fonctions." },
      { id:"projet",      nom:"Projet final",                note:"🏁 Un programme bien rangé, en fonctions." }
    ],

    questions: [
      /* ================= Créer une fonction ================= */
      { id:"creer-l1", t:"creer", type:"lecon", titre:"Créer une fonction",
        contenu:[
          "🧩 Une **fonction**, c’est comme une **recette** : on l’écrit une fois, en lui donnant un nom, et on peut ensuite la cuisiner autant de fois qu’on veut.",
          { code:
`function chanter() {          // ① on crée (on « définit ») la fonction
  console.log("🎵 La la la !");
}

chanter();                    // ② on l'appelle : son code s'exécute
chanter();                    //    et encore une fois !` },
          "⚠️ **Définir** une fonction ne l’exécute pas : ça range juste la recette dans le livre. Il faut l’**appeler**, avec son nom suivi de parenthèses `()`, pour que son code s’exécute.",
          "🏷️ On choisit un nom qui dit ce que fait la fonction, souvent avec un verbe : `afficherScore`, `lancerDe`, `direBonjour`.",
          "😮 Tu utilises déjà des fonctions depuis le début : `console.log()`, `prompt()`, `Math.random()`… Ce sont des fonctions écrites par d’autres développeurs !"
        ],
        js:
`function chanterJoyeuxAnniversaire() {
  console.log("🎵 Joyeux anniversaire,");
  console.log("🎵 Joyeux anniversaire,");
  console.log("🎵 Joyeux anniversaire à toi !");
}

chanterJoyeuxAnniversaire();
console.log("🎂 Souffle les bougies !");
chanterJoyeuxAnniversaire();`,
        essais:[
          { texte:"Appelle la fonction une troisième fois.", test:function(r){ return r.logs.filter(function(l){ return /à toi/.test(l); }).length >= 3; } },
          { texte:"Supprime tous les appels : que s’affiche-t-il ?", test:function(r){ return !/chanterJoyeuxAnniversaire\s*\(\s*\)\s*;/.test(r.sans.replace(/function\s+chanterJoyeuxAnniversaire\s*\(\s*\)/, "")) && !/à toi/.test(logs(r)); } },
          { texte:"Crée ta propre fonction `applaudir` qui affiche « 👏👏👏 », et appelle-la.", test:function(r){ return /function\s+applaudir\s*\(/.test(r.sans) && /👏/.test(logs(r)); } }
        ],
        lien:"https://www.w3schools.com/js/js_functions.asp" },

      { id:"creer-1", t:"creer", q:"Que se passe-t-il quand on définit une fonction sans jamais l’appeler ?",
        r:["Rien : son code ne s’exécute pas", "Elle s’exécute une fois automatiquement", "Une erreur s’affiche", "Elle s’exécute en boucle"], b:0,
        e:"La recette est rangée dans le livre, mais personne ne la cuisine. Il faut l’appeler avec `nom()`." },

      { id:"creer-2", t:"creer", q:"Comment appelle-t-on la fonction `danser` ?",
        r:["danser();", "function danser;", "call danser", "danser{}"], b:0,
        e:"Le nom de la fonction, suivi de parenthèses. C’est exactement comme `console.log()`." },

      { id:"creer-c1", t:"creer", type:"js",
        q:"💃 Crée une fonction `danser` qui affiche trois lignes : « 💃 Un pas à gauche », « 🕺 Un pas à droite », « 🌀 On tourne ! ». Puis appelle-la **3 fois**.",
        depart:"// Crée la fonction danser, puis appelle-la 3 fois\n",
        verifs:[
          { msg:"La fonction `danser` existe", dans:function(){ return typeof danser === "function"; } },
          { msg:"Appeler `danser()` affiche 3 lignes", dans:function(p){ var a = p.logs().length; danser(); return p.logs().length - a === 3; } },
          { msg:"La danse s’affiche 3 fois en tout", test:function(r){ return r.logs.filter(function(l){ return /tourne/.test(l); }).length === 3; } },
          { msg:"Tu n’as pas recopié les lignes (3 `console.log` au maximum)", test:function(r){ return (r.sans.match(/console\.log/g) || []).length <= 3; } }
        ],
        solution:
`// Crée la fonction danser, puis appelle-la 3 fois
function danser() {
  console.log("💃 Un pas à gauche");
  console.log("🕺 Un pas à droite");
  console.log("🌀 On tourne !");
}

danser();
danser();
danser();`,
        e:"Trois lignes écrites une seule fois, neuf lignes affichées. Pour changer la danse, il suffit de modifier la fonction : tous les appels en profitent." },

      /* ================= Les paramètres ================= */
      { id:"parametres-l1", t:"parametres", type:"lecon", titre:"Les paramètres",
        contenu:[
          "🎛️ Une fonction peut recevoir des informations pour adapter son travail : ce sont ses **paramètres**. On les écrit entre les parenthèses, séparés par des virgules.",
          { code:
`function saluer(prenom) {          // prenom est un paramètre
  console.log("Salut " + prenom + " !");
}
saluer("Zoé");                     // ici, prenom vaut "Zoé"
saluer("Malo");                    // et ici, "Malo"` },
          "🍕 C’est comme commander une pizza : la recette est toujours la même, mais tu choisis la **garniture** et la **taille**. Les paramètres, ce sont tes choix.",
          "📦 Dans la fonction, un paramètre s’utilise comme une variable. Sa valeur est celle qu’on donne entre les parenthèses au moment de l’appel.",
          "🔢 L’ordre compte : avec `function presenter(nom, age)`, l’appel `presenter(\"Léa\", 12)` donne nom = \"Léa\" et age = 12."
        ],
        js:
`function commanderPizza(garniture, taille) {
  console.log("🍕 Une pizza " + taille + " à la " + garniture + ", c'est parti !");
}

commanderPizza("reine", "géante");
commanderPizza("4 fromages", "moyenne");
commanderPizza("ananas", "minuscule");`,
        essais:[
          { texte:"Commande ta pizza préférée en ajoutant un appel.", test:function(r){ return r.logs.filter(function(l){ return /pizza/.test(l); }).length >= 4; } },
          { texte:"Inverse l’ordre des valeurs dans un appel : que se passe-t-il ?", "test":function(r){ return /commanderPizza\(\s*"(géante|moyenne|minuscule)"/.test(r.sans); } },
          { texte:"Ajoute un troisième paramètre `boisson` et utilise-le dans le message.", test:function(r){ return /function\s+commanderPizza\s*\([^)]*,[^)]*,[^)]*\)/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_function_parameters.asp" },

      { id:"parametres-1", t:"parametres", q:"Qu’affiche `function f(x) { console.log(x * 2); }` puis `f(5);` ?",
        r:["10", "x * 2", "5", "25"], b:0,
        e:"Pendant l’appel, le paramètre x vaut 5, donc on affiche 5 × 2 = 10." },

      { id:"parametres-2", t:"parametres", q:"Avec `function presenter(nom, age)`, que vaut `age` dans l’appel `presenter(\"Léa\", 12)` ?",
        r:["12", "\"Léa\"", "undefined", "nom"], b:0,
        e:"Les valeurs sont données dans l’ordre des paramètres : le premier pour nom, le second pour age." },

      { id:"parametres-c1", t:"parametres", type:"js",
        q:"📣 Crée une fonction `crier(message, fois)` qui affiche le `message` **en majuscules**, autant de `fois` que demandé (avec une boucle). Essaie-la avec `crier(\"youpi\", 3);`.",
        depart:"// Crée la fonction crier(message, fois)\n",
        verifs:[
          { msg:"La fonction `crier` existe", dans:function(){ return typeof crier === "function"; } },
          { msg:"`crier(\"coucou\", 4)` affiche 4 fois « COUCOU »", dans:function(p){
              var a = p.logs().length; crier("coucou", 4); var l = p.logs().slice(a);
              return l.length === 4 && l.every(function(x){ return x.indexOf("COUCOU") >= 0; }); } },
          { msg:"`crier(\"ok\", 1)` affiche une seule fois « OK »", dans:function(p){
              var a = p.logs().length; crier("ok", 1); var l = p.logs().slice(a);
              return l.length === 1 && l[0].indexOf("OK") >= 0; } },
          { msg:"Tu utilises une boucle", test:function(r){ return /\b(for|while)\s*\(/.test(r.sans); } }
        ],
        solution:
`// Crée la fonction crier(message, fois)
function crier(message, fois) {
  for (let i = 0; i < fois; i++) {
    console.log(message.toUpperCase() + " !!!");
  }
}

crier("youpi", 3);`,
        e:"Les paramètres peuvent servir partout dans la fonction : `message` pour le texte, `fois` pour la boucle." },

      /* ================= Renvoyer un résultat ================= */
      { id:"retour-l1", t:"retour", type:"lecon", titre:"Renvoyer un résultat : return",
        contenu:[
          "↩️ Une fonction peut faire un calcul et **renvoyer** le résultat à celui qui l’a appelée, avec `return`. On peut alors ranger ce résultat dans une variable, ou s’en servir dans un calcul.",
          { code:
`function double(nombre) {
  return nombre * 2;
}
const resultat = double(21);     // resultat vaut 42
console.log(double(5) + 1);      // 11` },
          "🥤 Pense à un distributeur de boissons : tu mets une pièce (le paramètre), et une canette **sort** (le `return`). `console.log`, lui, ne fait qu’**afficher** un message sur l’écran du distributeur : tu ne peux pas boire un message !",
          "🛑 `return` termine la fonction immédiatement : les lignes écrites après ne sont jamais exécutées.",
          "😮 `Math.floor(4.7)` ou `prompt(…)` renvoient aussi un résultat : ce sont des fonctions avec un `return` !"
        ],
        js:
`function aireRectangle(largeur, hauteur) {
  return largeur * hauteur;
}

const chambre = aireRectangle(3, 4);
console.log("Ma chambre fait " + chambre + " m²");
console.log("Le terrain de foot fait " + aireRectangle(100, 60) + " m²");
console.log("Deux chambres : " + (aireRectangle(3, 4) * 2) + " m²");`,
        essais:[
          { texte:"Calcule l’aire de ta propre chambre (ou de ta classe).", test:function(r){ return (r.sans.match(/aireRectangle\(/g) || []).length >= 5; } },
          { texte:"Remplace `return` par `console.log` dans la fonction : pourquoi voit-on « undefined » ?", test:function(r){ return /undefined/.test(logs(r)); } },
          { texte:"Crée une fonction `perimetre(largeur, hauteur)` qui renvoie le périmètre, et affiche celui de ta chambre.", test:function(r){ return /function\s+perimetre\s*\(/.test(r.sans) && /return/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_functions.asp" },

      { id:"retour-1", t:"retour", q:"Que renvoie `function f() { return 5; console.log(\"hop\"); }` quand on l’appelle ?",
        r:["5, et « hop » n’est jamais affiché", "5, puis affiche « hop »", "« hop »", "undefined"], b:0,
        e:"`return` termine la fonction tout de suite : la ligne d’après n’est jamais atteinte." },

      { id:"retour-2", t:"retour", q:"Quelle est la différence entre `return` et `console.log` ?",
        r:["`return` renvoie une valeur qu’on peut réutiliser, `console.log` ne fait que l’afficher", "Aucune", "`return` affiche en rouge", "`console.log` arrête la fonction"], b:0,
        e:"Avec `return`, le résultat peut être rangé dans une variable ou utilisé dans un calcul." },

      { id:"retour-3", t:"retour", niveau:"difficile", q:"Avec `function ajoute(a, b) { return a + b; }`, que vaut `ajoute(2, ajoute(3, 4))` ?",
        r:["9", "234", "7", "Une erreur"], b:0,
        e:"On calcule d’abord l’intérieur : ajoute(3, 4) renvoie 7. Puis ajoute(2, 7) renvoie 9." },

      { id:"retour-c1", t:"retour", type:"js",
        q:"🌡️ Les Américains mesurent la température en degrés Fahrenheit. Crée une fonction `enFahrenheit(celsius)` qui **renvoie** `celsius × 9 / 5 + 32`. Affiche ensuite la température de ton corps (37 °C) en Fahrenheit.",
        depart:"// Crée la fonction enFahrenheit(celsius)\n",
        verifs:[
          { msg:"`enFahrenheit(0)` renvoie 32", dans:function(){ return enFahrenheit(0) === 32; } },
          { msg:"`enFahrenheit(100)` renvoie 212", dans:function(){ return enFahrenheit(100) === 212; } },
          { msg:"`enFahrenheit(37)` renvoie 98.6", dans:function(){ return Math.abs(enFahrenheit(37) - 98.6) < 0.01; } },
          { msg:"La fonction utilise `return`", test:function(r){ return /\breturn\b/.test(r.sans); } }
        ],
        solution:
`// Crée la fonction enFahrenheit(celsius)
function enFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}

console.log("Mon corps : " + enFahrenheit(37) + " °F 🌡️");`,
        e:"98,6 °F : c’est la température normale du corps humain pour un Américain. Avec `return`, la fonction peut servir pour n’importe quelle température." },

      { id:"retour-c2", t:"retour", type:"js",
        q:"🔢 Crée une fonction `estPair(nombre)` qui **renvoie** `true` si le nombre est pair, et `false` sinon. Indice : un nombre est pair si le reste de sa division par 2 vaut 0.",
        depart:"// Crée la fonction estPair(nombre)\n",
        verifs:[
          { msg:"`estPair(4)` renvoie true", dans:function(){ return estPair(4) === true; } },
          { msg:"`estPair(7)` renvoie false", dans:function(){ return estPair(7) === false; } },
          { msg:"`estPair(0)` renvoie true", dans:function(){ return estPair(0) === true; } },
          { msg:"`estPair(1001)` renvoie false", dans:function(){ return estPair(1001) === false; } }
        ],
        solution:
`// Crée la fonction estPair(nombre)
function estPair(nombre) {
  return nombre % 2 === 0;
}

console.log(estPair(10));
console.log(estPair(3));`,
        e:"`nombre % 2 === 0` est déjà vrai ou faux : on peut le renvoyer directement, sans `if`." },

      /* ================= Combiner les fonctions ================= */
      { id:"combiner-l1", t:"combiner", type:"lecon", titre:"Combiner les fonctions",
        contenu:[
          "🔧 Les fonctions sont comme des briques de LEGO : on en construit de petites, puis on les assemble pour en faire de plus grosses. Une fonction peut **appeler une autre fonction**.",
          "🏠 Une variable créée **dans** une fonction n’existe que dans cette fonction : c’est une variable **locale**. Ce qui se passe dans la fonction reste dans la fonction ! Dehors, son nom est inconnu.",
          "🧹 Grâce aux fonctions, un programme se lit comme une histoire : `preparerLeCombat(); attaquer(); afficherLeVainqueur();`. Chaque fonction fait une seule chose, et le fait bien.",
          "♻️ La règle d’or des développeurs : **ne te répète pas**. Si tu copies-colles le même code trois fois, c’est le moment de créer une fonction !"
        ],
        js:
`function lancerDe(faces) {
  return Math.floor(Math.random() * faces) + 1;
}

function attaque(nomDuHeros) {
  const degats = lancerDe(6) + lancerDe(6);   // degats est une variable locale
  console.log("⚔️ " + nomDuHeros + " inflige " + degats + " points de dégâts !");
  return degats;
}

let pvDuDragon = 30;
pvDuDragon = pvDuDragon - attaque("Inès");
pvDuDragon = pvDuDragon - attaque("Malo");
console.log("🐉 Il reste " + pvDuDragon + " PV au dragon.");`,
        essais:[
          { texte:"Ajoute une troisième attaque, par un héros de ton choix.", test:function(r){ return r.logs.filter(function(l){ return /inflige/.test(l); }).length >= 3; } },
          { texte:"Essaie d’afficher `degats` en dehors de la fonction (tout à la fin) : que dit l’erreur ?", test:function(r){ return r.erreurs.some(function(e){ return /degats/.test(e.message); }); } },
          { texte:"Rends les attaques plus fortes : utilise des dés à 10 faces.", test:function(r){ return /lancerDe\(\s*10\s*\)/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_scope.asp" },

      { id:"combiner-1", t:"combiner", q:"Une variable créée avec `const` à l’intérieur d’une fonction…",
        r:["n’existe qu’à l’intérieur de cette fonction", "existe partout dans le programme", "est effacée de l’ordinateur", "devient un paramètre"], b:0,
        e:"C’est une variable locale. En dehors de la fonction, l’utiliser provoque l’erreur « … is not defined »." },

      { id:"combiner-2", t:"combiner", q:"Pourquoi les développeurs découpent-ils leur programme en fonctions ?",
        r:["Pour ne pas se répéter, et rendre le code plus clair et plus facile à corriger", "Parce que c’est obligatoire", "Pour que le programme soit plus long", "Pour cacher le code"], b:0,
        e:"Chaque fonction a un nom clair et une seule mission. Pour corriger un bug, il suffit de réparer une fonction." },

      { id:"combiner-c1", t:"combiner", type:"js",
        q:"🛒 La caisse du magasin ! Crée une fonction `prixTTC(prix)` qui **renvoie** le prix + 20 % de taxe (prix × 1.2). Puis crée `prixTotal(prix, quantite)` qui **utilise** `prixTTC` pour renvoyer le prix de toute la quantité.",
        depart:
`// 1. La fonction prixTTC(prix)

// 2. La fonction prixTotal(prix, quantite), qui utilise prixTTC
`,
        verifs:[
          { msg:"`prixTTC(10)` renvoie 12", dans:function(){ return Math.abs(prixTTC(10) - 12) < 0.01; } },
          { msg:"`prixTotal(10, 3)` renvoie 36", dans:function(){ return Math.abs(prixTotal(10, 3) - 36) < 0.01; } },
          { msg:"`prixTotal(5, 2)` renvoie 12", dans:function(){ return Math.abs(prixTotal(5, 2) - 12) < 0.01; } },
          { msg:"`prixTotal` appelle `prixTTC`", test:function(r){
              const m = r.sans.match(/function\s+prixTotal[\s\S]*?\{([\s\S]*?)\n\}/); return !!m && /prixTTC\s*\(/.test(m[1]); } }
        ],
        solution:
`// 1. La fonction prixTTC(prix)
function prixTTC(prix) {
  return prix * 1.2;
}

// 2. La fonction prixTotal(prix, quantite), qui utilise prixTTC
function prixTotal(prix, quantite) {
  return prixTTC(prix) * quantite;
}

console.log("3 livres à 10 € : " + prixTotal(10, 3) + " €");`,
        e:"Si la taxe change un jour, il suffit de modifier `prixTTC` : `prixTotal` en profite automatiquement." },

      /* ================= Projet final ================= */
      { id:"projet-4", t:"projet", type:"projet", titre:"Ton projet : un programme bien rangé",
        contenu:[
          "🎉 Bravo, tu as terminé le module 4 ! Tu sais créer des fonctions, leur donner des paramètres et récupérer leurs résultats : c’est la base de tous les grands programmes.",
          "🛠️ Choisis un projet, télécharge-le, et réalise-le dans **Visual Studio Code**. Cette fois, range tout ton code dans des fonctions bien nommées !",
          "🧭 Missions dans l’ordre, puis défis. Le module 5 te fera sortir de la console pour animer de vraies pages web !"
        ],
        projets:[
          { id:"combat-de-monstres", emoji:"🐉", titre:"Le combat de monstres",
            accroche:"Un jeu de rôle au tour par tour : ton héros affronte un monstre, à coups de dés.",
            description:"Ton programme simule un combat au tour par tour entre un héros et un monstre. Chaque action est une fonction : lancer les dés, attaquer, se soigner, afficher l’état. Une boucle fait tourner le combat jusqu’à ce que l’un des deux tombe à 0 point de vie.",
            missions:[
              "Invente ton héros et ton monstre : noms, points de vie (PV), force.",
              "Complète la fonction `lancerDe(faces)` qui **renvoie** un nombre entre 1 et `faces`.",
              "Écris `attaquer(attaquant, force)` qui affiche l’attaque et **renvoie** les dégâts (force + un dé à 6 faces).",
              "Écris `afficherEtat()` qui affiche les PV des deux combattants, avec des cœurs ❤️.",
              "Avec une boucle `while`, fais combattre le héros et le monstre chacun leur tour, jusqu’à ce que l’un d’eux n’ait plus de PV. Annonce le vainqueur !"
            ],
            defis:[
              { n:1, texte:"Coup critique : si le dé fait 6, les dégâts sont doublés, avec un message spécial 💥." },
              { n:2, texte:"Écris `soigner(pv)` qui renvoie les PV + un dé à 8 faces : le héros se soigne quand ses PV passent sous 10." },
              { n:2, texte:"Laisse le joueur choisir son action à chaque tour avec `prompt` : « attaque » ou « soin »." },
              { n:3, texte:"Un combat à plusieurs : range 3 monstres dans un tableau, et fais combattre le héros contre chacun, l’un après l’autre." }
            ],
            idees:[
              "Donne des attaques spéciales à chaque monstre (« Souffle de feu 🔥 », « Toile collante 🕸️ »).",
              "Compte le nombre de tours et affiche-le à la fin.",
              "Change les couleurs dans `style.css` pour une ambiance de donjon."
            ],
            fichiers:ProjetJs.console({
              titre:"Le combat de monstres", emoji:"🐉", sousTitre:"Un combat au tour par tour",
              couleurs:{ fond:"#F1ECE4", principal:"#9D0208", ecran:"#1A0F0F", ecranTexte:"#FBEDEA" },
              script:
`// 🐉 LE COMBAT DE MONSTRES
// Clique sur 🔄 Relancer pour un nouveau combat.
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : les combattants
const nomHeros = "Inès la Brave";
let pvHeros = 30;
const forceHeros = 4;

const nomMonstre = "Gloubor le Troll";
let pvMonstre = 35;
const forceMonstre = 3;

// ✅ Mission 2 : lancer un dé (renvoie un nombre entre 1 et faces)
function lancerDe(faces) {
  // à toi !
}

// ✅ Mission 3 : une attaque (affiche l'attaque et renvoie les dégâts)
function attaquer(attaquant, force) {
  // à toi !
}

// ✅ Mission 4 : afficher l'état des combattants
function afficherEtat() {
  console.log("🦸 " + nomHeros + " : " + pvHeros + " PV");
  console.log("👹 " + nomMonstre + " : " + pvMonstre + " PV");
}

console.log("⚔️ Le combat commence !");
afficherEtat();

// ✅ Mission 5 : le combat, tour après tour (une boucle while)
`
            }) },

          { id:"grimoire-des-potions", emoji:"🧪", titre:"Le grimoire des potions",
            accroche:"Mélange des ingrédients magiques et découvre quelles potions tu fabriques.",
            description:"Ton programme est un grimoire de sorcier : des fonctions mélangent des ingrédients, calculent la puissance d’une potion, décrivent ses effets et tirent au sort la potion du jour. À toi d’inventer les ingrédients, les recettes secrètes… et les explosions !",
            missions:[
              "Remplis le tableau des ingrédients (au moins 6), avec des emojis : 🍄 champignon, 🐸 bave de crapaud, ✨ poussière d’étoile…",
              "Complète `melanger(ingredient1, ingredient2)` qui **renvoie** le nom de la potion obtenue (avec des `if` pour tes recettes secrètes, et une potion « ratée » sinon).",
              "Écris `puissance(nombreDIngredients)` qui renvoie une puissance tirée au hasard, plus forte quand il y a plus d’ingrédients.",
              "Écris `decrire(potion, force)` qui affiche une belle description de la potion.",
              "Crée la potion du jour : deux ingrédients tirés au hasard, mélangés, puis décrits."
            ],
            defis:[
              { n:1, texte:"Ajoute au moins 3 recettes secrètes de plus." },
              { n:2, texte:"Écris `afficherGrimoire()` qui affiche tous les ingrédients numérotés avec une boucle." },
              { n:2, texte:"Si la puissance dépasse 90, la potion explose 💥 : affiche un message spécial." },
              { n:3, texte:"Mélange 3 ingrédients : `melangerTrois(a, b, c)` utilise `melanger(a, b)`, puis mélange le résultat avec c. Invente les recettes à 3 ingrédients !" }
            ],
            idees:[
              "Invente l’histoire de ton sorcier ou de ta sorcière, et affiche-la au début.",
              "Donne une couleur à chaque potion avec un emoji : 🟣🟢🔵.",
              "Change les couleurs dans `style.css` pour un grimoire ancien (fond beige, écriture marron)."
            ],
            fichiers:ProjetJs.console({
              titre:"Le grimoire des potions", emoji:"🧪", sousTitre:"Les recettes secrètes de mon atelier de magie",
              couleurs:{ fond:"#F4ECD8", principal:"#5A189A", ecran:"#2D1E2F", ecranTexte:"#F5E9FF" },
              script:
`// 🧪 LE GRIMOIRE DES POTIONS
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : les ingrédients (au moins 6)
const ingredients = ["🍄 champignon", "🐸 bave de crapaud", "✨ poussière d'étoile"];

// ✅ Mission 2 : mélanger deux ingrédients → renvoie le nom de la potion
function melanger(ingredient1, ingredient2) {
  if (ingredient1 === "🍄 champignon" && ingredient2 === "✨ poussière d'étoile") {
    return "Potion de lévitation 🎈";
  }
  // tes recettes secrètes ici…
  return "Potion ratée (elle sent les chaussettes) 🧦";
}

// ✅ Mission 3 : la puissance de la potion


// ✅ Mission 4 : décrire la potion


// ✅ Mission 5 : la potion du jour
console.log("🧙 Bienvenue dans mon atelier !");
const potion = melanger("🍄 champignon", "✨ poussière d'étoile");
console.log("Tu obtiens : " + potion);
`
            }) },

          { id:"boite-a-outils", emoji:"🧰", titre:"La boîte à outils du collégien",
            accroche:"Des fonctions vraiment utiles : moyenne, conversions, mot de passe, compte à rebours…",
            description:"Ton programme est une boîte à outils : chaque outil est une fonction utile au quotidien. Calculer sa moyenne, convertir des unités, générer un mot de passe solide, compter les jours avant les vacances… Chaque fonction est testée avec des `console.log`.",
            missions:[
              "Complète `moyenne(notes)` qui reçoit un **tableau** de notes et renvoie leur moyenne.",
              "Écris un convertisseur : `kmEnMiles(km)` (1 km = 0,621 mile) ou `eurosEnDollars(euros)`.",
              "Écris `mention(note)` qui renvoie « Très bien », « Bien », « Assez bien » ou « Courage ! » selon la note sur 20.",
              "Écris `genererMotDePasse(longueur)` qui renvoie un mot de passe fait de caractères tirés au hasard dans un texte (indice : `caracteres[Math.floor(Math.random() * caracteres.length)]`).",
              "Teste chaque outil avec au moins deux `console.log`, avec un titre pour chaque outil."
            ],
            defis:[
              { n:1, texte:"Arrondis la moyenne à un chiffre après la virgule : `Math.round(m * 10) / 10`." },
              { n:2, texte:"Écris `meilleureNote(notes)` et `pireNote(notes)` (avec des boucles, sans `Math.max`)." },
              { n:2, texte:"Écris `estSolide(motDePasse)` qui renvoie true si le mot de passe fait au moins 12 caractères." },
              { n:3, texte:"Écris `joursAvant(jour, mois)` qui renvoie le nombre de jours avant une date (tes vacances, ton anniversaire…). Indice : découvre `new Date(2027, mois - 1, jour)` et la différence entre deux dates, en millisecondes." }
            ],
            idees:[
              "Ajoute les outils dont TU as besoin : calcul de l’argent de poche, convertisseur de temps d’écran, minuteur de devoirs…",
              "Donne un emoji à chaque outil, comme dans une vraie boîte à outils 🔨🔧🪛.",
              "Change les couleurs dans `style.css` pour un style « application »."
            ],
            fichiers:ProjetJs.console({
              titre:"La boîte à outils du collégien", emoji:"🧰", sousTitre:"Mes fonctions utiles au quotidien",
              couleurs:{ fond:"#EEF6F8", principal:"#0A9396", ecran:"#FFFFFF", ecranTexte:"#1B3A4B" },
              script:
`// 🧰 LA BOÎTE À OUTILS DU COLLÉGIEN
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : la moyenne d'un tableau de notes
function moyenne(notes) {
  let total = 0;
  // une boucle pour additionner les notes…
  return total / notes.length;
}

console.log("📊 OUTIL N°1 : la moyenne");
console.log(moyenne([12, 15, 9, 17]));

// ✅ Mission 2 : un convertisseur


// ✅ Mission 3 : la mention


// ✅ Mission 4 : le générateur de mot de passe
const caracteres = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!?#";
`
            }) }
        ] }
    ],

    bilans: [
      { min:.84, texte:"Bravo ! Tu sais ranger ton code en fonctions comme un vrai développeur. Réalise ton projet, puis passe au module 5 pour animer de vraies pages web." },
      { min:.60, texte:"Bien joué ! Les fonctions demandent de bien distinguer définir et appeler, afficher et renvoyer : refais les exercices ratés." },
      { min:.36, texte:"Les fonctions sont encore un peu floues : relis la différence entre `console.log` et `return`, et teste les exemples des leçons." },
      { min:0,   texte:"Les fonctions sont une grande étape. Reprends les leçons une par une : crée de toutes petites fonctions, et appelle-les pour voir ce qu’elles font." }
    ]
  });
})();
