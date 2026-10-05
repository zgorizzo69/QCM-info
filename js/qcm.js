/* Registre des QCM.
   Chaque fichier de qcm/ appelle QCM.ajouter({...}) ; il suffit ensuite de l’ajouter
   à la liste des <script> dans index.html pour qu’il apparaisse dans l’application.

   Une étape (élément de « questions ») est de l’un de ces types :
     - "choix" (par défaut) : question à choix multiple { q, r, b, e } ;
     - "lecon" : explication non notée { titre, contenu:[texte | {code}], exemple? } ;
     - "code"  : exercice de HTML en direct { q, depart, solution, verifs:[{msg, test(doc, code)}], e }. */
const QCM = (function(){
  const liste = [];

  function erreur(id, msg){
    console.error("QCM « " + id + " » ignoré : " + msg);
    return false;
  }

  function valide(def){
    const id = def && def.id;
    if(!id || typeof id !== "string") return erreur("?", "il faut un id (texte).");
    if(liste.some(function(q){return q.id === id;})) return erreur(id, "cet id est déjà utilisé.");
    if(!def.titre) return erreur(id, "il faut un titre.");
    if(!Array.isArray(def.themes) || !def.themes.length) return erreur(id, "il faut au moins un thème.");
    if(!Array.isArray(def.questions) || !def.questions.length) return erreur(id, "il faut au moins une question.");

    const themes = new Set(def.themes.map(function(t){return t.id;}));
    const ids = new Set();
    for(const q of def.questions){
      if(!q.id) return erreur(id, "une question n’a pas d’id : « " + q.q + " ».");
      if(ids.has(q.id)) return erreur(id, "l’id de question « " + q.id + " » est en double.");
      ids.add(q.id);
      if(!themes.has(q.t)) return erreur(id, "la question « " + q.id + " » a un thème inconnu : " + q.t + ".");
      const type = q.type || "choix";
      if(type === "lecon"){
        if(!q.titre || !Array.isArray(q.contenu)) return erreur(id, "la leçon « " + q.id + " » doit avoir un titre et un contenu.");
        continue;
      }
      if(type === "code"){
        if(!q.q || typeof q.depart !== "string" || typeof q.solution !== "string")
          return erreur(id, "l’exercice « " + q.id + " » doit avoir une consigne (q), un code de départ et une solution.");
        if(!Array.isArray(q.verifs) || !q.verifs.length ||
           q.verifs.some(function(v){return !v.msg || typeof v.test !== "function";}))
          return erreur(id, "l’exercice « " + q.id + " » doit avoir des vérifications { msg, test }.");
        continue;
      }
      if(type !== "choix") return erreur(id, "la question « " + q.id + " » a un type inconnu : " + type + ".");
      if(!Array.isArray(q.r) || q.r.length < 2 || q.r.length > 6)
        return erreur(id, "la question « " + q.id + " » doit avoir entre 2 et 6 réponses.");
      if(!(q.b >= 0 && q.b < q.r.length))
        return erreur(id, "la question « " + q.id + " » a une bonne réponse (b) hors limites.");
    }
    return true;
  }

  return {
    ajouter: function(def){
      if(!valide(def)) return;
      def.intro = def.intro || [];
      def.bilans = (def.bilans || []).slice().sort(function(a,b){return b.min - a.min;});
      def.question = function(qid){
        return def.questions.find(function(q){return q.id === qid;});
      };
      def.avecLecons = def.questions.some(function(q){return q.type === "lecon" || q.type === "code";});
      liste.push(def);
    },
    tous: function(){ return liste.slice(); },
    trouver: function(id){ return liste.find(function(q){return q.id === id;}); }
  };
})();
