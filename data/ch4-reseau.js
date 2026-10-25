/* =====================================================================
   Chapitre 4 — Couche Réseau  (CM2, diapos 92 à 125)
   ⚠️ La 1re réponse de r est TOUJOURS la bonne (le site mélange l'ordre).
   ===================================================================== */

COURS.chapitres.push({
  id: "reseau",
  num: 4,
  titre: "Couche Réseau",
  court: "Réseau",
  couleur: "#059669",
  source: "CM2 · diapos 92–125",
  resume: "IP, adresses et sous-réseaux, tables d'acheminement et plus long préfixe, Dijkstra et Bellman-Ford, AS, OSPF/RIP et BGP.",

  sections: [
    {
      id: "role",
      titre: "Rôle de la couche Réseau : adressage, acheminement, routage",
      diapos: [94, 95],
      recherche: "couche réseau forwarding routing différence",
      videos: [
        { t: "Cours N°2 réseaux 2 | La couche Internet (introduction)", u: "https://www.youtube.com/watch?v=dyU1b_NhtTA", l: "FR" },
        { t: "4.1 — Network Layer Introduction", u: "https://www.youtube.com/watch?v=stHJtWOGLFs", l: "EN" }
      ],
      html: `
<h4>Ce que fait la couche Réseau [d94]</h4>
<ul>
  <li>Elle permet l'<b>acheminement des segments de l'expéditeur jusqu'au destinataire</b>, à travers tout le réseau.</li>
  <li><b>Expéditeur</b> : encapsule les segments à émettre dans des <b>datagrammes</b>.</li>
  <li><b>Récepteur</b> : transmet les segments reçus à la couche Transport.</li>
  <li><b>Tous les terminaux ET tous les routeurs</b> implémentent la couche Réseau (contrairement à la couche Transport).</li>
  <li>Les routeurs <b>examinent les en-têtes</b> des datagrammes pour savoir où les envoyer.</li>
</ul>

<h4>Les 3 services essentiels [d95]</h4>
<table>
  <tr><th>Service</th><th>En clair</th></tr>
  <tr><td><b>Adressage</b></td><td>Donner à chaque nœud une adresse = un <b>identifiant topologique</b> : elle <b>dépend de la position dans le réseau</b>, elle est utile pour router, et (en principe) <b>unique</b>.</td></tr>
  <tr><td><b>Acheminement</b><br><small>« forwarding »</small></td><td>Dans UN routeur : <b>commuter un paquet d'une interface (entrée) à une autre (sortie)</b> en interrogeant la <b>table d'acheminement</b> (table de routage).</td></tr>
  <tr><td><b>Routage</b></td><td>À l'échelle du réseau : <b>déterminer le chemin de bout-en-bout</b> qu'un paquet va suivre de la source à la destination, grâce à un <b>algorithme de routage</b>.</td></tr>
</table>
<div class="analogie"><b>Analogie du voyage en voiture</b> : le <b>routage</b>, c'est préparer l'itinéraire Lyon → Marseille avec un GPS (tout le trajet). L'<b>acheminement</b>, c'est, à chaque échangeur, prendre la bonne sortie en lisant les panneaux (la table).</div>`
    },

    {
      id: "ipv4",
      titre: "Le datagramme IPv4",
      diapos: [97, 98],
      recherche: "en-tête IPv4 TTL protocol checksum explication",
      videos: [
        { t: "4.3 The Internet Protocol, part 1", u: "https://www.youtube.com/watch?v=sdIpLuIR1ZY", l: "EN" },
        { t: "Cours N°5 réseaux 2 | La couche Internet (introduction au routage)", u: "https://www.youtube.com/watch?v=K0ACoElhHMM", l: "FR" }
      ],
      html: `
<p>Un datagramme IPv4 a un <b>en-tête de 20 octets</b> (sans options), puis le <i>payload</i> (le segment TCP/UDP) [d97].</p>
<table class="entete">
  <tr><td colspan="4" class="center"><small>← 32 bits →</small></td></tr>
  <tr><td>Version</td><td>HLen</td><td>ToS</td><td>Total length</td></tr>
  <tr><td colspan="2">Identification</td><td>Flags</td><td>Frag. Offset</td></tr>
  <tr><td><b>TTL</b></td><td><b>Protocol</b></td><td colspan="2"><b>Checksum</b></td></tr>
  <tr><td colspan="4"><b>Source IP address</b> (32 bits)</td></tr>
  <tr><td colspan="4"><b>Destination IP address</b> (32 bits)</td></tr>
  <tr><td colspan="4" class="center">Options</td></tr>
  <tr><td colspan="4" class="center">Payload (données)</td></tr>
</table>

<h4>Les champs à connaître</h4>
<ul>
  <li><b>TTL — « Time To Live »</b> : valeur initiale fixée par l'émetteur, puis <b>décrémentée de 1 à chaque saut</b> (chaque lien traversé). Si <b>TTL = 0 → le paquet est supprimé</b>. Utilité : éviter qu'un paquet <b>tourne indéfiniment</b> dans le réseau (par exemple en cas de <b>boucle de routage</b>).</li>
  <li><b>Protocol</b> : identifie le protocole encapsulé dans IP → <b>6 = TCP</b>, <b>17 = UDP</b>. (C'est grâce à lui que le récepteur sait à quel protocole de transport donner le contenu.)</li>
  <li><b>Checksum</b> [d98] : détection des erreurs de transfert, calculée <b>sur l'en-tête IP seulement</b> (pas sur les données), en <b>complément à 1</b> de la somme de l'en-tête. En cas d'erreur, le paquet est <b>supprimé</b>.</li>
  <li><b>Source / Destination IP address</b> : <b>32 bits chacune</b>. Chaque datagramme contient tout ce qu'il faut pour aller de sa source à sa destination : les datagrammes d'un même flux sont <b>« autonomes »</b> les uns par rapport aux autres.</li>
</ul>
<div class="piege"><b>Piège</b> : le TTL n'est <u>pas</u> un temps en secondes dans ce cours, c'est un <b>compteur de sauts</b>. Et la checksum IP ne couvre <u>que l'en-tête</u> (la checksum UDP, elle, couvre le segment).</div>`
    },

    {
      id: "adressage",
      titre: "Adresses IPv4, masques et sous-réseaux",
      diapos: [99, 100, 101],
      recherche: "masque de sous-réseau notation CIDR débutant",
      videos: [
        { t: "Masque de sous-réseau pour débutants", u: "https://www.youtube.com/watch?v=VJjitbG9Tcs", l: "FR" },
        { t: "Tout savoir sur le masque de sous-réseau, le CIDR…", u: "https://www.youtube.com/watch?v=cK9_nSha7yM", l: "FR" },
        { t: "4.3 The Internet Protocol, part 2", u: "https://www.youtube.com/watch?v=H9DivCEFuUg", l: "EN" }
      ],
      html: `
<h4>L'adresse IP identifie une interface [d99]</h4>
<ul>
  <li>Une adresse IPv4 fait <b>32 bits</b> (4 nombres de 0 à 255 : <code>140.1.1.4</code>).</li>
  <li>Elle identifie une <b>interface réseau</b> = la connexion entre un nœud et un lien. <b>Un routeur a plusieurs interfaces</b> ; un terminal en a une ou plusieurs (Wi-Fi + Ethernet…). <b>Chaque interface a sa propre adresse IP.</b></li>
  <li>Elle se découpe en deux :
    <ul><li><b>partie réseau</b> = les bits de <b>poids fort</b> (à gauche) ;</li>
        <li><b>partie hôte</b> = les bits de <b>poids faible</b> (à droite).</li></ul></li>
  <li>Le <b>masque</b> donne la taille de la partie réseau. Notation <b>a.b.c.d/x</b> : <b>x = nombre de bits de la partie réseau</b>.</li>
</ul>
<div class="exemple"><b>Exemple</b> : <code>140.1.1.0/24</code> → les 24 premiers bits sont la partie réseau, il reste 32 − 24 = <b>8 bits</b> d'hôte, donc <b>2<sup>8</sup> = 256 adresses</b> : de 140.1.1.0 à 140.1.1.255.<br>
Règle : <b>/x → 2<sup>(32−x)</sup> adresses</b>. /24 → 256 · /25 → 128 · /26 → 64 · /28 → 16 · /22 → 1024.</div>
<div class="bonus"><b>Pour aller plus loin</b> (pas dans ce CM) : dans un sous-réseau, la 1re adresse (réseau) et la dernière (broadcast) sont réservées, donc un /24 offre 254 adresses pour des machines. Le CM, lui, compte les <b>256 adresses</b> du bloc — c'est ce chiffre qu'il faut donner.</div>

<h4>Sous-réseaux [d100]</h4>
<ul>
  <li>Un <b>sous-réseau</b> (« subnet ») = l'ensemble des interfaces dont les adresses ont la <b>même partie réseau</b>.</li>
  <li>Les interfaces d'un même sous-réseau peuvent communiquer <b>directement, sans passer par un routeur</b>.</li>
  <li>Astuce pour les repérer sur un schéma : <b>« désactiver » les interfaces des routeurs</b> ; chaque îlot isolé qui reste = un sous-réseau.</li>
  <li>On peut <b>découper</b> un réseau en plusieurs sous-réseaux, ou <b>agréger</b> des sous-réseaux.</li>
</ul>

<h4>D'où viennent les adresses ? [d101]</h4>
<table>
  <tr><th>Qui ?</th><th>Comment obtient-il ses adresses ?</th></tr>
  <tr><td><b>Un terminal</b></td><td>Soit <b>« codée en dur »</b> par un admin (Unix : <code>/etc/rc.config</code> ; Windows : panneau de configuration TCP/IP), soit par <b>DHCP</b> : adresse obtenue <b>dynamiquement</b> auprès d'un serveur, en « Plug and Play ».</td></tr>
  <tr><td><b>Une organisation</b> (préfixe)</td><td>Elle demande à son <b>FAI</b> de lui allouer une portion de son espace d'adresses.</td></tr>
  <tr><td><b>Un FAI</b> (bloc d'adresses)</td><td>Auprès de l'<b>ICANN</b> (Internet Corporation for Assigned Names and Numbers), qui : <b>alloue les adresses</b>, <b>affecte les noms de domaine</b>, <b>gère le DNS</b>, <b>arbitre les conflits</b>.</td></tr>
</table>`
    },

    {
      id: "ipv6",
      titre: "IPv6",
      diapos: [102],
      recherche: "IPv6 pourquoi 128 bits tunneling",
      videos: [
        { t: "Pourquoi passe-t-on à l'IPv6 ?", u: "https://www.youtube.com/watch?v=0m6KJ7vvSDM", l: "FR" },
        { t: "L'adressage IP, la différence entre IPv4 et IPv6", u: "https://www.youtube.com/watch?v=_Js3VPJdnGM", l: "FR" }
      ],
      html: `
<p>IPv6 a été créé pour faire face à la <b>pénurie d'adresses IPv4</b> [d102].</p>
<table>
  <tr><th></th><th>IPv4</th><th>IPv6</th></tr>
  <tr><td>Taille d'une adresse</td><td><b>32 bits</b></td><td><b>128 bits</b></td></tr>
  <tr><td>Checksum dans l'en-tête</td><td>oui</td><td><b>non</b> (supprimée : on laisse les autres couches s'en occuper, pour plus d'efficacité)</td></tr>
  <tr><td>Nouveaux champs</td><td>—</td><td><b>Traffic class</b> : différenciation de service<br><b>Flow label</b> : identifier les datagrammes d'un même flux pour les traiter plus efficacement</td></tr>
</table>
<h4>La migration</h4>
<ul>
  <li>Elle a démarré en <b>2003</b> et on est <b>toujours en phase de cohabitation</b> IPv4 / IPv6.</li>
  <li>Mécanisme de <b>tunneling</b> : on <b>encapsule les datagrammes IPv6 dans des datagrammes IPv4</b> pour traverser les routeurs qui ne parlent qu'IPv4.</li>
</ul>
<div class="piege"><b>Piège</b> : dans le tunneling, c'est <b>IPv6 dans IPv4</b> (le vieux réseau transporte le nouveau format), pas l'inverse.</div>`
    },

    {
      id: "acheminement",
      titre: "Tables d'acheminement et plus long préfixe",
      diapos: [104, 105, 106, 107, 108],
      recherche: "longest prefix match table de routage exemple",
      videos: [
        { t: "Think Like a Router: Mastering Longest Prefix Match Logic", u: "https://www.youtube.com/watch?v=9x_u839WDcs", l: "EN" },
        { t: "CS168: Longest Prefix Matching", u: "https://www.youtube.com/watch?v=1VMJt2-Kvq4", l: "EN" }
      ],
      html: `
<h4>Une entrée = un sous-réseau [d104]</h4>
<p>Une table avec une ligne par adresse IP ? Impossible : il y a <b>4 milliards (2<sup>32</sup>)</b> d'adresses IPv4, la recherche serait beaucoup trop longue. Solution : <b>une entrée = un ensemble d'adresses = un sous-réseau</b>, au format <b>@IP/masque</b>.</p>
<ul>
  <li><code>192.168.4.0/24</code> désigne les <b>256 (= 2<sup>8</sup>) adresses</b> de 192.168.4.0 à 192.168.4.255.</li>
  <li><code>0.0.0.0/0</code> désigne <b>toutes</b> les adresses possibles → c'est la <b>route par défaut</b> (« si rien d'autre ne correspond, va par là »).</li>
</ul>

<h4>La table du routeur R1 [d105]</h4>
<table>
  <tr><th>Réseau</th><th>Saut suivant</th><th>Interf.</th></tr>
  <tr><td>180.70.65.192/26</td><td>—</td><td>m2</td></tr>
  <tr><td>180.70.65.128/25</td><td>—</td><td>m0</td></tr>
  <tr><td>201.4.22.0/24</td><td>—</td><td>m3</td></tr>
  <tr><td>201.4.16.0/22</td><td>—</td><td>m1</td></tr>
  <tr><td>0.0.0.0/0</td><td>180.70.65.200</td><td>m2</td></tr>
</table>
<p>« — » dans la colonne prochain saut = le réseau est <b>accessible directement, sans routeur</b> (directement connecté). Pour tout le reste (Internet), on passe par le routeur 180.70.65.200.</p>

<h4>Et si une adresse correspond à plusieurs entrées ? [d106] [d107]</h4>
<p>On choisit l'entrée <b>la plus spécifique</b> = celle qui a le <b>préfixe le plus long</b> : c'est l'algorithme du <b>Plus Long Préfixe Partagé</b> (<i>longest prefix match</i>). Ni la première, ni la plus récente, ni au hasard ! En pratique, il suffit de parcourir les entrées de la plus longue (/28) à la plus courte (/0) et de s'arrêter à la première qui correspond. Seuls les <b>préfixes</b> suffisent dans les tables [d108].</p>

<div class="exemple"><b>Table de l'exemple</b> :
<table>
  <tr><th>Entrée</th><th>Plage</th><th>If</th></tr>
  <tr><td>192.168.0.0/28</td><td>192.168.0.0 → 192.168.0.15</td><td>0</td></tr>
  <tr><td>192.168.0.0/24</td><td>192.168.0.0 → 192.168.0.255</td><td>1</td></tr>
  <tr><td>192.168.0.0/22</td><td>192.168.0.0 → 192.168.3.255</td><td>2</td></tr>
  <tr><td>0.0.0.0/0</td><td>tout (prochain saut 192.168.0.1)</td><td>0</td></tr>
</table>
• <b>192.168.0.7</b> → correspond à /28, /24, /22 et /0 → le plus long = /28 → <b>interface 0</b><br>
• <b>192.168.0.17</b> → pas dans /28 (qui s'arrête à .15), mais dans /24 → <b>interface 1</b><br>
• <b>192.168.4.17</b> → hors de /22 (qui s'arrête à 192.168.3.255) → route par défaut → <b>interface 0</b></div>
<div class="retenir"><b>Méthode pour le QCM</b> : 1) calcule la plage de chaque entrée (/x → 2<sup>32−x</sup> adresses à partir de l'adresse réseau) ; 2) garde celles qui contiennent l'adresse ; 3) prends le <b>/ le plus grand</b>.</div>`
    },

    {
      id: "algos",
      titre: "Algorithmes de routage : état de liens (Dijkstra) et vecteur de distances (Bellman-Ford)",
      diapos: [110, 111, 112, 113, 114, 115, 116, 117],
      recherche: "routage état de liens vecteur de distances Dijkstra Bellman-Ford",
      videos: [
        { t: "Dijkstra, le plus court chemin dans un graphe", u: "https://www.youtube.com/watch?v=J8AntuTp1K4", l: "FR" },
        { t: "5.2 Routing algorithms: link state routing", u: "https://www.youtube.com/watch?v=bdh2kfgxVuw", l: "EN" },
        { t: "5.2-2 Bellman Ford Distance Vector Routing", u: "https://www.youtube.com/watch?v=jJU2AVX6gpU", l: "EN" }
      ],
      html: `
<h4>Pourquoi router ? [d110] [d111] [d112]</h4>
<ul>
  <li>Avec 2 machines et 1 câble, pas besoin de routage.</li>
  <li>Relier <b>chaque</b> machine à <b>toutes</b> les autres ne <b>passe pas à l'échelle</b> : trop d'interfaces et trop de câbles.</li>
  <li>Donc les machines ne sont reliées qu'à quelques voisins : A sait parler à B et C, mais pas à D → <b>il faut trouver un chemin !</b></li>
</ul>

<h4>Un problème de plus court chemin [d113] [d114]</h4>
<p>On modélise le réseau par un <b>graphe</b> : des <b>nœuds</b> (routeurs) et des <b>liens</b> avec un <b>coût</b>. Les coûts peuvent être :</p>
<ul>
  <li><b>identiques</b> (tous égaux à 1 → on compte les sauts) ;</li>
  <li><b>différents et constants</b>, par ex. <b>inversement proportionnels à la capacité</b> du lien (exemple Cisco) ;</li>
  <li><b>différents et dynamiques</b>, par ex. liés à une mesure de <b>congestion</b>.</li>
</ul>
<p>Le <b>coût d'un chemin = la somme des coûts des liens</b> qui le composent.</p>
<div class="exemple"><b>Le graphe de la diapo 113</b> : liens A–B : 3, A–C : 1, B–C : 1, C–F : 2, B–F : 5, B–E : 1, B–D : 3, E–D : 1.<br>
Coût(A→C→B→D→E) = 1 + 1 + 3 + 1 = <b>6</b>. Mais ce n'est pas le meilleur chemin de A à E : A→C→B→E coûte 1 + 1 + 1 = <b>3</b>.</div>
<p>À la main, ça marche pour les petits graphes ; sinon il faut un <b>algorithme automatisable</b>. Deux grandes approches pour le <b>routage dynamique</b> :</p>
<table>
  <tr><th>État de liens</th><th>Vecteur de distances</th></tr>
  <tr><td>Chaque nœud a une <b>connaissance complète</b> du réseau (toute la carte)</td><td>Chaque nœud ne connaît que <b>ses voisins</b> et le <b>coût de ses liens</b></td></tr>
  <tr><td>Algorithme de <b>Dijkstra</b></td><td>Équation de <b>Bellman-Ford</b></td></tr>
  <tr><td>Ex : <b>OSPF</b></td><td>Ex : <b>RIP</b>, IGRP</td></tr>
</table>

<h4>Routage par état de liens [d115]</h4>
<ul>
  <li>Chaque nœud doit connaître la <b>topologie complète</b> → on <b>diffuse l'état des liens</b> à tout le monde.</li>
  <li>Chaque nœud exécute l'<b>algorithme de Dijkstra</b> (1959) pour lui-même.</li>
  <li>Résultat : un <b>arbre des plus courts chemins</b> depuis ce nœud, et donc sa <b>table d'acheminement</b>.</li>
</ul>
<div class="exemple"><b>Dijkstra depuis A</b> sur le graphe de la diapo 113 (on prend toujours le nœud non visité le plus proche) :
<ol>
  <li>Départ : A = 0. Voisins : C = 1, B = 3.</li>
  <li>On fixe <b>C (1)</b>. Via C : B = 1+1 = 2 (mieux que 3), F = 1+2 = 3.</li>
  <li>On fixe <b>B (2)</b>. Via B : E = 2+1 = 3, D = 2+3 = 5.</li>
  <li>On fixe <b>E (3)</b>. Via E : D = 3+1 = 4 (mieux que 5).</li>
  <li>On fixe <b>F (3)</b> puis <b>D (4)</b>.</li>
</ol>
Résultat : C = 1, B = 2, E = 3, F = 3, <b>D = 4</b> (A→C→B→E→D). Dans la table de A, le <b>prochain saut est C</b> pour toutes les destinations.</div>

<h4>Routage par vecteur de distances [d116] [d117]</h4>
<p>Notations : <b>d<sub>X</sub>(Y)</b> = coût du plus court chemin de X vers Y ; <b>V<sub>X</sub></b> = l'ensemble des voisins de X.</p>
<p class="formule">Équation de Bellman-Ford : d<sub>X</sub>(Y) = min<sub>V ∈ V<sub>X</sub></sub> [ c(X,V) + d<sub>V</sub>(Y) ]</p>
<p>En français : « pour aller à Y, je regarde chacun de mes voisins V : coût pour aller jusqu'à V + ce que V annonce pour aller à Y. Je garde le minimum. » On manipule en pratique une <b>estimation</b> D<sub>X</sub>(Y), qu'on améliore par itérations jusqu'à un <b>point fixe</b> (plus rien ne change).</p>
<ul>
  <li>Chaque routeur a une <b>table d'acheminement</b> (destination, coût, saut suivant) et un <b>vecteur de distances</b> (destination, coût) qu'il <b>envoie à ses voisins</b> et reçoit d'eux.</li>
  <li>À la <b>réception d'un vecteur</b> ou après un <b>changement sur un lien</b>, le nœud réapplique Bellman-Ford et renvoie son vecteur à ses voisins.</li>
  <li>Algorithme <b>distribué, itératif et asynchrone</b> (exercices en TD2).</li>
</ul>
<div class="exemple"><b>Bellman-Ford pour B vers D</b> (même graphe). Les voisins de B annoncent : d<sub>A</sub>(D) = 4, d<sub>C</sub>(D) = 3, d<sub>F</sub>(D) = 5, d<sub>E</sub>(D) = 1, d<sub>D</sub>(D) = 0.<br>
d<sub>B</sub>(D) = min( 3+4, 1+3, 5+5, 1+1, 3+0 ) = min(7, 4, 10, <b>2</b>, 3) = <b>2</b>, saut suivant <b>E</b>.</div>`
    },

    {
      id: "internet-routage",
      titre: "Le routage dans Internet : AS, intra-AS, inter-AS et BGP",
      diapos: [119, 120, 121, 122, 123, 124, 125],
      recherche: "système autonome BGP OSPF RIP routage intra inter AS",
      videos: [
        { t: "Introduction au BGP", u: "https://www.youtube.com/watch?v=qUODcz5aixE", l: "FR" },
        { t: "5.4 BGP: the Border Gateway Protocol", u: "https://www.youtube.com/watch?v=2rV4tJkP-CQ", l: "EN" },
        { t: "OSPF Intra-AS Routing", u: "https://www.youtube.com/watch?v=svOGbh4rmDU", l: "EN" }
      ],
      html: `
<h4>Pourquoi un routage hiérarchique ? [d119] [d120]</h4>
<p>On ne peut pas appliquer Dijkstra ou Bellman-Ford directement sur tous les routeurs d'Internet :</p>
<ul>
  <li><b>Échelle gigantesque</b>.</li>
  <li>Internet est une <b>fédération de réseaux autonomes interconnectés</b> : les <b>AS</b> (<i>Autonomous Systems</i>, systèmes autonomes). Chaque administrateur d'AS est <b>maître de son réseau et de son routage</b>. Il y a environ <b>120 000 AS en 2025</b>. Un AS = un FAI, une entreprise, une université…</li>
  <li><b>Confidentialité</b> : la topologie interne doit rester secrète, ainsi que les accords négociés avec les autres AS.</li>
  <li><b>Politiques et intérêts divergents</b> : pas de métrique standard pour le coût d'un lien, envie de contrôler d'où vient et où part le trafic, voire de décharger son réseau au détriment des autres.</li>
</ul>
<p>Donc deux niveaux : le <b>routage intra-AS</b> (dans un AS) et le <b>routage inter-AS</b> (entre AS). Les <b>routeurs passerelles</b> (« gateway routers ») sont ceux qui font l'interface avec les routeurs des autres AS.</p>

<h4>Routage intra-AS [d121]</h4>
<ul>
  <li>Routage entre les routeurs d'un <b>même AS</b>, pour les destinations dans l'AS (et les routes vers les passerelles).</li>
  <li><b>Tous les routeurs d'un même AS appliquent le même routage intra-AS</b> ; deux AS différents peuvent en utiliser des différents.</li>
</ul>
<table>
  <tr><th>Protocole intra-AS</th><th>Type</th></tr>
  <tr><td><b>RIP</b> — Routing Information Protocol</td><td>Vecteur de distances</td></tr>
  <tr><td><b>OSPF</b> — Open Shortest Path First</td><td>État de liens</td></tr>
  <tr><td><b>IGRP</b> — Interior Gateway Routing Protocol</td><td>Vecteur de distances, <b>propriétaire Cisco</b></td></tr>
</table>
<p class="mnemo">Moyen mnémotechnique : <b>OSPF</b> contient « <b>S</b>hortest <b>P</b>ath <b>F</b>irst » → c'est Dijkstra → <b>état de liens</b>.</p>

<h4>Routage inter-AS : missions [d122]</h4>
<ul>
  <li><b>Annoncer</b> aux autres AS les sous-réseaux qu'on dessert ;</li>
  <li><b>Apprendre</b> les sous-réseaux accessibles depuis les AS voisins ;</li>
  <li>puis en <b>informer ses routeurs internes</b> ;</li>
  <li>et <b>propager</b> l'information aux autres AS.</li>
</ul>

<h4>BGP : Border Gateway Protocol [d123]</h4>
<p>C'est <b>le</b> protocole de routage inter-AS de l'Internet.</p>
<ul>
  <li><b>eBGP</b> (external BGP) : <b>obtenir</b> les infos d'accessibilité des <b>autres AS</b>.</li>
  <li><b>iBGP</b> (internal BGP) : <b>propager</b> ces infos aux <b>routeurs internes</b> de l'AS.</li>
  <li>Quand AS4 annonce à AS5 le sous-réseau s (via eBGP), AS4 <b>promet qu'il retransmettra</b> les datagrammes destinés à s.</li>
</ul>

<h4>Comment tout s'emboîte [d124]</h4>
<p>Un AS reçoit une annonce pour un sous-réseau X hors de son domaine :</p>
<ol>
  <li>Si X est accessible depuis <b>une seule passerelle</b> → c'est elle. S'il est accessible depuis <b>plusieurs passerelles</b>, le <b>routage inter-AS (eBGP)</b> choisit laquelle selon les <b>accords commerciaux</b> et la <b>règle de la patate chaude</b>.</li>
  <li>Le <b>routage inter-AS (iBGP)</b> informe les routeurs de l'AS de la passerelle choisie pour X.</li>
  <li>Le <b>routage intra-AS</b> calcule le <b>plus court chemin vers cette passerelle</b>.</li>
  <li>Chaque routeur ajoute dans sa table l'entrée <b>(X, I)</b>, avec I l'interface du prochain saut vers la passerelle choisie.</li>
</ol>
<div class="analogie"><b>Patate chaude</b> 🥔 : on se débarrasse du paquet le plus vite possible → on l'envoie vers la passerelle la plus proche (la moins coûteuse <i>dans son propre AS</i>), même si le chemin global n'est pas le plus court. C'est l'AS suivant qui « paiera » le reste du trajet.</div>

<h4>Où fait-on vraiment du plus court chemin ? [d125]</h4>
<table>
  <tr><th>Question</th><th>Qui décide ?</th><th>Plus court chemin ?</th></tr>
  <tr><td>Quel <b>prochain AS</b>, donc quelle <b>passerelle</b> ?</td><td>Le routage <b>inter-AS</b></td><td><b>Pas toujours</b> (politiques, accords commerciaux)</td></tr>
  <tr><td>Quelle <b>route vers la passerelle</b> ?</td><td>Le routage <b>intra-AS</b></td><td><b>Oui</b>, selon le plus court chemin</td></tr>
</table>`
    }
  ],

  questions: [
    /* --- role --- */
    { s: "role", d: 94, q: "Quels équipements implémentent la couche Réseau ?",
      r: ["Tous les terminaux et tous les routeurs", "Uniquement les terminaux", "Uniquement les routeurs", "Uniquement les commutateurs"],
      e: "Diapo 94 : tous les terminaux et routeurs implémentent la couche Réseau." },
    { s: "role", d: 94, q: "Que fait la couche Réseau de l'expéditeur avec les segments à émettre ?",
      r: ["Elle les encapsule dans des datagrammes", "Elle les découpe en trames", "Elle les réassemble en messages", "Elle les acquitte"],
      e: "Expéditeur : encapsule les segments dans des datagrammes." },
    { s: "role", d: 95, q: "Qu'est-ce que l'acheminement (forwarding) ?",
      r: ["Commuter un paquet d'une interface à une autre en interrogeant la table d'acheminement", "Déterminer le chemin de bout-en-bout de la source à la destination", "Attribuer une adresse IP à chaque interface", "Diffuser l'état des liens à tous les routeurs"],
      e: "Acheminement = action locale dans un routeur ; routage = calcul du chemin global." },
    { s: "role", d: 95, q: "Qu'est-ce que le routage ?",
      r: ["Déterminer le chemin de bout-en-bout à suivre de la source à la destination", "Commuter un paquet d'une interface d'entrée vers une interface de sortie", "Décrémenter le TTL", "Vérifier la somme de contrôle de l'en-tête"],
      e: "Routage = algorithme de routage qui détermine le chemin complet." },
    { s: "role", d: 95, q: "Pourquoi dit-on que l'adresse réseau est un « identifiant topologique » ?",
      r: ["Car elle dépend de la position du nœud dans le réseau", "Car elle est gravée dans la carte réseau en usine", "Car elle change à chaque paquet", "Car elle décrit le type de câble utilisé"],
      e: "Diapo 95 : identifiant topologique = dépend de la position dans le réseau, utile pour router, en principe unique." },

    /* --- ipv4 --- */
    { s: "ipv4", d: 97, q: "Quelle est la taille de l'en-tête IPv4 (sans options) ?",
      r: ["20 octets", "8 octets", "40 octets", "32 octets"],
      e: "Diapo 97 : en-tête de 20 octets." },
    { s: "ipv4", d: 97, q: "Comment évolue le TTL d'un datagramme ?",
      r: ["Il est décrémenté de 1 à chaque saut ; à 0 le paquet est supprimé", "Il augmente de 1 à chaque saut", "Il est décrémenté d'une unité par seconde passée dans un buffer", "Il reste constant, il sert juste d'identifiant"],
      e: "TTL : valeur initiale fixée par l'émetteur, décrémentée de 1 à chaque saut ; si TTL = 0, le paquet est supprimé." },
    { s: "ipv4", d: 97, q: "À quoi sert le TTL ?",
      r: ["À éviter qu'un paquet tourne indéfiniment dans le réseau (ex. boucle de routage)", "À mesurer le RTT", "À contrôler la congestion", "À identifier le protocole de transport"],
      e: "Diapo 97 : permet d'éviter qu'un paquet tourne indéfiniment, par exemple en présence d'une boucle de routage." },
    { s: "ipv4", d: 97, q: "Dans le champ Protocol de l'en-tête IP, quelle valeur désigne TCP ?",
      r: ["6", "17", "4", "80"],
      e: "06 : TCP ; 17 : UDP." },
    { s: "ipv4", d: 97, q: "Dans le champ Protocol de l'en-tête IP, quelle valeur désigne UDP ?",
      r: ["17", "6", "53", "1"],
      e: "17 : UDP ; 6 : TCP." },
    { s: "ipv4", d: 98, q: "Sur quoi porte la somme de contrôle de l'en-tête IPv4 ?",
      r: ["Sur l'en-tête IP seulement", "Sur tout le datagramme, données comprises", "Sur les données seulement", "Sur le segment TCP uniquement"],
      e: "Diapo 98 : calculée sur l'en-tête IP seulement." },
    { s: "ipv4", d: 98, q: "Que se passe-t-il si un routeur détecte une erreur dans la somme de contrôle IPv4 ?",
      r: ["Le paquet est supprimé", "Le routeur envoie un NAK", "Le routeur corrige l'erreur", "Le paquet est renvoyé à la source"],
      e: "En cas d'erreur, le paquet est supprimé." },
    { s: "ipv4", d: 98, q: "Sur combien de bits sont codées les adresses IPv4 source et destination ?",
      r: ["32 bits chacune", "16 bits chacune", "48 bits chacune", "128 bits chacune"],
      e: "Diapo 98 : codées sur 32 bits chacune." },

    /* --- adressage --- */
    { s: "adressage", d: 99, q: "Qu'identifie une adresse IP ?",
      r: ["Une interface réseau", "Une machine, quel que soit son nombre d'interfaces", "Un processus", "Un AS"],
      e: "Diapo 99 : adresse IP = identifiant d'une interface réseau. Un routeur a plusieurs interfaces, donc plusieurs adresses." },
    { s: "adressage", d: 99, q: "Dans la notation a.b.c.d/x, que représente x ?",
      r: ["Le nombre de bits de la partie réseau", "Le nombre de bits de la partie hôte", "Le nombre de machines du sous-réseau", "Le numéro du sous-réseau"],
      e: "x = masque de sous-réseau = nombre de bits de la partie réseau." },
    { s: "adressage", d: 99, q: "Dans une adresse IP, la partie réseau correspond aux bits :",
      r: ["De poids fort", "De poids faible", "Pairs", "Du milieu"],
      e: "Partie réseau : bits de poids fort ; partie hôte : bits de poids faible." },
    { s: "adressage", d: 104, q: "Combien d'adresses désigne 192.168.4.0/24 ?",
      r: ["256", "24", "254", "65 536"],
      e: "32 − 24 = 8 bits d'hôte → 2⁸ = 256 adresses (de 192.168.4.0 à 192.168.4.255)." },
    { s: "adressage", d: 104, q: "Combien d'adresses contient un bloc /26 ?",
      r: ["64", "26", "128", "32"],
      e: "32 − 26 = 6 bits → 2⁶ = 64 adresses." },
    { s: "adressage", d: 100, q: "Les interfaces d'un même sous-réseau :",
      r: ["Peuvent communiquer directement, sans l'intervention d'un routeur", "Doivent toujours passer par la passerelle", "Ont exactement la même adresse IP", "Appartiennent forcément à des AS différents"],
      e: "Diapo 100 : même partie réseau → communication directe sans routeur." },
    { s: "adressage", d: 100, q: "Quelle méthode le CM propose-t-il pour trouver les sous-réseaux d'un schéma ?",
      r: ["Désactiver les interfaces des routeurs : chaque réseau isolé restant est un sous-réseau", "Compter le nombre de terminaux", "Regarder les numéros de port", "Exécuter Dijkstra sur le schéma"],
      e: "Diapo 100 : en désactivant les interfaces des routeurs, chaque nouveau réseau isolé est un sous-réseau." },
    { s: "adressage", d: 101, q: "Comment un terminal peut-il obtenir son adresse IP dynamiquement ?",
      r: ["Par DHCP", "Par DNS", "Par BGP", "Par ICMP"],
      e: "DHCP : adresse obtenue dynamiquement auprès d'un serveur, « Plug and Play »." },
    { s: "adressage", d: 101, q: "Comment une organisation obtient-elle son préfixe d'adresses ?",
      r: ["Elle demande à son FAI de lui allouer une portion de son espace d'adresses", "Elle le choisit librement", "Elle le reçoit par DHCP", "Elle l'obtient via BGP auprès de ses voisins"],
      e: "Diapo 101 : l'organisation demande à son FAI." },
    { s: "adressage", d: 101, q: "Lequel de ces rôles N'EST PAS attribué à l'ICANN dans le CM ?",
      r: ["Calculer les tables de routage des FAI", "Allouer les adresses", "Affecter les noms de domaine", "Arbitrer les conflits"],
      e: "ICANN : alloue les adresses, affecte les noms de domaines, gère le DNS, arbitre les conflits. Les tables de routage, chaque routeur les calcule." },

    /* --- ipv6 --- */
    { s: "ipv6", d: 102, q: "Quelle est la taille d'une adresse IPv6 ?",
      r: ["128 bits", "32 bits", "64 bits", "256 bits"],
      e: "IPv6 : 128 bits ; IPv4 : 32 bits." },
    { s: "ipv6", d: 102, q: "Quel champ de l'en-tête IPv4 disparaît en IPv6 ?",
      r: ["La somme de contrôle (checksum)", "L'adresse source", "Le TTL / nombre de sauts", "L'adresse destination"],
      e: "Le champ checksum disparaît : on laisse d'autres couches s'en occuper pour plus d'efficacité." },
    { s: "ipv6", d: 102, q: "À quoi sert le champ « Flow label » d'IPv6 ?",
      r: ["Identifier les datagrammes d'un même flux pour un traitement plus efficace", "Indiquer la taille du datagramme", "Remplacer le numéro de port", "Chiffrer le contenu"],
      e: "Flow label : identifier les datagrammes appartenant à un même flux. Traffic class : différenciation de service." },
    { s: "ipv6", d: 102, q: "En quoi consiste le tunneling pour la migration vers IPv6 ?",
      r: ["Encapsuler des datagrammes IPv6 dans des datagrammes IPv4 pour traverser les routeurs IPv4", "Encapsuler des datagrammes IPv4 dans des datagrammes IPv6", "Convertir les adresses IPv6 en adresses IPv4", "Créer un câble dédié entre deux routeurs IPv6"],
      e: "Diapo 102 : encapsulation des datagrammes IPv6 dans des datagrammes IPv4 sur les routeurs IPv4." },
    { s: "ipv6", d: 102, q: "Où en est la migration vers IPv6 selon le CM ?",
      r: ["Démarrée en 2003, toujours en phase de cohabitation avec IPv4", "Terminée depuis 2010", "Pas encore commencée", "IPv4 a été abandonné en 2020"],
      e: "Migration démarrée en 2003, toujours dans une phase de cohabitation IPv4/IPv6." },

    /* --- acheminement --- */
    { s: "acheminement", d: 104, q: "Pourquoi une entrée de table d'acheminement correspond-elle à un sous-réseau plutôt qu'à une adresse ?",
      r: ["Avec 2³² adresses IPv4, une entrée par adresse rendrait la recherche bien trop longue", "Parce que les adresses IP changent trop souvent", "Parce qu'un routeur n'a qu'une seule interface", "Pour cacher la topologie aux autres AS"],
      e: "Diapo 104 : 4 milliards d'adresses → recherche trop longue. Une entrée = un ensemble d'adresses = un sous-réseau." },
    { s: "acheminement", d: 104, q: "Que représente l'entrée 0.0.0.0/0 dans une table d'acheminement ?",
      r: ["La route par défaut (toutes les adresses possibles)", "Une adresse invalide à rejeter", "Le réseau local du routeur", "L'adresse de bouclage du routeur"],
      e: "0.0.0.0/0 désigne toutes les adresses → route par défaut." },
    { s: "acheminement", d: 107, q: "Si une adresse correspond à plusieurs entrées de la table, laquelle choisit-on ?",
      r: ["La plus spécifique, c'est-à-dire celle qui a le préfixe le plus long", "La première qui apparaît dans la table", "L'entrée la plus récente", "Une entrée tirée au hasard"],
      e: "Diapo 107 : algorithme du Plus Long Préfixe Partagé." },
    { s: "acheminement", d: 108, q: "Table : 192.168.0.0/28 → if 0 ; 192.168.0.0/24 → if 1 ; 192.168.0.0/22 → if 2 ; défaut → if 0. Interface pour 192.168.0.17 ?",
      r: ["1", "0", "2", "La route par défaut"],
      e: "/28 couvre .0 à .15 : non. /24 couvre .0 à .255 : oui. C'est le plus long préfixe qui correspond → interface 1." },
    { s: "acheminement", d: 108, q: "Même table (/28 → 0, /24 → 1, /22 → 2, défaut → 0). Interface pour 192.168.0.7 ?",
      r: ["0 (entrée /28)", "1 (entrée /24)", "2 (entrée /22)", "0 (route par défaut)"],
      e: "192.168.0.7 est dans /28 (0 à 15), /24, /22 et /0 : le plus long préfixe est /28 → interface 0." },
    { s: "acheminement", d: 108, q: "Même table (/28 → 0, /24 → 1, /22 → 2, défaut → 0 via 192.168.0.1). Où part 192.168.4.17 ?",
      r: ["Par la route par défaut, interface 0", "Interface 2, entrée /22", "Interface 1, entrée /24", "Le paquet est supprimé"],
      e: "/22 couvre 192.168.0.0 à 192.168.3.255 : 192.168.4.17 n'y est pas. Seule la route par défaut correspond." },
    { s: "acheminement", d: 108, q: "Même table (/28 → 0, /24 → 1, /22 → 2, défaut → 0). Interface pour 192.168.2.5 ?",
      r: ["2", "1", "0", "Aucune"],
      e: "192.168.2.5 n'est ni dans /28 ni dans /24 (192.168.0.x), mais dans /22 (192.168.0.0 à 192.168.3.255) → interface 2." },
    { s: "acheminement", d: 105, q: "Table de R1 : 180.70.65.192/26 → m2 ; 180.70.65.128/25 → m0 ; 201.4.22.0/24 → m3 ; 201.4.16.0/22 → m1 ; défaut → m2. Interface pour 180.70.65.140 ?",
      r: ["m0", "m2", "m1", "m3"],
      e: "/26 couvre .192 à .255 : non. /25 couvre .128 à .255 : oui → m0." },
    { s: "acheminement", d: 105, q: "Même table de R1. Interface pour 180.70.65.200 ?",
      r: ["m2 (entrée /26)", "m0 (entrée /25)", "m2 (route par défaut)", "m3"],
      e: "180.70.65.200 est dans /26 (.192–.255) et dans /25 (.128–.255) : le /26 est plus long → m2." },
    { s: "acheminement", d: 105, q: "Même table de R1. Interface pour 201.4.17.9 ?",
      r: ["m1", "m3", "m0", "m2 (défaut)"],
      e: "201.4.16.0/22 couvre 201.4.16.0 à 201.4.19.255 → m1. (201.4.22.0/24 ne couvre que 201.4.22.x.)" },
    { s: "acheminement", d: 105, q: "Même table de R1. Que devient un datagramme pour 18.24.32.78 ?",
      r: ["Il part par m2 vers le prochain saut 180.70.65.200 (route par défaut)", "Il part par m0", "Il est supprimé car aucune entrée ne correspond", "Il part par m3"],
      e: "Aucune entrée spécifique ne correspond → route par défaut 0.0.0.0/0 : prochain saut 180.70.65.200 via m2." },

    /* --- algos --- */
    { s: "algos", d: 111, q: "Pourquoi ne relie-t-on pas directement chaque machine à toutes les autres ?",
      r: ["Cela ne passe pas à l'échelle : trop d'interfaces et de câbles", "Parce que les câbles directs sont plus lents", "Parce que le TTL l'interdit", "Parce que les adresses IP ne le permettent pas"],
      e: "Diapo 111 : ne passe pas à l'échelle (# interfaces, # câbles)." },
    { s: "algos", d: 113, q: "Comment se calcule le coût d'un chemin dans un graphe ?",
      r: ["C'est la somme des coûts des liens qui le composent", "C'est le coût du lien le plus cher", "C'est le nombre de nœuds traversés au carré", "C'est la moyenne des coûts des liens"],
      e: "Coût d'un chemin = composition (somme) des coûts des liens." },
    { s: "algos", d: 113, q: "Selon l'exemple Cisco cité en CM, le coût d'un lien peut être :",
      r: ["Inversement proportionnel à sa capacité d'émission", "Proportionnel à sa capacité d'émission", "Égal à son délai de propagation en ms", "Toujours égal à 1"],
      e: "Coûts différents et constants : par ex. inversement proportionnels à leur capacité (exemple Cisco)." },
    { s: "algos", d: 113, q: "Graphe de la diapo 113 (A–B 3, A–C 1, B–C 1, C–F 2, B–F 5, B–E 1, B–D 3, E–D 1). Coût du chemin A→C→B→D→E ?",
      r: ["6", "3", "5", "8"],
      e: "c(A,C) + c(C,B) + c(B,D) + c(D,E) = 1 + 1 + 3 + 1 = 6." },
    { s: "algos", d: 113, q: "Même graphe. Quel est le coût du plus court chemin de A à E ?",
      r: ["3 (A→C→B→E)", "4 (A→B→E)", "6 (A→C→B→D→E)", "9 (A→C→F→B→E)"],
      e: "A→C (1) → B (1) → E (1) = 3. A→B→E coûte 3+1 = 4." },
    { s: "algos", d: 115, q: "Même graphe. Après Dijkstra depuis A, quel est le coût du plus court chemin de A à D ?",
      r: ["4", "5", "6", "3"],
      e: "A→C→B→E→D = 1+1+1+1 = 4 (mieux que A→C→B→D = 5)." },
    { s: "algos", d: 115, q: "Même graphe. Dans la table d'acheminement de A, quel est le prochain saut pour atteindre D ?",
      r: ["C", "B", "E", "D directement"],
      e: "Le plus court chemin A→C→B→E→D commence par C. (A–B direct coûte 3, plus cher que A→C→B = 2.)" },
    { s: "algos", d: 114, q: "Dans le routage par état de liens, que connaît chaque nœud ?",
      r: ["La topologie complète du réseau", "Uniquement ses voisins et le coût de ses liens", "Uniquement la route par défaut", "Uniquement les AS voisins"],
      e: "État de liens : chaque nœud a une connaissance complète du réseau (diffusion de l'état des liens)." },
    { s: "algos", d: 114, q: "Dans le routage par vecteur de distances, que connaît chaque nœud au départ ?",
      r: ["Uniquement ses voisins et le coût de ses liens", "La topologie complète du réseau", "Les tables de tous les routeurs de l'AS", "Rien du tout"],
      e: "Vecteur de distances : chaque nœud connaît uniquement ses voisins et le coût de ses liens." },
    { s: "algos", d: 115, q: "Quel algorithme est utilisé par le routage par état de liens ?",
      r: ["Dijkstra", "Bellman-Ford", "AIMD", "Go-Back-N"],
      e: "Diapo 115 : application de l'algorithme de Dijkstra (1959), exécuté pour chaque nœud." },
    { s: "algos", d: 115, q: "Que retourne l'algorithme de Dijkstra exécuté sur un nœud ?",
      r: ["Un arbre des plus courts chemins depuis ce nœud, donc sa table d'acheminement", "Le vecteur de distances de ses voisins", "La liste des AS accessibles", "La taille de la fenêtre d'anticipation"],
      e: "Diapo 115 : retourne un arbre des plus courts chemins, et donc sa table d'acheminement." },
    { s: "algos", d: 116, q: "Quelle est l'équation de Bellman-Ford ?",
      r: ["d_X(Y) = min sur les voisins V de X de [ c(X,V) + d_V(Y) ]", "d_X(Y) = max sur les voisins V de [ c(X,V) + d_V(Y) ]", "d_X(Y) = c(X,Y) × nombre de sauts", "d_X(Y) = somme sur tous les voisins de c(X,V)"],
      e: "Pour aller à Y, X teste chaque voisin V : coût jusqu'à V + distance annoncée par V vers Y, et garde le minimum." },
    { s: "algos", d: 116, q: "B a pour voisins E (coût 1), C (coût 1) et D (coût 3). E annonce d_E(D) = 1, C annonce d_C(D) = 3. Que vaut d_B(D) ?",
      r: ["2, via E", "3, via D directement", "4, via C", "1, via E"],
      e: "min(1+1, 1+3, 3+0) = min(2, 4, 3) = 2, en passant par E." },
    { s: "algos", d: 117, q: "Dans le routage par vecteur de distances, quand un nœud réapplique-t-il Bellman-Ford ?",
      r: ["À la réception d'un vecteur de distances ou suite à un changement sur un lien", "Uniquement au démarrage", "Toutes les 30 secondes exactement, quoi qu'il arrive", "Quand le TTL d'un paquet atteint 0"],
      e: "Diapo 117 : à la réception d'un vecteur ou suite à un changement sur un lien, il recalcule et envoie son vecteur." },
    { s: "algos", d: 117, q: "Comment le CM qualifie-t-il l'algorithme à vecteur de distances ?",
      r: ["Distribué, itératif et asynchrone", "Centralisé, exact et synchrone", "Distribué mais calculé en une seule fois", "Centralisé et itératif"],
      e: "Diapo 117 : algo distribué, itératif et asynchrone." },
    { s: "algos", d: 117, q: "Que contient le vecteur de distances qu'un routeur envoie à ses voisins ?",
      r: ["Des couples (destination, coût)", "Des triplets (destination, coût, saut suivant)", "La topologie complète", "Les adresses MAC de ses voisins"],
      e: "Vecteur de distances : destination, coût. La table d'acheminement, elle, contient aussi le saut suivant." },

    /* --- internet-routage --- */
    { s: "internet-routage", d: 119, q: "Que désigne un AS ?",
      r: ["Un système autonome : un ensemble de routeurs sous une même administration, maître de son routage", "Un algorithme de routage", "Un accusé de réception sélectif", "Une adresse de sous-réseau"],
      e: "AS = Autonomous System : chaque administrateur d'AS est maître de son réseau et de son routage." },
    { s: "internet-routage", d: 119, q: "Environ combien d'AS composaient Internet en 2025 selon le CM ?",
      r: ["~120 000", "~1 200", "~12 millions", "~120"],
      e: "Diapo 119 : ~120 000 AS en 2025." },
    { s: "internet-routage", d: 119, q: "Laquelle de ces raisons N'EST PAS citée pour justifier un routage hiérarchique ?",
      r: ["Les routeurs ne supportent pas Dijkstra", "L'échelle gigantesque d'Internet", "La confidentialité de la topologie interne et des accords", "Les politiques et intérêts divergents des AS"],
      e: "Raisons : échelle, confidentialité, politiques et intérêts divergents." },
    { s: "internet-routage", d: 120, q: "Qu'est-ce qu'un routeur passerelle (« gateway router ») ?",
      r: ["Un routeur qui fait l'interface avec les routeurs d'autres AS", "Le routeur du domicile de l'utilisateur", "Un routeur qui n'exécute aucun protocole de routage", "Un serveur DHCP"],
      e: "Diapo 120 : routeur passerelle = interface avec les routeurs d'autres AS." },
    { s: "internet-routage", d: 121, q: "Au sein d'un même AS, les routeurs :",
      r: ["Appliquent tous le même routage intra-AS", "Peuvent chacun choisir un protocole différent", "Utilisent obligatoirement BGP", "N'ont pas de table d'acheminement"],
      e: "Diapo 121 : tous les routeurs d'un même AS appliquent le même routage intra-AS (mais deux AS peuvent différer)." },
    { s: "internet-routage", d: 121, q: "OSPF est un protocole de routage intra-AS de type :",
      r: ["État de liens", "Vecteur de distances", "Inter-AS", "Propriétaire Cisco"],
      e: "OSPF = Open Shortest Path First : état de liens. RIP et IGRP : vecteur de distances." },
    { s: "internet-routage", d: 121, q: "RIP est un protocole de routage intra-AS de type :",
      r: ["Vecteur de distances", "État de liens", "Inter-AS", "Hiérarchique à deux niveaux"],
      e: "RIP = Routing Information Protocol : vecteur de distances." },
    { s: "internet-routage", d: 121, q: "Quel protocole intra-AS est propriétaire Cisco ?",
      r: ["IGRP", "OSPF", "RIP", "BGP"],
      e: "IGRP (Interior Gateway Routing Protocol) : vecteur de distances, propriétaire Cisco." },
    { s: "internet-routage", d: 123, q: "Quel est le protocole de routage inter-AS de l'Internet ?",
      r: ["BGP", "OSPF", "RIP", "DHCP"],
      e: "BGP : Border Gateway Protocol." },
    { s: "internet-routage", d: 123, q: "Quel est le rôle d'eBGP ?",
      r: ["Obtenir les informations d'accessibilité des autres AS", "Propager les infos d'accessibilité aux routeurs internes", "Calculer les plus courts chemins dans l'AS", "Attribuer les numéros d'AS"],
      e: "eBGP (external) : obtenir les infos des autres AS. iBGP (internal) : les propager aux routeurs internes." },
    { s: "internet-routage", d: 123, q: "Quel est le rôle d'iBGP ?",
      r: ["Propager les infos d'accessibilité aux routeurs internes à l'AS", "Obtenir les infos d'accessibilité des autres AS", "Diffuser l'état des liens", "Remplacer OSPF"],
      e: "iBGP : propage aux routeurs internes les infos obtenues par eBGP." },
    { s: "internet-routage", d: 123, q: "Que signifie le fait que AS4 annonce à AS5 le sous-réseau s via eBGP ?",
      r: ["AS4 promet qu'il retransmettra les datagrammes destinés au sous-réseau s", "AS4 cède le sous-réseau s à AS5", "AS5 doit désormais router s en interne", "AS4 demande à AS5 l'adresse de s"],
      e: "Diapo 123 : AS4 promet qu'il retransmettra les datagrammes au sous-réseau s." },
    { s: "internet-routage", d: 124, q: "Si un sous-réseau X est accessible depuis plusieurs passerelles, comment l'AS choisit-il la passerelle ?",
      r: ["Le routage inter-AS (eBGP) décide selon les accords commerciaux et la règle de la patate chaude", "Le routage intra-AS choisit la passerelle la plus éloignée", "On en tire une au hasard", "On choisit toujours celle de plus petit numéro d'AS"],
      e: "Diapo 124 : eBGP décide selon les accords commerciaux et la règle de la patate chaude." },
    { s: "internet-routage", d: 124, q: "Une fois la passerelle vers X choisie, qui calcule le chemin jusqu'à elle ?",
      r: ["Le routage intra-AS, selon le plus court chemin", "eBGP", "Le routeur passerelle de l'AS voisin", "L'ICANN"],
      e: "Le routage intra-AS calcule le plus court chemin vers cette passerelle ; chaque routeur ajoute (X, I)." },
    { s: "internet-routage", d: 124, q: "Après le choix de la passerelle, quelle entrée chaque routeur de l'AS ajoute-t-il pour X ?",
      r: ["(X, I) avec I l'interface du prochain saut vers la passerelle choisie", "(X, numéro d'AS)", "(X, adresse IP de la destination finale)", "(X, 0.0.0.0/0)"],
      e: "Diapo 124 : chaque routeur ajoute (X, I), I = interface du prochain saut vers la passerelle." },
    { s: "internet-routage", d: 125, q: "Le choix du prochain AS (et donc de la passerelle) suit-il toujours le plus court chemin ?",
      r: ["Non, il est fait par le routage inter-AS, selon des politiques", "Oui, toujours", "Oui, grâce à Dijkstra appliqué à tout Internet", "Non, il est tiré au hasard"],
      e: "Diapo 125 : le routage inter-AS choisit le prochain AS → pas toujours le plus court chemin." },
    { s: "internet-routage", d: 125, q: "Où applique-t-on vraiment le plus court chemin dans le routage Internet ?",
      r: ["Dans le routage intra-AS, pour aller jusqu'à la passerelle", "Dans le routage inter-AS uniquement", "Nulle part", "Dans BGP pour choisir le prochain AS"],
      e: "Diapo 125 : la route vers la passerelle est choisie par le routage intra-AS, selon le plus court chemin." }
  ]
});
