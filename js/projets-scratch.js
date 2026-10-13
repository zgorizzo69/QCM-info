/* Projets de fin du cours Scratch : un fichier .sb3 de départ, à ouvrir dans Scratch.

   Un projet : { id, emoji, titre, accroche, description, missions:[…], defis:[{ n, texte }], idees:[…],
                 coupsDePouce:[{ titre, blocs }],                // blocs : texte de ScratchJeux.blocs
                 sb3:{ variables:["score"], fonds:["verger"], scene:[script],
                       lutins:[{ nom, costumes:["panier"], x, y, taille?, direction?, scripts:[script] }] } }.
   Un script est une liste de blocs, le premier étant un chapeau :
     ["drapeau"], ["touche", "espace"], ["clic"],
     ["allerA", x, y], ["orienter", 90], ["dire", "texte", secondes], ["attendre", secondes],
     ["mettre", "score", 0], ["montrer"], ["cacher"], ["taille", 50], ["fond", "verger"].
   Un fichier .sb3 est un .zip qui contient project.json et les images (nommées par leur empreinte MD5).
   ProjetScratch.sb3(projet) → Blob ; ProjetScratch.fichiers(projet, module) → [{ nom, blob | contenu }]. */
const ProjetScratch = (function(){

  /* ---------- MD5 (Scratch nomme chaque image par l’empreinte MD5 de son contenu) ---------- */
  const K = [], S = [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21];
  for(let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;

  function md5(octets){
    const n = octets.length, taille = ((n + 8) >>> 6 << 6) + 64;
    const m = new Uint8Array(taille);
    m.set(octets); m[n] = 0x80;
    const dv = new DataView(m.buffer);
    dv.setUint32(taille - 8, (n * 8) >>> 0, true);
    dv.setUint32(taille - 4, Math.floor(n / 536870912), true);
    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    for(let o = 0; o < taille; o += 64){
      let A = a0, B = b0, C = c0, D = d0;
      for(let i = 0; i < 64; i++){
        let F, g;
        if(i < 16){ F = (B & C) | (~B & D); g = i; }
        else if(i < 32){ F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if(i < 48){ F = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * i) % 16; }
        F = (F + A + K[i] + dv.getUint32(o + g * 4, true)) >>> 0;
        A = D; D = C; C = B;
        const s = S[(i >> 4) * 4 + (i % 4)];
        B = (B + ((F << s) | (F >>> (32 - s)))) >>> 0;
      }
      a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
    }
    return [a0, b0, c0, d0].map(function(v){
      let h = "";
      for(let k = 0; k < 4; k++) h += ((v >>> (8 * k)) & 0xff).toString(16).padStart(2, "0");
      return h;
    }).join("");
  }

  /* ---------- les images des projets (costumes et arrière-plans) ---------- */
  function svg(l, h, corps){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + l + '" height="' + h + '" viewBox="0 0 ' + l + ' ' + h + '">' + corps + '</svg>';
  }
  function chat(k){
    return ScratchJeux.chatSvg(k).replace(' aria-hidden="true"', '').replace("<svg ", '<svg width="76" height="83" ');
  }
  const MUR = "#1F3A93";   // la couleur des murs du labyrinthe

  const IMAGES = {
    chat:     { nom:"chat-a", svg:function(){ return chat(0); }, l:76, h:83 },
    chat2:    { nom:"chat-b", svg:function(){ return chat(1); }, l:76, h:83 },
    panier:   { nom:"panier", l:110, h:64, svg:function(){ return svg(110, 64,
      '<path d="M6 16 h98 l-12 40 q-2 6 -8 6 h-58 q-6 0 -8 -6 z" fill="#B5713A" stroke="#7A4520" stroke-width="3"/>' +
      '<path d="M15 31 h80 M19 45 h72" stroke="#7A4520" stroke-width="3"/>' +
      '<rect x="2" y="8" width="106" height="12" rx="6" fill="#C98A4B" stroke="#7A4520" stroke-width="3"/>'); } },
    pomme:    { nom:"pomme", l:44, h:48, svg:function(){ return svg(44, 48,
      '<path d="M22 15 c-8 -6 -20 -4 -20 12 c0 14 10 21 20 19 c10 2 20 -5 20 -19 c0 -16 -12 -18 -20 -12 z" fill="#E53935" stroke="#9E1F1C" stroke-width="2.5"/>' +
      '<path d="M22 15 q2 -8 6 -12" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M25 8 q8 -8 14 -2 q-6 6 -14 2 z" fill="#43A047"/>' +
      '<ellipse cx="13" cy="24" rx="4" ry="6" fill="#fff" opacity=".45"/>'); } },
    verger:   { nom:"verger", l:480, h:360, svg:function(){ return svg(480, 360,
      '<rect width="480" height="360" fill="#BFE3F7"/>' +
      '<circle cx="410" cy="62" r="34" fill="#FFD54A"/>' +
      '<g fill="#fff"><ellipse cx="90" cy="60" rx="46" ry="18"/><ellipse cx="120" cy="48" rx="30" ry="18"/><ellipse cx="270" cy="90" rx="40" ry="14"/></g>' +
      '<path d="M0 270 Q120 220 240 260 T480 250 V360 H0 Z" fill="#8BC97A"/>' +
      '<path d="M0 300 Q160 270 300 300 T480 296 V360 H0 Z" fill="#6DB35B"/>' +
      '<g fill="#7A4A26"><rect x="52" y="200" width="14" height="70"/><rect x="408" y="190" width="14" height="70"/></g>' +
      '<g fill="#3E8E41"><circle cx="59" cy="186" r="40"/><circle cx="415" cy="176" r="40"/></g>' +
      '<g fill="#E53935"><circle cx="44" cy="180" r="6"/><circle cx="72" cy="196" r="6"/><circle cx="402" cy="170" r="6"/><circle cx="430" cy="186" r="6"/></g>'); } },
    souris:   { nom:"souris", l:40, h:28, svg:function(){ return svg(40, 28,
      '<path d="M4 14 q-4 8 -2 12" stroke="#8D8D8D" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="18" cy="14" rx="13" ry="9" fill="#B0B0B0" stroke="#6E6E6E" stroke-width="2"/>' +
      '<circle cx="24" cy="6" r="5" fill="#F4B6C2" stroke="#6E6E6E" stroke-width="2"/><circle cx="24" cy="22" r="5" fill="#F4B6C2" stroke="#6E6E6E" stroke-width="2"/>' +
      '<path d="M28 9 L38 14 L28 19 Z" fill="#B0B0B0" stroke="#6E6E6E" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="38" cy="14" r="2" fill="#17212B"/><circle cx="29" cy="12" r="1.6" fill="#17212B"/><circle cx="29" cy="16" r="1.6" fill="#17212B"/>'); } },
    fromage:  { nom:"fromage", l:44, h:36, svg:function(){ return svg(44, 36,
      '<path d="M3 30 L41 30 L41 14 L3 6 Z" fill="#FFCA28" stroke="#C79100" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M3 6 L41 14 L41 10 Z" fill="#FFE082" stroke="#C79100" stroke-width="2" stroke-linejoin="round"/>' +
      '<g fill="#E0A800"><circle cx="14" cy="20" r="4"/><circle cx="28" cy="24" r="3"/><circle cx="33" cy="17" r="2.5"/></g>'); } },
    labyrinthe:{ nom:"labyrinthe", l:480, h:360, svg:function(){ return svg(480, 360,
      '<rect width="480" height="360" fill="#FFF8E7"/>' +
      '<rect x="4" y="4" width="52" height="52" fill="#DFF5E1"/><rect x="424" y="304" width="52" height="52" fill="#FFF0B3"/>' +
      '<g fill="none" stroke="' + MUR + '" stroke-width="8" stroke-linecap="square">' +
      '<rect x="4" y="4" width="472" height="352"/>' +
      '<path d="M60 0V60M60 60H120M120 60H180M180 60H240M240 60H300M420 0V60M0 120H60M60 120H120M120 120H180M180 120H240M240 120H300M360 60V120M300 120H360M360 120H420M60 180H120M120 180H180M180 180H240M300 120V180M360 180H420M420 180H480M0 240H60M120 180V240M180 240H240M300 180V240M240 240H300M300 240H360M420 180V240M120 240V300M60 300H120M120 300H180M240 240V300M360 240V300M360 300H420M180 300V360M300 300V360"/>' +
      '</g>'); } },
    robot:    { nom:"robot-a", l:70, h:96, svg:function(){ return robot("#E53935"); } },
    robot2:   { nom:"robot-b", l:70, h:96, svg:function(){ return robot("#43A047"); } },
    parc:     { nom:"le parc", l:480, h:360, svg:function(){ return svg(480, 360,
      '<rect width="480" height="360" fill="#CDE7F7"/><circle cx="80" cy="70" r="30" fill="#FFD54A"/>' +
      '<rect y="250" width="480" height="110" fill="#8BC97A"/>' +
      '<path d="M0 250 Q240 220 480 250" fill="#9ED389"/>' +
      '<rect x="360" y="170" width="16" height="90" fill="#7A4A26"/><circle cx="368" cy="150" r="48" fill="#3E8E41"/>' +
      '<g fill="#F48FB1"><circle cx="60" cy="290" r="6"/><circle cx="140" cy="310" r="6"/><circle cx="250" cy="296" r="6"/><circle cx="430" cy="320" r="6"/></g>'); } },
    espace:   { nom:"l’espace", l:480, h:360, svg:function(){
      let etoiles = "";
      for(let k = 0; k < 40; k++) etoiles += '<circle cx="' + ((k * 97) % 480) + '" cy="' + ((k * 61) % 250) + '" r="' + (k % 3 ? 1.5 : 2.5) + '"/>';
      return svg(480, 360,
        '<rect width="480" height="360" fill="#141A3C"/><g fill="#fff">' + etoiles + '</g>' +
        '<circle cx="380" cy="80" r="40" fill="#F6A04D"/><ellipse cx="380" cy="80" rx="62" ry="12" fill="none" stroke="#FFD9A8" stroke-width="5"/>' +
        '<path d="M0 290 Q240 250 480 290 V360 H0 Z" fill="#8E8EA8"/>' +
        '<g fill="#74748C"><ellipse cx="90" cy="320" rx="26" ry="8"/><ellipse cx="300" cy="306" rx="18" ry="6"/></g>'); } }
  };

  function robot(lampe){
    return svg(70, 96,
      '<path d="M35 14 V4" stroke="#546E7A" stroke-width="3"/><circle cx="35" cy="5" r="5" fill="' + lampe + '"/>' +
      '<rect x="10" y="14" width="50" height="36" rx="10" fill="#90A4AE" stroke="#546E7A" stroke-width="3"/>' +
      '<circle cx="25" cy="31" r="7" fill="#fff"/><circle cx="45" cy="31" r="7" fill="#fff"/>' +
      '<circle cx="25" cy="31" r="3.5" fill="#17212B"/><circle cx="45" cy="31" r="3.5" fill="#17212B"/>' +
      '<rect x="24" y="41" width="22" height="4" rx="2" fill="#546E7A"/>' +
      '<rect x="14" y="54" width="42" height="30" rx="6" fill="#B0BEC5" stroke="#546E7A" stroke-width="3"/>' +
      '<circle cx="35" cy="69" r="6" fill="' + lampe + '"/>' +
      '<path d="M14 60 L4 74 M56 60 L66 74" stroke="#546E7A" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M24 84 V94 M46 84 V94" stroke="#546E7A" stroke-width="6" stroke-linecap="round"/>');
  }

  /* ---------- les blocs : project.json ---------- */
  const TOUCHES = { "espace":"space", "flèche droite":"right arrow", "flèche gauche":"left arrow",
                    "flèche haut":"up arrow", "flèche bas":"down arrow" };

  function nb(v){ return [1, [4, String(v)]]; }
  function txt(v){ return [1, [10, String(v)]]; }

  // Transforme un script en blocs Scratch (dans l’objet blocs), et renvoie l’id du premier bloc.
  function compiler(script, blocs, ids, variables, x, y){
    let precedent = null, premier = null;
    script.forEach(function(b, k){
      const id = ids();
      const bloc = { opcode:"", next:null, parent:precedent, inputs:{}, fields:{}, shadow:false, topLevel:k === 0 };
      if(k === 0){ bloc.x = x; bloc.y = y; premier = id; }
      const op = b[0];
      if(op === "drapeau") bloc.opcode = "event_whenflagclicked";
      else if(op === "clic") bloc.opcode = "event_whenthisspriteclicked";
      else if(op === "touche"){ bloc.opcode = "event_whenkeypressed"; bloc.fields.KEY_OPTION = [TOUCHES[b[1]] || b[1], null]; }
      else if(op === "allerA"){ bloc.opcode = "motion_gotoxy"; bloc.inputs.X = nb(b[1]); bloc.inputs.Y = nb(b[2]); }
      else if(op === "orienter"){ bloc.opcode = "motion_pointindirection"; bloc.inputs.DIRECTION = [1, [8, String(b[1])]]; }
      else if(op === "dire"){ bloc.opcode = "looks_sayforsecs"; bloc.inputs.MESSAGE = txt(b[1]); bloc.inputs.SECS = nb(b[2]); }
      else if(op === "attendre"){ bloc.opcode = "control_wait"; bloc.inputs.DURATION = [1, [5, String(b[1])]]; }
      else if(op === "mettre"){ bloc.opcode = "data_setvariableto"; bloc.inputs.VALUE = txt(b[2]); bloc.fields.VARIABLE = [b[1], variables[b[1]]]; }
      else if(op === "montrer") bloc.opcode = "looks_show";
      else if(op === "cacher") bloc.opcode = "looks_hide";
      else if(op === "taille"){ bloc.opcode = "looks_setsizeto"; bloc.inputs.SIZE = nb(b[1]); }
      else if(op === "fond"){
        const menu = ids();
        bloc.opcode = "looks_switchbackdropto";
        bloc.inputs.BACKDROP = [1, menu];
        blocs[menu] = { opcode:"looks_backdrops", next:null, parent:id, inputs:{}, fields:{ BACKDROP:[IMAGES[b[1]].nom, null] }, shadow:true, topLevel:false };
      }
      else throw new Error("Bloc inconnu dans un projet Scratch : " + op);
      if(precedent) blocs[precedent].next = id;
      blocs[id] = bloc;
      precedent = id;
    });
    return premier;
  }

  function costume(cle, scene){
    const im = IMAGES[cle];
    const contenu = im.svg(), empreinte = md5(new TextEncoder().encode(contenu));
    return {
      json:{ name:im.nom, bitmapResolution:1, dataFormat:"svg", assetId:empreinte, md5ext:empreinte + ".svg",
             rotationCenterX:scene ? 240 : im.l / 2, rotationCenterY:scene ? 180 : im.h / 2 },
      fichier:{ nom:empreinte + ".svg", contenu:contenu }
    };
  }

  function projectJson(def){
    let n = 0;
    const ids = function(){ n++; return "bloc" + n; };
    const variables = {}, fichiers = {};
    (def.variables || []).forEach(function(v, k){ variables[v] = "variable" + (k + 1); });
    function costumes(liste, scene){
      return liste.map(function(cle){
        const c = costume(cle, scene);
        fichiers[c.fichier.nom] = c.fichier;
        return c.json;
      });
    }
    function scripts(liste){
      const blocs = {};
      (liste || []).forEach(function(s, k){ compiler(s, blocs, ids, variables, 40, 40 + k * 220); });
      return blocs;
    }
    const scene = {
      isStage:true, name:"Stage",
      variables:Object.keys(variables).reduce(function(o, v){ o[variables[v]] = [v, 0]; return o; }, {}),
      lists:{}, broadcasts:{}, blocks:scripts(def.scene), comments:{},
      currentCostume:0, costumes:costumes(def.fonds, true), sounds:[], volume:100, layerOrder:0,
      tempo:60, videoTransparency:50, videoState:"on", textToSpeechLanguage:null
    };
    const lutins = def.lutins.map(function(l, k){
      return {
        isStage:false, name:l.nom, variables:{}, lists:{}, broadcasts:{}, blocks:scripts(l.scripts), comments:{},
        currentCostume:0, costumes:costumes(l.costumes, false), sounds:[], volume:100, layerOrder:k + 1,
        visible:true, x:l.x || 0, y:l.y || 0, size:l.taille || 100, direction:l.direction || 90,
        draggable:false, rotationStyle:l.rotation || "all around"
      };
    });
    const moniteurs = Object.keys(variables).map(function(v, k){
      return { id:variables[v], mode:"default", opcode:"data_variable", params:{ VARIABLE:v }, spriteName:null,
               value:0, width:0, height:0, x:5, y:5 + k * 27, visible:true, sliderMin:0, sliderMax:100, isDiscrete:true };
    });
    return {
      json:{ targets:[scene].concat(lutins), monitors:moniteurs, extensions:[],
             meta:{ semver:"3.0.0", vm:"0.2.0", agent:"QCM informatique" } },
      fichiers:Object.keys(fichiers).map(function(k){ return fichiers[k]; })
    };
  }

  function sb3(p){
    const pj = projectJson(p.sb3);
    return Zip.creer([{ nom:"project.json", contenu:JSON.stringify(pj.json) }].concat(pj.fichiers));
  }

  /* ---------- les scripts de départ en texte (pour la page et le README) ---------- */
  const NOMS_TOUCHES = { "espace":"espace", "flèche droite":"flèche droite", "flèche gauche":"flèche gauche", "flèche haut":"flèche haut", "flèche bas":"flèche bas" };
  function ligne(b){
    switch(b[0]){
      case "drapeau": return "evenement: quand 🏁 est cliqué";
      case "clic": return "evenement: quand ce sprite est cliqué";
      case "touche": return "evenement: quand la touche [" + (NOMS_TOUCHES[b[1]] || b[1]) + " v] est pressée";
      case "allerA": return "mouvement: aller à x: (" + b[1] + ") y: (" + b[2] + ")";
      case "orienter": return "mouvement: s’orienter à (" + b[1] + ")";
      case "dire": return "apparence: dire [" + b[1] + "] pendant (" + b[2] + ") secondes";
      case "attendre": return "controle: attendre (" + b[1] + ") secondes";
      case "mettre": return "variable: mettre [" + b[1] + " v] à (" + b[2] + ")";
      case "montrer": return "apparence: montrer";
      case "cacher": return "apparence: cacher";
      case "taille": return "apparence: mettre la taille à (" + b[1] + ") % de la taille initiale";
      case "fond": return "apparence: basculer sur l’arrière-plan [" + IMAGES[b[1]].nom + " v]";
    }
    return b[0];
  }
  function scriptTexte(script){ return script.map(ligne).join("\n"); }

  // Les scripts de départ de chaque lutin : [{ nom, blocs }].
  function depart(p){
    const d = p.sb3, liste = [];
    if(d.scene && d.scene.length) liste.push({ nom:"Scène", blocs:d.scene.map(scriptTexte).join("\n\n") });
    d.lutins.forEach(function(l){
      liste.push({ nom:l.nom, blocs:(l.scripts || []).map(scriptTexte).join("\n\n") });
    });
    return liste;
  }

  // Le texte des blocs, sans les noms de catégories, pour le README.
  function sansCategories(t){
    return t.split("\n").map(function(l){
      return l.replace(/^(\s*)[a-z]+:\s?/, "$1").replace(/\{[a-z]+:/g, "{");
    }).join("\n");
  }

  const DEMARRER = [
    "Télécharge le fichier `.sb3` du projet : c’est un projet Scratch de départ, avec les sprites et les décors déjà dessinés.",
    "Va sur **scratch.mit.edu** et clique sur **Créer** (ou ouvre l’application **Scratch** si elle est installée sur l’ordinateur).",
    "Dans le menu **Fichier**, choisis **Charger depuis votre ordinateur**, puis choisis le fichier `.sb3` téléchargé.",
    "Clique sur un sprite, en bas à droite, pour voir ses scripts. Les premiers blocs sont déjà là : à toi d’ajouter les autres !",
    "Clique souvent sur le **drapeau vert** 🏁 pour tester. Le panneau rouge ⏹ arrête tout.",
    "Pour garder ton travail : **Fichier → Sauvegarder sur votre ordinateur**. (Avec un compte Scratch, tu peux aussi l’enregistrer en ligne et le partager.)"
  ];

  function readme(p, module){
    const sprites = p.sb3.lutins.map(function(l){ return l.nom; });
    return [
      "# " + p.emoji + " " + p.titre,
      "",
      "> " + p.accroche,
      "",
      "Projet de fin du cours : **" + module.titre + "**.",
      "",
      "## 🎯 Ton objectif",
      "",
      p.description,
      "",
      "## 🚀 Pour commencer, avec Scratch",
      "",
      DEMARRER.map(function(t, k){ return (k + 1) + ". " + t; }).join("\n"),
      "",
      "## 🐱 Dans le projet de départ",
      "",
      "- Les sprites : " + sprites.join(", ") + ".",
      "- Les arrière-plans : " + p.sb3.fonds.map(function(f){ return IMAGES[f].nom; }).join(", ") + ".",
      (p.sb3.variables && p.sb3.variables.length ? "- Les variables : " + p.sb3.variables.join(", ") + ".\n" : "") +
      "",
      "Les scripts déjà écrits :",
      "",
      depart(p).map(function(d){
        return "**" + d.nom + "**\n\n```\n" + (d.blocs ? sansCategories(d.blocs) : "(aucun script : à toi de jouer !)") + "\n```";
      }).join("\n\n"),
      "",
      "## ✅ Les missions, dans l’ordre",
      "",
      p.missions.map(function(t, k){ return (k + 1) + ". " + t; }).join("\n"),
      "",
      "## 💡 Coups de pouce",
      "",
      (p.coupsDePouce || []).map(function(c){ return "**" + c.titre + "**\n\n```\n" + sansCategories(c.blocs) + "\n```"; }).join("\n\n"),
      "",
      "## 🏆 Les défis",
      "",
      "Quand les missions marchent, relève les défis : du plus facile ⭐ au plus difficile ⭐⭐⭐.",
      "",
      p.defis.map(function(d){ return "- " + ProjetJs.ETOILES[d.n] + " " + d.texte; }).join("\n"),
      "",
      "## 🎨 Idées pour le rendre unique",
      "",
      p.idees.map(function(t){ return "- " + t; }).join("\n"),
      "",
      "## 🔧 Si ça ne marche pas",
      "",
      "- Le script commence-t-il bien par un bloc chapeau (« quand 🏁 est cliqué », « quand la touche… ») ? Sans lui, il ne démarre jamais.",
      "- Le script est-il dans le **bon sprite** ? Chaque sprite a ses propres scripts : clique sur le sprite pour les voir.",
      "- Les blocs sont-ils bien **emboîtés** ? Un bloc détaché, même tout près, ne fait rien.",
      "- Pour qu’un test (« si … alors ») marche tout le temps, il doit être dans un « répéter indéfiniment ».",
      "- Clique sur un bloc ou un script pour le lancer tout seul et voir ce qu’il fait.",
      ""
    ].join("\n");
  }

  function fichiers(p, module){
    return [
      { nom:p.id + ".sb3", blob:sb3(p) },
      { nom:"README.md", contenu:readme(p, module) }
    ];
  }

  return { sb3:sb3, projectJson:projectJson, fichiers:fichiers, readme:readme, depart:depart,
           md5:md5, DEMARRER:DEMARRER, MUR:MUR, IMAGES:IMAGES };
})();
