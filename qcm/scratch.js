/* QCM interactif : programmer avec Scratch.
   L’écran de Scratch, la scène et ses coordonnées, les scripts, les boucles, les événements, les
   conditions et les variables, puis un projet au choix à ouvrir dans Scratch (fichier .sb3).
   Les blocs dessinés et les jeux sont dans js/scratch-jeux.js, les projets dans js/projets-scratch.js. */
QCM.ajouter({
  id: "scratch",
  titre: "Programmer avec Scratch",
  resume: "Emboîte des blocs pour faire bouger, parler et dessiner un chat : séquences, boucles, événements, conditions et variables, puis un vrai projet à finir dans Scratch.",
  intro: [
    "🐱 Scratch est un langage de programmation où l’on emboîte des blocs de couleur, comme des briques. Dans ce cours, tu vas découvrir ses blocs un par un, et les essayer tout de suite sur une petite scène.",
    "🏁 Chaque bloc commence par une leçon avec un jeu ou un atelier, puis viennent des questions. À la fin, tu choisis un projet parmi trois (un jeu d’adresse, un labyrinthe ou une histoire animée) et tu le termines dans Scratch."
  ],

  themes: [
    { id:"decouvrir",  nom:"Découvrir Scratch",               note:"🐱 Les sprites, la scène, les blocs et l’écran de Scratch." },
    { id:"scene",      nom:"La scène et les coordonnées",     note:"📐 x, y et la direction : où est le sprite ?" },
    { id:"scripts",    nom:"Ton premier script",              note:"🧩 Un chapeau, des blocs dans l’ordre, et une animation." },
    { id:"boucles",    nom:"Répéter : les boucles",           note:"🔁 « répéter », « répéter indéfiniment » et des dessins au stylo." },
    { id:"evenements", nom:"Les événements",                  note:"⌨️ Les touches, les clics et les messages entre sprites." },
    { id:"conditions", nom:"Les conditions",                  note:"🤔 « si… alors… sinon » et les capteurs." },
    { id:"variables",  nom:"Les variables",                   note:"📦 Le score, le hasard et les questions." },
    { id:"projet",     nom:"Ton projet Scratch",              note:"🚀 Un projet au choix, à terminer dans Scratch." }
  ],

  questions: [
    /* ================= Découvrir Scratch ================= */
    { id:"decouvrir-l1", t:"decouvrir", type:"lecon", titre:"Scratch, c’est quoi ?",
      contenu:[
        "🐱 **Scratch** est un langage de programmation inventé pour apprendre à coder en s’amusant. Au lieu de taper des lignes de code, on **emboîte des blocs** de couleur, comme des briques de LEGO.",
        "🌍 Il a été créé au MIT, une université américaine, et il est gratuit : on l’utilise dans le navigateur, sur **scratch.mit.edu**, ou avec l’application Scratch. Des millions de jeunes y partagent leurs jeux, leurs histoires et leurs animations.",
        "🎭 Un projet Scratch ressemble à une pièce de théâtre : la **scène** est le décor, les **sprites** (on dit aussi « lutins ») sont les acteurs, et les **scripts** sont leurs rôles : ce que chaque sprite doit faire.",
        "🧩 Chaque bloc donne un ordre. On les emboîte dans la zone des scripts, et l’ordinateur les exécute **de haut en bas**. Voici un tout petit script :",
        { scratch:"evenement: quand 🏁 est cliqué\nmouvement: avancer de (10) pas\napparence: dire [Bonjour !] pendant (2) secondes" },
        "🗺️ Avant d’écrire ton premier programme, découvre l’écran de Scratch : retrouve chaque partie dans la maquette ci-dessous."
      ],
      titreInteractif:"🗺️ L’écran de Scratch",
      interactif:function(zone, signaler){ ScratchJeux.interface(zone, signaler); },
      essais:[
        { texte:"Trouve la **scène**, la **zone des scripts** et la **palette des blocs**.",
          test:function(e){ return e.trouvees.has("scene") && e.trouvees.has("scripts") && e.trouvees.has("palette"); } },
        { texte:"Trouve toutes les parties de l’écran.", test:function(e){ return e.fini; } },
        "Ensuite, ouvre scratch.mit.edu et clique sur **Créer** : retrouves-tu les mêmes parties ?"
      ],
      lien:"https://scratch.mit.edu/ideas" },

    { id:"decouvrir-1", t:"decouvrir", q:"Dans Scratch, comment s’appellent les personnages et les objets qui bougent sur la scène ?",
      r:["Des sprites (ou lutins)", "Des scripts", "Des blocs", "Des arrière-plans"], b:0,
      e:"Les sprites sont les acteurs du projet. Les scripts sont ce qu’ils font, et l’arrière-plan est le décor de la scène." },

    { id:"decouvrir-2", t:"decouvrir", q:"Comment écrit-on un programme dans Scratch ?",
      r:["En emboîtant des blocs, comme des briques", "En tapant du texte en anglais", "En dessinant le programme à la souris", "En parlant à l’ordinateur"], b:0,
      e:"Chaque bloc est un ordre. On les fait glisser depuis la palette et on les emboîte dans la zone des scripts." },

    { id:"decouvrir-3", t:"decouvrir", q:"À quoi sert le drapeau vert 🏁 ?",
      r:["À lancer le programme", "À arrêter le programme", "À enregistrer le projet", "À ajouter un sprite"], b:0,
      e:"Le drapeau vert lance tous les scripts qui commencent par « quand 🏁 est cliqué ». C’est le panneau rouge ⏹ qui arrête tout." },

    { id:"decouvrir-4", t:"decouvrir", q:"Pourquoi les blocs de Scratch ont-ils des couleurs différentes ?",
      r:["Chaque couleur est une catégorie : bleu pour le mouvement, violet pour l’apparence…",
         "Pour faire joli : la couleur ne veut rien dire",
         "La couleur montre si le bloc est cassé",
         "Chaque sprite a sa couleur de blocs"], b:0,
      e:"Mouvement en bleu, Apparence en violet, Événements en jaune, Contrôle en orange, Capteurs en bleu clair, Opérateurs en vert, Variables en orange foncé : on retrouve vite un bloc grâce à sa couleur." },

    { id:"decouvrir-5", t:"decouvrir", q:"Ton projet a deux sprites, un chat et un chien. Où sont rangés les scripts du chien ?",
      r:["Dans le chien : il faut cliquer sur lui dans la liste des sprites", "Avec ceux du chat", "Dans la scène", "Dans le menu Fichier"], b:0,
      e:"Chaque sprite a ses propres scripts. La zone des scripts montre seulement ceux du sprite sélectionné." },

    /* ================= La scène et les coordonnées ================= */
    { id:"scene-l1", t:"scene", type:"lecon", titre:"La scène et les coordonnées",
      contenu:[
        "📐 La scène est un rectangle de **480 pas** de large et de **360 pas** de haut. Pour dire où se trouve un sprite, Scratch utilise deux nombres : ses **coordonnées** `x` et `y`.",
        "↔️ **x** dit si le sprite est à gauche ou à droite : de **-240** (tout à gauche) à **240** (tout à droite).",
        "↕️ **y** dit s’il est en bas ou en haut : de **-180** (tout en bas) à **180** (tout en haut).",
        { code:
`               y: 180
                  ↑
  x: -240  ←   (0, 0)   →  x: 240
                  ↓
               y: -180` },
        "🎯 Le **centre** de la scène, c’est x: 0, y: 0. Un nombre négatif (avec un « - ») veut dire : à gauche du centre pour x, en dessous pour y. C’est comme à la bataille navale !",
        "🧭 Un sprite a aussi une **direction** : 90 vers la droite, -90 vers la gauche, 0 vers le haut et 180 vers le bas. Le bloc « avancer » le fait marcher dans sa direction.",
        { scratch:"mouvement: aller à x: (0) y: (0)\n\nmouvement: s’orienter à (90)\n\nmouvement: ajouter (10) à x\n\nmouvement: ajouter (10) à y" },
        "➕ « ajouter 10 à x » déplace le sprite un peu vers la droite (avec -10 : vers la gauche). « ajouter 10 à y » le monte un peu (avec -10 : il descend)."
      ],
      titreInteractif:"📐 Où est le chat ?",
      interactif:function(zone, signaler){ ScratchJeux.coordonnees(zone, signaler, { cibles:[{ x:150, y:100 }, { x:-180, y:-120 }, { x:-90, y:130 }] }); },
      essais:[
        { texte:"Place le chat tout au centre de la scène (x: 0, y: 0).",
          test:function(e){ return e.vus.some(function(p){ return Math.abs(p.x) <= 10 && Math.abs(p.y) <= 10; }); } },
        { texte:"Amène le chat dans le coin **en haut à droite** : regarde x et y.",
          test:function(e){ return e.vus.some(function(p){ return p.x >= 200 && p.y >= 140; }); } },
        { texte:"Amène-le dans le coin **en bas à gauche** : quel est le signe de x et de y ?",
          test:function(e){ return e.vus.some(function(p){ return p.x <= -200 && p.y <= -140; }); } },
        { texte:"Trouve les 3 étoiles cachées grâce à leurs coordonnées.", test:function(e){ return e.cibles >= 3; } }
      ] },

    { id:"scene-1", t:"scene", q:"Quelles sont les coordonnées du centre de la scène ?",
      r:["x: 0, y: 0", "x: 240, y: 180", "x: 100, y: 100", "x: -240, y: -180"], b:0,
      e:"Le centre est le point de départ des coordonnées : x: 0, y: 0. (240, 180), c’est le coin en haut à droite." },

    { id:"scene-2", t:"scene", q:"Un sprite est à x: 200, y: 0. Où est-il ?",
      r:["À droite, à mi-hauteur", "À gauche, à mi-hauteur", "En haut, au milieu", "En bas, au milieu"], b:0,
      e:"x: 200 est presque tout à droite (le bord est à 240), et y: 0 est à mi-hauteur." },

    { id:"scene-3", t:"scene", q:"Que fait ce bloc de mouvement ?", scratch:"mouvement: ajouter (-10) à y",
      r:["Il fait descendre le sprite de 10 pas", "Il fait monter le sprite de 10 pas", "Il déplace le sprite vers la gauche", "Rien : -10 n’existe pas"], b:0,
      e:"y, c’est la hauteur. Ajouter -10, c’est enlever 10 : le sprite descend." },

    { id:"scene-4", t:"scene", q:"Quelle direction fait regarder le sprite vers la gauche ?",
      r:["-90", "90", "0", "180"], b:0,
      e:"90 regarde à droite, -90 à gauche, 0 en haut et 180 en bas." },

    { id:"scene-5", t:"scene", niveau:"difficile", q:"Le chat est à x: 50, y: 20. On clique sur 🏁 : où arrive-t-il ?",
      scratch:"evenement: quand 🏁 est cliqué\nmouvement: ajouter (100) à x\nmouvement: ajouter (-50) à y",
      r:["x: 150, y: -30", "x: 100, y: -50", "x: 150, y: 70", "x: -50, y: 70"], b:0,
      e:"50 + 100 = 150 pour x, et 20 - 50 = -30 pour y : le chat va à droite et descend un peu sous le milieu." },

    /* ================= Ton premier script ================= */
    { id:"scripts-l1", t:"scripts", type:"lecon", titre:"Ton premier script",
      contenu:[
        "🎩 Un script commence toujours par un **bloc chapeau**, arrondi sur le dessus, de la catégorie **Événements** (en jaune). Il dit **quand** le script démarre : « quand 🏁 est cliqué », c’est quand on clique sur le drapeau vert.",
        "⬇️ Sous le chapeau, on emboîte les blocs qui seront exécutés **un par un, de haut en bas**. C’est une **séquence** : l’ordre compte ! « avancer » puis « tourner », ce n’est pas pareil que « tourner » puis « avancer ».",
        { scratch:"evenement: quand 🏁 est cliqué\nmouvement: aller à x: (-150) y: (0)\napparence: dire [Je pars !] pendant (1) secondes\nmouvement: avancer de (100) pas\napparence: costume suivant" },
        "💬 « dire Bonjour ! pendant 2 secondes » affiche une bulle. « attendre 1 secondes » fait une pause. « costume suivant » change l’apparence du sprite : en alternant deux costumes, on fait une **animation**, comme dans un dessin animé !",
        "⚡ L’ordinateur est très rapide : sans « attendre », plusieurs « avancer » d’affilée se font en un éclair et on ne voit que l’arrivée. Coche **🐢 Au ralenti** pour voir chaque bloc s’exécuter, l’un après l’autre.",
        "📍 Attention : comme dans Scratch, le chat **ne revient pas tout seul** à sa place quand tu relances le programme. Mets un bloc « aller à x: y: » au début du script, ou clique sur **↺ Chat au départ**."
      ],
      titreInteractif:"🧩 L’atelier : assemble ton script",
      interactif:function(zone, signaler){
        ScratchJeux.atelier(zone, signaler, {
          blocs:["avancer", "droite", "gauche", "allerA", "dire", "costume", "attendre"],
          depart:[{ b:"dire", v:["Bonjour !", 2] }],
          chat:{ x:-150, y:-40, dir:90 },
          etoile:{ x:120, y:110 }
        });
      },
      essais:[
        { texte:"Clique sur 🏁 : le chat dit « Bonjour ! ». Change le texte pour qu’il dise autre chose.",
          test:function(e){ return e.dits.some(function(t){ return t.trim() && t.trim() !== "Bonjour !"; }); } },
        { texte:"Amène le chat jusqu’à l’étoile ⭐, avec « avancer » et « tourner » (ou avec « aller à x: y: »).", test:function(e){ return e.etoile; } },
        { texte:"Anime le chat : « costume suivant » puis « attendre 0.5 secondes », au moins 4 fois de suite.", test:function(e){ return e.anime; } }
      ] },

    { id:"scripts-1", t:"scripts", q:"Quel bloc faut-il tout en haut d’un script pour qu’il démarre quand on clique sur 🏁 ?",
      r:["« quand 🏁 est cliqué »", "« avancer de 10 pas »", "« répéter indéfiniment »", "« attendre 1 secondes »"], b:0,
      e:"C’est un bloc chapeau de la catégorie Événements. Sans chapeau, un script ne démarre jamais tout seul." },

    { id:"scripts-2", t:"scripts", q:"Que fait ce script ?",
      scratch:"evenement: quand 🏁 est cliqué\napparence: dire [Bonjour !] pendant (2) secondes\nmouvement: avancer de (50) pas\napparence: dire [Au revoir !] pendant (2) secondes",
      r:["Il dit « Bonjour ! », puis avance, puis dit « Au revoir ! »",
         "Il fait tout en même temps",
         "Il dit d’abord « Au revoir ! »",
         "Il avance seulement"], b:0,
      e:"Les blocs s’exécutent l’un après l’autre, de haut en bas. « dire… pendant 2 secondes » attend la fin des 2 secondes avant de passer au bloc suivant." },

    { id:"scripts-3", t:"scripts", q:"Avec ce script, on ne voit pas le chat marcher : il apparaît directement plus loin. Pourquoi ?",
      scratch:"evenement: quand 🏁 est cliqué\nmouvement: avancer de (50) pas\nmouvement: avancer de (50) pas\nmouvement: avancer de (50) pas",
      r:["Les blocs s’exécutent si vite qu’on ne voit que l’arrivée",
         "Le chat ne peut pas avancer trois fois",
         "Il manque un bloc « stop »",
         "Il faudrait trois drapeaux"], b:0,
      e:"L’ordinateur exécute les trois blocs en un clin d’œil. Avec « attendre 0.3 secondes » entre chaque « avancer », on voit le chat se déplacer." },

    { id:"scripts-4", t:"scripts", q:"Comment fait-on une animation, comme un chat qui marche ?",
      r:["En alternant « costume suivant » et « attendre », plusieurs fois",
         "Avec un seul « costume suivant »",
         "En changeant d’arrière-plan",
         "En cliquant très vite sur le drapeau"], b:0,
      e:"Comme dans un dessin animé : on passe d’une image à l’autre, avec une petite pause entre deux images." },

    { id:"scripts-5", t:"scripts", q:"Ce script fait avancer le chat de 100 pas. Tu cliques une deuxième fois sur 🏁 : que se passe-t-il ?",
      scratch:"evenement: quand 🏁 est cliqué\nmouvement: avancer de (100) pas",
      r:["Il avance encore de 100 pas, à partir de là où il est",
         "Il revient d’abord à sa place de départ",
         "Il revient au centre de la scène",
         "Il ne bouge plus"], b:0,
      e:"Scratch ne remet jamais les sprites à leur place. C’est pour ça qu’on commence souvent un script par « aller à x: y: »." },

    /* ================= Les boucles ================= */
    { id:"boucles-l1", t:"boucles", type:"lecon", titre:"Répéter : les boucles",
      contenu:[
        "🔁 Pour dessiner un carré, il faut faire 4 fois : avancer de 100 pas, puis tourner de 90 degrés. On pourrait poser 8 blocs… ou utiliser une **boucle** : « répéter 4 fois » répète tout ce qu’il contient.",
        { scratch:"evenement: quand 🏁 est cliqué\nstylo: effacer tout\nstylo: stylo en position d’écriture\ncontrole: répéter (4) fois\n  mouvement: avancer de (100) pas\n  mouvement: tourner ↻ de (90) degrés\nstylo: relever le stylo" },
        "🧩 Le bloc « répéter » a la forme d’une **mâchoire** : les blocs placés **dedans** sont répétés, ceux placés **après** ne s’exécutent qu’une fois, quand la boucle est finie.",
        "♾️ « répéter indéfiniment » ne s’arrête jamais, jusqu’au clic sur ⏹. C’est le cœur de tous les jeux, qui vérifient sans arrêt les touches, le score, les collisions…",
        "✏️ Les blocs **Stylo** (en vert) font dessiner le sprite : avec « stylo en position d’écriture », il laisse un trait derrière lui. Dans Scratch, on les ajoute avec le bouton **Ajouter une extension**, tout en bas à gauche.",
        "📐 Le secret des formes : pour revenir à son point de départ, le chat doit faire **un tour complet**, soit 360 degrés. Pour un carré, 4 virages de 90° (4 × 90 = 360). Pour un triangle, 3 virages de… à toi de trouver !"
      ],
      titreInteractif:"✏️ L’atelier de dessin",
      interactif:function(zone, signaler){
        ScratchJeux.atelier(zone, signaler, {
          blocs:["avancer", "droite", "gauche", "repeter", "stylo", "relever", "effacer", "allerA", "costume", "attendre"],
          depart:[{ b:"effacer" }, { b:"stylo" }, { b:"repeter", v:[4], e:[{ b:"avancer", v:[100] }] }],
          chat:{ x:-50, y:60, dir:90 }
        });
      },
      essais:[
        { texte:"Complète le script pour dessiner un **carré** : il manque un virage dans la boucle ! (Clique dans la boucle, sous « avancer », pour y ajouter un bloc.)",
          test:function(e){ return e.formes.has("carre"); } },
        { texte:"Dessine un **triangle** : combien de fois répéter ? De combien tourner ?", test:function(e){ return e.formes.has("triangle"); } },
        { texte:"Dessine un **cercle** : répète 36 fois « avancer de 10 pas » et « tourner de 10 degrés ».", test:function(e){ return e.formes.has("cercle"); } },
        { texte:"Défi : une **étoile** à 5 branches (indice : 5 × 144 = 720, deux tours complets).", test:function(e){ return e.formes.has("etoile"); } },
        { texte:"Fais **marcher** le chat : répète 10 fois « avancer de 10 pas », « costume suivant » et « attendre 0.2 secondes ».", test:function(e){ return e.marche; } }
      ] },

    { id:"boucles-1", t:"boucles", q:"Combien de fois le chat dit-il « Miaou ! » ?",
      scratch:"evenement: quand 🏁 est cliqué\ncontrole: répéter (3) fois\n  apparence: dire [Miaou !] pendant (1) secondes",
      r:["3 fois", "1 fois", "4 fois", "Sans jamais s’arrêter"], b:0,
      e:"Le bloc « dire » est dans la boucle « répéter 3 fois » : il est exécuté 3 fois." },

    { id:"boucles-2", t:"boucles", q:"Ce script dessine une forme. Laquelle ?",
      scratch:"evenement: quand 🏁 est cliqué\nstylo: stylo en position d’écriture\ncontrole: répéter (3) fois\n  mouvement: avancer de (100) pas\n  mouvement: tourner ↻ de (120) degrés",
      r:["Un triangle", "Un carré", "Un cercle", "Une ligne droite"], b:0,
      e:"3 côtés et 3 virages de 120° : 3 × 120 = 360, un tour complet. C’est un triangle (équilatéral : ses 3 côtés sont égaux)." },

    { id:"boucles-3", t:"boucles", q:"Que fait le chat avec ce script ?",
      scratch:"evenement: quand 🏁 est cliqué\ncontrole: répéter indéfiniment\n  mouvement: avancer de (5) pas\n  mouvement: rebondir si le bord est atteint",
      r:["Il fait des allers-retours d’un bord à l’autre, sans jamais s’arrêter",
         "Il avance de 5 pas, puis s’arrête",
         "Il sort de la scène",
         "Rien : il manque un nombre dans « répéter »"], b:0,
      e:"« répéter indéfiniment » recommence sans fin : le chat avance un peu à chaque tour, et fait demi-tour quand il touche le bord." },

    { id:"boucles-4", t:"boucles", q:"Combien de fois le chat dit-il « Fini ! » ?",
      scratch:"evenement: quand 🏁 est cliqué\ncontrole: répéter (4) fois\n  mouvement: avancer de (10) pas\napparence: dire [Fini !] pendant (2) secondes",
      r:["1 fois, après la boucle", "4 fois", "0 fois", "5 fois"], b:0,
      e:"Le bloc « dire » est sous la boucle, pas dedans : il s’exécute une seule fois, quand les 4 tours sont terminés." },

    { id:"boucles-5", t:"boucles", niveau:"difficile", q:"Pour dessiner un hexagone (6 côtés égaux), de combien de degrés faut-il tourner à chaque côté ?",
      r:["60", "90", "6", "120"], b:0,
      e:"Le chat doit faire un tour complet en 6 virages : 360 ÷ 6 = 60 degrés." },

    /* ================= Les événements ================= */
    { id:"evenements-l1", t:"evenements", type:"lecon", titre:"Les événements",
      contenu:[
        "🎩 Le drapeau vert n’est pas le seul chapeau ! Les blocs jaunes de la catégorie **Événements** démarrent un script quand il se passe quelque chose :",
        { scratch:"evenement: quand 🏁 est cliqué\n\nevenement: quand la touche [espace v] est pressée\n\nevenement: quand ce sprite est cliqué\n\nevenement: quand je reçois [message1 v]" },
        "⌨️ « quand la touche flèche droite est pressée » : idéal pour diriger un personnage au clavier. « quand ce sprite est cliqué » : pour un bouton, ou un personnage qui réagit quand on le touche.",
        "🧵 Un sprite peut avoir **plusieurs scripts**, qui tournent **en même temps** : un pour chaque événement. On parle de programmation **événementielle**.",
        "📣 Les sprites peuvent aussi se parler avec des **messages** : « envoyer à tous » déclenche les scripts « quand je reçois » qui portent le même nom, chez tous les sprites. Ici, le premier script est celui du chat, le second celui du chien :",
        { scratch:"evenement: quand 🏁 est cliqué\napparence: dire [Salut le chien !] pendant (2) secondes\nevenement: envoyer à tous [à toi v]\n\nevenement: quand je reçois [à toi v]\napparence: dire [Ouaf ! Salut le chat !] pendant (2) secondes" }
      ],
      titreInteractif:"⌨️ Le chat au clavier",
      interactif:function(zone, signaler){ ScratchJeux.clavier(zone, signaler); },
      essais:[
        { texte:"Clique sur 🏁 : quel script s’éclaire ?", test:function(e){ return e.drapeau >= 1; } },
        { texte:"Appuie sur les flèches **←** et **→** (ou sur les boutons).", test:function(e){ return e.touches.has("gauche") && e.touches.has("droite"); } },
        { texte:"Clique sur le chat.", test:function(e){ return e.clics >= 1; } },
        { texte:"Pousse le chat jusqu’au bord de la scène.", test:function(e){ return e.bord >= 1; } },
        "Passe la souris sur le chat, sans cliquer : quel bloc lui fait dire « Ça chatouille ! » ?"
      ] },

    { id:"evenements-1", t:"evenements", q:"Quel bloc fait démarrer un script quand on appuie sur la barre d’espace ?",
      r:["« quand la touche espace est pressée »", "« quand 🏁 est cliqué »", "« quand ce sprite est cliqué »", "« attendre 1 secondes »"], b:0,
      e:"C’est un chapeau de la catégorie Événements. Dans son menu, on peut choisir n’importe quelle touche : espace, flèches, lettres…" },

    { id:"evenements-2", t:"evenements", q:"Un sprite peut-il avoir plusieurs scripts ?",
      r:["Oui, et ils peuvent même tourner en même temps", "Non, un seul script par sprite", "Oui, mais un seul peut avoir un chapeau", "Seule la scène peut en avoir plusieurs"], b:0,
      e:"Un sprite a souvent un script pour chaque événement : un pour le drapeau, un pour chaque touche, un pour les clics…" },

    { id:"evenements-3", t:"evenements", q:"Tu as lancé le programme, et maintenant tu cliques sur le chat. Que dit-il ?",
      scratch:"evenement: quand 🏁 est cliqué\napparence: dire [Bonjour !] pendant (2) secondes\n\nevenement: quand ce sprite est cliqué\napparence: dire [Arrête, ça chatouille !] pendant (2) secondes",
      r:["« Arrête, ça chatouille ! »", "« Bonjour ! »", "Les deux en même temps", "Rien du tout"], b:0,
      e:"Cliquer sur le chat déclenche le script « quand ce sprite est cliqué ». Le script du drapeau, lui, ne démarre qu’avec 🏁." },

    { id:"evenements-4", t:"evenements", q:"À quoi sert ce bloc ?", scratch:"evenement: envoyer à tous [début v]",
      r:["À démarrer les scripts « quand je reçois début », chez tous les sprites",
         "À envoyer un e-mail à tout le monde",
         "À publier le projet sur Internet",
         "À faire parler tous les sprites en même temps"], b:0,
      e:"Un message, c’est un signal : il permet à un sprite de dire aux autres « à vous ! ». C’est très pratique pour faire parler deux personnages chacun leur tour." },

    { id:"evenements-5", t:"evenements", niveau:"difficile", q:"Le chat envoie le message « à toi ». Le chien a un script « quand je reçois à vous ». Que se passe-t-il ?",
      r:["Le chien ne réagit pas : les deux messages doivent avoir exactement le même nom",
         "Le chien réagit quand même : c’est presque pareil",
         "Scratch corrige le nom tout seul",
         "C’est le chat qui reçoit le message"], b:0,
      e:"« à toi » et « à vous » sont deux messages différents. Astuce : crée le message une fois, puis choisis-le dans le menu des deux blocs." },

    /* ================= Les conditions ================= */
    { id:"conditions-l1", t:"conditions", type:"lecon", titre:"Si… alors : les conditions",
      contenu:[
        "🤔 Un programme doit souvent **prendre une décision** : si le chat touche la pomme, alors il gagne un point. Le bloc « si … alors » (en orange, catégorie Contrôle) exécute les blocs qu’il contient **seulement si** la condition est vraie.",
        { scratch:"controle: si <touche le [Pomme v] ?> alors\n  apparence: dire [Miam !] pendant (1) secondes" },
        "🔷 La condition est un bloc en forme d’**hexagone**, avec des pointes de chaque côté. Elle est soit **vraie**, soit **fausse** : « touche le bord ? », « touche espace pressée ? », « couleur … touchée ? » (en bleu clair, les **Capteurs**), ou « score > 10 » (en vert, les **Opérateurs**).",
        "↔️ « si … alors … sinon » choisit entre deux chemins : si la condition est vraie, les blocs du haut ; sinon, ceux du bas.",
        { scratch:"controle: si <touche [espace v] pressée ?> alors\n  apparence: dire [Tu appuies sur espace !]\ncontrole: sinon\n  apparence: dire [Appuie sur espace…]" },
        "⚠️ Le piège classique : un « si » regarde la condition **une seule fois**, au moment où il est exécuté. Pour surveiller tout le temps (une touche, une collision), il faut le mettre **dans un « répéter indéfiniment »** :",
        { scratch:"evenement: quand 🏁 est cliqué\ncontrole: répéter indéfiniment\n  mouvement: avancer de (5) pas\n  controle: si <touche le [bord v] ?> alors\n    apparence: dire [Aïe !] pendant (1) secondes\n    mouvement: tourner ↻ de (180) degrés" },
        "🎮 C’est le moteur de presque tous les jeux vidéo : une boucle qui tourne sans arrêt et qui, à chaque tour, vérifie ce qui se passe."
      ],
      essais:[
        "Retourne au jeu du chat au clavier (leçon précédente) : retrouve les deux « si » dans le script du drapeau. Pourquoi sont-ils dans « répéter indéfiniment » ?",
        "Dans Scratch, essaie le script ci-dessus avec le chat : enlève la boucle, et regarde ce qui change.",
        "Invente une condition : « si touche flèche haut pressée ? alors ajouter 10 à y »…"
      ] },

    { id:"conditions-1", t:"conditions", q:"Quelle forme a un bloc de condition, comme « touche le bord ? » ?",
      r:["Un hexagone, avec des pointes à gauche et à droite", "Un rectangle avec une encoche, comme « avancer »", "Un rond, comme une variable", "Une mâchoire, comme « répéter »"], b:0,
      e:"Les blocs hexagonaux répondent par vrai ou faux. Ils se glissent dans les trous de même forme : « si … alors », « attendre jusqu’à ce que… »." },

    { id:"conditions-2", t:"conditions", q:"Le chat touche le bord. Que dit-il ?",
      scratch:"controle: si <touche le [bord v] ?> alors\n  apparence: dire [Aïe !]\ncontrole: sinon\n  apparence: dire [Tout va bien.]",
      r:["« Aïe ! »", "« Tout va bien. »", "Les deux, l’un après l’autre", "Rien"], b:0,
      e:"La condition est vraie : seuls les blocs du haut sont exécutés. Les blocs sous « sinon » servent quand la condition est fausse." },

    { id:"conditions-3", t:"conditions", q:"La pomme tombe et touche le panier, mais le score ne bouge pas. Pourquoi ?",
      scratch:"evenement: quand 🏁 est cliqué\ncontrole: si <touche le [Panier v] ?> alors\n  variable: ajouter (1) à [score v]",
      r:["Le « si » n’est vérifié qu’une fois, au démarrage : il faut le mettre dans un « répéter indéfiniment »",
         "Il faut écrire « panier » en minuscules",
         "« si » ne marche qu’avec les touches du clavier",
         "Il manque un « sinon »"], b:0,
      e:"Au moment du clic sur 🏁, la pomme ne touche pas encore le panier : la condition est fausse, et le script est fini. Dans une boucle infinie, elle serait vérifiée sans arrêt." },

    { id:"conditions-4", t:"conditions", q:"Quel bloc peut-on glisser dans « si … alors » pour savoir si la touche espace est enfoncée ?",
      r:["« touche espace pressée ? »", "« quand la touche espace est pressée »", "« attendre 1 secondes »", "« dire espace »"], b:0,
      e:"« touche espace pressée ? » est un capteur hexagonal : il répond vrai ou faux. « quand la touche espace est pressée » est un chapeau : il démarre un script, il ne se glisse pas dans un « si »." },

    { id:"conditions-5", t:"conditions", niveau:"difficile", q:"Dans un labyrinthe aux murs bleus, que faut-il pour que la souris revienne au départ dès qu’elle touche un mur ?",
      r:["« si couleur bleu touchée ? alors aller à x: y: (le départ) », dans un « répéter indéfiniment »",
         "« si couleur bleu touchée ? alors aller à x: y: », tout seul sous le drapeau",
         "Un chapeau « quand la touche bleu est pressée »",
         "Repeindre les murs en rouge"], b:0,
      e:"Il faut vérifier la couleur à chaque instant, donc dans une boucle infinie. C’est justement l’un des projets de fin de cours !" },

    /* ================= Les variables ================= */
    { id:"variables-l1", t:"variables", type:"lecon", titre:"Les variables : le score et le hasard",
      contenu:[
        "📦 Une **variable** est une boîte qui porte un nom et qui garde une valeur : le score, le nombre de vies, le temps qui reste… Cette valeur peut **changer** pendant le programme.",
        "🧡 Pour en créer une : catégorie **Variables** (en orange foncé), bouton **Créer une variable**, puis donne-lui un nom, par exemple `score`. Une petite boîte apparaît sur la scène et montre sa valeur.",
        { scratch:"variable: mettre [score v] à (0)\n\nvariable: ajouter (1) à [score v]\n\nvariable: {score}" },
        "🔁 « mettre score à 0 » **remplace** la valeur : on le fait au début du jeu, pour repartir de zéro. « ajouter 1 à score » l’**augmente** de 1 (avec -1, elle diminue : pratique pour les vies !). Et le bloc rond `score` donne sa valeur : on peut le glisser dans n’importe quelle case blanche.",
        "🎲 Les **Opérateurs** (en vert) calculent : « nombre aléatoire entre 1 et 10 » tire un nombre au hasard, « + » additionne, « > » compare…",
        "💬 Et « demander … et attendre » (Capteurs) pose une question : ce que le joueur tape est rangé dans le bloc `réponse`.",
        { scratch:"evenement: quand 🏁 est cliqué\ncapteur: demander [Comment t’appelles-tu ?] et attendre\napparence: dire {operateur:regrouper [Bonjour ] et {capteur:réponse}} pendant (2) secondes" },
        "🎯 À toi : attrape le chat ci-dessous en cliquant dessus, et regarde la variable changer."
      ],
      titreInteractif:"🎯 Attrape le chat",
      interactif:function(zone, signaler){ ScratchJeux.score(zone, signaler); },
      essais:[
        { texte:"Attrape le chat 3 fois : que fait la boîte `score` ?", test:function(e){ return e.maxi >= 3; } },
        { texte:"Atteins 10 points : que dit le chat ?", test:function(e){ return e.maxi >= 10; } },
        { texte:"Clique sur 🏁 : que devient le score ? Quel bloc fait ça ?", test:function(e){ return e.remisApres; } }
      ] },

    { id:"variables-1", t:"variables", q:"Qu’est-ce qu’une variable ?",
      r:["Une boîte avec un nom, qui garde une valeur qui peut changer", "Un sprite qui change de couleur", "Un bloc qui fait varier la taille", "Un arrière-plan"], b:0,
      e:"Une variable garde une valeur en mémoire : un score, des vies, un prénom… On peut la lire et la changer pendant le programme." },

    { id:"variables-2", t:"variables", q:"Que vaut le score après ce script ?",
      scratch:"evenement: quand 🏁 est cliqué\nvariable: mettre [score v] à (0)\nvariable: ajouter (10) à [score v]\nvariable: ajouter (-3) à [score v]",
      r:["7", "10", "13", "-3"], b:0,
      e:"0, puis 0 + 10 = 10, puis 10 - 3 = 7." },

    { id:"variables-3", t:"variables", q:"Pourquoi met-on « mettre score à 0 » juste sous le drapeau vert ?",
      r:["Pour que chaque partie recommence à zéro", "Pour effacer la variable", "Parce qu’une variable ne marche pas sans", "Pour cacher le score"], b:0,
      e:"Sans lui, le score de la partie précédente resterait : Scratch garde la valeur des variables d’une partie à l’autre." },

    { id:"variables-4", t:"variables", q:"Que fait ce bloc d’opérateur ?", scratch:"operateur: {operateur:nombre aléatoire entre (1) et (6)}",
      r:["Il tire un nombre au hasard entre 1 et 6, comme un dé", "Il compte de 1 à 6", "Il donne toujours 6", "Il additionne 1 et 6"], b:0,
      e:"À chaque fois, il donne un nombre entier au hasard entre 1 et 6 (1 et 6 compris). On l’utilise pour qu’un jeu ne soit jamais pareil." },

    { id:"variables-5", t:"variables", q:"Que dit le chat ?",
      scratch:"evenement: quand 🏁 est cliqué\nvariable: mettre [score v] à (3)\ncontrole: si <{score} > (2)> alors\n  apparence: dire [Gagné !] pendant (2) secondes\ncontrole: sinon\n  apparence: dire [Perdu !] pendant (2) secondes",
      r:["« Gagné ! »", "« Perdu ! »", "« 3 »", "Rien"], b:0,
      e:"Le score vaut 3, et 3 > 2 est vrai : ce sont les blocs du haut qui sont exécutés." },

    { id:"variables-6", t:"variables", niveau:"difficile", q:"Que vaut « vies » à la fin de ce script ?",
      scratch:"evenement: quand 🏁 est cliqué\nvariable: mettre [vies v] à (3)\ncontrole: répéter (2) fois\n  variable: ajouter (-1) à [vies v]",
      r:["1", "3", "2", "-2"], b:0,
      e:"3, puis 2 au premier tour de boucle, puis 1 au second." },

    /* ================= Projet ================= */
    { id:"projet-1", t:"projet", type:"projet", titre:"Ton projet Scratch : à toi de jouer !",
      contenu:[
        "🎉 Bravo, tu as terminé le cours ! Tu sais faire bouger les sprites, répéter, réagir aux touches, prendre des décisions et compter avec des variables.",
        "🛠️ Place à un vrai projet : choisis-en **un** parmi les trois ci-dessous (ou plusieurs !), télécharge le projet de départ, et termine-le dans **Scratch**. Les sprites et les décors sont déjà dessinés, et les premiers blocs sont posés.",
        "🧭 Chaque projet a des **missions** à suivre dans l’ordre, des coups de pouce si tu bloques, puis des **défis** de plus en plus difficiles. Il n’y a pas une seule bonne réponse : invente !"
      ],
      projets:[
        { id:"attrape-les-pommes", emoji:"🍎", titre:"Attrape les pommes",
          accroche:"Un jeu d’adresse : déplace le panier avec les flèches et attrape les pommes qui tombent.",
          description:"Les pommes tombent du haut de la scène : le joueur déplace le panier avec les flèches du clavier pour les attraper. Chaque pomme attrapée rapporte un point, compté dans la variable `score`. Tu vas utiliser tout le cours : des événements, une boucle infinie, des conditions, une variable et le hasard.",
          missions:[
            "Ouvre le projet et clique sur 🏁 : le panier se place en bas et la pomme en haut. Clique sur chaque sprite pour lire ses scripts.",
            "**Panier** : ajoute deux scripts : « quand la touche flèche droite est pressée → ajouter 20 à x » et « quand la touche flèche gauche est pressée → ajouter -20 à x ». Teste au clavier !",
            "**Pomme** : sous ses blocs, ajoute un « répéter indéfiniment » avec « ajouter -5 à y » dedans. La pomme tombe !",
            "Dans la même boucle, ajoute « si touche le Panier ? alors » avec dedans « ajouter 1 à score » et « aller à x: (nombre aléatoire entre -220 et 220) y: 170 » : une nouvelle pomme tombe d’ailleurs.",
            "Toujours dans la boucle : si la pomme arrive tout en bas (« si ordonnée y < -170 alors »), elle repart en haut, à un endroit au hasard. Le bloc « ordonnée y » est en bas de la catégorie Mouvement.",
            "Joue ! Combien de pommes arrives-tu à attraper ?"
          ],
          coupsDePouce:[
            { titre:"Le panier au clavier (dans le Panier)",
              blocs:"evenement: quand la touche [flèche droite v] est pressée\nmouvement: ajouter (20) à x\n\nevenement: quand la touche [flèche gauche v] est pressée\nmouvement: ajouter (-20) à x" },
            { titre:"La pomme qui tombe (dans la Pomme)",
              blocs:"evenement: quand 🏁 est cliqué\nvariable: mettre [score v] à (0)\nmouvement: aller à x: (0) y: (170)\ncontrole: répéter indéfiniment\n  mouvement: ajouter (-5) à y\n  controle: si <touche le [Panier v] ?> alors\n    variable: ajouter (1) à [score v]\n    mouvement: aller à x: {operateur:nombre aléatoire entre (-220) et (220)} y: (170)\n  controle: si <{mouvement:ordonnée y} < (-170)> alors\n    mouvement: aller à x: {operateur:nombre aléatoire entre (-220) et (220)} y: (170)" }
          ],
          defis:[
            { n:1, texte:"Change le décor, ou redessine le panier dans l’onglet **Costumes**." },
            { n:1, texte:"Joue un son quand on attrape une pomme (catégorie Son : « jouer le son … »)." },
            { n:2, texte:"Ajoute une variable `vies`, qui commence à 3 et perd 1 à chaque pomme ratée. À 0 : « dire Perdu ! » puis « stop tout »." },
            { n:2, texte:"Les pommes tombent de plus en plus vite : crée une variable `vitesse` et augmente-la à chaque pomme attrapée." },
            { n:3, texte:"Ajoute une bombe 💣 qui tombe aussi : si le panier la touche, la partie est finie." },
            { n:3, texte:"Ajoute un compte à rebours : 30 secondes pour attraper le plus de pommes possible (bloc « chronomètre » des Capteurs)." }
          ],
          idees:[
            "Remplace les pommes par des étoiles, des bonbons ou des flocons de neige.",
            "Fais dire « Record ! » au panier quand le score dépasse 20.",
            "Ajoute une musique de fond qui se répète indéfiniment."
          ],
          sb3:{
            variables:["score"],
            fonds:["verger"],
            lutins:[
              { nom:"Panier", costumes:["panier"], x:0, y:-140, scripts:[[["drapeau"], ["allerA", 0, -140]]] },
              { nom:"Pomme", costumes:["pomme"], x:0, y:170, scripts:[[["drapeau"], ["mettre", "score", 0], ["allerA", 0, 170]]] }
            ]
          } },

        { id:"labyrinthe", emoji:"🧀", titre:"Le labyrinthe de la souris",
          accroche:"Guide la souris jusqu’au fromage… sans toucher les murs !",
          description:"La souris part de la case verte, en haut à gauche, et doit atteindre le fromage, en bas à droite. Le joueur la dirige avec les flèches. Si elle touche un mur bleu, elle retourne au départ ! Tu vas utiliser des événements, les directions, une boucle infinie et des conditions (« couleur touchée ? », « touche le … ? »).",
          missions:[
            "Ouvre le projet et clique sur 🏁 : la souris se place sur la case verte, le fromage sur la case jaune.",
            "**Souris** : ajoute un script par flèche. Par exemple : « quand la touche flèche droite est pressée → s’orienter à 90 → avancer de 10 pas ». Pour la flèche haut, la direction est 0 ; pour le bas, 180 ; pour la gauche, -90.",
            "Sous le drapeau de la souris, ajoute un « répéter indéfiniment » avec dedans « si couleur … touchée ? alors aller à x: -210 y: 150 ». Pour choisir la couleur : clique sur la pastille de couleur du bloc, puis sur la pipette, puis sur un mur de la scène.",
            "Dans la même boucle : « si touche le Fromage ? alors » → « dire Gagné ! pendant 2 secondes » puis « stop tout ».",
            "Teste le labyrinthe jusqu’au fromage… sans tricher !"
          ],
          coupsDePouce:[
            { titre:"Les flèches (dans la Souris, un script par flèche)",
              blocs:"evenement: quand la touche [flèche droite v] est pressée\nmouvement: s’orienter à (90)\nmouvement: avancer de (10) pas\n\nevenement: quand la touche [flèche haut v] est pressée\nmouvement: s’orienter à (0)\nmouvement: avancer de (10) pas" },
            { titre:"Les murs et le fromage (dans la Souris)",
              blocs:"evenement: quand 🏁 est cliqué\nmouvement: aller à x: (-210) y: (150)\nmouvement: s’orienter à (90)\ncontrole: répéter indéfiniment\n  controle: si <couleur [🟦] touchée ?> alors\n    mouvement: aller à x: (-210) y: (150)\n  controle: si <touche le [Fromage v] ?> alors\n    apparence: dire [Gagné !] pendant (2) secondes\n    controle: stop [tout v]" }
          ],
          defis:[
            { n:1, texte:"Ajoute un son quand la souris touche un mur." },
            { n:1, texte:"Redessine le labyrinthe dans l’onglet **Arrière-plans** : garde la même couleur pour tous les murs !" },
            { n:2, texte:"Ajoute une variable `essais` qui compte combien de fois la souris a touché un mur." },
            { n:2, texte:"Ajoute un chat 🐱 qui fait des allers-retours dans un couloir. S’il touche la souris : retour au départ !" },
            { n:3, texte:"Crée un deuxième niveau : quand la souris atteint le fromage, bascule sur un nouvel arrière-plan avec un autre labyrinthe." },
            { n:3, texte:"Ajoute un chronomètre qui affiche le temps mis pour atteindre le fromage (« réinitialiser le chronomètre » et « chronomètre », dans les Capteurs)." }
          ],
          idees:[
            "Remplace la souris par un astronaute dans un vaisseau, ou par un poisson entre des coraux.",
            "Ajoute une clé à ramasser avant de pouvoir atteindre le fromage.",
            "Fais un labyrinthe aux couloirs très étroits, pour les champions."
          ],
          sb3:{
            fonds:["labyrinthe"],
            lutins:[
              { nom:"Souris", costumes:["souris"], x:-210, y:150, taille:80, scripts:[[["drapeau"], ["allerA", -210, 150], ["orienter", 90]]] },
              { nom:"Fromage", costumes:["fromage"], x:210, y:-150, scripts:[[["drapeau"], ["allerA", 210, -150]]] }
            ]
          } },

        { id:"histoire", emoji:"🎭", titre:"Raconte une histoire",
          accroche:"Une histoire animée : un chat et un robot discutent, partent dans l’espace… et te posent des questions.",
          description:"Tu es le metteur en scène ! Un chat et un robot se rencontrent dans un parc, se parlent chacun leur tour, puis partent dans l’espace. Le spectateur peut même répondre à leurs questions. Tu vas utiliser des séquences, « attendre », des messages, des costumes, des arrière-plans et « demander et attendre ».",
          missions:[
            "Ouvre le projet et clique sur 🏁 : le décor du parc s’affiche et le chat se présente.",
            "**Robot** : il doit répondre **après** le chat. Sous son drapeau, ajoute « attendre 2 secondes » puis « dire Bip bip ! Moi, c’est R2. pendant 2 secondes ».",
            "Écris un dialogue d’au moins 6 répliques, chacun son tour. Utilise « attendre » pour que les deux sprites ne parlent pas en même temps.",
            "Remplace les « attendre » par des messages : quand le chat a fini de parler, il fait « envoyer à tous à toi robot », et le robot répond dans un script « quand je reçois à toi robot ».",
            "Fais voyager les personnages : l’un d’eux dit « Allons dans l’espace ! », puis « basculer sur l’arrière-plan l’espace ».",
            "Anime-les : le chat et le robot ont chacun deux costumes. Fais-les changer de costume quand ils parlent (« costume suivant » et « attendre », dans un « répéter »)."
          ],
          coupsDePouce:[
            { titre:"Parler chacun son tour (le 1er script dans le Chat, le 2e dans le Robot)",
              blocs:"evenement: quand 🏁 est cliqué\nmouvement: aller à x: (-130) y: (-80)\napparence: dire [Bonjour ! Je m’appelle Moustache.] pendant (2) secondes\nevenement: envoyer à tous [à toi robot v]\n\nevenement: quand je reçois [à toi robot v]\napparence: dire [Bip bip ! Moi, c’est R2.] pendant (2) secondes" },
            { titre:"Poser une question au spectateur",
              blocs:"capteur: demander [Et toi, comment t’appelles-tu ?] et attendre\napparence: dire {operateur:regrouper [Enchanté, ] et {capteur:réponse}} pendant (2) secondes" },
            { titre:"Changer de décor",
              blocs:"evenement: quand je reçois [décollage v]\napparence: basculer sur l’arrière-plan [l’espace v]" }
          ],
          defis:[
            { n:1, texte:"Ajoute des sons : un miaulement pour le chat, des bips pour le robot." },
            { n:1, texte:"Au début, fais glisser le robot jusqu’au chat (« glisser en 1 secondes à x: y: »)." },
            { n:2, texte:"Le chat pose une question au spectateur (« demander … et attendre ») et lui répond en utilisant sa `réponse`." },
            { n:2, texte:"Ajoute un troisième personnage, choisi dans la bibliothèque de sprites de Scratch." },
            { n:3, texte:"Une histoire dont tu es le héros : « Veux-tu aller dans l’espace ? (oui ou non) ». Si la réponse = oui, on décolle ; sinon, on reste au parc." },
            { n:3, texte:"Ajoute un écran titre au début et un écran « Fin », avec des arrière-plans que tu dessines toi-même." }
          ],
          idees:[
            "Raconte une histoire vraie : ta journée, une sortie scolaire, une légende…",
            "Fais un quiz : le robot pose 3 questions et compte les bonnes réponses dans une variable.",
            "Dessine tes propres personnages dans l’onglet Costumes."
          ],
          sb3:{
            fonds:["parc", "espace"],
            scene:[[["drapeau"], ["fond", "parc"]]],
            lutins:[
              { nom:"Chat", costumes:["chat", "chat2"], x:-130, y:-80, scripts:[[["drapeau"], ["allerA", -130, -80], ["dire", "Bonjour ! Je m’appelle Moustache.", 2]]] },
              { nom:"Robot", costumes:["robot", "robot2"], x:130, y:-70, scripts:[[["drapeau"], ["allerA", 130, -70]]] }
            ]
          } }
      ] }
  ],

  bilans: [
    { min:.84, texte:"Bravo, tu penses déjà comme un programmeur ! Séquences, boucles, événements, conditions et variables : tu as tout ce qu’il faut pour inventer tes propres jeux. Passe au projet, puis découvre le module JavaScript 1 !" },
    { min:.60, texte:"Bien joué ! Rejoue avec l’atelier de dessin et le chat au clavier pour revoir les boucles et les événements, puis lance-toi dans un projet." },
    { min:.36, texte:"Certains blocs sont encore flous, et c’est normal. Reprends les leçons dans l’ordre, en essayant chaque atelier : en programmation, on apprend en essayant." },
    { min:0,   texte:"C’est un premier pas ! Reprends doucement la leçon « Ton premier script », et essaie l’atelier au ralenti 🐢 pour voir chaque bloc s’exécuter." }
  ]
});
