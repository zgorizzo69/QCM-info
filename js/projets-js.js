/* Fichiers des projets de fin de module JavaScript (à télécharger et à ouvrir dans Visual Studio Code).

   Un projet : { id, emoji, titre, accroche, description, missions:[…], defis:[{ n:1|2|3, texte }],
                 idees:[…], fichiers:{ "nom": contenu } }.
   ProjetJs.console({ titre, emoji, sousTitre, couleurs, script }) prépare les fichiers d’un projet
   « console » (modules 1 à 4) : la page affiche tout ce que le programme écrit avec console.log.
   ProjetJs.fichiers(projet, module) ajoute le README.md et renvoie la liste à mettre dans le .zip. */
const ProjetJs = (function(){
  const CONSOLE_ECRAN =
`/* console-ecran.js
   Ce fichier affiche sur la page tout ce que ton programme écrit avec console.log(),
   et les erreurs en rouge, avec le numéro de la ligne. Ensuite, il lance ton programme : script.js.
   👉 Tu n'as pas besoin de le modifier : ton code va dans script.js ! */
(function () {
  var ecran = document.getElementById("ecran");

  // Transforme une valeur en texte lisible : "texte", 12, [1, 2, 3]…
  function texte(valeur, dedans) {
    if (typeof valeur === "string") return dedans ? '"' + valeur + '"' : valeur;
    if (Array.isArray(valeur)) return "[" + valeur.map(function (v) { return texte(v, true); }).join(", ") + "]";
    if (typeof valeur === "function") return "ƒ " + (valeur.name || "anonyme") + "()";
    if (valeur && typeof valeur === "object") {
      try { return JSON.stringify(valeur); } catch (e) { return String(valeur); }
    }
    return String(valeur);
  }

  function ajouter(message, classe) {
    var ligne = document.createElement("div");
    ligne.className = "ligne " + (classe || "");
    ligne.textContent = message;
    ecran.appendChild(ligne);
    ecran.scrollTop = ecran.scrollHeight;
  }

  ["log", "info", "warn", "error"].forEach(function (type) {
    var original = console[type];
    console[type] = function () {
      original.apply(console, arguments);
      ajouter(Array.prototype.map.call(arguments, function (a) { return texte(a); }).join(" "), type);
    };
  });

  window.addEventListener("error", function (e) {
    if (!e.lineno) {
      ajouter("❌ Une erreur s'est produite. Pour voir laquelle et à quelle ligne : ouvre la console du navigateur (touche F12, onglet Console).", "erreur");
      return;
    }
    var fichier = (e.filename || "").split("/").pop() || "script.js";
    ajouter("❌ Erreur dans " + fichier + ", ligne " + e.lineno + " : " + e.message, "erreur");
  });

  var bouton = document.getElementById("relancer");
  if (bouton) bouton.addEventListener("click", function () { location.reload(); });

  // Lance ton programme une fois la page affichée (les questions de prompt() arrivent donc après).
  var programme = document.currentScript.getAttribute("data-programme") || "script.js";
  window.addEventListener("load", function () {
    setTimeout(function () {
      var script = document.createElement("script");
      script.src = programme;
      document.body.appendChild(script);
    }, 150);
  });
})();
`;

  function indexConsole(o){
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${o.titre}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>${o.emoji} ${o.titre}</h1>
    <p>${o.sousTitre}</p>
  </header>

  <main>
    <!-- Tout ce que ton programme écrit avec console.log() s'affiche ici -->
    <div id="ecran" class="ecran" aria-live="polite"></div>
    <button id="relancer" type="button">🔄 Relancer le programme</button>
  </main>

  <footer>Programme écrit par : <strong>ton prénom ici</strong></footer>

  <!-- console-ecran.js affiche tes console.log sur la page, puis lance script.js -->
  <script src="console-ecran.js" data-programme="script.js"></script>
</body>
</html>
`;
  }

  function styleConsole(c){
    return `/* 🎨 Les couleurs de ton projet : change-les pour personnaliser ta page !
   Tu peux écrire des noms de couleurs (tomato, gold, hotpink…) ou des codes (#FF8800). */
:root {
  --fond: ${c.fond};
  --principal: ${c.principal};
  --texte: ${c.texte || "#2B2118"};
  --ecran: ${c.ecran || "#1E1B2E"};
  --ecran-texte: ${c.ecranTexte || "#F5F1FF"};
}

body {
  margin: 0;
  padding: 24px 16px 48px;
  background: var(--fond);
  color: var(--texte);
  font-family: "Segoe UI", system-ui, sans-serif;
}

header, main, footer {
  max-width: 760px;
  margin: 0 auto;
}

h1 {
  margin: 0;
  color: var(--principal);
  font-size: 2.2rem;
}

/* L'écran où s'affichent tes console.log */
.ecran {
  margin: 20px 0 14px;
  padding: 18px 20px;
  min-height: 320px;
  background: var(--ecran);
  color: var(--ecran-texte);
  border-radius: 14px;
  font-family: Consolas, "Courier New", monospace;
  font-size: 1.05rem;
  line-height: 1.6;
  white-space: pre-wrap;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
}

.ligne.warn { color: #FFD54F; }
.ligne.erreur, .ligne.error { color: #FF8A80; font-weight: bold; }

button {
  font: inherit;
  font-weight: bold;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: var(--principal);
  color: white;
  cursor: pointer;
}

footer {
  margin-top: 28px;
  opacity: 0.7;
}
`;
  }

  function consoleProjet(o){
    return {
      "index.html": indexConsole(o),
      "style.css": styleConsole(o.couleurs),
      "console-ecran.js": CONSOLE_ECRAN,
      "script.js": o.script
    };
  }

  const ETOILES = ["", "⭐", "⭐⭐", "⭐⭐⭐"];

  const DEMARRER_CONSOLE = [
    "Décompresse le fichier `.zip` (clic droit → **Extraire tout**).",
    "Ouvre **Visual Studio Code**, puis **Fichier → Ouvrir le dossier…** et choisis le dossier du projet.",
    "Ouvre `script.js` : c’est là que tu écris ton programme ✍️.",
    "Ouvre `index.html` dans ton navigateur : double-clic sur le fichier dans le dossier du projet (ou clic droit → **Ouvrir avec** → ton navigateur).",
    "Après chaque modification : enregistre (**Ctrl + S**) dans Visual Studio Code, puis recharge la page dans le navigateur (**F5**).",
    "Tout ce que tu écris avec `console.log()` s’affiche sur la page. Une erreur ? Un message rouge apparaît : pour savoir laquelle et à quelle ligne, ouvre la console du navigateur avec **F12**, onglet **Console**."
  ];

  const DEMARRER_PAGE = [
    "Décompresse le fichier `.zip` (clic droit → **Extraire tout**).",
    "Ouvre **Visual Studio Code**, puis **Fichier → Ouvrir le dossier…** et choisis le dossier du projet.",
    "Ouvre `index.html` dans ton navigateur : double-clic sur le fichier dans le dossier du projet (ou clic droit → **Ouvrir avec** → ton navigateur).",
    "Ton JavaScript va dans `script.js`, la page dans `index.html` et la décoration dans `style.css`.",
    "Après chaque modification : enregistre (**Ctrl + S**) dans Visual Studio Code, puis recharge la page dans le navigateur (**F5**).",
    "Pour voir tes `console.log` et les erreurs : ouvre la console du navigateur avec **F12**, onglet **Console**."
  ];

  const ROLES = {
    "index.html": "la page web (le squelette en HTML)",
    "style.css": "les couleurs et la décoration : personnalise-les !",
    "script.js": "ton programme ✍️",
    "console-ecran.js": "affiche tes `console.log` sur la page (tu n’as pas besoin d’y toucher)",
    "README.md": "ce mode d’emploi"
  };

  function readme(p, module){
    const avecConsole = !!p.fichiers["console-ecran.js"];
    const noms = Object.keys(p.fichiers).concat("README.md");
    return [
      "# " + p.emoji + " " + p.titre,
      "",
      "> " + p.accroche,
      "",
      "Projet de fin de module : **" + module.titre + "**.",
      "",
      "## 🎯 Ton objectif",
      "",
      p.description,
      "",
      "## 🚀 Pour commencer, avec Visual Studio Code",
      "",
      (avecConsole ? DEMARRER_CONSOLE : DEMARRER_PAGE).map(function(t, k){ return (k + 1) + ". " + t; }).join("\n"),
      "",
      "## 📁 Les fichiers",
      "",
      noms.map(function(n){ return "- `" + n + "` : " + (ROLES[n] || "fichier du projet"); }).join("\n"),
      "",
      "## ✅ Les missions, dans l’ordre",
      "",
      p.missions.map(function(t, k){ return (k + 1) + ". " + t; }).join("\n"),
      "",
      "## 🏆 Les défis",
      "",
      "Quand les missions marchent, relève les défis : du plus facile ⭐ au plus difficile ⭐⭐⭐.",
      "",
      p.defis.map(function(d){ return "- " + ETOILES[d.n] + " " + d.texte; }).join("\n"),
      "",
      "## 🎨 Idées pour le rendre unique",
      "",
      p.idees.map(function(t){ return "- " + t; }).join("\n"),
      "",
      "## 📌 Aide-mémoire du module",
      "",
      "```js",
      module.aideMemoire.trim(),
      "```",
      "",
      "## 💡 Si ça ne marche pas",
      "",
      "- Ouvre la console du navigateur (**F12**, onglet **Console**) et lis le message d’erreur : il donne le **numéro de la ligne** où chercher.",
      "- Vérifie les guillemets `\"`, les parenthèses `( )` et les accolades `{ }` : chacune doit être fermée.",
      "- Les majuscules comptent : `score` et `Score` sont deux noms différents.",
      "- Avance petit à petit : écris quelques lignes, enregistre, teste, puis continue.",
      ""
    ].join("\n");
  }

  function fichiers(p, module){
    return Object.keys(p.fichiers).map(function(nom){ return { nom:nom, contenu:p.fichiers[nom] }; })
      .concat([{ nom:"README.md", contenu:readme(p, module) }]);
  }

  function demarrer(p){ return p.fichiers["console-ecran.js"] ? DEMARRER_CONSOLE : DEMARRER_PAGE; }

  return { console:consoleProjet, fichiers:fichiers, readme:readme, demarrer:demarrer, ETOILES:ETOILES };
})();
