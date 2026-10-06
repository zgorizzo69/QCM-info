/* Application : sessions → choix du QCM → choix des blocs → questions → résultat.
   Depuis l’écran des blocs, on peut aussi passer un examen blanc : des questions à choix tirées
   au hasard, sans correction avant la fin. */
const LETTRES = ["A","B","C","D","E","F"];
const NB_EXAMEN = 10;  // nombre de questions d’un examen blanc
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

// Texte des QCM : échappé, puis `code` → <code> et **gras** → <b>.
function fmt(s){
  return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
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
    const type = q.type || "choix";
    if(type !== "choix") return { id:q.id, t:q.t, type:type, q:q.q, e:q.e, src:q };
    const p = (Array.isArray(o.p) && o.p.length === q.r.length) ? o.p : melange(q.r.map(function(_, n){return n;}));
    return { id:q.id, t:q.t, type:type, q:q.q, e:q.e, src:q, p:p,
             r:p.map(function(n){return q.r[n];}),
             b:p.indexOf(q.b) };
  }).filter(Boolean);
}

function reponseDe(t, qid){
  return t.reponses.find(function(r){return r.q === qid;});
}

// Une leçon se lit mais ne se note pas.
function note(o){ return o.type !== "lecon"; }

// etapes / faites : avancement (leçons comprises) ; total / bons : score.
function bilanDe(t){
  const def = QCM.trouver(t.qcm);
  const items = resoudre(def, t);
  const notes = items.filter(note);
  return {
    etapes: items.length,
    faites: items.filter(function(o){return reponseDe(t, o.id);}).length,
    total: notes.length,
    bons: notes.filter(function(o){const r = reponseDe(t, o.id); return r && r.juste;}).length
  };
}

function compte(def, n){
  const mot = def.avecLecons ? "étape" : "question";
  return n + " " + mot + (n > 1 ? "s" : "");
}

// Une tentative dont plus aucune question n’existe (QCM retiré ou réécrit) est ignorée,
// mais reste dans la session et dans ses exports.
function utilisable(t){
  const def = QCM.trouver(t.qcm);
  return !!def && t.ordre.some(function(o){return def.question(o.q);});
}

// Passages normaux d’un QCM, examens blancs exclus.
function tentativesDe(s, idQcm){
  return s.tentatives.filter(function(t){return t.qcm === idQcm && !t.examen && utilisable(t);});
}

function examensDe(s, idQcm){
  return s.tentatives.filter(function(t){return t.qcm === idQcm && t.examen && utilisable(t);});
}

// L’examen blanc terminé d’un QCM (la session n’en garde qu’un), et celui en cours.
function examenFini(s, idQcm){
  return examensDe(s, idQcm).filter(function(t){return t.fin;}).pop() || null;
}

function examenEnCours(s, idQcm){
  return examensDe(s, idQcm).filter(function(t){return !t.fin;}).pop() || null;
}

function enCours(s, idQcm){
  const ts = tentativesDe(s, idQcm);
  const d = ts[ts.length - 1];
  return d && !d.fin ? d : null;
}

/* ---------- notes ---------- */
function note20(b){ return b.total ? b.bons / b.total * 20 : 0; }
function noteTexte(n){ return (Math.round(n * 10) / 10).toLocaleString("fr-FR"); }

// Note de chaque QCM : celle du dernier passage terminé (qui contient au moins une question
// notée), ramenée sur 20 ; on garde aussi la meilleure.
function notesDe(s){
  return QCM.tous().map(function(def){
    const finies = tentativesDe(s, def.id).filter(function(t){ return t.fin && bilanDe(t).total; });
    if(!finies.length) return null;
    const derniere = finies[finies.length - 1];
    const b = bilanDe(derniere);
    return {
      def: def, b: b, note: note20(b), passages: finies.length,
      meilleure: Math.max.apply(null, finies.map(function(t){ return note20(bilanDe(t)); })),
      blocs: derniere.themes.filter(function(id){ return def.themes.some(function(t){ return t.id === id; }); }).length
    };
  }).filter(Boolean);
}

function sectionNotes(s, nbQcm){
  const notes = notesDe(s);
  if(!notes.length) return '<h2>Mes résultats</h2><p class="vide">Termine un QCM pour obtenir ta première note.</p>';
  const moyenne = notes.reduce(function(a, n){ return a + n.note; }, 0) / notes.length;
  return '<h2>Mes résultats</h2>' +
    '<div class="moyenne">' +
      '<div class="score"><b>' + noteTexte(moyenne) + '</b><span>/ 20</span></div>' +
      '<p>Moyenne générale · ' + notes.length + ' QCM noté' + (notes.length > 1 ? 's' : '') + ' sur ' + nbQcm + '</p>' +
    '</div>' +
    '<ul class="liste notes">' + notes.map(function(n){
      return '<li><div><span class="nom">' + esc(n.def.titre) + '</span>' +
             '<span class="sub">' + n.b.bons + ' / ' + n.b.total + ' bonnes réponses · ' +
               n.blocs + ' bloc' + (n.blocs > 1 ? 's' : '') + ' sur ' + n.def.themes.length +
               (n.passages > 1 ? ' · meilleure note : ' + noteTexte(n.meilleure) + ' / 20' : '') + '</span></div>' +
             '<div class="note"><b>' + noteTexte(n.note) + '</b> / 20</div></li>';
    }).join("") + '</ul>' +
    '<p class="sub">La note d’un QCM est celle de ton dernier passage terminé, ramenée sur 20. ' +
    'La moyenne générale est la moyenne de ces notes.</p>';
}

function sectionExamens(s){
  const examens = QCM.tous().map(function(def){
    const t = examenFini(s, def.id);
    return t && bilanDe(t).total ? { def:def, t:t, b:bilanDe(t) } : null;
  }).filter(Boolean);
  return '<h2>Examens blancs</h2>' +
    (examens.length
      ? '<ul class="liste notes">' + examens.map(function(x){
          return '<li><div><span class="nom">' + esc(x.def.titre) + '</span>' +
                 '<span class="sub">' + x.b.bons + ' / ' + x.b.total + ' bonnes réponses · le ' + quand(x.t.fin) + '</span></div>' +
                 '<div class="actions"><div class="note"><b>' + noteTexte(note20(x.b)) + '</b> / 20</div>' +
                 '<button class="minikey" data-revoir="' + esc(x.t.id) + '">Revoir</button></div></li>';
        }).join("") + '</ul>' +
        '<p class="sub">Une seule note par QCM : un nouvel examen blanc remplace la note du précédent.</p>'
      : '<p class="vide">Aucun examen blanc pour l’instant. Tu peux en passer un en bas de la page de chaque QCM.</p>');
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
  const finies = s.tentatives.filter(function(t){return t.fin && utilisable(t);}).reverse();

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
            etat = '<span class="etat encours">En cours<br>' + b.faites + ' / ' + b.etapes + '</span>';
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
    sectionNotes(s, tous.length) +
    sectionExamens(s) +
    (finies.length
      ? '<h2>Historique</h2><ul class="liste">' + finies.map(function(t){
          const b = bilanDe(t);
          return '<li><div><span class="nom">' + (t.examen ? 'Examen blanc · ' : '') + esc(QCM.trouver(t.qcm).titre) + '</span>' +
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
  const nbExamen = Math.min(NB_EXAMEN, questionsExamen(def).length);
  const exFini = examenFini(s, def.id);
  const exEc = examenEnCours(s, def.id);
  const exB = exEc && bilanDe(exEc);

  panel.innerHTML =
    '<h1>' + esc(def.titre) + '</h1>' +
    def.intro.map(function(p){return '<p class="lead">' + esc(p) + '</p>';}).join("") +
    (ec ? '<p class="alerte">Tu t’es arrêté après ' + compte(def, b.faites) + ' sur ' + b.etapes +
          ', le ' + quand(ec.debut) + '. Reprends là où tu en étais, ou recommence avec les blocs choisis ci-dessous.</p>' : '') +
    '<div class="keys" style="margin:22px 0 0" id="blocs">' +
      def.themes.map(function(t){
        const n = def.questions.filter(function(q){return q.t===t.id;}).length;
        const on = choisis.has(t.id);
        return '<button class="key' + (on ? " picked-ok" : " dim") + '" data-t="' + esc(t.id) + '" aria-pressed="' + on + '">' +
               '<span class="cap">' + n + '</span><span><b>' + esc(t.nom) + '</b><br>' +
               '<span class="sub">' + fmt(t.note || "") + '</span></span></button>';
      }).join("") +
    '</div>' +
    '<div class="row" style="gap:12px">' +
      (ec ? '<button class="bigkey" id="reprendre">Reprendre — ' + b.faites + ' / ' + b.etapes + '</button>' : '') +
      '<button class="bigkey wire" id="go"></button>' +
    '</div>' +
    (nbExamen ? '<div class="encart">' +
      '<h2>📝 Examen blanc</h2>' +
      '<p>' + nbExamen + ' questions tirées au hasard parmi tous les blocs de ce QCM. Pas de correction en cours de route : ' +
        'ta note ne s’affiche qu’à la fin, comme pour un vrai contrôle.</p>' +
      (exFini ? '<p class="sub">Ta note actuelle : <b>' + noteTexte(note20(bilanDe(exFini))) + ' / 20</b>, le ' + quand(exFini.fin) +
                '. Un nouvel examen blanc la remplacera.</p>' : '') +
      '<div class="row" style="gap:12px;margin-top:14px">' +
        (exEc ? '<button class="bigkey" id="examenReprendre">Reprendre l’examen — ' + exB.faites + ' / ' + exB.etapes + '</button>' : '') +
        '<button class="bigkey" id="examen">' + (exEc ? 'Nouvel examen blanc' : 'Passer l’examen blanc') + '</button>' +
      '</div></div>' : '');

  function maj(){
    const n = def.questions.filter(function(q){return choisis.has(q.t);}).length;
    const go = document.getElementById("go");
    go.textContent = n ? (ec ? "Recommencer — " : "Commencer — ") + compte(def, n) : "Choisis au moins un bloc";
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
  surClic("examenReprendre", function(){ charger(exEc); afficher(); });
  surClic("examen", function(){ commencerExamen(def); });
}

/* ---------- passage du QCM ---------- */
function commencer(def, choisis){
  const items = def.questions.filter(function(q){return choisis.has(q.t);}).map(function(q){
    return (q.type || "choix") === "choix" ? { q:q.id, p:melange(q.r.map(function(_, n){return n;})) } : { q:q.id };
  });
  charger(Sessions.nouvelleTentative(session.id, def.id, Array.from(choisis), items));
  afficher();
}

// Seules les questions à choix entrent dans l’examen blanc : les exercices de code et de terminal
// cochent leurs vérifications en direct, ce qui dévoilerait la correction.
function questionsExamen(def){
  return def.questions.filter(function(q){return (q.type || "choix") === "choix";});
}

function commencerExamen(def){
  const items = melange(questionsExamen(def)).slice(0, NB_EXAMEN).map(function(q){
    return { q:q.id, p:melange(q.r.map(function(_, n){return n;})) };
  });
  const themes = def.themes.map(function(t){return t.id;});
  charger(Sessions.nouvelleTentative(session.id, def.id, themes, items, true));
  afficher();
}

function charger(t){
  tentative = t;
  qcm = QCM.trouver(t.qcm);
  ordre = resoudre(qcm, t);
  reps = ordre.map(function(o){
    const r = reponseDe(t, o.id);
    return r ? (o.type === "lecon" ? "lu" : r.juste) : null;
  });
  i = Math.max(0, reps.indexOf(null));
  repondu = false;
}

function dessinerStrip(){
  strip.innerHTML = "";
  const cache = tentative && tentative.examen && i >= 0;   // examen en cours : rien n’est dévoilé
  ordre.forEach(function(_, n){
    const el = document.createElement("i");
    if(cache && reps[n] !== null) el.className = "lu";
    else if(reps[n] === true) el.className = "ok";
    else if(reps[n] === false) el.className = "no";
    else if(reps[n] === "lu") el.className = "lu";
    else if(n === i) el.className = "now";
    strip.appendChild(el);
  });
}

function aide(texte){
  hint.innerHTML = texte + ' · <button class="lien" id="quitter">Retour aux QCM</button>';
  surClic("quitter", ecranChoix);
}

// Enregistre la réponse de l’étape en cours ; renvoie false si la session a disparu.
function enregistrer(reponse){
  reponse.q = ordre[i].id;
  reponse.le = new Date().toISOString();
  const t = Sessions.repondre(session.id, tentative.id, reponse, i === ordre.length - 1);
  if(!t){
    alert("Cette session n’existe plus dans ce navigateur (elle a peut-être été supprimée dans un autre onglet).");
    ecranSessions();
    return false;
  }
  tentative = t;
  return true;
}

function boutonSuivant(libelle){
  const dernier = (i === ordre.length - 1);
  return '<div class="row"><button class="bigkey" id="next">' + (dernier ? "Voir mon résultat" : libelle) + '</button></div>';
}

function brancherSuivant(avant){
  const nx = document.getElementById("next");
  nx.onclick = function(){
    if(avant && avant() === false) return;
    if(i === ordre.length - 1){ resultat(); } else { i++; afficher(); }
  };
  return nx;
}

/* ---------- éditeur de code en direct ---------- */
function editeur(id, code, titre, avecApercu){
  const lignes = code.split("\n").length;
  return '<div class="atelier">' +
    '<div class="atelier-tete"><span>' + titre + '</span>' +
      '<button class="lien" id="' + id + '-reset">Remettre le code de départ</button></div>' +
    '<textarea class="code-saisie" id="' + id + '" rows="' + Math.min(18, Math.max(5, lignes + 1)) + '"' +
      ' spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="' + titre + '">' +
      esc(code) + '</textarea>' +
    (avecApercu === false ? '' :
      '<div class="atelier-tete"><span>Résultat</span><span class="sub">Tire le coin ↘ pour redimensionner</span></div>' +
      '<div class="apercu-cadre"><iframe class="apercu" id="' + id + '-apercu" title="Résultat du code"' +
        ' sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe></div>') +
  '</div>';
}

// Le résultat se met à jour pendant la frappe. Tab insère deux espaces ;
// Échap puis Tab permet de quitter l’éditeur au clavier.
// L’aperçu n’exécute aucun script (pas de allow-scripts) ; allow-same-origin permet seulement
// à l’application de lire la page rendue (styles calculés) pour vérifier les exercices.
// apresRendu(doc, code) est appelé après chaque mise à jour du résultat, et quand on le
// redimensionne ; doc vaut null pour un éditeur de texte sans aperçu.
function brancherEditeur(id, depart, apresRendu){
  const ta = document.getElementById(id);
  const apercu = document.getElementById(id + "-apercu");
  let minuterie = null, echap = false;
  function rendre(){
    if(apercu) apercu.srcdoc = ta.value;
    else if(apresRendu) apresRendu(null, ta.value);
  }
  if(apercu && apresRendu){
    apercu.addEventListener("load", function(){ apresRendu(apercu.contentDocument, ta.value); });
    if(window.ResizeObserver) new ResizeObserver(function(){
      if(apercu.contentDocument && apercu.contentDocument.body) apresRendu(apercu.contentDocument, ta.value);
    }).observe(apercu);
  }
  function plusTard(){ clearTimeout(minuterie); minuterie = setTimeout(rendre, 250); }
  ta.addEventListener("input", plusTard);
  ta.addEventListener("keydown", function(ev){
    if(ev.key === "Escape"){ echap = true; return; }
    if(ev.key === "Tab" && !ev.shiftKey && !echap){
      ev.preventDefault();
      ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
      plusTard();
    }
    echap = false;
  });
  surClic(id + "-reset", function(){ ta.value = depart; rendre(); ta.focus(); });
  rendre();
  return {
    code: function(){ return ta.value; },
    remplacer: function(code){ ta.value = code; rendre(); },
    // Affiche le code actuel et renvoie (une fois chargé) le document rendu.
    rendu: function(){
      clearTimeout(minuterie);
      if(!apercu) return Promise.resolve(null);
      return new Promise(function(ok){
        apercu.addEventListener("load", function(){ ok(apercu.contentDocument); }, { once:true });
        rendre();
      });
    }
  };
}

/* ---------- « À toi d’essayer » et liens ---------- */
// Un essai est un texte, ou { texte, test(…) } : il est coché dès que le test réussit, et le reste.
function essaisHtml(essais){
  if(!essais || !essais.length) return "";
  return '<div class="essais"><p class="essais-titre">🧪 À toi d’essayer <span class="sub" id="essais-compte"></span></p>' +
    '<ul class="verifs" id="essais">' + essais.map(function(e){
      const auto = typeof e !== "string";
      return '<li><span class="signe" aria-hidden="true">' + (auto ? "○" : "•") + '</span>' +
             '<span>' + fmt(auto ? e.texte : e) + '</span></li>';
    }).join("") + '</ul></div>';
}

function suivreEssais(essais){
  if(!essais || !essais.length) return null;
  const lis = document.querySelectorAll("#essais li");
  const compte = document.getElementById("essais-compte");
  const auto = essais.filter(function(e){ return typeof e !== "string"; }).length;
  const faits = new Set();
  function maj(){
    if(!auto) return;
    compte.textContent = faits.size === auto ? "· tout réussi, bravo ! 🎉" : "· " + faits.size + " / " + auto;
  }
  maj();
  return function(){
    const args = arguments;
    essais.forEach(function(e, k){
      if(typeof e === "string" || faits.has(k)) return;
      let ok = false;
      try{ ok = !!e.test.apply(null, args); }catch(err){ ok = false; }
      if(!ok) return;
      faits.add(k);
      lis[k].className = "ok";
      lis[k].firstChild.textContent = "✓";
    });
    maj();
  };
}

function lienHtml(url){
  if(!url) return "";
  const w3 = /w3schools\.com/.test(url);
  return '<p class="plus-loin">📖 Pour aller plus loin : <a href="' + esc(url) + '" target="_blank" rel="noopener">' +
         (w3 ? 'la leçon correspondante sur W3Schools' : 'en savoir plus') + '</a>' + (w3 ? ' (en anglais)' : '') + '</p>';
}

/* ---------- étapes ---------- */
function afficher(){
  if(!ordre.length) return ecranChoix();
  if(reps.indexOf(null) < 0) return resultat();
  strip.style.display = "flex";
  const item = ordre[i];
  const theme = qcm.themes.find(function(t){return t.id===item.t;});
  topTitle.textContent = tentative.examen ? "Examen blanc · " + qcm.titre : theme.nom;
  topCount.textContent = (qcm.avecLecons && !tentative.examen ? "Étape " : "Question ") + (i+1) + " sur " + ordre.length;
  dessinerStrip();
  repondu = false;

  if(item.type === "lecon") afficherLecon(item);
  else if(item.type === "code") afficherCode(item);
  else if(item.type === "terminal") afficherTerminal(item);
  else if(tentative.examen) afficherExamen(item);
  else afficherChoix(item);
}

function afficherLecon(item){
  const l = item.src;
  panel.innerHTML =
    '<p class="theme">' + fmt(l.etiquette || "Leçon") + '</p>' +
    '<h1 class="lecon">' + fmt(l.titre) + '</h1>' +
    l.contenu.map(function(c){
      return typeof c === "string" ? '<p>' + fmt(c) + '</p>' : '<pre class="code">' + esc(c.code) + '</pre>';
    }).join("") +
    (l.terminal
      ? '<h2>Essaie toi-même</h2><p class="sub">Clique dans le terminal, tape une commande puis appuie sur Entrée. ' +
        'Rien ne peut casser : c’est un terminal d’entraînement.</p><div id="terminal"></div>'
      : l.exemple
        ? '<h2>Essaie toi-même</h2><p class="sub">' +
          (l.apercu === false ? 'Modifie le texte librement.' : 'Modifie le code : le résultat se met à jour tout de suite.') + '</p>' +
          editeur("exemple", l.exemple, "Exemple", l.apercu !== false)
        : '') +
    essaisHtml(l.essais) +
    lienHtml(l.lien) +
    boutonSuivant("J’ai compris, on continue");

  const essayer = suivreEssais(l.essais);
  if(l.terminal) Terminal.monter(document.getElementById("terminal"), { fs:l.terminal, auChangement:essayer });
  else if(l.exemple) brancherEditeur("exemple", l.exemple, essayer);
  repondu = true;   // Entrée passe à la suite
  brancherSuivant(function(){
    if(!enregistrer({ lu:true })) return false;
    reps[i] = "lu";
  });
  aide('Lis la leçon, puis appuie sur <kbd>Entrée</kbd> pour continuer');
}

function afficherChoix(item){
  panel.innerHTML =
    '<p class="question">' + fmt(item.q) + '</p>' +
    '<div class="keys" id="keys">' +
      item.r.map(function(txt, n){
        return '<button class="key" data-n="' + n + '">' +
               '<span class="cap">' + LETTRES[n] + '</span><span>' + fmt(txt) + '</span></button>';
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
  if(!enregistrer({ choix:item.p[n], juste:juste })) return;
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
      '<b>' + (juste ? "Bonne réponse" : "Réponse : " + LETTRES[item.b] + ". " + fmt(item.r[item.b])) + '</b>' +
      '<p>' + fmt(item.e) + '</p>' +
    '</div>' +
    boutonSuivant("Question suivante");

  brancherSuivant().focus();
  aide('Appuie sur <kbd>Entrée</kbd> pour continuer');
}

// Question d’examen blanc : on choisit (et on peut changer d’avis), puis on valide.
// Ni la bonne réponse ni l’explication ne sont montrées avant le résultat.
let choixExamen = null;

function afficherExamen(item){
  const dernier = (i === ordre.length - 1);
  choixExamen = null;
  panel.innerHTML =
    '<p class="theme">📝 Examen blanc</p>' +
    '<p class="question">' + fmt(item.q) + '</p>' +
    '<div class="keys" id="keys">' +
      item.r.map(function(txt, n){
        return '<button class="key" data-n="' + n + '" aria-pressed="false">' +
               '<span class="cap">' + LETTRES[n] + '</span><span>' + fmt(txt) + '</span></button>';
      }).join("") +
    '</div>' +
    '<div class="row"><button class="bigkey wire" id="next" disabled>' +
      (dernier ? "Terminer l’examen" : "Valider et continuer") + '</button></div>';

  panel.querySelectorAll(".key").forEach(function(btn){
    btn.onclick = function(){ choisirExamen(parseInt(btn.dataset.n,10)); };
  });
  document.getElementById("next").onclick = function(){
    if(choixExamen === null) return;
    const juste = (choixExamen === item.b);
    if(!enregistrer({ choix:item.p[choixExamen], juste:juste })) return;
    reps[i] = juste;
    if(dernier){ resultat(); } else { i++; afficher(); }
  };

  aide('Choisis avec ' + item.r.map(function(_, n){return '<kbd>' + LETTRES[n] + '</kbd>';}).join(" ") +
       ', puis <kbd>Entrée</kbd> pour valider · Ta note s’affichera à la fin');
}

function choisirExamen(n){
  choixExamen = n;
  panel.querySelectorAll(".key").forEach(function(btn){
    const on = parseInt(btn.dataset.n,10) === n;
    btn.classList.toggle("choisi", on);
    btn.setAttribute("aria-pressed", on);
  });
  document.getElementById("next").disabled = false;
}

// Vérifie l’exercice sur la page réellement rendue dans l’aperçu : test(doc, code) peut lire
// la structure (doc.querySelector), les styles calculés et les feuilles de style.
async function verifier(ex, ed){
  const code = ed.code();
  const doc = await ed.rendu();
  return ex.verifs.map(function(v){
    let ok = false;
    try{ ok = !!v.test(doc, code); }catch(e){ ok = false; }
    return { ok:ok, msg:v.msg };
  });
}

function listeVerifs(res){
  return res.map(function(r){
    const etat = r.ok === null ? "" : (r.ok ? " ok" : " no");
    const signe = r.ok === null ? "○" : (r.ok ? "✓" : "✗");
    return '<li class="' + etat.trim() + '"><span class="signe" aria-hidden="true">' + signe + '</span><span>' + fmt(r.msg) + '</span></li>';
  }).join("");
}

function afficherCode(item){
  const ex = item.src;
  panel.innerHTML =
    '<p class="theme">' + fmt(ex.etiquette || "Exercice") + '</p>' +
    '<p class="question">' + fmt(ex.q) + '</p>' +
    editeur("code", ex.depart, ex.apercu === false ? "Ton texte" : "Ton code", ex.apercu !== false) +
    '<p class="sub" style="margin:18px 0 6px"><b>Ce qui sera vérifié</b></p>' +
    '<ul class="verifs" id="verifs">' +
      listeVerifs(ex.verifs.map(function(v){return { ok:null, msg:v.msg };})) +
    '</ul>' +
    '<div id="apres"></div>' +
    '<div class="row" id="actions" style="gap:12px">' +
      '<button class="bigkey" id="solution">Voir la solution</button>' +
      '<button class="bigkey wire" id="verifier">Vérifier</button>' +
    '</div>';

  const ed = brancherEditeur("code", ex.depart);
  const verifs = document.getElementById("verifs");
  const apres = document.getElementById("apres");
  let essais = 0, occupe = false;

  function terminer(juste, code){
    if(!enregistrer({ code:code, juste:juste, essais:essais })) return;
    repondu = true;
    reps[i] = juste;
    dessinerStrip();
    document.getElementById("actions").remove();
    apres.innerHTML =
      '<div class="verdict ' + (juste ? "good" : "bad") + '">' +
        '<b>' + (juste ? "Bravo, ton code est juste !" : "Voici une solution possible, dans l’éditeur") + '</b>' +
        '<p>' + fmt(ex.e || "") + '</p>' +
      '</div>' +
      boutonSuivant("Étape suivante");
    brancherSuivant().focus();
    aide('Tu peux encore modifier le code pour expérimenter · <kbd>Entrée</kbd> pour continuer');
  }

  surClic("verifier", async function(){
    if(occupe || repondu) return;
    occupe = true;
    essais++;
    const res = await verifier(ex, ed);
    occupe = false;
    verifs.innerHTML = listeVerifs(res);
    if(res.every(function(r){return r.ok;})) return terminer(true, ed.code());
    apres.innerHTML =
      '<div class="verdict bad"><b>Pas encore</b>' +
      '<p>Corrige les points marqués d’une croix, puis vérifie à nouveau. Tu peux essayer autant de fois que tu veux.</p></div>';
  });

  surClic("solution", async function(){
    if(occupe || repondu) return;
    occupe = true;
    const code = ed.code();
    ed.remplacer(ex.solution);
    verifs.innerHTML = listeVerifs(await verifier(ex, ed));
    terminer(false, code);
  });

  aide('Écris ton code, regarde le résultat, puis clique sur Vérifier');
}

// Exercice dans le terminal : la liste se coche au fil des commandes, et l’exercice est réussi
// dès que tout est coché.
function afficherTerminal(item){
  const ex = item.src;
  panel.innerHTML =
    '<p class="theme">' + fmt(ex.etiquette || "Exercice") + '</p>' +
    '<p class="question">' + fmt(ex.q) + '</p>' +
    '<div id="terminal"></div>' +
    '<p class="sub" style="margin:18px 0 6px"><b>Ta mission</b></p>' +
    '<ul class="verifs" id="verifs">' +
      listeVerifs(ex.verifs.map(function(v){ return { ok:null, msg:v.msg }; })) +
    '</ul>' +
    '<div id="apres"></div>' +
    '<div class="row" id="actions"><button class="bigkey" id="solution">Voir la solution</button></div>';

  const verifs = document.getElementById("verifs");
  const apres = document.getElementById("apres");
  let enSolution = false;

  function evaluer(etat){
    return ex.verifs.map(function(v){
      let ok = false;
      try{ ok = !!v.test(etat); }catch(e){ ok = false; }
      return { ok:ok, msg:v.msg };
    });
  }

  function terminer(juste, commandes){
    if(!enregistrer({ code:commandes.join("\n"), juste:juste, essais:commandes.length })) return;
    repondu = true;
    reps[i] = juste;
    dessinerStrip();
    document.getElementById("actions").remove();
    apres.innerHTML =
      '<div class="verdict ' + (juste ? "good" : "bad") + '">' +
        '<b>' + (juste ? "Bravo, mission accomplie !" : "Voici une solution possible, rejouée dans le terminal") + '</b>' +
        (juste ? '' : '<pre class="code">' + esc(Terminal.texteSolution(ex.solution)) + '</pre>') +
        '<p>' + fmt(ex.e || "") + '</p>' +
      '</div>' +
      boutonSuivant("Étape suivante");
    brancherSuivant().focus();
    aide('Tu peux encore utiliser le terminal · <kbd>Entrée</kbd> sur le bouton pour continuer');
  }

  const term = Terminal.monter(document.getElementById("terminal"), {
    fs: ex.fs,
    auChangement: function(etat){
      if(repondu || enSolution) return;
      const res = evaluer(etat);
      verifs.innerHTML = listeVerifs(res.map(function(r){ return r.ok ? r : { ok:null, msg:r.msg }; }));
      if(res.every(function(r){ return r.ok; })) terminer(true, etat.commandes);
    }
  });

  surClic("solution", async function(){
    if(enSolution || repondu) return;
    enSolution = true;
    const leurs = term.etat().commandes;
    document.getElementById("solution").disabled = true;
    term.reinitialiser();
    await term.jouer(ex.solution);
    verifs.innerHTML = listeVerifs(evaluer(term.etat()));
    terminer(false, leurs);
  });

  aide('Tape tes commandes dans le terminal : la mission se coche toute seule');
}

/* ---------- résultat ---------- */
function resultat(){
  const notes = ordre.map(function(o, n){return { o:o, n:n };}).filter(function(x){return note(x.o);});
  const total = notes.length;
  const bons = notes.filter(function(x){return reps[x.n] === true;}).length;

  const parTheme = qcm.themes.map(function(t){
    const idx = notes.filter(function(x){return x.o.t === t.id;}).map(function(x){return x.n;});
    return { nom:t.nom, b:idx.filter(function(n){return reps[n] === true;}).length, n:idx.length };
  }).filter(function(t){return t.n;});

  const pct = total ? bons / total : 0;
  const bilan = qcm.bilans.find(function(x){return pct >= x.min;});

  const rates = notes.map(function(x){
    const o = x.o;
    const rep = reponseDe(tentative, o.id);
    if(rep && rep.juste) return null;
    if(o.type === "code") return { q:o.q, solution:o.src.solution, e:o.e || "" };
    if(o.type === "terminal") return { q:o.q, solution:Terminal.texteSolution(o.src.solution), e:o.e || "" };
    return { q:o.q, r:o.r[o.b], e:o.e, choix: rep ? o.src.r[rep.choix] : null };
  }).filter(Boolean);

  i = -1;
  repondu = true;
  strip.style.display = "flex";
  const examen = !!tentative.examen;
  entete(examen ? "Résultat de l’examen blanc" : "Résultat", '<button class="lien" id="retour">Tous les QCM</button>');
  dessinerStrip();
  hint.textContent = tentative.fin ? (examen ? "Examen blanc · " : "") + qcm.titre + " · terminé le " + quand(tentative.fin) : "";

  panel.innerHTML =
    (examen ? '<p class="theme">📝 Examen blanc · ' + esc(qcm.titre) + '</p>' +
              '<div class="score"><b>' + noteTexte(note20({ bons:bons, total:total })) + '</b><span>/ 20</span></div>' +
              '<p class="sub">' + bons + ' bonne' + (bons > 1 ? 's' : '') + ' réponse' + (bons > 1 ? 's' : '') + ' sur ' + total +
              '. C’est ta note d’examen blanc pour ce QCM, visible sur la page des QCM.</p>'
            : '<div class="score"><b>' + bons + '</b><span>bonnes réponses sur ' + total + '</span></div>') +
    (bilan ? '<p class="lead" style="max-width:56ch">' + fmt(bilan.texte) + '</p>' : '') +
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
          if(r.solution !== undefined)
            return '<li><q>' + fmt(r.q) + '</q><em>Une solution possible :</em>' +
                   '<pre class="code">' + esc(r.solution) + '</pre>' +
                   (r.e ? '<em>' + fmt(r.e) + '</em>' : '') + '</li>';
          return '<li><q>' + fmt(r.q) + '</q>' +
                 (r.choix ? '<em>Tu as répondu : ' + fmt(r.choix) + '</em>' : '') +
                 '<em><b>' + fmt(r.r) + '</b> — ' + fmt(r.e) + '</em></li>';
        }).join("") + '</ul>'
      : '<h2>Aucune erreur. Rien à revoir.</h2>') +
    '<div class="row" style="gap:12px">' +
      '<button class="bigkey" id="print">Imprimer</button>' +
      '<button class="bigkey wire" id="again">' + (examen ? 'Nouvel examen blanc' : 'Recommencer') + '</button>' +
    '</div>';

  surClic("retour", ecranChoix);
  surClic("print", function(){ window.print(); });
  surClic("again", function(){
    if(examen) return commencerExamen(qcm);
    themesChoisis[qcm.id] = new Set(tentative.themes);
    commencer(qcm, themesChoisis[qcm.id]);
  });
}

/* ---------- clavier ---------- */
document.addEventListener("keydown", function(ev){
  if(ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if(ev.target && /^(TEXTAREA|INPUT|SELECT)$/.test(ev.target.tagName)) return;
  const k = ev.key.toLowerCase();
  const examen = tentative && tentative.examen && i >= 0;
  if(!repondu && panel.querySelector(".key[data-n]")){
    const nb = ordre[i].r.length;
    const n = LETTRES.slice(0, nb).map(function(l){return l.toLowerCase();}).indexOf(k);
    const alt = ["1","2","3","4","5","6"].slice(0, nb).indexOf(k);
    const choix = n >= 0 ? n : alt;
    if(choix >= 0){ ev.preventDefault(); if(examen) choisirExamen(choix); else repondre(choix); return; }
  }
  if(k === "enter" && (repondu || examen)){
    const nx = document.getElementById("next");
    if(nx && !nx.disabled){ ev.preventDefault(); nx.click(); }
  }
});

ecranSessions();
