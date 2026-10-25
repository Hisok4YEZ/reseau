"""
Prépare un nouveau CM pour le site : copie le PDF et crée les images des diapos.

Installation (une seule fois) :   pip install pymupdf pillow
Utilisation (depuis le dossier du site) :
    python outils/diapos.py CHEMIN/VERS/CM3.pdf cm3

Résultat :
    pdf/CM3.pdf                 (le PDF)
    slides/cm3/1.webp, 2.webp…  (diapos en grand, pour la visionneuse)
    slides/cm3/t/1.webp…        (miniatures)
Il affiche ensuite la ligne à coller dans data/cms.js.
"""
import sys, os, shutil
try:
    import pymupdf as fitz  # PyMuPDF récent
except ImportError:
    import fitz  # anciennes versions de PyMuPDF
from PIL import Image

if len(sys.argv) != 3:
    print(__doc__); sys.exit(1)

src, cid = sys.argv[1], sys.argv[2].lower()
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(root, "pdf"), exist_ok=True)
big = os.path.join(root, "slides", cid)
small = os.path.join(big, "t")
os.makedirs(small, exist_ok=True)

pdf_name = cid.upper() + ".pdf"
shutil.copyfile(src, os.path.join(root, "pdf", pdf_name))

doc = fitz.open(src)
for i, page in enumerate(doc, start=1):
    zoom = 1170 / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    im.save(os.path.join(big, f"{i}.webp"), "WEBP", quality=72, method=6)
    im.resize((360, int(im.height * 360 / im.width)), Image.LANCZOS).save(os.path.join(small, f"{i}.webp"), "WEBP", quality=60, method=6)
    print(f"\r{i}/{len(doc)} diapos", end="")
print()
print("\nAjoute cette ligne dans COURS.docs (data/cms.js), en remplaçant ??? par le numéro imprimé sur la 1re diapo :")
print(f'  {{ id: "{cid}", type: "CM", titre: "{cid.upper()} — ...", fichier: "pdf/{pdf_name}", premiere: ???, nb: {len(doc)}, slides: "slides/{cid}" }},')
