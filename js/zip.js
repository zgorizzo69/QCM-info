/* Fabrique un fichier .zip (sans compression) à partir de fichiers texte, directement dans le
   navigateur, pour télécharger les projets d’un coup. Zip.creer([{ nom, contenu }]) → Blob. */
const Zip = (function(){
  const TABLE = (function(){
    const t = new Uint32Array(256);
    for(let n = 0; n < 256; n++){
      let c = n;
      for(let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(octets){
    let c = 0xFFFFFFFF;
    for(let i = 0; i < octets.length; i++) c = TABLE[(c ^ octets[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function dateDos(d){
    return {
      heure: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
      jour: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
    };
  }

  function creer(fichiers){
    const enc = new TextEncoder();
    const quand = dateDos(new Date());
    const morceaux = [], central = [];
    let position = 0;
    fichiers.forEach(function(f){
      const nom = enc.encode(f.nom), data = enc.encode(f.contenu), crc = crc32(data);
      const l = new DataView(new ArrayBuffer(30));
      l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x0800, true);  // 0x0800 : noms en UTF-8
      l.setUint16(8, 0, true); l.setUint16(10, quand.heure, true); l.setUint16(12, quand.jour, true);
      l.setUint32(14, crc, true); l.setUint32(18, data.length, true); l.setUint32(22, data.length, true);
      l.setUint16(26, nom.length, true); l.setUint16(28, 0, true);
      morceaux.push(l, nom, data);

      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint16(10, 0, true); c.setUint16(12, quand.heure, true); c.setUint16(14, quand.jour, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, nom.length, true); c.setUint16(30, 0, true); c.setUint16(32, 0, true); c.setUint16(34, 0, true);
      c.setUint16(36, 0, true); c.setUint32(38, 0, true); c.setUint32(42, position, true);
      central.push(c, nom);
      position += 30 + nom.length + data.length;
    });
    const taille = central.reduce(function(a, m){ return a + m.byteLength; }, 0);
    const fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true); fin.setUint16(4, 0, true); fin.setUint16(6, 0, true);
    fin.setUint16(8, fichiers.length, true); fin.setUint16(10, fichiers.length, true);
    fin.setUint32(12, taille, true); fin.setUint32(16, position, true); fin.setUint16(20, 0, true);
    return new Blob(morceaux.concat(central, [fin]), { type:"application/zip" });
  }

  function telecharger(nomFichier, blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  }

  return { creer:creer, telecharger:telecharger };
})();
