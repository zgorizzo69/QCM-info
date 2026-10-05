/* Outils pour écrire les vérifications des exercices de code.
   Chaque vérification reçoit test(doc, code) : doc est la page rendue dans l’aperçu
   (structure, styles calculés, feuilles de style), code le texte tapé par l’élève. */
const V = {
  el: function(doc, sel){ return doc.querySelector(sel); },
  tous: function(doc, sel){ return Array.prototype.slice.call(doc.querySelectorAll(sel)); },

  // Texte d’un élément, espaces normalisés ("" s’il n’existe pas).
  texte: function(doc, sel){
    const e = typeof sel === "string" ? doc.querySelector(sel) : sel;
    return e ? e.textContent.replace(/\s+/g, " ").trim() : "";
  },

  attr: function(doc, sel, nom){
    const e = doc.querySelector(sel);
    return e ? (e.getAttribute(nom) || "").trim() : "";
  },

  // a apparaît avant b dans la page.
  avant: function(a, b){
    return !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
  },

  // Valeur calculée d’une propriété CSS ("" si l’élément n’existe pas).
  style: function(el, prop){
    return el ? el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue(prop).trim() : "";
  },

  // [r, g, b, a] d’une couleur calculée, ou null.
  rgb: function(c){
    const m = /rgba?\(([^)]+)\)/.exec(c || "");
    if(!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  },

  // La couleur a été choisie : ni transparente, ni égale aux couleurs par défaut données.
  couleurChoisie: function(el, prop){
    const c = V.rgb(V.style(el, prop));
    if(!c || c[3] === 0) return false;
    const defauts = Array.prototype.slice.call(arguments, 2);
    return !defauts.some(function(d){ return d[0] === c[0] && d[1] === c[1] && d[2] === c[2]; });
  },

  // Toutes les règles de style de la page, y compris celles placées dans un @media.
  regles: function(doc){
    const out = [];
    function parcourir(liste){
      Array.prototype.forEach.call(liste, function(r){
        out.push(r);
        if(r.cssRules) parcourir(r.cssRules);
      });
    }
    Array.prototype.forEach.call(doc.styleSheets, function(f){
      try{ parcourir(f.cssRules); }catch(e){ /* feuille externe illisible */ }
    });
    return out;
  },

  // Règles dont le sélecteur correspond à l’expression donnée.
  selecteur: function(doc, re){
    return V.regles(doc).filter(function(r){ return r.selectorText && re.test(r.selectorText); });
  },

  // La propriété est écrite quelque part : dans une feuille de style ou un attribut style.
  utilise: function(doc, prop){
    const dansRegles = V.regles(doc).some(function(r){ return r.style && r.style.getPropertyValue(prop); });
    return dansRegles || V.tous(doc, "[style]").some(function(e){ return e.style.getPropertyValue(prop); });
  },

  // Propriétés CSS différentes écrites par l’élève (dans <style> et les attributs style),
  // telles qu’il les a tapées : « border » compte pour une, et non pour ses douze sous-propriétés.
  proprietes: function(doc){
    const vues = new Set();
    function lire(txt){
      txt.replace(/([a-z-]+)\s*:/gi, function(_, p){
        p = p.toLowerCase();
        if(CSS.supports(p, "initial")) vues.add(p);
      });
    }
    V.tous(doc, "style").forEach(function(st){
      (st.textContent.match(/\{[^{}]*\}/g) || []).forEach(lire);
    });
    V.tous(doc, "[style]").forEach(function(e){ lire(e.getAttribute("style")); });
    return vues;
  },

  media: function(doc){
    return V.regles(doc).filter(function(r){ return r.type === CSSRule.MEDIA_RULE; });
  },

  animations: function(doc){
    return V.regles(doc).filter(function(r){ return r.type === CSSRule.KEYFRAMES_RULE; });
  }
};
