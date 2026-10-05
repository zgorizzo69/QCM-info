/* QCM : intelligence artificielle et sécurité en ligne (élèves de 12 à 13 ans, environ 20 minutes).
   Source : qcm-ia-securite.json. « niveau » reprend la difficulté indiquée dans ce fichier. */
QCM.ajouter({
  id: "ia-securite",
  titre: "Intelligence artificielle et sécurité en ligne",
  resume: "Comment fonctionne une IA, comment se protéger en ligne, et comment vérifier une information. Environ 20 minutes.",
  intro: [
    "Une seule réponse est bonne à chaque fois. La bonne réponse s’affiche aussitôt, avec une explication.",
    "Choisis les blocs à passer, puis clique sur Commencer. Ce n’est pas noté : le but est de repérer les bons réflexes."
  ],

  themes: [
    { id:"ia", nom:"L’IA et les LLM", note:"Ce qu’est un modèle de langage, comment il écrit, et pourquoi il se trompe." },
    { id:"securite", nom:"Sécurité en ligne", note:"Mots de passe, arnaques, harcèlement et deepfakes." },
    { id:"verification", nom:"Vérifier l’information", note:"Croiser les sources et repérer les fausses informations." }
  ],

  questions: [
    { id:"q1", t:"ia", niveau:"facile", q:"Que veut dire LLM ?",
      r:["Logiciel Libre Multimédia",
         "Grand modèle de langage (Large Language Model)",
         "Lecteur Logique de Mémoire",
         "Langage Local Machine"], b:1,
      e:"LLM signifie Large Language Model, c’est-à-dire un grand modèle de langage, entraîné à travailler sur du texte." },

    { id:"q2", t:"ia", niveau:"facile", q:"Comment un LLM écrit-il sa réponse ?",
      r:["Il recopie une réponse trouvée dans un livre",
         "Il devine le mot suivant le plus probable, encore et encore",
         "Un humain écrit la réponse à sa place en direct",
         "Il choisit une phrase au hasard dans une liste"], b:1,
      e:"Un LLM enchaîne les mots un par un en calculant à chaque fois le plus probable, comme les suggestions du clavier d’un téléphone, mais en beaucoup plus puissant." },

    { id:"q3", t:"ia", niveau:"moyen", q:"Quelle phrase est exacte ?",
      r:["Tous les LLM sont des IA, mais toutes les IA ne sont pas des LLM",
         "IA et LLM sont deux mots pour la même chose",
         "Toutes les IA sont des LLM",
         "Un LLM contient plusieurs IA à l’intérieur"], b:0,
      e:"L’IA est la grande famille (reconnaissance de visage, recommandations, voiture autonome…) ; le LLM n’en est qu’un type, spécialisé dans le texte." },

    { id:"q4", t:"ia", niveau:"facile", q:"Qu’appelle-t-on une « hallucination » d’une IA ?",
      r:["Un bug qui fait planter l’application",
         "Une réponse inventée qui a l’air vraie",
         "Une image floue générée par erreur",
         "Un virus caché dans le logiciel"], b:1,
      e:"Comme le modèle choisit des mots probables et non des mots vérifiés, il peut inventer un nom, une date ou une source qui n’existent pas." },

    { id:"q5", t:"ia", niveau:"moyen", q:"Une IA te répond avec beaucoup d’assurance. Qu’est-ce que cela prouve ?",
      r:["Que la réponse est vérifiée",
         "Rien du tout : il faut vérifier soi-même",
         "Qu’elle a lu la réponse sur un site officiel",
         "Qu’au moins trois IA sont d’accord"], b:1,
      e:"Le ton assuré fait partie de l’imitation du langage humain ; il n’indique en rien que l’information est juste." },

    { id:"q6", t:"ia", niveau:"moyen", q:"Comment une IA fabrique-t-elle une image de chat ?",
      r:["Elle colle ensemble des morceaux de photos de chats existantes",
         "Elle part d’une image de bruit au hasard et enlève le bruit petit à petit",
         "Elle dessine trait par trait comme un dessinateur",
         "Elle photographie un vrai chat sur Internet"], b:1,
      e:"C’est le principe de la diffusion : le modèle part d’un écran de points aléatoires et le transforme en image nette, étape après étape." },

    { id:"q7", t:"ia", niveau:"difficile", q:"Quelle est la différence entre un LLM et un agent ?",
      r:["L’agent est plus rapide que le LLM",
         "L’agent peut utiliser des outils et agir, le LLM se contente d’écrire",
         "L’agent fonctionne sans électricité",
         "Il n’y a aucune différence"], b:1,
      e:"Le LLM est un cerveau qui parle ; l’agent est le même cerveau avec des « mains » : il peut chercher sur Internet, remplir un formulaire, envoyer un message." },

    { id:"q8", t:"ia", niveau:"moyen", q:"Un devoir entièrement rédigé par une IA, c’est…",
      r:["Une bonne méthode pour gagner du temps",
         "De la triche, et en plus tu n’apprends rien",
         "Autorisé si tu changes deux ou trois mots",
         "Impossible à repérer par un professeur"], b:1,
      e:"L’IA peut t’aider à comprendre ou à t’entraîner, mais rendre son texte comme le tien est de la tricherie, et cela t’empêche d’apprendre." },

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
    { min:.84, texte:"Tu as d’excellents réflexes. Tu sais te méfier de ce que dit une IA et repérer la plupart des pièges : pense à aider ceux qui t’entourent." },
    { min:.60, texte:"Tu as de bons réflexes, avec quelques pièges qui pourraient encore te surprendre. Regarde les questions ratées ci-dessous." },
    { min:.36, texte:"Certaines bases sont là, mais plusieurs pièges courants pourraient te tromper. C’est exactement ce qu’on va travailler." },
    { min:0,   texte:"Beaucoup de ces notions sont nouvelles pour toi. Rien d’inquiétant : c’est le point de départ, pas une note." }
  ]
});
