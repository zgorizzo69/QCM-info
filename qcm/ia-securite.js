/* QCM : intelligence artificielle et sécurité en ligne (élèves de 12 à 13 ans).
   Les questions q1 à q18 viennent de qcm-ia-securite.json ; « niveau » reprend la difficulté indiquée
   dans ce fichier. Les leçons utilisent les petits jeux de js/ia-jeux.js. */
QCM.ajouter({
  id: "ia-securite",
  titre: "Intelligence artificielle et sécurité en ligne",
  resume: "Comment un LLM découpe, devine et invente, comment une IA dessine, et comment se protéger en ligne : des leçons avec des petits jeux, puis des questions.",
  intro: [
    "🤖 Comment une IA écrit-elle ses réponses ? Pourquoi invente-t-elle parfois ? Comment fabrique-t-elle une image ? Chaque bloc commence par une leçon avec un petit jeu, puis quelques questions.",
    "Une seule réponse est bonne à chaque fois. La bonne réponse s’affiche aussitôt, avec une explication. Choisis les blocs à passer, puis clique sur Commencer."
  ],

  themes: [
    { id:"ia",             nom:"L’IA et les LLM",                   note:"🤖 La grande famille de l’IA, et les 💬 LLM qui écrivent du texte." },
    { id:"tokens",         nom:"Les tokens",                        note:"✂️ Comment un LLM découpe les mots en morceaux… et en nombres." },
    { id:"devinette",      nom:"Le champion de la devinette",       note:"🎯 Le jeu du mot suivant : penser comme un LLM." },
    { id:"apprentissage",  nom:"Comment un LLM apprend",            note:"📚 Entraîne toi-même un mini-modèle." },
    { id:"inference",      nom:"L’inférence : écrire une réponse",  note:"✍️ Token après token, avec un peu de hasard." },
    { id:"hallucinations", nom:"Hallucinations et bons réflexes",   note:"🤥 Vrai ou inventé ? Et comment se protéger." },
    { id:"images",         nom:"Créer des images : la diffusion",   note:"🎨 Du bruit au chat, étape par étape." },
    { id:"securite",       nom:"Sécurité en ligne",                 note:"🔐 Mots de passe, arnaques, harcèlement et deepfakes." },
    { id:"verification",   nom:"Vérifier l’information",            note:"🔎 Croiser les sources et repérer les fausses informations." }
  ],

  questions: [
    /* ================= L’IA et les LLM ================= */
    { id:"ia-l1", t:"ia", type:"lecon", titre:"L’IA et les LLM, c’est pareil ?",
      contenu:[
        "🤖 L’**intelligence artificielle** (IA), c’est une grande famille de programmes qui **apprennent à partir d’exemples** pour faire des choses qu’on croyait réservées aux humains : reconnaître un visage 📸, conseiller une vidéo 🎬, conduire une voiture 🚗, jouer aux échecs ♟️, dessiner une image 🎨… ou écrire du texte 💬.",
        "💬 Un **LLM** (Large Language Model, en français **grand modèle de langage**) est **une sorte d’IA** parmi d’autres : celle qui lit et écrit du **texte**. ChatGPT, Claude, Gemini ou Le Chat sont des assistants construits autour d’un LLM.",
        "⚽ Pense au sport : le football est un sport, mais tous les sports ne sont pas du football. De la même façon, **tous les LLM sont des IA, mais toutes les IA ne sont pas des LLM**.",
        { code:
`🤖 Intelligence artificielle (la grande famille)
 ├── 📸 reconnaître des images (visages, panneaux…)
 ├── 🎬 recommander (vidéos, musiques…)
 ├── 🎨 créer des images (diffusion)
 ├── ♟️ jouer (échecs, jeux vidéo…)
 └── 💬 LLM : lire et écrire du texte
        └── 🦾 agent : un LLM qui peut aussi utiliser des outils` },
        "🦾 Un **agent**, c’est un LLM à qui on a donné des « mains » : en plus d’écrire, il peut utiliser des outils, comme chercher sur internet, remplir un formulaire ou envoyer un message."
      ],
      titreInteractif:"🧩 À toi de trier",
      interactif:function(zone, signaler){ IAJeux.trier(zone, signaler); },
      essais:[
        { texte:"Classe les 8 exemples.", test:function(e){ return e.classes === e.total; } },
        { texte:"Obtiens au moins 6 bonnes réponses.", test:function(e){ return e.justes >= 6; } }
      ] },

    { id:"q1", t:"ia", niveau:"facile", q:"Que veut dire LLM ?",
      r:["Logiciel Libre Multimédia",
         "Grand modèle de langage (Large Language Model)",
         "Lecteur Logique de Mémoire",
         "Langage Local Machine"], b:1,
      e:"LLM signifie Large Language Model, c’est-à-dire un grand modèle de langage, entraîné à travailler sur du texte." },

    { id:"q3", t:"ia", niveau:"moyen", q:"Quelle phrase est exacte ?",
      r:["Tous les LLM sont des IA, mais toutes les IA ne sont pas des LLM",
         "IA et LLM sont deux mots pour la même chose",
         "Toutes les IA sont des LLM",
         "Un LLM contient plusieurs IA à l’intérieur"], b:0,
      e:"L’IA est la grande famille (reconnaissance de visage, recommandations, voiture autonome…) ; le LLM n’en est qu’un type, spécialisé dans le texte." },

    { id:"q7", t:"ia", niveau:"difficile", q:"Quelle est la différence entre un LLM et un agent ?",
      r:["L’agent est plus rapide que le LLM",
         "L’agent peut utiliser des outils et agir, le LLM se contente d’écrire",
         "L’agent fonctionne sans électricité",
         "Il n’y a aucune différence"], b:1,
      e:"Le LLM est un cerveau qui parle ; l’agent est le même cerveau avec des « mains » : il peut chercher sur Internet, remplir un formulaire, envoyer un message." },

    /* ================= Les tokens ================= */
    { id:"tokens-l1", t:"tokens", type:"lecon", titre:"Les tokens : des mots en morceaux",
      contenu:[
        "✂️ Un LLM ne lit pas les lettres une par une, ni toujours des mots entiers. Il découpe d’abord le texte en **tokens** : des morceaux de texte qu’il connaît bien.",
        "🧱 Les mots courants forment souvent **un seul token** : ` chat`, ` le`, ` bonjour`. Les mots rares ou longs sont coupés en plusieurs morceaux fréquents, comme des briques de LEGO : `anticonstitutionnellement` devient `anti` + `constit` + `ution` + `nelle` + `ment`.",
        "🔢 Chaque token a un **numéro** dans le vocabulaire du modèle, qui en compte souvent plus de 100 000. Le modèle ne voit jamais le texte : il ne voit que la liste des numéros ! Toute sa réponse est calculée sur ces nombres, puis retraduite en texte pour toi.",
        "📏 En moyenne, un token fait 3 ou 4 lettres. C’est pour ça qu’on mesure la longueur d’un texte pour une IA en tokens, pas en mots.",
        "🍓 Conséquence amusante : pendant longtemps, beaucoup de LLM se trompaient quand on leur demandait combien il y a de « r » dans `strawberry` (fraise, en anglais). Normal : ils voient `str` + `aw` + `berry`, pas les lettres une par une !",
        "⚠️ Le découpeur ci-dessous est une **imitation simplifiée** : chaque vrai modèle a son propre découpage, mais le principe est le même."
      ],
      titreInteractif:"✂️ Le découpeur de tokens",
      interactif:function(zone, signaler){ IAJeux.tokens(zone, signaler); },
      essais:[
        "Efface la phrase et écris ton prénom : en combien de tokens est-il coupé ?",
        { texte:"Écris le mot `strawberry` : le modèle voit-il les lettres une par une ?", test:function(e){ return /strawberry/i.test(e.texte); } },
        { texte:"Écris une phrase d’au moins 20 tokens.", test:function(e){ return e.nb >= 20; } },
        "Compare `chat` et `chats`, puis `ordinateur` et `ordinateurs` : un petit « s » peut ajouter un token."
      ] },

    { id:"tokens-1", t:"tokens", niveau:"facile", q:"Qu’est-ce qu’un token, pour un LLM ?",
      r:["Un morceau de texte (un mot entier ou un bout de mot) qu’il traite d’un bloc",
         "Une pièce de monnaie pour payer l’IA",
         "Une lettre de l’alphabet",
         "Un mot de passe secret"], b:0,
      e:"Le texte est découpé en tokens : les mots courants en un seul, les mots rares en plusieurs morceaux." },

    { id:"tokens-2", t:"tokens", niveau:"moyen", q:"Que « voit » vraiment un LLM quand tu lui écris ?",
      r:["Une liste de numéros, un par token",
         "Ton écriture, comme sur une feuille",
         "Les lettres une par une",
         "Une photo de ton écran"], b:0,
      e:"Chaque token est remplacé par son numéro dans le vocabulaire : le modèle ne fait que des calculs sur ces nombres." },

    { id:"tokens-3", t:"tokens", niveau:"difficile", q:"Pourquoi un LLM peut-il se tromper en comptant les lettres d’un mot ?",
      r:["Parce qu’il voit des morceaux de mots (tokens), pas les lettres une par une",
         "Parce qu’il ne sait pas compter jusqu’à dix",
         "Parce que les lettres sont effacées pour gagner de la place",
         "Parce qu’il ne lit que les majuscules"], b:0,
      e:"Dans `strawberry`, il voit `str`, `aw` et `berry` : les lettres sont cachées à l’intérieur des tokens." },

    /* ================= Le champion de la devinette ================= */
    { id:"devinette-l1", t:"devinette", type:"lecon", titre:"Le LLM, champion de la devinette",
      contenu:[
        "🎯 Un LLM est un **champion de la devinette**. Son seul talent : deviner le **token suivant** le plus probable, à partir de tout le texte qui précède.",
        "📱 Tu connais déjà ce principe : quand tu écris un message, ton téléphone te propose le mot suivant au-dessus du clavier. Un LLM fait la même chose, mais en **beaucoup** plus fort, car il a lu énormément de textes.",
        "📊 Pour chaque token possible, il calcule une **probabilité** : la chance que ce soit le bon. Après « Il était une… », le mot « fois » a une probabilité énorme, parce que c’est ce qu’on lit presque toujours après.",
        "⚠️ Attention : le modèle choisit le mot **probable**, pas le mot **vrai**. La plupart du temps, c’est le même. Mais pas toujours…",
        "🎮 À toi de jouer : devine le mot le plus probable, comme un LLM ! (Les pourcentages sont des exemples.)"
      ],
      titreInteractif:"🎯 Le jeu du mot suivant",
      interactif:function(zone, signaler){ IAJeux.devinette(zone, signaler); },
      essais:[
        { texte:"Joue les 7 manches.", test:function(e){ return e.faites >= 7; } },
        { texte:"Trouve le mot le plus probable au moins 5 fois.", test:function(e){ return e.trouvees >= 5; } }
      ] },

    { id:"q2", t:"devinette", niveau:"facile", q:"Comment un LLM écrit-il sa réponse ?",
      r:["Il recopie une réponse trouvée dans un livre",
         "Il devine le mot suivant le plus probable, encore et encore",
         "Un humain écrit la réponse à sa place en direct",
         "Il choisit une phrase au hasard dans une liste"], b:1,
      e:"Un LLM enchaîne les mots un par un en calculant à chaque fois le plus probable, comme les suggestions du clavier d’un téléphone, mais en beaucoup plus puissant." },

    { id:"devinette-1", t:"devinette", niveau:"moyen", q:"Après « Il était une… », pourquoi un LLM écrit-il « fois » ?",
      r:["Parce que c’est le mot qui suit le plus souvent ces mots dans les textes qu’il a lus",
         "Parce qu’il connaît toutes les histoires par cœur",
         "Parce qu’un humain le lui souffle",
         "Parce que « fois » est le mot le plus court"], b:0,
      e:"Le modèle ne se souvient pas d’une histoire précise : il a appris que « fois » est de loin le mot le plus probable à cet endroit." },

    /* ================= Comment un LLM apprend ================= */
    { id:"apprentissage-l1", t:"apprentissage", type:"lecon", titre:"Comment un LLM a-t-il appris ?",
      contenu:[
        "📚 **1. Lire, lire, lire.** Pour s’entraîner, le modèle « lit » une quantité gigantesque de textes : des sites web, des livres, des encyclopédies, du code… Des milliers de milliards de mots ! Il faudrait plus de 100 000 ans à un humain pour tout lire.",
        "🙈 **2. Jouer aux devinettes, et se corriger.** Pendant cette lecture, on lui cache le mot suivant, il essaie de le deviner, puis on lui montre le vrai mot. S’il s’est trompé, on modifie un tout petit peu ses milliards de **paramètres** : des boutons de réglage 🎛️ à l’intérieur du modèle. On recommence des milliards de fois, et ses devinettes deviennent excellentes.",
        "🧑‍🏫 **3. Apprendre à bien répondre.** Ensuite, des personnes lui montrent des exemples de bonnes réponses et notent les siennes, pour qu’il devienne utile, poli, et qu’il refuse les demandes dangereuses.",
        "🧠 Le modèle ne range pas les textes comme une bibliothèque : il retient des **régularités**, quels mots vont souvent ensemble. C’est pour ça qu’il répète ce qu’il a lu le plus souvent, même quand c’est faux ou injuste.",
        "📅 Ses connaissances s’arrêtent à la date de fin de son entraînement : il ne sait rien de ce qui s’est passé après, sauf si on lui donne un outil de recherche.",
        "⚡ Cet entraînement demande des milliers d’ordinateurs très puissants pendant des mois, et beaucoup d’électricité.",
        "🧪 Ci-dessous, un **mini-modèle** que tu entraînes toi-même : il compte simplement quel mot suit quel autre dans ses textes d’entraînement. Un vrai LLM est infiniment plus subtil, mais le principe est le même : **il devine d’après ce qu’il a lu**."
      ],
      titreInteractif:"🧪 Entraîne ton mini-modèle",
      interactif:function(zone, signaler){ IAJeux.entrainement(zone, signaler); },
      essais:[
        { texte:"Ajoute une phrase aux textes d’entraînement, et regarde les barres changer.", test:function(e){ return e.ajoutees >= 1; } },
        { texte:"Ajoute des phrases pour que, après « chat », le mot le plus probable devienne « danse ».",
          test:function(e){ return e.meilleur("chat") === "danse"; } },
        "Dans « Après le mot », tape un mot que le modèle n’a jamais lu : que se passe-t-il ?"
      ] },

    { id:"apprentissage-1", t:"apprentissage", niveau:"moyen", q:"Comment un LLM a-t-il appris à écrire ?",
      r:["En devinant le mot suivant dans d’énormes quantités de textes, et en se corrigeant à chaque erreur",
         "Un professeur lui a appris la grammaire pendant cinq ans",
         "On a recopié un dictionnaire dans sa mémoire",
         "Il a appris tout seul en discutant avec des enfants"], b:0,
      e:"L’entraînement est une gigantesque partie de devinettes : à chaque erreur, ses paramètres sont légèrement ajustés." },

    { id:"apprentissage-2", t:"apprentissage", niveau:"difficile", q:"On entraîne un modèle avec des textes qui disent presque tous que « les chats détestent les caresses ». Que va-t-il répondre ?",
      r:["Que les chats détestent les caresses, car c’est ce qu’il a lu le plus souvent",
         "La vérité, car il vérifie toujours",
         "Il refusera de parler des chats",
         "Il demandera l’avis d’un vétérinaire"], b:0,
      e:"Un modèle reproduit ce qu’il a lu. Si ses textes sont faux ou pleins de préjugés, ses réponses le seront aussi : on parle de **biais**." },

    { id:"apprentissage-3", t:"apprentissage", niveau:"moyen", q:"Que sont les « paramètres » d’un LLM ?",
      r:["Des milliards de petits réglages ajustés pendant l’entraînement",
         "Les options du menu Réglages de l’application",
         "La liste des questions qu’on lui a posées",
         "Les mots de passe des utilisateurs"], b:0,
      e:"Ce sont les boutons de réglage du modèle : c’est en eux qu’est stocké tout ce qu’il a appris." },

    /* ================= L’inférence ================= */
    { id:"inference-l1", t:"inference", type:"lecon", titre:"L’inférence : écrire une réponse",
      contenu:[
        "✍️ L’**inférence**, c’est le moment où le modèle, déjà entraîné, **s’en sert pour te répondre**. L’entraînement, c’est l’élève qui révise toute l’année ; l’inférence, c’est le jour du contrôle : il n’apprend plus rien, il utilise ce qu’il sait.",
        "🔁 Quand tu poses une question, le modèle répète une petite boucle :",
        { code:
`1. ✂️  découper ta question en tokens
2. 🧮  calculer la probabilité de chaque token possible pour la suite
3. 🎲  en choisir un, parmi les plus probables
4. ➕  l’ajouter au texte… et recommencer à l’étape 2
5. ■   s’arrêter quand il choisit le token « fin »` },
        "⌨️ C’est pour ça que les réponses s’affichent **petit à petit** à l’écran : le modèle écrit vraiment token après token, en relisant à chaque fois toute la conversation.",
        "🎲 À l’étape 3, il ne prend pas toujours le plus probable : un peu de **hasard** rend les réponses plus variées et plus naturelles. Ce réglage s’appelle la **température**. C’est pour ça que la même question peut donner deux réponses différentes !",
        "🧪 Ce mini-modèle a lu quelques petites histoires et ne regarde que les **deux derniers mots** ; un vrai LLM, lui, tient compte de toute la conversation."
      ],
      titreInteractif:"✍️ Fais écrire le modèle",
      interactif:function(zone, signaler){ IAJeux.inference(zone, signaler); },
      essais:[
        { texte:"Fais écrire une réponse complète en prenant toujours le plus probable.", test:function(e){ return e.finies >= 1; } },
        { texte:"Recommence avec le même début, mais laisse le hasard choisir : la réponse change-t-elle ?", test:function(e){ return e.hasard >= 3; } },
        { texte:"Écris trois réponses complètes, avec des débuts différents.", test:function(e){ return e.finies >= 3; } }
      ] },

    { id:"inference-1", t:"inference", niveau:"moyen", q:"Qu’est-ce que l’inférence ?",
      r:["Le moment où le modèle déjà entraîné calcule une réponse",
         "Le moment où le modèle lit tous les livres pour apprendre",
         "Une panne de l’IA",
         "Le nom de l’entreprise qui fabrique l’IA"], b:0,
      e:"Entraînement = apprendre (une fois, pendant des mois) ; inférence = s’en servir (à chaque question, en quelques secondes)." },

    { id:"inference-2", t:"inference", niveau:"moyen", q:"Pourquoi la même question peut-elle donner deux réponses différentes ?",
      r:["Parce que le modèle choisit ses mots avec un peu de hasard parmi les plus probables",
         "Parce qu’il a réappris entre les deux questions",
         "Parce qu’il s’ennuie et veut changer",
         "C’est impossible, la réponse est toujours la même"], b:0,
      e:"Ce petit hasard s’appelle la température : il rend les réponses plus variées." },

    { id:"inference-3", t:"inference", niveau:"facile", q:"Pourquoi la réponse d’un chatbot s’affiche-t-elle petit à petit ?",
      r:["Parce que le modèle l’écrit vraiment token après token",
         "Pour faire semblant de réfléchir",
         "Parce qu’internet est trop lent",
         "Parce qu’un humain tape la réponse"], b:0,
      e:"Chaque token est calculé, ajouté au texte, puis sert à calculer le suivant." },

    /* ================= Hallucinations et bons réflexes ================= */
    { id:"hallucinations-l1", t:"hallucinations", type:"lecon", titre:"Les hallucinations",
      contenu:[
        "🤥 Comme il choisit des mots **probables** et pas des mots **vrais**, un LLM peut inventer une réponse qui a l’air parfaite. On appelle ça une **hallucination**.",
        "🎭 Le modèle sait très bien **comment on écrit** une réponse sérieuse : un nom, une date, une ville, un ton assuré. Il peut donc fabriquer une réponse qui a toutes les apparences de la vérité… sans qu’aucun fait ne soit vrai.",
        "📚 Les hallucinations les plus fréquentes : des personnes ou des événements qui n’existent pas, des dates fausses, des livres ou des sites inventés, des citations que personne n’a jamais dites.",
        "🕵️ Regarde ces conversations : vrai ou inventé ?"
      ],
      titreInteractif:"🕵️ Vrai ou inventé ?",
      interactif:function(zone, signaler){ IAJeux.vraiOuInvente(zone, signaler); },
      essais:[
        { texte:"Réponds aux 5 conversations.", test:function(e){ return e.repondues >= 5; } },
        "Une réponse vraie et une réponse inventée avaient-elles l’air différentes ?"
      ] },

    { id:"hallucinations-l2", t:"hallucinations", type:"lecon", titre:"Les bons réflexes",
      contenu:[
        "🔎 **Une réponse sûre d’elle n’est pas forcément vraie.** Vérifie dans au moins deux sources fiables.",
        "🔒 **Ne donne jamais** ton nom complet, ton adresse, ton école, tes mots de passe ou des photos de toi.",
        "🧠 **Demande-lui de t’expliquer, pas de faire à ta place** : c’est toi qui dois comprendre.",
        "🧑‍🤝‍🧑 **Une IA n’est ni un ami, ni un professeur, ni un médecin.** Pour les vrais soucis, parle à un adulte de confiance."
      ] },

    { id:"q4", t:"hallucinations", niveau:"facile", q:"Qu’appelle-t-on une « hallucination » d’une IA ?",
      r:["Un bug qui fait planter l’application",
         "Une réponse inventée qui a l’air vraie",
         "Une image floue générée par erreur",
         "Un virus caché dans le logiciel"], b:1,
      e:"Comme le modèle choisit des mots probables et non des mots vérifiés, il peut inventer un nom, une date ou une source qui n’existent pas." },

    { id:"q5", t:"hallucinations", niveau:"moyen", q:"Une IA te répond avec beaucoup d’assurance. Qu’est-ce que cela prouve ?",
      r:["Que la réponse est vérifiée",
         "Rien du tout : il faut vérifier soi-même",
         "Qu’elle a lu la réponse sur un site officiel",
         "Qu’au moins trois IA sont d’accord"], b:1,
      e:"Le ton assuré fait partie de l’imitation du langage humain ; il n’indique en rien que l’information est juste." },

    { id:"q8", t:"hallucinations", niveau:"moyen", q:"Un devoir entièrement rédigé par une IA, c’est…",
      r:["Une bonne méthode pour gagner du temps",
         "De la triche, et en plus tu n’apprends rien",
         "Autorisé si tu changes deux ou trois mots",
         "Impossible à repérer par un professeur"], b:1,
      e:"L’IA peut t’aider à comprendre ou à t’entraîner, mais rendre son texte comme le tien est de la tricherie, et cela t’empêche d’apprendre." },

    { id:"hallucinations-1", t:"hallucinations", niveau:"facile", q:"Tu as un vrai souci (tu es harcelé, tu ne te sens pas bien). Vers qui te tourner ?",
      r:["Un adulte de confiance : un parent, un professeur, l’infirmière scolaire…",
         "Une IA, car elle répond tout de suite",
         "Personne, il faut se débrouiller seul",
         "Un inconnu rencontré en ligne"], b:0,
      e:"Une IA n’est ni un ami, ni un professeur, ni un médecin. Pour le harcèlement en ligne, il existe aussi le 3018, gratuit et anonyme." },

    /* ================= Créer des images : la diffusion ================= */
    { id:"images-l1", t:"images", type:"lecon", titre:"La diffusion : du bruit au chat",
      contenu:[
        "🎨 Les IA qui créent des images à partir d’une phrase ne sont pas des LLM : la plupart utilisent une autre méthode, la **diffusion**.",
        "📺 Tout commence par du **bruit** : une image remplie de points de couleur tirés au hasard, comme la neige d’une vieille télé. Aucune image n’est cachée dedans !",
        "✨ Ensuite, le modèle **enlève un peu de bruit**, en se demandant : « qu’est-ce qui ressemblerait un peu plus à un chat orange assis dans l’herbe ? ». Il recommence des dizaines de fois. D’abord apparaissent les grandes taches de couleur, puis les formes, et les détails en dernier.",
        "☁️ C’est un peu comme regarder un nuage et y voir un chat, puis le « nettoyer » petit à petit jusqu’à ce qu’il devienne vraiment un chat. Ou comme un sculpteur 🗿 qui enlève la pierre en trop.",
        "🏋️ **Comment l’a-t-il appris ?** On a fait l’inverse : on a pris des millions d’images avec leur description, et on les a abîmées en ajoutant du bruit, étape par étape. Le modèle s’est entraîné à retrouver l’image de départ, c’est-à-dire à **débruiter**.",
        "🎲 Comme le bruit de départ est tiré au hasard, la même phrase donne une **image différente** à chaque fois.",
        "⚠️ Ici, on triche un peu : le simulateur connaît déjà le chat d’arrivée, pour que tu voies le principe. Une vraie IA, elle, invente l’image à chaque étape ; avec un autre bruit, elle aurait dessiné un autre chat !"
      ],
      titreInteractif:"🎨 Du bruit au chat",
      interactif:function(zone, signaler){ IAJeux.diffusion(zone, signaler); },
      essais:[
        "Clique une seule fois sur « Enlever un peu de bruit » : vois-tu déjà quelque chose ?",
        { texte:"Arrête-toi à l’étape 3 ou 4 : devines-tu ce que ça va devenir ?", test:function(e){ return e.vues.has(3) || e.vues.has(4); } },
        { texte:"Enlève tout le bruit, jusqu’au chat.", test:function(e){ return e.etape === e.max; } },
        { texte:"Tire un nouveau bruit et recommence.", test:function(e){ return e.nouveaux >= 1; } },
        "Fais glisser le curseur vers la gauche : c’est ce qu’on fait pendant l’entraînement, on abîme l’image avec du bruit."
      ] },

    { id:"q6", t:"images", niveau:"moyen", q:"Comment une IA fabrique-t-elle une image de chat ?",
      r:["Elle colle ensemble des morceaux de photos de chats existantes",
         "Elle part d’une image de bruit au hasard et enlève le bruit petit à petit",
         "Elle dessine trait par trait comme un dessinateur",
         "Elle photographie un vrai chat sur Internet"], b:1,
      e:"C’est le principe de la diffusion : le modèle part d’un écran de points aléatoires et le transforme en image nette, étape après étape." },

    { id:"images-1", t:"images", niveau:"moyen", q:"Pourquoi la même phrase donne-t-elle une image différente à chaque fois ?",
      r:["Parce que chaque image part d’un bruit de départ tiré au hasard",
         "Parce que l’IA oublie la phrase en cours de route",
         "Parce qu’un humain retouche chaque image",
         "C’est faux : c’est toujours la même image"], b:0,
      e:"Un bruit de départ différent mène à une image différente, même avec la même description." },

    { id:"images-2", t:"images", niveau:"difficile", q:"Pendant son entraînement, qu’apprend un modèle de diffusion ?",
      r:["À enlever le bruit d’images abîmées, étape par étape",
         "À deviner le mot suivant d’une phrase",
         "À photographier des objets",
         "À reconnaître la voix des gens"], b:0,
      e:"On abîme des images avec du bruit, et il apprend à les restaurer. Pour créer, il part de bruit pur et le « restaure » vers ce que décrit la phrase." },

    /* ================= Sécurité en ligne ================= */
    { id:"q9", t:"securite", niveau:"facile", q:"Lequel de ces mots de passe est le plus solide ?",
      r:["123456",
         "Lucas2013",
         "Chaussette-Violette-42-Pluie",
         "motdepasse"], b:2,
      e:"Un bon mot de passe est long et imprévisible. Les prénoms, dates de naissance et suites de chiffres sont devinés en quelques secondes." },

    { id:"q10", t:"securite", niveau:"facile", q:"Tu reçois un message : « Tu as gagné un téléphone, clique ici et donne ton adresse ». Que fais-tu ?",
      r:["Je clique pour vérifier si c’est vrai",
         "Je ne clique pas, je ne réponds pas et j’en parle à un adulte",
         "Je donne seulement mon prénom et ma ville",
         "Je transfère le message à mes amis"], b:1,
      e:"C’est de l’hameçonnage (phishing) : le but est de récupérer tes informations ou d’installer un programme malveillant." },

    { id:"q11", t:"securite", niveau:"facile", q:"Qu’est-ce qu’il ne faut JAMAIS écrire à une IA ou à un inconnu en ligne ?",
      r:["Une question sur un exercice de maths",
         "Ton adresse, ton école, tes mots de passe",
         "Ton avis sur un film",
         "Le nom de ton jeu préféré"], b:1,
      e:"Tout ce que tu écris peut être enregistré ou lu par quelqu’un d’autre : garde pour toi ce qui permet de t’identifier ou de te localiser." },

    { id:"q12", t:"securite", niveau:"moyen", q:"Quelqu’un t’insulte et te menace tous les jours sur un réseau social. Quelle est la meilleure réaction ?",
      r:["Répondre et l’insulter à mon tour",
         "Faire des captures d’écran, bloquer, signaler et en parler à un adulte",
         "Ne rien faire et supprimer mon compte en secret",
         "Demander à mes amis d’aller l’insulter"], b:1,
      e:"Les captures servent de preuves. En France, le 3018 est le numéro gratuit dédié au harcèlement en ligne." },

    { id:"q13", t:"securite", niveau:"moyen", q:"Qu’est-ce que la double authentification (A2F) ?",
      r:["Avoir deux mots de passe différents",
         "Ajouter une deuxième preuve, par exemple un code reçu sur le téléphone",
         "Se connecter sur deux appareils en même temps",
         "Changer de mot de passe deux fois par an"], b:1,
      e:"Même si quelqu’un vole ton mot de passe, il lui manque le second code : c’est l’une des protections les plus efficaces." },

    { id:"q14", t:"securite", niveau:"difficile", q:"Tu vois une vidéo d’un chanteur connu qui promet de l’argent si tu t’inscris. Que peut-il se passer ?",
      r:["C’est forcément vrai, c’est une vidéo",
         "Ce peut être un deepfake : son visage et sa voix ont été imités par une IA",
         "Une vidéo ne peut pas être truquée",
         "Seules les photos peuvent être truquées"], b:1,
      e:"Les deepfakes permettent de faire dire n’importe quoi à n’importe qui. Une vidéo n’est plus une preuve à elle seule." },

    /* ================= Vérifier l’information ================= */
    { id:"q15", t:"verification", niveau:"facile", q:"Tu trouves une information surprenante en ligne. Que fais-tu en premier ?",
      r:["Je la partage tout de suite",
         "Je cherche la même information sur au moins deux autres sources fiables",
         "Je regarde combien de personnes l’ont aimée",
         "Je demande à une IA de confirmer, et je m’arrête là"], b:1,
      e:"Croiser les sources est le réflexe de base. Le nombre de « j’aime » ne mesure pas la vérité, et une IA peut se tromper comme le reste." },

    { id:"q16", t:"verification", niveau:"moyen", q:"Quel indice rend une page web plus digne de confiance ?",
      r:["Elle est en première position dans les résultats de recherche",
         "L’auteur est identifié, la date est indiquée et les sources sont citées",
         "Le site a beaucoup de publicités",
         "Le titre est écrit en majuscules avec des points d’exclamation"], b:1,
      e:"Auteur, date et sources sont les trois repères à chercher. Être premier sur un moteur de recherche n’est pas un gage de sérieux." },

    { id:"q17", t:"verification", niveau:"moyen", q:"Une IA te donne un titre de livre et le nom de son auteur pour appuyer sa réponse. Que fais-tu ?",
      r:["Je recopie la référence dans mon exposé",
         "Je vérifie que ce livre et cet auteur existent vraiment",
         "Je fais confiance, une IA ne peut pas inventer un titre",
         "Je demande une deuxième référence à la même IA"], b:1,
      e:"Les fausses références sont une hallucination très fréquente : le modèle produit un titre plausible, pas un titre vérifié." },

    { id:"q18", t:"verification", niveau:"difficile", q:"Pourquoi certaines personnes fabriquent-elles de fausses informations ?",
      r:["Uniquement pour s’amuser",
         "Pour faire des vues, gagner de l’argent ou influencer les opinions",
         "Par erreur, toujours sans le vouloir",
         "Parce que les moteurs de recherche les y obligent"], b:1,
      e:"Derrière une fausse information il y a presque toujours un intérêt : publicitaire, financier, politique ou idéologique. Se demander « à qui cela profite ? » est un bon réflexe." }
  ],

  bilans: [
    { min:.84, texte:"Tu as d’excellents réflexes. Tu sais comment fonctionne une IA, tu te méfies de ce qu’elle dit et tu repères la plupart des pièges : pense à aider ceux qui t’entourent." },
    { min:.60, texte:"Tu as de bons réflexes, avec quelques pièges qui pourraient encore te surprendre. Regarde les questions ratées ci-dessous." },
    { min:.36, texte:"Certaines bases sont là, mais plusieurs pièges courants pourraient te tromper. Rejoue les jeux des leçons : c’est exactement ce qu’on va travailler." },
    { min:0,   texte:"Beaucoup de ces notions sont nouvelles pour toi. Rien d’inquiétant : c’est le point de départ, pas une note." }
  ]
});
