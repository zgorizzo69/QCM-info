/* Module JavaScript 1 : premiers pas (console, calculs, variables, textes, hasard).
   Les leçons et exercices s’exécutent dans le bac à sable de js/bac-js.js ; le projet final se
   télécharge pour Visual Studio Code (js/projets-js.js). */
(function(){
  const logs = function(r){ return r.logs.join("\n"); };

  QCM.ajouter({
    id: "js-1",
    titre: "JavaScript 1 · Premiers pas",
    resume: "Module 1 sur 5. Écris tes premières lignes de JavaScript : afficher des messages, calculer, ranger des valeurs dans des variables… et lancer des dés !",
    intro: [
      "🚀 Bienvenue dans le premier module JavaScript ! Chaque bloc commence par une leçon avec du code que tu peux modifier et exécuter, puis viennent des questions et un exercice vérifié automatiquement.",
      "🏁 À la fin du module, tu choisis un projet parmi trois, tu le télécharges et tu le réalises dans Visual Studio Code. Les modules suivants s’appuient sur celui-ci : avance dans l’ordre !"
    ],
    aideMemoire: `
console.log("Bonjour !");          // afficher un message
console.log(3 + 4);                // afficher un calcul : 7
// Ceci est un commentaire : l'ordinateur l'ignore

let score = 0;                     // une variable qui peut changer
const prenom = "Léa";              // une variable qui ne change jamais
score = score + 10;                // changer la valeur d'une variable

"Bonjour " + prenom + " !"         // coller des textes avec +
prenom.length                      // le nombre de lettres : 3
prenom.toUpperCase()               // en MAJUSCULES : "LÉA"

17 % 5                             // le reste de la division : 2
Math.round(2.6)                    // arrondi : 3
Math.floor(Math.random() * 6) + 1  // un dé : un nombre entier de 1 à 6`,

    themes: [
      { id:"decouvrir", nom:"Bonjour, JavaScript !",  note:"🖥️ `console.log`, les textes et les nombres." },
      { id:"calculs",   nom:"Calculer",               note:"➕ Une super calculatrice : + - * / et %." },
      { id:"variables", nom:"Les variables",          note:"📦 Des boîtes avec une étiquette : `let` et `const`." },
      { id:"textes",    nom:"Jouer avec les textes",  note:"🔤 Coller, mesurer, mettre en MAJUSCULES." },
      { id:"hasard",    nom:"Le hasard",              note:"🎲 `Math.random` pour lancer des dés." },
      { id:"projet",    nom:"Projet final",           note:"🏁 Ton premier vrai programme, dans Visual Studio Code." }
    ],

    questions: [
      /* ================= Bonjour, JavaScript ! ================= */
      { id:"decouvrir-l1", t:"decouvrir", type:"lecon", titre:"Bonjour, JavaScript !",
        contenu:[
          "🌍 **JavaScript** (JS pour les intimes) est le langage de programmation du web. Une page web, c’est comme une maison 🏠 : le **HTML** construit les murs, le **CSS** fait la décoration, et le **JavaScript**, c’est l’électricité ⚡ qui fait tout bouger : les jeux, les boutons, les animations.",
          "📢 La première commande à connaître : `console.log(…)`. Elle affiche un message dans la **console**, l’écran où le programme te parle. Ici, la console est sous l’éditeur.",
          "🔤 Un **texte** s’écrit entre guillemets : `\"Bonjour\"`. Un **nombre** s’écrit sans guillemets : `42`. Sans les guillemets, l’ordinateur croit que le texte est un nom de commande… et se fâche !",
          "📜 L’ordinateur lit ton programme **ligne par ligne, de haut en bas**, comme une recette de cuisine. On termine chaque instruction par un point-virgule `;` (c’est une bonne habitude).",
          "💬 Tout ce qui suit `//` est un **commentaire** : une note pour les humains, que l’ordinateur ignore.",
          "🐛 Une erreur ? Pas de panique : c’est normal, même pour les pros. Le message rouge t’indique la ligne à vérifier. On appelle ça un **bug**, et le corriger, c’est **déboguer**."
        ],
        js:
`// Mon premier programme 🎉
console.log("Bonjour, je suis l'ordinateur !");
console.log("J'adore les calculs, regarde :");
console.log(2 + 3);
console.log("2 + 3");   // entre guillemets, ce n'est plus un calcul !`,
        essais:[
          { texte:"Change le premier message : écris ton prénom dedans, puis clique sur ▶ Exécuter.",
            test:function(r){ return r.logs.length > 0 && r.logs[0] !== "Bonjour, je suis l'ordinateur !"; } },
          { texte:"Ajoute une ligne qui affiche ton emoji préféré.", test:function(r){ return /\p{Extended_Pictographic}/u.test(logs(r)); } },
          { texte:"Efface un guillemet et exécute : lis le message d’erreur… puis répare !", test:function(r){ return r.erreurs.length > 0; } }
        ],
        lien:"https://www.w3schools.com/js/js_intro.asp" },

      { id:"decouvrir-1", t:"decouvrir", q:"Que fait `console.log(\"Salut !\")` ?",
        r:["Elle affiche « Salut ! » dans la console", "Elle envoie un message à un ami", "Elle ferme le programme", "Elle crée une page web"], b:0,
        e:"`console.log` affiche ce qu’on lui donne entre les parenthèses : c’est la façon dont ton programme te parle." },

      { id:"decouvrir-2", t:"decouvrir", q:"Dans une page web, à quoi sert le JavaScript ?",
        r:["À rendre la page vivante : réagir aux clics, calculer, animer", "À écrire les titres et les paragraphes", "À choisir les couleurs et les polices", "À se connecter à internet"], b:0,
        e:"Le HTML donne le contenu, le CSS la décoration, et le JavaScript le mouvement et l’intelligence de la page." },

      { id:"decouvrir-3", t:"decouvrir", q:"Que va afficher `console.log(\"5 + 5\")` ?",
        r:["5 + 5", "10", "55", "Une erreur"], b:0,
        e:"Entre guillemets, c’est un texte : il est affiché tel quel. Sans les guillemets, `console.log(5 + 5)` afficherait 10." },

      { id:"decouvrir-c1", t:"decouvrir", type:"js",
        q:"🪪 Présente-toi ! Écris un programme qui affiche **trois lignes** : ton prénom, ton âge (un **nombre**, sans guillemets) et ton animal préféré avec un emoji.",
        depart:"// Écris tes trois console.log ici 👇\n",
        verifs:[
          { msg:"Ton programme affiche au moins 3 lignes", test:function(r){ return r.logs.length >= 3; } },
          { msg:"Une des lignes affiche un nombre écrit sans guillemets", test:function(r){ return /console\.log\(\s*\d+(\.\d+)?\s*\)/.test(r.sans); } },
          { msg:"Un emoji apparaît", test:function(r){ return /\p{Extended_Pictographic}/u.test(logs(r)); } },
          { msg:"Aucune erreur", test:function(r){ return !r.erreurs.length; } }
        ],
        solution:
`console.log("Je m'appelle Inès");
console.log(12);
console.log("Mon animal préféré : le panda 🐼");`,
        e:"Chaque `console.log` affiche une ligne. Le nombre 12 s’écrit sans guillemets : c’est un vrai nombre, avec lequel on peut calculer." },

      /* ================= Calculer ================= */
      { id:"calculs-l1", t:"calculs", type:"lecon", titre:"Une super calculatrice",
        contenu:[
          "🧮 JavaScript calcule plus vite que n’importe quelle calculatrice. Les signes à connaître :",
          { code:
`+   addition         12 + 30   → 42
-   soustraction     50 - 8    → 42
*   multiplication   6 * 7     → 42   (pas de ×, c'est l'étoile *)
/   division         84 / 2    → 42
%   reste            17 % 5    → 2    (17 bonbons pour 5 : il en reste 2)` },
          "🥇 Comme en maths, la multiplication et la division passent **avant** l’addition et la soustraction : `2 + 3 * 4` vaut 14. Pour changer l’ordre, on met des **parenthèses** : `(2 + 3) * 4` vaut 20.",
          "🍬 Le signe `%` (« modulo ») donne le **reste** de la division. Il est très pratique : un nombre est pair si `nombre % 2` vaut 0.",
          "⚠️ Piège : `\"2\" + \"2\"` donne `\"22\"` ! Avec des guillemets, ce sont des textes, et le `+` les **colle** au lieu de les additionner."
        ],
        js:
`console.log(12 + 30);
console.log(7 * 6);
console.log(100 / 4);
console.log(2 + 3 * 4);      // la multiplication d'abord !
console.log((2 + 3) * 4);    // les parenthèses d'abord !
console.log(17 % 5);         // le reste : 2 bonbons pour toi 🍬
console.log("2" + "2");      // attention, ce sont des textes !`,
        essais:[
          { texte:"Calcule combien de secondes il y a dans une heure (60 × 60).", test:function(r){ return r.logs.indexOf("3600") >= 0; } },
          { texte:"Calcule combien de secondes il y a dans une journée entière.", test:function(r){ return r.logs.indexOf("86400") >= 0; } },
          "Calcule ton âge en mois, puis à peu près en jours (âge × 365)."
        ],
        lien:"https://www.w3schools.com/js/js_arithmetic.asp" },

      { id:"calculs-1", t:"calculs", q:"Que vaut `2 + 3 * 4` ?",
        r:["14", "20", "24", "9"], b:0,
        e:"La multiplication passe avant l’addition : 3 × 4 = 12, puis 2 + 12 = 14." },

      { id:"calculs-2", t:"calculs", q:"Qu’affiche `console.log(\"5\" + \"5\")` ?",
        r:["55", "10", "5 + 5", "Une erreur"], b:0,
        e:"Ce sont deux textes (entre guillemets) : le + les colle l’un à l’autre." },

      { id:"calculs-3", t:"calculs", q:"Que vaut `20 % 6` ?",
        r:["2", "3", "3,33", "120"], b:0,
        e:"20 = 6 × 3 + 2 : le reste de la division est 2." },

      { id:"calculs-c1", t:"calculs", type:"js",
        q:"🍕 La fête des pizzas ! Il y a **4 pizzas** coupées chacune en **8 parts**, pour **6 amis**. Affiche avec des calculs (pas de résultat écrit à la main !) : le **nombre total** de parts, puis le **nombre de parts qui restent** quand chacun en a pris autant que possible (indice : `%`).",
        depart:
`// Le nombre total de parts :

// Les parts qui restent après le partage entre 6 amis :
`,
        verifs:[
          { msg:"Le total de parts (32) est affiché", test:function(r){ return r.logs.some(function(l){ return /\b32\b/.test(l); }); } },
          { msg:"Le nombre de parts restantes (2) est affiché", test:function(r){ return r.logs.some(function(l){ return /(^|\D)2(\D|$)/.test(l) && !/32/.test(l); }); } },
          { msg:"Tu utilises une multiplication `*` et un reste `%`", test:function(r){ return /\*/.test(r.sans) && /%/.test(r.sans); } },
          { msg:"Les résultats sont calculés, pas écrits à la main", test:function(r){ return !/console\.log\(\s*3?2\s*\)/.test(r.sans); } }
        ],
        solution:
`// Le nombre total de parts :
console.log(4 * 8);
// Les parts qui restent après le partage entre 6 amis :
console.log((4 * 8) % 6);`,
        e:"32 parts pour 6 amis : chacun en a 5 (30 parts), et il en reste 2. Le `%` est l’ami des partages !" },

      /* ================= Les variables ================= */
      { id:"variables-l1", t:"variables", type:"lecon", titre:"Les variables : des boîtes avec une étiquette",
        contenu:[
          "📦 Une **variable**, c’est une boîte avec une étiquette. On range une valeur dedans, et on la retrouve grâce à son nom.",
          "✍️ On crée une variable avec `let` : `let vies = 3;` veut dire « crée une boîte appelée vies, et range 3 dedans ».",
          "🔄 Pour changer ce qu’il y a dans la boîte, on réécrit son nom **sans** `let` : `vies = 5;`. Et pour ajouter 1 : `vies = vies + 1;` (« prends ce qu’il y a dans vies, ajoute 1, et range le résultat dans vies »).",
          "🔒 Si la valeur ne doit **jamais** changer, on utilise `const` : `const prenom = \"Léa\";`. Essayer de la changer provoque une erreur.",
          "🏷️ Les règles des noms : pas d’espace, pas de tiret, ne pas commencer par un chiffre. Pour plusieurs mots, on colle et on met une majuscule : `nombreDeVies`. Et attention, `vies` et `Vies` sont deux noms différents !",
          "🔗 Pour afficher un texte suivi d’une variable, on les colle avec `+` : `console.log(\"Vies : \" + vies);`. On en reparle au prochain bloc."
        ],
        js:
`let vies = 3;
console.log("Vies au départ : " + vies);

vies = vies - 1;   // aïe, un monstre ! 👾
console.log("Vies après le monstre : " + vies);

vies = vies + 2;   // deux cœurs ramassés 💖💖
console.log("Vies maintenant : " + vies);`,
        essais:[
          { texte:"Change le nombre de vies au départ, et exécute.", test:function(r){ return r.logs.length > 0 && r.logs[0] !== "Vies au départ : 3"; } },
          { texte:"Ajoute un bonus qui **double** les vies (`vies = vies * 2;`), et affiche le résultat.",
            test:function(r){ return /vies\s*=\s*vies\s*\*\s*2|vies\s*\*=\s*2/.test(r.sans); } },
          { texte:"Écris `Vies` avec une majuscule dans un `console.log` : lis l’erreur, puis corrige.",
            test:function(r){ return r.erreurs.some(function(e){ return /Vies/.test(e.message); }); } }
        ],
        lien:"https://www.w3schools.com/js/js_variables.asp" },

      { id:"variables-1", t:"variables", q:"Après `let age = 12;` puis `age = age + 1;`, que vaut `age` ?",
        r:["13", "12", "121", "« age + 1 »"], b:0,
        e:"On prend la valeur de age (12), on ajoute 1, et on range 13 dans la boîte age." },

      { id:"variables-2", t:"variables", q:"Quel nom de variable est valide ?",
        r:["nombreDeVies", "nombre de vies", "2joueurs", "mon-score"], b:0,
        e:"Pas d’espace, pas de tiret, pas de chiffre au début. On colle les mots avec des majuscules : c’est le « camelCase » 🐫." },

      { id:"variables-3", t:"variables", q:"Quelle est la différence entre `let` et `const` ?",
        r:["Une variable `const` ne peut plus changer de valeur, une variable `let` oui", "Il n’y en a aucune", "`const` est réservé aux nombres", "`let` est plus rapide"], b:0,
        e:"`const` (constante) protège une valeur qui ne doit pas bouger, comme ton prénom. `let` sert pour ce qui change, comme un score." },

      { id:"variables-c1", t:"variables", type:"js",
        q:"🐷 Ta tirelire ! Crée une variable `tirelire` qui vaut **20**. Tu reçois **15 €** pour ton anniversaire, puis tu dépenses **8 €** en bonbons : modifie la variable à chaque fois (sans calculer le résultat toi-même !), puis affiche le montant final.",
        depart:
`// 1. Crée la variable tirelire

// 2. Ajoute 15 € d'anniversaire

// 3. Enlève les 8 € de bonbons

// 4. Affiche le montant final
`,
        verifs:[
          { msg:"La variable `tirelire` vaut 27 à la fin", dans:function(p){ return tirelire === 27; } },
          { msg:"Tu ajoutes 15 à la variable", test:function(r){ return /tirelire\s*=\s*tirelire\s*\+\s*15|tirelire\s*\+=\s*15/.test(r.sans); } },
          { msg:"Tu enlèves 8 à la variable", test:function(r){ return /tirelire\s*=\s*tirelire\s*-\s*8|tirelire\s*-=\s*8/.test(r.sans); } },
          { msg:"Le montant final (27) est affiché", test:function(r){ return /\b27\b/.test(logs(r)) && !/\b27\b/.test(r.sans); } }
        ],
        solution:
`// 1. Crée la variable tirelire
let tirelire = 20;
// 2. Ajoute 15 € d'anniversaire
tirelire = tirelire + 15;
// 3. Enlève les 8 € de bonbons
tirelire = tirelire - 8;
// 4. Affiche le montant final
console.log("Il me reste " + tirelire + " € 🐷");`,
        e:"La tirelire passe de 20 à 35, puis à 27. Comme la valeur change, on utilise `let`, pas `const`." },

      /* ================= Jouer avec les textes ================= */
      { id:"textes-l1", t:"textes", type:"lecon", titre:"Jouer avec les textes",
        contenu:[
          "🔤 Un texte s’appelle une **chaîne de caractères** (« string » en anglais). On l’écrit entre guillemets doubles `\"…\"` ou simples `'…'`.",
          "🔗 Le `+` **colle** les textes : `\"Bonjour \" + prenom + \" !\"`. Attention aux espaces : sans l’espace après Bonjour, on obtient « BonjourLéa ».",
          "🧲 Un texte collé à un nombre donne un texte : `\"J'ai \" + 12 + \" ans\"` → « J’ai 12 ans ».",
          "📏 `.length` donne le **nombre de caractères** : `\"chat\".length` vaut 4.",
          "📣 `.toUpperCase()` met en MAJUSCULES, `.toLowerCase()` en minuscules : `\"Pizza\".toUpperCase()` → « PIZZA ».",
          "🔍 Ces petits mots après un point s’appellent des **méthodes** : des commandes qu’on peut utiliser sur un texte."
        ],
        js:
`const prenom = "Inès";
const animal = "dragon";

console.log("Salut " + prenom + " !");
console.log(prenom + " a un " + animal + " 🐉");
console.log("Ton prénom a " + prenom.length + " lettres.");
console.log(animal.toUpperCase() + " !!!");`,
        essais:[
          { texte:"Remplace Inès par ton prénom, et l’animal par le tien.", test:function(r){ return r.logs.length > 0 && r.logs[0] !== "Salut Inès !"; } },
          { texte:"Affiche ton prénom en MAJUSCULES.", test:function(r){ return /prenom\.toUpperCase\(\)/.test(r.sans); } },
          { texte:"Enlève l’espace après « Salut » : que se passe-t-il ?", test:function(r){ return /^Salut\S/.test(r.logs[0] || ""); } }
        ],
        lien:"https://www.w3schools.com/js/js_strings.asp" },

      { id:"textes-1", t:"textes", q:"Que vaut `\"Pi\" + \"zza\"` ?",
        r:["\"Pizza\"", "\"Pi zza\"", "Une erreur", "\"Pi+zza\""], b:0,
        e:"Le + colle les deux textes, sans ajouter d’espace." },

      { id:"textes-2", t:"textes", q:"Que vaut `\"chat\".length` ?",
        r:["4", "1", "« chat »", "3"], b:0,
        e:"`.length` compte les caractères : c, h, a, t." },

      { id:"textes-3", t:"textes", niveau:"difficile", q:"Qu’affiche `console.log(\"J'ai \" + 10 + 2 + \" ans\")` ?",
        r:["J’ai 102 ans", "J’ai 12 ans", "J’ai 10 2 ans", "Une erreur"], b:0,
        e:"Piège ! On lit de gauche à droite : \"J’ai \" + 10 donne le texte « J’ai 10 », puis on colle 2. Pour additionner d’abord, il faut des parenthèses : `\"J'ai \" + (10 + 2) + \" ans\"`." },

      { id:"textes-c1", t:"textes", type:"js",
        q:"🦸 Ton nom de super-héros ! Avec les variables `prenom` et `couleur`, affiche la phrase **« Voici CAPITAINE INÈS, le héros violet ! »** : le prénom en majuscules grâce à `.toUpperCase()`, la phrase construite avec `+`. Puis affiche le nombre de lettres du prénom avec `.length`.",
        depart:
`const prenom = "Inès";
const couleur = "violet";

// Construis la phrase avec + et .toUpperCase()
`,
        verifs:[
          { msg:"La phrase contient « CAPITAINE INÈS »", test:function(r){ return /CAPITAINE INÈS/.test(logs(r)); } },
          { msg:"Elle contient aussi la couleur « violet »", test:function(r){ return r.logs.some(function(l){ return /INÈS/.test(l) && /violet/.test(l); }); } },
          { msg:"Le prénom est mis en majuscules avec `.toUpperCase()` (et pas écrit à la main)",
            test:function(r){ return /prenom\.toUpperCase\(\)/.test(r.sans) && !/INÈS/.test(r.sans); } },
          { msg:"Le nombre de lettres (4) est affiché grâce à `.length`", test:function(r){ return /prenom\.length/.test(r.sans) && /\b4\b/.test(logs(r)); } }
        ],
        solution:
`const prenom = "Inès";
const couleur = "violet";

// Construis la phrase avec + et .toUpperCase()
console.log("Voici CAPITAINE " + prenom.toUpperCase() + ", le héros " + couleur + " !");
console.log("Son prénom a " + prenom.length + " lettres.");`,
        e:"Avec des variables, il suffit de changer `prenom` ou `couleur` pour fabriquer un tout nouveau héros, sans toucher au reste du programme." },

      /* ================= Le hasard ================= */
      { id:"hasard-l1", t:"hasard", type:"lecon", titre:"Le hasard : lancer des dés",
        contenu:[
          "🎲 Les jeux ont besoin de hasard. `Math.random()` donne un nombre **au hasard** entre 0 et 1 (jamais 1 pile), par exemple 0.5381…",
          "🪜 Pour fabriquer un dé, on avance en trois marches :",
          { code:
`Math.random()                        0.73…     entre 0 et 1
Math.random() * 6                    4.38…     entre 0 et 5.99…
Math.floor(Math.random() * 6)        4         un entier de 0 à 5
Math.floor(Math.random() * 6) + 1    5         un entier de 1 à 6 🎲` },
          "⬇️ `Math.floor()` arrondit **vers le bas** (il coupe la virgule) : `Math.floor(4.9)` vaut 4. `Math.round()` arrondit au plus proche : `Math.round(4.6)` vaut 5.",
          "🎯 La recette à retenir : pour un nombre entier de 1 à N, on écrit `Math.floor(Math.random() * N) + 1`.",
          "🔁 Exécute plusieurs fois le même programme : le résultat change à chaque fois !"
        ],
        js:
`console.log(Math.random());
console.log(Math.random() * 6);
console.log(Math.floor(Math.random() * 6));

const de = Math.floor(Math.random() * 6) + 1;
console.log("🎲 Le dé affiche : " + de);`,
        essais:[
          "Exécute plusieurs fois : les nombres changent à chaque fois.",
          { texte:"Transforme le dé en dé à 20 faces, comme dans les jeux de rôle.", test:function(r){ return /Math\.random\(\)\s*\*\s*20\s*\)\s*\+\s*1/.test(r.sans); } },
          { texte:"Lance un deuxième dé, et affiche la somme des deux.", test:function(r){ return (r.sans.match(/Math\.random\(\)/g) || []).length >= 4; } }
        ],
        lien:"https://www.w3schools.com/js/js_random.asp" },

      { id:"hasard-1", t:"hasard", q:"Que vaut `Math.floor(4.9)` ?",
        r:["4", "5", "4.9", "0"], b:0,
        e:"`Math.floor` arrondit toujours vers le bas : il « coupe » ce qui est après la virgule." },

      { id:"hasard-2", t:"hasard", q:"Quelle formule donne un nombre entier au hasard entre 1 et 10 ?",
        r:["Math.floor(Math.random() * 10) + 1", "Math.random() * 10", "Math.floor(Math.random() * 10)", "Math.random(1, 10)"], b:0,
        e:"`Math.random() * 10` donne de 0 à 9.99…, `Math.floor` coupe la virgule (0 à 9), et + 1 décale de 1 à 10." },

      { id:"hasard-3", t:"hasard", q:"Que donne `Math.random()` ?",
        r:["Un nombre à virgule au hasard entre 0 et 1", "Un nombre entier entre 1 et 100", "Toujours le même nombre", "Une lettre au hasard"], b:0,
        e:"C’est la base de tous les tirages au sort : on le multiplie, puis on l’arrondit selon ce qu’on veut." },

      { id:"hasard-c1", t:"hasard", type:"js",
        q:"🎲 Le lancer de deux dés ! Crée deux variables `de1` et `de2`, chacune avec un nombre entier **de 1 à 6** au hasard. Affiche les deux dés, puis leur **total**.",
        depart:"// Lance les deux dés ici 👇\n",
        verifs:[
          { msg:"`de1` et `de2` valent au moins 1 (si le hasard tire le plus petit nombre)",
            avant:function(){ Math.random = function(){ return 0; }; }, dans:function(){ return de1 === 1 && de2 === 1; } },
          { msg:"`de1` et `de2` valent au plus 6 (si le hasard tire le plus grand nombre)",
            avant:function(){ Math.random = function(){ return 0.9999; }; }, dans:function(){ return de1 === 6 && de2 === 6; } },
          { msg:"Les deux dés sont affichés", dans:function(p){ var t = p.logs().join("\n"); return t.indexOf(String(de1)) >= 0 && t.indexOf(String(de2)) >= 0; } },
          { msg:"Leur total est affiché", dans:function(p){ return p.logs().some(function(l){ return new RegExp("(^|\\D)" + (de1 + de2) + "(\\D|$)").test(l); }); } }
        ],
        solution:
`const de1 = Math.floor(Math.random() * 6) + 1;
const de2 = Math.floor(Math.random() * 6) + 1;
console.log("🎲 Premier dé : " + de1);
console.log("🎲 Deuxième dé : " + de2);
console.log("Total : " + (de1 + de2));`,
        e:"Les parenthèses autour de `(de1 + de2)` sont importantes : sans elles, le texte collerait les deux nombres (« Total : 35 » au lieu de 8)." },

      /* ================= Projet final ================= */
      { id:"projet-1", t:"projet", type:"projet", titre:"Ton projet : à toi de jouer !",
        contenu:[
          "🎉 Bravo, tu as terminé le module 1 ! Tu sais afficher des messages, calculer, utiliser des variables, jouer avec les textes et le hasard.",
          "🛠️ Place au vrai travail de développeur : choisis **un projet** parmi les trois ci-dessous (ou plusieurs, si tu en veux encore !), télécharge-le, et réalise-le dans **Visual Studio Code**.",
          "🧭 Chaque projet a des **missions** à suivre dans l’ordre, puis des **défis** de plus en plus difficiles, et des idées pour le rendre unique. Il n’y a pas une seule bonne réponse : invente !"
        ],
        projets:[
          { id:"fabrique-de-heros", emoji:"🦸", titre:"La fabrique de super-héros",
            accroche:"Invente un super-héros (ou une super-vilaine !) et calcule sa fiche de puissance.",
            description:"Ton programme affiche la fiche d’identité complète d’un héros que tu inventes : son nom, ses pouvoirs, sa ville, et des statistiques **calculées** (puissance, énergie, âge en jours…). Puis il raconte une petite aventure où l’énergie du héros change, avec une attaque tirée au dé.",
            missions:[
              "Dans `script.js`, change les valeurs des variables pour inventer **ton** héros : nom, super-pouvoir, ville, point faible…",
              "Affiche une fiche d’identité d’au moins **6 lignes**, avec des emojis.",
              "Calcule le **niveau de puissance** : l’âge du héros × 7, plus le nombre de lettres de son nom (`.length`). Affiche-le.",
              "Raconte trois aventures : à chaque fois, change la variable `energie` (`energie = energie - 15;`…) et affiche-la.",
              "Ajoute une **attaque spéciale** dont les dégâts sont tirés au hasard entre 1 et 20."
            ],
            defis:[
              { n:1, texte:"Affiche le nom du héros en MAJUSCULES, comme un cri de guerre : « CAPITAINE PIZZA !!! »." },
              { n:2, texte:"Calcule l’âge du héros en jours, en heures, puis en secondes." },
              { n:2, texte:"Fabrique un **nom de code secret** en collant la couleur préférée du héros, le nombre de lettres de son nom et un nombre au hasard entre 100 et 999." },
              { n:3, texte:"Crée une équipe de 3 héros (3 variables de puissance) : affiche la puissance totale de l’équipe et la **moyenne**, arrondie avec `Math.round()`." }
            ],
            idees:[
              "Change les couleurs dans `style.css` (variables `--fond`, `--principal`…).",
              "Dessine le logo de ton héros avec des emojis, sur plusieurs `console.log`.",
              "Invente un méchant avec sa propre fiche, et calcule qui est le plus puissant."
            ],
            fichiers:ProjetJs.console({
              titre:"La fabrique de super-héros", emoji:"🦸", sousTitre:"La fiche secrète de mon super-héros",
              couleurs:{ fond:"#FFF3D6", principal:"#D7263D" },
              script:
`// 🦸 LA FABRIQUE DE SUPER-HÉROS
// Tout ce que tu écris avec console.log() s'affiche sur la page.
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : invente ton héros en changeant ces valeurs
const nomDuHeros = "Capitaine Pizza";
const superPouvoir = "lancer des parts de pizza brûlantes";
const ville = "Marseille";
const age = 14;
let energie = 100;

// ✅ Mission 2 : la fiche d'identité (ajoute d'autres lignes !)
console.log("✨✨✨ FICHE SECRÈTE ✨✨✨");
console.log("🦸 Nom : " + nomDuHeros);
console.log("⚡ Super-pouvoir : " + superPouvoir);
console.log("🏙️ Protège la ville de " + ville);

// ✅ Mission 3 : le niveau de puissance (âge × 7 + nombre de lettres du nom)


// ✅ Mission 4 : trois aventures qui changent l'énergie
console.log("--- Aventure n°1 : un robot géant attaque ! ---");
energie = energie - 15;
console.log("🔋 Énergie : " + energie);


// ✅ Mission 5 : l'attaque spéciale (dégâts au hasard de 1 à 20)
`
            }) },

          { id:"restaurant-des-chefs", emoji:"🍕", titre:"Le restaurant des chefs",
            accroche:"Ouvre ton restaurant, invente ta carte et calcule l’addition des clients.",
            description:"Ton programme affiche la carte de ton restaurant (les plats et leurs prix sont des variables), prend une commande, puis imprime un **ticket de caisse** : le prix de chaque ligne, le total, le pourboire, et combien chacun doit payer si on partage.",
            missions:[
              "Donne un nom à ton restaurant et invente ta carte : au moins **4 plats** avec leur prix, rangés dans des variables.",
              "Affiche la carte avec de beaux emojis 🍔🍝🥗.",
              "Prends une commande : crée des variables pour les **quantités** (par exemple 2 pizzas, 3 jus).",
              "Affiche le ticket : le prix de chaque ligne (quantité × prix), puis le **total**.",
              "Les clients sont 4 et partagent l’addition : affiche ce que chacun doit payer."
            ],
            defis:[
              { n:1, texte:"Ajoute un pourboire de 10 % au total (indice : total × 10 / 100)." },
              { n:2, texte:"Arrondis les prix au centime : `Math.round(prix * 100) / 100`." },
              { n:2, texte:"Le client paie avec un billet de 50 € : calcule la monnaie à rendre." },
              { n:3, texte:"Crée un **plat du jour** dont le prix est tiré au hasard entre 8 € et 15 €, et ajoute-le à la commande." }
            ],
            idees:[
              "Choisis ton thème : pizzeria, restaurant de l’espace 🚀, cantine de sorciers 🧙, bar à crêpes…",
              "Décore le ticket avec des lignes de séparation : `console.log(\"~~~~~~~~~~~~~~~~\");`.",
              "Change les couleurs dans `style.css` pour qu’elles ressemblent à ton restaurant."
            ],
            fichiers:ProjetJs.console({
              titre:"Le restaurant des chefs", emoji:"🍕", sousTitre:"Le ticket de caisse de mon restaurant",
              couleurs:{ fond:"#FFF8EC", principal:"#2E8B57", ecran:"#FFFFFF", ecranTexte:"#2B2118" },
              script:
`// 🍕 LE RESTAURANT DES CHEFS
// Tout ce que tu écris avec console.log() s'affiche sur la page.
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : le nom du restaurant et la carte (change tout !)
const nomDuRestaurant = "Chez Momo";
const prixPizza = 9;
const prixBurger = 11;
// ajoute au moins deux autres plats…

// ✅ Mission 2 : afficher la carte
console.log("🍽️ Bienvenue " + nomDuRestaurant + " !");
console.log("--- LA CARTE ---");
console.log("🍕 Pizza : " + prixPizza + " €");
console.log("🍔 Burger : " + prixBurger + " €");

// ✅ Mission 3 : la commande (combien de chaque plat ?)
const nombreDePizzas = 2;


// ✅ Mission 4 : le ticket de caisse
console.log("--- TICKET ---");
const prixDesPizzas = nombreDePizzas * prixPizza;
console.log(nombreDePizzas + " pizzas : " + prixDesPizzas + " €");


// ✅ Mission 5 : le partage entre 4 amis
`
            }) },

          { id:"animal-virtuel", emoji:"🐾", titre:"Mon animal de compagnie virtuel",
            accroche:"Adopte un animal imaginaire et simule sa journée, du réveil au coucher.",
            description:"Ton programme présente ton animal (nom, espèce, âge…) et calcule son âge en « années humaines ». Puis il simule sa journée : à chaque action (manger, jouer, dormir), ses jauges de **faim**, de **bonheur** et d’**énergie** changent, et tu affiches son état.",
            missions:[
              "Invente ton animal : nom, espèce, âge, couleur… dans des variables. Il peut être réel ou imaginaire (un dragon, une licorne, un axolotl 🦎).",
              "Affiche sa carte d’identité, avec des emojis.",
              "Calcule son âge en années humaines (pour un chien, on multiplie par 7) et affiche-le.",
              "Simule une journée d’au moins **4 actions** : chacune change les variables `faim`, `bonheur` et `energie`, puis affiche l’état de l’animal.",
              "Ajoute une **humeur surprise** : un nombre au hasard de 1 à 10 qui s’ajoute au bonheur."
            ],
            defis:[
              { n:1, texte:"Affiche le nom de l’animal en MAJUSCULES quand il est très content : « PIXEL EST TROP CONTENT ! »." },
              { n:2, texte:"Dessine une jauge avec des emojis : découvre `\"💖\".repeat(5)`, qui répète un texte 5 fois." },
              { n:2, texte:"Les jauges ne doivent pas dépasser 100 : découvre `Math.min(100, bonheur)`." },
              { n:3, texte:"Calcule combien de croquettes il mange par an, s’il en mange 3 fois par jour, 25 grammes à chaque repas, et affiche-le en kilos." }
            ],
            idees:[
              "Invente une espèce qui n’existe pas, avec ses propres jauges (par exemple « magie » pour une licorne).",
              "Raconte la journée comme une histoire, avec l’heure de chaque action.",
              "Choisis des couleurs douces dans `style.css`."
            ],
            fichiers:ProjetJs.console({
              titre:"Mon animal virtuel", emoji:"🐾", sousTitre:"La journée de mon animal de compagnie",
              couleurs:{ fond:"#EAF7F0", principal:"#6A4C93" },
              script:
`// 🐾 MON ANIMAL DE COMPAGNIE VIRTUEL
// Tout ce que tu écris avec console.log() s'affiche sur la page.
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : invente ton animal
const nom = "Pixel";
const espece = "chien";
const age = 3;

let faim = 50;      // 0 = pas faim du tout, 100 = affamé
let bonheur = 50;   // 0 = triste, 100 = super heureux
let energie = 80;   // 0 = épuisé, 100 = en pleine forme

// ✅ Mission 2 : la carte d'identité
console.log("🐾 Voici " + nom + ", mon " + espece + " !");

// ✅ Mission 3 : l'âge en années humaines


// ✅ Mission 4 : la journée
console.log("☀️ 8 h : " + nom + " se réveille et mange.");
faim = faim - 30;
console.log("Faim : " + faim + " | Bonheur : " + bonheur + " | Énergie : " + energie);


// ✅ Mission 5 : l'humeur surprise (un nombre de 1 à 10)
`
            }) }
        ] }
    ],

    bilans: [
      { min:.84, texte:"Bravo ! Tu maîtrises les premiers pas du JavaScript. Réalise ton projet, puis passe au module 2 pour apprendre à faire prendre des décisions à ton programme." },
      { min:.60, texte:"C’est un bon début ! Refais les exercices ratés : en programmation, on apprend surtout en essayant et en se trompant." },
      { min:.36, texte:"Certaines notions restent floues. Reprends les leçons et modifie les exemples : plus tu exécutes de code, plus ça devient clair." },
      { min:0,   texte:"Tout est nouveau, et c’est normal ! Relis chaque leçon tranquillement, et teste chaque ligne avec le bouton ▶ Exécuter." }
    ]
  });
})();
