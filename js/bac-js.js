/* Bac à sable JavaScript : exécute le code d’un élève dans une iframe isolée
   (sandbox="allow-scripts", sans allow-same-origin : le code ne peut toucher ni à l’application
   ni aux sessions enregistrées).

   Dans l’iframe, un « harnais » :
     - recopie console.log, alert et les erreurs, et les envoie à l’application ;
     - simule prompt() avec une liste de réponses données à l’avance ;
     - arrête une boucle qui dépasse un million de tours (sinon la page entière se fige) ;
     - peut lancer une « sonde » après le code de l’élève : une fonction qui regarde le résultat
       (variables, page, fonctions de l’élève) et renvoie vrai ou faux.

   BacJs.monter(iframe, options) : exécution visible, l’état est renvoyé à chaque changement.
   BacJs.executer(options) : exécution cachée, pour vérifier un exercice ; renvoie une promesse.
   options : { code, page (HTML du corps), reponses (pour prompt), avant (fonction lancée avant le
   code), sonde (fonction (p) => booléen), surEtat (exécution visible) }. */
const BacJs = (function(){
  let compteur = 0;
  const ecoutes = {};   // id d’exécution → fonction appelée à chaque message

  window.addEventListener("message", function(ev){
    const d = ev.data;
    if(d && typeof d.bac === "string" && ecoutes[d.bac]) ecoutes[d.bac](d);
  });

  /* ---------- garde-fou dans les boucles ---------- */
  // Ajoute __boucle(); au début du corps de chaque for, while et do { … } écrit avec des accolades.
  function proteger(code){
    let out = "", k = 0;
    const n = code.length;
    function chaine(q){            // recopie une chaîne qui commence en k
      let s = code[k++];
      while(k < n && code[k] !== q){
        if(code[k] === "\\") s += code[k++];
        if(k < n) s += code[k++];
      }
      if(k < n) s += code[k++];
      return s;
    }
    function blanc(){              // recopie espaces et commentaires
      let s = "";
      for(;;){
        if(/\s/.test(code[k] || "")) s += code[k++];
        else if(code.startsWith("//", k)){ while(k < n && code[k] !== "\n") s += code[k++]; }
        else if(code.startsWith("/*", k)){ const f = code.indexOf("*/", k + 2); const e = f < 0 ? n : f + 2; s += code.slice(k, e); k = e; }
        else return s;
      }
    }
    function parentheses(){        // recopie ( … ) en tenant compte des chaînes
      let s = "", prof = 0;
      while(k < n){
        const c = code[k];
        if(c === '"' || c === "'" || c === "`"){ s += chaine(c); continue; }
        s += c; k++;
        if(c === "(") prof++;
        else if(c === ")" && --prof === 0) break;
      }
      return s;
    }
    let precedent = "";
    while(k < n){
      const c = code[k];
      if(c === '"' || c === "'" || c === "`"){ out += chaine(c); precedent = c; continue; }
      if(code.startsWith("//", k) || code.startsWith("/*", k)){ out += blanc(); continue; }
      if(/[A-Za-z_$]/.test(c)){
        let mot = "";
        while(k < n && /[\w$]/.test(code[k])) mot += code[k++];
        out += mot;
        if(precedent !== "." && (mot === "for" || mot === "while" || mot === "do")){
          if(mot !== "do"){
            out += blanc();
            if(code[k] !== "(") { precedent = mot; continue; }
            out += parentheses();
          }
          out += blanc();
          if(code[k] === "{"){ out += "{__boucle();"; k++; }
        }
        precedent = mot.slice(-1);
        continue;
      }
      out += c; k++;
      if(!/\s/.test(c)) precedent = c;
    }
    return out;
  }

  /* ---------- le harnais, exécuté dans l’iframe ---------- */
  function harnais(id, reponses){
    var logs = [], erreurs = [], envoi = null, tours = 0, rep = 0;
    var st = window.setTimeout, si = window.setInterval;

    function fmt(v, dedans){
      if(typeof v === "string") return dedans ? '"' + v + '"' : v;
      if(v === null) return "null";
      if(v === undefined) return "undefined";
      if(typeof v === "function") return "ƒ " + (v.name || "anonyme") + "()";
      if(Array.isArray(v)) return "[" + v.map(function(x){ return fmt(x, true); }).join(", ") + "]";
      if(typeof Element !== "undefined" && v instanceof Element)
        return "<" + v.tagName.toLowerCase() + (v.id ? ' id="' + v.id + '"' : "") + (v.className ? ' class="' + v.className + '"' : "") + ">";
      if(typeof v === "object"){
        try{ return "{ " + Object.keys(v).map(function(c){ return c + ": " + fmt(v[c], true); }).join(", ") + " }"; }
        catch(e){ return String(v); }
      }
      return String(v);
    }
    function corps(){
      if(!document.body) return "";
      var b = document.body.cloneNode(true);
      Array.prototype.forEach.call(b.querySelectorAll("script"), function(s){ s.remove(); });
      return b.innerHTML;
    }
    function envoyer(fini, sonde){
      var m = { bac:id, logs:logs.slice(), erreurs:erreurs.slice(), html:corps(), fini:!!fini };
      if(arguments.length > 1) m.sonde = sonde;
      parent.postMessage(m, "*");
    }
    function plusTard(){
      if(envoi) return;
      envoi = st(function(){ envoi = null; envoyer(false); }, 30);
    }
    function ajouter(type, args){
      logs.push({ t:type, x:Array.prototype.map.call(args, function(a){ return fmt(a); }).join(" ") });
      if(logs.length > 400) logs.splice(0, logs.length - 400);
      plusTard();
    }
    console.log = console.info = console.debug = function(){ ajouter("log", arguments); };
    console.warn = function(){ ajouter("warn", arguments); };
    console.error = function(){ ajouter("error", arguments); };
    window.alert = function(m){ ajouter("alerte", ["🔔 " + fmt(m === undefined ? "" : m)]); };
    window.prompt = function(q){
      var r = rep < reponses.length ? String(reponses[rep++]) : null;
      ajouter("question", ["❓ " + fmt(q === undefined ? "" : q) + " → " + (r === null ? "(pas de réponse)" : "« " + r + " »")]);
      return r;
    };
    window.confirm = function(q){ ajouter("question", ["❓ " + fmt(q) + " → OK"]); return true; };
    window.__boucle = function(){
      if(++tours > 1000000){ tours = 0; throw new Error("__BOUCLE__"); }
    };
    window.setTimeout = function(f, d){
      var a = Array.prototype.slice.call(arguments, 2);
      return st(function(){ tours = 0; if(typeof f === "function") f.apply(null, a); plusTard(); }, d);
    };
    window.setInterval = function(f, d){
      var a = Array.prototype.slice.call(arguments, 2);
      return si(function(){ tours = 0; if(typeof f === "function") f.apply(null, a); plusTard(); }, Math.max(d || 0, 15));
    };
    ["click", "input", "change", "keydown", "keyup", "submit", "pointerdown", "mouseover"].forEach(function(t){
      document.addEventListener(t, function(){ tours = 0; plusTard(); }, true);
    });
    window.addEventListener("error", function(ev){
      erreurs.push({ message:String(ev.message || (ev.error && ev.error.message) || "Erreur"), ligne:ev.lineno || 0 });
      plusTard();
    });
    window.addEventListener("unhandledrejection", function(ev){
      erreurs.push({ message:String(ev.reason && ev.reason.message || ev.reason), ligne:0 });
      plusTard();
    });

    // Outils donnés à la sonde.
    var p = {
      logs:function(){ return logs.map(function(l){ return l.x; }); },
      el:function(s){ return document.querySelector(s); },
      tous:function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); },
      texte:function(s){ var e = document.querySelector(s); return e ? e.textContent.trim() : ""; },
      cliquer:function(s){ var e = document.querySelector(s); tours = 0; if(e) e.click(); return !!e; },
      taper:function(s, v){
        var e = document.querySelector(s);
        if(!e) return false;
        e.value = v;
        e.dispatchEvent(new Event("input", { bubbles:true }));
        e.dispatchEvent(new Event("change", { bubbles:true }));
        return true;
      },
      style:function(s, prop){ var e = document.querySelector(s); return e ? getComputedStyle(e)[prop] : ""; },
      attendre:function(ms){ return new Promise(function(ok){ st(ok, ms); }); }
    };

    window.__avant = function(src){
      try{ (0, eval)("(" + src + ")")(p); }catch(e){}
    };
    window.__fin = function(src){
      if(!src){ st(function(){ envoyer(true); }, 20); return; }
      var r;
      try{ r = (0, eval)("(" + src + ")")(p); }catch(e){ r = false; }
      Promise.resolve(r).then(function(v){ envoyer(true, !!v); }, function(){ envoyer(true, false); });
    };
  }

  const STYLE = "body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;margin:12px;color:#17212B;line-height:1.45}" +
                "button{font:inherit;cursor:pointer}";

  // Le document complet de l’iframe ; decalage = numéro de ligne juste avant le code de l’élève.
  function documentDe(o, id){
    const securise = function(s){ return String(s).replace(/<\/(script)/gi, "<\\/$1"); };
    const avant =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + STYLE + '</style></head><body>' + (o.page || "") +
      '<script>(' + harnais.toString() + ')(' + JSON.stringify(id) + ',' + securise(JSON.stringify(o.reponses || [])) + ');' +
      (o.avant ? '__avant(' + securise(JSON.stringify(o.avant.toString())) + ');' : '') + '<\/script>\n<script>\n';
    const decalage = avant.split("\n").length - 1;
    return {
      html: avant + securise(proteger(o.code || "")) + '\n<\/script>\n<script>__fin(' +
            (o.sonde ? securise(JSON.stringify(o.sonde.toString())) : '') + ')<\/script></body></html>',
      decalage: decalage
    };
  }

  function nettoyer(d, decalage){
    return {
      logs: d.logs || [],
      erreurs: (d.erreurs || []).map(function(e){
        return { message:e.message, ligne:e.ligne > decalage ? e.ligne - decalage : 0 };
      }),
      html: d.html || "",
      fini: !!d.fini,
      sonde: d.sonde
    };
  }

  function monter(iframe, o){
    if(iframe.dataset.bac) delete ecoutes[iframe.dataset.bac];
    const id = "b" + (++compteur);
    iframe.dataset.bac = id;
    const doc = documentDe(o, id);
    ecoutes[id] = function(d){
      if(!iframe.isConnected){ delete ecoutes[id]; return; }
      if(o.surEtat) o.surEtat(nettoyer(d, doc.decalage));
    };
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.srcdoc = doc.html;
  }

  function executer(o){
    return new Promise(function(ok){
      const id = "b" + (++compteur);
      const doc = documentDe(o, id);
      const iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.setAttribute("aria-hidden", "true");
      iframe.tabIndex = -1;
      iframe.style.cssText = "position:absolute;left:-9999px;top:0;width:600px;height:400px;border:0;visibility:hidden";
      let fini = false;
      const minuterie = setTimeout(function(){
        terminer({ logs:[], erreurs:[{ message:"__TEMPS__", ligne:0 }], html:"", fini:true });
      }, o.delai || 4000);
      function terminer(r){
        if(fini) return;
        fini = true;
        clearTimeout(minuterie);
        delete ecoutes[id];
        iframe.remove();
        ok(r);
      }
      ecoutes[id] = function(d){ if(d.fini) terminer(nettoyer(d, doc.decalage)); };
      iframe.srcdoc = doc.html;
      document.body.appendChild(iframe);
    });
  }

  /* ---------- messages d’erreur en français ---------- */
  const TRADUCTIONS = [
    [/__BOUCLE__/, function(){ return "Ta boucle tourne sans fin (plus d’un million de tours) : vérifie sa condition d’arrêt, et que la variable change bien à chaque tour."; }],
    [/__TEMPS__/, function(){ return "Ton programme met trop de temps à répondre : y a-t-il une boucle sans fin ?"; }],
    [/^(\S+) is not defined/, function(m){ return "« " + m[1] + " » n’existe pas. As-tu bien créé cette variable ou cette fonction ? Vérifie l’orthographe, les accents et les majuscules."; }],
    [/Cannot access '(.+)' before initialization/, function(m){ return "« " + m[1] + " » est utilisée avant d’être créée : déplace la ligne avec let ou const plus haut."; }],
    [/Assignment to constant variable/, function(){ return "On ne peut pas changer une variable créée avec const : utilise let si sa valeur doit changer."; }],
    [/Identifier '(.+)' has already been declared/, function(m){ return "« " + m[1] + " » est créée deux fois : écris let ou const seulement la première fois."; }],
    [/(\S+) is not a function/, function(m){ return "« " + m[1] + " » n’est pas une fonction : vérifie son nom (majuscules comprises) et les parenthèses."; }],
    [/Cannot (?:read|set) propert(?:y|ies) of (null|undefined)(?: \((?:reading|setting) '(.+)'\))?/, function(m){
      return "Tu utilises « ." + (m[2] || "…") + " » sur quelque chose qui vaut " + m[1] + ". Souvent : querySelector n’a rien trouvé (vérifie le # ou le . du sélecteur), ou une variable est vide."; }],
    [/Unexpected end of input/, function(){ return "Le code s’arrête trop tôt : une accolade } ou une parenthèse ) n’est pas fermée."; }],
    [/missing \) after argument list/, function(){ return "Il manque une parenthèse fermante ), ou un + entre deux morceaux de texte."; }],
    [/Invalid or unexpected token/, function(){ return "Caractère invalide : un guillemet n’est peut-être pas fermé."; }],
    [/Unexpected string/, function(){ return "Texte inattendu : il manque peut-être un + ou une virgule entre deux morceaux."; }],
    [/Unexpected identifier '?(\w*)'?/, function(m){ return "Mot inattendu" + (m[1] ? " « " + m[1] + " »" : "") + " : il manque peut-être un +, une virgule, une parenthèse ou un guillemet juste avant."; }],
    [/Unexpected number/, function(){ return "Nombre inattendu : il manque peut-être un opérateur (+, -, *…) ou une virgule."; }],
    [/Unexpected token '(.+)'/, function(m){ return "Signe inattendu « " + m[1] + " » : vérifie la ponctuation juste avant (parenthèses, accolades, virgules)."; }],
    [/Maximum call stack size exceeded/, function(){ return "Une fonction s’appelle elle-même sans fin."; }],
    [/Invalid left-hand side in assignment/, function(){ return "Affectation impossible : pour comparer, écris === et pas =."; }]
  ];

  function expliquer(err){
    const m = String(err.message).replace(/^Uncaught\s+/, "").replace(/^\w*Error:\s*/, "");
    for(const [motif, texte] of TRADUCTIONS){
      const r = m.match(motif);
      if(r) return texte(r);
    }
    return m;
  }

  // Le code sans ses commentaires (les chaînes sont gardées), pour les vérifications.
  function sansCommentaires(code){
    let out = "", k = 0;
    const n = code.length;
    while(k < n){
      const c = code[k];
      if(c === '"' || c === "'" || c === "`"){
        out += c; k++;
        while(k < n && code[k] !== c){ if(code[k] === "\\") out += code[k++]; if(k < n) out += code[k++]; }
        if(k < n) out += code[k++];
      } else if(code.startsWith("//", k)){ while(k < n && code[k] !== "\n") k++; }
      else if(code.startsWith("/*", k)){ const f = code.indexOf("*/", k + 2); k = f < 0 ? n : f + 2; }
      else { out += c; k++; }
    }
    return out;
  }

  return { monter:monter, executer:executer, expliquer:expliquer, sansCommentaires:sansCommentaires, proteger:proteger };
})();
