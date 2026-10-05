/* Application : sessions → choix du QCM → choix des blocs → questions → résultat. */
const LETTRES = ["A","B","C","D","E","F"];
const panel = document.getElementById("panel");
const strip = document.getElementById("strip");
const hint  = document.getElementById("hint");
const topTitle = document.getElementById("topTitle");
const topCount = document.getElementById("topCount");

let session = null;     // { id, nom } de la session ouverte
let qcm = null;         // définition du QCM en cours
let tentative = null;   // passage en cours, tel qu’enregistré dans la session
let ordre = [], i = 0, reps = [], repondu = false;
const themesChoisis = {}; // id du QCM → Set des thèmes cochés

function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
  });
}

function quand(iso){
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" }) +
         " à " + d.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });
}

function melange(a){
  const c = a.slice();
  for(let k=c.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[c[k],c[j]]=[c[j],c[k]];}
  return c;
}

function entete(titre, droite){
  topTitle.textContent = titre || "";
  topCount.innerHTML = droite || "";
}

function surClic(id, fn){
  const el = document.getElementById(id);
  if(el) el.onclick = fn;
}

/* ---------- lecture des tentatives ---------- */

// Remet une tentative enregistrée en forme pour l’affichage. Les questions retirées du QCM
// depuis sont ignorées ; si le nombre de réponses a changé, leur ordre est retiré au sort.
function resoudre(def, t){
  return t.ordre.map(function(o){
    const q = def.question(o.q);
    if(!q) return null;
    const p = (Array.isArray(o.p) && o.p.length === q.r.length) ? o.p : melange(q.r.map(function(_, n){return n;}));
    return { id:q.id, t:q.t, q:q.q, e:q.e, p:p,
             r:p.map(function(n){return q.r[n];}),
             b:p.indexOf(q.b) };
  }).filter(Boolean);
}

function reponseDe(t, qid){
  return t.reponses.find(function(r){return r.q === qid;});
}

function bilanDe(t){
  const def = QCM.trouver(t.qcm);
  const items = resoudre(def, t);
  const faites = items.filter(function(o){return reponseDe(t, o.id);});
  return {
    total: items.length,
    faites: faites.length,
    bons: faites.filter(function(o){return reponseDe(t, o.id).juste;}).length
  };
}

function tentativesDe(s, idQcm){
  return s.tentatives.filter(function(t){return t.qcm === idQcm;});
}

function enCours(s, idQcm){
  const ts = tentativesDe(s, idQcm);
  const d = ts[ts.length - 1];
  return d && !d.fin ? d : null;
}

function sessionOuverte(){
  const s = session && Sessions.trouver(session.id);
  if(!s){ ecranSessions(); return null; }
  return s;
}

/* ---------- écran 1 : sessions ---------- */
function ecranSessions(){
  session = null; qcm = null; tentative = null; repondu = false;
  entete("QCM informatique", "");
  strip.style.display = "none";
  hint.textContent = "Les sessions restent dans ce navigateur. Exporte-les pour les garder en lieu sûr ou changer d’ordinateur.";

  const sessions = Sessions.liste();
  const n = sessions.length;

  panel.innerHTML =
    (Sessions.persistant() ? "" :
      '<p class="alerte">Ce navigateur n’autorise pas l’enregistrement : pense à exporter ta session avant de fermer la page.</p>') +
    '<h1>Qui passe le QCM ?</h1>' +
    '<p class="lead">Une session garde toutes tes réponses. Crée la tienne avec ton prénom ou un pseudo, ou reprends une session déjà commencée.</p>' +
    '<form class="form" id="creer">' +
      '<label class="sr" for="nom">Nom de la session</label>' +
      '<input class="champ" id="nom" maxlength="60" autocomplete="off" placeholder="Ton prénom ou un pseudo" required>' +
      '<button class="bigkey wire" type="submit">Créer la session</button>' +
    '</form>' +
    '<h2>Sessions enregistrées' + (n ? ' (' + n + ')' : '') + '</h2>' +
    (n
      ? '<ul class="liste">' + sessions.map(function(s){
          const nb = s.tentatives.reduce(function(a, t){return a + t.reponses.length;}, 0);
          return '<li><div><span class="nom">' + esc(s.nom) + '</span>' +
                 '<span class="sub">' + nb + ' réponse' + (nb > 1 ? 's' : '') + ' · dernière activité le ' + quand(s.majLe) + '</span></div>' +
                 '<div class="actions">' +
                   '<button class="minikey wire" data-ouvrir="' + esc(s.id) + '">Ouvrir</button>' +
                   '<button class="minikey" data-exporter="' + esc(s.id) + '">Exporter</button>' +
                   '<button class="minikey danger" data-supprimer="' + esc(s.id) + '">Supprimer</button>' +
                 '</div></li>';
        }).join("") + '</ul>'
      : '<p class="vide">Aucune session enregistrée dans ce navigateur.</p>') +
    '<div class="row" style="gap:12px">' +
      '<button class="bigkey" id="importer">Importer un fichier</button>' +
      (n ? '<button class="bigkey" id="toutExporter">Tout exporter</button>' : '') +
    '</div>' +
    '<input type="file" id="fichier" accept=".json,application/json" hidden>';

  document.getElementById("creer").onsubmit = function(ev){
    ev.preventDefault();
    const nom = document.getElementById("nom").value.trim();
    if(!nom) return;
    const doublon = sessions.some(function(s){return s.nom.toLowerCase() === nom.toLowerCase();});
    if(doublon && !confirm("Une session « " + nom + " » existe déjà dans ce navigateur. En créer une deuxième ?")) return;
    ouvrir(Sessions.creer(nom));
  };

  panel.querySelectorAll("[data-ouvrir]").forEach(function(b){
    b.onclick = function(){ ouvrir(Sessions.trouver(b.dataset.ouvrir)); };
  });
  panel.querySelectorAll("[data-exporter]").forEach(function(b){
    b.onclick = function(){ Sessions.exporter(b.dataset.exporter); };
  });
  panel.querySelectorAll("[data-supprimer]").forEach(function(b){
    b.onclick = function(){
      const s = Sessions.trouver(b.dataset.supprimer);
      if(s && confirm("Supprimer la session « " + s.nom + " » et toutes ses réponses ?\n\nExporte-la d’abord si tu veux la garder.")){
        Sessions.supprimer(s.id);
        ecranSessions();
      }
    };
  });

  const fichier = document.getElementById("fichier");
  surClic("importer", function(){ fichier.click(); });
  surClic("toutExporter", function(){ Sessions.exporterTout(); });
  fichier.onchange = function(){
    const f = fichier.files[0];
    if(!f) return;
    f.text().then(function(texte){
      const n = Sessions.importer(texte, function(existante){
        return confirm("La session « " + existante.nom + " » existe déjà dans ce navigateur.\n\n" +
                       "OK : la remplacer par celle du fichier.\nAnnuler : garder les deux.")
               ? "remplacer" : "copie";
      });
      alert(n + " session" + (n > 1 ? "s importées." : " importée."));
      ecranSessions();
    }).catch(function(e){
      alert("Import impossible : " + e.message);
      fichier.value = "";
    });
  };
}

function ouvrir(s){
  if(!s) return ecranSessions();
  session = { id:s.id, nom:s.nom };
  ecranChoix();
}

/* ---------- écran 2 : choix du QCM ---------- */
function ecranChoix(){
  const s = sessionOuverte();
  if(!s) return;
  qcm = null; tentative = null; repondu = false;
  entete(s.nom, '<button class="lien" id="changer">Changer de session</button>');
  strip.style.display = "none";
  hint.textContent = "Tes réponses sont enregistrées au fur et à mesure : tu peux t’arrêter et reprendre plus tard.";

  const tous = QCM.tous();
  const finies = s.tentatives.filter(function(t){return t.fin && QCM.trouver(t.qcm);}).reverse();

  panel.innerHTML =
    '<h1>Choisis un QCM</h1>' +
    '<p class="lead">Chaque QCM est découpé en blocs que tu pourras choisir à l’étape suivante.</p>' +
    (tous.length
      ? '<div class="keys" style="margin:22px 0 0">' + tous.map(function(def){
          const ec = enCours(s, def.id);
          const fini = tentativesDe(s, def.id).filter(function(t){return t.fin;}).pop();
          let etat = "";
          if(ec){
            const b = bilanDe(ec);
            etat = '<span class="etat encours">En cours<br>' + b.faites + ' / ' + b.total + '</span>';
          } else if(fini){
            const b = bilanDe(fini);
            etat = '<span class="etat">Dernier score<br>' + b.bons + ' / ' + b.total + '</span>';
          }
          return '<button class="key" data-qcm="' + esc(def.id) + '">' +
                 '<span class="cap">' + def.questions.length + '</span>' +
                 '<span class="corps"><b>' + esc(def.titre) + '</b><br><span class="sub">' + esc(def.resume || "") + '</span></span>' +
                 etat + '</button>';
        }).join("") + '</div>'
      : '<p class="vide">Aucun QCM n’est chargé. Vérifie la liste des scripts dans index.html.</p>') +
    (finies.length
      ? '<h2>Historique</h2><ul class="liste">' + finies.map(function(t){
          const b = bilanDe(t);
          return '<li><div><span class="nom">' + esc(QCM.trouver(t.qcm).titre) + '</span>' +
                 '<span class="sub">' + b.bons + ' / ' + b.total + ' · le ' + quand(t.fin) + '</span></div>' +
                 '<div class="actions"><button class="minikey" data-revoir="' + esc(t.id) + '">Revoir</button></div></li>';
        }).join("") + '</ul>'
      : '') +
    '<div class="row"><button class="bigkey" id="exporter">Exporter ma session</button></div>';

  surClic("changer", ecranSessions);
  surClic("exporter", function(){ Sessions.exporter(s.id); });
  panel.querySelectorAll("[data-qcm]").forEach(function(b){
    b.onclick = function(){ ecranIntro(QCM.trouver(b.dataset.qcm)); };
  });
  panel.querySelectorAll("[data-revoir]").forEach(function(b){
    b.onclick = function(){
      charger(s.tentatives.find(function(t){return t.id === b.dataset.revoir;}));
      resultat();
    };
  });
}

/* ---------- écran 3 : choix des blocs ---------- */
function ecranIntro(def){
  const s = sessionOuverte();
  if(!s) return;
  qcm = def;
  entete(s.nom, '<button class="lien" id="retour">Tous les QCM</button>');
  strip.style.display = "none";
  hint.textContent = "Chaque bloc peut être passé séparément : clique dessus pour l’activer ou le désactiver.";

  const choisis = themesChoisis[def.id] || (themesChoisis[def.id] = new Set(def.themes.map(function(t){return t.id;})));
  const ec = enCours(s, def.id);
  const b = ec && bilanDe(ec);

  panel.innerHTML =
    '<h1>' + esc(def.titre) + '</h1>' +
    def.intro.map(function(p){return '<p class="lead">' + esc(p) + '</p>';}).join("") +
    (ec ? '<p class="alerte">Tu t’es arrêté à ' + b.faites + ' réponse' + (b.faites > 1 ? 's' : '') + ' sur ' + b.total +
          ', le ' + quand(ec.debut) + '. Reprends là où tu en étais, ou recommence avec les blocs choisis ci-dessous.</p>' : '') +
    '<div class="keys" style="margin:22px 0 0" id="blocs">' +
      def.themes.map(function(t){
        const n = def.questions.filter(function(q){return q.t===t.id;}).length;
        const on = choisis.has(t.id);
        return '<button class="key' + (on ? " picked-ok" : " dim") + '" data-t="' + esc(t.id) + '" aria-pressed="' + on + '">' +
               '<span class="cap">' + n + '</span><span><b>' + esc(t.nom) + '</b><br>' +
               '<span class="sub">' + esc(t.note || "") + '</span></span></button>';
      }).join("") +
    '</div>' +
    '<div class="row" style="gap:12px">' +
      (ec ? '<button class="bigkey" id="reprendre">Reprendre — ' + b.faites + ' / ' + b.total + '</button>' : '') +
      '<button class="bigkey wire" id="go"></button>' +
    '</div>';

  function maj(){
    const n = def.questions.filter(function(q){return choisis.has(q.t);}).length;
    const go = document.getElementById("go");
    go.textContent = n ? (ec ? "Recommencer — " : "Commencer — ") + n + " questions" : "Choisis au moins un bloc";
    go.disabled = !n;
    go.style.opacity = n ? "1" : ".45";
  }

  panel.querySelectorAll("#blocs .key").forEach(function(btn){
    btn.onclick = function(){
      const id = btn.dataset.t;
      if(choisis.has(id)) choisis.delete(id); else choisis.add(id);
      const on = choisis.has(id);
      btn.classList.toggle("picked-ok", on);
      btn.classList.toggle("dim", !on);
      btn.setAttribute("aria-pressed", on);
      maj();
    };
  });

  maj();
  surClic("retour", ecranChoix);
  surClic("reprendre", function(){ charger(ec); afficher(); });
  surClic("go", function(){ commencer(def, choisis); });
}

/* ---------- passage du QCM ---------- */
function commencer(def, choisis){
  const items = def.questions.filter(function(q){return choisis.has(q.t);}).map(function(q){
    return { q:q.id, p:melange(q.r.map(function(_, n){return n;})) };
  });
  charger(Sessions.nouvelleTentative(session.id, def.id, Array.from(choisis), items));
  afficher();
}

function charger(t){
  tentative = t;
  qcm = QCM.trouver(t.qcm);
  ordre = resoudre(qcm, t);
  reps = ordre.map(function(o){
    const r = reponseDe(t, o.id);
    return r ? r.juste : null;
  });
  i = Math.max(0, reps.indexOf(null));
  repondu = false;
}

function dessinerStrip(){
  strip.innerHTML = "";
  ordre.forEach(function(_, n){
    const el = document.createElement("i");
    if(reps[n] === true) el.className = "ok";
    else if(reps[n] === false) el.className = "no";
    else if(n === i) el.className = "now";
    strip.appendChild(el);
  });
}

function aide(texte){
  hint.innerHTML = texte + ' · <button class="lien" id="quitter">Retour aux QCM</button>';
  surClic("quitter", ecranChoix);
}

/* ---------- question ---------- */
function afficher(){
  if(!ordre.length) return ecranChoix();
  if(reps.indexOf(null) < 0) return resultat();
  strip.style.display = "flex";
  const item = ordre[i];
  const theme = qcm.themes.find(function(t){return t.id===item.t;});
  topTitle.textContent = theme.nom;
  topCount.textContent = "Question " + (i+1) + " sur " + ordre.length;
  dessinerStrip();
  repondu = false;

  panel.innerHTML =
    '<p class="question">' + esc(item.q) + '</p>' +
    '<div class="keys" id="keys">' +
      item.r.map(function(txt, n){
        return '<button class="key" data-n="' + n + '">' +
               '<span class="cap">' + LETTRES[n] + '</span><span>' + esc(txt) + '</span></button>';
      }).join("") +
    '</div>' +
    '<div id="apres"></div>';

  aide('Tu peux aussi utiliser les touches ' +
       item.r.map(function(_, n){return '<kbd>' + LETTRES[n] + '</kbd>';}).join(" ") + ' du clavier');

  panel.querySelectorAll(".key").forEach(function(btn){
    btn.onclick = function(){ repondre(parseInt(btn.dataset.n,10)); };
  });
}

function repondre(n){
  if(repondu) return;
  repondu = true;
  const item = ordre[i];
  const juste = (n === item.b);
  const dernier = (i === ordre.length - 1);
  const t = Sessions.repondre(session.id, tentative.id,
                              { q:item.id, choix:item.p[n], juste:juste, le:new Date().toISOString() },
                              dernier);
  if(!t){
    alert("Cette session n’existe plus dans ce navigateur (elle a peut-être été supprimée dans un autre onglet).");
    return ecranSessions();
  }
  tentative = t;
  reps[i] = juste;
  dessinerStrip();

  panel.querySelectorAll(".key").forEach(function(btn){
    const k = parseInt(btn.dataset.n,10);
    btn.disabled = true;
    if(k === n) btn.classList.add(juste ? "picked-ok" : "picked-no");
    else if(k === item.b) btn.classList.add("reveal");
    else btn.classList.add("dim");
  });

  document.getElementById("apres").innerHTML =
    '<div class="verdict ' + (juste ? "good" : "bad") + '">' +
      '<b>' + (juste ? "Bonne réponse" : "Réponse : " + LETTRES[item.b] + ". " + esc(item.r[item.b])) + '</b>' +
      '<p>' + esc(item.e) + '</p>' +
    '</div>' +
    '<div class="row"><button class="bigkey" id="next">' +
      (dernier ? "Voir mon résultat" : "Question suivante") + '</button></div>';

  const nx = document.getElementById("next");
  nx.focus();
  nx.onclick = function(){
    if(dernier){ resultat(); } else { i++; afficher(); }
  };
  aide('Appuie sur <kbd>Entrée</kbd> pour continuer');
}

/* ---------- résultat ---------- */
function resultat(){
  const total = ordre.length;
  const bons = reps.filter(Boolean).length;

  const parTheme = qcm.themes.filter(function(t){
    return ordre.some(function(o){return o.t===t.id;});
  }).map(function(t){
    const idx = ordre.map(function(o,n){return o.t===t.id ? n : -1;}).filter(function(n){return n>=0;});
    const b = idx.filter(function(n){return reps[n];}).length;
    return { nom:t.nom, b:b, n:idx.length };
  });

  const pct = total ? bons / total : 0;
  const bilan = qcm.bilans.find(function(x){return pct >= x.min;});

  const rates = ordre.map(function(o){
    const rep = reponseDe(tentative, o.id);
    if(rep && rep.juste) return null;
    const q = qcm.question(o.id);
    return { q:o.q, r:o.r[o.b], e:o.e, choix: rep ? q.r[rep.choix] : null };
  }).filter(Boolean);

  i = -1;
  repondu = true;
  strip.style.display = "flex";
  entete("Résultat", '<button class="lien" id="retour">Tous les QCM</button>');
  dessinerStrip();
  hint.textContent = tentative.fin ? qcm.titre + " · terminé le " + quand(tentative.fin) : "";

  panel.innerHTML =
    '<div class="score"><b>' + bons + '</b><span>bonnes réponses sur ' + total + '</span></div>' +
    (bilan ? '<p class="lead" style="max-width:56ch">' + esc(bilan.texte) + '</p>' : '') +
    '<div class="bars">' +
      parTheme.map(function(t){
        return '<div>' +
          '<div class="bar-head"><span>' + esc(t.nom) + '</span><em>' + t.b + ' / ' + t.n + '</em></div>' +
          '<div class="track"><div class="fill" style="width:' + Math.round(t.b/t.n*100) + '%"></div></div>' +
        '</div>';
      }).join("") +
    '</div>' +
    (rates.length
      ? '<h2>À revoir (' + rates.length + ')</h2><ul class="misses">' +
        rates.map(function(r){
          return '<li><q>' + esc(r.q) + '</q>' +
                 (r.choix ? '<em>Tu as répondu : ' + esc(r.choix) + '</em>' : '') +
                 '<em><b>' + esc(r.r) + '</b> — ' + esc(r.e) + '</em></li>';
        }).join("") + '</ul>'
      : '<h2>Aucune erreur. Rien à revoir.</h2>') +
    '<div class="row" style="gap:12px">' +
      '<button class="bigkey" id="print">Imprimer</button>' +
      '<button class="bigkey wire" id="again">Recommencer</button>' +
    '</div>';

  surClic("retour", ecranChoix);
  surClic("print", function(){ window.print(); });
  surClic("again", function(){
    themesChoisis[qcm.id] = new Set(tentative.themes);
    commencer(qcm, themesChoisis[qcm.id]);
  });
}

/* ---------- clavier ---------- */
document.addEventListener("keydown", function(ev){
  if(ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const k = ev.key.toLowerCase();
  if(!repondu){
    if(!panel.querySelector(".key[data-n]")) return;
    const nb = ordre[i].r.length;
    const n = LETTRES.slice(0, nb).map(function(l){return l.toLowerCase();}).indexOf(k);
    const alt = ["1","2","3","4","5","6"].slice(0, nb).indexOf(k);
    const choix = n >= 0 ? n : alt;
    if(choix >= 0){ ev.preventDefault(); repondre(choix); }
  } else if(k === "enter"){
    const nx = document.getElementById("next");
    if(nx){ ev.preventDefault(); nx.click(); }
  }
});

ecranSessions();
