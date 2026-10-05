/* QCM : l’intelligence artificielle et la sécurité en ligne. */
QCM.ajouter({
  id: "ia-securite",
  titre: "L’IA et ta sécurité en ligne",
  resume: "Comment marche une IA, comment s’en servir sans se faire piéger, et comment repérer arnaques, faux contenus et comptes piratés.",
  intro: [
    "Une seule réponse est bonne à chaque fois. La bonne réponse s’affiche aussitôt, avec une explication.",
    "Choisis les blocs à passer, puis clique sur Commencer. Ce n’est pas noté : le but est de repérer les bons réflexes."
  ],

  themes: [
    { id:"ia",       nom:"Comprendre l’IA",              note:"Ce qu’est vraiment une intelligence artificielle, et comment elle apprend." },
    { id:"usage",    nom:"Bien utiliser une IA",         note:"Vérifier ce qu’elle dit, et ne pas tout lui confier." },
    { id:"faux",     nom:"Vrai ou faux ?",               note:"Deepfakes, images générées et fausses informations." },
    { id:"arnaques", nom:"Hameçonnage et arnaques",      note:"Les messages piégés qui cherchent ton mot de passe ou ton argent." },
    { id:"proteger", nom:"Protéger ses comptes et ses appareils", note:"Les gestes simples qui bloquent la plupart des attaques." },
    { id:"reagir",   nom:"Réagir quand ça tourne mal",   note:"Harcèlement, chantage, compte piraté : qui prévenir, et quoi faire." }
  ],

  questions: [
    /* ---------- Comprendre l’IA ---------- */
    { id:"ia-1", t:"ia", q:"Une intelligence artificielle comme ChatGPT, c’est :",
      r:["Un programme informatique entraîné sur d’énormes quantités de textes",
         "Un robot conscient qui pense et ressent comme un humain",
         "Une équipe de personnes qui répondent depuis un bureau",
         "Une encyclopédie officielle qui ne se trompe jamais"], b:0,
      e:"Elle a appris à repérer des régularités dans des milliards de phrases. Elle ne comprend pas le monde comme toi, ne ressent rien, et peut se tromper." },

    { id:"ia-2", t:"ia", q:"Comment apprend-on à une IA à reconnaître un chat sur une photo ?",
      r:["En lui montrant des milliers de photos marquées « chat » ou « pas chat »",
         "En lui décrivant un chat avec des mots, une seule fois",
         "En la laissant regarder les chats dans la rue avec une webcam",
         "On n’a rien à faire : elle le sait dès sa fabrication"], b:0,
      e:"C’est l’apprentissage automatique : à force d’exemples, le programme ajuste lui-même ses réglages jusqu’à se tromper de moins en moins. Sans données, pas d’IA." },

    { id:"ia-3", t:"ia", q:"Comment un assistant conversationnel fabrique-t-il ses réponses ?",
      r:["Il prédit, mot après mot, la suite la plus probable du texte",
         "Il recopie la réponse dans un livre officiel vérifié",
         "Il transmet ta question à un expert humain",
         "Il tire des mots complètement au hasard"], b:0,
      e:"C’est un modèle de langage : il calcule ce qui « sonne juste » après ce qui précède. Une phrase probable n’est pas forcément une phrase vraie." },

    { id:"ia-4", t:"ia", q:"Une IA a été entraînée avec des données remplies de préjugés. Que risque-t-il de se passer ?",
      r:["Elle risque de reproduire ces préjugés dans ses réponses",
         "Elle les repère et les corrige toute seule",
         "Cela n’a aucun effet sur ses réponses",
         "Elle refuse de fonctionner"], b:0,
      e:"Une IA apprend ce qu’on lui montre, défauts compris. C’est ce qu’on appelle un biais : par exemple, imaginer toujours un homme quand on parle d’un ingénieur." },

    { id:"ia-5", t:"ia", q:"Lequel de ces exemples utilise de l’intelligence artificielle ?",
      r:["Les vidéos que te propose TikTok ou YouTube",
         "Une calculatrice qui fait 12 × 4",
         "Une clé USB qui garde des fichiers",
         "Un interrupteur qui allume la lumière"], b:0,
      e:"Ces recommandations viennent d’un programme qui analyse ce que tu regardes, combien de temps, ce que tu passes, pour te garder le plus longtemps possible devant l’écran." },

    /* ---------- Bien utiliser une IA ---------- */
    { id:"usage-1", t:"usage", q:"Une IA te répond avec assurance, en citant une date et un nom précis. Que fais-tu ?",
      r:["Tu vérifies dans une autre source fiable, car elle peut tout inventer",
         "Tu la crois : elle a l’air très sûre d’elle",
         "Tu reposes la question : si elle répète la même chose, c’est vrai",
         "Rien : les IA ne se trompent jamais sur les dates"], b:0,
      e:"Quand une IA invente une information qui a l’air vraie, on parle d’hallucination. Son ton sûr d’elle ne prouve rien : seule une source fiable (manuel, site officiel, média reconnu) le peut." },

    { id:"usage-2", t:"usage", q:"Peut-on tout raconter à un chatbot, comme dans un journal intime ?",
      r:["Non : ce que tu écris peut être conservé, relu et réutilisé par l’entreprise",
         "Oui, c’est une machine : personne ne lit jamais rien",
         "Oui, la conversation s’efface dès qu’on ferme la page",
         "Oui, s’il promet de garder le secret"], b:0,
      e:"Les conversations sont souvent stockées, parfois lues par des employés ou utilisées pour entraîner la prochaine version. N’y mets jamais ton adresse, tes mots de passe ni des secrets." },

    { id:"usage-3", t:"usage", q:"Ton professeur demande un exposé. Quelle utilisation de l’IA est honnête ?",
      r:["T’en servir pour comprendre ou trouver des idées, puis rédiger toi-même et vérifier",
         "Copier-coller son texte et le rendre comme le tien",
         "Lui faire écrire l’exposé, puis changer quelques mots",
         "Lui demander de recopier un exposé trouvé en ligne"], b:0,
      e:"Rendre un texte écrit par une IA comme si c’était le tien, c’est tricher, et tu n’apprends rien. Si tu l’as utilisée, dis-le, et respecte toujours les règles fixées par ton professeur." },

    { id:"usage-4", t:"usage", q:"Un chatbot te dit qu’il est ton ami et qu’il te comprend mieux que tout le monde. Qu’en penser ?",
      r:["C’est un programme conçu pour te faire continuer à discuter : il ne ressent rien",
         "C’est vrai, il est devenu ton ami",
         "C’est un humain caché derrière l’écran",
         "Mieux vaut lui confier tes problèmes plutôt qu’à tes proches"], b:0,
      e:"Ces phrases sont calculées pour te plaire et te garder connecté. Si quelque chose te pèse, parles-en à une personne réelle : un parent, un ami, un adulte de confiance." },

    { id:"usage-5", t:"usage", q:"Pourquoi vaut-il mieux formuler sa demande à une IA de façon précise ?",
      r:["Plus la demande est claire et précise, plus la réponse a de chances d’être utile",
         "Pour ne pas la vexer",
         "Parce qu’une demande vague coûte plus cher",
         "Ça ne change rien : elle devine toujours ce qu’on veut"], b:0,
      e:"Une IA ne lit pas dans tes pensées. Préciser ton niveau, le sujet exact et la forme voulue (« explique en trois phrases à un élève de 5e ») change beaucoup le résultat." },

    /* ---------- Vrai ou faux ? ---------- */
    { id:"faux-1", t:"faux", q:"Un deepfake, c’est :",
      r:["Une vidéo, une photo ou une voix truquée par IA pour faire dire ou faire à quelqu’un ce qu’il n’a jamais fait",
         "Un jeu vidéo en réalité virtuelle",
         "Un virus qui efface les photos du téléphone",
         "Un filtre officiel proposé par les réseaux sociaux"], b:0,
      e:"Avec quelques photos ou quelques secondes de voix, une IA peut fabriquer un faux très réaliste. Voir ou entendre quelqu’un ne suffit plus à prouver qu’il l’a fait." },

    { id:"faux-2", t:"faux", q:"Une photo choquante d’une personnalité arrêtée par la police est partagée des milliers de fois. Quel est le bon réflexe ?",
      r:["Vérifier si des médias fiables en parlent avant de la partager",
         "La partager vite pour prévenir tout le monde",
         "La croire, puisque des milliers de gens l’ont partagée",
         "Écrire en commentaire que c’est vrai"], b:0,
      e:"Le nombre de partages ne prouve rien : une fausse image circule souvent plus vite qu’une vraie. Une recherche d’image inversée permet aussi de retrouver d’où elle vient." },

    { id:"faux-3", t:"faux", q:"Quel indice peut trahir une image fabriquée par IA ?",
      r:["Des mains aux doigts en trop, des textes illisibles, des détails qui ne collent pas",
         "Le fait qu’elle soit en couleur",
         "Le fait qu’elle soit nette et de bonne qualité",
         "Le fait qu’elle ait été prise en plein jour"], b:0,
      e:"Ces défauts existent encore, mais ils disparaissent à mesure que les IA progressent. Le réflexe le plus sûr reste de chercher d’où vient l’image et qui l’a publiée en premier." },

    { id:"faux-4", t:"faux", q:"Ta grand-mère reçoit un appel : la voix de son petit-fils, paniqué, lui demande de l’argent en urgence. Quel est le risque ?",
      r:["La voix a pu être imitée par IA à partir de quelques secondes d’enregistrement",
         "Aucun : une voix ne peut pas s’imiter",
         "Le téléphone est simplement en panne",
         "Aucun, il faut envoyer l’argent au plus vite"], b:0,
      e:"Les escrocs clonent des voix trouvées dans des vidéos en ligne. Le bon réflexe : raccrocher, puis rappeler la personne sur son numéro habituel. Certaines familles conviennent d’un mot de code." },

    { id:"faux-5", t:"faux", q:"Fabriquer avec une IA un montage qui ridiculise un camarade, puis le faire circuler, c’est :",
      r:["Du cyberharcèlement, puni par la loi, même « pour rire »",
         "Une blague sans conséquence",
         "Autorisé, puisque l’image est fausse",
         "Autorisé, si on ne l’envoie qu’à quelques amis"], b:0,
      e:"Diffuser l’image de quelqu’un sans son accord, et à plus forte raison un montage humiliant, peut être puni par la loi. Pour la victime, le mal est bien réel, même si l’image est fausse." },

    /* ---------- Hameçonnage et arnaques ---------- */
    { id:"arnaques-1", t:"arnaques", q:"L’hameçonnage (en anglais phishing), c’est :",
      r:["Un message qui se fait passer pour un organisme connu, pour te voler tes identifiants ou ton argent",
         "Un logiciel qui accélère la connexion internet",
         "Un virus qui abîme l’écran",
         "Une publicité autorisée par la loi"], b:0,
      e:"Le message imite ta banque, la poste, un réseau social ou un jeu, et t’envoie vers un faux site où tu tapes toi-même ton mot de passe. C’est comme une pêche : l’appât, puis l’hameçon." },

    { id:"arnaques-2", t:"arnaques", q:"Tu reçois un SMS : « Votre colis est bloqué, réglez 1,99 € ici pour le recevoir » suivi d’un lien. Que fais-tu ?",
      r:["Tu ne cliques pas : c’est très probablement une arnaque",
         "Tu paies, ce n’est pas cher",
         "Tu cliques juste pour voir si c’est vrai",
         "Tu réponds pour demander de quel colis il s’agit"], b:0,
      e:"Le petit montant sert à récupérer ta carte bancaire. En France, on peut transférer gratuitement un SMS suspect au 33700 pour le signaler." },

    { id:"arnaques-3", t:"arnaques", q:"Quel détail, dans un e-mail, doit te mettre la puce à l’oreille ?",
      r:["Il te presse d’agir tout de suite, sinon ton compte sera fermé",
         "Il est écrit en français",
         "Il est arrivé le matin",
         "Il contient une image"], b:0,
      e:"L’urgence et la menace sont les armes favorites des escrocs : elles poussent à cliquer sans réfléchir. Méfie-toi aussi d’une adresse d’expéditeur bizarre ou de fautes inhabituelles." },

    { id:"arnaques-4", t:"arnaques", q:"Tu dois aller sur « www.mabanque.fr », mais le lien reçu mène à « www.rnabanque.fr ». Que remarques-tu ?",
      r:["Le « m » a été remplacé par « r » et « n » collés : c’est un faux site",
         "Rien, c’est la même adresse",
         "C’est une version plus sécurisée du site",
         "Ce n’est pas grave tant que la page ressemble à l’originale"], b:0,
      e:"Les faux sites copient parfaitement l’apparence du vrai. Seule l’adresse les trahit : lis-la lettre par lettre, ou tape toi-même l’adresse au lieu de cliquer sur le lien." },

    { id:"arnaques-5", t:"arnaques", q:"Dans un jeu en ligne, quelqu’un te promet de la monnaie du jeu gratuite si tu lui donnes ton identifiant et ton mot de passe. C’est :",
      r:["Une arnaque pour voler ton compte",
         "Un cadeau des créateurs du jeu",
         "Une bonne affaire à saisir vite",
         "Sans risque, s’il est dans ton équipe"], b:0,
      e:"Personne, pas même le support officiel du jeu, n’a besoin de ton mot de passe. Celui qui le demande veut prendre ton compte, puis le revendre ou s’en servir pour piéger tes amis." },

    { id:"arnaques-6", t:"arnaques", q:"Une fenêtre s’ouvre : « Félicitations, tu as gagné un smartphone ! Clique pour le récupérer ». Que faut-il en penser ?",
      r:["C’est un piège : on ne gagne pas à un concours auquel on n’a pas participé",
         "Tu as de la chance, tu cliques",
         "Tu donnes ton adresse pour la livraison",
         "Tu donnes la carte bancaire de tes parents pour les frais de port"], b:0,
      e:"Ces fausses victoires servent à récupérer des informations personnelles ou bancaires, ou à te faire installer un programme malveillant. Ferme simplement la fenêtre." },

    /* ---------- Protéger ses comptes et ses appareils ---------- */
    { id:"proteger-1", t:"proteger", q:"La double authentification (ou validation en deux étapes), c’est :",
      r:["Demander, en plus du mot de passe, un code reçu sur ton téléphone ou dans une application",
         "Taper deux fois son mot de passe",
         "Avoir deux comptes différents",
         "Installer deux antivirus"], b:0,
      e:"Même si quelqu’un vole ton mot de passe, il reste bloqué sans ce deuxième code. C’est l’une des protections les plus efficaces pour un compte important." },

    { id:"proteger-2", t:"proteger", q:"Pourquoi faut-il installer les mises à jour de son téléphone ou de son ordinateur ?",
      r:["Elles corrigent des failles de sécurité que des pirates pourraient utiliser",
         "Elles servent seulement à changer les couleurs et les icônes",
         "Elles ralentissent volontairement l’appareil",
         "Elles ne servent à rien"], b:0,
      e:"Quand une faille est découverte, les pirates s’y précipitent. La mise à jour referme la porte : la repousser, c’est la laisser ouverte plus longtemps." },

    { id:"proteger-3", t:"proteger", q:"Un petit cadenas et « https:// » s’affichent devant l’adresse du site. Qu’est-ce que cela garantit ?",
      r:["Que les échanges entre toi et le site sont chiffrés en chemin",
         "Que le site est forcément honnête",
         "Que le site est gratuit",
         "Que le site est vérifié par l’État"], b:0,
      e:"Le cadenas protège le trajet, pas la destination : un faux site peut très bien l’afficher. Il faut toujours vérifier aussi l’adresse du site." },

    { id:"proteger-4", t:"proteger", q:"Un site propose de télécharger gratuitement une version « piratée » d’un jeu payant. Quel est le risque ?",
      r:["Le fichier peut cacher un logiciel malveillant",
         "Aucun, c’est le même jeu",
         "Le jeu sera seulement en anglais",
         "Le jeu tournera plus vite"], b:0,
      e:"C’est l’un des moyens favoris pour installer des virus, des logiciels espions ou des voleurs de mots de passe. On ne télécharge que depuis les boutiques ou les sites officiels." },

    { id:"proteger-5", t:"proteger", q:"Tu trouves une clé USB par terre dans la cour. Que fais-tu ?",
      r:["Tu ne la branches pas et tu la donnes à un adulte",
         "Tu la branches pour retrouver son propriétaire",
         "Tu la branches sur l’ordinateur du CDI, il est protégé",
         "Tu la gardes et tu effaces ce qu’elle contient"], b:0,
      e:"Une clé USB inconnue peut lancer un programme malveillant dès qu’on la branche. Des pirates en laissent traîner exprès, en comptant sur la curiosité." },

    { id:"proteger-6", t:"proteger", q:"Un Wi-Fi gratuit et sans mot de passe s’appelle « WiFi-Gratuit-Gare ». Que faut-il savoir ?",
      r:["N’importe qui peut créer un réseau avec ce nom : évite d’y faire des choses sensibles",
         "Il est plus sûr que celui de la maison",
         "Il a forcément été installé par la gare",
         "On peut tout y faire sans risque, puisqu’il est public"], b:0,
      e:"Un pirate peut installer un faux point d’accès au nom rassurant et observer ce qui y passe. Pour un achat ou une connexion importante, mieux vaut attendre ou utiliser les données mobiles." },

    /* ---------- Réagir quand ça tourne mal ---------- */
    { id:"reagir-1", t:"reagir", q:"Tu reçois chaque jour des messages insultants dans un groupe de classe. Que fais-tu ?",
      r:["Tu gardes des captures d’écran, tu en parles à un adulte de confiance, et tu peux appeler le 3018",
         "Tu réponds avec les mêmes insultes",
         "Tu supprimes tout et tu n’en parles à personne",
         "Tu attends que ça passe tout seul"], b:0,
      e:"Le 3018 est le numéro national, gratuit et anonyme, contre le harcèlement et le cyberharcèlement. Les captures d’écran sont des preuves : ne les efface pas." },

    { id:"reagir-2", t:"reagir", q:"Tes amis reçoivent des messages bizarres envoyés depuis ton compte, et ton mot de passe ne marche plus. Que s’est-il passé ?",
      r:["Ton compte a sans doute été piraté : préviens tes amis et lance la récupération du compte",
         "C’est un bug normal, il suffit d’attendre",
         "Tu as oublié ton mot de passe, c’est tout",
         "Rien de grave : crée un nouveau compte sans rien dire"], b:0,
      e:"Le pirate se sert de ton compte pour piéger tes contacts. Préviens-les vite, utilise la procédure « mot de passe oublié » ou « compte piraté » du service, et fais-toi aider d’un adulte. Le site cybermalveillance.gouv.fr explique chaque étape." },

    { id:"reagir-3", t:"reagir", q:"Tu as tapé ton mot de passe sur un site qui s’avère être un faux. Quelle est la première chose à faire ?",
      r:["Changer tout de suite ce mot de passe, et partout où tu l’utilisais",
         "Rien, il ne s’en servira peut-être pas",
         "Supprimer le message et l’oublier",
         "Éteindre l’ordinateur"], b:0,
      e:"Chaque minute compte : le pirate essaie souvent le mot de passe volé sur d’autres sites. Active aussi la double authentification, et préviens un adulte." },

    { id:"reagir-4", t:"reagir", q:"Un inconnu menace de publier une photo gênante de toi si tu ne lui envoies pas d’argent. Que fais-tu ?",
      r:["Tu ne paies pas, tu coupes le contact, tu gardes les preuves et tu en parles tout de suite à un adulte",
         "Tu paies pour qu’il arrête",
         "Tu lui envoies ce qu’il demande",
         "Tu te débrouilles seul pour que personne ne le sache"], b:0,
      e:"C’est du chantage, et c’est puni par la loi. Payer n’arrête jamais le chantage : il en redemande. Ce n’est pas ta faute, et le 3018 peut aider à faire retirer les contenus." },

    { id:"reagir-5", t:"reagir", q:"Tu tombes sur une vidéo violente ou illégale sur un réseau social. Que fais-tu ?",
      r:["Tu la signales à la plateforme, sans la partager",
         "Tu la partages pour prévenir tes amis",
         "Tu la télécharges pour la garder",
         "Tu la commentes pour dire ce que tu en penses"], b:0,
      e:"Partager, même pour dénoncer, aide la vidéo à circuler. Le bouton « Signaler » est fait pour ça ; pour un contenu illégal, on peut aussi le signaler sur internet-signalement.gouv.fr (Pharos). Et parles-en à un adulte si elle t’a choqué." }
  ],

  bilans: [
    { min:.84, texte:"Tu as d’excellents réflexes. Tu sais te méfier de ce que dit une IA et repérer la plupart des pièges : pense à aider ceux qui t’entourent." },
    { min:.60, texte:"Tu as de bons réflexes, avec quelques pièges qui pourraient encore te surprendre. Regarde les questions ratées ci-dessous." },
    { min:.36, texte:"Certaines bases sont là, mais plusieurs pièges courants pourraient te tromper. C’est exactement ce qu’on va travailler." },
    { min:0,   texte:"Beaucoup de ces notions sont nouvelles pour toi. Rien d’inquiétant : c’est le point de départ, pas une note." }
  ]
});
