/* QCM interactif : le binaire, pour des élèves qui n’ont jamais changé de base.
   On avance par petites marches : les bits, la base 10 qu’on connaît déjà, compter en binaire,
   lire puis écrire un nombre binaire, s’entraîner, les octets et les lettres, et pour finir un
   bonus sur l’hexadécimal. Les jeux sont dans js/binaire-jeux.js. */
QCM.ajouter({
  id: "binaire",
  titre: "Le binaire : la langue des ordinateurs",
  resume: "Pourquoi les ordinateurs ne comptent qu’avec des 0 et des 1, et comment lire et écrire le binaire, pas à pas, avec des ampoules, des compteurs, des cartes à retourner et un message secret.",
  intro: [
    "💡 Un ordinateur ne connaît que deux chiffres : 0 et 1. Avec eux, il écrit tous les nombres, toutes les lettres, toutes les images… Dans ce cours, tu vas apprendre à parler sa langue !",
    "🪜 Aucune connaissance n’est nécessaire : on avance marche par marche. Chaque bloc commence par une leçon avec un petit jeu, puis quelques questions. Suis les blocs dans l’ordre !"
  ],

  themes: [
    { id:"bits",         nom:"0 et 1 : la langue de l’ordinateur", note:"💡 Des interrupteurs allumés ou éteints : les bits." },
    { id:"base10",       nom:"Comment on compte d’habitude",        note:"🖐️ La base 10, ses 10 chiffres et ses retenues." },
    { id:"compter",      nom:"Compter en binaire",                  note:"🔢 La même chose, avec seulement 0 et 1." },
    { id:"lire",         nom:"Lire un nombre binaire",              note:"🃏 Les cartes 1, 2, 4, 8, 16 : du binaire au décimal." },
    { id:"ecrire",       nom:"Écrire un nombre en binaire",         note:"✏️ Du décimal au binaire : la plus grosse carte d’abord." },
    { id:"entrainement", nom:"Entraînement",                        note:"🏋️ Traduire dans les deux sens, de plus en plus fort." },
    { id:"octets",       nom:"Bits, octets et lettres",             note:"🔤 Ton prénom en binaire, et un message secret." },
    { id:"hexa",         nom:"Bonus : l’hexadécimal",               note:"🎨 La base 16, ses lettres A à F, et les couleurs du CSS." }
  ],

  questions: [
    /* ================= 0 et 1 ================= */
    { id:"bits-l1", t:"bits", type:"lecon", titre:"L’ordinateur ne connaît que 0 et 1",
      contenu:[
        "⚡ À l’intérieur d’un ordinateur, tout fonctionne à l’électricité. Il contient des milliards de minuscules interrupteurs, les **transistors**. Chacun est soit **allumé** (le courant passe), soit **éteint** (il ne passe pas). Pas de « à moitié allumé » : seulement deux possibilités.",
        "0️⃣1️⃣ On écrit **1** pour allumé et **0** pour éteint. Chaque 0 ou 1 s’appelle un **bit** (de l’anglais « binary digit » : chiffre binaire). C’est la plus petite information qui existe : oui ou non, vrai ou faux.",
        "🏠 Imagine deux amis qui se parlent la nuit avec les lampes de leur chambre, d’une fenêtre à l’autre. Avec **une seule** lampe, ils n’ont que 2 messages : allumée (« je suis réveillé ») ou éteinte (« je dors »). Mais avec **plusieurs** lampes, ils peuvent s’envoyer beaucoup plus de messages différents…",
        "🔎 Combien exactement ? À toi de le découvrir avec les ampoules ci-dessous : allume-les et éteins-les pour trouver **toutes** les combinaisons, avec 1, 2, puis 3 ampoules. Tu vas voir apparaître une règle !"
      ],
      titreInteractif:"💡 Les ampoules",
      interactif:function(zone, signaler){ BinaireJeux.ampoules(zone, signaler); },
      essais:[
        { texte:"Avec **1** ampoule, trouve tous les messages possibles.", test:function(e){ return e.par[1] >= 2; } },
        { texte:"Avec **2** ampoules, trouve-les tous.", test:function(e){ return e.par[2] >= 4; } },
        { texte:"Avec **3** ampoules, trouve-les tous.", test:function(e){ return e.par[3] >= 8; } },
        { texte:"Quelle règle remarques-tu ? Devine combien il y en a avec **4** ampoules… puis vérifie !", test:function(e){ return e.par[4] >= 16; } }
      ] },

    { id:"bits-1", t:"bits", q:"Que veut dire le mot « bit » ?",
      r:["Un chiffre binaire : 0 ou 1", "Un petit ordinateur", "Un morceau d’écran", "Un virus informatique"], b:0,
      e:"Bit vient de « binary digit », chiffre binaire. C’est la plus petite information : 0 ou 1, éteint ou allumé." },

    { id:"bits-2", t:"bits", q:"Pourquoi l’ordinateur n’utilise-t-il que des 0 et des 1 ?",
      r:["Parce que ses interrupteurs n’ont que deux états : allumé ou éteint",
         "Parce que ses inventeurs ne connaissaient que deux chiffres",
         "Pour économiser de l’encre",
         "Parce que 0 et 1 sont les chiffres préférés des robots"], b:0,
      e:"Chaque transistor laisse passer le courant ou pas. Deux états, deux chiffres : 1 et 0." },

    { id:"bits-3", t:"bits", q:"Avec **3** ampoules, combien de messages différents peut-on faire ?",
      r:["8", "3", "6", "9"], b:0,
      e:"1 ampoule : 2 messages. 2 ampoules : 4. 3 ampoules : 8. Chaque ampoule en plus **double** le nombre de messages." },

    { id:"bits-4", t:"bits", niveau:"difficile", q:"Avec **5** ampoules, combien de messages différents peut-on faire ?",
      r:["32", "10", "25", "16"], b:0,
      e:"On double à chaque ampoule : 2, 4, 8, 16, 32. C’est pour ça qu’avec des milliards de bits, un ordinateur peut tout représenter." },

    /* ================= La base 10 ================= */
    { id:"base10-l1", t:"base10", type:"lecon", titre:"Comment on compte d’habitude : la base 10",
      contenu:[
        "🖐️ Avant d’apprendre à compter comme un ordinateur, regardons comment **nous** comptons. Nous utilisons **10 chiffres** : 0, 1, 2, 3, 4, 5, 6, 7, 8 et 9. Sans doute parce que nous avons 10 doigts ! On appelle ça la **base 10**, ou système **décimal**.",
        "🚗 Pense au compteur kilométrique d’une vieille voiture : chaque rouleau affiche un chiffre. Quand le rouleau de droite a dépassé 9, il **repart à 0** et fait avancer d’un cran le rouleau de gauche. C’est la **retenue** : 9 + 1 = 10, « zéro, et je retiens un ».",
        "📍 La **place** d’un chiffre change sa valeur. Dans 352, le 2 vaut 2 unités, le 5 vaut 5 dizaines (50), et le 3 vaut 3 centaines (300) :",
        { code:
`  centaines   dizaines   unités
     100         10         1
      3           5         2

  352 = 3 × 100  +  5 × 10  +  2 × 1
      =   300    +    50    +    2` },
        "✖️ Chaque place vaut **10 fois** celle de sa voisine de droite : 1, 10, 100, 1000… Retiens bien cette idée : c’est le secret de toutes les bases, et elle va servir pour le binaire !"
      ],
      titreInteractif:"🚗 Le compteur kilométrique",
      interactif:function(zone, signaler){ BinaireJeux.compteurs(zone, signaler, { bases:[10] }); },
      essais:[
        { texte:"Avance jusqu’à 9, puis fais +1 : que fait le rouleau des unités ?", test:function(e){ return e.vus.has(10); } },
        { texte:"Va jusqu’à 99, puis fais +1 : combien de rouleaux bougent en même temps ?", test:function(e){ return e.vus.has(100); } },
        "Lance le compteur tout seul, et regarde : à quelle vitesse tourne chaque rouleau ?"
      ] },

    { id:"base10-1", t:"base10", q:"Combien de chiffres différents utilise-t-on en base 10 ?",
      r:["10 (de 0 à 9)", "9 (de 1 à 9)", "11 (de 0 à 10)", "Une infinité"], b:0,
      e:"De 0 à 9 : dix chiffres. Le nombre 10 n’est pas un chiffre : il s’écrit avec deux chiffres, 1 et 0." },

    { id:"base10-2", t:"base10", q:"En base décimale, dans le nombre 352, que vaut le chiffre 5 ?",
      r:["50", "5", "500", "35"], b:0,
      e:"Le 5 est à la place des dizaines : il vaut 5 × 10 = 50." },

    { id:"base10-3", t:"base10", q:"Sur un compteur en base décimale, que se passe-t-il quand on ajoute 1 à 199 ?",
      r:["Les deux 9 repartent à 0 et le 1 devient 2 : 200", "On obtient 1910", "Seul le dernier 9 change : 190", "Le compteur se bloque"], b:0,
      e:"Le rouleau des unités repart à 0 et pousse les dizaines, qui repartent à 0 aussi et poussent les centaines : deux retenues d’un coup !" },

    /* ================= Compter en binaire ================= */
    { id:"compter-l1", t:"compter", type:"lecon", titre:"Compter en binaire",
      contenu:[
        "🔢 En **base 2**, le binaire, on compte **exactement de la même façon**… mais avec seulement **2 chiffres** : 0 et 1. Imagine un compteur dont les rouleaux n’ont que deux faces : 0 et 1.",
        "↪️ Le rouleau fait donc le tour beaucoup plus vite ! 0, puis 1, puis… il n’y a plus de chiffre après 1 : le rouleau repart à 0 et pousse son voisin de gauche. Voilà pourquoi 1 + 1 s’écrit **10** en binaire.",
        "⚠️ Attention : en binaire, `10` ne se lit pas « dix » mais « un, zéro ». Et il vaut **deux** !",
        { code:
`décimal   binaire
   0           0
   1           1
   2          10    ← retenue : le rouleau repart à 0
   3          11
   4         100    ← deux retenues d'un coup !
   5         101
   6         110
   7         111
   8        1000    ← trois retenues !` },
        "👀 Regarde quand arrive une nouvelle retenue tout à gauche : à 2, à 4, à 8… Toujours le double ! Ça ne te rappelle pas les ampoules ?",
        "🧪 Compare les deux compteurs ci-dessous : ils affichent **le même nombre**, écrit dans deux bases différentes."
      ],
      titreInteractif:"🚗 Deux compteurs côte à côte",
      interactif:function(zone, signaler){ BinaireJeux.compteurs(zone, signaler, { bases:[10, 2] }); },
      essais:[
        { texte:"Compte jusqu’à 8, en regardant bien le compteur binaire à chaque +1.", test:function(e){ return e.vus.has(8); } },
        { texte:"Continue jusqu’à 16 : combien de chiffres faut-il en binaire ?", test:function(e){ return e.vus.has(16); } },
        { texte:"Trouve le plus grand nombre que les 8 rouleaux binaires peuvent afficher (tous les rouleaux à 1).", test:function(e){ return e.vus.has(255); } }
      ] },

    { id:"compter-1", t:"compter", q:"Combien de chiffres différents utilise-t-on en binaire ?",
      r:["2 : le 0 et le 1", "10", "8", "1 : le 1"], b:0,
      e:"Base 2 : deux chiffres. Base 10 : dix chiffres. Le nom de la base dit combien il y a de chiffres." },

    { id:"compter-2", t:"compter", q:"En binaire, quel nombre vient juste après `11` ?",
      r:["100", "12", "20", "111"], b:0,
      e:"11 + 1 : le rouleau de droite repart à 0 et pousse son voisin, qui repart à 0 aussi et pousse le suivant : 100. (En décimal : 3 + 1 = 4.)" },

    { id:"compter-3", t:"compter", q:"En binaire, on écrit `10`. Combien vaut ce nombre ?",
      r:["Deux", "Dix", "Un", "Zéro"], b:0,
      e:"En binaire, 10 se lit « un, zéro » et vaut deux : c’est le nombre qui vient juste après 1." },

    { id:"compter-4", t:"compter", q:"En base décimale, on écrit **4**. Comment s’écrit ce nombre en binaire ?",
      r:["100", "4", "11", "1000"], b:0,
      e:"0, 1, 10, 11, 100 : en comptant, on arrive à 100 pour quatre. (1000, c’est huit.)" },

    /* ================= Lire un nombre binaire ================= */
    { id:"lire-l1", t:"lire", type:"lecon", titre:"Lire un nombre binaire",
      contenu:[
        "🧭 En base 10, chaque place vaut **10 fois** celle de droite : 1, 10, 100… En binaire, chaque place vaut **2 fois** celle de droite : **1, 2, 4, 8, 16, 32, 64, 128**… Toujours le double !",
        "🃏 Pour le voir, on utilise des **cartes binaires**. Chaque carte a deux fois plus de points que sa voisine de droite : 16, 8, 4, 2 et 1. Une carte **retournée face visible** compte pour 1 (on compte ses points). Une carte **cachée** compte pour 0 (on ne compte rien).",
        "🔍 Pour lire un nombre binaire, trois étapes : ① écris les valeurs 1, 2, 4, 8… au-dessus des chiffres, **en partant de la droite** ; ② garde les valeurs qui ont un **1** en dessous ; ③ additionne-les.",
        { code:
`valeur :   8   4   2   1
bit    :   1   0   1   1
           ↓       ↓   ↓
           8   +   2 + 1  =  11

Donc 1011 en binaire vaut 11 en décimal.` },
        "💡 Astuce : seule la carte 1 a un nombre impair de points. Donc un nombre binaire qui finit par **1** est toujours **impair**, et un nombre qui finit par **0** est **pair**."
      ],
      titreInteractif:"🃏 Les cartes binaires",
      interactif:function(zone, signaler){ BinaireJeux.cartes(zone, signaler, { cartes:5 }); },
      essais:[
        { texte:"Retourne seulement la carte de 4 et la carte de 1 : quel nombre obtiens-tu ?", test:function(e){ return e.binaire === "00101"; } },
        { texte:"Fabrique le nombre 10 (en base décimale).", test:function(e){ return e.faits.has(10); } },
        { texte:"Retourne toutes les cartes : quel est le plus grand nombre possible avec 5 cartes ?", test:function(e){ return e.faits.has(31); } },
        "Fabrique plusieurs nombres impairs : quelle carte est toujours retournée ?"
      ] },

    { id:"lire-1", t:"lire", q:"En binaire, on écrit `101`. Comment s’écrit ce nombre en base décimale ?",
      r:["5", "101", "3", "6"], b:0,
      e:"Valeurs 4, 2, 1 au-dessus des chiffres 1, 0, 1 : on garde 4 et 1. 4 + 1 = 5." },

    { id:"lire-2", t:"lire", q:"En binaire, on écrit `1100`. Comment s’écrit ce nombre en base décimale ?",
      r:["12", "1100", "3", "6"], b:0,
      e:"Valeurs 8, 4, 2, 1 au-dessus de 1, 1, 0, 0 : on garde 8 et 4. 8 + 4 = 12." },

    { id:"lire-3", t:"lire", q:"En binaire, on écrit `11111`. Comment s’écrit ce nombre en base décimale ?",
      r:["31", "5", "11111", "32"], b:0,
      e:"Toutes les cartes sont retournées : 16 + 8 + 4 + 2 + 1 = 31. C’est le plus grand nombre qu’on peut écrire avec 5 bits." },

    { id:"lire-4", t:"lire", q:"En binaire, dans le nombre `10000`, que vaut le chiffre 1 en base décimale ?",
      r:["16", "1", "10000", "5"], b:0,
      e:"Il est à la 5e place en partant de la droite. Les valeurs sont 1, 2, 4, 8, 16 : il vaut 16." },

    { id:"lire-5", t:"lire", q:"Le nombre binaire `1010` est-il pair ou impair ?",
      r:["Pair : il finit par 0", "Impair : il finit par 0", "Impair : il a deux 1", "On ne peut pas savoir sans le calculer"], b:0,
      e:"Il finit par 0 : la carte 1 est cachée, donc le nombre est pair. (`1010` en binaire = 8 + 2 = 10 en base décimale.)" },

    /* ================= Écrire un nombre en binaire ================= */
    { id:"ecrire-l1", t:"ecrire", type:"lecon", titre:"Écrire un nombre en binaire",
      contenu:[
        "🔁 Maintenant, le chemin inverse : comment écrire 13 en binaire ? On reprend les cartes 16, 8, 4, 2 et 1, avec une règle simple : **toujours prendre la plus grosse carte possible**, sans dépasser.",
        { code:
`Écrire 13 en binaire :

  carte 16 ?  trop grande (16 > 13)          → 0
  carte  8 ?  oui ! il reste 13 − 8 = 5      → 1
  carte  4 ?  oui ! il reste  5 − 4 = 1      → 1
  carte  2 ?  trop grande (2 > 1)            → 0
  carte  1 ?  oui ! il reste  1 − 1 = 0      → 1

  13 = 8 + 4 + 1   →   01101   →   1101` },
        "🪙 C’est comme payer avec des pièces de 16, 8, 4, 2 et 1 centimes, en prenant toujours la plus grosse pièce possible, et **au plus une pièce de chaque**.",
        "✂️ Les 0 tout à gauche ne servent à rien, comme en décimal (on n’écrit pas 0042 pour 42) : on écrit 1101.",
        "✅ Pour vérifier, relis ton nombre binaire avec la méthode de la leçon précédente : tu dois retomber sur ton nombre de départ. 1101 = 8 + 4 + 1 = 13 ✓."
      ],
      titreInteractif:"🎯 Les défis des cartes",
      interactif:function(zone, signaler){ BinaireJeux.cartes(zone, signaler, { cartes:5, defi:true }); },
      essais:[
        { texte:"Réussis 3 défis.", test:function(e){ return e.defis >= 3; } },
        { texte:"Réussis 10 défis : de plus en plus vite !", test:function(e){ return e.defis >= 10; } },
        "Pour un même nombre, existe-t-il plusieurs façons de retourner les cartes ? Essaie de trouver une autre façon de faire 13."
      ] },

    { id:"ecrire-1", t:"ecrire", q:"En base décimale, on écrit **6**. Comment s’écrit ce nombre en binaire ?",
      r:["110", "6", "101", "111"], b:0,
      e:"Plus grosse carte possible : 4 (il reste 2), puis 2 (il reste 0). Cartes 4 et 2 : 110." },

    { id:"ecrire-2", t:"ecrire", q:"En base décimale, on écrit **9**. Comment s’écrit ce nombre en binaire ?",
      r:["1001", "1010", "111", "10001"], b:0,
      e:"9 = 8 + 1 : on prend la carte 8, pas la 4, pas la 2, et la carte 1 : 1001." },

    { id:"ecrire-3", t:"ecrire", q:"En base décimale, on écrit **16**. Comment s’écrit ce nombre en binaire ?",
      r:["10000", "1111", "1000", "16"], b:0,
      e:"16 est une carte à lui tout seul : un 1 suivi de quatre 0. (`1111` en binaire, c’est 15 : juste avant.)" },

    { id:"ecrire-4", t:"ecrire", niveau:"difficile", q:"En base décimale, on écrit **20**. Comment s’écrit ce nombre en binaire ?",
      r:["10100", "10010", "11000", "20"], b:0,
      e:"20 = 16 + 4 : cartes 16 (oui), 8 (non), 4 (oui), 2 (non), 1 (non) : 10100." },

    { id:"ecrire-5", t:"ecrire", q:"Pour écrire un nombre en binaire avec les cartes, par quelle carte commence-t-on ?",
      r:["La plus grosse carte qui ne dépasse pas le nombre", "Toujours la carte 1", "La carte du milieu", "N’importe laquelle"], b:0,
      e:"On prend la plus grosse carte possible, on enlève sa valeur, puis on recommence avec ce qui reste." },

    /* ================= Entraînement ================= */
    { id:"entrainement-l1", t:"entrainement", type:"lecon", titre:"Entraîne-toi !",
      contenu:[
        "🏋️ Tu connais maintenant les deux méthodes. Un petit rappel avant de t’entraîner :",
        "📖 **Binaire → décimal** : écris 1, 2, 4, 8, 16… au-dessus des chiffres (en partant de la droite), puis additionne les valeurs qui ont un 1.",
        "✏️ **Décimal → binaire** : prends la plus grosse carte possible, enlève sa valeur, et recommence avec ce qui reste. Écris 1 pour chaque carte prise, 0 pour les autres.",
        "📈 Les questions deviennent plus difficiles quand tu réussis : d’abord jusqu’à 15, puis 31, puis 63. Après chaque réponse, un tableau te montre le calcul. Tu peux t’aider d’une feuille de brouillon !"
      ],
      titreInteractif:"🏋️ La salle d’entraînement",
      interactif:function(zone, signaler){ BinaireJeux.entrainement(zone, signaler); },
      essais:[
        { texte:"5 bonnes réponses du binaire vers le décimal.", test:function(e){ return e.versDecimal >= 5; } },
        { texte:"5 bonnes réponses du décimal vers le binaire.", test:function(e){ return e.versBinaire >= 5; } },
        { texte:"Une série de 5 bonnes réponses d’affilée !", test:function(e){ return e.serieMax >= 5; } }
      ] },

    { id:"entrainement-1", t:"entrainement", q:"En binaire, on écrit `111`. Comment s’écrit ce nombre en base décimale ?",
      r:["7", "3", "111", "8"], b:0,
      e:"4 + 2 + 1 = 7. C’est le plus grand nombre qu’on peut écrire avec 3 bits : un de moins que `1000` en binaire (8)." },

    { id:"entrainement-2", t:"entrainement", q:"En base décimale, on écrit **25**. Comment s’écrit ce nombre en binaire ?",
      r:["11001", "10101", "11010", "10011"], b:0,
      e:"25 = 16 + 8 + 1 : cartes 16 (oui), 8 (oui), 4 (non), 2 (non), 1 (oui) : 11001." },

    /* ================= Bits, octets et lettres ================= */
    { id:"octets-l1", t:"octets", type:"lecon", titre:"Bits, octets et lettres",
      contenu:[
        "📦 Un bit tout seul, c’est bien peu. Alors on les range par paquets de **8** : un paquet de 8 bits s’appelle un **octet** (« octo » veut dire huit, comme les 8 bras de la pieuvre 🐙). Avec 8 bits, on écrit les nombres de 0 (00000000) jusqu’à **255** (11111111) : 256 possibilités.",
        "📏 Les octets servent à mesurer la taille des fichiers et des mémoires :",
        { code:
`1 octet          = 8 bits               une lettre
1 kilo-octet ko  ≈ 1 000 octets         une page de texte
1 méga-octet Mo  ≈ 1 million d'octets   une photo, une chanson
1 giga-octet Go  ≈ 1 milliard d'octets  un film
1 téra-octet To  ≈ 1 000 milliards      un gros disque dur` },
        "🔤 Et les lettres ? Un ordinateur ne sait garder que des nombres ! Alors chaque caractère a un **numéro**, toujours le même, dans un grand tableau : A = 65, B = 66, C = 67… et la minuscule a = 97. Ce numéro est rangé en binaire dans un octet : A = 65 = 64 + 1 = **01000001**.",
        "😀 Les accents et les emojis ont des numéros plus grands : un emoji a besoin de plusieurs octets."
      ],
      titreInteractif:"🔤 Ton prénom en binaire",
      interactif:function(zone, signaler){ BinaireJeux.texte(zone, signaler); },
      essais:[
        { texte:"Écris ton prénom : combien d’octets prend-il ?", test:function(e){ return e.lettres > 0 && e.texte !== "Louis"; } },
        { texte:"Écris « Aa » : la majuscule et la minuscule ont-elles le même code ?", test:function(e){ return /A/.test(e.texte) && /a/.test(e.texte); } },
        { texte:"Décode le message secret de l’espion 🕵️.", test:function(e){ return e.decode; } }
      ] },

    { id:"octets-1", t:"octets", q:"Combien de bits y a-t-il dans un octet ?",
      r:["8", "2", "10", "1 000"], b:0,
      e:"Octo veut dire huit : un octet est un paquet de 8 bits." },

    { id:"octets-2", t:"octets", q:"Quel est, en base décimale, le plus grand nombre qu’on peut écrire avec un octet ?",
      r:["255", "256", "8", "128"], b:0,
      e:"`11111111` en binaire = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 en base décimale. Avec le 0, ça fait 256 possibilités." },

    { id:"octets-3", t:"octets", q:"Comment un ordinateur garde-t-il en mémoire la lettre A ?",
      r:["Sous forme d’un numéro (65 en base décimale), écrit en binaire", "Il dessine la lettre en tout petit", "Il ne peut pas garder de lettres", "Il la garde en morse"], b:0,
      e:"Chaque caractère a un numéro : A = 65 en base décimale, rangé dans un octet sous la forme `01000001` en binaire." },

    { id:"octets-4", t:"octets", q:"Une photo de 3 Mo, c’est environ…",
      r:["3 millions d’octets", "3 octets", "3 000 octets", "3 milliards d’octets"], b:0,
      e:"Méga veut dire million : 3 Mo ≈ 3 millions d’octets, soit environ 24 millions de bits !" },

    /* ================= Bonus : l’hexadécimal ================= */
    { id:"hexa-l1", t:"hexa", type:"lecon", titre:"Bonus : l’hexadécimal, la base 16",
      contenu:[
        "🌍 Tu connais maintenant deux façons d’écrire les nombres : la base 10 (10 chiffres) et la base 2 (2 chiffres). Mais on peut compter avec **n’importe quel** nombre de chiffres ! Les informaticiens utilisent aussi beaucoup la **base 16** : l’**hexadécimal** (« hexa » = 6 et « déci » = 10 : 6 + 10 = 16).",
        "🔤 Il faut donc 16 chiffres… mais nous n’en avons que 10 ! Alors on complète avec des lettres : **A** vaut 10, **B** vaut 11, **C** vaut 12, **D** vaut 13, **E** vaut 14 et **F** vaut 15.",
        { code:
`décimal :  0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
hexa    :  0 1 2 3 4 5 6 7 8 9  A  B  C  D  E  F 10` },
        "↪️ Et toujours la même règle : après F, le rouleau repart à 0 et fait une retenue. Donc **10** en hexadécimal vaut **seize**. Chaque place vaut 16 fois celle de droite : 1, 16, 256…",
        "🧠 Tu vois ? Base 10, base 2, base 16 : c’est **la même idée** à chaque fois. Seul le nombre de chiffres change, et donc le moment où arrive la retenue. Compare les trois compteurs ci-dessous !"
      ],
      titreInteractif:"🚗 Trois compteurs, trois bases",
      interactif:function(zone, signaler){ BinaireJeux.compteurs(zone, signaler, { bases:[10, 2, 16] }); },
      essais:[
        { texte:"Compte jusqu’à 15 : quel chiffre affiche le compteur hexadécimal ?", test:function(e){ return e.vus.has(15); } },
        { texte:"Fais +1 : que devient le F ?", test:function(e){ return e.vus.has(16); } },
        { texte:"Va jusqu’à 255 : regarde les trois compteurs. Lequel écrit le nombre le plus court ?", test:function(e){ return e.vus.has(255); } }
      ] },

    { id:"hexa-l2", t:"hexa", type:"lecon", titre:"Les couleurs en hexadécimal",
      contenu:[
        "🤝 Pourquoi les informaticiens aiment-ils tant l’hexadécimal ? Parce qu’**un chiffre hexadécimal correspond exactement à 4 bits** (de 0000 à 1111, soit de 0 à 15). Un octet de 8 bits s’écrit donc avec seulement **2 chiffres** : bien plus court à lire que huit 0 et 1 !",
        { code:
`binaire      hexa    décimal
1111 1111  →  F F  →  255
1010 0101  →  A 5  →  165
0000 1100  →  0 C  →   12` },
        "🎨 Tu l’as déjà utilisé sans le savoir : en CSS, `#FF8800` est une couleur écrite en hexadécimal ! Elle est faite de trois octets : **FF** de rouge (255, le maximum), **88** de vert (136) et **00** de bleu (rien). Mélangés, ça donne… de l’orange.",
        "🕰️ D’autres bases se cachent dans la vie de tous les jours : on compte les secondes et les minutes en **base 60** (après 59 secondes, la retenue fait passer à 1 minute), l’horloge à aiguilles en base 12, et les Mayas comptaient en **base 20**, avec les doigts des mains et des pieds !"
      ],
      titreInteractif:"🎨 Le mélangeur de couleurs",
      interactif:function(zone, signaler){ BinaireJeux.couleurs(zone, signaler); },
      essais:[
        { texte:"Fabrique du rouge pur : `#FF0000`.", test:function(e){ return e.vues.has("#FF0000"); } },
        { texte:"Fabrique du jaune, en mélangeant du rouge et du vert à fond.", test:function(e){ return e.vues.has("#FFFF00"); } },
        { texte:"Fabrique du blanc (tout à fond), puis du noir (tout à zéro).", test:function(e){ return e.vues.has("#FFFFFF") && e.vues.has("#000000"); } },
        "Invente ta couleur préférée, et note son code : tu pourras l’utiliser dans tes pages web !"
      ] },

    { id:"hexa-1", t:"hexa", q:"Combien de chiffres différents utilise l’hexadécimal ?",
      r:["16", "6", "10", "26"], b:0,
      e:"Base 16 : seize chiffres, de 0 à 9 puis de A à F." },

    { id:"hexa-2", t:"hexa", q:"En base décimale, combien vaut le chiffre hexadécimal **A** ?",
      r:["10", "1", "11", "16"], b:0,
      e:"Après 9 viennent A (10), B (11), C (12), D (13), E (14) et F (15)." },

    { id:"hexa-3", t:"hexa", q:"En hexadécimal, on écrit `10`. Combien vaut ce nombre ?",
      r:["Seize", "Dix", "Deux", "Cent"], b:0,
      e:"Après F (quinze), le rouleau repart à 0 et fait une retenue : 10 en base 16 vaut seize. En base 2, 10 vaut deux ; en base 10, dix. Même écriture, trois valeurs !" },

    { id:"hexa-4", t:"hexa", q:"En hexadécimal, on écrit `FF`. Comment s’écrit ce nombre en base décimale ?",
      r:["255", "30", "1515", "16"], b:0,
      e:"F vaut 15 : 15 × 16 + 15 = 255. C’est le plus grand nombre d’un octet, comme 11111111 en binaire." },

    { id:"hexa-5", t:"hexa", q:"Combien de bits faut-il pour écrire un chiffre hexadécimal ?",
      r:["4", "2", "8", "16"], b:0,
      e:"Avec 4 bits, on écrit de `0000` à `1111` en binaire, c’est-à-dire de 0 à 15 en base décimale : exactement les 16 chiffres de l’hexadécimal." },

    { id:"hexa-6", t:"hexa", q:"En CSS, quelle couleur donne `#00FF00` ?",
      r:["Du vert", "Du rouge", "Du bleu", "Du noir"], b:0,
      e:"Les trois octets sont rouge, vert, bleu : 00 de rouge, FF de vert (à fond), 00 de bleu. C’est du vert pur." },

    { id:"hexa-7", t:"hexa", q:"Dans quelle base compte-t-on les secondes et les minutes ?",
      r:["Base 60", "Base 10", "Base 2", "Base 100"], b:0,
      e:"Après 59 secondes vient 1 minute : la retenue arrive à 60. On hérite cette base des Babyloniens, il y a plus de 4 000 ans." }
  ],

  bilans: [
    { min:.84, texte:"Bravo, tu parles binaire comme un ordinateur ! Tu as compris le secret de toutes les bases : base 10, base 2 ou base 16, c’est la même idée avec plus ou moins de chiffres." },
    { min:.60, texte:"Bien joué ! Les bases demandent un peu d’entraînement : retourne dans la salle d’entraînement et rejoue avec les cartes binaires." },
    { min:.36, texte:"Certaines marches sont encore difficiles. Reprends les leçons dans l’ordre, et utilise les cartes : avec elles, le binaire devient un jeu." },
    { min:0,   texte:"Changer de base, c’est tout nouveau pour toi, et c’est normal ! Reprends doucement la leçon sur les compteurs, puis celle des cartes binaires." }
  ]
});
