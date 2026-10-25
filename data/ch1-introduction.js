/* =====================================================================
   Chapitre 1 — Introduction : rappels & vocabulaire  (CM1, diapos 11 à 31)
   ---------------------------------------------------------------------
   Format d'une question :
     { s: "id-section", d: n°diapo, q: "question", r: [ "BONNE réponse", "fausse", "fausse", "fausse" ], e: "explication" }
   ⚠️ La 1re réponse de r est TOUJOURS la bonne : le site mélange l'ordre tout seul.
   Dans le texte du cours, [d25] devient un bouton « diapo 25 » et [d24-27] « diapos 24–27 ».
   ===================================================================== */

COURS.chapitres.push({
  id: "intro",
  num: 1,
  titre: "Introduction : rappels & vocabulaire",
  court: "Introduction",
  couleur: "#64748b",
  source: "CM1 · diapos 11–31",
  resume: "Ce qu'est Internet, comment les paquets voyagent, d'où viennent les délais, et l'architecture en 5 couches.",

  sections: [
    {
      id: "exemple",
      titre: "Ce qui se passe quand tu ouvres une vidéo YouTube",
      diapos: [13],
      recherche: "comment fonctionne internet paquets routeurs",
      videos: [
        { t: "Internet : comment fonctionne le routage ?", u: "https://www.youtube.com/watch?v=s8_Nm-dtN8c", l: "FR" },
        { t: "How Data moves through the Internet", u: "https://www.youtube.com/watch?v=YJGGYKAV4pA", l: "EN" }
      ],
      html: `
<p>Le cours démarre avec un exemple concret [d13] : <b>Alice</b>, connectée au Wi-Fi de l'UCBL, tape l'adresse d'une vidéo YouTube.</p>
<ol>
  <li><b>Résolution DNS</b> : son ordinateur demande à un <i>serveur DNS</i> « quelle est l'adresse IP de www.youtube.com ? ». Réponse : <code>172.217.171.238</code>. (Un nom comme youtube.com, c'est pour les humains ; les machines ont besoin d'une adresse IP.)</li>
  <li><b>Requête / réponse HTTP</b> : son navigateur envoie au <i>serveur web</i> « envoie-moi cette page », et le serveur répond avec le contenu.</li>
</ol>
<p>Entre Alice et le serveur, les données passent par plein d'équipements. Le cours les appelle tous des <b>nœuds</b> :</p>
<table>
  <tr><th>Nœud</th><th>Rôle</th></tr>
  <tr><td><b>Terminaux</b> (serveur, station/PC, mobile)</td><td>Ce sont les « bouts » : ils <b>génèrent</b> ou <b>reçoivent</b> les données.</td></tr>
  <tr><td><b>Routeur</b></td><td>Fait passer les paquets d'un réseau à un autre.</td></tr>
  <tr><td><b>Commutateur</b> (switch)</td><td>Fait passer les paquets à l'intérieur d'un réseau local.</td></tr>
  <tr><td><b>Point d'accès Wi-Fi</b></td><td>Relie les appareils sans fil au réseau.</td></tr>
</table>
<div class="retenir"><b>Premières conclusions du CM</b>
<ul>
  <li>Énormément d'applications reposent sur les réseaux.</li>
  <li>On fonctionne souvent en <b>client / serveur</b>.</li>
  <li>Les nœuds n'ont pas tous le même rôle.</li>
  <li>Les nœuds doivent être <b>identifiables</b> → ce sont les <b>adresses IP</b>.</li>
  <li>Il faut un système pour <b>acheminer</b> les données d'un bout à l'autre.</li>
</ul></div>`
    },

    {
      id: "internet",
      titre: "Internet : nœuds, liens et protocoles",
      diapos: [15, 16, 17],
      recherche: "débit latence taux d'erreur réseau explication",
      videos: [
        { t: "C'est quoi le TCP/IP ?", u: "https://www.youtube.com/watch?v=_0thnFumSdA", l: "FR" },
        { t: "How Data moves through the Internet", u: "https://www.youtube.com/watch?v=YJGGYKAV4pA", l: "EN" }
      ],
      html: `
<p><b>Internet</b>, ce sont des millions de nœuds interconnectés [d15] qui exécutent des applications, produisent et acheminent des <b>paquets</b> (des petits morceaux de données), et forment ensemble une infrastructure de communication.</p>
<ul>
  <li><b>Terminaux</b> : <u>génèrent ou reçoivent</u> les paquets.</li>
  <li><b>Routeurs / commutateurs</b> : <u>acheminent</u> les paquets (ils ne sont ni le début ni la fin du voyage).</li>
</ul>

<h4>Les liens de communication [d16]</h4>
<p>Un <b>lien</b>, c'est le « câble » (ou l'onde) entre deux nœuds : fibre optique, cuivre, radio, satellite… Ils sont très hétérogènes. Un lien se décrit par <b>3 caractéristiques</b> :</p>
<table>
  <tr><th>Caractéristique</th><th>Ce que ça veut dire</th><th>Unité</th></tr>
  <tr><td><b>Capacité d'émission</b><br><small>= débit d'émission = débit physique</small></td><td>Combien de bits on peut <i>pousser</i> sur le lien par seconde.</td><td>Mb/s, Gb/s</td></tr>
  <tr><td><b>Délai de propagation</b><br><small>= latence</small></td><td>Le temps qu'un bit met à <i>voyager</i> d'un bout du lien à l'autre.</td><td>ms, µs</td></tr>
  <tr><td><b>Taux d'erreur binaire</b></td><td>La proportion de bits qui arrivent abîmés (un 0 devenu 1…).</td><td>%</td></tr>
</table>
<div class="analogie"><b>Analogie autoroute</b> : la <i>capacité</i>, c'est le nombre de voies (combien de voitures entrent par seconde) ; le <i>délai de propagation</i>, c'est le temps de trajet d'une voiture d'un péage à l'autre. Une autoroute très large peut quand même être très longue !</div>

<h4>Les protocoles [d17]</h4>
<p>Un <b>protocole</b> = un ensemble de règles qui contrôle l'émission et la réception des messages. Exemples : <b>IP, TCP, HTTP, FTP</b>.</p>
<p>Internet est « <b>le réseau des réseaux</b> » : une interconnexion de multiples réseaux (réseaux d'entreprise, de FAI = Fournisseurs d'Accès Internet…), organisés selon une <b>hiérarchie souple</b>. On distingue l'<b>Internet public</b> des <b>intranets privés</b> (réseau interne d'une entreprise).</p>
<div class="piege"><b>Piège QCM</b> : capacité (Mb/s) et délai de propagation (ms) n'ont <u>rien à voir</u> : l'un est un débit, l'autre une durée.</div>`
    },

    {
      id: "commutation",
      titre: "Commutation de paquets & effet pipeline",
      diapos: [18, 19, 20, 21],
      recherche: "commutation de paquets store and forward explication",
      videos: [
        { t: "Packet Switching Explained: How the Internet Really Moves Data", u: "https://www.youtube.com/watch?v=HUlBLKJIhW0", l: "EN" },
        { t: "La commutation de paquets (short)", u: "https://www.youtube.com/shorts/KzYI8Sui468", l: "FR" }
      ],
      html: `
<h4>Le principe [d18]</h4>
<p>Internet fonctionne en <b>commutation de paquets</b> :</p>
<ul>
  <li>Les messages des applications sont <b>découpés (fragmentés) en paquets</b>.</li>
  <li>Les paquets <b>se partagent les ressources à tour de rôle</b> : quand un paquet est émis, il utilise <b>toute la capacité</b> du lien. Il n'y a <b>aucune réservation</b> à l'avance.</li>
  <li>Si un lien est <b>congestionné</b> (trop de trafic), les paquets attendent dans un <b>buffer</b> (une file d'attente en mémoire) → délais en plus.</li>
  <li>Internet fait « de son mieux » mais <b>ne garantit rien</b> : c'est le <b>« best effort »</b>.</li>
</ul>

<h4>Multiplexage statistique [d19]</h4>
<p>Si A et B envoient vers C par un lien partagé, leurs paquets passent <b>dans un ordre irrégulier</b>, selon qui a quelque chose à envoyer à ce moment-là. Les ressources sont partagées <b>à la demande</b> : c'est le <b>multiplexage statistique</b>. (Le contraire serait de donner à chacun un créneau fixe, même s'il n'a rien à envoyer.)</p>

<h4>Les routeurs : « store-and-forward » [d20]</h4>
<ul>
  <li>Un routeur = un <b>commutateur de paquets</b>, avec plusieurs ports d'entrée et de sortie.</li>
  <li><b>En entrée</b> : mode <b>store-and-forward</b> (« stocker puis retransmettre ») → un paquet doit être <b>entièrement reçu</b> avant d'être réémis vers le nœud suivant.</li>
  <li><b>En sortie</b> : si le port est occupé par un autre paquet, le paquet <b>attend dans un buffer</b>.</li>
</ul>

<h4>Pourquoi découper en paquets ? L'exemple chiffré [d21]</h4>
<p>Une source envoie un message à une destination en traversant <b>3 liens</b> (donc 2 routeurs). Message <b>L = 7,5 Mbits</b>, chaque lien a une capacité <b>C = 1,5 Mb/s</b>, pas de congestion (et on néglige la propagation).</p>
<div class="exemple"><b>Sans fragmentation</b> : envoyer le message sur un lien prend L/C = 7,5 / 1,5 = <b>5 s</b>. À cause du store-and-forward, chaque routeur doit tout recevoir avant de renvoyer : 3 liens × 5 s → <b>T = 3L/C = 15 s</b>.</div>
<div class="exemple"><b>Avec 5 fragments</b> (chacun fait L/5 = 1,5 Mbits → 1 s par lien) : pendant que le routeur 1 envoie le fragment 1, la source envoie déjà le fragment 2. Tout se chevauche ! Le dernier fragment quitte la source à 5 s, puis il lui reste 2 liens → 5 + 2 = <b>7 s</b>. Formule du CM : <b>T = 7L/(5C) = 7 s</b>.</div>
<p>C'est l'<b>effet « pipeline »</b> : découper accélère le transfert car les liens travaillent en parallèle.</p>
<div class="bonus"><b>Formule générale (pour t'entraîner)</b> : avec N liens et P paquets de même taille, T = (N + P − 1) × L/(P·C). Vérifie : N = 3, P = 5 → 7 × L/(5C) ✔.</div>
<div class="piege"><b>« Toujours mieux ? »</b> Non : chaque paquet porte un <b>en-tête</b>. Avec des paquets minuscules, on transmet surtout des en-têtes et les routeurs ont plus de travail. Il y a donc un compromis.</div>`
    },

    {
      id: "delais",
      titre: "Délais, pertes et RTT",
      diapos: [23, 24, 25, 26, 27],
      recherche: "délai de transmission délai de propagation délai d'attente",
      videos: [
        { t: "1.4 — Delay, Loss, and Throughput", u: "https://www.youtube.com/watch?v=qL7ZGeSoQRM", l: "EN" },
        { t: "Transmission Delay & Propagation Delay", u: "https://www.youtube.com/watch?v=5oS0ET0wQgg", l: "EN" }
      ],
      html: `
<p>Un paquet part d'une source, traverse des liens et des routeurs et arrive à destination [d23]. En route, il peut :</p>
<ul>
  <li><b>prendre du retard</b> (plusieurs types de délais, voir plus bas) — plus les buffers se remplissent, plus l'attente s'allonge ;</li>
  <li><b>être perdu</b> : soit parce qu'un <b>buffer est plein</b> (dépassement de capacité), soit à cause d'une <b>erreur de transmission</b> sur un lien (surtout en radio / sans-fil) ;</li>
  <li><b>arriver trop tard</b> (inutile pour une visio, par exemple).</li>
</ul>

<h4>Les 4 délais à chaque nœud [d24] [d25]</h4>
<table>
  <tr><th>Délai</th><th>C'est quoi ?</th><th>Ordre</th></tr>
  <tr><td><b>1. Traitement</b></td><td>Le routeur lit l'en-tête, vérifie les erreurs de bits, choisit l'interface de sortie.</td><td>~ ns</td></tr>
  <tr><td><b>2. Attente</b></td><td>Le paquet attend si le lien de sortie est occupé. Dépend du nombre de paquets déjà dans la file → <b>très variable</b>.</td><td>[0, x] ms</td></tr>
  <tr><td><b>3. Émission</b></td><td>Le temps pour « poser » tous les bits du paquet sur le lien : <b>L / C</b> (taille du paquet / capacité du lien).</td><td>~ [µs, ms]</td></tr>
  <tr><td><b>4. Propa&shy;gation</b></td><td>Le temps qu'un bit met à voyager le long du lien : <b>d / v</b> (longueur du lien / vitesse de propagation).</td><td>~ [µs, ms]</td></tr>
</table>
<div class="piege"><b>Piège classique</b> : <b>C</b> (capacité, en bits/s) et <b>v</b> (vitesse de propagation, en m/s) sont des quantités <b>différentes</b> !!! L'émission dépend de la <i>taille du paquet</i>, la propagation de la <i>longueur du câble</i>. Un gros paquet sur un câble court : émission longue, propagation courte.</div>
<div class="analogie"><b>Analogie du convoi</b> : 10 voitures passent un péage une par une (émission : dépend du nombre de voitures et de la vitesse du péage), puis roulent 100 km (propagation : dépend de la distance et de la vitesse sur la route).</div>
<p><small>Remarque du CM : si le lien est partagé, il faut aussi compter les surcoûts de la couche Liaison dans l'émission (ici on suppose une couche Liaison « parfaite »).</small></p>

<div class="exemple"><b>Exemple chiffré</b> : paquet de 1 500 octets = 12 000 bits, lien de 100 Mb/s → émission = 12 000 / 100 000 000 = <b>120 µs</b>. Câble de 2 000 km, v = 2×10<sup>8</sup> m/s → propagation = 2×10<sup>6</sup> / 2×10<sup>8</sup> = <b>10 ms</b>.</div>

<h4>Délai de bout-en-bout [d26]</h4>
<p>Le schéma du CM montre un paquet qui passe de l'expéditeur à un intermédiaire puis au destinataire. Sur chaque lien : <b>émission + propagation</b>, et dans l'intermédiaire : éventuellement de l'<b>attente</b>. La somme = le <b>délai de bout-en-bout d'un paquet = temps de transfert</b> (le temps de traitement est négligé sur le schéma).</p>

<h4>RTT [d27]</h4>
<p><b>RTT = Round Trip Time</b> (temps aller-retour) : le temps pour qu'un paquet atteigne sa destination <b>et revienne</b> à la source. Il comprend traitement, attente, émission et propagation. On le mesure simplement avec la commande <code>ping</code>.</p>
<div class="retenir"><b>À retenir</b> : traitement ~ns · attente variable · émission = L/C · propagation = d/v · RTT = aller + retour (ping).</div>`
    },

    {
      id: "couches",
      titre: "Architecture en couches & encapsulation",
      diapos: [29, 30, 31],
      recherche: "modèle TCP/IP 5 couches encapsulation",
      videos: [
        { t: "Comprendre facilement le modèle TCP/IP : encapsulation et désencapsulation", u: "https://www.youtube.com/watch?v=lap7XuqkwcU", l: "FR" },
        { t: "Les modèles OSI & TCP/IP", u: "https://www.youtube.com/watch?v=L1pFhn1Uxx4", l: "FR" },
        { t: "Protocol Layering — Intro to Computer Networks", u: "https://www.youtube.com/watch?v=ayRmLwXQtOs", l: "EN" }
      ],
      html: `
<h4>La pile Internet : 5 couches [d29]</h4>
<p>Internet est organisé en <b>5 couches</b> (le modèle OSI, lui, en a 7). Elles sont implantées en logiciel, en matériel, ou les deux. Chaque couche a un nom de « paquet » différent — <b>à connaître par cœur</b> :</p>
<table class="pile">
  <tr><th>N°</th><th>Couche</th><th>Nom du paquet</th></tr>
  <tr><td>5</td><td><b>Application</b></td><td><b>Message</b><br><small>= H5 + données de l'appli</small></td></tr>
  <tr><td>4</td><td><b>Transport</b></td><td><b>Segment</b><br><small>= H4 + message</small></td></tr>
  <tr><td>3</td><td><b>Réseau</b></td><td><b>Datagramme</b><br><small>= H3 + segment</small></td></tr>
  <tr><td>2</td><td><b>Liaison</b></td><td><b>Trame</b><br><small>= H2 + datagramme</small></td></tr>
  <tr><td>1</td><td><b>Physique</b></td><td>des <b>bits</b> sur le support<br><small>(la trame est émise bit à bit)</small></td></tr>
</table>
<p class="mnemo">Moyen mnémotechnique (de 5 à 2) : <b>M</b>on <b>S</b>uper <b>D</b>atagramme <b>T</b>rame → Message, Segment, Datagramme, Trame.</p>

<h4>L'encapsulation</h4>
<p>Le paquet de la couche n est <b>encapsulé</b> (mis à l'intérieur) dans le paquet de la couche n−1 :</p>
<p class="formule">[Paquet couche n−1] = [En-tête couche n−1] + [Paquet couche n]</p>
<div class="analogie"><b>Analogie des enveloppes</b> : ta lettre (message) est mise dans une enveloppe avec le n° de bureau (segment), elle-même dans une enveloppe avec l'adresse postale (datagramme), elle-même dans le sac du facteur (trame). Chaque destinataire ouvre l'enveloppe qui le concerne.</div>
<div class="exemple"><b>Exemple du CM</b> (Dx = données de la couche x, Hx = en-tête de la couche x) : <b>D3 = H4 + D4</b>, et comme D4 = H5 + D5, on a aussi <b>D3 = H4 + H5 + D5</b>. Les données de la couche 3, c'est tout le segment (en-tête transport compris).</div>

<h4>Pourquoi des couches ? [d30]</h4>
<ul>
  <li>Chaque couche a <b>une fonction</b>, chaque protocole appartient à <b>une couche</b>. L'ensemble des couches = la <b>pile protocolaire</b>.</li>
  <li>La couche <b>n−1 rend un service à la couche n</b> (contrôle d'erreur, acheminement, accès au médium, fragmentation/reconstitution…).</li>
</ul>
<table>
  <tr><th>Avantages</th><th>Inconvénients</th></tr>
  <tr><td>• On identifie précisément un protocole<br>• <b>Modularité</b> : on peut changer l'implémentation d'une couche tant qu'elle rend les mêmes services à la couche n+1</td>
      <td>• <b>Redondance</b> de fonctions (ex. la détection d'erreur est faite à plusieurs couches)<br>• Impossible d'échanger directement avec les couches n±2 (pas de « cross-layer »)<br>• Il faut traverser <b>toutes</b> les couches</td></tr>
</table>

<h4>Quel équipement « monte » jusqu'à quelle couche ? [d31]</h4>
<table>
  <tr><th>Équipement</th><th>Couches implémentées</th></tr>
  <tr><td><b>Terminal</b> (PC, serveur)</td><td>1 → 5 (toutes)</td></tr>
  <tr><td><b>Routeur</b></td><td>1, 2, 3 (Physique, Liaison, Réseau)</td></tr>
  <tr><td><b>Commutateur</b></td><td>1, 2 (Physique, Liaison)</td></tr>
</table>
<div class="retenir"><b>Proche-en-proche vs bout-en-bout</b><br>
• Couches <b>1, 2 et 3</b> = de <b>proche-en-proche</b> : elles agissent à chaque saut, entre deux équipements voisins.<br>
• Couches <b>4 et 5</b> = de <b>bout-en-bout</b> : elles n'existent qu'aux deux extrémités (les terminaux), elles « se parlent » par-dessus tout le réseau.</div>`
    }
  ],

  questions: [
    /* --- exemple --- */
    { s: "exemple", d: 13, q: "Dans l'exemple d'Alice qui ouvre une vidéo YouTube, quelle est la toute première étape réseau ?",
      r: ["Une résolution DNS pour obtenir l'adresse IP du serveur", "Une requête HTTP vers le serveur web", "L'envoi d'un ACK au serveur web", "Le calcul d'une table de routage par le PC d'Alice"],
      e: "Le PC ne connaît que le nom (www.youtube.com). Il doit d'abord demander l'adresse IP correspondante au serveur DNS, puis il peut envoyer la requête HTTP." },
    { s: "exemple", d: 13, q: "Pourquoi les nœuds d'un réseau doivent-ils avoir une adresse IP ?",
      r: ["Pour être identifiables, afin qu'on puisse leur acheminer des données", "Pour chiffrer les communications", "Pour mesurer le débit des liens", "Pour choisir le protocole de transport"],
      e: "Conclusion de la diapo 13 : les nœuds doivent être identifiables → ce sont les adresses IP." },

    /* --- internet --- */
    { s: "internet", d: 15, q: "Dans Internet, quel est le rôle des terminaux ?",
      r: ["Générer ou recevoir les paquets", "Acheminer les paquets entre réseaux", "Calculer les routes pour les routeurs", "Relier les AS entre eux"],
      e: "Terminaux = les extrémités (serveurs, PC, mobiles) qui produisent ou consomment les paquets. Ce sont les routeurs/commutateurs qui acheminent." },
    { s: "internet", d: 15, q: "Quel est le rôle des routeurs et des commutateurs ?",
      r: ["Acheminer les paquets", "Générer les paquets des applications", "Afficher les pages web", "Attribuer les noms de domaine"],
      e: "Diapo 15 : routeurs / commutateurs = acheminer les paquets ; terminaux = les générer ou les recevoir." },
    { s: "internet", d: 16, q: "Dans quelle unité exprime-t-on la capacité d'émission d'un lien ?",
      r: ["En Mb/s ou Gb/s", "En ms ou µs", "En %", "En mètres"],
      e: "La capacité (= débit d'émission = débit physique) est un nombre de bits par seconde. Les ms/µs sont pour le délai de propagation, les % pour le taux d'erreur binaire." },
    { s: "internet", d: 16, q: "Le délai de propagation (latence) d'un lien s'exprime typiquement en :",
      r: ["ms ou µs", "Mb/s ou Gb/s", "%", "octets"],
      e: "C'est une durée : le temps pour qu'un bit traverse le lien." },
    { s: "internet", d: 16, q: "Lequel de ces éléments N'EST PAS une des 3 caractéristiques majeures d'un lien citées dans le CM ?",
      r: ["Le nombre de routeurs connectés", "La capacité d'émission", "Le délai de propagation", "Le taux d'erreur binaire"],
      e: "Les 3 caractéristiques : capacité d'émission (débit), délai de propagation (latence), taux d'erreur binaire." },
    { s: "internet", d: 17, q: "Pourquoi dit-on qu'Internet est « le réseau des réseaux » ?",
      r: ["Car c'est une interconnexion de multiples réseaux, avec une hiérarchie souple", "Car il n'y a qu'un seul grand réseau géré par l'ICANN", "Car tous les nœuds sont reliés directement entre eux", "Car il utilise uniquement des liens en fibre"],
      e: "Diapo 17 : Internet interconnecte de multiples réseaux (FAI, entreprises…) avec une hiérarchie souple." },
    { s: "internet", d: 17, q: "Parmi ces exemples, lequel est cité comme protocole dans le CM ?",
      r: ["TCP", "Ethernet RJ45", "Wi-Fi eduroam", "Fibre optique"],
      e: "Exemples de protocoles donnés : IP, TCP, HTTP, FTP. Un câble ou un nom de réseau n'est pas un protocole." },

    /* --- commutation --- */
    { s: "commutation", d: 18, q: "En commutation de paquets, lorsqu'un paquet est émis sur un lien :",
      r: ["Il utilise toute la capacité du lien, sans réservation préalable", "Il utilise une fraction réservée à l'avance de la capacité", "Il attend que la destination réserve un circuit", "Il est découpé bit par bit entre toutes les sources"],
      e: "Les paquets se partagent les ressources à tour de rôle : lors de son émission, un paquet prend toute la capacité du lien. Aucune réservation." },
    { s: "commutation", d: 18, q: "Que signifie « best effort » pour Internet ?",
      r: ["Le réseau fait de son mieux mais ne garantit aucun service", "Le réseau garantit un débit minimum à chaque flux", "Les paquets prioritaires passent toujours en premier", "Les paquets perdus sont toujours retransmis par les routeurs"],
      e: "Internet fait de son mieux, sans aucune garantie (ni débit, ni délai, ni absence de perte)." },
    { s: "commutation", d: 18, q: "Que se passe-t-il quand un paquet doit emprunter un lien congestionné ?",
      r: ["Il attend dans un buffer, ce qui ajoute du délai", "Il est automatiquement renvoyé à la source", "Il prend un circuit réservé de secours", "Il est compressé pour passer plus vite"],
      e: "Lien congestionné → attente dans un buffer → délais supplémentaires (et perte si le buffer déborde)." },
    { s: "commutation", d: 19, q: "Le partage à la demande des ressources d'un lien entre les paquets de plusieurs sources s'appelle :",
      r: ["Le multiplexage statistique", "Le store-and-forward", "Le routage hiérarchique", "La fenêtre d'anticipation"],
      e: "Diapo 19 : la séquence des paquets n'a pas de motif régulier, les ressources sont partagées à la demande = multiplexage statistique." },
    { s: "commutation", d: 20, q: "Que signifie le mode « store-and-forward » d'un routeur ?",
      r: ["Un paquet doit être entièrement reçu avant d'être réémis vers le nœud suivant", "Le routeur réémet chaque bit dès qu'il le reçoit", "Le routeur stocke les paquets jusqu'à ce que la destination les demande", "Le routeur garde une copie de chaque paquet pour la retransmission"],
      e: "Store-and-forward = stocker (tout le paquet) puis retransmettre." },
    { s: "commutation", d: 21, q: "Message L = 7,5 Mbits, 3 liens de C = 1,5 Mb/s, routeurs store-and-forward, sans fragmentation. Temps de transfert ?",
      r: ["15 s", "5 s", "7 s", "22,5 s"],
      e: "Chaque lien prend L/C = 5 s et le message entier doit être reçu avant d'être réémis : 3 × 5 = 15 s (= 3L/C)." },
    { s: "commutation", d: 21, q: "Même message (L = 7,5 Mbits, 3 liens à 1,5 Mb/s) découpé en 5 fragments égaux. Temps de transfert ?",
      r: ["7 s", "15 s", "3 s", "5 s"],
      e: "Chaque fragment met 1 s par lien. Le 5e fragment quitte la source à 5 s, il lui reste 2 liens : 7 s. Formule du CM : 7L/(5C)." },
    { s: "commutation", d: 21, q: "Pourquoi fragmenter un message en paquets peut-il accélérer son transfert ?",
      r: ["Grâce à l'effet pipeline : les différents liens transmettent des fragments en parallèle", "Parce que les petits paquets se propagent plus vite dans le câble", "Parce que les routeurs ne font plus de store-and-forward", "Parce que les en-têtes sont supprimés"],
      e: "Pendant qu'un routeur envoie le fragment 1, la source envoie déjà le fragment 2 : les liens travaillent en même temps (effet pipeline)." },
    { s: "commutation", d: 21, q: "Découper en paquets de plus en plus petits est-il toujours plus efficace ?",
      r: ["Non, car chaque paquet ajoute un en-tête (surcoût) et du traitement", "Oui, le temps de transfert tend toujours vers 0", "Oui, car la propagation diminue avec la taille", "Non, car les routeurs refusent les petits paquets"],
      e: "La diapo pose la question « Toujours mieux ? » : non, chaque paquet porte un en-tête, donc des paquets trop petits gaspillent la capacité." },

    /* --- delais --- */
    { s: "delais", d: 24, q: "Quels sont les 4 types de délais subis par un paquet à un nœud ?",
      r: ["Traitement, attente, émission, propagation", "Traitement, routage, chiffrement, propagation", "Émission, réception, ACK, timeout", "Attente, congestion, RTT, ping"],
      e: "Diapo 24 : (1) traitement, (2) attente avant émission, (3) émission, (4) propagation." },
    { s: "delais", d: 25, q: "Quel délai dépend du nombre de paquets déjà présents dans la file du routeur ?",
      r: ["Le délai d'attente", "Le délai de propagation", "Le délai de traitement", "Le délai d'émission"],
      e: "L'attente dépend de l'occupation du lien et du nombre de paquets déjà dans la file : très variable, de 0 à x ms." },
    { s: "delais", d: 25, q: "Le délai d'émission d'un paquet de taille L sur un lien de capacité C vaut :",
      r: ["L / C", "d / v", "C / L", "2 × d / v"],
      e: "Émission = temps pour envoyer tous les bits du paquet = L/C. (d/v, c'est la propagation.)" },
    { s: "delais", d: 25, q: "Le délai de propagation sur un lien de longueur d, avec une vitesse de propagation v, vaut :",
      r: ["d / v", "L / C", "v / d", "L / v"],
      e: "Propagation = temps qu'un bit met à parcourir la longueur du lien = d/v." },
    { s: "delais", d: 25, q: "Quel est l'ordre de grandeur du délai de traitement dans un routeur ?",
      r: ["Quelques nanosecondes", "Quelques secondes", "Toujours plusieurs millisecondes", "Il est nul par définition"],
      e: "Lecture d'en-tête, contrôle d'erreur, choix de l'interface : ~ns." },
    { s: "delais", d: 25, q: "Parmi ces affirmations sur C (capacité) et v (vitesse de propagation), laquelle est vraie ?",
      r: ["Ce sont des quantités différentes : C en bits/s, v en m/s", "C et v sont la même chose exprimée dans deux unités", "Augmenter C réduit le délai de propagation", "v dépend de la taille du paquet"],
      e: "Le CM insiste : C et v sont des quantités différentes !!! Augmenter la capacité réduit l'émission, pas la propagation." },
    { s: "delais", d: 25, q: "On remplace un lien à 10 Mb/s par un lien à 1 Gb/s de même longueur. Quel délai diminue ?",
      r: ["Le délai d'émission", "Le délai de propagation", "Le délai de traitement", "Aucun délai ne change"],
      e: "Émission = L/C : C augmente, donc l'émission diminue. La propagation (d/v) ne dépend pas de C." },
    { s: "delais", d: 25, q: "Paquet de 12 000 bits sur un lien de 100 Mb/s. Délai d'émission ?",
      r: ["120 µs", "1,2 ms", "12 µs", "8,3 ms"],
      e: "L/C = 12 000 / 100 000 000 = 0,00012 s = 120 µs." },
    { s: "delais", d: 23, q: "Parmi ces causes, laquelle provoque la perte d'un paquet selon le CM ?",
      r: ["Un buffer plein dans un routeur", "Un délai de propagation trop long", "Un RTT élevé", "Une adresse IP dynamique"],
      e: "Pertes : dépassement de capacité des buffers (buffers pleins), ou erreur de transmission sur un lien (surtout radio)." },
    { s: "delais", d: 23, q: "Sur quel type de lien les erreurs de transmission sont-elles surtout fréquentes ?",
      r: ["Les liens radio / sans-fil", "La fibre optique", "Les liens internes d'un routeur", "Les liens entre AS"],
      e: "Diapo 23 : erreurs lors de la transmission, « surtout sur les liens radio / sans-fil »." },
    { s: "delais", d: 26, q: "Le délai de bout-en-bout d'un paquet est aussi appelé :",
      r: ["Le temps de transfert", "Le RTT", "Le timeout", "Le TTL"],
      e: "Diapo 26 : délai de bout-en-bout d'un paquet = temps de transfert. Le RTT, lui, est un aller-retour." },
    { s: "delais", d: 27, q: "Qu'est-ce que le RTT ?",
      r: ["Le délai pour qu'un paquet atteigne sa destination et revienne à la source", "Le délai de propagation sur un seul lien", "Le temps de traitement dans le routeur", "Le temps maximum de vie d'un paquet"],
      e: "RTT = Round Trip Time = temps aller-retour. Il inclut traitement, attente, émission, propagation." },
    { s: "delais", d: 27, q: "Quelle commande permet de mesurer simplement le RTT ?",
      r: ["ping", "nc", "ipconfig", "dig"],
      e: "Diapo 27 : mesure simple avec la commande ping." },

    /* --- couches --- */
    { s: "couches", d: 29, q: "Combien de couches compte la pile protocolaire Internet présentée en CM ?",
      r: ["5", "7", "4", "3"],
      e: "5 couches pour Internet (Application, Transport, Réseau, Liaison, Physique) ; 7 dans le modèle OSI." },
    { s: "couches", d: 29, q: "Comment appelle-t-on le paquet de la couche Transport ?",
      r: ["Un segment", "Un datagramme", "Une trame", "Un message"],
      e: "Message (5, application) → Segment (4, transport) → Datagramme (3, réseau) → Trame (2, liaison)." },
    { s: "couches", d: 29, q: "Comment appelle-t-on le paquet de la couche Réseau ?",
      r: ["Un datagramme", "Un segment", "Une trame", "Un message"],
      e: "H3 + segment = datagramme." },
    { s: "couches", d: 29, q: "Comment appelle-t-on le paquet de la couche Liaison ?",
      r: ["Une trame", "Un datagramme", "Un segment", "Un bit"],
      e: "H2 + datagramme = trame." },
    { s: "couches", d: 29, q: "Avec Dx = données de la couche x et Hx = en-tête de la couche x, quelle égalité est correcte ?",
      r: ["D3 = H4 + H5 + D5", "D3 = H3 + D4", "D4 = H3 + D3", "D5 = H4 + D4"],
      e: "Le paquet de couche n est encapsulé dans celui de la couche n−1 : D3 = H4 + D4 et D4 = H5 + D5, donc D3 = H4 + H5 + D5." },
    { s: "couches", d: 29, q: "Le principe d'encapsulation signifie que :",
      r: ["Le paquet de la couche n devient les données du paquet de la couche n−1", "Le paquet de la couche n−1 est inséré dans celui de la couche n", "Chaque couche supprime l'en-tête des couches supérieures", "Toutes les couches partagent un en-tête commun"],
      e: "[Paquet couche n−1] = [En-tête couche n−1] + [Paquet couche n]." },
    { s: "couches", d: 30, q: "Dans une architecture en couches, la couche n−1 :",
      r: ["Rend un service à la couche n", "Rend un service à la couche n−2", "Communique directement avec la couche n+2", "Remplace la couche n en cas de panne"],
      e: "Diapo 30 : la couche n−1 assure un service à la couche n." },
    { s: "couches", d: 30, q: "Lequel de ces points est un INCONVÉNIENT de l'architecture en couches ?",
      r: ["La redondance de fonctions, comme la détection d'erreur à plusieurs couches", "La modularité de l'implémentation", "L'identification précise d'un protocole", "Le fait de pouvoir changer une couche sans toucher aux autres"],
      e: "Inconvénients : redondance de fonctions, pas d'échange avec les couches n±2 (cross-layer), obligation de traverser toutes les couches. Les 3 autres réponses sont des avantages." },
    { s: "couches", d: 30, q: "Qu'appelle-t-on le « cross-layer » dans le CM ?",
      r: ["Échanger avec des couches non adjacentes (n±2), ce que l'architecture en couches empêche", "Le passage d'un datagramme d'un AS à un autre", "Le fait qu'un routeur implémente 3 couches", "Le multiplexage de plusieurs applications"],
      e: "L'architecture en couches rend impossible l'échange avec les couches n±2 : c'est l'inconvénient « cross-layer »." },
    { s: "couches", d: 31, q: "Jusqu'à quelle couche « monte » un routeur ?",
      r: ["La couche 3 (Réseau)", "La couche 2 (Liaison)", "La couche 4 (Transport)", "La couche 5 (Application)"],
      e: "Diapo 31 : le routeur traite H1, H2 et H3. Le commutateur s'arrête à la couche 2." },
    { s: "couches", d: 31, q: "Jusqu'à quelle couche « monte » un commutateur (switch) ?",
      r: ["La couche 2 (Liaison)", "La couche 3 (Réseau)", "La couche 1 seulement", "La couche 4 (Transport)"],
      e: "Le commutateur implémente Physique et Liaison (couches 1 et 2)." },
    { s: "couches", d: 31, q: "Quelles couches sont dites « de bout-en-bout » ?",
      r: ["Les couches 4 et 5", "Les couches 1, 2 et 3", "Les couches 3 et 4", "Uniquement la couche 1"],
      e: "Transport (4) et Application (5) n'existent qu'aux extrémités : bout-en-bout. Les couches 1, 2, 3 sont de proche-en-proche." },
    { s: "couches", d: 31, q: "Quelles couches sont dites « de proche-en-proche » ?",
      r: ["Les couches 1, 2 et 3", "Les couches 4 et 5", "Les couches 2 et 4", "Toutes les couches"],
      e: "Elles agissent à chaque saut, entre équipements voisins : Physique, Liaison, Réseau." }
  ]
});
