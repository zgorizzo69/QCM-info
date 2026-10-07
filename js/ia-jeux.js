/* Petits jeux interactifs du cours sur l’IA (qcm/ia-securite.js).
   Une leçon les utilise avec interactif:function(zone, signaler){ IAJeux.tokens(zone, signaler); } :
   le jeu se dessine dans la zone et appelle signaler(etat) après chaque action, ce qui coche
   les essais de la leçon. Tous les chiffres affichés sont des exemples simplifiés. */
const IAJeux = (function(){
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function melange(a){
    const c = a.slice();
    for(let k = c.length - 1; k > 0; k--){ const j = Math.floor(Math.random() * (k + 1)); [c[k], c[j]] = [c[j], c[k]]; }
    return c;
  }

  function pourcent(p){
    if(p > 0 && p < 1) return "< 1 %";
    return (Math.round(p * 10) / 10).toLocaleString("fr-FR") + " %";
  }

  // Barres de probabilité : [{ mot, p (en %) }], la plus probable en premier.
  function barres(liste, marque){
    return '<ul class="ia-barres">' + liste.map(function(x){
      return '<li class="' + (x.mot === marque ? "marque" : "") + '"><span class="ia-mot">' + esc(x.mot) + '</span>' +
             '<span class="ia-piste"><span style="width:' + Math.max(1, Math.min(100, x.p)) + '%"></span></span>' +
             '<span class="ia-pct">' + pourcent(x.p) + '</span></li>';
    }).join("") + '</ul>';
  }

  function appeler(signaler, etat){ if(signaler) signaler(etat); }

  /* ---------- IA ou LLM ? ---------- */
  const EXEMPLES = [
    { txt:"💬 Un chatbot qui répond à tes questions (ChatGPT, Claude, Le Chat…)", llm:true,
      e:"Il lit ta question et écrit une réponse, mot après mot : c’est un LLM." },
    { txt:"📸 Le téléphone qui se déverrouille en reconnaissant ton visage", llm:false,
      e:"Elle analyse une image de ton visage, pas du texte : c’est une IA, mais pas un LLM." },
    { txt:"🎬 Les vidéos qu’on te conseille sur une plateforme de vidéos", llm:false,
      e:"C’est un système de recommandation : il apprend tes goûts à partir de ce que tu regardes." },
    { txt:"📝 Un outil qui résume un long texte en trois phrases", llm:true,
      e:"Lire un texte et en écrire un autre : c’est le travail d’un LLM." },
    { txt:"🎨 Une IA qui dessine un chat à partir d’une phrase", llm:false,
      e:"Elle fabrique une image par « diffusion » : c’est une autre sorte d’IA, que tu verras plus loin." },
    { txt:"🚗 Une voiture qui freine toute seule devant un piéton", llm:false,
      e:"Elle analyse les images de ses caméras et ses capteurs : c’est une IA, pas un LLM." },
    { txt:"✍️ Un assistant qui écrit un poème sur ton chat", llm:true,
      e:"Écrire un poème, mot après mot : c’est un LLM." },
    { txt:"♟️ Un programme qui te bat aux échecs", llm:false,
      e:"Il calcule des coups sur un plateau, sans lire ni écrire de texte." }
  ];

  function trier(zone, signaler){
    const etat = { classes:0, justes:0, total:EXEMPLES.length };
    zone.innerHTML =
      '<p class="ia-consigne">Pour chaque exemple, est-ce un <b>LLM</b> (un modèle qui lit et écrit du texte) ou une <b>autre sorte d’IA</b> ?</p>' +
      '<ul class="ia-tri">' + EXEMPLES.map(function(x, n){
        return '<li data-n="' + n + '"><span class="ia-tri-txt">' + esc(x.txt) + '</span>' +
               '<span class="ia-tri-btns">' +
                 '<button type="button" class="minikey" data-llm="1">💬 LLM</button>' +
                 '<button type="button" class="minikey" data-llm="0">🤖 Autre IA</button>' +
               '</span><span class="ia-tri-e"></span></li>';
      }).join("") + '</ul>' +
      '<p class="ia-score" aria-live="polite"></p>';
    const score = zone.querySelector(".ia-score");
    zone.querySelectorAll(".ia-tri li").forEach(function(li){
      li.querySelectorAll("button").forEach(function(b){
        b.onclick = function(){
          const x = EXEMPLES[+li.dataset.n];
          const juste = (b.dataset.llm === "1") === x.llm;
          li.querySelectorAll("button").forEach(function(o){ o.disabled = true; });
          b.classList.add(juste ? "ia-ok" : "ia-non");
          li.querySelector(".ia-tri-e").innerHTML = (juste ? "✅ " : "❌ ") + esc(x.e);
          etat.classes++;
          if(juste) etat.justes++;
          score.textContent = etat.justes + " / " + etat.classes + " bien classé" + (etat.justes > 1 ? "s" : "") +
            (etat.classes === etat.total ? " · Tous les LLM sont des IA, mais toutes les IA ne sont pas des LLM !" : "");
          appeler(signaler, etat);
        };
      });
    });
  }

  /* ---------- découpeur de tokens ---------- */
  // Un découpeur simplifié qui imite les vrais : les mots courants forment un seul token,
  // les mots rares sont coupés en morceaux fréquents. Chaque vrai modèle a son propre découpage.
  const MOTS = new Set((
    "le la les un une des de du d l j m t s n c qu et à a au aux en est es sont suis il elle ils elles je tu nous vous on ce cet " +
    "cette ces mon ton son ma ta sa mes tes ses qui que quoi dans sur sous avec pour par pas ne plus très bien bon bonne " +
    "chat chats chien chiens maison école jour nuit soleil lune eau lait pain fois était être avoir fait faire va vais vas " +
    "aime aimes mange manges boit dort joue petit petite grand grande beau belle rouge bleu vert noir blanc orange france " +
    "paris bonjour merci oui non salut ami amie amis classe cours livre mot mots phrase texte jeu jeux film musique " +
    "the and is of to in it you hello cat dog my name ia llm modèle question réponse"
  ).split(" "));
  const MORCEAUX = (
    "anti constit ution tion tions sion ment ments nelle elle elles ique iques isme able ible eur eurs euse teur trice " +
    "age ages ance ence ette ier ière oir oire ais ait aient ons ont ez ent ant er ir re ré pré dé des con com pro trans " +
    "inter super ordin ateur intel ligence artific ielle gén ér ation ion es ex in im un mal sur ch ou an on en ai au eau " +
    "info form mat app pel atique ati ole ine ure ise ence str aw berry oi ei qu gr pl tr cr br fr pr st ll ss tt mm nn ph th oy ille ail eil ouil ard ert our ous ul ol il al el ar or ir"
  ).split(" ").sort(function(a, b){ return b.length - a.length; });

  function decouperMot(mot){
    const bas = mot.toLowerCase();
    if(MOTS.has(bas)) return [mot];
    const res = [];
    let k = 0;
    while(k < mot.length){
      const m = MORCEAUX.find(function(x){ return bas.startsWith(x, k); });
      const n = m ? m.length : Math.min(2, mot.length - k);   // sinon, une paire de lettres
      res.push(mot.slice(k, k + n));
      k += n;
    }
    return res;
  }

  function decouper(texte){
    const tokens = [];
    const re = /(\s*)([A-Za-zÀ-ÖØ-öø-ÿŒœ]+|\d{1,3}|[^\sA-Za-zÀ-ÖØ-öø-ÿŒœ\d])/g;
    let m;
    while((m = re.exec(texte))){
      const espace = m[1] ? " " : "";
      const bouts = /[A-Za-zÀ-ÿŒœ]/.test(m[2]) ? decouperMot(m[2]) : [m[2]];
      bouts.forEach(function(b, n){ tokens.push((n === 0 ? espace : "") + b); });
    }
    return tokens;
  }

  // Numéro stable pour chaque token, comme dans le vocabulaire d’un vrai modèle (≈ 100 000 tokens).
  function numero(tok){
    let h = 2166136261;
    for(let k = 0; k < tok.length; k++){ h ^= tok.charCodeAt(k); h = Math.imul(h, 16777619); }
    return 100 + ((h >>> 0) % 99800);
  }

  function tokens(zone, signaler){
    const etat = { texte:"", tokens:[], nb:0 };
    zone.innerHTML =
      '<label class="ia-consigne" for="ia-texte">Écris une phrase : elle est découpée en tokens, en direct.</label>' +
      '<textarea class="champ ia-texte" id="ia-texte" rows="2" spellcheck="false">Le chat de Léa boit du lait. Anticonstitutionnellement !</textarea>' +
      '<p class="ia-stats" aria-live="polite"></p>' +
      '<div class="ia-tokens"></div>' +
      '<p class="ia-consigne"><b>Ce que voit vraiment le modèle :</b> des numéros, un par token.</p>' +
      '<p class="ia-numeros"></p>';
    const ta = zone.querySelector("textarea");
    const stats = zone.querySelector(".ia-stats");
    const boite = zone.querySelector(".ia-tokens");
    const numeros = zone.querySelector(".ia-numeros");
    function maj(){
      etat.texte = ta.value;
      etat.tokens = decouper(ta.value);
      etat.nb = etat.tokens.length;
      stats.innerHTML = '<b>' + [...ta.value].length + '</b> caractères → <b>' + etat.nb + '</b> token' + (etat.nb > 1 ? 's' : '');
      boite.innerHTML = etat.tokens.map(function(t, n){
        return '<span class="ia-token c' + (n % 5) + '" title="token n° ' + numero(t) + '">' +
               (t[0] === " " ? '<i>·</i>' + esc(t.slice(1)) : esc(t)) + '</span>';
      }).join("");
      numeros.textContent = "[" + etat.tokens.map(numero).join(", ") + "]";
      appeler(signaler, etat);
    }
    ta.addEventListener("input", maj);
    maj();
  }

  /* ---------- jeu du mot suivant ---------- */
  const MANCHES = [
    { debut:"Il était une…", mots:[["fois",92],["princesse",3],["histoire",2],["belle",1]] },
    { debut:"Je me brosse les…", mots:[["dents",86],["cheveux",10],["mains",2],["chaussures",0.4]] },
    { debut:"Après la pluie, le beau…", mots:[["temps",91],["soleil",4],["jour",1],["chat",0.2]] },
    { debut:"Pour faire des crêpes, il faut de la farine, des œufs et du…", mots:[["lait",71],["sucre",14],["beurre",9],["sel",2]] },
    { debut:"Ce matin, au petit-déjeuner, j’ai mangé une…", mots:[["tartine",24],["pomme",19],["banane",13],["crêpe",9]],
      note:"Ici, plusieurs mots sont possibles : le modèle hésite. C’est pour ça qu’il tire un peu au hasard parmi les plus probables, et que ses réponses changent d’une fois à l’autre." },
    { debut:"La capitale de l’Italie est…", mots:[["Rome",94],["Milan",3],["Venise",1],["Florence",0.5]],
      note:"Le modèle ne « sait » pas que c’est vrai : « Rome » est simplement le mot qui suit le plus souvent cette phrase dans les textes qu’il a lus." },
    { debut:"Le premier humain à avoir marché sur Mars s’appelle…", mots:[["Neil",18],["John",9],["Thomas",6],["Elon",5]],
      note:"Piège ! Personne n’a encore marché sur Mars. Mais le modèle propose quand même un prénom probable, avec assurance : c’est comme ça que naissent les hallucinations." }
  ];

  function devinette(zone, signaler){
    const etat = { faites:0, trouvees:0, total:MANCHES.length };
    let n = 0;
    function manche(){
      const m = MANCHES[n];
      zone.innerHTML =
        '<p class="ia-consigne">Manche ' + (n + 1) + ' sur ' + MANCHES.length + ' · Devine le mot le plus probable, comme un LLM !</p>' +
        '<p class="ia-debut">' + esc(m.debut) + ' <span class="ia-trou">?</span></p>' +
        '<div class="ia-choix">' + melange(m.mots).map(function(x){
          return '<button type="button" class="minikey" data-mot="' + esc(x[0]) + '">' + esc(x[0]) + '</button>';
        }).join("") + '</div>' +
        '<div class="ia-apres"></div>' +
        '<p class="ia-score">' + etat.trouvees + ' / ' + etat.faites + ' trouvé' + (etat.trouvees > 1 ? 's' : '') + '</p>';
      zone.querySelectorAll(".ia-choix button").forEach(function(b){
        b.onclick = function(){ reponse(b.dataset.mot); };
      });
    }
    function reponse(mot){
      const m = MANCHES[n];
      const meilleur = m.mots[0][0];
      const reste = Math.max(0, 100 - m.mots.reduce(function(a, x){ return a + x[1]; }, 0));
      etat.faites++;
      if(mot === meilleur) etat.trouvees++;
      zone.querySelectorAll(".ia-choix button").forEach(function(b){
        b.disabled = true;
        if(b.dataset.mot === meilleur) b.classList.add("ia-ok");
        else if(b.dataset.mot === mot) b.classList.add("ia-non");
      });
      zone.querySelector(".ia-trou").textContent = meilleur;
      const fin = (n === MANCHES.length - 1);
      zone.querySelector(".ia-apres").innerHTML =
        '<p><b>' + (mot === meilleur ? "🎯 Bravo, tu penses comme un LLM !" : "🤖 Le LLM aurait choisi « " + esc(meilleur) + " ».") + '</b></p>' +
        barres(m.mots.map(function(x){ return { mot:x[0], p:x[1] }; }).concat(reste ? [{ mot:"autres mots", p:reste }] : []), mot) +
        (m.note ? '<p class="ia-note">💡 ' + esc(m.note) + '</p>' : '') +
        '<button type="button" class="minikey wire" id="ia-suivant">' + (fin ? "Voir mon score" : "Manche suivante") + '</button>';
      zone.querySelector(".ia-score").textContent = etat.trouvees + " / " + etat.faites + " trouvé" + (etat.trouvees > 1 ? "s" : "");
      zone.querySelector("#ia-suivant").onclick = function(){
        if(!fin){ n++; manche(); return; }
        zone.innerHTML =
          '<p class="ia-debut">🏆 ' + etat.trouvees + ' / ' + etat.total + ' mots trouvés</p>' +
          '<p>Un LLM joue à ce jeu des milliers de fois pour écrire une seule réponse : il devine un token, l’ajoute au texte, puis devine le suivant.</p>' +
          '<button type="button" class="minikey wire" id="ia-rejouer">Rejouer</button>';
        zone.querySelector("#ia-rejouer").onclick = function(){ n = 0; etat.faites = 0; etat.trouvees = 0; manche(); };
      };
      appeler(signaler, etat);
    }
    manche();
  }

  /* ---------- mini-modèle : compter quel mot suit quel autre ---------- */
  function motsDe(phrase){
    return phrase.toLowerCase().replace(/[’']/g, "’ ").match(/[a-zà-ÿœ’]+|[.!?]/g) || [];
  }

  // n = nombre de mots regardés avant de deviner (1 ou 2).
  function Modele(phrases, n){
    const table = {};
    phrases.forEach(function(ph){
      const m = motsDe(ph);
      for(let k = n; k < m.length; k++){
        const cle = m.slice(k - n, k).join(" ");
        const suivants = table[cle] || (table[cle] = {});
        suivants[m[k]] = (suivants[m[k]] || 0) + 1;
      }
    });
    return {
      // Les suites possibles, de la plus probable à la moins probable, avec leur part en %.
      predire: function(contexte){
        const s = table[contexte.toLowerCase().trim()];
        if(!s) return [];
        const total = Object.values(s).reduce(function(a, b){ return a + b; }, 0);
        return Object.keys(s).map(function(mot, ordre){ return { mot:mot, nb:s[mot], p:s[mot] / total * 100, ordre:ordre }; })
                     .sort(function(a, b){ return b.nb - a.nb || a.ordre - b.ordre; });
      }
    };
  }

  const PHRASES_DEPART = [
    "Le chat dort sur le canapé.",
    "Le chat mange des croquettes.",
    "Le chien mange sa pâtée.",
    "Le chien joue dans le jardin.",
    "Le chat joue avec une balle."
  ];

  function entrainement(zone, signaler){
    const phrases = PHRASES_DEPART.slice();
    const etat = { ajoutees:0, phrases:phrases, meilleur:function(mot){ const p = Modele(phrases, 1).predire(mot); return p.length ? p[0].mot : null; } };
    zone.innerHTML =
      '<div class="ia-deux">' +
        '<div><p class="ia-consigne"><b>📚 Les textes d’entraînement</b></p>' +
          '<ol class="ia-livre"></ol>' +
          '<form class="ia-ajout"><label class="sr" for="ia-phrase">Nouvelle phrase</label>' +
            '<input class="champ" id="ia-phrase" maxlength="80" autocomplete="off" placeholder="Ex. : le chat danse sous la pluie">' +
            '<button class="minikey wire" type="submit">Ajouter</button></form></div>' +
        '<div><p class="ia-consigne"><b>🧠 Ce que le modèle a retenu</b></p>' +
          '<label class="ia-consigne" for="ia-mot">Après le mot</label> ' +
          '<input class="champ ia-court" id="ia-mot" value="chat" maxlength="20" autocomplete="off">' +
          '<span class="ia-consigne">, il devine :</span>' +
          '<div class="ia-predit"></div></div>' +
      '</div>';
    const livre = zone.querySelector(".ia-livre");
    const motCle = zone.querySelector("#ia-mot");
    const predit = zone.querySelector(".ia-predit");
    function maj(){
      livre.innerHTML = phrases.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join("");
      const mot = (motsDe(motCle.value).pop() || "");
      const p = Modele(phrases, 1).predire(mot);
      predit.innerHTML = p.length ? barres(p.slice(0, 6))
        : '<p class="ia-note">Le modèle n’a jamais lu « ' + esc(mot || "…") + ' » suivi d’un autre mot : il ne peut rien deviner. Ajoute une phrase qui le contient !</p>';
      appeler(signaler, etat);
    }
    zone.querySelector(".ia-ajout").onsubmit = function(ev){
      ev.preventDefault();
      const champ = zone.querySelector("#ia-phrase");
      const txt = champ.value.trim();
      if(motsDe(txt).length < 2) return;
      phrases.push(txt);
      etat.ajoutees++;
      champ.value = "";
      maj();
      livre.lastElementChild.classList.add("nouveau");
    };
    motCle.addEventListener("input", maj);
    maj();
  }

  /* ---------- inférence : écrire une réponse, token après token ---------- */
  const HISTOIRES = [
    "Il était une fois un petit chat qui vivait dans une grande maison.",
    "Il était une fois une princesse qui vivait dans un château.",
    "Il était une fois un dragon qui avait peur du noir.",
    "Le petit chat aimait jouer dans le jardin.",
    "Le petit chat trouva une clé magique dans le jardin.",
    "Le dragon trouva un ami dans le château.",
    "La princesse aimait lire dans le jardin.",
    "La princesse trouva un dragon qui avait faim.",
    "Un jour, le petit chat partit à l’aventure.",
    "Un jour, la princesse partit à l’aventure avec le dragon.",
    "Le dragon avait peur des souris.",
    "Ils vécurent heureux."
  ];
  const DEBUTS = ["Il était une fois", "La princesse", "Le dragon", "Un jour, le petit chat"];

  function inference(zone, signaler){
    const modele = Modele(HISTOIRES, 2);
    const etat = { generes:0, hasard:0, finies:0 };
    let texte = [], fini = false;

    zone.innerHTML =
      '<p class="ia-consigne">Ce mini-modèle a lu ' + HISTOIRES.length + ' petites histoires. Choisis un début, puis fais-le écrire, token après token.</p>' +
      '<div class="ia-choix" id="ia-debuts">' + DEBUTS.map(function(d){
        return '<button type="button" class="minikey" data-debut="' + esc(d) + '">' + esc(d) + '…</button>';
      }).join("") + '</div>' +
      '<p class="ia-debut" id="ia-gen" aria-live="polite"></p>' +
      '<div id="ia-cand"></div>' +
      '<div class="ia-choix">' +
        '<button type="button" class="minikey wire" id="ia-top">👉 Prendre le plus probable</button>' +
        '<button type="button" class="minikey" id="ia-hasard">🎲 Laisser le hasard choisir</button>' +
      '</div>' +
      '<p class="ia-score" id="ia-compte"></p>';

    const gen = zone.querySelector("#ia-gen");
    const cand = zone.querySelector("#ia-cand");
    const btTop = zone.querySelector("#ia-top");
    const btHasard = zone.querySelector("#ia-hasard");

    function phrase(){
      return texte.join(" ").replace(/ ([.,!?])/g, "$1").replace(/’ /g, "’").replace(/^./, function(c){ return c.toUpperCase(); });
    }
    function candidats(){ return modele.predire(texte.slice(-2).join(" ")); }

    function maj(nouveau){
      const c = fini ? [] : candidats();
      if(!fini && !c.length) fini = true;
      gen.innerHTML = esc(phrase()).replace(new RegExp(esc(nouveau || "\u0000") + "([.!?]?)$"), '<mark>' + esc(nouveau || "") + '</mark>$1') +
                      (fini ? ' <span class="ia-fin">■ fin</span>' : ' <span class="ia-trou">?</span>');
      cand.innerHTML = fini
        ? '<p class="ia-note">✅ Le modèle a choisi le token de fin : sa réponse est terminée. Tu peux recommencer avec un autre début.</p>'
        : '<p class="ia-consigne">Le modèle regarde les deux derniers mots, « ' + esc(texte.slice(-2).join(" ")) + ' », et calcule :</p>' +
          barres(c.map(function(x){ return { mot:x.mot === "." ? "■ fin (.)" : x.mot, p:x.p }; }));
      btTop.disabled = btHasard.disabled = fini;
      zone.querySelector("#ia-compte").textContent = etat.generes + " token" + (etat.generes > 1 ? "s" : "") + " écrit" + (etat.generes > 1 ? "s" : "") +
        (etat.finies ? " · " + etat.finies + " réponse" + (etat.finies > 1 ? "s" : "") + " terminée" + (etat.finies > 1 ? "s" : "") : "");
    }

    function ajouter(mot){
      texte.push(mot);
      etat.generes++;
      if(mot === "." || texte.length > 30){ fini = true; etat.finies++; }
      maj(mot === "." ? null : mot);
      appeler(signaler, etat);
    }

    function demarrer(debut){
      texte = motsDe(debut);
      fini = false;
      maj();
    }

    btTop.onclick = function(){ const c = candidats(); if(c.length) ajouter(c[0].mot); };
    btHasard.onclick = function(){
      const c = candidats();
      if(!c.length) return;
      let r = Math.random() * 100, k = 0;
      while(k < c.length - 1 && r >= c[k].p){ r -= c[k].p; k++; }
      etat.hasard++;
      ajouter(c[k].mot);
    };
    zone.querySelectorAll("[data-debut]").forEach(function(b){
      b.onclick = function(){ demarrer(b.dataset.debut); };
    });
    demarrer(DEBUTS[0]);
  }

  /* ---------- vrai ou inventé ? ---------- */
  const CONVERSATIONS = [
    { q:"Qui a inventé la trottinette volante en 1850 ?",
      r:"La trottinette volante a été inventée en 1850 par l’ingénieur lyonnais Hector Bellamy, lors de l’Exposition des machines de Paris.",
      vrai:false,
      e:"Tout est inventé : Hector Bellamy n’existe pas, et la trottinette volante non plus. La phrase ressemble à une vraie réponse, car le modèle sait comment on raconte l’histoire : un nom, une ville, une date, un événement." },
    { q:"Quelle est la capitale de l’Australie ?",
      r:"La capitale de l’Australie est Canberra, et non Sydney, comme on le croit souvent.",
      vrai:true,
      e:"C’est vrai : Canberra est bien la capitale. Mais tu ne pouvais le savoir qu’en vérifiant ! Une réponse juste et une réponse inventée ont exactement le même air sûr d’elle." },
    { q:"Donne-moi un livre pour mon exposé sur les volcans.",
      r:"Je te conseille « Volcans endormis, volcans réveillés » de Paul Fumerolle, paru en 2014 aux éditions du Cratère.",
      vrai:false,
      e:"Inventé ! Le titre, l’auteur et l’éditeur sont plausibles… mais n’existent pas. Les fausses références sont l’une des hallucinations les plus fréquentes : vérifie toujours dans un catalogue de bibliothèque." },
    { q:"Combien de pattes a une araignée ?",
      r:"Une araignée a huit pattes. C’est ce qui la distingue des insectes, qui en ont six.",
      vrai:true,
      e:"C’est vrai : huit pattes pour une araignée, six pour un insecte. Cette fois, les mots probables étaient aussi les mots vrais." },
    { q:"Quel record du monde a battu le footballeur Kylian Mbappé en 2009 ?",
      r:"En 2009, Kylian Mbappé a battu le record du monde du plus jeune buteur en Coupe du monde, à seulement 10 ans.",
      vrai:false,
      e:"Inventé ! En 2009, il avait 10 ans et ne jouait pas en Coupe du monde. Le modèle a mélangé des morceaux vrais (le joueur, les records) pour fabriquer une histoire fausse." }
  ];

  function vraiOuInvente(zone, signaler){
    const etat = { repondues:0, justes:0, total:CONVERSATIONS.length };
    let n = 0;
    function conv(){
      const c = CONVERSATIONS[n];
      zone.innerHTML =
        '<p class="ia-consigne">Conversation ' + (n + 1) + ' sur ' + CONVERSATIONS.length + ' · Vrai ou inventé ?</p>' +
        '<div class="ia-chat">' +
          '<p class="ia-bulle moi"><span>🧒</span>' + esc(c.q) + '</p>' +
          '<p class="ia-bulle robot"><span>🤖</span>' + esc(c.r) + '</p>' +
        '</div>' +
        '<div class="ia-choix">' +
          '<button type="button" class="minikey" data-vrai="1">✅ Vrai</button>' +
          '<button type="button" class="minikey" data-vrai="0">🤥 Inventé !</button>' +
        '</div><div class="ia-apres"></div>' +
        '<p class="ia-score">' + etat.justes + ' / ' + etat.repondues + '</p>';
      zone.querySelectorAll("[data-vrai]").forEach(function(b){
        b.onclick = function(){
          const juste = (b.dataset.vrai === "1") === c.vrai;
          etat.repondues++;
          if(juste) etat.justes++;
          zone.querySelectorAll("[data-vrai]").forEach(function(o){ o.disabled = true; });
          b.classList.add(juste ? "ia-ok" : "ia-non");
          const fin = (n === CONVERSATIONS.length - 1);
          zone.querySelector(".ia-apres").innerHTML =
            '<p><b>' + (juste ? "Bien vu ! " : "Raté ! ") + (c.vrai ? "C’était vrai." : "C’était inventé.") + '</b></p>' +
            '<p class="ia-note">' + esc(c.e) + '</p>' +
            (fin ? '<p><b>Score : ' + etat.justes + ' / ' + etat.total + '.</b> Sans vérifier, impossible d’être sûr : c’est tout le problème !</p>'
                 : '<button type="button" class="minikey wire" id="ia-suivant">Conversation suivante</button>');
          zone.querySelector(".ia-score").textContent = etat.justes + " / " + etat.repondues;
          if(!fin) zone.querySelector("#ia-suivant").onclick = function(){ n++; conv(); };
          appeler(signaler, etat);
        };
      });
    }
    conv();
  }

  /* ---------- diffusion : du bruit au chat ---------- */
  // Le même chat que img/chat.svg, recopié ici : une image chargée depuis un fichier local
  // empêcherait de lire ses pixels dans le canvas.
  const CHAT_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" width="240" height="200">' +
    '<rect width="240" height="200" fill="#CDE7F7"/><circle cx="200" cy="40" r="22" fill="#FFD54A"/>' +
    '<rect y="160" width="240" height="40" fill="#8BC97A"/>' +
    '<path d="M170 150 q40 -10 30 -50" fill="none" stroke="#E07A2E" stroke-width="12" stroke-linecap="round"/>' +
    '<ellipse cx="120" cy="140" rx="52" ry="40" fill="#F08A3C"/>' +
    '<path d="M78 70 L84 30 L106 56 Z M162 70 L156 30 L134 56 Z" fill="#F08A3C"/>' +
    '<circle cx="120" cy="82" r="44" fill="#F08A3C"/>' +
    '<path d="M86 46 L88 38 L98 50 Z M154 46 L152 38 L142 50 Z" fill="#F7B6A4"/>' +
    '<ellipse cx="104" cy="78" rx="7" ry="10" fill="#17212B"/><ellipse cx="136" cy="78" rx="7" ry="10" fill="#17212B"/>' +
    '<circle cx="106" cy="74" r="2.5" fill="#fff"/><circle cx="138" cy="74" r="2.5" fill="#fff"/>' +
    '<path d="M114 94 h12 l-6 7 z" fill="#E0566B"/>' +
    '<path d="M120 101 q-6 8 -14 4 M120 101 q6 8 14 4" fill="none" stroke="#17212B" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M96 98 h-26 M96 104 h-24 M144 98 h26 M144 104 h24" stroke="#17212B" stroke-width="2" stroke-linecap="round"/>' +
    '<ellipse cx="120" cy="150" rx="26" ry="20" fill="#FBD2A8"/>' +
    '<ellipse cx="100" cy="176" rx="14" ry="8" fill="#F08A3C"/><ellipse cx="140" cy="176" rx="14" ry="8" fill="#F08A3C"/></svg>';
  const L = 240, H = 200, ETAPES = 10;
  // Les grandes formes apparaissent d’abord, les détails à la fin : taille des « pavés » à chaque étape.
  const PAVES = [1, 40, 28, 20, 14, 10, 7, 5, 3, 2, 1];

  function diffusion(zone, signaler){
    const etat = { etape:0, max:ETAPES, nouveaux:0, vues:new Set([0]) };
    zone.innerHTML =
      '<p class="ia-consigne">Phrase demandée : <b>« un chat orange assis dans l’herbe, au soleil »</b></p>' +
      '<div class="ia-diff">' +
        '<canvas width="' + L + '" height="' + H + '" aria-label="Image en cours de création"></canvas>' +
        '<div class="ia-diff-cote">' +
          '<p class="ia-debut" id="ia-etape"></p>' +
          '<label class="ia-consigne" for="ia-curseur">⬅️ ajouter du bruit · enlever du bruit ➡️</label>' +
          '<input type="range" id="ia-curseur" min="0" max="' + ETAPES + '" step="1" value="0">' +
          '<div class="ia-choix">' +
            '<button type="button" class="minikey wire" id="ia-debruiter">✨ Enlever un peu de bruit</button>' +
            '<button type="button" class="minikey" id="ia-tout">▶️ Tout débruiter</button>' +
            '<button type="button" class="minikey" id="ia-bruit">🎲 Nouveau bruit</button>' +
          '</div>' +
          '<p class="ia-note" id="ia-explique"></p>' +
        '</div>' +
      '</div>';
    const canvas = zone.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const curseur = zone.querySelector("#ia-curseur");
    const etiquette = zone.querySelector("#ia-etape");
    const explique = zone.querySelector("#ia-explique");
    let chat = null, bruit = null, minuterie = null;

    function nouveauBruit(){
      bruit = new Float32Array(L * H * 3);
      for(let k = 0; k < bruit.length; k++) bruit[k] = (Math.random() + Math.random() + Math.random()) / 3;
    }

    // Le chat « flouté » en pavés de taille t (la moyenne des couleurs de chaque pavé).
    function pave(t){
      if(t <= 1) return chat;
      const out = new Float32Array(L * H * 3);
      for(let y0 = 0; y0 < H; y0 += t) for(let x0 = 0; x0 < L; x0 += t){
        const s = [0, 0, 0]; let n = 0;
        for(let y = y0; y < Math.min(H, y0 + t); y++) for(let x = x0; x < Math.min(L, x0 + t); x++){
          const k = (y * L + x) * 3; s[0] += chat[k]; s[1] += chat[k + 1]; s[2] += chat[k + 2]; n++;
        }
        for(let y = y0; y < Math.min(H, y0 + t); y++) for(let x = x0; x < Math.min(L, x0 + t); x++){
          const k = (y * L + x) * 3; out[k] = s[0] / n; out[k + 1] = s[1] / n; out[k + 2] = s[2] / n;
        }
      }
      return out;
    }

    function dessiner(){
      const t = etat.etape;
      const a = t / ETAPES;           // part de l’image ; le reste est du bruit
      const img = ctx.createImageData(L, H);
      const base = chat ? pave(PAVES[t]) : null;
      for(let p = 0; p < L * H; p++){
        for(let c = 0; c < 3; c++){
          const v = base ? a * base[p * 3 + c] + (1 - a) * bruit[p * 3 + c] : bruit[p * 3 + c];
          img.data[p * 4 + c] = Math.max(0, Math.min(255, v * 255));
        }
        img.data[p * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      curseur.value = t;
      etiquette.textContent = "Étape " + t + " / " + ETAPES + " · bruit : " + Math.round((1 - a) * 100) + " %";
      explique.textContent =
        t === 0 ? "Au départ : rien que du bruit, tiré au hasard. Aucune image n’est cachée dedans !" :
        t <= 3 ? "Les grandes taches de couleur apparaissent : le ciel en haut, l’herbe en bas, une forme orange au milieu…" :
        t <= 7 ? "La forme se précise : à chaque étape, le modèle enlève le bruit qui ne ressemble pas à « un chat orange »." :
        t < ETAPES ? "Les détails arrivent en dernier : les yeux, les moustaches, le nez." :
                     "Terminé : le bruit est devenu un chat ! 🐱";
      zone.querySelector("#ia-debruiter").disabled = (t === ETAPES);
    }

    function aller(t){
      etat.etape = Math.max(0, Math.min(ETAPES, t));
      etat.vues.add(etat.etape);
      dessiner();
      appeler(signaler, etat);
    }

    function stop(){ clearInterval(minuterie); minuterie = null; }

    zone.querySelector("#ia-debruiter").onclick = function(){ stop(); aller(etat.etape + 1); };
    zone.querySelector("#ia-bruit").onclick = function(){ stop(); nouveauBruit(); etat.nouveaux++; aller(0); };
    zone.querySelector("#ia-tout").onclick = function(){
      stop();
      if(etat.etape === ETAPES) aller(0);
      minuterie = setInterval(function(){
        if(!canvas.isConnected || etat.etape >= ETAPES) return stop();
        aller(etat.etape + 1);
      }, 350);
    };
    curseur.addEventListener("input", function(){ stop(); aller(+curseur.value); });

    nouveauBruit();
    dessiner();
    const image = new Image();
    const url = URL.createObjectURL(new Blob([CHAT_SVG], { type:"image/svg+xml" }));
    image.onload = function(){
      const tmp = document.createElement("canvas");
      tmp.width = L; tmp.height = H;
      const c2 = tmp.getContext("2d");
      c2.drawImage(image, 0, 0, L, H);
      const d = c2.getImageData(0, 0, L, H).data;
      chat = new Float32Array(L * H * 3);
      for(let p = 0; p < L * H; p++) for(let c = 0; c < 3; c++) chat[p * 3 + c] = d[p * 4 + c] / 255;
      URL.revokeObjectURL(url);
      dessiner();
    };
    image.src = url;
  }

  return {
    trier:trier, tokens:tokens, devinette:devinette, entrainement:entrainement,
    inference:inference, vraiOuInvente:vraiOuInvente, diffusion:diffusion,
    decouper:decouper
  };
})();
