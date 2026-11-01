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
  resume: "Client-serveur, processus, sockets, numéros de port, DHCP et DNS — plus HTTP et les cookies, tombés aux annales.",

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
    },
    {
      id: "http",
      titre: "HTTP, cookies et DNS (tombés aux annales)",
      diapos: [40, 41, 53, 91],
      recherche: "HTTP cookies DNS serveur local explication",
      videos: [
        { t: "Comprendre le DNS en 5 minutes", u: "https://www.youtube.com/watch?v=qzWdzAvfBoo", l: "FR" },
        { t: "Learn in 5 Minutes: HTTP Cookies", u: "https://www.youtube.com/watch?v=EqvUF_tVry0", l: "EN" },
        { t: "Understanding Recursive DNS Name Resolution", u: "https://www.youtube.com/watch?v=lyX9K5a52rI", l: "EN" }
      ],
      html: `
<div class="attention"><b>⚠️ Pas dans les diapos de cette année</b> : HTTP, les cookies et le DNS local ne sont pas détaillés dans tes CM1–CM2, mais ils sont tombés aux QCM de 2022–23 et 2023–24. Voici le minimum à savoir.</div>

<h4>HTTP</h4>
<ul>
  <li>HTTP (<i>HyperText Transfer Protocol</i>) = le protocole du <b>Web</b>, couche <b>Application</b> (donc de bout-en-bout).</li>
  <li>Mode <b>client-serveur</b> : le navigateur (client) envoie une <b>requête</b>, le serveur web renvoie une <b>réponse</b> [d41].</li>
  <li>Il repose sur <b>TCP</b> (port 80, ou 443 pour HTTPS) : la requête et la réponse voyagent dans des segments TCP [d91].</li>
  <li>Pourquoi « <b>principalement</b> » TCP dans l'annale 2023–24 ? La version récente <b>HTTP/3</b> utilise QUIC, qui tourne sur UDP.</li>
</ul>

<h4>Les cookies</h4>
<p>HTTP est <b>sans état</b> : le serveur ne se souvient pas de tes requêtes précédentes. Le cookie règle ça :</p>
<ol>
  <li>À ta première visite, le <b>serveur choisit une valeur</b> (ex. <code>id=1678</code>) et te l'envoie dans sa réponse (en-tête <code>Set-Cookie</code>).</li>
  <li>Ton navigateur la <b>stocke</b>.</li>
  <li>À chaque requête suivante vers ce site, le navigateur la <b>renvoie</b> (en-tête <code>Cookie</code>) → le serveur te reconnaît : panier, connexion, préférences…</li>
</ol>
<div class="retenir">Un cookie = une valeur <b>choisie par le serveur</b> pour un client, <b>renvoyée par le client</b> à chaque requête, qui permet au serveur de <b>maintenir un état pour chaque visiteur</b>.</div>
<div class="piege">Les cookies ne <u>sécurisent</u> rien et n'<u>accélèrent</u> rien. Télécharger plusieurs objets d'une page sur une seule connexion TCP, c'est la <b>connexion persistante</b>, pas les cookies.</div>

<h4>DNS</h4>
<ul>
  <li>Application « réseau » [d40], en mode <b>client-serveur</b>, qui traduit un nom en adresse IP.</li>
  <li>Port <b>53</b>, en <b>UDP ou TCP</b> [d53] : UDP la plupart du temps (rapide), TCP possible (grosses réponses). Donc « repose <u>toujours</u> sur UDP » est faux.</li>
  <li>Il peut tomber en panne comme tout serveur (c'est pour ça qu'il y en a plusieurs).</li>
</ul>

<h4>Le serveur DNS local</h4>
<p>C'est le serveur DNS de ton réseau — à l'UCBL, son adresse t'est donnée par DHCP [d41].</p>
<ol>
  <li>Ton PC lui demande l'IP de www.youtube.com → il est <b>serveur</b> pour toi.</li>
  <li>S'il ne connaît pas la réponse, il interroge à son tour la hiérarchie DNS : serveur <b>racine</b>, puis serveur <b>.com</b>, puis le serveur <b>de youtube.com</b> → il est <b>client</b> de ces serveurs.</li>
  <li>Il garde la réponse en <b>cache</b> : la fois suivante, il répond tout de suite.</li>
</ol>
<div class="retenir">DNS local = <b>à la fois serveur et client</b>. Il ne connaît pas tout Internet, et grâce à son cache il <b>accélère</b> souvent les réponses (il ne les ralentit pas « toujours »).</div>`
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
      e: "Il faut d'abord une adresse (DHCP), puis l'IP du site (DNS), puis la page (HTTP)." },
    /* =====================================================================
       ANNALES — questions des vrais QCM (corrigés officiels)
       ===================================================================== */
    { s: "apps", d: 35, annale: "ClientServeur", q: "Au sein d'une application de type client-serveur",
      r: ["le serveur a une adresse IP permanente tandis que les clients peuvent avoir des adresses IP dynamiques", "les clients peuvent échanger directement les données entre eux", "les clients ont forcément des adresses IP permanentes", "les clients envoient en permanence des requêtes au serveur"],
      e: "Diapo 35 : serveur toujours actif avec une IP permanente ; clients à activité intermittente (pas « en permanence »), IP éventuellement dynamique, et ils ne se parlent pas directement." },
    { s: "processus", d: 37, annale: "Processus", q: "Les processus",
      r: ["communiquent avec la couche Transport via une socket", "sont définis au niveau de la couche Transport", "sur deux machines différentes communiquent directement entre eux par passage de messages sans passer par la pile TCP/IP", "sont identifiables grâce aux adresses IP des machines seulement"],
      e: "Le processus (couche Application) dépose et reçoit ses messages dans sa socket, l'interface avec la couche Transport. Les messages traversent forcément toute la pile, et il faut IP + port pour identifier un processus." },
    { s: "processus", d: 38, annale: "Socket2", q: "De quel type d'information un processus exécuté sur un nœud A a-t-il besoin pour identifier un processus exécuté sur un nœud B ?",
      r: ["l'adresse IP et le numéro de port du nœud B", "seulement l'adresse IP si le protocole de transport utilisé est UDP", "seulement l'adresse IP et le numéro de port du nœud B si le protocole de transport utilisé est TCP", "seulement l'adresse MAC du nœud B si le protocole de transport utilisé est UDP"],
      e: "Toujours IP + port, que ce soit en TCP ou en UDP (diapo 38). L'IP désigne la machine, le port désigne le processus sur cette machine." },
    { s: "http", d: 91, annale: "HTTP2", q: "HTTP est",
      r: ["un protocole applicatif, qui fonctionne en mode client-serveur et qui repose principalement sur TCP", "un protocole de transport", "un protocole applicatif, qui fonctionne en mode client-serveur et qui repose toujours sur UDP", "un protocole applicatif, qui fonctionne en mode pair-à-pair et qui repose toujours sur TCP"],
      e: "HTTP = couche Application, navigateur (client) / serveur web. Il repose sur TCP (diapo 91 : requête HTTP dans un segment TCP). « Principalement » car HTTP/3 passe par QUIC, qui tourne sur UDP. (En 2022–23 la bonne réponse disait simplement « repose sur TCP ».)" },
    { s: "http", d: null, annale: "Cookies2", q: "À quoi servent les cookies utilisés par HTTP ?",
      r: ["À permettre aux serveurs Web de maintenir un état pour chaque visiteur", "À sécuriser les communications HTTP", "À réduire les délais de transfert en accélérant le téléchargement des fichiers", "À permettre le téléchargement de plusieurs objets référencés sur une page web sur une seule connexion TCP"],
      e: "HTTP est « sans état » : le serveur oublie tout entre deux requêtes. Le cookie (valeur donnée par le serveur, renvoyée par le navigateur à chaque requête) lui permet de te reconnaître : panier, connexion… Plusieurs objets sur une seule connexion TCP, c'est la connexion persistante, pas les cookies." },
    { s: "http", d: null, annale: "Cookies3", q: "Les cookies",
      r: ["sont des valeurs choisies par les serveurs pour des clients", "correspondent à des identifiants choisis par les clients", "ne sont jamais diffusés par les clients", "correspondent à des préférences exprimées par les clients auprès des serveurs"],
      e: "C'est le serveur qui crée la valeur du cookie (en-tête Set-Cookie de sa réponse). Le navigateur la stocke puis la renvoie (en-tête Cookie) à chaque nouvelle requête vers ce site : le client la diffuse donc bien." },
    { s: "http", d: 53, annale: "DNS1", q: "DNS",
      r: ["est un protocole applicatif, qui fonctionne en mode client-serveur et qui repose sur UDP ou sur TCP", "est un protocole de transport", "est un protocole applicatif, qui repose toujours sur UDP et qui permet de retrouver l'adresse IP d'une machine hôte", "ne tombe jamais en panne"],
      e: "DNS = application « réseau » (diapo 40), en client-serveur, port 53 en TCP ou UDP (tableau diapo 53). Le piège : « toujours sur UDP ». C'est UDP la plupart du temps, mais TCP est possible." },
    { s: "http", d: 41, annale: "DNS2", q: "Un serveur DNS local",
      r: ["est à la fois un serveur et un client qui peut interroger tous les serveurs de la hiérarchie DNS", "connaît toutes les correspondances URL - adresse IP de l'Internet", "ralentit toujours le temps de réponse à une requête DNS", "ne tombe jamais en panne"],
      e: "Le DNS local (donné par DHCP, diapo 41) reçoit ta question : il est SERVEUR pour toi. S'il ne connaît pas la réponse, il interroge lui-même les serveurs racine, puis .com, puis celui du domaine : il est alors CLIENT. Il garde les réponses en cache, ce qui accélère les requêtes suivantes." }

  ]
});
