/* =====================================================================
   Chapitre 2 — Couche Application : principes  (CM1, diapos 32 à 41)
   ⚠️ La 1re réponse de r est TOUJOURS la bonne (le site mélange l'ordre).
   ===================================================================== */

COURS.chapitres.push({
  id: "application",
  num: 2,
  titre: "Couche Application : principes",
  court: "Application",
  couleur: "#8b5cf6",
  source: "CM1 · diapos 32–41",
  resume: "Client-serveur, processus, sockets, numéros de port, et les applications « réseau » comme DHCP et DNS.",

  sections: [
    {
      id: "apps",
      titre: "Applications et architecture client-serveur",
      diapos: [33, 34, 35],
      recherche: "architecture client serveur pair à pair explication",
      videos: [
        { t: "2.1 Principles of the Application Layer", u: "https://www.youtube.com/watch?v=abeupgK5z48", l: "EN" },
        { t: "Principles of Network Applications", u: "https://www.youtube.com/watch?v=CerPHJW_1QM", l: "EN" }
      ],
      html: `
<p>« Pas de réseaux sans applications » [d33]. Le CM distingue deux familles :</p>
<ul>
  <li><b>Applications « classiques »</b> : e-mail, accès à une machine distante, transfert de fichiers, Web, commerce électronique, messagerie instantanée, réseaux sociaux, visio, streaming, jeux en réseau…</li>
  <li><b>Applications « réseaux »</b> : celles qui permettent <i>au réseau lui-même</i> (et aux applis qui l'utilisent) de fonctionner — DHCP, DNS… (voir plus bas).</li>
</ul>

<h4>Où tournent les applications ? [d34]</h4>
<ul>
  <li>Une application = des <b>programmes</b> qui s'exécutent sur des <b>terminaux distants</b> et <b>communiquent par le réseau</b>.</li>
  <li>Il y a <b>peu de programmes dans le cœur du réseau</b> (les routeurs) : pas d'utilisateurs là-bas, et la philosophie d'Internet est de <b>« conserver le cœur simple »</b>. L'intelligence est aux extrémités.</li>
  <li>Architectures possibles : <b>client-serveur</b>, <b>P2P</b> (pair-à-pair), <b>hybride</b>.</li>
</ul>

<h4>L'architecture client-serveur [d35]</h4>
<table>
  <tr><th>Le serveur</th><th>Les clients</th></tr>
  <tr><td>• <b>Toujours actif</b><br>• <b>Adresse IP permanente</b><br>• Souvent un cluster (grappe) de serveurs / un data center, pour tenir la charge (passage à l'échelle) et rester disponible</td>
      <td>• Communiquent <b>avec le serveur</b><br>• Activité <b>intermittente</b> (ils se connectent quand ils veulent)<br>• Adresse IP qui peut être <b>dynamique</b><br>• <b>Ne communiquent pas directement entre eux</b></td></tr>
</table>
<div class="piege"><b>Piège QCM</b> : dans le client-serveur, deux clients ne se parlent <u>jamais directement</u> — tout passe par le serveur. C'est justement ce qui change en P2P.</div>`
    },

    {
      id: "processus",
      titre: "Processus, sockets et numéros de port",
      diapos: [36, 37, 38],
      recherche: "socket port adresse IP processus explication",
      videos: [
        { t: "Comprendre les ports réseau — IP, ports et sockets", u: "https://www.youtube.com/watch?v=97ZjRo_uCho", l: "FR" },
        { t: "Qu'est-ce qu'un port en informatique ?", u: "https://www.youtube.com/watch?v=b6eQTDX2cZ8", l: "FR" }
      ],
      html: `
<h4>Processus [d36]</h4>
<p>Un <b>processus</b>, c'est un programme <i>en cours d'exécution</i> sur un nœud. Deux processus sur des nœuds différents communiquent en s'échangeant des <b>messages</b> (le message transporte les informations de l'application).</p>
<ul>
  <li><b>Processus client</b> : c'est lui qui <b>initie</b> la communication et sollicite le serveur.</li>
  <li><b>Processus serveur</b> : il <b>attend</b> d'être sollicité.</li>
</ul>

<h4>Sockets [d37]</h4>
<p>Chaque processus ouvre une <b>socket</b>. Une socket, c'est :</p>
<ul>
  <li>une <b>interface de communication</b> (une <b>API</b>) pour les applications distribuées ;</li>
  <li>la « <b>zone de départ et d'arrivée</b> » des messages : l'appli dépose ses messages dans la socket, et y récupère ceux qui arrivent.</li>
</ul>
<p>Côté application, le programmeur choisit les paramètres (paramètres de l'appli, <b>choix du protocole de transport</b>, taille du buffer…). Ensuite, les deux sockets sont « raccordées » grâce au protocole de transport choisi.</p>
<div class="analogie"><b>Analogie</b> : la socket, c'est la <b>porte</b> de la maison. Le processus (l'habitant) pose ses lettres derrière la porte ; tout ce qui se passe dehors (transport, réseau…) est géré par le <b>système d'exploitation</b>, pas par le développeur.</div>
<div class="retenir">Ce qui est au-dessus de la socket (le processus) est <b>contrôlé par le développeur</b> ; ce qui est en dessous (TCP avec ses buffers et variables) est <b>contrôlé par l'OS</b>.</div>

<h4>Comment identifier un processus sur une machine distante ? [d38]</h4>
<p>L'adresse IP <b>ne suffit pas</b> : plusieurs processus peuvent tourner sur la même machine (navigateur, Discord, Spotify…). L'identifiant d'un processus = <b>adresse IP + numéro de port</b>.</p>
<div class="analogie"><b>Analogie</b> : l'adresse IP = l'adresse de l'immeuble ; le numéro de port = le numéro de l'appartement.</div>
<ul>
  <li>Exemples : serveur <b>HTTP → port 80</b>, serveur <b>e-mail → port 25</b>.</li>
  <li>Exemple du CM : le serveur HTTP de www.lequipe.fr a l'adresse <code>160.92.167.203</code>, port <code>80</code>. La commande <code>nc -z www.lequipe.fr 1-65535</code> teste les ports ouverts : 80 (http) et 443 (https) répondent.</li>
</ul>`
    },

    {
      id: "protocoles-app",
      titre: "Protocoles applicatifs, DHCP, DNS",
      diapos: [39, 40, 41],
      recherche: "DHCP DNS explication débutant",
      videos: [
        { t: "Comprendre le DHCP en 3 minutes", u: "https://www.youtube.com/watch?v=yH9UvkeAz-I", l: "FR" },
        { t: "Comprendre le DNS en 5 minutes", u: "https://www.youtube.com/watch?v=qzWdzAvfBoo", l: "FR" }
      ],
      html: `
<h4>Ce que définit un protocole applicatif [d39]</h4>
<ul>
  <li>les <b>types</b> de messages échangés (requête, réponse…) ;</li>
  <li>la <b>syntaxe</b> des messages (quels champs, comment ils sont écrits) ;</li>
  <li>la <b>signification</b> (sémantique) des champs ;</li>
  <li>les <b>règles</b> d'envoi et de réception (quand et comment envoyer/répondre).</li>
</ul>

<h4>Les applications « réseaux » [d40]</h4>
<table>
  <tr><th>Sigle</th><th>Nom complet</th><th>À quoi ça sert</th></tr>
  <tr><td><b>DHCP</b></td><td>Dynamic Host Configuration Protocol</td><td>Donner automatiquement une configuration réseau à une machine (adresse IP…)</td></tr>
  <tr><td><b>DNS</b></td><td>Domain Name System</td><td>Traduire un nom (youtube.com) en adresse IP</td></tr>
  <tr><td><b>NTP</b></td><td>Network Time Protocol</td><td>Synchroniser l'heure des machines</td></tr>
  <tr><td><b>SNMP</b></td><td>Simple Network Management Protocol</td><td>Superviser / gérer les équipements réseau</td></tr>
</table>

<h4>Exemple 2 : Alice se connecte à eduroam [d41]</h4>
<ol>
  <li>Alice se connecte au Wi-Fi <b>eduroam</b>.</li>
  <li>Le <b>serveur DHCP</b> lui donne : son <b>adresse IP</b>, l'<b>adresse IP de la passerelle</b> (le routeur de sortie de l'UCBL) et l'<b>adresse IP du serveur DNS local</b>.</li>
  <li>Alice fait une <b>résolution DNS</b> → 172.217.171.238.</li>
  <li>Alice envoie une <b>requête HTTP</b>, le serveur web renvoie une <b>réponse HTTP</b>.</li>
</ol>
<div class="retenir">Ordre logique quand on arrive sur un réseau : <b>DHCP</b> (avoir une adresse) → <b>DNS</b> (trouver l'IP du site) → <b>HTTP</b> (demander la page).</div>`
    }
  ],

  questions: [
    { s: "apps", d: 34, q: "Pourquoi y a-t-il peu de programmes applicatifs sur les équipements du cœur de réseau ?",
      r: ["Il n'y a pas d'utilisateurs, et le principe est de « conserver le cœur simple »", "Parce que les routeurs n'ont pas de mémoire", "Parce que la couche Application est interdite dans les routeurs par l'ICANN", "Parce que le cœur de réseau utilise uniquement UDP"],
      e: "Diapo 34 : pas d'utilisateurs dans le cœur + philosophie « conserver le cœur simple »." },
    { s: "apps", d: 34, q: "Quelles architectures applicatives le CM cite-t-il ?",
      r: ["Client-serveur, P2P, hybride", "Client-serveur uniquement", "Maître-esclave, anneau, bus", "TCP, UDP, QUIC"],
      e: "Différentes architectures possibles : client-serveur, P2P, hybride." },
    { s: "apps", d: 35, q: "Dans l'architecture client-serveur, laquelle de ces propriétés concerne le SERVEUR ?",
      r: ["Il a une adresse IP permanente et est toujours actif", "Il a une activité intermittente", "Son adresse IP est forcément dynamique", "Il communique directement avec d'autres serveurs pairs à la place des clients"],
      e: "Serveur : toujours actif, IP permanente, souvent cluster / data center. Les clients : intermittents, IP éventuellement dynamique." },
    { s: "apps", d: 35, q: "Dans l'architecture client-serveur, les clients :",
      r: ["Ne communiquent pas directement entre eux", "Communiquent directement entre eux sans serveur", "Ont tous une adresse IP permanente", "Sont toujours actifs"],
      e: "Diapo 35 : les clients communiquent avec le serveur, pas directement entre eux." },
    { s: "apps", d: 35, q: "Pourquoi utilise-t-on des clusters de serveurs / data centers ?",
      r: ["Pour le passage à l'échelle et la disponibilité", "Pour que les clients aient une IP fixe", "Pour éviter d'utiliser des numéros de port", "Pour supprimer le besoin de DNS"],
      e: "Cluster / data center pour passage à l'échelle et disponibilité." },

    { s: "processus", d: 36, q: "Dans une communication client-serveur, quel processus initie la communication ?",
      r: ["Le processus client", "Le processus serveur", "Le processus DNS", "Le système d'exploitation du routeur"],
      e: "Processus client : initie la communication. Processus serveur : attend d'être sollicité." },
    { s: "processus", d: 36, q: "Qu'est-ce qu'un processus au sens du CM ?",
      r: ["Une application (programme) qui s'exécute sur un nœud", "Un paquet en attente dans un routeur", "Un protocole de la couche transport", "Une adresse IP associée à un port"],
      e: "Diapo 36 : processus = une application (programme) qui s'exécute sur un nœud." },
    { s: "processus", d: 37, q: "Qu'est-ce qu'une socket ?",
      r: ["L'interface (API) par laquelle un processus envoie et reçoit ses messages", "Un câble reliant deux routeurs", "Un champ de l'en-tête IP", "Le buffer d'un routeur"],
      e: "Socket = interface de communication pour les applis distribuées, « zone de départ et d'arrivée » des messages." },
    { s: "processus", d: 37, q: "Qui contrôle la partie TCP (buffers, variables) située sous la socket ?",
      r: ["Le système d'exploitation", "Le développeur de l'application", "Le routeur passerelle", "Le serveur DNS"],
      e: "Au-dessus de la socket : le développeur ; en dessous (TCP avec buffers et variables) : l'OS." },
    { s: "processus", d: 37, q: "Lequel de ces paramètres est au choix du programmeur côté application ?",
      r: ["Le protocole de transport utilisé (TCP ou UDP)", "Le chemin suivi par les paquets dans Internet", "Le TTL décrémenté par les routeurs", "Le numéro d'AS de son FAI"],
      e: "Diapo 37 : paramètres côté application (choix du protocole de transport, taille du buffer…) à la discrétion du programmeur." },
    { s: "processus", d: 38, q: "Pourquoi l'adresse IP seule ne suffit-elle pas à identifier un processus ?",
      r: ["Parce que plusieurs processus peuvent s'exécuter sur un même nœud", "Parce que l'adresse IP change à chaque paquet", "Parce que les processus n'ont pas d'adresse IP", "Parce que l'adresse IP identifie le routeur, pas la machine"],
      e: "Il faut adresse IP + numéro de port associé au processus." },
    { s: "processus", d: 38, q: "Un processus distant est identifié par :",
      r: ["Une adresse IP et un numéro de port", "Uniquement une adresse IP", "Uniquement un numéro de port", "Un nom de domaine et un TTL"],
      e: "Identifiant = adresse IP ET numéro de port." },
    { s: "processus", d: 38, q: "Quel numéro de port est cité pour un serveur e-mail ?",
      r: ["25", "80", "53", "443"],
      e: "Diapo 38 : serveur HTTP : 80 ; serveur e-mail : 25." },

    { s: "protocoles-app", d: 39, q: "Lequel de ces éléments n'est PAS défini par un protocole applicatif ?",
      r: ["Le chemin suivi par les paquets dans le réseau", "Les types de messages échangés", "La syntaxe des messages", "Les règles d'envoi et de réception"],
      e: "Un protocole applicatif définit : types de messages, syntaxe, signification des champs, règles d'envoi/réception. Le chemin, c'est le routage (couche réseau)." },
    { s: "protocoles-app", d: 40, q: "Que signifie DNS ?",
      r: ["Domain Name System", "Dynamic Name Server", "Data Network Service", "Domain Network Security"],
      e: "DNS = Domain Name System : traduit les noms en adresses IP." },
    { s: "protocoles-app", d: 40, q: "Que signifie DHCP ?",
      r: ["Dynamic Host Configuration Protocol", "Domain Host Control Protocol", "Dynamic HTTP Connection Protocol", "Data Host Communication Process"],
      e: "DHCP = Dynamic Host Configuration Protocol." },
    { s: "protocoles-app", d: 40, q: "Quel protocole sert à synchroniser l'heure des machines ?",
      r: ["NTP", "SNMP", "DHCP", "SMTP"],
      e: "NTP = Network Time Protocol." },
    { s: "protocoles-app", d: 41, q: "Lors de la connexion d'Alice à eduroam, quelles informations le serveur DHCP lui fournit-il ?",
      r: ["Son adresse IP, l'adresse IP de la passerelle et celle du serveur DNS local", "L'adresse IP du serveur web de YouTube", "La table de routage complète de l'UCBL", "Son numéro de port et le numéro d'AS"],
      e: "Diapo 41 : adresse IP ; adresse IP passerelle ; adresse IP serveur DNS local." },
    { s: "protocoles-app", d: 41, q: "Dans quel ordre se déroulent les échanges quand Alice arrive sur eduroam puis ouvre une page web ?",
      r: ["DHCP, puis DNS, puis HTTP", "DNS, puis DHCP, puis HTTP", "HTTP, puis DNS, puis DHCP", "DHCP, puis HTTP, puis DNS"],
      e: "Il faut d'abord une adresse (DHCP), puis l'IP du site (DNS), puis la page (HTTP)." }
  ]
});
