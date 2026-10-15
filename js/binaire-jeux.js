/* Petits jeux du cours sur le binaire (qcm/binaire.js).
   Comme pour js/ia-jeux.js, une leçon les monte avec interactif:function(zone, signaler){ … } :
   le jeu se dessine dans la zone et appelle signaler(etat) après chaque action. */
const BinaireJeux = (function(){
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }
  function appeler(signaler, etat){ if(signaler) signaler(etat); }
  function binaire(n, chiffres){ return n.toString(2).padStart(chiffres || 1, "0"); }
  function auHasard(min, max){ return min + Math.floor(Math.random() * (max - min + 1)); }

  /* ---------- les ampoules : toutes les combinaisons ---------- */
  function ampoules(zone, signaler){
    let n = 2;
    let allumees = [];
    const vues = { 1:new Set(), 2:new Set(), 3:new Set(), 4:new Set() };
    const etat = { n:n, par:{ 1:0, 2:0, 3:0, 4:0 } };

    function code(){ return allumees.map(function(a){ return a ? "1" : "0"; }).join(""); }
    function dessiner(){
      const total = Math.pow(2, n);
      zone.innerHTML =
        '<div class="bin-reglage"><span>Nombre d’ampoules :</span>' +
          '<button type="button" class="minikey" id="bin-moins" ' + (n <= 1 ? "disabled" : "") + '>−</button>' +
          '<b>' + n + '</b>' +
          '<button type="button" class="minikey" id="bin-plus" ' + (n >= 4 ? "disabled" : "") + '>+</button></div>' +
        '<div class="bin-ampoules">' + allumees.map(function(a, k){
          return '<button type="button" class="bin-ampoule' + (a ? " on" : "") + '" data-k="' + k + '" aria-pressed="' + a + '"' +
                 ' aria-label="Ampoule ' + (k + 1) + ' ' + (a ? "allumée" : "éteinte") + '">' +
                 '<span class="bin-bulbe">💡</span><span class="bin-bit">' + (a ? 1 : 0) + '</span></button>';
        }).join("") + '</div>' +
        '<p class="ia-debut">Le code de ce message : <span class="bin-code">' + code() + '</span></p>' +
        '<p class="ia-score">Combinaisons trouvées avec ' + n + ' ampoule' + (n > 1 ? "s" : "") + ' : ' + vues[n].size + ' / ' +
          (vues[n].size === total ? total + ' 🎉 Tu les as toutes !' : '?') + '</p>' +
        '<div class="bin-trouvees">' + Array.from(vues[n]).sort().map(function(c){ return '<span>' + c + '</span>'; }).join("") + '</div>';
      zone.querySelectorAll(".bin-ampoule").forEach(function(b){
        b.onclick = function(){ allumees[+b.dataset.k] = !allumees[+b.dataset.k]; noter(); dessiner(); };
      });
      const moins = zone.querySelector("#bin-moins"), plus = zone.querySelector("#bin-plus");
      moins.onclick = function(){ changer(n - 1); };
      plus.onclick = function(){ changer(n + 1); };
    }
    function noter(){
      vues[n].add(code());
      etat.n = n;
      [1, 2, 3, 4].forEach(function(k){ etat.par[k] = vues[k].size; });
      appeler(signaler, etat);
    }
    function changer(m){
      n = Math.max(1, Math.min(4, m));
      allumees = new Array(n).fill(false);
      noter();
      dessiner();
    }
    changer(n);
  }

  /* ---------- les compteurs kilométriques ---------- */
  const CHIFFRES = "0123456789ABCDEF";
  const NOMS = { 10:"Décimal (base 10)", 2:"Binaire (base 2)", 16:"Hexadécimal (base 16)" };
  const TAILLES = { 10:3, 2:8, 16:2 };

  // options : { bases:[10, 2, 16] }
  function compteurs(zone, signaler, options){
    const bases = (options && options.bases) || [10, 2];
    const max = 255;
    let valeur = 0, minuterie = null, avant = {};
    const etat = { valeur:0, vus:new Set([0]) };

    zone.innerHTML =
      '<div class="bin-compteurs">' + bases.map(function(b){
        return '<div class="bin-compteur" data-base="' + b + '"><p class="bin-nom">' + NOMS[b] + '</p>' +
               '<div class="bin-rouleaux" aria-live="polite"></div>' +
               '<p class="bin-chiffres">Chiffres : ' + CHIFFRES.slice(0, b).split("").join(" ") + '</p></div>';
      }).join("") + '</div>' +
      '<p class="bin-retenue" aria-live="polite"></p>' +
      '<div class="ia-choix">' +
        '<button type="button" class="minikey" id="bin-m1">−1</button>' +
        '<button type="button" class="minikey wire" id="bin-p1">+1</button>' +
        '<button type="button" class="minikey" id="bin-p10">+10</button>' +
        '<button type="button" class="minikey" id="bin-auto">▶ Compter tout seul</button>' +
        '<button type="button" class="minikey" id="bin-zero">↺ Remettre à 0</button>' +
      '</div>';

    function dessiner(){
      const changes = [];
      bases.forEach(function(b){
        const texte = valeur.toString(b).toUpperCase().padStart(TAILLES[b], "0");
        const ancien = avant[b] || texte;
        const boite = zone.querySelector('[data-base="' + b + '"] .bin-rouleaux');
        boite.innerHTML = texte.split("").map(function(c, k){
          const change = ancien[k] !== c;
          if(change) changes.push(b);
          return '<span class="bin-rouleau' + (change ? " change" : "") + '">' + c + '</span>';
        }).join("");
        avant[b] = texte;
      });
      // Une retenue : plus d’un chiffre a changé dans un compteur.
      const retenues = bases.filter(function(b){ return changes.filter(function(x){ return x === b; }).length > 1; });
      zone.querySelector(".bin-retenue").textContent = valeur === 0 ? "" :
        retenues.length ? "↪️ Retenue en " + retenues.map(function(b){ return NOMS[b].split(" ")[0].toLowerCase(); }).join(" et en ") +
          " : un rouleau a fait le tour, il repart à 0 et pousse son voisin de gauche !" : "";
      etat.valeur = valeur;
      etat.vus.add(valeur);
      appeler(signaler, etat);
    }
    function aller(v){ valeur = Math.max(0, Math.min(max, v)); dessiner(); }
    function stop(){ clearInterval(minuterie); minuterie = null; zone.querySelector("#bin-auto").textContent = "▶ Compter tout seul"; }
    zone.querySelector("#bin-p1").onclick = function(){ stop(); aller(valeur + 1); };
    zone.querySelector("#bin-m1").onclick = function(){ stop(); aller(valeur - 1); };
    zone.querySelector("#bin-p10").onclick = function(){ stop(); aller(valeur + 10); };
    zone.querySelector("#bin-zero").onclick = function(){ stop(); avant = {}; aller(0); };
    zone.querySelector("#bin-auto").onclick = function(){
      if(minuterie) return stop();
      this.textContent = "⏸ Pause";
      minuterie = setInterval(function(){
        if(!zone.isConnected || valeur >= max) return stop();
        aller(valeur + 1);
      }, 700);
    };
    dessiner();
  }

  /* ---------- les cartes binaires ---------- */
  function points(n){
    let s = "";
    for(let k = 0; k < n; k++) s += "<i></i>";
    return s;
  }

  // options : { cartes:5, defi:false, compactes:false }
  // compactes : des cartes plus petites, sans points (pour en aligner 8), et un bouton pour tout cacher.
  function cartes(zone, signaler, options){
    const nb = (options && options.cartes) || 5;
    const defi = !!(options && options.defi);
    const compactes = !!(options && options.compactes);
    const valeurs = [];
    for(let k = nb - 1; k >= 0; k--) valeurs.push(Math.pow(2, k));
    const maxi = Math.pow(2, nb) - 1;
    let face = valeurs.map(function(){ return false; });
    let cible = defi ? auHasard(1, maxi) : null;
    let reussi = false;
    const etat = { total:0, binaire:binaire(0, nb), faits:new Set([0]), defis:0 };

    function total(){ return valeurs.reduce(function(a, v, k){ return a + (face[k] ? v : 0); }, 0); }
    function dessiner(){
      const t = total();
      const pris = valeurs.filter(function(v, k){ return face[k]; });
      zone.innerHTML =
        (defi ? '<p class="ia-debut">🎯 Défi : fabrique le nombre <span class="bin-cible">' + cible + '</span> (en base décimale)</p>' : '') +
        '<div class="bin-cartes' + (compactes ? ' compactes' : '') + '">' + valeurs.map(function(v, k){
          return '<button type="button" class="bin-carte' + (face[k] ? " face" : "") + '" data-k="' + k + '" aria-pressed="' + face[k] + '"' +
                 ' aria-label="Carte de ' + v + ' point' + (v > 1 ? "s" : "") + ', ' + (face[k] ? "retournée face visible" : "cachée") + '">' +
                 (compactes ? '' : '<span class="bin-points n' + v + '">' + (face[k] ? points(v) : "") + '</span>') +
                 '<span class="bin-valeur">' + (face[k] ? v : "?") + '</span></button>';
        }).join("") + '</div>' +
        '<div class="bin-bits' + (compactes ? ' compactes' : '') + '">' + valeurs.map(function(v, k){ return '<span>' + (face[k] ? 1 : 0) + '</span>'; }).join("") + '</div>' +
        '<p class="bin-somme">' +
          (pris.length ? pris.join(" + ") + " = " : "") + '<b>' + t + '</b>' +
          ' &nbsp;·&nbsp; en binaire : <span class="bin-code">' + binaire(t, nb) + '</span>' +
          (compactes && pris.length ? ' <button type="button" class="minikey bin-cacher">Tout cacher</button>' : '') + '</p>' +
        (defi ? '<div class="bin-defi" aria-live="polite">' +
          (reussi ? '<p class="ia-note">🎉 Bravo, ' + cible + ' en base décimale s’écrit <b>' + binaire(cible, nb) + '</b> en binaire !</p>' +
                    '<button type="button" class="minikey wire" id="bin-suivant">Défi suivant</button>'
                  : t > cible ? '<p class="ia-note">Trop de points ! Retourne une carte pour en enlever.</p>' : '') +
          '<p class="ia-score">Défis réussis : ' + etat.defis + '</p></div>' : '');
      zone.querySelectorAll(".bin-carte").forEach(function(b){
        b.onclick = function(){
          if(reussi) return;
          face[+b.dataset.k] = !face[+b.dataset.k];
          verifier();
        };
      });
      const cacher = zone.querySelector(".bin-cacher");
      if(cacher) cacher.onclick = function(){
        face = valeurs.map(function(){ return false; });
        verifier();
      };
      const s = zone.querySelector("#bin-suivant");
      if(s) s.onclick = function(){
        let nouvelle = cible;
        while(nouvelle === cible) nouvelle = auHasard(1, maxi);
        cible = nouvelle;
        reussi = false;
        face = valeurs.map(function(){ return false; });
        dessiner();
      };
    }
    function verifier(){
      const t = total();
      etat.total = t;
      etat.binaire = binaire(t, nb);
      etat.faits.add(t);
      if(defi && t === cible && !reussi){ reussi = true; etat.defis++; }
      dessiner();
      appeler(signaler, etat);
    }
    dessiner();
  }

  /* ---------- l’entraînement : traduire dans les deux sens ---------- */
  function tableau(n, nb){
    const valeurs = [];
    for(let k = nb - 1; k >= 0; k--) valeurs.push(Math.pow(2, k));
    const bits = binaire(n, nb).split("");
    const pris = valeurs.filter(function(v, k){ return bits[k] === "1"; });
    return '<table class="bin-tableau"><tr><th>Valeur</th>' + valeurs.map(function(v){ return '<td>' + v + '</td>'; }).join("") + '</tr>' +
           '<tr><th>Bit</th>' + bits.map(function(b){ return '<td class="' + (b === "1" ? "un" : "") + '">' + b + '</td>'; }).join("") + '</tr></table>' +
           '<p>' + (pris.length ? pris.join(" + ") : "0") + ' = <b>' + n + '</b></p>';
  }

  function entrainement(zone, signaler){
    const etat = { faites:0, justes:0, versDecimal:0, versBinaire:0, serie:0, serieMax:0 };
    let n, sens, fini;
    function niveau(){ return etat.justes < 5 ? 15 : etat.justes < 10 ? 31 : 63; }
    function nouvelle(){
      sens = Math.random() < 0.5 ? "versDecimal" : "versBinaire";
      n = auHasard(1, niveau());
      fini = false;
      zone.innerHTML =
        '<p class="ia-consigne">Niveau : nombres jusqu’à ' + niveau() + '. Réponds, puis clique sur Vérifier.</p>' +
        '<p class="ia-debut">' + (sens === "versDecimal"
          ? 'En binaire, on écrit <span class="bin-code">' + binaire(n) + '</span>. Comment s’écrit ce nombre en base décimale ?'
          : 'En base décimale, on écrit <span class="bin-cible">' + n + '</span>. Comment s’écrit ce nombre en binaire ?') + '</p>' +
        '<form class="ia-ajout" id="bin-form"><label class="sr" for="bin-rep">Ta réponse</label>' +
          '<input class="champ" id="bin-rep" autocomplete="off" inputmode="numeric" placeholder="' + (sens === "versDecimal" ? "un nombre" : "des 0 et des 1") + '">' +
          '<button class="minikey wire" type="submit">Vérifier</button></form>' +
        '<div id="bin-retour" aria-live="polite"></div>' +
        '<p class="ia-score">' + etat.justes + ' / ' + etat.faites + ' bonnes réponses · série en cours : ' + etat.serie + '</p>';
      zone.querySelector("#bin-form").onsubmit = function(ev){ ev.preventDefault(); corriger(); };
      zone.querySelector("#bin-rep").focus({ preventScroll:true });
    }
    function corriger(){
      if(fini) return;
      const champ = zone.querySelector("#bin-rep");
      const rep = champ.value.trim().replace(/\s+/g, "");
      if(!rep) return;
      if(sens === "versBinaire" && !/^[01]+$/.test(rep)){
        zone.querySelector("#bin-retour").innerHTML = '<p class="ia-note">En binaire, on n’utilise que des 0 et des 1 !</p>';
        return;
      }
      const juste = sens === "versDecimal" ? Number(rep) === n : parseInt(rep, 2) === n;
      fini = true;
      etat.faites++;
      if(juste){ etat.justes++; etat[sens]++; etat.serie++; etat.serieMax = Math.max(etat.serieMax, etat.serie); }
      else etat.serie = 0;
      champ.disabled = true;
      zone.querySelector("#bin-retour").innerHTML =
        '<div class="ia-note"><p><b>' + (juste ? "✅ Bravo !" : "❌ Pas tout à fait : la réponse est " +
          (sens === "versDecimal" ? n : binaire(n))) + '</b></p>' + tableau(n, binaire(n).length < 4 ? 4 : binaire(n).length) + '</div>' +
        '<button type="button" class="minikey wire" id="bin-encore">Question suivante</button>';
      zone.querySelector(".ia-score").textContent = etat.justes + " / " + etat.faites + " bonnes réponses · série en cours : " + etat.serie;
      zone.querySelector("#bin-encore").onclick = nouvelle;
      zone.querySelector("#bin-encore").focus({ preventScroll:true });
      appeler(signaler, etat);
    }
    nouvelle();
  }

  /* ---------- le texte en binaire, et le message secret ---------- */
  const SECRET = "SUPER";

  function texte(zone, signaler){
    const etat = { texte:"", lettres:0, decode:false };
    zone.innerHTML =
      '<label class="ia-consigne" for="bin-texte">Écris ton prénom (ou un mot) : chaque lettre devient un nombre, puis un octet.</label>' +
      '<input class="champ bin-saisie" id="bin-texte" value="Louis" maxlength="14" autocomplete="off">' +
      '<div class="bin-lettres"></div>' +
      '<p class="ia-score" id="bin-total"></p>' +
      '<h3 class="bin-titre">🕵️ Le message secret</h3>' +
      '<p class="ia-consigne">Un espion t’a envoyé ce message, une lettre par octet. Traduis chaque octet en nombre (avec la méthode des cartes : 128, 64, 32, 16, 8, 4, 2, 1), puis trouve la lettre dans le tableau.</p>' +
      '<div class="bin-secret">' + SECRET.split("").map(function(c){ return '<span>' + binaire(c.charCodeAt(0), 8) + '</span>'; }).join("") + '</div>' +
      '<div class="bin-aide">' +
        '<p class="bin-aide-titre">🃏 Un coup de main : les 8 cartes</p>' +
        '<p class="ia-consigne">Retourne les cartes pour que les 0 et les 1 sous les cartes soient les mêmes que dans l’octet : ' +
          'le total te donne le code de la lettre.</p>' +
        '<div id="bin-aide-cartes"></div>' +
      '</div>' +
      '<div class="bin-alphabet">' + "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function(c){
        return '<span><b>' + c + '</b>' + c.charCodeAt(0) + '</span>';
      }).join("") + '</div>' +
      '<form class="ia-ajout" id="bin-decode"><label class="sr" for="bin-mot">Le mot décodé</label>' +
        '<input class="champ" id="bin-mot" autocomplete="off" placeholder="Le mot secret">' +
        '<button class="minikey wire" type="submit">Vérifier</button></form>' +
      '<div id="bin-verdict" aria-live="polite"></div>';
    const champ = zone.querySelector("#bin-texte");
    function maj(){
      const lettres = Array.from(champ.value);
      zone.querySelector(".bin-lettres").innerHTML = lettres.map(function(c){
        const code = c.codePointAt(0);
        return '<div class="bin-lettre"><b>' + (c === " " ? "␣" : esc(c)) + '</b><span>' + code + '</span>' +
               '<span class="bin-code">' + (code < 256 ? binaire(code, 8) : "plus d’un octet") + '</span></div>';
      }).join("");
      zone.querySelector("#bin-total").textContent = lettres.length + " caractère" + (lettres.length > 1 ? "s" : "") +
        " = " + lettres.length + " octet" + (lettres.length > 1 ? "s" : "") + " = " + (lettres.length * 8) + " bits (des 0 et des 1)";
      etat.texte = champ.value;
      etat.lettres = lettres.length;
      appeler(signaler, etat);
    }
    champ.addEventListener("input", maj);
    cartes(zone.querySelector("#bin-aide-cartes"), null, { cartes:8, compactes:true });
    zone.querySelector("#bin-decode").onsubmit = function(ev){
      ev.preventDefault();
      const rep = zone.querySelector("#bin-mot").value.trim().toUpperCase();
      etat.decode = rep === SECRET;
      zone.querySelector("#bin-verdict").innerHTML = etat.decode
        ? '<p class="ia-note">🎉 Message décodé : <b>' + SECRET + '</b> ! Tu lis le binaire comme un ordinateur.</p>'
        : '<p class="ia-note">Pas encore… Commence par le premier octet, 01010011 : retourne les cartes 64, 16, 2 et 1. ' +
          '64 + 16 + 2 + 1 = 83. Quelle lettre a le code 83 ?</p>';
      appeler(signaler, etat);
    };
    maj();
  }

  /* ---------- l’hexadécimal et les couleurs ---------- */
  function couleurs(zone, signaler){
    const canaux = [["Rouge", "r", 255], ["Vert", "v", 136], ["Bleu", "b", 0]];
    const val = { r:255, v:136, b:0 };
    const etat = { hex:"", vues:new Set() };
    function hex2(n){ return n.toString(16).toUpperCase().padStart(2, "0"); }
    zone.innerHTML =
      '<div class="bin-couleur">' +
        '<div class="bin-pastille" aria-hidden="true"></div>' +
        '<div class="bin-reglages">' + canaux.map(function(c){
          return '<label class="bin-canal"><span>' + c[0] + '</span>' +
                 '<input type="range" min="0" max="255" step="1" value="' + c[2] + '" data-c="' + c[1] + '">' +
                 '<code data-hex="' + c[1] + '"></code><span class="bin-detail" data-det="' + c[1] + '"></span></label>';
        }).join("") +
        '<p class="ia-debut">En CSS : <span class="bin-code" id="bin-css"></span></p>' +
        '<form class="ia-ajout" id="bin-hexa"><label class="sr" for="bin-saisie-hexa">Code hexadécimal</label>' +
          '<input class="champ" id="bin-saisie-hexa" maxlength="7" autocomplete="off" placeholder="#FF0000">' +
          '<button class="minikey wire" type="submit">Essayer ce code</button></form></div>' +
      '</div>';
    function maj(){
      const code = "#" + hex2(val.r) + hex2(val.v) + hex2(val.b);
      zone.querySelector(".bin-pastille").style.background = code;
      zone.querySelector("#bin-css").textContent = "color: " + code + ";";
      canaux.forEach(function(c){
        const k = c[1];
        zone.querySelector('[data-c="' + k + '"]').value = val[k];
        zone.querySelector('[data-hex="' + k + '"]').textContent = hex2(val[k]);
        zone.querySelector('[data-det="' + k + '"]').textContent = val[k] + " = " + binaire(val[k], 8);
      });
      etat.hex = code;
      etat.vues.add(code);
      appeler(signaler, etat);
    }
    zone.querySelectorAll('input[type="range"]').forEach(function(r){
      r.addEventListener("input", function(){ val[r.dataset.c] = Number(r.value); maj(); });
    });
    zone.querySelector("#bin-hexa").onsubmit = function(ev){
      ev.preventDefault();
      const m = zone.querySelector("#bin-saisie-hexa").value.trim().replace(/^#/, "").toUpperCase();
      if(!/^[0-9A-F]{6}$/.test(m)) return;
      val.r = parseInt(m.slice(0, 2), 16); val.v = parseInt(m.slice(2, 4), 16); val.b = parseInt(m.slice(4, 6), 16);
      maj();
    };
    maj();
  }

  return { ampoules:ampoules, compteurs:compteurs, cartes:cartes, entrainement:entrainement, texte:texte, couleurs:couleurs };
})();
