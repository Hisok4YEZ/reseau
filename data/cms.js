/* =====================================================================
   Mif05 Réseaux — liste des documents (CM, TD…) + infos de l'UE
   ---------------------------------------------------------------------
   Pour ajouter un CM :
   1. mets le PDF dans  pdf/        (ex : pdf/CM3.pdf)
   2. mets les images des diapos dans slides/cm3/  (1.webp, 2.webp…)
   3. ajoute une ligne dans COURS.docs ci-dessous
   4. ajoute le fichier du chapitre dans data/ + une ligne <script> dans index.html
   ===================================================================== */

var COURS = {
  ue: "Mif05 — Réseaux",
  sousTitre: "M1 Informatique · Lyon 1 · I. Guérin Lassous",
  docs: [],
  chapitres: []
};

/* type : "CM" ou "TD"
   premiere : numéro imprimé sur la 1re diapo du PDF (la numérotation continue d'un CM à l'autre)
   nb : nombre de pages du PDF
   slides : dossier des images (null si pas d'images) */
COURS.docs.push(
  { id: "cm1", type: "CM", titre: "CM1 — Introduction, Application, Transport", fichier: "pdf/CM1.pdf", premiere: 1,  nb: 65, slides: "slides/cm1" },
  { id: "cm2", type: "CM", titre: "CM2 — Transport (suite) & Réseau",            fichier: "pdf/CM2.pdf", premiere: 66, nb: 60, slides: "slides/cm2" }
);

/* Infos pratiques affichées sur la page d'accueil (tirées des diapos 3 à 7 du CM1) */
COURS.infos = {
  evaluation: [
    "Contrôle continu intégral, 3 ECTS",
    "Épreuve commune anonyme (ECA) : 60 min, 40 % (+ 2nde chance)",
    "2 contrôles QCM en TD : 28 % chacun — sur les CM et le projet en autonomie",
    "Note de TP : 4 %"
  ],
  bareme: [
    "1 seule réponse juste par question",
    "Juste : +1 · Faux : 0, −0,5 ou −1 (selon le contrôle) · Pas de réponse : 0",
    "Noircir les cases entièrement au stylo noir"
  ],
  planning: [
    ["07/09", "CM1", "Introduction, Application, Transport"],
    ["14/09", "CM2", "Transport (suite) & Réseau"],
    ["05/10", "CM3", "Liaison de données"],
    ["05/10", "TD1", ""],
    ["12/10", "CM4", "Couche physique"],
    ["02/11", "TD2", ""],
    ["09/11", "CM5", "Couche physique"],
    ["09/11", "TD3", ""],
    ["23/11 · 30/11", "TP1", ""],
    ["07/12", "TD4", ""],
    ["04/01 · 11/01", "TP2", ""],
    ["18/01", "Examen", ""]
  ]
};
