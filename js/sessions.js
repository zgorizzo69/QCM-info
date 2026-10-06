/* Sessions : stockage dans le navigateur (localStorage), export et import en JSON.

   Une session :
     { id, nom, creeLe, majLe, tentatives:[ tentative, ... ] }
   Une tentative (un passage d’un QCM) :
     { id, qcm, debut, fin, themes:[idTheme], examen?:true,
       ordre:[ { q:idQuestion, p:[ordre d’affichage des réponses] } ],
       reponses:[ { q:idQuestion, choix:indiceDansR, juste:bool, le:dateISO } ] }
   « examen » marque un examen blanc : la session n’en garde qu’un par QCM, le dernier.
   « choix » est l’indice de la réponse dans la liste r du fichier QCM, avant mélange. */
const Sessions = (function(){
  const CLE = "qcm-info.sessions";
  const FORMAT_UNE = "qcm-info/session";
  const FORMAT_TOUTES = "qcm-info/sessions";
  const VERSION = 1;

  let persistant = true;
  let memoire = { version:VERSION, sessions:[] };

  function lire(){
    try{
      const brut = localStorage.getItem(CLE);
      memoire = brut ? JSON.parse(brut) : { version:VERSION, sessions:[] };
      if(!Array.isArray(memoire.sessions)) memoire.sessions = [];
    }catch(e){
      persistant = false;
    }
    return memoire;
  }

  function ecrire(etat){
    memoire = etat;
    try{ localStorage.setItem(CLE, JSON.stringify(etat)); }
    catch(e){ persistant = false; }
  }

  // Relit avant chaque modification, pour ne pas écraser ce qu’un autre onglet a enregistré.
  function modifier(fn){
    const etat = lire();
    const res = fn(etat);
    ecrire(etat);
    return res;
  }

  function nouvelId(){
    if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function maintenant(){ return new Date().toISOString(); }

  function chercher(etat, id){
    return etat.sessions.find(function(s){return s.id === id;});
  }

  function nettoyer(s){
    if(!s || typeof s.id !== "string" || typeof s.nom !== "string" || !Array.isArray(s.tentatives)) return null;
    return {
      id: s.id,
      nom: s.nom.trim() || "Sans nom",
      creeLe: s.creeLe || maintenant(),
      majLe: s.majLe || s.creeLe || maintenant(),
      tentatives: s.tentatives.filter(function(t){
        return t && typeof t.qcm === "string" && Array.isArray(t.ordre) && Array.isArray(t.reponses);
      })
    };
  }

  function telecharger(nomFichier, donnees){
    const blob = new Blob([JSON.stringify(donnees, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  }

  function slug(txt){
    return txt.normalize("NFD").replace(/[̀-ͯ]/g, "")
              .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "session";
  }

  function jour(){ return new Date().toISOString().slice(0, 10); }

  return {
    persistant: function(){ lire(); return persistant; },

    liste: function(){
      return lire().sessions.slice().sort(function(a,b){return b.majLe < a.majLe ? -1 : 1;});
    },

    trouver: function(id){ return chercher(lire(), id); },

    creer: function(nom){
      const s = { id:nouvelId(), nom:nom.trim(), creeLe:maintenant(), majLe:maintenant(), tentatives:[] };
      modifier(function(etat){ etat.sessions.push(s); });
      return s;
    },

    supprimer: function(id){
      modifier(function(etat){
        etat.sessions = etat.sessions.filter(function(s){return s.id !== id;});
      });
    },

    // Un nouvel examen blanc remplace l’examen non terminé du même QCM, s’il y en a un.
    nouvelleTentative: function(idSession, qcm, themes, ordre, examen){
      const t = { id:nouvelId(), qcm:qcm, debut:maintenant(), fin:null, themes:themes, ordre:ordre, reponses:[] };
      if(examen) t.examen = true;
      modifier(function(etat){
        const s = chercher(etat, idSession);
        if(examen) s.tentatives = s.tentatives.filter(function(x){ return !(x.examen && x.qcm === qcm && !x.fin); });
        s.tentatives.push(t);
        s.majLe = t.debut;
      });
      return t;
    },

    // Enregistre une réponse dès qu’elle est donnée ; « fin » est posée à la dernière question.
    // Un examen blanc terminé remplace le précédent examen blanc du même QCM.
    repondre: function(idSession, idTentative, reponse, derniere){
      return modifier(function(etat){
        const s = chercher(etat, idSession);
        const t = s && s.tentatives.find(function(x){return x.id === idTentative;});
        if(!t) return null;
        t.reponses = t.reponses.filter(function(r){return r.q !== reponse.q;});
        t.reponses.push(reponse);
        if(derniere) t.fin = reponse.le;
        if(derniere && t.examen)
          s.tentatives = s.tentatives.filter(function(x){ return x === t || !(x.examen && x.qcm === t.qcm); });
        s.majLe = reponse.le;
        return t;
      });
    },

    exporter: function(id){
      const s = chercher(lire(), id);
      if(!s) return;
      telecharger("qcm-" + slug(s.nom) + "-" + jour() + ".json",
                  { format:FORMAT_UNE, version:VERSION, exporteLe:maintenant(), session:s });
    },

    exporterTout: function(){
      telecharger("qcm-sessions-" + jour() + ".json",
                  { format:FORMAT_TOUTES, version:VERSION, exporteLe:maintenant(), sessions:lire().sessions });
    },

    // Lit le contenu d’un fichier exporté. « conflit(session) » décide quoi faire quand une session
    // du fichier existe déjà : renvoie "remplacer", "copie" ou "ignorer".
    importer: function(texte, conflit){
      let donnees;
      try{ donnees = JSON.parse(texte); }
      catch(e){ throw new Error("Ce fichier n’est pas un fichier JSON valide."); }

      let lot;
      if(donnees && donnees.format === FORMAT_UNE) lot = [donnees.session];
      else if(donnees && donnees.format === FORMAT_TOUTES && Array.isArray(donnees.sessions)) lot = donnees.sessions;
      else throw new Error("Ce fichier n’est pas un export de sessions QCM.");

      const propres = lot.map(nettoyer).filter(Boolean);
      if(!propres.length) throw new Error("Aucune session lisible dans ce fichier.");

      return modifier(function(etat){
        let n = 0;
        propres.forEach(function(s){
          const existante = chercher(etat, s.id);
          if(existante){
            const choix = conflit(existante, s);
            if(choix === "ignorer") return;
            if(choix === "remplacer"){
              etat.sessions[etat.sessions.indexOf(existante)] = s;
              n++;
              return;
            }
            s.id = nouvelId();
            s.nom = s.nom + " (importée)";
          }
          etat.sessions.push(s);
          n++;
        });
        return n;
      });
    }
  };
})();
