/* Terminal Unix simulé, pour apprendre les commandes sans risque.
   Un petit système de fichiers en mémoire, les commandes de base (ls, cd, pwd, mkdir, touch,
   cat, nano, rm, rmdir, echo, clear, aide), un éditeur nano simplifié et un explorateur qui
   montre l’arborescence en direct.

   Terminal.monter(element, { fs, auChangement(etat) }) installe un terminal dans l’élément.
   « fs » décrit le dossier personnel : { "Documents": { "notes.txt": "contenu" }, "Musique": {} }
   (un texte est un fichier, un objet est un dossier). « etat » sert aux vérifications. */
const Terminal = (function(){
  const UTILISATEUR = "eleve", MACHINE = "ordi", MAISON = "/home/eleve";

  function construire(spec){
    if(typeof spec === "string") return { type:"f", contenu:spec };
    const d = { type:"d", enfants:{} };
    Object.keys(spec || {}).forEach(function(k){ d.enfants[k] = construire(spec[k]); });
    return d;
  }

  // Chemin absolu propre, à partir du dossier « depuis » (gère ~, . et ..).
  function normaliser(depuis, chemin){
    if(chemin === "~" || chemin.indexOf("~/") === 0) chemin = MAISON + chemin.slice(1);
    const abs = chemin.charAt(0) === "/" ? chemin : depuis + "/" + chemin;
    const pile = [];
    abs.split("/").forEach(function(p){
      if(!p || p === ".") return;
      if(p === "..") pile.pop(); else pile.push(p);
    });
    return "/" + pile.join("/");
  }

  function joli(abs){
    if(abs === MAISON) return "~";
    return abs.indexOf(MAISON + "/") === 0 ? "~" + abs.slice(MAISON.length) : abs;
  }

  // Découpe une ligne en mots, en respectant les guillemets ; > et >> sont des mots à part.
  function decouper(ligne){
    const mots = [];
    let mot = "", guillemet = null, enCours = false;
    for(let k = 0; k < ligne.length; k++){
      const c = ligne.charAt(k);
      if(guillemet){
        if(c === guillemet) guillemet = null; else mot += c;
      } else if(c === '"' || c === "'"){
        guillemet = c; enCours = true;
      } else if(/\s/.test(c)){
        if(enCours){ mots.push(mot); mot = ""; enCours = false; }
      } else if(c === ">"){
        if(enCours){ mots.push(mot); mot = ""; enCours = false; }
        if(ligne.charAt(k + 1) === ">"){ mots.push(">>"); k++; } else mots.push(">");
      } else {
        mot += c; enCours = true;
      }
    }
    if(enCours) mots.push(mot);
    return mots;
  }

  function texteSolution(solution){
    return solution.map(function(s){
      if(typeof s === "string") return s;
      return "nano " + s.nano + "\n" +
             "#   (écris le texte, puis Ctrl+O pour enregistrer et Ctrl+X pour quitter)\n" +
             s.texte.replace(/\n$/, "").replace(/^/gm, "#   ");
    }).join("\n");
  }

  function el(tag, cls, texte){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(texte !== undefined) e.textContent = texte;
    return e;
  }

  function monter(hote, options){
    hote.innerHTML =
      '<div class="terminal-zone">' +
        '<div class="terminal">' +
          '<div class="term-ecran">' +
            '<div class="term-sortie" aria-live="polite"></div>' +
            '<label class="term-ligne"><span class="term-invite"></span>' +
              '<input class="term-saisie" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Commande"></label>' +
          '</div>' +
          '<div class="nano" hidden>' +
            '<div class="nano-tete"><span>GNU nano</span><span class="nano-nom"></span><span class="nano-modif"></span></div>' +
            '<textarea class="nano-texte" spellcheck="false" aria-label="Texte du fichier"></textarea>' +
            '<div class="nano-etat"></div>' +
            '<div class="nano-pied">' +
              '<button type="button" class="nano-btn" data-act="enregistrer"><b>^O</b> Enregistrer</button>' +
              '<button type="button" class="nano-btn" data-act="quitter"><b>^X</b> Quitter</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="explorateur"><div class="atelier-tete"><span>Explorateur</span><span class="sub">mis à jour en direct</span></div><ul class="arbre"></ul></div>' +
      '</div>';

    const ecran = hote.querySelector(".term-ecran");
    const sortie = hote.querySelector(".term-sortie");
    const invite = hote.querySelector(".term-invite");
    const saisie = hote.querySelector(".term-saisie");
    const nanoZone = hote.querySelector(".nano");
    const nanoTexte = hote.querySelector(".nano-texte");
    const nanoNom = hote.querySelector(".nano-nom");
    const nanoModif = hote.querySelector(".nano-modif");
    const nanoEtat = hote.querySelector(".nano-etat");
    const arbre = hote.querySelector(".arbre");

    let racine, cwd, historique, rappel, listes, visites, affiches, enregistres, inconnues, nano;

    function initialiser(){
      racine = construire({ bin:{}, etc:{}, tmp:{}, usr:{}, home:{} });
      racine.enfants.home.enfants.eleve = construire(options.fs || {});
      cwd = MAISON;
      historique = []; rappel = 0;
      listes = new Set(); visites = new Set(); affiches = new Set(); enregistres = new Set();
      inconnues = [];
      nano = null;
      sortie.innerHTML = "";
      ecrire("Terminal d’entraînement : tape une commande, puis Entrée. Tape aide pour la liste des commandes.", "t-info");
      majInvite();
      dessinerArbre();
    }

    /* ---------- système de fichiers ---------- */
    function noeud(abs){
      let n = racine;
      const parts = abs.split("/").filter(Boolean);
      for(let k = 0; k < parts.length; k++){
        if(n.type !== "d" || !n.enfants[parts[k]]) return null;
        n = n.enfants[parts[k]];
      }
      return n;
    }
    function parentEtNom(abs){
      const k = abs.lastIndexOf("/");
      return [abs.slice(0, k) || "/", abs.slice(k + 1)];
    }
    function chezSoi(abs){ return abs === MAISON || abs.indexOf(MAISON + "/") === 0; }

    // Crée un fichier ou un dossier ; renvoie un message d’erreur, ou "" si tout va bien.
    function creer(abs, type, avecParents){
      const pn = parentEtNom(abs);
      if(!pn[1]) return "Le fichier existe";
      let parent = noeud(pn[0]);
      if(!parent && avecParents){
        const err = creer(pn[0], "d", true);
        if(err) return err;
        parent = noeud(pn[0]);
      }
      if(!parent) return "Aucun fichier ou dossier de ce nom";
      if(parent.type !== "d") return "N’est pas un dossier";
      if(!chezSoi(abs)) return "Permission non accordée";
      if(parent.enfants[pn[1]]) return "Le fichier existe";
      parent.enfants[pn[1]] = type === "d" ? { type:"d", enfants:{} } : { type:"f", contenu:"" };
      return "";
    }

    /* ---------- affichage ---------- */
    function ecrire(texte, cls){
      const ligne = el("div", "t-ligne" + (cls ? " " + cls : ""), texte);
      sortie.appendChild(ligne);
      return ligne;
    }
    function erreur(texte){ ecrire(texte, "t-erreur"); }

    function majInvite(){ invite.textContent = UTILISATEUR + "@" + MACHINE + ":" + joli(cwd) + "$"; }

    function defiler(){
      while(sortie.childNodes.length > 300) sortie.removeChild(sortie.firstChild);
      ecran.scrollTop = ecran.scrollHeight;
    }

    function dessinerArbre(){
      arbre.innerHTML = "";
      function branche(n, nom, abs){
        const li = el("li");
        const ici = abs === cwd;
        const etiquette = el("span", "arbre-nom" + (n.type === "d" ? " dossier" : "") + (ici ? " ici" : ""),
          (n.type === "d" ? (ici ? "📂 " : "📁 ") : "📄 ") + nom);
        li.appendChild(etiquette);
        if(ici) li.appendChild(el("span", "arbre-ici", " ← tu es ici"));
        if(n.type === "d"){
          const noms = Object.keys(n.enfants).sort(function(a, b){
            const da = n.enfants[a].type === "d", db = n.enfants[b].type === "d";
            return da === db ? a.localeCompare(b, "fr") : (da ? -1 : 1);
          });
          if(noms.length){
            const ul = el("ul");
            noms.forEach(function(k){ ul.appendChild(branche(n.enfants[k], k, abs + "/" + k)); });
            li.appendChild(ul);
          }
        }
        return li;
      }
      arbre.appendChild(branche(noeud(MAISON), "eleve (~)", MAISON));
      if(!chezSoi(cwd)) arbre.appendChild(el("li", "arbre-hors", "Tu es en dehors de ton dossier personnel : " + cwd));
    }

    function signaler(){
      dessinerArbre();
      defiler();
      if(options.auChangement) options.auChangement(etat());
    }

    /* ---------- commandes ---------- */
    function nomsTries(d){ return Object.keys(d.enfants).sort(function(a, b){ return a.localeCompare(b, "fr"); }); }

    function lister(abs, n, details, tout){
      if(n.type === "f"){ ecrire(parentEtNom(abs)[1]); return; }
      listes.add(abs);
      const noms = (tout ? [".", ".."] : []).concat(nomsTries(n));
      if(details){
        noms.forEach(function(nom){
          const e = nom === "." || nom === ".." ? { type:"d" } : n.enfants[nom];
          const taille = e.type === "d" ? 4096 : new Blob([e.contenu]).size;
          const ligne = el("div", "t-ligne");
          ligne.appendChild(document.createTextNode((e.type === "d" ? "drwxr-xr-x" : "-rw-r--r--") + " 1 eleve eleve " +
            String(taille).padStart(5) + " oct.  5 10:00 "));
          ligne.appendChild(el("span", e.type === "d" ? "t-dossier" : "", nom));
          sortie.appendChild(ligne);
        });
        return;
      }
      if(!noms.length) return;
      const ligne = el("div", "t-ligne t-colonnes");
      noms.forEach(function(nom){
        const estDossier = nom === "." || nom === ".." || n.enfants[nom].type === "d";
        ligne.appendChild(el("span", estDossier ? "t-dossier" : "", nom));
      });
      sortie.appendChild(ligne);
    }

    const commandes = {
      aide: function(){
        [
          "pwd                 affiche le dossier où tu te trouves",
          "ls [dossier]        liste le contenu d’un dossier (ls -l : plus de détails)",
          "cd dossier          entre dans un dossier (cd .. remonte, cd seul ramène à ~)",
          "mkdir nom           crée un dossier",
          "touch nom           crée un fichier vide",
          "cat fichier         affiche le contenu d’un fichier",
          "nano fichier        ouvre l’éditeur de texte nano",
          "echo texte          affiche un texte (echo texte > fichier l’écrit dans un fichier)",
          "rm fichier          supprime un fichier (rmdir pour un dossier vide)",
          "clear               efface l’écran"
        ].forEach(function(l){ ecrire(l, "t-info"); });
      },
      pwd: function(){ ecrire(cwd); },
      whoami: function(){ ecrire(UTILISATEUR); },
      clear: function(){ sortie.innerHTML = ""; },
      exit: function(){ ecrire("Ici, le terminal reste ouvert 😉", "t-info"); },

      ls: function(args){
        const opts = args.filter(function(a){ return a.charAt(0) === "-"; }).join("");
        const chemins = args.filter(function(a){ return a.charAt(0) !== "-"; });
        const details = opts.indexOf("l") >= 0, tout = opts.indexOf("a") >= 0;
        if(!chemins.length) chemins.push(".");
        chemins.forEach(function(c, k){
          const abs = normaliser(cwd, c);
          const n = noeud(abs);
          if(!n){ erreur("ls: impossible d’accéder à '" + c + "': Aucun fichier ou dossier de ce nom"); return; }
          if(chemins.length > 1 && n.type === "d"){ if(k) ecrire(""); ecrire(c + " :"); }
          lister(abs, n, details, tout);
        });
      },

      cd: function(args){
        if(args.length > 1){ erreur("bash: cd: trop d’arguments"); return; }
        const abs = args.length ? normaliser(cwd, args[0]) : MAISON;
        const n = noeud(abs);
        if(!n){ erreur("bash: cd: " + args[0] + ": Aucun fichier ou dossier de ce nom"); return; }
        if(n.type !== "d"){ erreur("bash: cd: " + args[0] + ": N’est pas un dossier"); return; }
        cwd = abs;
        visites.add(abs);
        majInvite();
      },

      mkdir: function(args){
        const p = args.indexOf("-p") >= 0;
        const noms = args.filter(function(a){ return a !== "-p"; });
        if(!noms.length){ erreur("mkdir : opérande manquant (exemple : mkdir projets)"); return; }
        noms.forEach(function(nom){
          const abs = normaliser(cwd, nom);
          if(p && noeud(abs) && noeud(abs).type === "d") return;
          const err = creer(abs, "d", p);
          if(err) erreur("mkdir: impossible de créer le répertoire « " + nom + " »: " + err);
        });
      },

      touch: function(args){
        if(!args.length){ erreur("touch : opérande de fichier manquant (exemple : touch notes.txt)"); return; }
        args.forEach(function(nom){
          const abs = normaliser(cwd, nom);
          if(noeud(abs)) return;
          const err = creer(abs, "f");
          if(err) erreur("touch: impossible de faire un touch '" + nom + "': " + err);
        });
      },

      cat: function(args){
        if(!args.length){ erreur("cat : donne un nom de fichier (exemple : cat notes.txt)"); return; }
        args.forEach(function(nom){
          const abs = normaliser(cwd, nom);
          const n = noeud(abs);
          if(!n){ erreur("cat: " + nom + ": Aucun fichier ou dossier de ce nom"); return; }
          if(n.type === "d"){ erreur("cat: " + nom + ": est un dossier"); return; }
          affiches.add(abs);
          n.contenu.replace(/\n$/, "").split("\n").forEach(function(l){ if(n.contenu) ecrire(l); });
        });
      },

      echo: function(args){
        const k = args.findIndex(function(a){ return a === ">" || a === ">>"; });
        if(k < 0){ ecrire(args.join(" ")); return; }
        const texte = args.slice(0, k).join(" ") + "\n";
        const nom = args[k + 1];
        if(!nom){ erreur("bash: erreur de syntaxe : il manque le nom du fichier après " + args[k]); return; }
        const abs = normaliser(cwd, nom);
        let n = noeud(abs);
        if(n && n.type === "d"){ erreur("bash: " + nom + ": est un dossier"); return; }
        if(!n){
          const err = creer(abs, "f");
          if(err){ erreur("bash: " + nom + ": " + err); return; }
          n = noeud(abs);
        }
        n.contenu = args[k] === ">>" ? n.contenu + texte : texte;
      },

      rm: function(args){
        const r = args.some(function(a){ return /^-[a-z]*r/i.test(a); });
        const noms = args.filter(function(a){ return a.charAt(0) !== "-"; });
        if(!noms.length){ erreur("rm : opérande manquant (exemple : rm notes.txt)"); return; }
        noms.forEach(function(nom){
          const abs = normaliser(cwd, nom);
          const n = noeud(abs);
          if(!n){ erreur("rm: impossible de supprimer '" + nom + "': Aucun fichier ou dossier de ce nom"); return; }
          if(n.type === "d" && !r){ erreur("rm: impossible de supprimer '" + nom + "': est un dossier"); return; }
          if(!chezSoi(abs) || abs === MAISON){ erreur("rm: impossible de supprimer '" + nom + "': Permission non accordée"); return; }
          if(cwd === abs || cwd.indexOf(abs + "/") === 0) cwd = parentEtNom(abs)[0];
          const pn = parentEtNom(abs);
          delete noeud(pn[0]).enfants[pn[1]];
          majInvite();
        });
      },

      rmdir: function(args){
        if(!args.length){ erreur("rmdir : opérande manquant"); return; }
        args.forEach(function(nom){
          const abs = normaliser(cwd, nom);
          const n = noeud(abs);
          if(!n){ erreur("rmdir: impossible de supprimer '" + nom + "': Aucun fichier ou dossier de ce nom"); return; }
          if(n.type !== "d"){ erreur("rmdir: impossible de supprimer '" + nom + "': N’est pas un dossier"); return; }
          if(Object.keys(n.enfants).length){ erreur("rmdir: impossible de supprimer '" + nom + "': Le dossier n’est pas vide"); return; }
          if(!chezSoi(abs) || abs === MAISON){ erreur("rmdir: impossible de supprimer '" + nom + "': Permission non accordée"); return; }
          const pn = parentEtNom(abs);
          delete noeud(pn[0]).enfants[pn[1]];
        });
      },

      nano: function(args){
        if(!args.length){ erreur("nano : donne un nom de fichier (exemple : nano notes.txt)"); return; }
        const abs = normaliser(cwd, args[0]);
        const n = noeud(abs);
        if(n && n.type === "d"){ erreur("nano : « " + args[0] + " » est un dossier"); return; }
        const parent = noeud(parentEtNom(abs)[0]);
        if(!parent || parent.type !== "d"){ erreur("nano : le dossier « " + joli(parentEtNom(abs)[0]) + " » n’existe pas"); return; }
        if(!chezSoi(abs)){ erreur("nano : « " + args[0] + " » : Permission non accordée"); return; }
        ouvrirNano(abs, n ? n.contenu : "");
      }
    };
    commandes.help = commandes.aide;

    function executer(ligne){
      ligne = ligne.replace(/\s+$/, "");
      const echo = ecrire("", "t-commande");
      echo.appendChild(el("span", "t-invite", invite.textContent + " "));
      echo.appendChild(document.createTextNode(ligne));
      if(ligne.trim()){
        historique.push(ligne.trim());
        rappel = historique.length;
        const mots = decouper(ligne);
        const nom = mots[0];
        if(commandes[nom]) commandes[nom](mots.slice(1));
        else {
          inconnues.push(nom);
          erreur(nom + " : commande introuvable (tape aide pour voir les commandes)");
        }
      }
      signaler();
    }

    /* ---------- nano ---------- */
    function ouvrirNano(abs, contenu){
      nano = { abs:abs, initial:contenu, avertir:false };
      nanoNom.textContent = parentEtNom(abs)[1];
      nanoTexte.value = contenu;
      nanoModif.textContent = "";
      nanoEtat.textContent = noeud(abs) ? "" : "[ Nouveau fichier ]";
      nanoZone.hidden = false;
      ecran.hidden = true;
      nanoTexte.focus();
    }

    function enregistrerNano(){
      if(!nano) return;
      let n = noeud(nano.abs);
      if(!n){ creer(nano.abs, "f"); n = noeud(nano.abs); }
      n.contenu = nanoTexte.value;
      nano.initial = nanoTexte.value;
      nano.avertir = false;
      enregistres.add(nano.abs);
      const lignes = nanoTexte.value ? nanoTexte.value.replace(/\n$/, "").split("\n").length : 0;
      nanoEtat.textContent = "[ " + lignes + " ligne" + (lignes > 1 ? "s" : "") + " écrite" + (lignes > 1 ? "s" : "") + " ]";
      nanoModif.textContent = "";
      dessinerArbre();
      if(options.auChangement) options.auChangement(etat());
    }

    function quitterNano(force){
      if(!nano) return;
      if(nanoTexte.value !== nano.initial && !nano.avertir && !force){
        nano.avertir = true;
        nanoEtat.textContent = "Modifications non enregistrées ! ^O pour enregistrer, ou ^X encore une fois pour quitter sans enregistrer.";
        return;
      }
      nano = null;
      nanoZone.hidden = true;
      ecran.hidden = false;
      saisie.focus();
      signaler();
    }

    nanoTexte.addEventListener("input", function(){
      if(nano){ nanoModif.textContent = nanoTexte.value !== nano.initial ? "Modifié" : ""; nano.avertir = false; }
    });
    nanoTexte.addEventListener("keydown", function(ev){
      if(!(ev.ctrlKey || ev.metaKey)) return;
      const k = ev.key.toLowerCase();
      if(k === "o" || k === "s"){ ev.preventDefault(); enregistrerNano(); }
      else if(k === "x"){ ev.preventDefault(); quitterNano(); }
    });
    hote.querySelectorAll(".nano-btn").forEach(function(b){
      b.onclick = function(){
        if(b.dataset.act === "enregistrer") enregistrerNano(); else quitterNano();
        if(nano) nanoTexte.focus();
      };
    });

    /* ---------- saisie ---------- */
    // Tab : complète le nom de commande (premier mot) ou le nom de fichier (mots suivants).
    function completer(){
      const valeur = saisie.value;
      const mot = /(\S*)$/.exec(valeur)[1];
      const premierMot = valeur.trim() === mot;
      const k = mot.lastIndexOf("/");
      const dossier = k >= 0 ? mot.slice(0, k + 1) : "";
      const debut = mot.slice(k + 1);
      let candidats, estDossier;
      if(premierMot){
        candidats = Object.keys(commandes);
        estDossier = function(){ return false; };
      } else {
        const n = noeud(normaliser(cwd, dossier || "."));
        if(!n || n.type !== "d") return;
        candidats = Object.keys(n.enfants);
        estDossier = function(c){ return n.enfants[c].type === "d"; };
      }
      const choix = candidats.filter(function(x){ return x.indexOf(debut) === 0; });
      if(!choix.length) return;
      let commun = choix[0];
      choix.forEach(function(c){ while(c.indexOf(commun) !== 0) commun = commun.slice(0, -1); });
      let fin = commun;
      if(choix.length === 1) fin += estDossier(commun) ? "/" : " ";
      else if(commun === debut){
        ecrire(invite.textContent + " " + valeur, "t-commande");
        ecrire(choix.join("  "));
        defiler();
      }
      saisie.value = valeur.slice(0, valeur.length - mot.length) + dossier + fin;
    }

    saisie.addEventListener("keydown", function(ev){
      if(ev.key === "Enter"){
        ev.preventDefault();
        const ligne = saisie.value;
        saisie.value = "";
        executer(ligne);
      } else if(ev.key === "ArrowUp"){
        ev.preventDefault();
        if(rappel > 0){ rappel--; saisie.value = historique[rappel]; }
      } else if(ev.key === "ArrowDown"){
        ev.preventDefault();
        if(rappel < historique.length - 1){ rappel++; saisie.value = historique[rappel]; }
        else { rappel = historique.length; saisie.value = ""; }
      } else if(ev.key === "Tab"){
        ev.preventDefault();
        completer();
      } else if(ev.ctrlKey && ev.key.toLowerCase() === "l"){
        ev.preventDefault();
        sortie.innerHTML = "";
      } else if(ev.ctrlKey && ev.key.toLowerCase() === "c" && saisie.selectionStart === saisie.selectionEnd){
        ecrire(invite.textContent + " " + saisie.value + "^C", "t-commande");
        saisie.value = "";
        defiler();
      }
    });
    ecran.addEventListener("click", function(){
      if(!window.getSelection().toString()) saisie.focus();
    });

    /* ---------- état, pour les vérifications ---------- */
    function etat(){
      function abs(p){ return normaliser(MAISON, p); }
      function trouve(p){ return noeud(abs(p)); }
      return {
        dossier: joli(cwd),
        commandes: historique.slice(),
        inconnues: inconnues.slice(),
        enregistres: Array.from(enregistres).map(joli),
        existe: function(p){ return !!trouve(p); },
        estDossier: function(p){ const n = trouve(p); return !!n && n.type === "d"; },
        estFichier: function(p){ const n = trouve(p); return !!n && n.type === "f"; },
        contenu: function(p){ const n = trouve(p); return n && n.type === "f" ? n.contenu : null; },
        a_tape: function(re){ return historique.some(function(c){ return re.test(c); }); },
        aListe: function(p){ return listes.has(abs(p)); },
        aVisite: function(p){ return visites.has(abs(p)); },
        aAffiche: function(p){ return affiches.has(abs(p)); }
      };
    }

    initialiser();

    function pause(ms){ return new Promise(function(ok){ setTimeout(ok, ms); }); }

    return {
      etat: etat,
      executer: executer,
      reinitialiser: initialiser,
      // Rejoue une solution : des commandes, ou { nano, texte } pour écrire un fichier avec nano.
      jouer: async function(solution){
        if(nano) quitterNano(true);
        for(const s of solution){
          await pause(250);
          if(typeof s === "string"){ executer(s); continue; }
          executer("nano " + s.nano);
          await pause(300);
          nanoTexte.value = s.texte;
          enregistrerNano();
          await pause(300);
          quitterNano(true);
        }
      }
    };
  }

  return { monter:monter, texteSolution:texteSolution };
})();
