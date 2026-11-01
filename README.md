# Mif05 Réseaux — site de révision

Cours résumé, vidéos, diapos des CM et QCM (225 questions) pour l'UE Mif05.
Site 100 % statique : HTML + CSS + JS, aucune installation, fonctionne sur GitHub Pages.

## Mettre le site en ligne (GitHub Pages)

1. Sur github.com : **New repository** → nom au choix (ex. `mif05-reseaux`) → *Public* → **Create repository** (sans README).
2. Envoie les fichiers. ⚠️ Le site contient ~280 fichiers et l'upload par le navigateur est limité à 100 fichiers à la fois,
   donc utilise git dans un terminal, ouvert **dans ce dossier** (celui qui contient `index.html`) :
   ```bash
   git init
   git add .
   git commit -m "Site Mif05"
   git branch -M main
   git remote add origin https://github.com/TON-PSEUDO/mif05-reseaux.git
   git push -u origin main
   ```
   (Alternative sans terminal : l'appli **GitHub Desktop** → *Add local repository* → *Publish*.)
   `index.html` doit être à la racine du repo, pas dans un sous-dossier.
3. **Settings → Pages** → *Source* : **Deploy from a branch** → Branch : **main** / **(root)** → **Save**.
4. Attends 1–2 minutes : le site est sur `https://TON-PSEUDO.github.io/mif05-reseaux/`.

Pour mettre à jour plus tard : remplace les fichiers, puis `git add . && git commit -m "maj" && git push`.

Sur téléphone : ouvre le lien puis « Ajouter à l'écran d'accueil » → le site s'ouvre comme une appli
et marche même sans réseau une fois visité.

> Le fichier `.nojekyll` est caché sur Mac/Linux (il commence par un point). Il n'est pas obligatoire.

## Organisation des fichiers

| Fichier | Contenu |
|---|---|
| `data/cms.js` | La liste des PDF (CM, TD) + infos de l'UE |
| `data/ch1-introduction.js` … `ch4-reseau.js` | Un chapitre = le cours résumé (`sections`) + ses questions (`questions`) |
| `assets/app.js` | Le moteur du site (pas besoin d'y toucher) |
| `assets/style.css` | Le style |
| `pdf/` | Les CM en PDF |
| `slides/cm1/`, `slides/cm2/` | Une image par diapo (+ miniatures dans `t/`) |
| `outils/diapos.py` | Script pour préparer les images d'un nouveau CM |

## Ajouter / modifier une question

Dans le fichier du chapitre, chaque question ressemble à ça :

```js
{ s: "udp", d: 55, q: "Quelle est la taille de l'en-tête UDP ?",
  r: ["8 octets", "20 octets", "16 octets", "32 octets"],
  e: "UDP : 8 octets d'en-tête, contre 20 pour TCP." },
```

- `s` = l'identifiant de la section du cours où se trouve la réponse
- `d` = le numéro de la diapo (celui imprimé en bas de la diapo)
- `q` = la question, `e` = l'explication
- `r` = les réponses : **la première est toujours la bonne** (le site mélange l'ordre tout seul)

## Annales

- Les questions d'annales sont rangées dans les chapitres (`data/ch*.js`), dans la section où se trouve la réponse,
  avec un champ en plus : `annale: "Tag"` (l'étiquette de la question dans le corrigé, ex. `"Delai2"`).
  Une question peut avoir `d: null` si elle n'est pas dans les diapos, et `img: "annales/xxx.webp"` pour un schéma.
- `data/annales.js` liste les sujets : l'ordre des tags, le barème (+2 / −0,5) et le PDF du corrigé (`pdf/annales/`).
- Pour ajouter une annale : ajoute ses questions dans les chapitres avec leur `annale: "Tag"`,
  puis un bloc dans `COURS.annales` avec la liste des tags dans l'ordre du sujet.

## Ajouter un nouveau CM

Le plus simple : envoie le PDF à Claude, il te renvoie les fichiers à ajouter.
Sinon, à la main :

1. `pip install pymupdf pillow` (une seule fois)
2. Depuis le dossier du site : `python outils/diapos.py chemin/vers/CM3.pdf cm3`
3. Colle la ligne affichée dans `COURS.docs` (`data/cms.js`)
4. Crée `data/ch5-liaison.js` (même modèle que les autres chapitres)
   et ajoute `<script src="data/ch5-liaison.js"></script>` dans `index.html`

## Progression

Les réponses sont enregistrées dans le navigateur (localStorage) : rien n'est envoyé nulle part.
Changer de navigateur ou de téléphone = repartir de zéro.
