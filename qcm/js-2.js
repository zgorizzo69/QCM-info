/* Module JavaScript 2 : prendre des décisions (comparaisons, prompt, if / else, else if, && || !).
   Les exercices utilisent prompt() : le bac à sable (js/bac-js.js) lui donne des réponses
   simulées, différentes pour chaque vérification. */
(function(){
  const logs = function(r){ return r.logs.join("\n"); };

  QCM.ajouter({
    id: "js-2",
    titre: "JavaScript 2 · Prendre des décisions",
    resume: "Module 2 sur 5. Apprends à ton programme à choisir : comparer, poser des questions, et décider avec if et else. Il devient enfin intelligent !",
    intro: [
      "🔀 Jusqu’ici, ton programme exécutait toutes ses lignes, toujours dans le même ordre. Dans ce module, il apprend à **choisir** : selon la situation, il fera une chose… ou une autre.",
      "📚 Il vaut mieux avoir terminé le module 1 (variables, textes, hasard). À la fin, trois projets t’attendent : un test de personnalité, une aventure dont tu es le héros, ou une machine à sous."
    ],
    aideMemoire: `
// Comparer : le résultat vaut true (vrai) ou false (faux)
age === 12     age !== 12     age < 12     age > 12     age <= 12     age >= 12

// Combiner des conditions
age >= 10 && age <= 14     // ET : les deux doivent être vraies
jour === "samedi" || jour === "dimanche"   // OU : au moins une
!estFatigue                // NON : inverse vrai et faux

// Choisir
if (note >= 16) {
  console.log("Excellent !");
} else if (note >= 10) {
  console.log("C'est réussi.");
} else {
  console.log("Courage !");
}

// Poser une question à l'utilisateur
const prenom = prompt("Comment t'appelles-tu ?");      // un texte
const age = Number(prompt("Quel âge as-tu ?"));        // un nombre
const reponse = prompt("Oui ou non ?").toLowerCase();  // en minuscules`,

    themes: [
      { id:"comparer",  nom:"Vrai ou faux ?",        note:"⚖️ Comparer des valeurs : `===`, `<`, `>`…" },
      { id:"demander",  nom:"Poser des questions",   note:"💬 `prompt` et `Number` pour dialoguer." },
      { id:"si",        nom:"Si… sinon",             note:"🔀 `if` et `else` : choisir un chemin." },
      { id:"sinonsi",   nom:"Plusieurs chemins",     note:"🚦 `else if` pour plus de deux choix." },
      { id:"logique",   nom:"Et, ou, non",           note:"🔗 `&&`, `||` et `!` pour combiner." },
      { id:"projet",    nom:"Projet final",          note:"🏁 Un programme qui dialogue et qui décide." }
    ],

    questions: [
      /* ================= Vrai ou faux ? ================= */
      { id:"comparer-l1", t:"comparer", type:"lecon", titre:"Vrai ou faux ? Les booléens",
        contenu:[
          "⚖️ Pour prendre une décision, un programme commence par **comparer**. Le résultat d’une comparaison est toujours `true` (vrai) ou `false` (faux) : on appelle ça un **booléen**, du nom du mathématicien George Boole.",
          { code:
`===   est égal à           12 === 12   → true
!==   est différent de     12 !== 10   → true
<     est plus petit que    5 < 3      → false
>     est plus grand que    5 > 3      → true
<=    plus petit ou égal   12 <= 12    → true
>=    plus grand ou égal    9 >= 12    → false` },
          "⚠️ Le piège n°1 des débutants : `=` **range** une valeur dans une variable, alors que `===` **compare** deux valeurs. Trois signes égal pour comparer !",
          "🔠 On peut aussi comparer des textes : `\"chat\" === \"chat\"` est vrai, mais `\"chat\" === \"Chat\"` est faux, car les majuscules comptent.",
          "🔢 Et un texte n’est jamais égal à un nombre : `\"12\" === 12` est faux."
        ],
        js:
`const age = 12;
console.log(age === 12);         // true
console.log(age > 15);           // false
console.log(age >= 12);          // true
console.log(age !== 10);         // true
console.log("chat" === "Chat");  // false : les majuscules comptent !`,
        essais:[
          { texte:"Change l’âge en 16 : quels résultats changent ?", test:function(r){ return /const\s+age\s*=\s*16/.test(r.sans); } },
          { texte:"Affiche si 7 × 8 vaut bien 56 (`7 * 8 === 56`).", test:function(r){ return /7\s*\*\s*8\s*===\s*56/.test(r.sans) && r.logs.indexOf("true") >= 0; } },
          { texte:"Écris `age = 12` (un seul =) dans un `console.log` : lis l’erreur. Pourquoi ?", test:function(r){ return r.erreurs.some(function(e){ return /constant/.test(e.message); }); } }
        ],
        lien:"https://www.w3schools.com/js/js_comparisons.asp" },

      { id:"comparer-1", t:"comparer", q:"Que vaut `5 > 3` ?",
        r:["true", "false", "8", "2"], b:0,
        e:"5 est bien plus grand que 3 : la comparaison est vraie." },

      { id:"comparer-2", t:"comparer", q:"Quelle est la différence entre `=` et `===` ?",
        r:["`=` range une valeur dans une variable, `===` compare deux valeurs", "Aucune, c’est pareil", "`===` est une erreur de frappe", "`=` compare les nombres, `===` les textes"], b:0,
        e:"`score = 10` range 10 dans score ; `score === 10` demande « score vaut-il 10 ? »." },

      { id:"comparer-3", t:"comparer", niveau:"difficile", q:"Que vaut `\"10\" === 10` ?",
        r:["false", "true", "Une erreur", "10"], b:0,
        e:"Le premier est un texte (entre guillemets), le second un nombre : ils ne sont pas égaux." },

      { id:"comparer-c1", t:"comparer", type:"js",
        q:"🎢 Le grand huit ! Il faut mesurer **au moins 130 cm** pour monter. Crée une variable `peutMonter` qui contient le résultat de la comparaison entre `taille` et 130, puis affiche-la.",
        depart:
`let taille = 142;

// Crée la variable peutMonter avec une comparaison
`,
        verifs:[
          { msg:"`peutMonter` vaut true quand la taille est 142", dans:function(){ return peutMonter === true; } },
          { msg:"Tu compares `taille` et 130 (pas de true écrit à la main)",
            test:function(r){ return /peutMonter\s*=\s*\(?\s*(taille\s*>=\s*130|130\s*<=\s*taille|taille\s*>\s*129)/.test(r.sans); } },
          { msg:"Le résultat est affiché", test:function(r){ return r.logs.some(function(l){ return /true/.test(l); }); } }
        ],
        solution:
`let taille = 142;

// Crée la variable peutMonter avec une comparaison
const peutMonter = taille >= 130;
console.log("Peut monter : " + peutMonter);`,
        e:"Avec `>=`, une personne qui mesure exactement 130 cm peut monter. Avec `>`, elle resterait sur le quai !" },

      /* ================= Poser des questions ================= */
      { id:"demander-l1", t:"demander", type:"lecon", titre:"Poser des questions : prompt",
        contenu:[
          "💬 Pour qu’un programme dialogue, il faut pouvoir poser des questions. `prompt(\"Comment t'appelles-tu ?\")` ouvre une petite fenêtre avec la question, et **renvoie** ce que l’utilisateur a tapé. On le range dans une variable.",
          "⚠️ `prompt` renvoie **toujours un texte**, même si on tape un nombre ! `\"12\" + 1` donne `\"121\"`. Pour obtenir un vrai nombre, on utilise `Number(…)` : `Number(\"12\") + 1` donne 13.",
          "🧪 Ici, pas de vraie fenêtre : les réponses sont **simulées**. Tu les choisis dans le champ « Réponses à prompt », séparées par des virgules, dans l’ordre des questions.",
          "🖥️ Dans tes projets, dans Visual Studio Code, `prompt` ouvrira une vraie fenêtre dans le navigateur."
        ],
        js:
`const prenom = prompt("Comment t'appelles-tu ?");
const age = Number(prompt("Quel âge as-tu ?"));

console.log("Enchanté, " + prenom + " ! 👋");
console.log("Dans 10 ans, tu auras " + (age + 10) + " ans.");`,
        reponses:["Sam", "12"],
        essais:[
          { texte:"Change les réponses (ton prénom, ton âge) dans le champ, puis exécute.", test:function(r){ return r.logs.some(function(l){ return /Enchanté/.test(l) && !/Sam/.test(l); }); } },
          { texte:"Enlève `Number(` et sa parenthèse fermante autour du deuxième prompt : que devient l’âge dans 10 ans ?", test:function(r){ return !/Number\s*\(/.test(r.sans) && r.logs.some(function(l){ return /tu auras \d{3,}/.test(l); }); } },
          "Vide complètement le champ des réponses : que renvoie prompt quand personne ne répond ?"
        ],
        lien:"https://www.w3schools.com/jsref/met_win_prompt.asp" },

      { id:"demander-1", t:"demander", q:"Que renvoie `prompt(\"Ton âge ?\")` si l’utilisateur tape 12 ?",
        r:["Le texte \"12\"", "Le nombre 12", "true", "Rien du tout"], b:0,
        e:"`prompt` renvoie toujours un texte. Pour calculer avec, il faut le convertir avec `Number()`." },

      { id:"demander-2", t:"demander", q:"Que vaut `Number(\"7\") + 3` ?",
        r:["10", "73", "\"7 + 3\"", "Une erreur"], b:0,
        e:"`Number(\"7\")` transforme le texte en nombre 7, et 7 + 3 = 10." },

      { id:"demander-3", t:"demander", q:"Que vaut `\"7\" + 3` ?",
        r:["\"73\"", "10", "\"10\"", "Une erreur"], b:0,
        e:"Un texte + un nombre : le + colle, il n’additionne pas. D’où l’importance de `Number()` !" },

      { id:"demander-c1", t:"demander", type:"js",
        q:"🎂 Demande l’âge de l’utilisateur avec `prompt`, puis affiche **l’âge qu’il aura dans 5 ans**. Attention au piège du texte : avec 12, il faut afficher 17, pas 125 !",
        depart:
`const age = prompt("Quel âge as-tu ?");

// Affiche l'âge dans 5 ans
`,
        reponses:["12"],
        verifs:[
          { msg:"Avec la réponse 12, ton programme affiche 17", reponses:["12"],
            test:function(r){ return /\b17\b/.test(logs(r)) && !/125/.test(logs(r)); } },
          { msg:"Avec la réponse 8, ton programme affiche 13", reponses:["8"],
            test:function(r){ return /\b13\b/.test(logs(r)) && !/85/.test(logs(r)); } },
          { msg:"Tu utilises `prompt`", test:function(r){ return /prompt\s*\(/.test(r.sans); } }
        ],
        solution:
`const age = Number(prompt("Quel âge as-tu ?"));

// Affiche l'âge dans 5 ans
console.log("Dans 5 ans, tu auras " + (age + 5) + " ans 🎂");`,
        e:"`Number()` transforme la réponse en nombre, et les parenthèses `(age + 5)` font le calcul avant de coller le texte." },

      /* ================= Si… sinon ================= */
      { id:"si-l1", t:"si", type:"lecon", titre:"Si… sinon : if et else",
        contenu:[
          "🔀 Tu prends des décisions toute la journée : « **s’il** pleut, je prends mon parapluie, **sinon** je prends mes lunettes de soleil ». En JavaScript, ça s’écrit avec `if` (si) et `else` (sinon).",
          { code:
`if (condition) {
  // ce qui se passe si la condition est vraie
} else {
  // ce qui se passe sinon
}` },
          "🧱 La condition se met entre **parenthèses** `( )`, et les instructions entre **accolades** `{ }`. On décale les lignes à l’intérieur (avec la touche Tab) pour bien voir ce qui dépend du `if` : c’est l’**indentation**.",
          "🛤️ C’est comme un aiguillage de train : le programme prend **un seul** des deux chemins, puis continue après l’accolade fermante.",
          "➖ Le `else` n’est pas obligatoire : un `if` tout seul fait quelque chose, ou rien."
        ],
        js:
`const meteo = "pluie";

if (meteo === "pluie") {
  console.log("☔ Prends ton parapluie !");
} else {
  console.log("😎 Prends tes lunettes de soleil !");
}
console.log("Bonne journée !");`,
        essais:[
          { texte:"Change la météo en \"soleil\" : quel chemin prend le programme ?", test:function(r){ return /😎/.test(logs(r)); } },
          { texte:"Ajoute une deuxième ligne dans le `if`, par exemple « 🥾 Mets tes bottes ! ».", test:function(r){ return /if\s*\([^)]*\)\s*\{[^}]*console\.log[^}]*console\.log[^}]*\}/.test(r.sans); } },
          "Supprime une accolade et exécute : lis l’erreur, puis remets-la."
        ],
        lien:"https://www.w3schools.com/js/js_if_else.asp" },

      { id:"si-1", t:"si", q:"Avec `const age = 10;`, qu’affiche ce code ? `if (age >= 12) { console.log(\"Film autorisé\"); } else { console.log(\"Trop jeune\"); }`",
        r:["Trop jeune", "Film autorisé", "Les deux messages", "Rien"], b:0,
        e:"10 >= 12 est faux : le programme saute le premier bloc et exécute celui du `else`." },

      { id:"si-2", t:"si", q:"À quoi servent les accolades `{ }` après un `if` ?",
        r:["À regrouper les instructions qui dépendent de la condition", "À faire joli", "À écrire un commentaire", "À répéter les instructions"], b:0,
        e:"Tout ce qui est entre les accolades s’exécute seulement si la condition est vraie." },

      { id:"si-3", t:"si", q:"Peut-on écrire un `if` sans `else` ?",
        r:["Oui : si la condition est fausse, il ne se passe simplement rien", "Non, c’est une erreur", "Oui, mais seulement avec des nombres", "Non, il faut toujours deux chemins"], b:0,
        e:"Par exemple : `if (score === 100) { console.log(\"Record !\"); }` n’affiche rien si le score n’est pas 100." },

      { id:"si-c1", t:"si", type:"js",
        q:"🔐 Le coffre-fort ! Demande le code secret avec `prompt`. Si c’est **1234**, affiche « 🔓 Coffre ouvert ! », sinon affiche « 🚫 Code faux ! ».",
        depart:
`const code = prompt("Entre le code secret :");

// Ouvre le coffre seulement si le code est 1234
`,
        reponses:["1234"],
        verifs:[
          { msg:"Avec le code 1234, le coffre s’ouvre", reponses:["1234"],
            test:function(r){ return /Coffre ouvert/.test(logs(r)) && !/Code faux/.test(logs(r)); } },
          { msg:"Avec le code 0000, c’est « Code faux »", reponses:["0000"],
            test:function(r){ return /Code faux/.test(logs(r)) && !/Coffre ouvert/.test(logs(r)); } },
          { msg:"Tu utilises `if` et `else`", test:function(r){ return /\bif\s*\(/.test(r.sans) && /\belse\b/.test(r.sans); } }
        ],
        solution:
`const code = prompt("Entre le code secret :");

// Ouvre le coffre seulement si le code est 1234
if (code === "1234") {
  console.log("🔓 Coffre ouvert !");
} else {
  console.log("🚫 Code faux !");
}`,
        e:"Comme `prompt` renvoie un texte, on compare avec le texte `\"1234\"`. Autre solution : `Number(code) === 1234`." },

      /* ================= Plusieurs chemins ================= */
      { id:"sinonsi-l1", t:"sinonsi", type:"lecon", titre:"Plusieurs chemins : else if",
        contenu:[
          "🚦 Parfois, il y a plus de deux possibilités. On enchaîne alors des `else if` (« sinon, si… ») :",
          { code:
`if (note >= 16) {
  console.log("🏆 Excellent !");
} else if (note >= 12) {
  console.log("👍 Bien !");
} else if (note >= 8) {
  console.log("🙂 Peut mieux faire.");
} else {
  console.log("💪 Au travail !");
}` },
          "🥇 Le programme teste les conditions **dans l’ordre**, de haut en bas, et s’arrête à la **première** qui est vraie. Les suivantes sont ignorées, même si elles sont vraies aussi !",
          "🧠 C’est pour ça que l’ordre compte : avec une note de 18, si on testait `note >= 8` en premier, on afficherait « Peut mieux faire »…",
          "🧺 Le `else` final attrape tout ce qui reste : c’est le filet de sécurité."
        ],
        js:
`const temperature = Number(prompt("Quelle température fait-il ?"));

if (temperature >= 30) {
  console.log("🥵 Canicule ! Short et casquette.");
} else if (temperature >= 18) {
  console.log("😊 Un t-shirt suffira.");
} else if (temperature >= 5) {
  console.log("🧥 Prends un pull.");
} else {
  console.log("🥶 Bonnet, écharpe et gants !");
}`,
        reponses:["22"],
        essais:[
          { texte:"Essaie avec 35 degrés.", test:function(r){ return /Canicule/.test(logs(r)); } },
          { texte:"Essaie avec 10 degrés.", test:function(r){ return /pull/.test(logs(r)); } },
          { texte:"Essaie avec -3 degrés.", test:function(r){ return /Bonnet/.test(logs(r)); } },
          { texte:"Ajoute un cas tout en haut pour 40 degrés et plus : « 🔥 Reste à l’ombre ! ».", test:function(r){ return /temperature\s*>=?\s*(39|40)/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_if_else.asp" },

      { id:"sinonsi-1", t:"sinonsi", q:"Avec `age = 15`, qu’affiche : `if (age >= 18) { … \"adulte\" } else if (age >= 12) { … \"ado\" } else { … \"enfant\" }` ?",
        r:["ado", "adulte", "enfant", "ado et enfant"], b:0,
        e:"15 >= 18 est faux, 15 >= 12 est vrai : on affiche « ado » et on ignore le reste." },

      { id:"sinonsi-2", t:"sinonsi", q:"Si plusieurs conditions d’une chaîne `if… else if…` sont vraies, lesquelles s’exécutent ?",
        r:["Seulement la première qui est vraie", "Toutes celles qui sont vraies", "La dernière", "Aucune"], b:0,
        e:"Dès qu’une condition est vraie, son bloc s’exécute et le programme saute à la fin de la chaîne." },

      { id:"sinonsi-c1", t:"sinonsi", type:"js",
        q:"🏅 Le podium ! Demande le temps d’une course (en secondes). **Moins de 10** → « 🥇 Or », **moins de 12** → « 🥈 Argent », **moins de 15** → « 🥉 Bronze », sinon → « 💪 Continue l’entraînement ! ». Utilise bien ces emojis.",
        depart:
`const temps = Number(prompt("Ton temps, en secondes ?"));

// Donne la bonne médaille
`,
        reponses:["11"],
        verifs:[
          { msg:"9 secondes → 🥇", reponses:["9"], test:function(r){ var t = logs(r); return /🥇/.test(t) && !/🥈|🥉|💪/.test(t); } },
          { msg:"11 secondes → 🥈", reponses:["11"], test:function(r){ var t = logs(r); return /🥈/.test(t) && !/🥇|🥉|💪/.test(t); } },
          { msg:"Exactement 10 secondes → 🥈 (ce n’est pas moins de 10 !)", reponses:["10"], test:function(r){ var t = logs(r); return /🥈/.test(t) && !/🥇|🥉|💪/.test(t); } },
          { msg:"14 secondes → 🥉", reponses:["14"], test:function(r){ var t = logs(r); return /🥉/.test(t) && !/🥇|🥈|💪/.test(t); } },
          { msg:"20 secondes → 💪", reponses:["20"], test:function(r){ var t = logs(r); return /💪/.test(t) && !/🥇|🥈|🥉/.test(t); } }
        ],
        solution:
`const temps = Number(prompt("Ton temps, en secondes ?"));

// Donne la bonne médaille
if (temps < 10) {
  console.log("🥇 Or ! Quelle fusée !");
} else if (temps < 12) {
  console.log("🥈 Argent !");
} else if (temps < 15) {
  console.log("🥉 Bronze !");
} else {
  console.log("💪 Continue l'entraînement !");
}`,
        e:"Grâce à l’ordre des tests, pas besoin d’écrire « entre 10 et 12 » : si on arrive au deuxième test, c’est que le temps n’était pas inférieur à 10." },

      /* ================= Et, ou, non ================= */
      { id:"logique-l1", t:"logique", type:"lecon", titre:"Et, ou, non",
        contenu:[
          "🔗 On peut combiner plusieurs conditions :",
          { code:
`&&   ET    les deux doivent être vraies   devoirsFinis && ilFaitBeau
||   OU    au moins une doit être vraie   jour === "samedi" || jour === "dimanche"
!    NON   inverse vrai et faux           !estFatigue` },
          "🌳 **ET** (`&&`) : « Je sors jouer si j’ai fini mes devoirs **et** qu’il fait beau. » Une seule condition fausse, et on reste à la maison.",
          "🎉 **OU** (`||`) : « C’est le week-end si on est samedi **ou** dimanche. » Une seule condition vraie suffit.",
          "🙃 **NON** (`!`) : `!true` vaut `false`. `!estFatigue` se lit « pas fatigué ».",
          "📏 Pour vérifier qu’un nombre est **entre** deux valeurs, on écrit deux comparaisons reliées par ET : `age >= 10 && age <= 14`. (En JavaScript, `10 <= age <= 14` ne marche pas comme en maths !)"
        ],
        js:
`const age = 13;
const jour = "samedi";
const avecUnAdulte = false;

if (age >= 12 && age <= 17) {
  console.log("🧑 Tu es un ado !");
}
if (jour === "samedi" || jour === "dimanche") {
  console.log("🎉 C'est le week-end !");
}
if (!avecUnAdulte) {
  console.log("👻 Pas d'adulte avec toi : pas de film d'horreur !");
}`,
        essais:[
          { texte:"Change le jour en \"lundi\" : le message du week-end disparaît-il ?", test:function(r){ return /"lundi"/.test(r.sans) && !/week-end/.test(logs(r)); } },
          { texte:"Mets `avecUnAdulte` à `true`.", test:function(r){ return /avecUnAdulte\s*=\s*true/.test(r.sans); } },
          { texte:"Ajoute une condition : « 🍦 Glace ! » si on est le week-end **et** que l’âge est au moins 10.", test:function(r){ return /&&/.test(r.sans) && /Glace/.test(logs(r)); } }
        ],
        lien:"https://www.w3schools.com/js/js_comparisons.asp" },

      { id:"logique-1", t:"logique", q:"Que vaut `true && false` ?",
        r:["false", "true", "Une erreur", "truefalse"], b:0,
        e:"Avec ET, il faut que les deux soient vraies. Une seule fausse, et tout est faux." },

      { id:"logique-2", t:"logique", q:"Que vaut `true || false` ?",
        r:["true", "false", "Une erreur", "null"], b:0,
        e:"Avec OU, une seule condition vraie suffit." },

      { id:"logique-3", t:"logique", q:"Comment écrire « l’âge est entre 10 et 20 (compris) » ?",
        r:["age >= 10 && age <= 20", "10 <= age <= 20", "age >= 10 || age <= 20", "age === 10 && 20"], b:0,
        e:"Deux comparaisons, reliées par ET. Avec OU, tous les âges seraient acceptés !" },

      { id:"logique-c1", t:"logique", type:"js",
        q:"🎟️ Le parc d’attractions ! L’entrée est **gratuite** pour les moins de 6 ans **ou** les 65 ans et plus. Demande l’âge, puis affiche « Gratuit 🎉 » ou « Payant : 25 € ». Utilise `||` (une seule condition).",
        depart:
`const age = Number(prompt("Quel âge as-tu ?"));

// Gratuit ou payant ?
`,
        reponses:["4"],
        verifs:[
          { msg:"4 ans → gratuit", reponses:["4"], test:function(r){ return /Gratuit/.test(logs(r)) && !/Payant/.test(logs(r)); } },
          { msg:"70 ans → gratuit", reponses:["70"], test:function(r){ return /Gratuit/.test(logs(r)) && !/Payant/.test(logs(r)); } },
          { msg:"65 ans pile → gratuit", reponses:["65"], test:function(r){ return /Gratuit/.test(logs(r)) && !/Payant/.test(logs(r)); } },
          { msg:"6 ans → payant", reponses:["6"], test:function(r){ return /Payant/.test(logs(r)) && !/Gratuit/.test(logs(r)); } },
          { msg:"30 ans → payant", reponses:["30"], test:function(r){ return /Payant/.test(logs(r)) && !/Gratuit/.test(logs(r)); } },
          { msg:"Tu utilises `||`", test:function(r){ return /\|\|/.test(r.sans); } }
        ],
        solution:
`const age = Number(prompt("Quel âge as-tu ?"));

// Gratuit ou payant ?
if (age < 6 || age >= 65) {
  console.log("Gratuit 🎉");
} else {
  console.log("Payant : 25 €");
}`,
        e:"Une seule condition avec `||` remplace deux `if` qui afficheraient la même chose." },

      /* ================= Projet final ================= */
      { id:"projet-2", t:"projet", type:"projet", titre:"Ton projet : un programme qui décide",
        contenu:[
          "🎉 Bravo, tu as terminé le module 2 ! Ton programme sait maintenant poser des questions et prendre des décisions.",
          "🛠️ Choisis un projet, télécharge-le, et réalise-le dans **Visual Studio Code**. Dans le navigateur, `prompt` ouvrira de vraies fenêtres pour dialoguer avec le joueur.",
          "🧭 Suis les missions dans l’ordre, puis relève les défis. Et surtout : invente tes propres questions, tes histoires et tes symboles !"
        ],
        projets:[
          { id:"test-de-personnalite", emoji:"🔮", titre:"Le test de personnalité",
            accroche:"« Quel animal fantastique es-tu ? » Invente le test, le programme calcule le résultat.",
            description:"Ton programme pose plusieurs questions à choix (a, b ou c). Chaque réponse rapporte des points à un « profil » (dragon, licorne, phénix…). À la fin, il compare les points et annonce le résultat avec une belle description.",
            missions:[
              "Choisis le thème de ton test : animal fantastique, super-pouvoir, métier du futur, personnage de jeu… et 3 résultats possibles.",
              "Écris au moins **4 questions** avec `prompt`, chacune avec 3 choix (a, b, c).",
              "Pour chaque question, utilise `if / else if` pour ajouter 1 point au bon profil (`pointsDragon = pointsDragon + 1;`).",
              "À la fin, compare les points pour trouver le profil gagnant (`&&` est ton ami : `pointsDragon >= pointsLicorne && pointsDragon >= pointsPhenix`).",
              "Affiche le résultat avec une description et des emojis."
            ],
            defis:[
              { n:1, texte:"Accepte les majuscules : `prompt(…).toLowerCase()` transforme « A » en « a »." },
              { n:2, texte:"Si la réponse n’est ni a, ni b, ni c, affiche « 🤔 Je n’ai pas compris, je compte ça comme un c »." },
              { n:2, texte:"Affiche aussi le **profil secondaire** (le deuxième meilleur score)." },
              { n:3, texte:"Gère les égalités : si deux profils ont le même score, annonce un résultat « hybride » (par exemple « Dragon-Licorne 🐉🦄 »)." }
            ],
            idees:[
              "Teste ton quiz sur tes amis et ta famille, et note leurs résultats.",
              "Ajoute une question bonus qui rapporte 2 points.",
              "Change les couleurs dans `style.css` pour une ambiance magique ✨."
            ],
            fichiers:ProjetJs.console({
              titre:"Le test de personnalité", emoji:"🔮", sousTitre:"Quel animal fantastique es-tu ?",
              couleurs:{ fond:"#F3EDFF", principal:"#7B2CBF", ecran:"#24123F", ecranTexte:"#F6EDFF" },
              script:
`// 🔮 LE TEST DE PERSONNALITÉ
// Le navigateur pose les questions dans de petites fenêtres (prompt).
// Lis le README.md pour connaître tes missions !

// Les points de chaque profil (change les profils si tu veux !)
let pointsDragon = 0;
let pointsLicorne = 0;
let pointsPhenix = 0;

console.log("🔮 Bienvenue dans le test : quel animal fantastique es-tu ?");

// ✅ Question 1 (écris les suivantes sur le même modèle)
const reponse1 = prompt("1. Ton activité préférée ?  a) l'aventure  b) la musique  c) dormir au soleil");
if (reponse1 === "a") {
  pointsDragon = pointsDragon + 1;
} else if (reponse1 === "b") {
  pointsLicorne = pointsLicorne + 1;
} else {
  pointsPhenix = pointsPhenix + 1;
}

// ✅ Questions 2, 3, 4…


// ✅ Le résultat
console.log("Points : 🐉 " + pointsDragon + " | 🦄 " + pointsLicorne + " | 🔥 " + pointsPhenix);
`
            }) },

          { id:"aventure-dont-tu-es-le-heros", emoji:"🗺️", titre:"L’aventure dont tu es le héros",
            accroche:"Une histoire où le joueur choisit son chemin… et où chaque choix compte.",
            description:"Ton programme raconte une histoire. À chaque carrefour, il demande au joueur ce qu’il veut faire, et la suite dépend de sa réponse. Des objets ramassés en chemin (une clé, une lampe…) ouvrent de nouvelles possibilités. Il y a plusieurs fins, bonnes ou mauvaises !",
            missions:[
              "Choisis ton univers : château hanté, île au trésor, station spatiale, forêt enchantée…",
              "Écris l’introduction avec plusieurs `console.log`.",
              "Premier choix : demande « gauche ou droite ? » avec `prompt`, et raconte une suite différente avec `if / else`.",
              "Dans chaque chemin, ajoute un **deuxième choix** (un `if` à l’intérieur d’un `if`).",
              "Prévois au moins **3 fins différentes**."
            ],
            defis:[
              { n:1, texte:"Si le joueur tape autre chose que les réponses prévues, il tombe dans un piège 🕳️ (le `else` final)." },
              { n:2, texte:"Ajoute un objet : `let aLaCle = false;`. Le joueur le trouve sur un chemin, et une porte ne s’ouvre que si `aLaCle` est vrai." },
              { n:2, texte:"Ajoute des points de vie qui baissent avec les mauvais choix, et une fin spéciale si les PV tombent à 0." },
              { n:3, texte:"Une énigme : la porte ne s’ouvre que si le joueur a la clé **et** donne la bonne réponse à une devinette (`&&`)." }
            ],
            idees:[
              "Dessine une carte de ton aventure sur papier avant de programmer : chaque case est un `if`.",
              "Utilise le hasard : un dé décide si le joueur réussit à sauter par-dessus le ravin.",
              "Fais tester ton aventure à quelqu’un sans lui donner les réponses !"
            ],
            fichiers:ProjetJs.console({
              titre:"L'aventure dont tu es le héros", emoji:"🗺️", sousTitre:"Chaque choix compte…",
              couleurs:{ fond:"#EEF4E8", principal:"#386641", ecran:"#1B2414", ecranTexte:"#F1F7E8" },
              script:
`// 🗺️ L'AVENTURE DONT TU ES LE HÉROS
// Le navigateur pose les questions dans de petites fenêtres (prompt).
// Lis le README.md pour connaître tes missions !

let aLaCle = false;   // un objet à trouver pendant l'aventure

console.log("🏰 Tu te réveilles devant un vieux château. La nuit tombe…");
console.log("Deux chemins s'offrent à toi.");

// ✅ Le premier choix
const choix1 = prompt("Tu vas à gauche (vers la forêt) ou à droite (vers le pont) ? Tape gauche ou droite");

if (choix1 === "gauche") {
  console.log("🌲 Tu entres dans la forêt sombre. Un hibou te regarde…");
  // ✅ Un deuxième choix ici !

} else if (choix1 === "droite") {
  console.log("🌉 Le vieux pont craque sous tes pieds…");
  // ✅ Un deuxième choix ici !

} else {
  console.log("🕳️ Tu hésites trop longtemps… et tu tombes dans un trou. FIN.");
}
`
            }) },

          { id:"machine-a-sous", emoji:"🎰", titre:"La machine à sous des bonbons",
            accroche:"Trois rouleaux, des symboles au hasard, et un jackpot de bonbons à gagner.",
            description:"Ton programme simule une machine à sous (qui gagne des bonbons, pas de l’argent 🍬). Il tire trois symboles au hasard, les affiche, et décide si le joueur a gagné : jackpot si les trois sont pareils, petit gain si deux sont pareils.",
            missions:[
              "Choisis tes 4 symboles (fruits, animaux, planètes… 🍒🍋🍀⭐).",
              "Tire un nombre au hasard de 1 à 4 pour le premier rouleau, et transforme-le en symbole avec `if / else if`.",
              "Fais pareil pour les rouleaux 2 et 3, puis affiche les trois symboles côte à côte.",
              "Jackpot si les trois symboles sont identiques (`&&`) : le joueur gagne 50 bonbons.",
              "Petit gain si deux symboles sont identiques (`||`) : 5 bonbons. Sinon, perdu !"
            ],
            defis:[
              { n:1, texte:"Ajoute une variable `bonbons` qui commence à 20 : une partie coûte 2 bonbons, et les gains s’ajoutent." },
              { n:2, texte:"Demande au joueur combien de bonbons il parie (`Number(prompt(…))`), et refuse s’il n’en a pas assez." },
              { n:2, texte:"Ajoute un symbole rare 💎 : tire un nombre de 1 à 10, et seul le 10 donne le diamant. Trois diamants = super jackpot !" },
              { n:3, texte:"Ajoute une combinaison spéciale de ton invention (par exemple 🍒🍒🍋 dans cet ordre exact) qui rapporte un bonus surprise." }
            ],
            idees:[
              "Fais un bel encadré pour les rouleaux : `console.log(\"| \" + r1 + \" | \" + r2 + \" | \" + r3 + \" |\");`.",
              "Invente des messages différents pour chaque résultat, avec du suspense.",
              "Clique sur 🔄 Relancer pour rejouer, ou recharge la page."
            ],
            fichiers:ProjetJs.console({
              titre:"La machine à sous des bonbons", emoji:"🎰", sousTitre:"Trois rouleaux, et un jackpot de bonbons !",
              couleurs:{ fond:"#FFF0F5", principal:"#D6336C", ecran:"#2B0F1C", ecranTexte:"#FFE8F1" },
              script:
`// 🎰 LA MACHINE À SOUS DES BONBONS
// Clique sur 🔄 Relancer (ou recharge la page) pour rejouer.
// Lis le README.md pour connaître tes missions !

console.log("🎰 Bienvenue au casino des bonbons ! 🍬");

// ✅ Le premier rouleau : un nombre de 1 à 4, transformé en symbole
const tirage1 = Math.floor(Math.random() * 4) + 1;
let rouleau1 = "";
if (tirage1 === 1) {
  rouleau1 = "🍒";
} else if (tirage1 === 2) {
  rouleau1 = "🍋";
} else if (tirage1 === 3) {
  rouleau1 = "🍀";
} else {
  rouleau1 = "⭐";
}

// ✅ Les rouleaux 2 et 3 (même modèle)


// ✅ Afficher les trois rouleaux
console.log("| " + rouleau1 + " |");

// ✅ Gagné ou perdu ?
`
            }) }
        ] }
    ],

    bilans: [
      { min:.84, texte:"Excellent ! Ton programme sait maintenant décider. Réalise ton projet, puis découvre les boucles dans le module 3." },
      { min:.60, texte:"Bien joué ! Les conditions sont au cœur de la programmation : refais les exercices ratés pour être bien à l’aise." },
      { min:.36, texte:"Certaines notions restent floues : relis les leçons sur `if` et `else`, et teste les exemples avec d’autres réponses." },
      { min:0,   texte:"Les conditions demandent un peu d’entraînement. Reprends doucement chaque leçon, et change les valeurs pour voir quel chemin prend le programme." }
    ]
  });
})();
