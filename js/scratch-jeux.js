/* Blocs et petits jeux du cours sur Scratch (qcm/scratch.js).

   ScratchJeux.blocs(texte) dessine des blocs Scratch en HTML, à partir d’un texte simple :
     - une ligne par bloc, « catégorie: texte du bloc » (mouvement, apparence, son, evenement,
       controle, capteur, operateur, variable, stylo) ;
     - les blocs indentés de deux espaces vont DANS le bloc au-dessus (répéter, si… alors) ;
       « controle: sinon » ouvre la deuxième partie d’un si… alors… sinon ;
     - dans le texte : (10) une case blanche, [Bonjour] une case de texte, [espace v] un menu,
       {score} une variable (ou {capteur:réponse}, {operateur:nombre aléatoire entre (1) et (10)}),
       <touche (espace v) pressée ?> un bloc hexagonal (« < » et « > » entourés d’espaces restent du texte) ;
     - une ligne vide sépare deux scripts.
   Les jeux s’utilisent dans une leçon avec interactif:function(zone, signaler){ ScratchJeux.atelier(zone, signaler, {…}); } :
   ils appellent signaler(etat) après chaque action, ce qui coche les essais de la leçon. */
const ScratchJeux = (function(){
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function appeler(signaler, etat){ if(signaler) signaler(etat); }

  const CATEGORIES = ["mouvement", "apparence", "son", "evenement", "controle", "capteur", "operateur", "variable", "stylo"];
  const ALIAS = { op:"operateur", evenements:"evenement", capteurs:"capteur", variables:"variable" };
  function categorie(nom, defaut){
    nom = ALIAS[nom] || nom;
    return CATEGORIES.indexOf(nom) >= 0 ? nom : defaut;
  }

  /* ---------- dessiner des blocs à partir d’un texte ---------- */

  // Découpe le texte d’un bloc en morceaux : texte, (case), [texte], [menu v], {reporter}, <booléen>.
  function morceaux(s){
    let html = "", k = 0;
    function libre(c, avant, apres){ return /\s/.test(avant || " ") && /\s/.test(apres || " ") && (c === "<" || c === ">"); }
    function fermant(ouvre, depart){
      const ferme = { "(":")", "[":"]", "{":"}", "<":">" }[ouvre];
      let prof = 0;
      for(let j = depart; j < s.length; j++){
        const c = s[j];
        if((c === "<" || c === ">") && libre(c, s[j - 1], s[j + 1])) continue;
        if(c === ouvre) prof++;
        else if(c === ferme){ if(prof === 0) return j; prof--; }
      }
      return -1;
    }
    while(k < s.length){
      const c = s[k];
      if("([{<".indexOf(c) >= 0 && !(c === "<" && libre(c, s[k - 1], s[k + 1]))){
        const fin = fermant(c, k + 1);
        if(fin < 0){ html += esc(s.slice(k)); break; }
        const dedans = s.slice(k + 1, fin);
        html += champ(c, dedans);
        k = fin + 1;
        continue;
      }
      html += esc(c);
      k++;
    }
    return html;
  }

  function champ(c, dedans){
    if(c === "(") return '<span class="sb-nb">' + morceaux(dedans) + '</span>';
    if(c === "["){
      const menu = / v$/.test(dedans);
      return menu ? '<span class="sb-menu">' + esc(dedans.slice(0, -2)) + ' ▾</span>' : '<span class="sb-txt">' + esc(dedans) + '</span>';
    }
    const m = /^([a-z]+):(.*)$/.exec(dedans);
    if(c === "{"){
      const cat = m ? categorie(m[1], "variable") : "variable";
      return '<span class="sb-rep sb-' + cat + '">' + morceaux(m && categorie(m[1]) ? m[2] : dedans) + '</span>';
    }
    // Booléen : opérateur s’il compare ou combine, capteur sinon.
    let cat = m && categorie(m[1]), texte = cat ? m[2] : dedans;
    if(!cat) cat = /\s[=<>]\s|^non\s|\s(et|ou)\s/.test(texte) ? "operateur" : "capteur";
    return '<span class="sb-bool sb-' + cat + '">' + morceaux(texte) + '</span>';
  }

  function arbre(texte){
    const scripts = [[]];
    const pile = [];      // { indent, liste }
    texte.replace(/\r/g, "").split("\n").forEach(function(ligne){
      if(!ligne.trim()){
        if(scripts[scripts.length - 1].length){ scripts.push([]); pile.length = 0; }
        return;
      }
      const indent = ligne.match(/^ */)[0].length;
      const m = /^\s*([a-z]+):\s?(.*)$/.exec(ligne);
      const noeud = { cat:m ? categorie(m[1], "controle") : "controle", texte:m ? m[2] : ligne.trim(), bras:[[]] };
      while(pile.length && pile[pile.length - 1].indent >= indent) pile.pop();
      const parent = pile.length ? pile[pile.length - 1] : null;
      const liste = parent ? parent.noeud.bras[parent.noeud.bras.length - 1] : scripts[scripts.length - 1];
      if(noeud.texte === "sinon" && liste.length && liste[liste.length - 1].cat === "controle"){
        const si = liste[liste.length - 1];
        si.sinon = true;
        si.bras.push([]);
        pile.push({ indent:indent, noeud:si });
        return;
      }
      liste.push(noeud);
      pile.push({ indent:indent, noeud:noeud });
    });
    return scripts.filter(function(s){ return s.length; });
  }

  // Le HTML n’est-il qu’un seul <span> (de son début à sa fin) ?
  function unSeul(html){
    if(!/^<span class="sb-(rep|bool)/.test(html)) return false;
    let prof = 0;
    const re = /<\/?span\b[^>]*>/g;
    let m;
    while((m = re.exec(html))){
      prof += m[0][1] === "/" ? -1 : 1;
      if(prof === 0) return re.lastIndex === html.length;
    }
    return false;
  }

  function noeudHtml(n, premier){
    // Un bloc rond ou hexagonal tout seul (« {score} », « <touche le [bord v] ?> ») se dessine sans bloc autour.
    if(/^[{<].*[}>]$/.test(n.texte) && !n.bras[0].length){
      const seul = morceaux(n.texte);
      if(unSeul(seul)) return '<div class="sb-seul">' + seul + '</div>';
    }
    const chapeau = premier && /^quand\b/.test(n.texte);
    const c = n.sinon || n.bras[0].length;
    const classe = "sb-bloc sb-" + n.cat + (chapeau ? " sb-chapeau" : "");
    if(!c) return '<div class="' + classe + '">' + morceaux(n.texte) + '</div>';
    return '<div class="sb-c sb-' + n.cat + '">' +
      '<div class="' + classe + ' sb-tete">' + morceaux(n.texte) + '</div>' +
      n.bras.map(function(b, k){
        return (k ? '<div class="sb-bloc sb-' + n.cat + ' sb-milieu">sinon</div>' : '') +
               '<div class="sb-bras">' + listeHtml(b) + '</div>';
      }).join("") +
      '<div class="sb-pied"></div></div>';
  }

  function listeHtml(liste){
    if(!liste.length) return '<div class="sb-vide"></div>';
    return liste.map(function(n, k){ return noeudHtml(n, k === 0); }).join("");
  }

  function blocs(texte){
    return '<div class="sb-scripts">' + arbre(texte).map(function(s){
      return '<div class="sb-script">' + listeHtml(s) + '</div>';
    }).join("") + '</div>';
  }

  /* ---------- le chat (deux costumes) ---------- */
  function chatSvg(costume){
    const deux = costume === 1;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 20 152 166" aria-hidden="true">' +
      (deux ? '<path d="M170 150 q44 6 40 -44" fill="none" stroke="#E07A2E" stroke-width="12" stroke-linecap="round"/>'
            : '<path d="M170 150 q40 -10 30 -50" fill="none" stroke="#E07A2E" stroke-width="12" stroke-linecap="round"/>') +
      '<ellipse cx="120" cy="140" rx="52" ry="40" fill="#F08A3C"/>' +
      '<path d="M78 70 L84 30 L106 56 Z M162 70 L156 30 L134 56 Z" fill="#F08A3C"/>' +
      '<circle cx="120" cy="82" r="44" fill="#F08A3C"/>' +
      '<path d="M86 46 L88 38 L98 50 Z M154 46 L152 38 L142 50 Z" fill="#F7B6A4"/>' +
      (deux ? '<path d="M96 80 q8 -10 16 0 M128 80 q8 -10 16 0" fill="none" stroke="#17212B" stroke-width="4" stroke-linecap="round"/>'
            : '<ellipse cx="104" cy="78" rx="7" ry="10" fill="#17212B"/><ellipse cx="136" cy="78" rx="7" ry="10" fill="#17212B"/>' +
              '<circle cx="106" cy="74" r="2.5" fill="#fff"/><circle cx="138" cy="74" r="2.5" fill="#fff"/>') +
      '<path d="M114 94 h12 l-6 7 z" fill="#E0566B"/>' +
      '<path d="M120 101 q-6 8 -14 4 M120 101 q6 8 14 4" fill="none" stroke="#17212B" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M96 98 h-26 M96 104 h-24 M144 98 h26 M144 104 h24" stroke="#17212B" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="120" cy="150" rx="26" ry="20" fill="#FBD2A8"/>' +
      (deux ? '<ellipse cx="88" cy="172" rx="14" ry="8" fill="#F08A3C" transform="rotate(-25 88 172)"/><ellipse cx="152" cy="172" rx="14" ry="8" fill="#F08A3C" transform="rotate(25 152 172)"/>'
            : '<ellipse cx="100" cy="176" rx="14" ry="8" fill="#F08A3C"/><ellipse cx="140" cy="176" rx="14" ry="8" fill="#F08A3C"/>') +
      '</svg>';
  }

  /* ---------- une scène de 480 × 360, comme dans Scratch ---------- */
  // x va de -240 (à gauche) à 240 (à droite), y de -180 (en bas) à 180 (en haut).
  function scene(conteneur, options){
    options = options || {};
    conteneur.insertAdjacentHTML("beforeend",
      '<div class="sc-scene' + (options.grille ? ' grille' : '') + '">' +
        (options.grille ? '<div class="sc-axe sc-axe-x"></div><div class="sc-axe sc-axe-y"></div>' : '') +
        '<canvas class="sc-stylo" width="480" height="360"></canvas>' +
        '<div class="sc-objets"></div>' +
        '<div class="sc-lutin" role="img" aria-label="Le chat">' + chatSvg(0) + '</div>' +
        '<div class="sc-bulle" hidden></div>' +
      '</div>');
    const el = conteneur.lastElementChild;
    const lutin = el.querySelector(".sc-lutin"), bulle = el.querySelector(".sc-bulle");
    const ctx = el.querySelector(".sc-stylo").getContext("2d");
    const s = { x:0, y:0, dir:90, costume:0, stylo:false, el:el, lutin:lutin, taille:options.taille || 16 };
    lutin.style.width = s.taille + "%";
    function gauche(x){ return ((x + 240) / 480 * 100) + "%"; }
    function haut(y){ return ((180 - y) / 360 * 100) + "%"; }
    s.dessiner = function(){
      lutin.style.left = gauche(s.x);
      lutin.style.top = haut(s.y);
      // options.gaucheDroite : le lutin se retourne sans jamais avoir la tête en bas.
      lutin.style.transform = "translate(-50%,-50%) " +
        (options.gaucheDroite ? "scaleX(" + (s.dir < 0 ? -1 : 1) + ")" : "rotate(" + (s.dir - 90) + "deg)");
      if(!bulle.hidden){ bulle.style.left = gauche(Math.min(s.x + 20, 150)); bulle.style.top = haut(s.y + 50); }
    };
    s.costumeSuivant = function(){ s.costume = 1 - s.costume; lutin.innerHTML = chatSvg(s.costume); };
    s.dire = function(texte){
      bulle.hidden = texte === null || texte === "";
      bulle.textContent = texte || "";
      s.dessiner();
    };
    s.trait = function(x1, y1, x2, y2){
      ctx.strokeStyle = "#2447E8"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x1 + 240, 180 - y1); ctx.lineTo(x2 + 240, 180 - y2); ctx.stroke();
    };
    s.effacer = function(){ ctx.clearRect(0, 0, 480, 360); };
    s.objet = function(emoji, x, y, nom){
      const o = document.createElement("div");
      o.className = "sc-objet";
      o.textContent = emoji;
      o.setAttribute("aria-label", nom || emoji);
      o.style.left = gauche(x); o.style.top = haut(y);
      el.querySelector(".sc-objets").appendChild(o);
      return o;
    };
    // Coordonnées Scratch du point cliqué.
    s.point = function(ev){
      const r = el.getBoundingClientRect();
      return { x:Math.round((ev.clientX - r.left) / r.width * 480 - 240), y:Math.round(180 - (ev.clientY - r.top) / r.height * 360) };
    };
    s.dessiner();
    return s;
  }

  function borne(v, min, max){ return Math.max(min, Math.min(max, v)); }
  function arrondi(v){ return Math.round(v * 100) / 100; }
  function nombre(v){
    const n = parseFloat(String(v).replace(",", "."));
    return isFinite(n) ? n : 0;
  }
  function direction(d){
    d = ((d + 180) % 360 + 360) % 360 - 180;
    return d === -180 ? 180 : d;
  }

  /* ---------- l’interface de Scratch ---------- */
  const ZONES = [
    { id:"scene", nom:"la scène", role:"C’est là que le programme se joue : les sprites y bougent, parlent et dessinent. Elle mesure 480 pas de large et 360 de haut." },
    { id:"scripts", nom:"la zone des scripts", role:"On y assemble les blocs, comme des briques, pour écrire le programme du sprite choisi." },
    { id:"palette", nom:"la palette des blocs", role:"Tous les blocs de la catégorie choisie. On les fait glisser vers la zone des scripts." },
    { id:"drapeau", nom:"le drapeau vert", role:"Il lance le programme : tous les scripts qui commencent par « quand 🏁 est cliqué » démarrent en même temps." },
    { id:"lutins", nom:"la liste des sprites", role:"Les personnages et les objets du projet, qu’on appelle des sprites (ou des lutins). Clique sur un sprite pour voir et modifier SES scripts : chaque sprite a les siens." },
    { id:"categories", nom:"les catégories de blocs", role:"Mouvement en bleu, Apparence en violet, Événements en jaune, Contrôle en orange… Chaque catégorie a sa couleur." },
    { id:"stop", nom:"le bouton stop", role:"Le panneau rouge arrête tous les scripts d’un coup." },
    { id:"onglets", nom:"les onglets Code, Costumes et Sons", role:"Code pour les scripts, Costumes pour dessiner ou changer l’apparence du sprite, Sons pour ses bruitages." },
    { id:"fonds", nom:"les arrière-plans", role:"Les décors de la scène. Un projet peut en avoir plusieurs et passer de l’un à l’autre." }
  ];

  function interfaceScratch(zone, signaler){
    const etat = { trouvees:new Set(), erreurs:0, fini:false };
    let n = 0;
    function z(id, html, classe){
      return '<div class="sc-z ' + (classe || "") + '" data-z="' + id + '" role="button" tabindex="0">' + html + '</div>';
    }
    zone.innerHTML =
      '<p class="ia-consigne" id="sc-ui-q"></p>' +
      '<div class="sc-ui">' +
        z("onglets", '<span class="sc-logo">Scratch</span><span class="sc-onglet on">Code</span><span class="sc-onglet">Costumes</span><span class="sc-onglet">Sons</span>', "sc-ui-haut") +
        z("categories", ["mouvement", "apparence", "son", "evenement", "controle", "capteur", "operateur", "variable"].map(function(c){
          return '<i class="sc-pastille sb-' + c + '"></i>';
        }).join(""), "sc-ui-cats") +
        z("palette", blocs("mouvement: avancer de (10) pas\n\nmouvement: tourner ↻ de (15) degrés\n\nmouvement: aller à x: (0) y: (0)"), "sc-ui-palette") +
        z("scripts", blocs("evenement: quand 🏁 est cliqué\nmouvement: avancer de (10) pas\napparence: dire [Bonjour !] pendant (2) secondes"), "sc-ui-scripts") +
        '<div class="sc-ui-droite">' +
          '<div class="sc-ui-boutons">' + z("drapeau", "🏁", "sc-ui-btn") + z("stop", "⏹", "sc-ui-btn stop") + '</div>' +
          z("scene", '<div class="sc-ui-chat">' + chatSvg(0) + '</div>', "sc-ui-scene") +
          '<div class="sc-ui-bas">' +
            z("lutins", '<span class="sc-ui-vignette">' + chatSvg(0) + '<b>Chat</b></span><span class="sc-ui-plus">＋</span>', "sc-ui-lutins") +
            z("fonds", '<b>Scène</b><span>🏞️</span>', "sc-ui-fonds") +
          '</div>' +
        '</div>' +
      '</div>' +
      '<p class="ia-note" id="sc-ui-info" aria-live="polite">Clique sur une partie de l’écran de Scratch.</p>' +
      '<p class="ia-score" id="sc-ui-score"></p>';
    const q = zone.querySelector("#sc-ui-q"), info = zone.querySelector("#sc-ui-info"), score = zone.querySelector("#sc-ui-score");
    function question(){
      if(n >= ZONES.length){
        etat.fini = true;
        q.innerHTML = "🎉 Tu connais tout l’écran de Scratch ! Clique encore où tu veux pour revoir à quoi sert chaque partie.";
      }
      else q.innerHTML = "🔎 Où se trouve <b>" + esc(ZONES[n].nom) + "</b> ? Clique dessus.";
      score.textContent = etat.trouvees.size + " / " + ZONES.length + " trouvées" + (etat.erreurs ? " · " + etat.erreurs + " erreur" + (etat.erreurs > 1 ? "s" : "") : "");
    }
    function choisir(id){
      const zz = ZONES.find(function(x){ return x.id === id; });
      zone.querySelectorAll(".sc-z").forEach(function(e){ e.classList.toggle("vue", e.dataset.z === id); });
      if(n < ZONES.length && id === ZONES[n].id){
        etat.trouvees.add(id);
        zone.querySelector('[data-z="' + id + '"]').classList.add("trouvee");
        info.innerHTML = "✅ Oui, c’est <b>" + esc(zz.nom) + "</b>. " + esc(zz.role);
        n++;
      } else if(n < ZONES.length){
        etat.erreurs++;
        info.innerHTML = "❌ Non, ça c’est <b>" + esc(zz.nom) + "</b> : " + esc(zz.role) + " Cherche encore <b>" + esc(ZONES[n].nom) + "</b>.";
      } else info.innerHTML = "👉 <b>" + esc(zz.nom.charAt(0).toUpperCase() + zz.nom.slice(1)) + "</b> : " + esc(zz.role);
      question();
      appeler(signaler, etat);
    }
    zone.querySelectorAll(".sc-z").forEach(function(e){
      e.onclick = function(ev){ ev.stopPropagation(); choisir(e.dataset.z); };
      e.onkeydown = function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); choisir(e.dataset.z); } };
    });
    question();
  }

  /* ---------- les coordonnées ---------- */
  // options : { cibles:[{ x, y }] } : des points à trouver, l’un après l’autre.
  function coordonnees(zone, signaler, options){
    const cibles = (options && options.cibles) || [];
    const etat = { vus:[], x:0, y:0, cibles:0 };
    zone.innerHTML =
      '<p class="ia-consigne">Clique sur la scène : le chat y va, et Scratch te donne ses coordonnées. Tu peux aussi les taper dans le bloc.</p>' +
      '<div class="sc-coord-haut">' +
        '<form class="sb-bloc sb-mouvement sc-aller" id="sc-aller">aller à x: <input class="sb-champ" id="sc-x" value="0" aria-label="x" inputmode="numeric"> y: <input class="sb-champ" id="sc-y" value="0" aria-label="y" inputmode="numeric"> <button class="minikey" type="submit">▶</button></form>' +
        '<span class="sc-souris" id="sc-souris" aria-live="off">souris : x: 0 y: 0</span>' +
      '</div>' +
      '<div id="sc-boite"></div>' +
      (cibles.length ? '<p class="ia-note" id="sc-cible" aria-live="polite"></p>' : '');
    const s = scene(zone.querySelector("#sc-boite"), { grille:true, taille:14 });
    s.el.insertAdjacentHTML("beforeend",
      '<span class="sc-rep d">x: 240</span><span class="sc-rep g">x: -240</span>' +
      '<span class="sc-rep h">y: 180</span><span class="sc-rep b">y: -180</span><span class="sc-rep c">(0, 0)</span>');
    let marque = null, k = 0;
    function cible(){
      const zc = zone.querySelector("#sc-cible");
      if(!zc) return;
      if(marque) marque.remove();
      if(k >= cibles.length){ zc.innerHTML = "🎉 Toutes les étoiles sont trouvées !"; return; }
      marque = s.objet("⭐", cibles[k].x, cibles[k].y, "étoile");
      zc.innerHTML = "⭐ Mission " + (k + 1) + " / " + cibles.length + " : une étoile est cachée à <b>x: " + cibles[k].x + " y: " + cibles[k].y + "</b>. Trouve-la, puis amène le chat dessus !";
      marque.style.opacity = "0";
    }
    function aller(x, y){
      s.x = borne(Math.round(x), -240, 240); s.y = borne(Math.round(y), -180, 180);
      s.dessiner();
      zone.querySelector("#sc-x").value = s.x; zone.querySelector("#sc-y").value = s.y;
      etat.x = s.x; etat.y = s.y; etat.vus.push({ x:s.x, y:s.y });
      if(k < cibles.length && Math.abs(s.x - cibles[k].x) <= 20 && Math.abs(s.y - cibles[k].y) <= 20){
        marque.style.opacity = "1";
        k++; etat.cibles = k;
        setTimeout(cible, 900);
      }
      appeler(signaler, etat);
    }
    s.el.addEventListener("click", function(ev){ const p = s.point(ev); aller(p.x, p.y); });
    s.el.addEventListener("mousemove", function(ev){
      const p = s.point(ev);
      zone.querySelector("#sc-souris").textContent = "souris : x: " + p.x + " y: " + p.y;
    });
    zone.querySelector("#sc-aller").onsubmit = function(ev){
      ev.preventDefault();
      aller(nombre(zone.querySelector("#sc-x").value), nombre(zone.querySelector("#sc-y").value));
    };
    cible();
  }

  /* ---------- l’atelier : assembler des blocs et lancer le programme ---------- */
  const BLOCS = {
    avancer:  { cat:"mouvement", txt:"avancer de % pas", def:[10] },
    droite:   { cat:"mouvement", txt:"tourner ↻ de % degrés", def:[15] },
    gauche:   { cat:"mouvement", txt:"tourner ↺ de % degrés", def:[15] },
    allerA:   { cat:"mouvement", txt:"aller à x: % y: %", def:[0, 0] },
    orienter: { cat:"mouvement", txt:"s’orienter à %", def:[90] },
    dire:     { cat:"apparence", txt:"dire % pendant % secondes", def:["Bonjour !", 2], texte:[0] },
    costume:  { cat:"apparence", txt:"costume suivant", def:[] },
    attendre: { cat:"controle",  txt:"attendre % secondes", def:[1] },
    repeter:  { cat:"controle",  txt:"répéter % fois", def:[10], c:true },
    stylo:    { cat:"stylo",     txt:"stylo en position d’écriture", def:[] },
    relever:  { cat:"stylo",     txt:"relever le stylo", def:[] },
    effacer:  { cat:"stylo",     txt:"effacer tout", def:[] }
  };

  // Les formes dessinées au stylo : on cherche des chemins fermés aux côtés égaux et aux angles égaux.
  function formes(segments){
    const trouvees = new Set();
    const pres = function(a, b){ return Math.abs(a.x - b.x) < 1.5 && Math.abs(a.y - b.y) < 1.5; };
    // Les traits qui se suivent forment des chemins ; deux traits dans la même direction n’en font qu’un.
    const chemins = [];
    segments.forEach(function(sg){
      if(Math.hypot(sg.b.x - sg.a.x, sg.b.y - sg.a.y) < 0.01) return;
      const ch = chemins[chemins.length - 1];
      const dernier = ch && ch[ch.length - 1];
      if(!dernier || !pres(dernier.b, sg.a)){ chemins.push([{ a:sg.a, b:sg.b }]); return; }
      const v1 = Math.atan2(dernier.b.y - dernier.a.y, dernier.b.x - dernier.a.x), v2 = Math.atan2(sg.b.y - sg.a.y, sg.b.x - sg.a.x);
      if(Math.abs(direction((v1 - v2) * 180 / Math.PI)) < 0.1) dernier.b = sg.b;
      else ch.push({ a:sg.a, b:sg.b });
    });
    chemins.forEach(function(ch){
      let n = -1;
      for(let k = 2; k < ch.length; k++) if(pres(ch[k].b, ch[0].a)){ n = k + 1; break; }
      if(n < 3) return;
      const cotes = ch.slice(0, n);
      const long = cotes.map(function(c){ return Math.hypot(c.b.x - c.a.x, c.b.y - c.a.y); });
      if(long.some(function(l){ return Math.abs(l - long[0]) > Math.max(1.5, long[0] * 0.02); })) return;
      const angles = cotes.map(function(c, k){
        const d = cotes[(k + 1) % n];
        const t = Math.atan2(d.b.y - d.a.y, d.b.x - d.a.x) - Math.atan2(c.b.y - c.a.y, c.b.x - c.a.x);
        return Math.abs(direction(t * 180 / Math.PI));
      });
      if(angles.some(function(a){ return Math.abs(a - angles[0]) > 1; })) return;
      if(n === 3) trouvees.add("triangle");
      else if(n === 4) trouvees.add(Math.abs(angles[0] - 90) < 1 ? "carre" : "losange");
      else if(n === 5) trouvees.add(Math.abs(angles[0] - 144) < 1 ? "etoile" : "pentagone");
      else if(n === 6) trouvees.add("hexagone");
      else if(n >= 12) trouvees.add("cercle");
      else trouvees.add("polygone");
    });
    return trouvees;
  }

  // options : { blocs:[noms], depart:[blocs], etoile:{x,y}, chat:{x,y,dir}, stylo:false }
  function atelier(zone, signaler, options){
    options = options || {};
    const noms = options.blocs || Object.keys(BLOCS);
    const chat = options.chat || { x:0, y:0, dir:90 };
    let id = 0;
    function noeud(b, v, e){ return { id:++id, b:b, v:(v || BLOCS[b].def).slice(), e:BLOCS[b].c ? (e || []) : null }; }
    function copier(liste){ return (liste || []).map(function(n){ return noeud(n.b, n.v, copier(n.e)); }); }
    let script = copier(options.depart);
    let curseur = { chemin:"", index:script.length };
    const etat = { executions:0, enCours:false, dits:[], etoile:false, formes:new Set(), boucle:false,
                   costumes:0, attentes:0, x:chat.x, y:chat.y, dir:chat.dir, nbBlocs:0, blocs:new Set() };

    zone.innerHTML =
      '<p class="ia-consigne">Clique sur un bloc de la <b>palette</b> pour l’ajouter au script, à l’endroit marqué <span class="sb-fente-ex">▸ ici</span> ' +
      '(clique entre deux blocs pour changer d’endroit). Change les nombres dans les cases blanches, puis clique sur 🏁 pour lancer le programme.</p>' +
      '<div class="sc-atelier">' +
        '<div class="sc-palette"><p class="sc-titre">Palette</p>' + noms.map(function(b){
          const d = BLOCS[b];
          return '<button type="button" class="sb-bloc sb-' + d.cat + ' sc-ajout" data-b="' + b + '">' + gabarit(d, d.def, false) + '</button>';
        }).join("") + '</div>' +
        '<div class="sc-script"><p class="sc-titre">Script du chat</p><div id="sc-script"></div></div>' +
      '</div>' +
      '<div class="sc-commandes">' +
        '<button type="button" class="minikey wire sc-go" id="sc-go" aria-label="Lancer le programme">🏁 Lancer</button>' +
        '<button type="button" class="minikey" id="sc-stop" aria-label="Arrêter">⏹ Stop</button>' +
        '<button type="button" class="minikey" id="sc-depart">↺ Chat au départ</button>' +
        '<label class="sc-lent"><input type="checkbox" id="sc-lent"> 🐢 Au ralenti</label>' +
        '<span class="sc-pos" id="sc-pos"></span>' +
      '</div>' +
      '<div id="sc-boite"></div>' +
      '<p class="ia-note" id="sc-msg" aria-live="polite" hidden></p>';

    const s = scene(zone.querySelector("#sc-boite"), { taille:15 });
    let etoile = options.etoile ? s.objet("⭐", options.etoile.x, options.etoile.y, "étoile") : null;
    const boite = zone.querySelector("#sc-script"), msg = zone.querySelector("#sc-msg");
    function auDepart(){
      s.x = chat.x; s.y = chat.y; s.dir = chat.dir; s.stylo = false; s.dire(null);
      if(s.costume) s.costumeSuivant();
      if(etoile) etoile.classList.remove("attrapee");
      position();
    }
    function position(){
      s.dessiner();
      zone.querySelector("#sc-pos").textContent = "x: " + Math.round(s.x) + "  y: " + Math.round(s.y) + "  direction: " + Math.round(s.dir);
    }

    function gabarit(d, v, editable, nid){
      let k = 0;
      return esc(d.txt).replace(/%/g, function(){
        const n = k++, texte = d.texte && d.texte.indexOf(n) >= 0;
        if(!editable) return '<span class="' + (texte ? "sb-txt" : "sb-nb") + '">' + esc(v[n]) + '</span>';
        return '<input class="sb-champ' + (texte ? ' texte' : '') + '" data-n="' + nid + '" data-k="' + n + '" value="' + esc(v[n]) + '"' +
               ' size="' + Math.max(2, String(v[n]).length) + '" aria-label="valeur ' + (n + 1) + '"' + (texte ? '' : ' inputmode="decimal"') + '>';
      });
    }
    function listeDe(chemin){
      let liste = script;
      if(chemin) chemin.split(".").forEach(function(k){ liste = liste[+k].e; });
      return liste;
    }
    function fente(chemin, index){
      const ici = curseur.chemin === chemin && curseur.index === index;
      return '<button type="button" class="sb-fente' + (ici ? ' ici' : '') + '" data-c="' + chemin + '" data-i="' + index + '" aria-label="Ajouter les blocs ici">' + (ici ? '▸ ici' : '') + '</button>';
    }
    function listeScript(liste, chemin){
      let html = fente(chemin, 0);
      liste.forEach(function(n, k){
        const d = BLOCS[n.b], suppr = '<button type="button" class="sb-suppr" data-c="' + chemin + '" data-i="' + k + '" aria-label="Enlever ce bloc">✕</button>';
        const tete = '<div class="sb-bloc sb-' + d.cat + (d.c ? ' sb-tete' : '') + '" data-id="' + n.id + '">' + gabarit(d, n.v, true, n.id) + suppr + '</div>';
        html += d.c
          ? '<div class="sb-c sb-' + d.cat + '">' + tete + '<div class="sb-bras">' + listeScript(n.e, (chemin ? chemin + "." : "") + k) + '</div><div class="sb-pied"></div></div>'
          : tete;
        html += fente(chemin, k + 1);
      });
      return html;
    }
    function trouver(nid, liste){
      for(const n of liste || script){
        if(n.id === nid) return n;
        const r = n.e && trouver(nid, n.e);
        if(r) return r;
      }
      return null;
    }
    function compter(liste){ return liste.reduce(function(a, n){ return a + 1 + (n.e ? compter(n.e) : 0); }, 0); }
    function rendre(){
      boite.innerHTML = '<div class="sb-script sc-edition"><div class="sb-bloc sb-evenement sb-chapeau">quand 🏁 est cliqué</div>' + listeScript(script, "") + '</div>';
      boite.querySelectorAll(".sb-fente").forEach(function(b){
        b.onclick = function(){ curseur = { chemin:b.dataset.c, index:+b.dataset.i }; rendre(); };
      });
      boite.querySelectorAll(".sb-suppr").forEach(function(b){
        b.onclick = function(){
          if(etat.enCours) arreter();
          const liste = listeDe(b.dataset.c), k = +b.dataset.i;
          liste.splice(k, 1);
          curseur = { chemin:b.dataset.c, index:k };
          rendre();
        };
      });
      boite.querySelectorAll(".sb-champ").forEach(function(c){
        c.oninput = function(){
          const n = trouver(+c.dataset.n);
          if(n) n.v[+c.dataset.k] = c.value;
          c.size = Math.max(2, c.value.length);
        };
      });
      etat.nbBlocs = compter(script);
    }
    zone.querySelectorAll(".sc-ajout").forEach(function(b){
      b.onclick = function(){
        if(etat.enCours) arreter();
        const n = noeud(b.dataset.b);
        const liste = listeDe(curseur.chemin);
        if(curseur.index > liste.length) curseur.index = liste.length;
        liste.splice(curseur.index, 0, n);
        // Après une boucle, on continue dedans : c’est là qu’on veut presque toujours ajouter.
        curseur = n.e ? { chemin:(curseur.chemin ? curseur.chemin + "." : "") + curseur.index, index:0 }
                      : { chemin:curseur.chemin, index:curseur.index + 1 };
        rendre();
        appeler(signaler, etat);
      };
    });

    /* l’exécution */
    let generation = 0, compteur = 0;
    const STOP = {};
    function pause(ms, gen){
      return new Promise(function(ok, ko){
        setTimeout(function(){ if(gen !== generation || !zone.isConnected) ko(STOP); else ok(); }, ms);
      });
    }
    function surligner(nid){
      boite.querySelectorAll(".sb-actif").forEach(function(e){ e.classList.remove("sb-actif"); });
      const e = nid && boite.querySelector('[data-id="' + nid + '"]');
      if(e) e.classList.add("sb-actif");
    }
    function aller(x, y, run){
      const a = { x:s.x, y:s.y };
      s.x = borne(x, -240, 240); s.y = borne(y, -180, 180);
      if(s.stylo){
        s.trait(a.x, a.y, s.x, s.y);
        run.segments.push({ a:a, b:{ x:s.x, y:s.y } });
      }
      if(etoile && Math.hypot(s.x - options.etoile.x, s.y - options.etoile.y) < 35){
        run.etoile = true;
        etoile.classList.add("attrapee");
      }
      position();
    }
    async function executer(liste, run, gen){
      for(const n of liste){
        if(gen !== generation) throw STOP;
        if(++compteur > 20000){ run.trop = true; throw STOP; }
        const v = n.v;
        surligner(n.id);
        run.blocs.add(n.b);
        switch(n.b){
          case "avancer": {
            const r = s.dir * Math.PI / 180, pas = nombre(v[0]);
            aller(arrondi(s.x + pas * Math.sin(r)), arrondi(s.y + pas * Math.cos(r)), run);
            break;
          }
          case "droite": s.dir = direction(s.dir + nombre(v[0])); position(); break;
          case "gauche": s.dir = direction(s.dir - nombre(v[0])); position(); break;
          case "allerA": aller(nombre(v[0]), nombre(v[1]), run); break;
          case "orienter": s.dir = direction(nombre(v[0])); position(); break;
          case "dire":
            s.dire(String(v[0]));
            run.dits.push(String(v[0]));
            await pause(Math.max(0, nombre(v[1])) * 1000, gen);
            s.dire(null);
            break;
          case "costume": s.costumeSuivant(); run.costumes++; break;
          case "attendre": run.attentes++; await pause(Math.max(0, nombre(v[0])) * 1000, gen); break;
          case "stylo": s.stylo = true; break;
          case "relever": s.stylo = false; break;
          case "effacer": s.effacer(); break;
          case "repeter": {
            run.boucle = true;
            const fois = Math.max(0, Math.round(nombre(v[0])));
            for(let k = 0; k < fois; k++){
              await executer(n.e, run, gen);
              surligner(n.id);
              await pause(1000 / 30, gen);   // comme Scratch : l’écran se redessine à chaque tour de boucle
            }
            break;
          }
        }
        if(zone.querySelector("#sc-lent").checked) await pause(350, gen);
      }
    }
    function arreter(){
      generation++;
      etat.enCours = false;
      surligner(null);
      s.dire(null);
    }
    async function lancer(){
      arreter();
      const gen = generation;
      compteur = 0;
      const run = { dits:[], segments:[], blocs:new Set(), etoile:false, boucle:false, costumes:0, attentes:0 };
      etat.enCours = true;
      msg.hidden = true;
      if(etoile) etoile.classList.remove("attrapee");
      let fini = false;
      try{ await executer(script, run, gen); fini = true; }
      catch(e){ if(e !== STOP) throw e; }
      if(gen === generation){ etat.enCours = false; surligner(null); }
      if(run.trop){ msg.hidden = false; msg.textContent = "⚠️ Ton programme était très long : il a été arrêté. Mets moins de tours dans tes boucles."; }
      if(!fini && !run.trop) return;
      etat.executions++;
      run.dits.forEach(function(t){ etat.dits.push(t); });
      if(run.etoile) etat.etoile = true;
      formes(run.segments).forEach(function(f){ if(run.boucle) etat.formes.add(f); else etat.formes.add(f + "-sans-boucle"); });
      if(run.boucle) etat.boucle = true;
      etat.costumes = Math.max(etat.costumes, run.costumes);
      etat.attentes = Math.max(etat.attentes, run.attentes);
      etat.anime = etat.anime || (run.costumes >= 4 && run.attentes >= 2);
      etat.marche = etat.marche || (run.boucle && run.costumes >= 4 && run.blocs.has("avancer") && run.attentes >= 2);
      etat.x = s.x; etat.y = s.y; etat.dir = s.dir;
      etat.blocs = run.blocs;
      appeler(signaler, etat);
    }
    zone.querySelector("#sc-go").onclick = lancer;
    zone.querySelector("#sc-stop").onclick = arreter;
    zone.querySelector("#sc-depart").onclick = function(){ arreter(); auDepart(); };
    rendre();
    auDepart();
  }

  /* ---------- le chat au clavier : événements et conditions ---------- */
  const SCRIPTS_CLAVIER =
`evenement: quand la touche [flèche droite v] est pressée
mouvement: s’orienter à (90)
mouvement: avancer de (20) pas

evenement: quand la touche [flèche gauche v] est pressée
mouvement: s’orienter à (-90)
mouvement: avancer de (20) pas

evenement: quand ce sprite est cliqué
apparence: costume suivant
apparence: dire [Miaou !] pendant (1) secondes

evenement: quand 🏁 est cliqué
mouvement: aller à x: (0) y: (-90)
controle: répéter indéfiniment
  controle: si <touche le [pointeur de souris v] ?> alors
    apparence: dire [Ça chatouille !]
  controle: sinon
    apparence: dire []
  controle: si <touche le [bord v] ?> alors
    apparence: dire [Aïe, le bord !] pendant (1) secondes
    mouvement: aller à x: (0) y: (-90)`;

  function clavier(zone, signaler){
    const etat = { touches:new Set(), clics:0, bord:0, drapeau:0, souris:false };
    zone.innerHTML =
      '<p class="ia-consigne">Voici les scripts du chat. Clique sur 🏁, puis clique sur la scène et utilise les flèches <kbd>←</kbd> <kbd>→</kbd> du clavier (ou les boutons). ' +
      'Observe quel script se déclenche !</p>' +
      '<div class="sc-deux"><div class="sc-voir" id="sc-voir">' + blocs(SCRIPTS_CLAVIER) + '</div>' +
      '<div><div class="sc-commandes">' +
        '<button type="button" class="minikey wire" id="sc-go">🏁 Lancer</button>' +
        '<button type="button" class="minikey" id="sc-stop">⏹ Stop</button>' +
        '<button type="button" class="minikey" id="sc-g" aria-label="Flèche gauche">←</button>' +
        '<button type="button" class="minikey" id="sc-d" aria-label="Flèche droite">→</button>' +
      '</div><div id="sc-boite"></div><p class="sc-pos" id="sc-pos">Le programme est arrêté : clique sur 🏁.</p></div></div>';
    const s = scene(zone.querySelector("#sc-boite"), { taille:18, gaucheDroite:true });
    s.el.tabIndex = 0;
    s.el.setAttribute("aria-label", "La scène : utilise les flèches gauche et droite");
    s.y = -90; s.dessiner();
    let marche = false, minuterie = null, finBulle = 0, survol = false;
    const scripts = zone.querySelectorAll("#sc-voir .sb-script");
    function eclairer(k){
      scripts[k].classList.remove("sb-eclaire");
      void scripts[k].offsetWidth;
      scripts[k].classList.add("sb-eclaire");
    }
    function pos(t){ zone.querySelector("#sc-pos").textContent = t || "x: " + s.x + "  y: " + s.y; }
    function dire(t, secondes){ s.dire(t); finBulle = secondes ? Date.now() + secondes * 1000 : 0; }
    function fleche(sens){
      etat.touches.add(sens > 0 ? "droite" : "gauche");
      eclairer(sens > 0 ? 0 : 1);
      s.dir = sens > 0 ? 90 : -90;
      s.x = borne(s.x + 20 * sens, -240, 240);
      s.dessiner();
      pos();
      appeler(signaler, etat);
    }
    function boucle(){
      if(!zone.isConnected || !marche) return;
      if(finBulle && Date.now() > finBulle) dire(null);
      if(!finBulle){
        if(survol){ dire("Ça chatouille !"); etat.souris = true; }
        else s.dire(null);
      }
      if(Math.abs(s.x) >= 205){
        etat.bord++;
        eclairer(3);
        dire("Aïe, le bord !", 1);
        s.x = 0; s.y = -90;
        s.dessiner();
        pos();
        appeler(signaler, etat);
      }
    }
    zone.querySelector("#sc-go").onclick = function(){
      marche = true; etat.drapeau++;
      eclairer(3);
      s.x = 0; s.y = -90; s.dir = 90; s.dessiner(); dire(null);
      clearInterval(minuterie); minuterie = setInterval(boucle, 1000 / 30);
      pos(); s.el.focus();
      appeler(signaler, etat);
    };
    zone.querySelector("#sc-stop").onclick = function(){ marche = false; clearInterval(minuterie); dire(null); pos("Le programme est arrêté : clique sur 🏁."); };
    zone.querySelector("#sc-g").onclick = function(){ fleche(-1); };
    zone.querySelector("#sc-d").onclick = function(){ fleche(1); };
    // Comme dans Scratch, les scripts « quand la touche… » marchent même si le drapeau n’a pas été cliqué.
    s.el.addEventListener("keydown", function(ev){
      if(ev.key === "ArrowRight" || ev.key === "ArrowLeft"){ ev.preventDefault(); fleche(ev.key === "ArrowRight" ? 1 : -1); }
    });
    s.lutin.addEventListener("click", function(ev){
      ev.stopPropagation();
      etat.clics++;
      eclairer(2);
      s.costumeSuivant();
      dire("Miaou !", 1);
      appeler(signaler, etat);
    });
    s.lutin.addEventListener("mouseenter", function(){ survol = true; });
    s.lutin.addEventListener("mouseleave", function(){ survol = false; });
  }

  /* ---------- une variable : le score ---------- */
  const SCRIPTS_SCORE =
`evenement: quand 🏁 est cliqué
variable: mettre [score v] à (0)
mouvement: aller à x: (0) y: (0)

evenement: quand ce sprite est cliqué
variable: ajouter (1) à [score v]
mouvement: aller à x: {operateur:nombre aléatoire entre (-200) et (200)} y: {operateur:nombre aléatoire entre (-140) et (140)}
controle: si <{score} = (10)> alors
  apparence: dire [Bravo, 10 points !] pendant (2) secondes`;

  function score(zone, signaler){
    const etat = { score:0, maxi:0, remis:0, remisApres:false, clics:0 };
    zone.innerHTML =
      '<p class="ia-consigne">Le chat a une <b>variable</b> : <code>score</code>. Lis ses scripts, puis attrape-le en cliquant dessus. Regarde la boîte orange en haut de la scène !</p>' +
      '<div class="sc-deux"><div class="sc-voir" id="sc-voir">' + blocs(SCRIPTS_SCORE) + '</div>' +
      '<div><div class="sc-commandes"><button type="button" class="minikey wire" id="sc-go">🏁 Lancer</button></div><div id="sc-boite"></div></div></div>';
    const s = scene(zone.querySelector("#sc-boite"), { taille:15 });
    s.el.insertAdjacentHTML("beforeend", '<div class="sc-moniteur">score <b id="sc-score">0</b></div>');
    const scripts = zone.querySelectorAll("#sc-voir .sb-script");
    function eclairer(k){
      scripts[k].classList.remove("sb-eclaire");
      void scripts[k].offsetWidth;
      scripts[k].classList.add("sb-eclaire");
    }
    function maj(){ zone.querySelector("#sc-score").textContent = etat.score; appeler(signaler, etat); }
    zone.querySelector("#sc-go").onclick = function(){
      eclairer(0);
      if(etat.score > 0) etat.remisApres = true;
      etat.score = 0; etat.remis++;
      s.x = 0; s.y = 0; s.dessiner(); s.dire(null);
      maj();
    };
    s.lutin.addEventListener("click", function(ev){
      ev.stopPropagation();
      eclairer(1);
      etat.score++; etat.clics++;
      etat.maxi = Math.max(etat.maxi, etat.score);
      s.x = Math.round(Math.random() * 400 - 200); s.y = Math.round(Math.random() * 280 - 140);
      s.dessiner();
      if(etat.score === 10){ s.dire("Bravo, 10 points !"); setTimeout(function(){ s.dire(null); }, 2000); }
      maj();
    });
  }

  return { blocs:blocs, chatSvg:chatSvg, interface:interfaceScratch, coordonnees:coordonnees, atelier:atelier,
           clavier:clavier, score:score, formes:formes };
})();
