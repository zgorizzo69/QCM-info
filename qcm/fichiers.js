/* QCM interactif : fichiers, dossiers et terminal.
   Les leçons et exercices utilisent le terminal simulé de js/terminal.js : ls, cd, pwd, mkdir,
   touch, cat, nano… Un bloc est consacré à l’édition de texte (raccourcis, éditeur de texte). */
(function(){
  // Contenu d’image, illisible comme texte : c’est ce que montre `cat` sur un fichier binaire.
  function charabia(graine, n){
    const signes = "ÿØàJFIF‰PNG¶ÞÆ§¤µ€œ¸¥»ª×¬þ®±Ã^@^Z";
    let s = graine === "png" ? "‰PNG\n^Z\n^@^@^@\rIHDR" : "ÿØÿà^@^PJFIF^@^A";
    for(let k = 0; k < n; k++) s += signes.charAt((k * 7 + n * 13 + k * k) % signes.length);
    return s + "\n";
  }

  // Le dossier personnel de départ, pour les leçons et la plupart des exercices.
  function maison(){
    return {
      "bienvenue.txt": "Bienvenue dans ton terminal ! 👋\nIci, tu peux tout essayer : rien ne peut casser.\n",
      Documents: {
        "notes.txt": "Réviser le binaire.\nFinir l’exposé sur les volcans.\n",
        vacances: {
          "programme.txt": "Lundi : plage\nMardi : randonnée\nMercredi : musée\n",
          photos: { "plage.jpg": charabia("jpg", 60), "coucher-de-soleil.jpg": charabia("jpg", 80) }
        }
      },
      Images: { "chat.png": charabia("png", 70), "dessin.png": charabia("png", 50) },
      Musique: {}
    };
  }

  function lignes(texte){ return (texte || "").split("\n").filter(function(l){ return l.trim(); }); }

  QCM.ajouter({
    id: "fichiers",
    titre: "Fichiers, dossiers et terminal",
    resume: "Comprendre comment l’ordinateur range ses fichiers, et les manipuler dans un vrai terminal d’entraînement : ls, cd, mkdir, touch, cat, nano.",
    intro: [
      "🗂️ Avant de créer des pages web, il faut savoir où les ranger ! Ici, tu découvres les fichiers 📄 (les feuilles) et les dossiers 📁 (les pochettes qui les rangent), puis le terminal : l’outil des développeurs pour tout faire au clavier.",
      "🛟 Le terminal est un simulateur : tu peux tout essayer sans rien casser. À côté, un explorateur te montre tes dossiers en direct."
    ],

    themes: [
      { id:"fichiers", nom:"Fichiers et dossiers",       note:"📄 Feuilles, 📁 pochettes, extensions et chemins." },
      { id:"terminal", nom:"Le terminal : pwd et ls",     note:"📍 Savoir où l’on est, et 👀 ce qu’il y a autour." },
      { id:"cd",       nom:"Se déplacer avec cd",         note:"🚪 Entrer dans un dossier, ⬆️ remonter, 🏠 revenir chez soi." },
      { id:"creer",    nom:"Créer : mkdir et touch",      note:"📁➕ Fabriquer des pochettes et 📄➕ des feuilles." },
      { id:"cat",      nom:"Lire un fichier : cat",       note:"📖 Afficher un fichier… et résoudre un escape game 🗝️." },
      { id:"editeur",  nom:"Éditer du texte",             note:"✏️ Éditeur de texte, traitement de texte et ⌨️ raccourcis clavier." },
      { id:"nano",     nom:"Écrire avec nano",            note:"💾 Un éditeur de texte dans le terminal." }
    ],

    questions: [
      /* ================= Fichiers et dossiers ================= */
      { id:"fichiers-l1", t:"fichiers", type:"lecon", titre:"Fichiers et dossiers",
        contenu:[
          "📄 Tout ce qui est enregistré dans un ordinateur, un texte, une photo, une musique ou un jeu, est rangé dans un **fichier**. Imagine une **feuille de papier** : on peut écrire dessus, dessiner, coller une photo… Un fichier, c’est pareil, mais en version numérique.",
          "📁 Pour ne pas avoir des milliers de feuilles en vrac sur le bureau, on les range dans des **pochettes** : ce sont les **dossiers** (on dit aussi **répertoires**). Une pochette « Maths » contient tes feuilles de maths, une pochette « Photos » tes photos.",
          "🗂️ Et une pochette peut contenir **d’autres pochettes** ! Dans ta pochette « Cours », tu peux avoir une pochette « Maths », une pochette « Français »… et dans « Maths », encore une pochette « Contrôles ». Ces pochettes rangées les unes dans les autres forment une **arborescence**, comme les branches d’un arbre 🌳 : le tronc, puis les grosses branches, puis les petites, et au bout les feuilles.",
          { code:
`📁 /                      ← la racine : la toute première pochette, qui contient tout
└── 📁 home
    └── 📁 eleve          ← ton dossier personnel, noté ~
        ├── 📁 Documents
        │   └── 📄 notes.txt
        ├── 📁 Images
        │   └── 🖼️ chat.png
        └── 📄 bienvenue.txt` },
          "🏷️ Un fichier a un **nom**, et souvent une **extension** : les quelques lettres après le dernier point. Elle indique le **type** du fichier, comme l’étiquette sur un pot de confiture dit ce qu’il y a dedans. Grâce à elle, l’ordinateur sait avec quel logiciel l’ouvrir : un `.jpg` s’ouvre dans la visionneuse de photos, un `.mp3` dans le lecteur de musique.",
          "Les extensions que tu croiseras le plus souvent :",
          { code:
`📝 .txt          texte brut, sans mise en forme (notes, listes)
📃 .docx .odt    document de traitement de texte (Word, LibreOffice)
📕 .pdf          document prêt à imprimer, qui s’affiche partout pareil
📊 .xlsx .ods    tableur (Excel, LibreOffice Calc)
🖼️ .jpg .jpeg    photo (compressée pour prendre peu de place)
🎨 .png          image, dessin ou capture d’écran (peut être transparente)
🎞️ .gif          petite image animée
🎵 .mp3 .wav     son, musique
🎬 .mp4 .avi     vidéo
📦 .zip          archive : plusieurs fichiers compressés dans un seul
⚙️ .exe          programme à lancer (Windows) : attention aux virus !
🌐 .html         page web
🎨 .css          style d’une page web (couleurs, tailles, placement)
⚡ .js           programme JavaScript, qui rend une page web interactive
🐍 .py           programme en Python` },
          "⚠️ Changer l’extension ne change pas le contenu : renommer `chat.png` en `chat.mp3` ne transforme pas l’image en musique ! C’est comme coller l’étiquette « confiture » sur un pot de moutarde 🫙 : l’ordinateur sera juste perdu. Et méfie-toi des fichiers comme `photo.jpg.exe` : malgré le `.jpg`, c’est un programme !",
          "🧭 Le **chemin** d’un fichier, c’est la liste des pochettes à ouvrir, une par une, pour l’atteindre, séparées par des `/` : `/home/eleve/Documents/notes.txt` veut dire « ouvre la pochette racine, puis home, puis eleve, puis Documents, et prends la feuille notes.txt ». C’est comme une adresse postale : pays, ville, rue, numéro 📮.",
          "🏠 Ton dossier personnel a un raccourci : `~` (le tilde). `~/Documents/notes.txt` désigne donc le même fichier. C’est ta chambre : l’endroit où sont rangées tes affaires à toi.",
          "🪟 Sur Windows, les chemins utilisent `\\` et commencent par une lettre de disque : `C:\\Users\\eleve\\Documents`. L’idée reste la même."
        ],
        lien:"https://www.w3schools.com/bash/bash_intro.php" },

      { id:"fichiers-1", t:"fichiers", q:"Dans `vacances.jpg`, que représente `.jpg` ?",
        r:["L’extension, qui indique le type de fichier : ici une image", "Le nom du dossier", "La taille du fichier", "Le nom de l’auteur"], b:0,
        e:"L’extension est l’étiquette du fichier 🏷️ : `.txt` pour du texte 📝, `.png` et `.jpg` pour des images 🖼️, `.mp3` pour du son 🎵, `.mp4` pour une vidéo 🎬, `.html` pour une page web 🌐. Elle dit à l’ordinateur quel logiciel utiliser pour l’ouvrir." },

      { id:"fichiers-2", t:"fichiers", q:"Que désigne le chemin `~/Images/chat.png` ?",
        r:["Le fichier chat.png, dans le dossier Images de ton dossier personnel", "Une adresse de site web", "Un dossier appelé chat.png", "Une commande à taper"], b:0,
        e:"🏠 `~` est ton dossier personnel ; on ouvre la pochette 📁 `Images`, et on y trouve la feuille 🖼️ `chat.png`." },

      { id:"fichiers-3", t:"fichiers", q:"Un dossier peut-il contenir d’autres dossiers ?",
        r:["Oui, autant qu’on veut : c’est ce qui forme l’arborescence", "Non, seulement des fichiers", "Oui, mais un seul", "Non, seulement des images"], b:0,
        e:"🗂️ Une pochette peut contenir d’autres pochettes, qui en contiennent d’autres… comme des poupées russes 🪆, à partir de la racine `/`." },

      /* ================= Le terminal : pwd et ls ================= */
      { id:"terminal-l1", t:"terminal", type:"lecon", titre:"Le terminal",
        contenu:[
          "💻 Le **terminal** (ou console) permet de parler à l’ordinateur en tapant des **commandes** au lieu de cliquer. C’est un peu comme envoyer des messages à l’ordinateur 💬 : tu écris un ordre, tu appuies sur **Entrée**, et il te répond. C’est l’outil préféré des développeurs, et celui des serveurs qui font tourner internet 🌍.",
          "🖱️ Avec la souris, tu ouvres les pochettes en double-cliquant dessus. ⌨️ Dans le terminal, tu fais exactement la même chose… mais en tapant des mots. Les pochettes et les feuilles sont les mêmes : l’explorateur à côté du terminal te les montre en direct.",
          "🚶 Dans le terminal, tu es toujours **quelque part** : dans une pochette précise, comme si tu te tenais dans une pièce de la maison. Toutes tes commandes s’appliquent là où tu te trouves.",
          "👉 Le terminal affiche une **invite** : `eleve@ordi:~$`. Elle dit qui tu es (`eleve`), sur quelle machine (`ordi`) et **où tu te trouves** (`~`, ton dossier personnel). Le `$` veut dire : « j’attends ta commande ».",
          "📍 `pwd` (print working directory : « affiche le dossier de travail ») affiche le chemin complet du dossier où tu es. C’est le panneau « Vous êtes ici » sur le plan d’un centre commercial.",
          "👀 `ls` (list : « liste ») affiche le contenu du dossier où tu es : c’est comme ouvrir la pochette pour regarder les feuilles et les pochettes qu’elle contient. `ls Documents` jette un œil dans la pochette Documents, sans y entrer. Les dossiers apparaissent en **bleu** 🔵, les fichiers en couleur normale.",
          "📏 `ls -l` affiche la liste en détail (l comme long) : la taille de chaque fichier, sa date de modification… Le `-l` est une **option** : un petit réglage qui modifie le comportement de la commande.",
          "⚡ Astuces : la touche **Tab** ↹ complète les noms toute seule (tape `ls Doc` puis Tab), et la flèche **↑** rappelle la commande précédente. Si tu te trompes de commande, pas de panique : le terminal répond simplement qu’il ne la connaît pas 🤷."
        ],
        terminal: maison(),
        essais:[
          { texte:"Tape `pwd` puis Entrée : où es-tu ?", test:function(e){ return e.a_tape(/^pwd$/); } },
          { texte:"Tape `ls` pour voir ce qu’il y a dans ton dossier personnel.", test:function(e){ return e.aListe("~"); } },
          { texte:"Tape `ls Documents` pour regarder dans le dossier Documents.", test:function(e){ return e.aListe("Documents"); } },
          { texte:"Tape `ls -l` : tu vois en plus la taille de chaque fichier.", test:function(e){ return e.a_tape(/^ls\s+-[a-z]*l/); } },
          { texte:"Tape une commande qui n’existe pas, par exemple `bonjour` : que répond le terminal ?", test:function(e){ return e.inconnues.length > 0; } }
        ],
        lien:"https://www.w3schools.com/bash/bash_ls.php" },

      { id:"terminal-1", t:"terminal", q:"Que fait la commande `ls` ?",
        r:["Elle affiche le contenu d’un dossier", "Elle efface un fichier", "Elle crée un dossier", "Elle éteint l’ordinateur"], b:0,
        e:"👀 `ls` vient de l’anglais list : lister. C’est comme ouvrir une pochette pour voir ce qu’elle contient." },

      { id:"terminal-2", t:"terminal", q:"L’invite affiche `eleve@ordi:~/Images$`. Où te trouves-tu ?",
        r:["Dans le dossier Images de ton dossier personnel", "Sur un site web appelé Images", "À la racine `/`", "Dans un fichier appelé Images"], b:0,
        e:"Ce qui est entre `:` et `$` est le dossier où tu te trouves : regarde toujours l’invite avant de taper une commande." },

      { id:"terminal-3", t:"terminal", q:"Quelle commande affiche le chemin complet du dossier où tu te trouves ?",
        r:["`pwd`", "`ls`", "`cd`", "`where`"], b:0,
        e:"📍 print working directory : « affiche le dossier de travail ». C’est le « Vous êtes ici » du terminal." },

      { id:"terminal-c1", t:"terminal", type:"terminal",
        q:"Explore ton dossier personnel : affiche le contenu du dossier `Images`, puis celui du dossier `Documents/vacances`.",
        fs: maison(),
        verifs:[
          { msg:"Tu as listé le contenu de `Images`", test:function(e){ return e.aListe("Images"); } },
          { msg:"Tu as listé le contenu de `Documents/vacances`", test:function(e){ return e.aListe("Documents/vacances"); } }
        ],
        solution:["ls Images", "ls Documents/vacances"],
        e:"🔭 Un chemin comme `Documents/vacances` permet de regarder dans une pochette rangée dans une autre, sans se déplacer." },

      /* ================= Se déplacer avec cd ================= */
      { id:"cd-l1", t:"cd", type:"lecon", titre:"Se déplacer avec cd",
        contenu:[
          "🚪 `cd` (change directory : « change de dossier ») te fait entrer dans un dossier : `cd Documents`. Avec la souris, c’est le double-clic sur la pochette 📁. L’invite change pour te rappeler où tu es : `eleve@ordi:~/Documents$`.",
          "⬆️ `cd ..` remonte d’un cran, dans le dossier **parent** : tu ressors de la pochette pour revenir dans celle qui la contient. Les deux points `..` veulent toujours dire « la pochette juste au-dessus ». (Et un seul point `.` veut dire « ici, la pochette où je suis ».)",
          "🏠 `cd` tout seul, ou `cd ~`, te ramène dans ton dossier personnel, où que tu sois : c’est le bouton « retour à la maison ».",
          "🏃 On peut traverser plusieurs pochettes d’un coup : `cd Documents/vacances` ouvre Documents, puis vacances, en une seule commande. Et `cd ../..` remonte de deux crans.",
          "🗺️ Un chemin qui commence par `/` part de la racine, tout en haut de l’arbre : c’est un chemin **absolu**, comme une adresse complète (« 12 rue des Lilas, Paris ») qui marche d’où que tu partes. Sinon, il part de là où tu es : c’est un chemin **relatif**, comme « la porte à gauche » 👈, qui dépend de l’endroit où tu te trouves.",
          "🚫 On ne peut entrer que dans une pochette : `cd` sur une feuille (un fichier) affiche une erreur. On ne rentre pas dans une feuille de papier !"
        ],
        terminal: maison(),
        essais:[
          { texte:"Entre dans Documents avec `cd Documents`, et regarde l’invite et l’explorateur.", test:function(e){ return e.aVisite("Documents"); } },
          { texte:"Remonte avec `cd ..`.", test:function(e){ return e.a_tape(/^cd\s+\.\.\/?$/); } },
          { texte:"Va directement dans `Documents/vacances/photos`, puis reviens d’un coup avec `cd`.",
            test:function(e){ return e.aVisite("Documents/vacances/photos") && e.dossier === "~"; } },
          { texte:"Va visiter la racine avec `cd /`, puis tape `ls`.", test:function(e){ return e.aListe("/"); } },
          { texte:"Essaie d’entrer dans un fichier : `cd bienvenue.txt`. Que se passe-t-il ?", test:function(e){ return e.a_tape(/^cd\s+bienvenue\.txt/); } }
        ],
        lien:"https://www.w3schools.com/bash/bash_cd.php" },

      { id:"cd-1", t:"cd", q:"Que fait `cd ..` ?",
        r:["Elle remonte dans le dossier parent", "Elle efface le dossier", "Elle va dans le dossier personnel", "Elle affiche deux points"], b:0,
        e:"⬆️ `..` désigne toujours le dossier juste au-dessus de celui où tu es : tu ressors de la pochette." },

      { id:"cd-2", t:"cd", q:"Tu es dans `~/Documents/vacances`. Où arrives-tu après `cd ../..` ?",
        r:["Dans ton dossier personnel `~`", "Dans `~/Documents`", "À la racine `/`", "Dans `~/Documents/vacances/photos`"], b:0,
        e:"⬆️⬆️ Chaque `..` remonte d’un cran : de 📁 vacances à 📁 Documents, puis de Documents à 🏠 `~`." },

      { id:"cd-3", t:"cd", q:"Quelle commande te ramène toujours dans ton dossier personnel ?",
        r:["`cd ~`", "`cd ..`", "`cd /`", "`ls ~`"], b:0,
        e:"🏠 `cd ~` (ou `cd` tout seul) te ramène chez toi. `cd /` mène à la racine, tout en haut de l’arborescence 🌳, et pas chez toi." },

      { id:"cd-c1", t:"cd", type:"terminal",
        q:"Va dans le dossier `photos` (il est dans `Documents/vacances`), affiche son contenu, puis reviens dans ton dossier personnel.",
        fs: maison(),
        verifs:[
          { msg:"Tu es entré dans `Documents/vacances/photos`", test:function(e){ return e.aVisite("Documents/vacances/photos"); } },
          { msg:"Tu as listé son contenu", test:function(e){ return e.aListe("Documents/vacances/photos"); } },
          { msg:"Puis tu es revenu dans ton dossier personnel `~`",
            test:function(e){ return e.aVisite("Documents/vacances/photos") && e.dossier === "~"; } }
        ],
        solution:["cd Documents/vacances/photos", "ls", "cd"],
        e:"👉 Regarde l’invite après chaque `cd` : elle te dit toujours où tu es." },

      /* ================= Créer : mkdir et touch ================= */
      { id:"creer-l1", t:"creer", type:"lecon", titre:"Créer des dossiers et des fichiers",
        contenu:[
          "📁➕ `mkdir` (make directory : « fabrique un dossier ») crée un dossier : `mkdir projets`. C’est prendre une **pochette neuve**, écrire « projets » dessus et la poser là où tu es.",
          "📄➕ `touch` crée un fichier vide : `touch idees.txt`. C’est poser une **feuille blanche** avec un titre, mais rien d’écrit dessus. Si le fichier existe déjà, `touch` ne l’abîme pas : il fait juste semblant de le toucher (d’où son nom 👆).",
          "✌️ On peut créer plusieurs choses d’un coup : `mkdir musique videos` crée deux pochettes, `touch a.txt b.txt` deux feuilles.",
          "⚠️ Attention aux espaces : pour le terminal, l’espace **sépare** les noms. `mkdir mes projets` crée donc **deux** dossiers, « mes » et « projets » ! On écrit plutôt `mes-projets`, avec un tiret, ou `mes_projets`. Évite aussi les accents et les majuscules dans les noms de fichiers de ton site : ça t’évitera des surprises.",
          "📥 On peut créer directement dans une autre pochette, sans y entrer : `touch projets/liste.txt` glisse une feuille blanche dans la pochette projets.",
          "🗑️ Pour effacer : `rm fichier` (remove) supprime un fichier, `rmdir dossier` une pochette **vide**. Attention : dans un terminal, il n’y a **pas de corbeille** ! `rm`, c’est la **broyeuse à papier** : ce qui est effacé est perdu pour de bon. Vérifie toujours deux fois avant d’appuyer sur Entrée."
        ],
        terminal: maison(),
        essais:[
          { texte:"Crée un dossier avec `mkdir test`, et regarde l’explorateur.", test:function(e){ return e.estDossier("test"); } },
          { texte:"Crée un fichier dedans : `touch test/bonjour.txt`.", test:function(e){ return e.estFichier("test/bonjour.txt"); } },
          { texte:"Tape `mkdir mes projets`, avec un espace : combien de dossiers sont créés ?", test:function(e){ return e.estDossier("mes") && e.estDossier("projets"); } },
          { texte:"Efface ton fichier avec `rm test/bonjour.txt`.", test:function(e){ return e.a_tape(/^rm\s/) && !e.existe("test/bonjour.txt"); } }
        ],
        lien:"https://www.w3schools.com/bash/bash_mkdir.php" },

      { id:"creer-1", t:"creer", q:"Quelle commande crée un dossier ?",
        r:["`mkdir`", "`touch`", "`ls`", "`cd`"], b:0,
        e:"📁➕ make directory : « fabrique un répertoire ». `touch`, lui, crée une feuille (un fichier), pas une pochette." },

      { id:"creer-2", t:"creer", q:"Que fait `touch notes.txt` si le fichier n’existe pas ?",
        r:["Elle crée un fichier vide nommé notes.txt", "Elle affiche une erreur", "Elle crée un dossier notes.txt", "Elle ouvre un éditeur de texte"], b:0,
        e:"📄 C’est une feuille blanche : pour écrire dessus, on utilisera un éditeur comme nano ✏️." },

      { id:"creer-3", t:"creer", q:"Que fait `mkdir mon dossier` ?",
        r:["Elle crée deux dossiers : « mon » et « dossier »", "Elle crée un dossier « mon dossier »", "Elle affiche une erreur", "Elle entre dans le dossier"], b:0,
        e:"⚠️ L’espace sépare les mots d’une commande. C’est pour ça que les développeurs évitent les espaces dans les noms de fichiers, et écrivent `mon-dossier`." },

      { id:"creer-c1", t:"creer", type:"terminal",
        q:"Prépare ton projet de site web : crée le dossier `mon-site` dans ton dossier personnel. Dedans, crée les fichiers `index.html` et `style.css`, et le dossier `images`.",
        fs: maison(),
        verifs:[
          { msg:"Le dossier `mon-site` existe",              test:function(e){ return e.estDossier("mon-site"); } },
          { msg:"Le fichier `mon-site/index.html` existe",   test:function(e){ return e.estFichier("mon-site/index.html"); } },
          { msg:"Le fichier `mon-site/style.css` existe",    test:function(e){ return e.estFichier("mon-site/style.css"); } },
          { msg:"Le dossier `mon-site/images` existe",       test:function(e){ return e.estDossier("mon-site/images"); } }
        ],
        solution:["mkdir mon-site", "cd mon-site", "touch index.html style.css", "mkdir images", "ls"],
        e:"🌐 C’est exactement l’organisation d’un vrai site : une pochette 📁 `mon-site` qui contient la page 📄 `index.html`, son style 🎨 `style.css`, et une pochette 📁 `images` pour les photos. Dans les cours suivants, tu rempliras `index.html` avec du HTML et `style.css` avec du CSS !" },

      /* ================= Lire un fichier : cat ================= */
      { id:"cat-l1", t:"cat", type:"lecon", titre:"Lire un fichier avec cat",
        contenu:[
          "📖 `cat` affiche le contenu d’un fichier texte : `cat bienvenue.txt`. C’est sortir la feuille de sa pochette et la lire à voix haute : le terminal recopie tout ce qui est écrit dessus.",
          "🔗 Avec plusieurs fichiers, `cat` les affiche à la suite : son nom vient de « concatenate », mettre bout à bout. Rien à voir avec les chats 🐱 !",
          "🖼️ Et sur une image ? Une image n’est pas du texte, mais une longue liste de nombres qui décrivent la couleur de chaque pixel (chaque petit point de l’écran). `cat` essaie quand même de les lire comme des lettres… et ça donne du charabia 🤯 ! C’est comme lire une partition de musique à voix haute sans savoir la déchiffrer.",
          "🧠 Les fichiers `.txt`, `.html`, `.css` ou `.js` sont du **texte** : `cat` sait les lire. Les `.png`, `.jpg`, `.mp3` ou `.pdf` sont des fichiers **binaires** : il faut un logiciel spécial pour les décoder (une visionneuse, un lecteur de musique…).",
          "✍️ Pour écrire vite une ligne dans un fichier : `echo \"Bonjour\" > salut.txt`. `echo` répète le texte, comme un écho 🗣️, et le `>` est une flèche qui l’envoie dans le fichier au lieu de l’afficher. ⚠️ Attention, il **remplace** tout ce que la feuille contenait : c’est comme effacer toute la feuille avant d’écrire !"
        ],
        terminal: maison(),
        essais:[
          { texte:"Affiche le message de bienvenue : `cat bienvenue.txt`.", test:function(e){ return e.aAffiche("bienvenue.txt"); } },
          { texte:"Affiche le programme des vacances, dans `Documents/vacances`.", test:function(e){ return e.aAffiche("Documents/vacances/programme.txt"); } },
          { texte:"Affiche une image : `cat Images/chat.png`. Bizarre, non ?", test:function(e){ return e.aAffiche("Images/chat.png"); } },
          { texte:"Crée un fichier avec `echo \"Coucou\" > salut.txt`, puis affiche-le avec `cat`.", test:function(e){ return e.aAffiche("salut.txt"); } }
        ],
        lien:"https://www.w3schools.com/bash/bash_cat.php" },

      { id:"cat-1", t:"cat", q:"Que fait `cat recette.txt` ?",
        r:["Elle affiche le contenu du fichier dans le terminal", "Elle supprime le fichier", "Elle ouvre une photo de chat", "Elle crée le fichier"], b:0,
        e:"📖 `cat` lit la feuille à voix haute dans le terminal. Rien à voir avec les chats 🐱 : cat vient de concatenate." },

      { id:"cat-2", t:"cat", q:"Pourquoi `cat photo.jpg` affiche-t-il des caractères incompréhensibles ?",
        r:["Parce qu’une image n’est pas du texte, mais des nombres qui décrivent des pixels", "Parce que la photo est abîmée", "Parce que cat ne marche qu’en anglais", "Parce qu’il faut d’abord taper ls"], b:0,
        e:"🖼️ Pour voir une image, il faut un logiciel qui sait la décoder et la dessiner : une visionneuse ou un navigateur. `cat`, lui, ne sait lire que du texte." },

      { id:"cat-c1", t:"cat", type:"terminal", etiquette:"Escape game 🗝️",
        q:"Un trésor est caché quelque part dans le dossier `enigme`. Lis les indices avec `cat`, explore avec `ls` et `cd`, et affiche le fichier du trésor !",
        fs:{
          "bienvenue.txt": "Le trésor t’attend dans le dossier enigme…\n",
          enigme:{
            "lisez-moi.txt": "Commence par lire indice1.txt.\n",
            "indice1.txt": "Bravo, premier indice trouvé !\nLe suivant est dans le dossier grenier.\n",
            grenier:{
              "vieux-carton.txt": "Rien ici… sauf un mot griffonné :\n« Regarde dans la malle. »\n",
              malle:{ "indice2.txt": "Presque ! Le trésor est dans le coffre,\njuste à côté de la malle.\n" },
              coffre:{ "tresor.txt": "🏆 TRÉSOR TROUVÉ ! 🏆\nTu maîtrises ls, cd et cat.\n" }
            },
            cave:{ "piege.txt": "Il fait noir ici… Ce n’est pas le bon chemin !\n" }
          }
        },
        verifs:[
          { msg:"Tu as lu le premier indice (`indice1.txt`)", test:function(e){ return e.aAffiche("enigme/indice1.txt"); } },
          { msg:"Tu as trouvé l’indice de la malle",          test:function(e){ return e.aAffiche("enigme/grenier/malle/indice2.txt"); } },
          { msg:"Tu as affiché le trésor !",                  test:function(e){ return e.aAffiche("enigme/grenier/coffre/tresor.txt"); } }
        ],
        solution:["cd enigme", "cat indice1.txt", "ls grenier", "cat grenier/vieux-carton.txt", "cat grenier/malle/indice2.txt", "cat grenier/coffre/tresor.txt"],
        e:"Tu sais maintenant te repérer dans une arborescence. Les pirates du code, ce sont les développeurs !" },

      /* ================= Éditer du texte ================= */
      { id:"editeur-l1", t:"editeur", type:"lecon", titre:"Éditer du texte",
        contenu:[
          "✏️ Un **éditeur de texte** sert à écrire du texte **brut** : seulement des caractères, sans mise en forme. Pas de gras, pas de police, pas d’images. C’est le **crayon à papier** sur une feuille blanche. C’est ce qu’il faut pour écrire du code, des notes ou des réglages (fichiers `.txt`, `.html`, `.css`, `.js`…).",
          "🧰 Quelques éditeurs : le Bloc-notes sur Windows, TextEdit sur Mac, `nano` dans un terminal, ou **VS Code**, l’éditeur préféré des développeurs, qui colore le code 🌈 pour le rendre lisible.",
          "🖌️ Un **traitement de texte** (Word, LibreOffice Writer, Google Docs) est différent : c’est l’atelier de mise en page, avec des polices, des couleurs, des images et des marges. Son fichier (`.docx`, `.odt`) contient plein d’informations cachées en plus du texte. Pour écrire du HTML, il ne convient pas : le navigateur serait perdu au milieu de ces informations 🤔 !",
          "⌨️ Les raccourcis clavier font gagner un temps fou, dans presque tous les logiciels. Le **presse-papiers** 📋, c’est une mémoire invisible où l’ordinateur garde ce que tu as copié ou coupé, en attendant que tu le colles :",
          { code:
`📋 Ctrl + C   copier            ↩️ Ctrl + Z   annuler
✂️ Ctrl + X   couper            ↪️ Ctrl + Y   rétablir
📌 Ctrl + V   coller            🔲 Ctrl + A   tout sélectionner
💾 Ctrl + S   enregistrer       🔍 Ctrl + F   rechercher` },
          "🖱️ Pour sélectionner au clavier, garde **Maj** ⇧ enfoncée et utilise les flèches. **Ctrl + flèche** saute d’un mot à l’autre, **Début** et **Fin** vont au début et à la fin de la ligne. Un double-clic sélectionne un mot, un triple-clic toute la ligne. Sur Mac, la touche **Cmd** remplace **Ctrl**."
        ],
        exemple:
`Ma liste de courses
- du pain
- des pommes
- du chocolat`,
        apercu:false,
        essais:[
          { texte:"Double-clique sur « pommes » pour le sélectionner, puis tape « bananes ».", test:function(doc, texte){ return /bananes/i.test(texte); } },
          { texte:"Sélectionne la ligne « - du chocolat » avec Maj + flèches, copie-la (Ctrl + C), puis colle-la deux fois en dessous (Ctrl + V).",
            test:function(doc, texte){ return (texte.match(/du chocolat/g) || []).length >= 3; } },
          { texte:"Coupe la ligne « - du pain » (Ctrl + X) et colle-la tout en bas de la liste.",
            test:function(doc, texte){ const l = lignes(texte); return l.length > 2 && /du pain/.test(l[l.length - 1]) && !/du pain/.test(l.slice(0, -1).join("\n")); } },
          "Sélectionne tout (Ctrl + A), efface tout… puis récupère ton texte avec Ctrl + Z !"
        ],
        lien:"https://www.w3schools.com/html/html_editors.asp" },

      { id:"editeur-1", t:"editeur", q:"Quel raccourci annule la dernière action ?",
        r:["Ctrl + Z", "Ctrl + C", "Ctrl + A", "Ctrl + S"], b:0,
        e:"Ctrl + Z est ton meilleur ami : on peut l’utiliser plusieurs fois de suite pour revenir en arrière." },

      { id:"editeur-2", t:"editeur", q:"Pour écrire une page HTML, quel logiciel choisir ?",
        r:["Un éditeur de texte, comme VS Code ou le Bloc-notes", "Un traitement de texte, comme Word", "Un tableur", "Un logiciel de dessin"], b:0,
        e:"Le navigateur doit lire exactement les caractères que tu as tapés, sans les informations de mise en page qu’ajoute un traitement de texte." },

      { id:"editeur-3", t:"editeur", q:"Quelle est la différence entre couper (Ctrl + X) et copier (Ctrl + C) ?",
        r:["Couper enlève le texte de sa place, copier le laisse où il est", "Aucune", "Couper efface le texte pour toujours", "Copier ne marche que sur les images"], b:0,
        e:"Dans les deux cas, le texte est gardé en mémoire (dans le presse-papiers) jusqu’à ce que tu le colles avec Ctrl + V." },

      { id:"editeur-c1", t:"editeur", type:"code", apercu:false,
        q:"Les étapes de cette recette sont dans le désordre, et il y a une erreur : il faut du **sucre**, pas du **sel** ! Remets les étapes dans l’ordre 1, 2, 3, 4 en coupant et collant les lignes, puis remplace « sel » par « sucre » partout.",
        depart:
`Recette des crêpes

3. Ajoute le lait petit à petit en mélangeant.
1. Verse la farine et le sel dans un saladier.
4. Fais cuire dans une poêle bien chaude.
2. Ajoute les œufs et une pincée de sel.`,
        verifs:[
          { msg:"Le titre « Recette des crêpes » est toujours en haut", test:function(doc, t){ return /recette des cr[eê]pes/i.test(lignes(t)[0] || ""); } },
          { msg:"Les quatre étapes sont toujours là",
            test:function(doc, t){ return [1, 2, 3, 4].every(function(n){ return new RegExp("^\\s*" + n + "\\.", "m").test(t); }); } },
          { msg:"Elles sont dans l’ordre 1, 2, 3, 4",
            test:function(doc, t){
              const pos = [1, 2, 3, 4].map(function(n){ const m = new RegExp("^\\s*" + n + "\\.", "m").exec(t); return m ? m.index : -1; });
              return pos.every(function(p, k){ return p >= 0 && (k === 0 || p > pos[k - 1]); });
            } },
          { msg:"Le mot « sel » a disparu", test:function(doc, t){ return !/\bsel\b/i.test(t); } },
          { msg:"« sucre » apparaît deux fois", test:function(doc, t){ return (t.match(/\bsucre\b/gi) || []).length >= 2; } }
        ],
        solution:
`Recette des crêpes

1. Verse la farine et le sucre dans un saladier.
2. Ajoute les œufs et une pincée de sucre.
3. Ajoute le lait petit à petit en mélangeant.
4. Fais cuire dans une poêle bien chaude.`,
        e:"Dans un long texte, Ctrl + F permet de retrouver chaque « sel » sans en oublier." },

      /* ================= Écrire avec nano ================= */
      { id:"nano-l1", t:"nano", type:"lecon", titre:"Écrire avec nano",
        contenu:[
          "✏️ `nano` est un éditeur de texte qui s’ouvre directement dans le terminal : `nano liste.txt`. Si `cat` sert à **lire** la feuille, `nano` te donne un **stylo** pour écrire dessus. Si le fichier n’existe pas encore, nano prend une feuille blanche, qui sera rangée dans la pochette quand tu l’enregistreras.",
          "⌨️ Tu écris ton texte normalement, avec les flèches pour te déplacer (la souris ne sert à rien ici). En bas, nano rappelle ses raccourcis : le signe `^` veut dire la touche **Ctrl**. `^X`, c’est donc Ctrl + X.",
          "💾 **Ctrl + O** enregistre (O comme output). 🚪 **Ctrl + X** quitte nano (X comme exit). Si tu quittes sans avoir enregistré, nano te prévient pour que tu ne perdes pas ton travail. (Dans un vrai nano, Ctrl + O te redemande le nom du fichier : appuie simplement sur Entrée.)",
          "🔎 Une fois sorti de nano, tu retrouves l’invite du terminal, et `cat liste.txt` permet de vérifier ce que contient le fichier.",
          "🆘 Ici, des boutons sous l’éditeur font la même chose que les raccourcis, si ton clavier ne coopère pas."
        ],
        terminal: maison(),
        essais:[
          { texte:"Ouvre nano avec `nano bonjour.txt`.", test:function(e){ return e.a_tape(/^nano\s+\S/); } },
          { texte:"Écris une phrase, enregistre avec Ctrl + O, puis quitte avec Ctrl + X.", test:function(e){ return e.enregistres.length > 0; } },
          { texte:"Vérifie ton fichier avec `cat bonjour.txt`.", test:function(e){ return e.enregistres.some(function(f){ return e.aAffiche(f); }); } },
          { texte:"Rouvre `notes.txt` (dans Documents) avec nano, ajoute une ligne, et enregistre.",
            test:function(e){ return lignes(e.contenu("Documents/notes.txt")).length > 2; } }
        ] },

      { id:"nano-1", t:"nano", q:"Dans nano, que veut dire `^X` en bas de l’écran ?",
        r:["Ctrl + X : quitter nano", "Taper la lettre X", "Supprimer le fichier X", "Multiplier deux nombres"], b:0,
        e:"Le `^` est une façon courte d’écrire la touche Ctrl." },

      { id:"nano-2", t:"nano", q:"Tu as écrit ton texte dans nano. Comment l’enregistrer ?",
        r:["Ctrl + O", "Ctrl + X tout de suite", "Fermer la fenêtre du terminal", "Taper le mot save"], b:0,
        e:"Ctrl + O enregistre ; dans les versions récentes de nano, Ctrl + S marche aussi." },

      { id:"nano-c1", t:"nano", type:"terminal",
        q:"Crée avec nano un fichier `courses.txt` qui contient ta liste de courses, avec au moins **trois** articles (un par ligne). Enregistre, quitte, puis affiche-le avec `cat`.",
        fs: maison(),
        verifs:[
          { msg:"Tu as ouvert nano",                         test:function(e){ return e.a_tape(/^nano\s+courses\.txt/); } },
          { msg:"`courses.txt` contient au moins trois lignes", test:function(e){ return lignes(e.contenu("courses.txt")).length >= 3; } },
          { msg:"Tu l’as affiché avec `cat`",                test:function(e){ return e.aAffiche("courses.txt"); } }
        ],
        solution:[{ nano:"courses.txt", texte:"pain\npommes\nchocolat\n" }, "cat courses.txt"],
        e:"Le même éditeur sert à modifier les réglages des serveurs, partout dans le monde." },

      { id:"nano-c2", t:"nano", type:"terminal", etiquette:"Mission finale 🚀",
        q:"Ta première page web, écrite dans le terminal ! Crée le dossier `mon-site`, puis, avec nano, le fichier `mon-site/index.html` qui contient au moins un titre `<h1>`. Vérifie-le avec `cat`.",
        fs: maison(),
        verifs:[
          { msg:"Le dossier `mon-site` existe", test:function(e){ return e.estDossier("mon-site"); } },
          { msg:"`mon-site/index.html` contient un titre `<h1>…</h1>`",
            test:function(e){ return /<h1[^>]*>[^<]+<\/h1>/i.test(e.contenu("mon-site/index.html") || ""); } },
          { msg:"Tu l’as affiché avec `cat`", test:function(e){ return e.aAffiche("mon-site/index.html"); } }
        ],
        solution:["mkdir mon-site", "cd mon-site", { nano:"index.html", texte:"<h1>Bienvenue sur mon site</h1>\n<p>Écrit avec nano !</p>\n" }, "cat index.html"],
        e:"Tu as créé une vraie page HTML, comme les développeurs. Le cours suivant t’apprend tout ce qu’on peut mettre dedans !" }
    ],

    bilans: [
      { min:.84, texte:"Bravo, le terminal n’a plus de secret pour toi ! Tu es prêt à créer et ranger les fichiers de ton futur site web." },
      { min:.60, texte:"Tu te débrouilles bien dans le terminal. Refais les exercices ratés : avec un peu d’entraînement, les commandes viennent toutes seules." },
      { min:.36, texte:"Les bases sont là, mais certaines commandes restent floues. Rejoue avec les terminaux des leçons : on ne peut rien casser !" },
      { min:0,   texte:"Le terminal, c’est tout nouveau pour toi, et c’est normal. Reprends les leçons une à une, et teste chaque commande." }
    ]
  });
})();
