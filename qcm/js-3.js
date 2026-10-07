/* Module JavaScript 3 : répéter (for, compter à rebours, accumuler, while) et ranger (tableaux). */
(function(){
  const logs = function(r){ return r.logs.join("\n"); };
  // Les nombres affichés, dans l’ordre, ligne par ligne.
  const nombres = function(r){ return r.logs.map(function(l){ const m = l.match(/-?\d+/); return m ? Number(m[0]) : null; }).filter(function(n){ return n !== null; }); };

  QCM.ajouter({
    id: "js-3",
    titre: "JavaScript 3 · Répéter : boucles et tableaux",
    resume: "Module 3 sur 5. Fais travailler l’ordinateur à ta place : répète des actions des milliers de fois avec les boucles, et range des listes entières dans des tableaux.",
    intro: [
      "🔁 Les ordinateurs ne se fatiguent jamais : ils peuvent répéter la même chose un million de fois sans se plaindre. Dans ce module, tu apprends à les faire **répéter** avec les boucles, et à ranger des **listes** de valeurs dans des tableaux.",
      "📚 Il vaut mieux avoir terminé les modules 1 et 2. À la fin : un générateur de chansons, un tournoi avec classement, ou des dessins en emojis."
    ],
    aideMemoire: `
// Répéter un nombre de fois précis
for (let i = 1; i <= 10; i++) {
  console.log("Tour n°" + i);
}
for (let i = 10; i >= 1; i--) { … }   // à rebours
for (let i = 0; i <= 20; i += 5) { … } // de 5 en 5

// Répéter tant qu'une condition est vraie
while (vies > 0) { … }

// Accumuler
let total = 0;
for (let i = 1; i <= 100; i++) { total = total + i; }

// Les tableaux
const fruits = ["🍎", "🍌", "🍓"];
fruits[0]               // le premier : "🍎" (on compte à partir de 0 !)
fruits.length           // le nombre d'éléments : 3
fruits.push("🥝");      // ajouter à la fin
fruits[Math.floor(Math.random() * fruits.length)]   // un élément au hasard

// Parcourir un tableau
for (let i = 0; i < fruits.length; i++) { console.log(fruits[i]); }
for (const fruit of fruits) { console.log(fruit); }

// Construire un texte petit à petit
let ligne = "";
for (let i = 0; i < 5; i++) { ligne = ligne + "⭐"; }`,

    themes: [
      { id:"pour",      nom:"La boucle for",          note:"🔁 Répéter un nombre de fois précis." },
      { id:"compter",   nom:"Compter autrement",      note:"⏪ À rebours, de 2 en 2, et accumuler un total." },
      { id:"tantque",   nom:"La boucle while",        note:"⏳ Répéter tant qu’une condition est vraie." },
      { id:"tableaux",  nom:"Les tableaux",           note:"📋 Ranger toute une liste dans une seule variable." },
      { id:"parcourir", nom:"Parcourir un tableau",   note:"🚶 Visiter chaque élément avec une boucle." },
      { id:"projet",    nom:"Projet final",           note:"🏁 Des programmes qui répètent et qui rangent." }
    ],

    questions: [
      /* ================= La boucle for ================= */
      { id:"pour-l1", t:"pour", type:"lecon", titre:"La boucle for",
        contenu:[
          "🔁 Imagine que tu dois afficher 100 fois « Je ne bavarde pas en classe ». Avec 100 `console.log`, c’est long… Une **boucle** répète les mêmes instructions autant de fois qu’on veut.",
          { code:
`for (let i = 1; i <= 5; i++) {
  console.log("Tour de piste n°" + i);
}
//   ① départ      ② condition    ③ après chaque tour
//   let i = 1     i <= 5         i++  (i augmente de 1)` },
          "🏃 C’est comme courir des tours de piste : **①** on part avec un compteur `i` à 1 ; **②** avant chaque tour, on vérifie la condition : tant que `i <= 5` est vraie, on fait un tour ; **③** après chaque tour, `i++` ajoute 1 au compteur.",
          "🔢 Le compteur `i` est une vraie variable : on peut l’utiliser dans la boucle, par exemple pour afficher le numéro du tour.",
          "♾️ Si la condition reste toujours vraie, la boucle ne s’arrête jamais : c’est une **boucle infinie**. Ici, l’application l’arrête au bout d’un million de tours, mais sur un vrai site, la page se figerait !"
        ],
        js:
`for (let i = 1; i <= 5; i++) {
  console.log("Tour de piste n°" + i + " 🏃");
}
console.log("🏁 Course terminée !");`,
        essais:[
          { texte:"Fais courir 10 tours au lieu de 5.", test:function(r){ return r.logs.filter(function(l){ return /Tour de piste/.test(l); }).length === 10; } },
          { texte:"Compte les moutons : « 🐑 1 mouton », « 🐑 2 moutons »… jusqu’à 20.", test:function(r){ return r.logs.filter(function(l){ return /mouton/.test(l); }).length >= 20; } },
          { texte:"Remplace `i++` par `i--`, et exécute : que dit le message ? (Remets `i++` ensuite !)", test:function(r){ return r.erreurs.some(function(e){ return /__BOUCLE__/.test(e.message); }); } }
        ],
        lien:"https://www.w3schools.com/js/js_loop_for.asp" },

      { id:"pour-1", t:"pour", q:"Combien de fois s’exécute `for (let i = 0; i < 3; i++) { … }` ?",
        r:["3 fois", "2 fois", "4 fois", "Une infinité de fois"], b:0,
        e:"i vaut 0, puis 1, puis 2. Quand i vaut 3, la condition `i < 3` est fausse : la boucle s’arrête." },

      { id:"pour-2", t:"pour", q:"Que veut dire `i++` ?",
        r:["Ajoute 1 à i (comme i = i + 1)", "Multiplie i par 2", "Affiche i deux fois", "Remet i à zéro"], b:0,
        e:"`i++` est un raccourci pour `i = i + 1`. Et `i--` enlève 1." },

      { id:"pour-3", t:"pour", q:"Qu’affiche `for (let i = 1; i <= 4; i++) { console.log(i * 10); }` ?",
        r:["10, 20, 30, 40", "1, 2, 3, 4", "40", "10, 20, 30"], b:0,
        e:"i prend les valeurs 1, 2, 3 et 4, et on affiche chaque fois i × 10." },

      { id:"pour-c1", t:"pour", type:"js",
        q:"✖️ La table de 7 ! Avec **une seule** boucle `for`, affiche la table de multiplication de 7, de « 7 × 1 = 7 » jusqu’à « 7 × 10 = 70 ».",
        depart:"// Une boucle de 1 à 10 👇\n",
        verifs:[
          { msg:"10 lignes sont affichées", test:function(r){ return r.logs.length >= 10; } },
          { msg:"Les résultats 7, 14, 21… 70 y sont tous", test:function(r){
              for(let k = 1; k <= 10; k++) if(!r.logs.some(function(l){ return new RegExp("(^|\\D)" + 7 * k + "(\\D|$)").test(l); })) return false;
              return true; } },
          { msg:"Tu utilises une boucle `for`, pas dix `console.log`", test:function(r){ return /\bfor\s*\(/.test(r.sans) && (r.sans.match(/console\.log/g) || []).length <= 2; } }
        ],
        solution:
`// Une boucle de 1 à 10 👇
for (let i = 1; i <= 10; i++) {
  console.log("7 × " + i + " = " + (7 * i));
}`,
        e:"Pour la table de 9, il suffit de changer un seul chiffre. Et pour la table de 1 à 1000… la même boucle !" },

      /* ================= Compter autrement ================= */
      { id:"compter-l1", t:"compter", type:"lecon", titre:"Compter autrement, et accumuler",
        contenu:[
          "⏪ On peut compter **à rebours** : on part de 10, on continue tant que `i >= 1`, et on enlève 1 à chaque tour avec `i--`.",
          "🦘 On peut avancer **par bonds** : `i += 2` ajoute 2 à chaque tour (`i += 2` est un raccourci pour `i = i + 2`).",
          "🧺 On peut aussi **accumuler** : une variable `total` commence à 0, et la boucle lui ajoute quelque chose à chaque tour, comme une tirelire qui se remplit.",
          "🧠 Le mathématicien Carl Friedrich Gauss aurait calculé de tête la somme de 1 à 100 quand il était écolier : 5050. L’ordinateur, lui, fait l’addition en une fraction de seconde…"
        ],
        js:
`// Compte à rebours
for (let i = 5; i >= 1; i--) {
  console.log(i + "…");
}
console.log("🚀 Décollage !");

// De 2 en 2
for (let i = 0; i <= 10; i += 2) {
  console.log("Nombre pair : " + i);
}

// La somme de 1 à 100
let total = 0;
for (let i = 1; i <= 100; i++) {
  total = total + i;
}
console.log("1 + 2 + 3 + … + 100 = " + total);`,
        essais:[
          { texte:"Calcule la somme de 1 à 1000.", test:function(r){ return /500500/.test(logs(r)); } },
          { texte:"Affiche les nombres de 5 en 5, jusqu’à 50.", test:function(r){ return /i\s*\+=\s*5/.test(r.sans); } },
          "Affiche le compte à rebours à partir de 10."
        ],
        lien:"https://www.w3schools.com/js/js_loop_for.asp" },

      { id:"compter-1", t:"compter", q:"Qu’affiche `for (let i = 10; i > 0; i -= 2) { console.log(i); }` ?",
        r:["10, 8, 6, 4, 2", "10, 8, 6, 4, 2, 0", "0, 2, 4, 6, 8, 10", "10, 9, 8… 1"], b:0,
        e:"On part de 10 et on enlève 2 à chaque tour. Quand i vaut 0, la condition `i > 0` est fausse." },

      { id:"compter-2", t:"compter", q:"Après `let total = 0; for (let i = 1; i <= 4; i++) { total = total + i; }`, que vaut total ?",
        r:["10", "4", "5", "1234"], b:0,
        e:"0 + 1 + 2 + 3 + 4 = 10. La variable total se remplit à chaque tour." },

      { id:"compter-c1", t:"compter", type:"js",
        q:"🚀 Le compte à rebours ! Avec une boucle, affiche **10, 9, 8… jusqu’à 1**, puis « 🚀 Décollage ! ».",
        depart:"// Compte à rebours de 10 à 1, puis décollage\n",
        verifs:[
          { msg:"Les nombres de 10 à 1 sont affichés, dans l’ordre", test:function(r){ return nombres(r).join(",") === "10,9,8,7,6,5,4,3,2,1"; } },
          { msg:"La dernière ligne annonce le décollage", test:function(r){ return /Décollage/i.test(r.logs[r.logs.length - 1] || ""); } },
          { msg:"Tu utilises une boucle", test:function(r){ return /\b(for|while)\s*\(/.test(r.sans); } }
        ],
        solution:
`// Compte à rebours de 10 à 1, puis décollage
for (let i = 10; i >= 1; i--) {
  console.log(i);
}
console.log("🚀 Décollage !");`,
        e:"Le message de décollage est **après** l’accolade fermante : il ne s’affiche qu’une fois, quand la boucle est terminée." },

      { id:"compter-c2", t:"compter", type:"js",
        q:"🍬 Le défi des bonbons ! Le 1er jour, tu manges 1 bonbon, le 2e jour 2 bonbons, le 3e jour 3… Combien en auras-tu mangé en **30 jours** ? Calcule-le avec une boucle dans une variable `total`, et affiche-le.",
        depart:
`let total = 0;

// Une boucle de 1 à 30 qui ajoute les bonbons de chaque jour
`,
        verifs:[
          { msg:"`total` vaut 465 à la fin", dans:function(){ return total === 465; } },
          { msg:"Le résultat est affiché", test:function(r){ return /465/.test(logs(r)); } },
          { msg:"Il est calculé par une boucle (pas écrit à la main)", test:function(r){ return /\b(for|while)\s*\(/.test(r.sans) && !/465/.test(r.sans); } }
        ],
        solution:
`let total = 0;

// Une boucle de 1 à 30 qui ajoute les bonbons de chaque jour
for (let jour = 1; jour <= 30; jour++) {
  total = total + jour;
}
console.log("En 30 jours : " + total + " bonbons 🍬");`,
        e:"465 bonbons ! Le compteur de la boucle peut s’appeler comme on veut : `jour` est plus clair que `i`." },

      /* ================= La boucle while ================= */
      { id:"tantque-l1", t:"tantque", type:"lecon", titre:"La boucle while : tant que…",
        contenu:[
          "⏳ La boucle `for` est parfaite quand on sait **combien de fois** répéter. Mais parfois, on ne le sait pas à l’avance : « lance le dé **tant que** tu n’as pas fait 6 ». C’est le travail de `while` (« tant que »).",
          { code:
`while (condition) {
  // répété tant que la condition est vraie
}` },
          "🔄 Avant chaque tour, la condition est vérifiée. Dès qu’elle devient fausse, la boucle s’arrête et le programme continue après l’accolade.",
          "⚠️ Il faut que **quelque chose change** dans la boucle, sinon la condition reste vraie pour toujours… et c’est la boucle infinie !"
        ],
        js:
`let de = 0;
let lancers = 0;

while (de !== 6) {
  de = Math.floor(Math.random() * 6) + 1;
  lancers = lancers + 1;
  console.log("🎲 " + de);
}
console.log("Un 6 après " + lancers + " lancer(s) !");`,
        essais:[
          "Exécute plusieurs fois : le nombre de lancers change à chaque fois.",
          { texte:"Change le programme pour attendre un 1 au lieu d’un 6.", test:function(r){ return /de\s*!==?\s*1\b/.test(r.sans); } },
          { texte:"Supprime la ligne `de = …` dans la boucle et exécute : que se passe-t-il ? (Remets-la ensuite.)", test:function(r){ return r.erreurs.some(function(e){ return /__BOUCLE__/.test(e.message); }); } }
        ],
        lien:"https://www.w3schools.com/js/js_loop_while.asp" },

      { id:"tantque-1", t:"tantque", q:"Quand vaut-il mieux utiliser `while` plutôt que `for` ?",
        r:["Quand on ne sait pas à l’avance combien de tours il faudra", "Quand on veut exactement 10 tours", "Jamais, `while` est interdit", "Pour afficher un seul message"], b:0,
        e:"« Tant que je n’ai pas gagné », « tant qu’il reste des vies »… : on ne connaît pas le nombre de tours." },

      { id:"tantque-2", t:"tantque", q:"Que vaut `n` après `let n = 1; while (n < 20) { n = n * 2; }` ?",
        r:["32", "16", "20", "64"], b:0,
        e:"1, 2, 4, 8, 16, 32 : à 16, la condition est encore vraie, donc on double une dernière fois. À 32, elle est fausse." },

      { id:"tantque-3", t:"tantque", q:"Que se passe-t-il si la condition d’un `while` reste toujours vraie ?",
        r:["La boucle ne s’arrête jamais : c’est une boucle infinie", "Elle s’arrête au bout de 10 tours", "Elle ne s’exécute pas", "L’ordinateur corrige tout seul"], b:0,
        e:"Le programme tourne en rond pour toujours, et la page se fige. Il faut toujours que quelque chose change dans la boucle." },

      { id:"tantque-c1", t:"tantque", type:"js",
        q:"🌱 La plante magique mesure **1 cm** et **double** chaque nuit. Combien de jours faut-il pour qu’elle **dépasse 1000 cm** ? Utilise `while`, une variable `taille` et une variable `jours`, puis affiche le nombre de jours.",
        depart:
`let taille = 1;
let jours = 0;

// Tant que la taille ne dépasse pas 1000…
`,
        verifs:[
          { msg:"`jours` vaut 10 à la fin", dans:function(){ return jours === 10; } },
          { msg:"`taille` dépasse bien 1000", dans:function(){ return taille > 1000; } },
          { msg:"Tu utilises une boucle `while`", test:function(r){ return /\bwhile\s*\(/.test(r.sans); } },
          { msg:"Le nombre de jours est affiché", test:function(r){ return /\b10\b/.test(logs(r)); } }
        ],
        solution:
`let taille = 1;
let jours = 0;

// Tant que la taille ne dépasse pas 1000…
while (taille <= 1000) {
  taille = taille * 2;
  jours = jours + 1;
}
console.log("🌱 Après " + jours + " jours, la plante mesure " + taille + " cm !");`,
        e:"Après 10 nuits, la plante mesure 1024 cm, plus de 10 mètres ! C’est la puissance du doublement." },

      /* ================= Les tableaux ================= */
      { id:"tableaux-l1", t:"tableaux", type:"lecon", titre:"Les tableaux : des listes",
        contenu:[
          "📋 Pour ranger une liste (des invités, des scores, des mots…), une variable par élément, ce serait long. Un **tableau** range toute la liste dans une seule variable, entre crochets `[ ]`, avec des virgules :",
          { code:`const fruits = ["🍎 pomme", "🍌 banane", "🍓 fraise"];` },
          "🔢 Chaque élément a un **numéro**, son indice… et on commence à compter à **0** ! `fruits[0]` est la pomme, `fruits[1]` la banane, `fruits[2]` la fraise. Comme les étages d’un immeuble : le rez-de-chaussée, c’est l’étage 0.",
          "📏 `fruits.length` donne le nombre d’éléments (3). Le dernier est donc `fruits[fruits.length - 1]`.",
          "➕ `fruits.push(\"🥝 kiwi\")` ajoute un élément **à la fin**. Et `fruits[1] = \"🥭 mangue\"` remplace la banane.",
          "🎲 Pour tirer un élément au hasard : `fruits[Math.floor(Math.random() * fruits.length)]`."
        ],
        js:
`const fruits = ["🍎 pomme", "🍌 banane", "🍓 fraise"];

console.log(fruits);
console.log("Le premier : " + fruits[0]);
console.log("Nombre de fruits : " + fruits.length);

fruits.push("🥝 kiwi");
console.log("Après push : " + fruits.length + " fruits");
console.log("Le dernier : " + fruits[fruits.length - 1]);

const auHasard = fruits[Math.floor(Math.random() * fruits.length)];
console.log("🎲 Fruit tiré au sort : " + auHasard);`,
        essais:[
          { texte:"Ajoute un cinquième fruit avec `push`.", test:function(r){ return (r.sans.match(/\.push\(/g) || []).length >= 2; } },
          { texte:"Affiche `fruits[10]` : que vaut une case qui n’existe pas ?", test:function(r){ return /fruits\[\s*10\s*\]/.test(r.sans) && /undefined/.test(logs(r)); } },
          { texte:"Remplace la banane par un autre fruit avec `fruits[1] = …`.", test:function(r){ return /fruits\[\s*1\s*\]\s*=[^=]/.test(r.sans); } }
        ],
        lien:"https://www.w3schools.com/js/js_arrays.asp" },

      { id:"tableaux-1", t:"tableaux", q:"Avec `const lettres = [\"a\", \"b\", \"c\"];`, que vaut `lettres[1]` ?",
        r:["\"b\"", "\"a\"", "\"c\"", "undefined"], b:0,
        e:"On compte à partir de 0 : lettres[0] est \"a\", lettres[1] est \"b\"." },

      { id:"tableaux-2", t:"tableaux", q:"Que vaut `[\"🐱\", \"🐶\", \"🐰\", \"🐹\"].length` ?",
        r:["4", "3", "5", "\"🐱🐶🐰🐹\""], b:0,
        e:"`.length` compte les éléments : il y en a 4. Le dernier a donc l’indice 3." },

      { id:"tableaux-3", t:"tableaux", q:"Que fait `invites.push(\"Léo\")` ?",
        r:["Elle ajoute « Léo » à la fin du tableau invites", "Elle supprime Léo", "Elle met Léo en premier", "Elle affiche Léo"], b:0,
        e:"`push` (« pousser ») ajoute un élément à la fin de la liste, qui s’allonge d’une case." },

      { id:"tableaux-c1", t:"tableaux", type:"js",
        q:"🎒 Le sac de l’aventurier ! Crée un tableau `sac` avec **3 objets** de ton choix. Ajoute ensuite « 🗝️ clé » avec `push`. Puis affiche le **nombre d’objets** et le **premier objet** du sac.",
        depart:"// Crée le sac, ajoute la clé, puis affiche 👇\n",
        verifs:[
          { msg:"`sac` est un tableau de 4 objets", dans:function(){ return Array.isArray(sac) && sac.length === 4; } },
          { msg:"La clé est ajoutée à la fin avec `push`", dans:function(){ return /cl[ée]/i.test(String(sac[3])); } },
          { msg:"Tu utilises `push`", test:function(r){ return /sac\.push\(/.test(r.sans); } },
          { msg:"Le nombre d’objets (4) est affiché grâce à `.length`", test:function(r){ return /sac\.length/.test(r.sans) && /\b4\b/.test(logs(r)); } },
          { msg:"Le premier objet est affiché avec `sac[0]`", test:function(r){ return /sac\[\s*0\s*\]/.test(r.sans); },
            dans:function(p){ return p.logs().some(function(l){ return l.indexOf(String(sac[0])) >= 0; }); } }
        ],
        solution:
`// Crée le sac, ajoute la clé, puis affiche 👇
const sac = ["🗡️ épée", "🧪 potion", "🗺️ carte"];
sac.push("🗝️ clé");
console.log("Objets dans le sac : " + sac.length);
console.log("Premier objet : " + sac[0]);`,
        e:"On peut ajouter des éléments à un tableau créé avec `const` : `const` interdit seulement de remplacer le tableau entier par un autre." },

      /* ================= Parcourir un tableau ================= */
      { id:"parcourir-l1", t:"parcourir", type:"lecon", titre:"Parcourir un tableau",
        contenu:[
          "🚶 Boucles et tableaux sont faits pour s’entendre : une boucle peut **visiter chaque élément** d’un tableau, du premier au dernier.",
          "🔢 Avec un compteur : `for (let i = 0; i < tableau.length; i++)`. On part de 0 (le premier indice) et on s’arrête **avant** `length` (le dernier indice est `length - 1`). Dans la boucle, `tableau[i]` est l’élément visité.",
          "✨ Plus simple, quand on n’a pas besoin du numéro : `for (const element of tableau)` se lit « pour chaque élément du tableau ».",
          "🧺 On combine avec ce qu’on sait déjà : accumuler un total, compter, chercher le plus grand…",
          { code:
`let plusGrand = scores[0];          // on suppose que le premier est le plus grand
for (const s of scores) {
  if (s > plusGrand) {              // on en trouve un plus grand ?
    plusGrand = s;                  // il devient le nouveau champion
  }
}` }
        ],
        js:
`const invites = ["Lina", "Tom", "Yasmine", "Hugo"];

for (let i = 0; i < invites.length; i++) {
  console.log("🎉 Bienvenue " + invites[i] + " ! (invité n°" + (i + 1) + ")");
}

const scores = [12, 7, 19, 3];
let total = 0;
for (const s of scores) {
  total = total + s;
}
console.log("Total des points : " + total);`,
        essais:[
          { texte:"Ajoute ton prénom dans la liste des invités.", test:function(r){ return r.logs.filter(function(l){ return /Bienvenue/.test(l); }).length >= 5; } },
          { texte:"Calcule la moyenne des scores (total divisé par `scores.length`).", test:function(r){ return /scores\.length/.test(r.sans) && /10\.25/.test(logs(r)); } },
          { texte:"Remplace `<` par `<=` dans la première boucle : d’où vient le « undefined » ?", test:function(r){ return /undefined/.test(logs(r)); } }
        ],
        lien:"https://www.w3schools.com/js/js_loop_forof.asp" },

      { id:"parcourir-1", t:"parcourir", q:"Pourquoi écrit-on `i < tableau.length` et pas `i <= tableau.length` ?",
        r:["Parce que le dernier indice est length − 1 (on compte à partir de 0)", "Parce que <= n’existe pas", "Pour aller plus vite", "C’est pareil"], b:0,
        e:"Un tableau de 4 éléments a les indices 0, 1, 2 et 3. tableau[4] n’existe pas : il vaut undefined." },

      { id:"parcourir-2", t:"parcourir", q:"Dans `for (const animal of animaux) { … }`, que contient `animal` ?",
        r:["Chaque élément du tableau, l’un après l’autre", "Le numéro de l’élément", "Le tableau entier", "Le dernier élément seulement"], b:0,
        e:"`for… of` visite chaque élément : à chaque tour, `animal` contient le suivant." },

      { id:"parcourir-c1", t:"parcourir", type:"js",
        q:"🏆 Le meilleur score ! Avec une boucle sur le tableau `scores`, trouve le **plus grand score** (sans `Math.max` !) et affiche-le. Affiche aussi la **moyenne** (le total divisé par le nombre de scores).",
        depart:
`const scores = [14, 8, 19, 11, 16];

// Trouve le plus grand score avec une boucle

// Calcule et affiche la moyenne
`,
        verifs:[
          { msg:"Le plus grand score (19) est affiché", test:function(r){ return /\b19\b/.test(logs(r)); } },
          { msg:"La moyenne (13.6) est affichée", test:function(r){ return /13[.,]6/.test(logs(r)); } },
          { msg:"Tu utilises une boucle et pas `Math.max`", test:function(r){ return /\b(for|while)\s*\(/.test(r.sans) && !/Math\.max/.test(r.sans); } },
          { msg:"La moyenne utilise `scores.length`", test:function(r){ return /scores\.length/.test(r.sans); } }
        ],
        solution:
`const scores = [14, 8, 19, 11, 16];

// Trouve le plus grand score avec une boucle
let meilleur = scores[0];
let total = 0;
for (const s of scores) {
  if (s > meilleur) {
    meilleur = s;
  }
  total = total + s;
}
console.log("🏆 Meilleur score : " + meilleur);

// Calcule et affiche la moyenne
console.log("📊 Moyenne : " + total / scores.length);`,
        e:"Une seule boucle peut faire plusieurs choses à la fois : chercher le meilleur et additionner." },

      /* ================= Projet final ================= */
      { id:"projet-3", t:"projet", type:"projet", titre:"Ton projet : des boucles et des listes",
        contenu:[
          "🎉 Bravo, tu as terminé le module 3 ! Avec les boucles et les tableaux, tes programmes peuvent traiter des listes entières et répéter des milliers d’actions.",
          "🛠️ Choisis un projet, télécharge-le, et réalise-le dans **Visual Studio Code**.",
          "🧭 Missions dans l’ordre, puis défis : à toi de jouer !"
        ],
        projets:[
          { id:"generateur-de-chansons", emoji:"🎤", titre:"Le générateur de chansons folles",
            accroche:"Des listes de mots, une pincée de hasard… et des chansons (ou des poèmes) jamais entendus.",
            description:"Ton programme contient des tableaux de mots (sujets, actions, lieux, rimes…). Il pioche au hasard dans ces listes pour fabriquer des phrases, puis assemble des couplets et un refrain avec des boucles. Chaque exécution donne une chanson différente !",
            missions:[
              "Remplis les tableaux `sujets`, `actions` et `lieux` avec au moins **6 mots** chacun (tu peux en créer d’autres !).",
              "Écris une ligne de chanson en piochant un mot au hasard dans chaque tableau.",
              "Avec une boucle, fabrique un **couplet** de 4 lignes.",
              "Ajoute un **refrain** (toujours le même) et affiche la chanson : couplet, refrain, couplet, refrain.",
              "Affiche un titre de chanson tiré au hasard, et le nombre total de lignes."
            ],
            defis:[
              { n:1, texte:"Ajoute un tableau d’emojis et termine chaque ligne par un emoji au hasard." },
              { n:2, texte:"Numérote les couplets (« Couplet 1 », « Couplet 2 »…) avec une boucle autour de la boucle." },
              { n:2, texte:"Range chaque ligne fabriquée dans un tableau `chanson` avec `push`, puis affiche la chanson à la fin avec une boucle." },
              { n:3, texte:"Fais rimer ! Range des mots qui riment dans deux tableaux `rimesEnOn` et `rimesEnI`, et termine les lignes 1 et 2 par une rime en « on », les lignes 3 et 4 par une rime en « i »." }
            ],
            idees:[
              "Choisis un style : chanson de pirates 🏴‍☠️, rap, comptine, chanson d’amour pour ton chat…",
              "Chante la meilleure chanson générée devant ta classe !",
              "Change les couleurs dans `style.css` pour faire une scène de concert."
            ],
            fichiers:ProjetJs.console({
              titre:"Le générateur de chansons folles", emoji:"🎤", sousTitre:"Une chanson différente à chaque fois !",
              couleurs:{ fond:"#FFF5E1", principal:"#F3722C", ecran:"#1D1A39", ecranTexte:"#FFF0D9" },
              script:
`// 🎤 LE GÉNÉRATEUR DE CHANSONS FOLLES
// Clique sur 🔄 Relancer pour une nouvelle chanson !
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : remplis les listes (au moins 6 mots chacune)
const sujets = ["Mon chat", "La maîtresse", "Un dragon"];
const actions = ["danse le hip-hop", "mange des frites", "chante faux"];
const lieux = ["sur la lune", "dans la cantine", "sous la douche"];

// Pour piocher un mot au hasard dans une liste :
const sujet = sujets[Math.floor(Math.random() * sujets.length)];

// ✅ Mission 2 : une ligne de chanson
console.log("🎵 " + sujet + " …");

// ✅ Mission 3 : un couplet de 4 lignes, avec une boucle


// ✅ Mission 4 : le refrain
const refrain = "🎶 Et ça fait la la la, et ça fait li li li ! 🎶";
`
            }) },

          { id:"le-grand-tournoi", emoji:"🏆", titre:"Le grand tournoi",
            accroche:"Organise un tournoi (de jeux vidéo, de foot, de cuisine…) et calcule le classement.",
            description:"Ton programme gère un tournoi : les participants et leurs scores sont rangés dans des tableaux. Avec des boucles, il affiche tous les résultats, calcule le total, la moyenne, trouve le champion et la lanterne rouge, et annonce le podium.",
            missions:[
              "Choisis le thème de ton tournoi, et remplis les tableaux `joueurs` et `scores` (au moins **6 participants**). Le score de `joueurs[0]` est `scores[0]`, etc.",
              "Avec une boucle, affiche chaque participant avec son score.",
              "Calcule et affiche le **total** des points et la **moyenne**.",
              "Trouve le **champion** (le plus grand score) et affiche son nom.",
              "Compte combien de participants ont un score au-dessus de la moyenne."
            ],
            defis:[
              { n:1, texte:"Trouve aussi la lanterne rouge (le plus petit score) 🔴." },
              { n:2, texte:"Ajoute un tour bonus : chaque joueur gagne entre 0 et 5 points au hasard. Mets à jour les scores avec une boucle, puis affiche le nouveau classement." },
              { n:2, texte:"Affiche une barre de score en emojis pour chaque joueur : un ⭐ pour chaque tranche de 10 points (une boucle dans la boucle !)." },
              { n:3, texte:"Affiche le **podium** : le 1er, le 2e et le 3e. Indice : cherche le meilleur, retiens son indice, puis cherche le meilleur parmi les autres." }
            ],
            idees:[
              "Utilise les vrais scores d’un tournoi entre amis (ou de ta famille au Mölkky !).",
              "Ajoute un tableau des équipes ou des pays de chaque joueur, avec un drapeau.",
              "Change les couleurs dans `style.css` aux couleurs de ton équipe préférée."
            ],
            fichiers:ProjetJs.console({
              titre:"Le grand tournoi", emoji:"🏆", sousTitre:"Les résultats et le classement",
              couleurs:{ fond:"#E8F1FB", principal:"#1D4E89", ecran:"#0F2238", ecranTexte:"#E6F0FF" },
              script:
`// 🏆 LE GRAND TOURNOI
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : les participants et leurs scores (au moins 6 !)
// Le score de joueurs[0] est scores[0], celui de joueurs[1] est scores[1]…
const joueurs = ["Lina", "Tom", "Yasmine"];
const scores = [42, 35, 51];

console.log("🏆 Bienvenue au grand tournoi de " + "(ton thème ici)" + " !");

// ✅ Mission 2 : afficher chaque participant avec son score
for (let i = 0; i < joueurs.length; i++) {
  console.log(joueurs[i] + " : ");
}

// ✅ Mission 3 : le total et la moyenne


// ✅ Mission 4 : le champion


// ✅ Mission 5 : au-dessus de la moyenne
`
            }) },

          { id:"artiste-des-emojis", emoji:"🎨", titre:"L’artiste des emojis",
            accroche:"Des dessins, des motifs et des paysages… tracés par des boucles, en emojis !",
            description:"Ton programme dessine dans la console avec des emojis : des lignes, des carrés, des triangles, des damiers… Chaque dessin est fabriqué par des boucles qui construisent des lignes de texte, petit à petit. À la fin, compose ta propre œuvre !",
            missions:[
              "Dessine une ligne de 10 étoiles avec une boucle qui construit un texte (`ligne = ligne + \"⭐\"`).",
              "Dessine un **carré** de 5 × 5 : une boucle qui affiche 5 fois la même ligne.",
              "Dessine un **triangle** : la ligne n°1 a 1 emoji, la n°2 en a 2… jusqu’à 6.",
              "Dessine un **sapin** 🎄 : un triangle de 🟩, puis un tronc de 🟫.",
              "Range tes emojis préférés dans un tableau, et dessine une ligne où chaque case est tirée au hasard."
            ],
            defis:[
              { n:1, texte:"Dessine un triangle à l’envers (de 6 emojis jusqu’à 1)." },
              { n:2, texte:"Dessine un **damier** : ⬛ et ⬜ en alternance (indice : `(ligne + colonne) % 2`)." },
              { n:2, texte:"Dessine un paysage : un ciel 🟦, un soleil ☀️ à une position tirée au hasard, de l’herbe 🟩 et des fleurs 🌷 semées au hasard." },
              { n:3, texte:"Dessine une **pyramide centrée** : ajoute des espaces au début de chaque ligne pour qu’elle soit bien symétrique." }
            ],
            idees:[
              "Crée une galerie : un titre au-dessus de chaque dessin, et une signature d’artiste à la fin.",
              "Dessine le drapeau d’un pays, un smiley géant, ou le logo de ton jeu préféré.",
              "Change la couleur de fond de l’écran dans `style.css` (`--ecran`) pour mettre tes dessins en valeur."
            ],
            fichiers:ProjetJs.console({
              titre:"L'artiste des emojis", emoji:"🎨", sousTitre:"Ma galerie de dessins en boucles",
              couleurs:{ fond:"#FDF6EC", principal:"#E76F51", ecran:"#FFFFFF", ecranTexte:"#264653" },
              script:
`// 🎨 L'ARTISTE DES EMOJIS
// Lis le README.md pour connaître tes missions !

// ✅ Mission 1 : une ligne de 10 étoiles
let ligne = "";
for (let i = 0; i < 10; i++) {
  ligne = ligne + "⭐";
}
console.log(ligne);
console.log("");

// ✅ Mission 2 : un carré de 5 × 5


// ✅ Mission 3 : un triangle (1, 2, 3… emojis par ligne)


// ✅ Mission 4 : un sapin 🎄


// ✅ Mission 5 : une ligne d'emojis tirés au hasard dans un tableau
const mesEmojis = ["🌸", "🐝", "🍀", "🦋"];
`
            }) }
        ] }
    ],

    bilans: [
      { min:.84, texte:"Superbe ! Boucles et tableaux n’ont plus de secret pour toi. Réalise ton projet, puis apprends à ranger ton code en fonctions dans le module 4." },
      { min:.60, texte:"Bien joué ! Les boucles demandent un peu d’entraînement : refais les exercices ratés en suivant la valeur du compteur tour après tour." },
      { min:.36, texte:"Les boucles sont encore un peu floues. Ajoute des `console.log` dans les boucles des leçons pour voir le compteur changer à chaque tour." },
      { min:0,   texte:"Pas de panique, les boucles sont une étape importante. Reprends les leçons une par une, et exécute les exemples en changeant les nombres." }
    ]
  });
})();
