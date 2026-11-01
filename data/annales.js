/* =====================================================================
   Annales des QCM — ordre d'origine des questions de chaque contrôle.
   Les questions elles-mêmes sont rangées dans les chapitres (data/ch*.js),
   dans la section où se trouve la réponse : elles ont un champ  annale: "Tag".
   Ici on liste juste les tags, dans l'ordre du sujet, pour pouvoir rejouer
   l'annale « en conditions réelles ».
   ===================================================================== */

COURS.annales = [
  {
    id: "qcm1-2023",
    titre: "QCM n°1 · 2023–2024",
    court: "2023–24",
    fichier: "pdf/annales/Corrige-QCM1-2023-2024.pdf",
    bareme: { juste: 2, faux: -0.5 },
    tags: ["Unite2", "Fragmentation1", "Delai5", "RC3", "Liens1", "Pileprotocolaire2", "Boutenbout2", "Paquet",
           "Delai2", "BBPP", "TT3", "TA", "HTTP2", "Cookies3", "DNS1", "Processus", "Multiplexage1", "UDP2",
           "Socket3", "SocketDNS", "UDP1", "CS1", "CS3"]
  },
  {
    id: "qcm1-2022",
    titre: "QCM n°1 · 2022–2023",
    court: "2022–23",
    fichier: "pdf/annales/Corrige-QCM1-2022-2023.pdf",
    bareme: { juste: 2, faux: -0.5 },
    /* « HTTP2 » : en 2022–23 la question s'appelait « HTTP » (même réponse, sans le mot « principalement ») */
    tags: ["Terminaux", "Fragmentation1", "Delai2", "Boutenbout1", "Entete", "Delai1", "Delai4", "Pileprotocolaire",
           "RTT1", "Paquet", "BBPP", "TT1", "TT2", "ClientServeur", "Cookies2", "HTTP2", "DNS2", "Multiplexage1",
           "Socket2", "Socket4", "Socket3", "CS1", "CS2"]
  }
];

/* les corrigés apparaissent aussi dans l'onglet « Diapos & PDF » */
COURS.docs.push(
  { id: "qcm1-2023", type: "Annale", titre: "Corrigé QCM n°1 · 2023–2024", fichier: "pdf/annales/Corrige-QCM1-2023-2024.pdf", nb: 4, slides: null },
  { id: "qcm1-2022", type: "Annale", titre: "Corrigé QCM n°1 · 2022–2023", fichier: "pdf/annales/Corrige-QCM1-2022-2023.pdf", nb: 4, slides: null }
);
