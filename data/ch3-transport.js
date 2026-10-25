/* =====================================================================
   Chapitre 3 — Couche Transport  (CM1 diapos 42–65 + CM2 diapos 66–91)
   ⚠️ La 1re réponse de r est TOUJOURS la bonne (le site mélange l'ordre).
   ===================================================================== */

COURS.chapitres.push({
  id: "transport",
  num: 3,
  titre: "Couche Transport",
  court: "Transport",
  couleur: "#2563eb",
  source: "CM1 diapos 42–65 · CM2 diapos 66–91",
  resume: "UDP et TCP, multiplexage par ports, construction pas à pas d'un transfert fiable (rdt 1.0 → 3.0), fenêtres d'anticipation et contrôle de congestion.",

  sections: [
    {
      id: "services",
      titre: "Services de la couche Transport (UDP vs TCP)",
      diapos: [44, 45],
      recherche: "couche transport TCP UDP différence",
      videos: [
        { t: "Réseau : les protocoles TCP et UDP", u: "https://www.youtube.com/watch?v=kiw1g6GrGJ0", l: "FR" },
        { t: "3.1 Introduction and Transport-layer Services", u: "https://www.youtube.com/watch?v=lAvhH0XJLNE", l: "EN" }
      ],
      html: `
<h4>Le rôle de la couche Transport [d44]</h4>
<ul>
  <li>Elle crée une <b>communication logique entre des processus</b> (applications) distants : chaque appli a l'impression de parler directement à l'autre.</li>
  <li>Elle n'existe <b>que sur les terminaux</b> (pas dans les routeurs) — c'est une couche de bout-en-bout.</li>
  <li><b>Émetteur</b> : découpe les messages de l'appli en <b>segments</b> et les passe à la couche Réseau.</li>
  <li><b>Récepteur</b> : réassemble les segments en messages et les passe à la couche Application.</li>
  <li>Protocoles : <b>UDP</b> et <b>TCP</b> (les principaux), et des nouveaux comme <b>QUIC</b>.</li>
</ul>

<h4>Qui fait quoi ? [d45]</h4>
<table>
  <tr><th>Service</th><th>UDP</th><th>TCP</th></tr>
  <tr><td>Multiplexage / démultiplexage</td><td class="oui">✔</td><td class="oui">✔</td></tr>
  <tr><td>Détection d'erreur</td><td class="oui">✔</td><td class="oui">✔</td></tr>
  <tr><td>Livraison <b>fiable et ordonnée</b></td><td class="non">✘</td><td class="oui">✔</td></tr>
  <tr><td>Contrôle de <b>congestion</b></td><td class="non">✘</td><td class="oui">✔</td></tr>
  <tr><td>Contrôle de <b>flux</b></td><td class="non">✘</td><td class="oui">✔</td></tr>
  <tr><td>Garantie de délai ou de débit (QoS)</td><td class="non">✘</td><td class="non">✘</td></tr>
</table>
<div class="retenir"><b>À retenir</b> : services communs = <b>multiplexage + détection d'erreur</b>. UDP n'apporte <b>rien de plus</b>. <b>Aucun</b> des deux ne garantit une QoS sur les délais ou les débits. TCP = <b>90 à 95 %</b> du trafic Internet.</div>
<div class="piege"><b>Piège</b> : « TCP garantit un débit minimum » → <u>faux</u>. TCP garantit que les données arrivent toutes, dans l'ordre — pas en combien de temps.</div>`
    },

    {
      id: "multiplexage",
      titre: "Multiplexage / démultiplexage et ports",
      diapos: [47, 48, 49, 50, 51, 52, 53],
      recherche: "multiplexage démultiplexage couche transport port socket",
      videos: [
        { t: "Cours N°8 réseaux 2 | La couche Transport (les numéros de ports)", u: "https://www.youtube.com/watch?v=Tih39_Q3WrQ", l: "FR" },
        { t: "3.2 Transport layer multiplexing and demultiplexing", u: "https://www.youtube.com/watch?v=CekW6ipRrGA", l: "EN" }
      ],
      html: `
<h4>Les définitions [d47] [d48]</h4>
<ul>
  <li><b>Multiplexage</b> (chez l'émetteur) : faire passer les flux de <b>plusieurs applications</b> sur un même chemin IP. Concrètement : rassembler les données des différentes sockets, les encapsuler en segments et les remettre à la couche Réseau.</li>
  <li><b>Démultiplexage</b> (chez le récepteur) : répondre à la question « <b>à quelle application est destiné ce segment ?</b> » et le délivrer à la <b>bonne socket</b>.</li>
</ul>
<div class="analogie"><b>Analogie</b> : la poste d'un immeuble. Le facteur dépose tout le courrier à l'adresse de l'immeuble (adresse IP) ; le gardien distribue chaque lettre dans la bonne boîte selon le n° d'appartement (le port) → démultiplexage.</div>

<h4>Sans connexion : UDP [d49] [d50]</h4>
<ul>
  <li>Une socket UDP est identifiée par un <b>doublet</b> : <b>(@IP destination, n° de port destination)</b>.</li>
  <li>À l'arrivée d'un segment UDP, on choisit la socket selon le <b>port destination</b>.</li>
  <li>Plusieurs nœuds peuvent-ils émettre vers <b>une même socket</b> ? <b>Oui !</b></li>
  <li>Le <b>port source</b> est quand même dans l'en-tête UDP : il sert pour le <b>chemin retour</b> (savoir où répondre).</li>
</ul>
<div class="exemple"><b>Exemple du CM</b> : C est un serveur DNS (UDP, port 53). Le client A envoie depuis son port 9233, le client B depuis son port 5775, tous deux vers le port 53 de C → leurs paquets arrivent dans <b>la même socket</b>. C répond à A avec src 53 / dst 9233, et à B avec src 53 / dst 5775.</div>

<h4>Orienté connexion : TCP [d51] [d52]</h4>
<ul>
  <li>Une socket TCP est identifiée par un <b>quadruplet</b> : <b>(@IP source, port source, @IP destination, port destination)</b>.</li>
  <li>Le nœud utilise ce quadruplet pour diriger le segment vers la bonne socket ou <b>la créer</b>.</li>
  <li>Plusieurs nœuds peuvent-ils émettre vers une même socket ? <b>Non !</b> Chaque client a <b>sa propre socket</b> sur le serveur.</li>
</ul>
<div class="exemple"><b>Exemple du CM</b> : C est un serveur Web (port 80). Le client A et le client B ouvrent chacun une connexion HTTP → sockets séparées. B ouvre même <b>deux</b> connexions : elles se distinguent par le <b>port source</b> (9157 et 5775), car l'IP source (B), l'IP dst (C) et le port dst (80) sont identiques.</div>
<div class="retenir"><b>UDP = 2 infos (dst)</b> → une socket partagée par tous les clients. <b>TCP = 4 infos (src + dst)</b> → une socket par connexion.</div>

<h4>Choix des numéros de port [d53]</h4>
<ul>
  <li>Le <b>serveur</b> écoute sur un (ou plusieurs) port(s) <b>connu(s)</b>, fixé(s) par convention.</li>
  <li>Le <b>client</b> met le port du serveur comme port <b>destination</b>, et choisit son port <b>source</b> (souvent <b>aléatoirement</b>).</li>
</ul>
<table class="ports">
  <tr><th>Service</th><th>Port</th><th>Transport</th></tr>
  <tr><td>FTP</td><td>20, 21</td><td>TCP</td></tr>
  <tr><td>SSH</td><td>22</td><td>TCP</td></tr>
  <tr><td>Telnet</td><td>23</td><td>TCP</td></tr>
  <tr><td>SMTP (mail)</td><td>25</td><td>TCP</td></tr>
  <tr><td>DNS</td><td>53</td><td>TCP ou UDP</td></tr>
  <tr><td>DHCP</td><td>67, 68</td><td>UDP</td></tr>
  <tr><td>TFTP</td><td>69</td><td>UDP</td></tr>
  <tr><td>HTTP</td><td>80</td><td>TCP</td></tr>
  <tr><td>POP</td><td>110</td><td>TCP</td></tr>
  <tr><td>NTP</td><td>123</td><td>UDP</td></tr>
  <tr><td>NetBIOS</td><td>137, 138, 139</td><td>TCP et UDP</td></tr>
  <tr><td>IMAP</td><td>143</td><td>TCP</td></tr>
  <tr><td>SNMP</td><td>161, 162</td><td>TCP et UDP</td></tr>
  <tr><td>LDAP</td><td>389</td><td>TCP et UDP</td></tr>
  <tr><td>HTTPS</td><td>443</td><td>TCP</td></tr>
</table>`
    },

    {
      id: "udp",
      titre: "UDP et la somme de contrôle",
      diapos: [55, 56, 57, 58],
      recherche: "UDP checksum complément à 1 calcul",
      videos: [
        { t: "3.3 Connectionless Transport: UDP", u: "https://www.youtube.com/watch?v=VjBDgcNno-Q", l: "EN" },
        { t: "UDP and Internet Checksums", u: "https://www.youtube.com/watch?v=7rlI1iHgWss", l: "EN" }
      ],
      html: `
<h4>UDP : User Datagram Protocol (RFC 768) [d55]</h4>
<ul>
  <li><b>Service minimum</b> : multiplexage/démultiplexage + détection d'erreurs (<i>pas obligatoire</i> : le champ est mis à 0 si on ne l'utilise pas).</li>
  <li><b>Sans connexion</b> : aucun échange initial entre l'émetteur et le récepteur avant d'envoyer.</li>
</ul>
<p><b>Alors pourquoi utiliser UDP ?</b></p>
<ul>
  <li><b>+ rapide</b> : pas d'établissement de connexion ;</li>
  <li><b>+ simple</b> : pas d'état de connexion à maintenir, ni de paquets à mémoriser ;</li>
  <li><b>+ léger</b> : en-tête de <b>8 octets</b> (contre <b>20</b> pour TCP), et moins de sockets ;</li>
  <li><b>+ de contrôle pour l'appli</b> : c'est elle qui décide de son débit (taille des segments, instants d'émission).</li>
</ul>

<h4>Usages et format [d56]</h4>
<ul>
  <li>Applis qui ont besoin d'une <b>grande réactivité</b> : <b>DNS, SNMP, RIP</b>…</li>
  <li>Applis multimédia <b>tolérantes aux pertes</b> : téléphonie par Internet, visioconférence…</li>
  <li>⚠️ Risque : le trafic UDP peut <b>congestionner le réseau</b> (UDP ne se freine jamais tout seul).</li>
</ul>
<table class="entete">
  <tr><td colspan="2" class="center"><small>← 32 bits →</small></td></tr>
  <tr><td>Port source (16 bits)</td><td>Port destination (16 bits)</td></tr>
  <tr><td>Taille (16 bits)</td><td>Somme de contrôle (16 bits)</td></tr>
  <tr><td colspan="2" class="center">Données de l'application (message)</td></tr>
</table>
<p>4 champs × 16 bits = 64 bits = <b>8 octets d'en-tête</b>. Le champ <b>Taille</b> = taille du segment UDP <b>en octets, en-tête inclus</b>. Le port source n'est pas utilisé pour atteindre la socket du destinataire, il sert aux éventuels messages retour.</p>

<h4>La somme de contrôle (checksum) [d57]</h4>
<p><b>But</b> : détecter les bits altérés dans le segment.</p>
<table>
  <tr><th>Émetteur</th><th>Récepteur</th></tr>
  <tr><td>1. Découpe le segment en <b>mots de 16 bits</b><br>2. Fait la somme de tous les mots, puis le <b>complément à 1</b><br>3. Écrit le résultat dans le champ checksum</td>
      <td>1. Recalcule la somme de contrôle sur le segment reçu<br>2. Compare avec la valeur du champ :<br>• différente → <b>erreur détectée</b><br>• égale → pas d'erreur détectée… mais <b>pas absolument certain</b> !</td></tr>
</table>

<h4>Exemple de calcul [d58]</h4>
<p>Règle importante : quand on additionne, la <b>retenue qui « dépasse » à gauche (bit le plus significatif) est rajoutée au résultat</b> (on la « reboucle »).</p>
<pre class="calc">mot1          1110011001100110
mot2        + 1101010101010101
            ------------------
somme brute  11011101110111011   ← 17 bits : il y a une retenue
reboucle      1011101110111011
            +                1
somme         1011101110111100
complément à 1 (on inverse chaque bit)
checksum      0100010001000011</pre>
<div class="retenir"><b>Complément à 1</b> = inverser tous les bits (0↔1). Astuce : à la réception, si on additionne tous les mots <b>+ le checksum</b> (avec rebouclage), on doit obtenir <code>1111111111111111</code>. Un seul 0 → erreur.</div>
<div class="piege"><b>« Absolument certain ? »</b> Non : si deux erreurs se compensent (ex. un bit passe de 0 à 1 dans un mot et un autre de 1 à 0 au même rang dans un autre mot), la somme ne change pas et l'erreur passe inaperçue.</div>`
    },

    {
      id: "rdt",
      titre: "Transfert fiable pas à pas : rdt 1.0 → 3.0",
      diapos: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78],
      recherche: "rdt 3.0 stop and wait alternating bit protocol",
      videos: [
        { t: "3.4-1 Principles of Reliable Data Transfer (Part 1)", u: "https://www.youtube.com/watch?v=nyUHUtmxWg0", l: "EN" },
        { t: "3.4-2 Principles of Reliable Data Transfer (Part 2)", u: "https://www.youtube.com/watch?v=vxgH6r-II2Q", l: "EN" }
      ],
      html: `
<h4>Le problème [d60] [d61]</h4>
<p>La couche Réseau (IP) est un <b>canal non fiable</b> : des bits peuvent être abîmés, des paquets perdus. Pourtant l'appli veut un <b>canal fiable</b>. Comment construire du fiable sur du non-fiable ?</p>
<ul>
  <li><code>rdt</code> = <i>reliable data transfer</i> (fiable), <code>udt</code> = <i>unreliable data transfer</i> (non fiable).</li>
  <li><code>rdt_send()</code> : appelé par la couche 5 pour envoyer des données ; <code>udt_send()</code> : appelé par rdt pour envoyer un paquet sur le canal non fiable ;</li>
  <li><code>udt_rcv()</code> : appelé quand un paquet arrive du canal ; <code>rdt_rcv()</code> : appelé par rdt pour remettre les données à la couche 5.</li>
  <li>La <b>complexité du protocole rdt dépend des défauts du canal</b>.</li>
</ul>
<p>Le CM construit le protocole <b>pas à pas</b> [d62] : transfert de données dans <b>un seul sens</b> (mais les paquets de contrôle circulent dans les deux sens), décrit par des <b>automates à états finis</b> (on passe d'un état à l'autre sur un <i>événement</i>, en exécutant des <i>actions</i>).</p>

<div class="etape"><span>rdt 1.0</span> <b>Canal parfait</b> [d63]<br>Pas d'erreur binaire, pas de perte. L'expéditeur fabrique un paquet et l'envoie ; le destinataire l'extrait et le livre. Rien d'autre à faire.</div>

<div class="etape"><span>rdt 2.0</span> <b>Canal avec erreurs binaires</b> [d64] [d65]<br>
Il faut 3 choses : (a) <b>détecter</b> l'erreur → somme de contrôle ; (b) <b>informer</b> l'expéditeur → <b>ACK</b> (« bien reçu ») ou <b>NAK</b> (« reçu avec erreur ») ; (c) <b>retransmettre</b> à la réception d'un NAK.<br>
C'est un protocole <b>« Send and wait »</b> (stop-and-wait) : on envoie UN paquet puis on attend l'ACK/NAK avant d'envoyer le suivant.</div>

<div class="attention"><b>Le défaut de rdt 2.0</b> [d68] : et si c'est <b>l'ACK ou le NAK qui arrive abîmé</b> ? L'expéditeur ne sait pas si son paquet est bien arrivé. Retransmettre bêtement ? Non : le destinataire ne pourrait pas savoir si c'est un <b>doublon</b> ou une <b>nouvelle donnée</b> (une appli peut très bien envoyer deux fois le même contenu !).<br>Solution retenue (par TCP et rdt 2.1) : <b>ajouter un numéro de séquence</b>.</div>

<div class="etape"><span>rdt 2.1</span> <b>Numéro de séquence</b> [d69] [d70] [d71] [d72]<br>
• Chaque segment porte un n° de séquence. Si l'ACK est abîmé → on retransmet. Si un <b>duplicata</b> arrive chez le destinataire → il le <b>supprime</b> (mais renvoie un ACK).<br>
• En « send and wait », <b>1 seul bit suffit</b> (on alterne 0, 1, 0, 1…), et seulement <b>dans les paquets de données</b>, pas dans les ACK/NAK.<br>
• Les automates ont <b>deux fois plus d'états</b> (pour retenir si on attend le paquet 0 ou 1).</div>

<div class="etape"><span>rdt 2.2</span> <b>Sans NAK</b> [d73]<br>
Au lieu d'un NAK, le destinataire renvoie l'<b>ACK du dernier segment correctement reçu</b>. Il faut donc que les <b>ACK soient numérotés</b>. Recevoir <b>2 ACK identiques ⇔ recevoir 1 NAK</b> → l'expéditeur retransmet le paquet courant.</div>

<div class="etape"><span>rdt 3.0</span> <b>Canal avec erreurs ET pertes</b> [d74] [d75] [d76] [d77]<br>
Checksum + n° séquence + ACK + retransmission ne suffisent plus : si le paquet (ou l'ACK) est <b>perdu</b>, on attendrait indéfiniment. Il faut un <b>temporisateur (timer)</b> :<br>
• l'expéditeur lance le timer en envoyant ; s'il <b>expire (timeout)</b> avant l'ACK → il <b>retransmet</b> ;<br>
• si le paquet ou l'ACK était juste <b>en retard</b> → on a un doublon, mais le <b>n° de séquence</b> permet de le gérer ;<br>
• le destinataire indique le n° du paquet qu'il acquitte ;<br>
• si un ACK arrive <b>erroné</b> ou si ce n'est <b>pas l'ACK attendu</b> → <b>pas de réaction</b>, on laisse le timer gérer.<br>
Les 4 scénarios de la diapo 76–77 : a) sans perte, b) paquet perdu, c) ACK perdu, d) expiration prématurée du timer.</div>

<div class="retenir"><b>Les 4 pièces maîtresses d'un transport fiable</b> [d78]
<ol>
  <li><b>Somme de contrôle</b> → détecter les erreurs</li>
  <li><b>Accusés de réception (ACK, NAK)</b> → boucle de contrôle</li>
  <li><b>N° de séquence</b> → détecter les duplicatas et les erreurs sur les ACK</li>
  <li><b>Timer</b> → gérer les pertes de paquets</li>
</ol></div>
<table>
  <tr><th>Version</th><th>Canal supposé</th><th>Ce qu'on ajoute</th></tr>
  <tr><td>rdt 1.0</td><td>parfait</td><td>rien</td></tr>
  <tr><td>rdt 2.0</td><td>erreurs binaires</td><td>checksum, ACK/NAK, retransmission</td></tr>
  <tr><td>rdt 2.1</td><td>erreurs (même sur ACK/NAK)</td><td>n° de séquence (1 bit)</td></tr>
  <tr><td>rdt 2.2</td><td>idem</td><td>plus de NAK : ACK numérotés</td></tr>
  <tr><td>rdt 3.0</td><td>erreurs + pertes</td><td>timer</td></tr>
</table>`
    },

    {
      id: "performances",
      titre: "Performances du « send and wait » (rdt 3.0)",
      diapos: [79],
      recherche: "stop and wait utilisation lien calcul",
      videos: [
        { t: "Performance of Reliable Data Transfer", u: "https://www.youtube.com/watch?v=NMbMXCbYaX4", l: "EN" },
        { t: "rdt 3.0 vs pipelined protocols", u: "https://www.youtube.com/watch?v=CDo0mo2jB-c", l: "EN" }
      ],
      html: `
<p>rdt 3.0 <b>fonctionne</b>, mais ses performances sont mauvaises, à cause du <b>« send and wait »</b> : on passe son temps à attendre les ACK [d79].</p>
<div class="exemple"><b>Exemple du CM</b> : lien de <b>C = 1 Gb/s</b>, délai de propagation <b>15 ms</b>, paquet de <b>L = 1 Ko</b> (1 000 octets = 8 000 bits).
<ul>
  <li>Temps d'émission : t<sub>émission</sub> = 8L / C = 8 000 / 10<sup>9</sup> = <b>8 µs</b></li>
  <li>Ensuite il faut attendre que le paquet arrive (15 ms) et que l'ACK revienne (15 ms) : <b>2 × d<sub>propag</sub> = 30 ms</b></li>
  <li><b>U</b> (utilisation du lien = proportion du temps passé à émettre) = t<sub>émission</sub> / (t<sub>émission</sub> + 2 × d<sub>propag</sub>) = 8 µs / 30,008 ms ≈ <b>2,7 × 10<sup>−4</sup></b></li>
  <li><b>Débit utile</b> = U × C ≈ <b>270 kb/s</b>… sur un lien à 1 Gb/s !</li>
</ul></div>
<div class="analogie"><b>Analogie</b> : une autoroute à 1 000 voies, mais tu n'as le droit d'envoyer qu'<b>une voiture</b>, puis d'attendre qu'elle revienne avant d'envoyer la suivante. L'autoroute est vide 99,97 % du temps.</div>
<div class="retenir">U = t<sub>émission</sub> / (t<sub>émission</sub> + 2·d<sub>propag</sub>) · Débit utile = U × C · « Fonctionnel mais pas performant ».</div>
<div class="bonus"><b>Pour aller plus loin</b> (pas écrit tel quel dans le CM) : si on envoie <b>W</b> paquets d'un coup avant d'attendre (pipeline, section suivante), l'utilisation devient ≈ W × t<sub>émission</sub> / (t<sub>émission</sub> + 2·d<sub>propag</sub>), plafonnée à 1. C'est exactement pour ça qu'on invente la fenêtre d'anticipation.</div>`
    },

    {
      id: "pipeline",
      titre: "Protocoles à anticipation (pipeline), Go-Back-N et Selective Repeat",
      diapos: [80, 81, 82, 83],
      recherche: "fenêtre glissante go back n selective repeat",
      videos: [
        { t: "Go-Back-N and Selective Repeat (including a simulation)", u: "https://www.youtube.com/watch?v=VyUXwzUotJQ", l: "EN" },
        { t: "Comparison of Stop and Wait, Go back N, Selective Repeat", u: "https://www.youtube.com/watch?v=-80KB7Bv2GI", l: "EN" }
      ],
      html: `
<h4>Le pipeline [d80]</h4>
<p>Idée : l'expéditeur peut transmettre <b>plusieurs paquets à la suite sans attendre</b> les accusés de réception. Le nombre de paquets qu'on peut avoir « en vol » (envoyés mais pas encore acquittés) = la <b>fenêtre d'anticipation</b> (W).</p>
<p>Le « send and wait », c'est simplement une fenêtre de taille <b>W = 1</b>.</p>

<h4>La fenêtre glissante [d81]</h4>
<p>Exemple du CM avec <b>W = 3</b> : un message est découpé en 4 segments. Les segments 1, 2, 3 partent ; la fenêtre <b>bloque le 4e</b>. Quand l'<b>ACK 1</b> arrive, la fenêtre <b>glisse</b> d'un cran et libère le départ du segment 4. Elle est <b>glissante</b> (elle avance d'un cran par ACK), pas « sautante » (elle n'attend pas d'avoir les 3 ACK pour repartir).</p>

<h4>Avantages / inconvénients [d82]</h4>
<ul>
  <li>✔ Bien meilleure utilisation des ressources du réseau.</li>
  <li>✘ Les segments peuvent arriver <b>dans le désordre</b> (déséquencement).</li>
  <li>✘ Il faut de la <b>mémoire (buffer)</b> chez l'expéditeur (et peut-être chez le destinataire).</li>
  <li>✘ Il faut une <b>plus grande gamme de n° de séquence</b> (1 bit ne suffit plus).</li>
</ul>
<table>
  <tr><th>Buffer d'émission</th><th>Buffer de réception</th></tr>
  <tr><td><b>Nécessaire</b> : il faut garder une copie des segments envoyés au cas où il faudrait les retransmettre.</td>
      <td><b>Pas nécessaire</b>, mais il permet de garder les segments arrivés dans le désordre.</td></tr>
</table>

<h4>Deux stratégies côté récepteur [d83]</h4>
<p>Exemple : les segments arrivent dans l'ordre <b>1, 2, 4, 3, 8, 6, 5, 7</b>.</p>
<table>
  <tr><th>Rejet sélectif<br><small>« Selective Repeat »</small></th><th>Rejet simple<br><small>« Go-Back-N »</small></th></tr>
  <tr><td>La couche Transport garde <b>un buffer par connexion</b>. Les paquets peuvent entrer <b>déséquencés</b> et attendent dans le buffer jusqu'à pouvoir être remis <b>dans l'ordre</b> à l'Application.<br><br>Ex : 4 attend ; quand 3 arrive, on livre 3 puis 4. 8 et 6 attendent ; quand 5 arrive on livre 5, 6 ; quand 7 arrive on livre 7, 8.</td>
      <td><b>Pas de buffer</b>. Seuls les paquets <b>bien séquencés</b> (celui qu'on attend exactement) sont acceptés ; les autres sont <b>jetés</b> et devront être renvoyés.<br><br>Ex : 4 arrive alors qu'on attend 3 → rejeté. Il faudra que 4 soit réémis plus tard.</td></tr>
</table>
<div class="piege"><b>Piège de vocabulaire</b> : <b>Rejet sélectif = Selective Repeat = AVEC buffer</b>. <b>Rejet simple = Go-Back-N = SANS buffer</b>. Ne les inverse pas !</div>`
    },

    {
      id: "congestion",
      titre: "Contrôle de congestion TCP (AIMD)",
      diapos: [85, 86, 87, 88, 89],
      recherche: "contrôle de congestion TCP AIMD dents de scie",
      videos: [
        { t: "TCP Congestion Control — Internet Transport Layer", u: "https://www.youtube.com/watch?v=rib_ujnMqcs", l: "EN" },
        { t: "3.7 TCP Congestion Control", u: "https://www.youtube.com/watch?v=cIHiSR4j3g4", l: "EN" }
      ],
      html: `
<h4>Le problème [d85]</h4>
<p>Les ressources du réseau sont <b>limitées</b> : capacité d'émission des liens, capacité de traitement des nœuds, capacité de stockage (buffers) des nœuds. Quand le trafic (la <b>charge</b>) devient trop important : contention sur les ressources → des <b>files</b> se forment dans les routeurs → <b>retards et pertes</b> augmentent → c'est la <b>congestion</b>.</p>
<p>TCP règle ça en <b>3 étapes</b> :</p>

<div class="etape"><span>Étape 1</span> <b>Détecter une congestion</b> [d86]<br>
• <b>Sans assistance du réseau</b> : uniquement à partir des <b>terminaux</b>.<br>
• Par la <b>perte de paquets</b>, elle-même détectée par un <b>timeout</b> ou par <b>3 ACK identiques</b>.<br>
• Hypothèse fondamentale : une congestion provoque des pertes. L'inverse est-il vrai ? <b>Non</b> : une perte n'est pas toujours due à une congestion (ex. erreur sur un lien radio).</div>

<div class="etape"><span>Étape 2</span> <b>Réguler son débit</b> [d87]<br>
Détection d'une congestion → <b>réduction de la taille de la fenêtre d'anticipation</b> → réduction du débit TCP. (Moins de paquets en vol = moins de débit.)</div>

<div class="etape"><span>Étape 3</span> <b>À quel niveau ?</b> [d88]<br>
• Lien <b>dédié</b> de capacité C → débit souhaitable <b>proche de C</b>.<br>
• Lien <b>partagé</b> avec du trafic concurrent → débit souhaitable = la <b>capacité résiduelle</b> (disponible).<br>
• Problème : cette quantité est <b>inconnue et dynamique</b>. Comment la découvrir ?</div>

<h4>La réponse : AIMD [d89]</h4>
<p>Principe : <b>détecter la capacité disponible</b> en augmentant progressivement le débit (en agrandissant la fenêtre) jusqu'au maximum supporté. Comment sait-on qu'on a atteint le max ? <b>Une perte se produit.</b></p>
<ul>
  <li><b>Hausse additive</b> : augmenter la taille de la fenêtre d'<b>1 segment après chaque ACK reçu</b> (formulation du CM).</li>
  <li><b>Baisse multiplicative</b> : <b>diviser la taille de la fenêtre par 2</b> (en cas de perte).</li>
</ul>
<p>→ <b>AIMD</b> : « <i>Additive Increase Multiplicative Decrease</i> », aussi appelé « <b>Congestion Avoidance</b> ». La taille de la fenêtre évolue en <b>dents de scie</b> (sur la diapo : monte de 8 ko à 16 ko, retombe à 8 ko, etc.).</p>
<div class="analogie"><b>Analogie</b> : tu cherches le volume max de ton enceinte avant que le voisin tape au mur. Tu montes doucement (+1), et dès qu'il tape (perte), tu baisses fort (÷2). Puis tu remontes doucement…</div>
<div class="bonus"><b>Nuance (livre de Kurose)</b> : dans le vrai TCP, la hausse additive en Congestion Avoidance est d'environ <b>1 segment par RTT</b> (réparti sur tous les ACK d'une fenêtre). Pour le QCM, retiens la formulation du CM.</div>`
    },

    {
      id: "tcp",
      titre: "Synthèse : vue d'ensemble de TCP",
      diapos: [90, 91],
      recherche: "TCP orienté connexion contrôle de flux MSS",
      videos: [
        { t: "3.5-1 TCP Reliability, Flow Control, and Connection Management", u: "https://www.youtube.com/watch?v=UYJP-6mhF6E", l: "EN" },
        { t: "TCP vs UDP : quelle est la différence ?", u: "https://www.youtube.com/watch?v=wJsq0YYQQRM", l: "FR" }
      ],
      html: `
<p>TCP (RFC 793, 1122, 1323, 2018, 2581) en un coup d'œil [d90] :</p>
<table>
  <tr><th>Propriété</th><th>Ce que ça veut dire</th></tr>
  <tr><td><b>Orienté connexion</b></td><td>Échange d'informations au début (<b>« handshaking »</b>, négociation) : expéditeur et destinataire fixent les paramètres du transfert.</td></tr>
  <tr><td><b>Mode duplex</b></td><td>Les données peuvent circuler <b>dans les deux sens</b>.</td></tr>
  <tr><td><b>Point-à-point</b></td><td>Entre <b>un</b> expéditeur et <b>un</b> destinataire.</td></tr>
  <tr><td><b>Livraison fiable et séquencée</b></td><td>Buffers d'émission et de réception ; taille des segments fixée par le <b>MSS</b> (<i>Maximum Segment Size</i>, <b>hors en-tête</b>).</td></tr>
  <tr><td><b>Pipeliné</b></td><td>La fenêtre d'anticipation est <b>dynamique</b> (elle change avec AIMD).</td></tr>
  <tr><td><b>Contrôle de flux</b></td><td>Le <b>destinataire</b> indique combien d'octets il peut recevoir sans surcharger son buffer.</td></tr>
</table>
<div class="piege"><b>Contrôle de flux ≠ contrôle de congestion</b><br>
• <b>Flux</b> : protéger le <b>destinataire</b> (son buffer ne doit pas déborder). C'est lui qui annonce sa capacité.<br>
• <b>Congestion</b> : protéger le <b>réseau</b> (les routeurs). Détecté par les pertes, géré par AIMD.</div>

<h4>Exemple 3 : la vidéo YouTube, couche par couche [d91]</h4>
<ol>
  <li><b>Requête DNS</b> dans un <b>segment UDP</b> : « quelle IP pour www.youtube.com ? » → <b>réponse DNS</b> (segment UDP) : 172.217.171.238.</li>
  <li><b>Phase de négociation TCP</b> (ouverture de connexion).</li>
  <li><b>Requête HTTP</b> dans un <b>segment TCP</b> : « envoie-moi le contenu » → <b>acquittement TCP</b> de la requête.</li>
  <li><b>Réponse HTTP</b> dans un <b>segment TCP</b> : « voici le contenu » → <b>acquittement TCP</b> de la réponse.</li>
</ol>
<div class="retenir">DNS → <b>UDP</b> (rapide, petite question/réponse). HTTP → <b>TCP</b> (il faut toute la page, dans l'ordre).</div>`
    }
  ],

  questions: [
    /* --- services --- */
    { s: "services", d: 44, q: "Sur quels équipements la couche Transport est-elle implémentée ?",
      r: ["Uniquement sur les terminaux", "Sur les terminaux et les routeurs", "Uniquement sur les routeurs", "Sur les commutateurs et les points d'accès"],
      e: "Diapo 44 : les protocoles de transport fonctionnent uniquement sur les terminaux (couche de bout-en-bout)." },
    { s: "services", d: 44, q: "Que fait la couche Transport de l'émetteur avec les messages de l'application ?",
      r: ["Elle les divise en segments et les transmet à la couche Réseau", "Elle les divise en trames et les transmet à la couche Physique", "Elle choisit le chemin dans le réseau", "Elle les chiffre puis les envoie au DNS"],
      e: "Émetteur : divise les messages en segments, puis les transmet à la couche Réseau." },
    { s: "services", d: 45, q: "Quels services sont communs à UDP et TCP ?",
      r: ["Le multiplexage et la détection d'erreur", "La livraison fiable et le contrôle de congestion", "Le contrôle de flux et le multiplexage", "La garantie de délai et la détection d'erreur"],
      e: "Diapo 45 : services communs = multiplexage + détection d'erreur." },
    { s: "services", d: 45, q: "Lequel de ces services est EXCLUSIF à TCP ?",
      r: ["Le contrôle de congestion", "Le multiplexage", "La détection d'erreur", "L'utilisation de numéros de port"],
      e: "Exclusifs à TCP : livraison fiable et ordonnée, contrôle de congestion, contrôle de flux." },
    { s: "services", d: 45, q: "TCP garantit-il une qualité de service (QoS) sur les délais ou les débits ?",
      r: ["Non, ni TCP ni UDP ne garantit de QoS sur les délais ou les débits", "Oui, TCP garantit un débit minimum", "Oui, TCP garantit un délai maximum", "Seulement si le contrôle de flux est activé"],
      e: "Diapo 45 : aucun ne garantit une QoS sur les délais ou sur les débits." },
    { s: "services", d: 45, q: "Quelle part du trafic Internet TCP représente-t-il selon le CM ?",
      r: ["Entre 90 et 95 %", "Environ 50 %", "Moins de 10 %", "100 %"],
      e: "TCP représente toujours entre 90 et 95 % du trafic sur Internet." },
    { s: "services", d: 44, q: "Lequel de ces protocoles est un « nouveau » protocole de transport cité dans le CM ?",
      r: ["QUIC", "BGP", "OSPF", "DHCP"],
      e: "Diapo 44 : UDP et TCP principaux ; nouveaux protocoles : QUIC par exemple. BGP et OSPF sont du routage, DHCP de l'application." },

    /* --- multiplexage --- */
    { s: "multiplexage", d: 47, q: "Le démultiplexage répond à la question :",
      r: ["À quelle application est destiné ce segment ?", "Par quel routeur passer ensuite ?", "Combien de segments envoyer avant un ACK ?", "Quelle adresse IP attribuer à ce terminal ?"],
      e: "Démultiplexage = délivrer le segment reçu à la bonne socket, donc à la bonne application." },
    { s: "multiplexage", d: 48, q: "Le multiplexage à l'émetteur consiste à :",
      r: ["Rassembler les données des différentes sockets, les encapsuler en segments et les remettre à la couche Réseau", "Délivrer chaque segment reçu à la bonne socket", "Diviser la capacité d'un lien en créneaux fixes", "Choisir entre TCP et UDP pour chaque paquet"],
      e: "Diapo 48 : multiplexage = rassemble les données des sockets, encapsule en segments, remet à la couche Réseau." },
    { s: "multiplexage", d: 49, q: "Comment est identifiée une socket UDP ?",
      r: ["Par un doublet : @IP destination et n° de port destination", "Par un quadruplet : @IP et ports source et destination", "Par le n° de port source uniquement", "Par l'adresse IP source uniquement"],
      e: "Diapo 49 : socket UDP = doublet (@IP Dst, #port Dst)." },
    { s: "multiplexage", d: 51, q: "Comment est identifiée une socket TCP ?",
      r: ["Par un quadruplet : @IP source, port source, @IP destination, port destination", "Par un doublet : @IP destination et port destination", "Par le numéro de séquence", "Par l'adresse MAC et le port"],
      e: "Diapo 51 : socket TCP = quadruplet." },
    { s: "multiplexage", d: 49, q: "Avec UDP, plusieurs nœuds peuvent-ils émettre vers une même socket ?",
      r: ["Oui", "Non, chaque nœud a sa propre socket", "Seulement s'ils ont la même adresse IP", "Seulement si la socket est en mode duplex"],
      e: "Comme la socket UDP n'est identifiée que par la destination, tous les clients arrivent dans la même socket." },
    { s: "multiplexage", d: 51, q: "Avec TCP, plusieurs nœuds peuvent-ils émettre vers une même socket du serveur ?",
      r: ["Non, chaque nœud envoie ses segments vers une socket différente du serveur", "Oui, tous partagent la même socket", "Oui, si le port destination est le même", "Seulement en UDP-lite"],
      e: "Diapo 51 : Non ! Chaque nœud envoie ses segments vers une socket différente du serveur." },
    { s: "multiplexage", d: 50, q: "Dans un segment UDP, à quoi sert le numéro de port source ?",
      r: ["À l'éventuel chemin retour (savoir où répondre)", "À choisir la socket du destinataire", "À calculer la somme de contrôle", "À rien, il est toujours à 0"],
      e: "Le port destination sert à atteindre la socket ; le port source peut servir pour le chemin retour." },
    { s: "multiplexage", d: 52, q: "Un client B ouvre deux connexions HTTP vers le même serveur C (port 80). Qu'est-ce qui distingue ces deux connexions ?",
      r: ["Le numéro de port source", "L'adresse IP destination", "Le numéro de port destination", "L'adresse IP source"],
      e: "IP src (B), IP dst (C) et port dst (80) sont identiques ; seul le port source change (ex. 9157 et 5775) → deux quadruplets différents." },
    { s: "multiplexage", d: 53, q: "Comment le client choisit-il son numéro de port source ?",
      r: ["Souvent aléatoirement", "Il prend toujours le port 80", "Il prend le même que le port destination", "C'est l'ICANN qui le lui attribue"],
      e: "Diapo 53 : le processus client choisit (souvent aléatoirement) son numéro de port source." },
    { s: "multiplexage", d: 53, q: "Quel est le port conventionnel du DNS ?",
      r: ["53", "67", "80", "123"],
      e: "DNS : 53 (TCP ou UDP). 67/68 = DHCP, 80 = HTTP, 123 = NTP." },
    { s: "multiplexage", d: 53, q: "Quel est le port conventionnel de HTTPS ?",
      r: ["443", "80", "22", "8080"],
      e: "HTTPS : 443 (TCP). HTTP : 80." },
    { s: "multiplexage", d: 53, q: "Quel service utilise le port 22 (TCP) ?",
      r: ["SSH", "Telnet", "FTP", "SMTP"],
      e: "SSH : 22 ; Telnet : 23 ; FTP : 20 et 21 ; SMTP : 25." },
    { s: "multiplexage", d: 53, q: "Quels ports (UDP) utilise DHCP ?",
      r: ["67 et 68", "20 et 21", "161 et 162", "53 et 54"],
      e: "DHCP : 67 et 68 (UDP). 20/21 = FTP, 161/162 = SNMP." },
    { s: "multiplexage", d: 53, q: "Quel transport utilise NTP (port 123) selon le tableau du CM ?",
      r: ["UDP", "TCP", "TCP et UDP", "QUIC"],
      e: "NTP : 123 (UDP)." },

    /* --- udp --- */
    { s: "udp", d: 55, q: "Pourquoi dit-on qu'UDP est « sans connexion » ?",
      r: ["Il n'y a pas d'échange initial entre les couches Transport de l'émetteur et du récepteur", "Il n'utilise pas d'adresse IP", "Il ne passe pas par les routeurs", "Il n'utilise pas de numéros de port"],
      e: "Diapo 55 : pas d'échange initial (pas de handshake) avant l'envoi des données." },
    { s: "udp", d: 55, q: "Quelle est la taille de l'en-tête UDP ?",
      r: ["8 octets", "20 octets", "16 octets", "32 octets"],
      e: "UDP : 8 octets d'en-tête, contre 20 pour TCP (diapo 55)." },
    { s: "udp", d: 55, q: "Lequel de ces arguments N'EST PAS une raison d'utiliser UDP ?",
      r: ["UDP garantit la livraison ordonnée des messages", "Il n'y a pas d'établissement de connexion", "Son en-tête est plus léger", "L'application décide elle-même de son débit"],
      e: "UDP ne garantit ni fiabilité ni ordre. Ses atouts : + rapide, + simple, + léger, + de contrôle pour l'appli." },
    { s: "udp", d: 55, q: "Dans UDP, la détection d'erreurs (checksum) est :",
      r: ["Facultative : le champ est mis à 0 si elle n'est pas utilisée", "Obligatoire et vérifiée par chaque routeur", "Inexistante", "Remplacée par des NAK"],
      e: "Diapo 55 : détection d'erreurs pas obligatoire, fixée à 0 si pas utilisée." },
    { s: "udp", d: 56, q: "Laquelle de ces applications est citée comme utilisant UDP pour sa réactivité ?",
      r: ["DNS", "HTTP", "Le transfert de fichiers FTP", "L'e-mail SMTP"],
      e: "Diapo 56 : DNS, SNMP, RIP… nécessitent une très grande réactivité." },
    { s: "udp", d: 56, q: "Pourquoi la visioconférence utilise-t-elle souvent UDP ?",
      r: ["Car elle est tolérante aux pertes et a besoin de réactivité", "Car UDP garantit l'ordre des images", "Car UDP fait du contrôle de congestion", "Car TCP ne supporte pas la vidéo"],
      e: "Applis multimédias tolérantes aux pertes : une image perdue vaut mieux qu'une image en retard." },
    { s: "udp", d: 56, q: "Quel risque le CM associe-t-il au trafic UDP ?",
      r: ["Un risque de congestion du réseau", "Un risque de boucle de routage", "Un risque d'épuisement des numéros de port", "Un risque de duplication systématique"],
      e: "UDP n'a pas de contrôle de congestion : un trafic UDP important peut congestionner le réseau." },
    { s: "udp", d: 56, q: "Que contient le champ « Taille » de l'en-tête UDP ?",
      r: ["La taille du segment UDP en octets, en-tête inclus", "La taille des données seules, en bits", "La taille maximale autorisée (MSS)", "Le nombre de segments du message"],
      e: "Diapo 56 : taille du segment UDP en octets, en-tête inclus." },
    { s: "udp", d: 57, q: "Pour calculer la somme de contrôle UDP, l'émetteur considère le segment comme :",
      r: ["Une suite de mots de 16 bits", "Une suite d'octets", "Une suite de mots de 32 bits", "Un seul grand nombre de 64 bits"],
      e: "Diapo 57 : contenu du segment vu comme des mots de 16 bits." },
    { s: "udp", d: 57, q: "Après avoir additionné les mots de 16 bits, l'émetteur écrit dans le champ :",
      r: ["Le complément à 1 de la somme", "La somme elle-même", "Le complément à 2 de la somme", "Le XOR de tous les mots"],
      e: "Checksum = complément à 1 de la somme (inverser tous les bits)." },
    { s: "udp", d: 58, q: "Lors de l'addition des mots de 16 bits, que fait-on de la retenue du bit le plus significatif ?",
      r: ["On l'ajoute au résultat (rebouclage)", "On l'ignore", "On la place dans un 17e bit du champ", "On recommence le calcul"],
      e: "Diapo 58 : la retenue du bit le plus significatif est ajoutée au résultat." },
    { s: "udp", d: 58, q: "La somme (après rebouclage) de deux mots vaut 1011101110111100. Quelle est la somme de contrôle ?",
      r: ["0100010001000011", "1011101110111100", "0100010001000100", "1011101110111101"],
      e: "Complément à 1 = on inverse chaque bit : 1011101110111100 → 0100010001000011." },
    { s: "udp", d: 58, q: "Somme brute de deux mots de 16 bits : 11011101110111011 (17 bits). Quelle est la somme après rebouclage de la retenue ?",
      r: ["1011101110111100", "1011101110111011", "0011101110111100", "1101110111011101"],
      e: "On retire la retenue de gauche (1) et on l'ajoute : 1011101110111011 + 1 = 1011101110111100." },
    { s: "udp", d: 57, q: "Le récepteur recalcule la somme de contrôle et trouve la même valeur. Peut-il être absolument certain qu'il n'y a pas d'erreur ?",
      r: ["Non, certaines erreurs peuvent se compenser et passer inaperçues", "Oui, la somme de contrôle détecte toutes les erreurs", "Oui, si le segment fait moins de 8 octets", "Non, car UDP ne vérifie jamais la somme"],
      e: "Diapo 57 : « absolument certain ? » — non. Ex : deux bits inversés en sens contraire au même rang dans deux mots." },

    /* --- rdt --- */
    { s: "rdt", d: 60, q: "Que signifie « rdt » ?",
      r: ["Reliable data transfer (transfert de données fiable)", "Routing data table", "Remote data transport", "Retransmission delay timer"],
      e: "rdt = reliable data transfer ; udt = unreliable data transfer." },
    { s: "rdt", d: 61, q: "Quelle fonction est appelée par la couche Application pour envoyer des données au protocole fiable ?",
      r: ["rdt_send()", "udt_send()", "rdt_rcv()", "udt_rcv()"],
      e: "rdt_send : sollicité par la couche 5. udt_send : appelé par rdt pour envoyer sur le canal non fiable." },
    { s: "rdt", d: 61, q: "De quoi dépend la complexité du protocole rdt ?",
      r: ["Des caractéristiques du canal sous-jacent", "Du nombre d'applications sur la machine", "De la taille de la table de routage", "Du numéro de port choisi"],
      e: "Diapo 61 : la complexité du protocole rdt dépend des caractéristiques du canal." },
    { s: "rdt", d: 62, q: "Comment le CM décrit-il les protocoles rdt ?",
      r: ["Par des automates à nombre d'états finis", "Par des tables de routage", "Par des chronogrammes uniquement", "Par du pseudo-code Python"],
      e: "Diapo 62 : description par des automates à nombre d'états finis (événements → transitions + actions)." },
    { s: "rdt", d: 63, q: "Quelle hypothèse fait rdt 1.0 sur le canal ?",
      r: ["Canal totalement fiable : ni erreur binaire, ni perte", "Canal avec erreurs binaires", "Canal avec pertes uniquement", "Canal avec erreurs et pertes"],
      e: "rdt 1.0 : transfert fiable sur canal fiable." },
    { s: "rdt", d: 64, q: "Quels mécanismes rdt 2.0 introduit-il pour gérer les erreurs binaires ?",
      r: ["Somme de contrôle, ACK/NAK et retransmission", "Timer et numéro de séquence", "Fenêtre d'anticipation et buffer", "Uniquement la somme de contrôle"],
      e: "rdt 2.0 : (a) détection (checksum), (b) accusé de réception ACK/NAK, (c) retransmission à la réception d'un NAK." },
    { s: "rdt", d: 64, q: "Que signifie un NAK ?",
      r: ["Le destinataire informe l'expéditeur que le paquet reçu comporte une erreur", "Le paquet a été bien reçu", "Le timer a expiré", "Le paquet est un duplicata"],
      e: "NAK = acquittement négatif : le paquet comporte une erreur." },
    { s: "rdt", d: 64, q: "Qu'est-ce qu'un protocole « send and wait » ?",
      r: ["L'expéditeur émet un paquet puis attend un ACK/NAK avant d'émettre le suivant", "L'expéditeur émet tous ses paquets puis attend les ACK", "Le destinataire attend d'avoir tous les paquets avant de répondre", "L'expéditeur attend un timeout entre chaque paquet"],
      e: "Diapo 64 : l'expéditeur émet un paquet… puis se met en attente d'un ACK/NAK." },
    { s: "rdt", d: 68, q: "Quel est le problème principal de rdt 2.0 ?",
      r: ["Si un ACK ou un NAK arrive erroné, l'expéditeur ne sait pas si son paquet est bien arrivé", "Il ne détecte pas les erreurs binaires", "Il ne retransmet jamais", "Il utilise trop de numéros de séquence"],
      e: "Diapo 68 : que se passe-t-il si un ACK ou NAK arrive erroné ?" },
    { s: "rdt", d: 68, q: "Pourquoi ne peut-on pas simplement retransmettre le dernier paquet quand l'ACK/NAK est illisible (sans autre mécanisme) ?",
      r: ["Le destinataire ne pourrait pas distinguer un duplicata d'une nouvelle donnée", "Le canal refuserait le paquet", "Cela créerait une boucle de routage", "La somme de contrôle deviendrait fausse"],
      e: "Une appli peut délivrer deux paquets identiques : sans n° de séquence, impossible de savoir si c'est un doublon." },
    { s: "rdt", d: 69, q: "Combien de bits suffisent pour le numéro de séquence dans un protocole « send and wait » ?",
      r: ["1 bit", "8 bits", "16 bits", "32 bits"],
      e: "Diapo 69 : un bit suffit (on alterne 0 et 1)." },
    { s: "rdt", d: 69, q: "Dans rdt 2.1, où se trouve le numéro de séquence ?",
      r: ["Uniquement dans les paquets de données (pas dans les ACK/NAK)", "Uniquement dans les ACK", "Dans les paquets et dans les ACK/NAK", "Dans l'en-tête IP"],
      e: "Diapo 69 : uniquement dans le paquet (pas dans les ACK/NAKs)." },
    { s: "rdt", d: 69, q: "Dans rdt 2.1, que fait le destinataire s'il reçoit un duplicata ?",
      r: ["Il supprime le segment (et renvoie un ACK)", "Il le livre à l'application", "Il envoie un NAK", "Il arrête la connexion"],
      e: "Si un duplicata arrive, le segment est supprimé ; le destinataire renvoie un ACK (l'acquittement précédent avait été abîmé)." },
    { s: "rdt", d: 71, q: "Pourquoi les automates de rdt 2.1 ont-ils deux fois plus d'états que ceux de rdt 2.0 ?",
      r: ["Pour mémoriser si le numéro de séquence du paquet courant vaut 0 ou 1", "Pour gérer le timer", "Pour gérer deux connexions en parallèle", "Pour gérer la fenêtre d'anticipation"],
      e: "Diapo 71 : on double les états pour mémoriser si le n° de séquence courant vaut 0 ou 1." },
    { s: "rdt", d: 73, q: "Dans rdt 2.2 (sans NAK), que reçoit l'expéditeur qui équivaut à un NAK ?",
      r: ["Deux ACK identiques", "Un ACK numéroté 0", "Un timeout", "Un paquet de données"],
      e: "Recevoir 2 ACK identiques ⇔ recevoir 1 NAK → retransmission du paquet courant." },
    { s: "rdt", d: 73, q: "Dans rdt 2.2, que doit contenir chaque ACK ?",
      r: ["Le numéro de séquence du paquet dont il accuse la bonne réception", "Le nombre d'octets restant dans le buffer", "La somme de contrôle du paquet suivant", "Rien de plus qu'en rdt 2.1"],
      e: "Les ACK doivent être numérotés : le destinataire inclut le #séquence du paquet bien reçu." },
    { s: "rdt", d: 74, q: "Quel nouveau mécanisme rdt 3.0 ajoute-t-il pour faire face aux pertes ?",
      r: ["Un temporisateur (timer)", "Un numéro de séquence", "Une somme de contrôle", "Le NAK"],
      e: "Diapo 74 : avec des pertes, checksum + n° séquence + ACK + retransmission ne suffisent pas → timer." },
    { s: "rdt", d: 74, q: "Dans rdt 3.0, que fait l'expéditeur s'il reçoit un ACK erroné ou un ACK qui n'est pas celui attendu ?",
      r: ["Rien : il laisse le timer gérer le problème", "Il retransmet immédiatement", "Il envoie un NAK", "Il double la taille de sa fenêtre"],
      e: "Diapo 74 : si ACK en erreur ou pas le bon ACK attendu → pas de réaction, on laisse le timer gérer." },
    { s: "rdt", d: 77, q: "En rdt 3.0, le timer expire alors que l'ACK était seulement en retard. Que se passe-t-il ?",
      r: ["Le paquet est retransmis ; le destinataire détecte le duplicata grâce au n° de séquence", "Le paquet est perdu définitivement", "La connexion est fermée", "Le destinataire livre deux fois les données à l'application"],
      e: "Cas d) expiration prématurée : duplicata créé, mais géré grâce au n° de séquence." },
    { s: "rdt", d: 78, q: "Parmi les « pièces maîtresses » d'un transport fiable, à quoi sert le numéro de séquence ?",
      r: ["Détecter les duplicatas et les erreurs sur les ACK", "Détecter les erreurs binaires", "Gérer les pertes de paquets", "Choisir le port destination"],
      e: "Diapo 78 : checksum → erreurs ; ACK/NAK → boucle de contrôle ; #séquence → duplicatas et erreurs sur ACK ; timer → pertes." },
    { s: "rdt", d: 78, q: "Parmi les « pièces maîtresses » d'un transport fiable, laquelle gère les pertes de paquets ?",
      r: ["Le timer", "La somme de contrôle", "Le numéro de séquence", "Le NAK"],
      e: "Timer → pertes de paquets." },

    /* --- performances --- */
    { s: "performances", d: 79, q: "Pourquoi les performances de rdt 3.0 sont-elles mauvaises ?",
      r: ["À cause de l'approche « send and wait »", "À cause de la somme de contrôle trop lente", "À cause du numéro de séquence sur 1 bit uniquement", "Car il n'utilise pas d'ACK"],
      e: "Diapo 79 : protocole fonctionnel mais performances ☹ à cause du send and wait." },
    { s: "performances", d: 79, q: "Lien à 1 Gb/s, paquet de 1 Ko (8 000 bits). Temps d'émission ?",
      r: ["8 µs", "8 ms", "1 µs", "80 µs"],
      e: "8 000 / 10⁹ = 8 × 10⁻⁶ s = 8 µs." },
    { s: "performances", d: 79, q: "En « send and wait », l'utilisation U du lien vaut :",
      r: ["t_émission / (t_émission + 2 × d_propag)", "t_émission / d_propag", "2 × d_propag / t_émission", "C / L"],
      e: "On émet pendant t_émission puis on attend l'aller (paquet) et le retour (ACK) : 2 × d_propag." },
    { s: "performances", d: 79, q: "Avec U ≈ 2,7 × 10⁻⁴ sur un lien de 1 Gb/s, quel est le débit utile ?",
      r: ["Environ 270 kb/s", "Environ 270 Mb/s", "Environ 2,7 Gb/s", "Environ 27 b/s"],
      e: "Débit utile = U × C = 2,7×10⁻⁴ × 10⁹ = 270 000 b/s = 270 kb/s." },

    /* --- pipeline --- */
    { s: "pipeline", d: 80, q: "Qu'est-ce que la fenêtre d'anticipation ?",
      r: ["Le nombre de paquets que l'expéditeur peut transmettre à la suite sans attendre les ACK", "Le temps maximum avant un timeout", "La taille du buffer du routeur", "Le nombre de routeurs traversés"],
      e: "Diapo 80 : ce nombre de paquets (envoyés sans attendre d'accusé) = fenêtre d'anticipation." },
    { s: "pipeline", d: 80, q: "Quelle est la taille de la fenêtre d'anticipation d'un protocole « send and wait » ?",
      r: ["1", "0", "2", "Illimitée"],
      e: "On n'envoie qu'un seul paquet avant d'attendre son ACK : W = 1." },
    { s: "pipeline", d: 81, q: "Avec une fenêtre glissante de taille W = 3 et un message de 4 segments, quand le segment 4 peut-il partir ?",
      r: ["Dès l'arrivée de l'ACK 1", "Seulement après les ACK 1, 2 et 3", "Immédiatement avec les 3 autres", "Après un timeout"],
      e: "La fenêtre glisse d'un cran à chaque ACK : l'arrivée de l'ACK 1 déclenche le départ du segment 4." },
    { s: "pipeline", d: 81, q: "Pourquoi parle-t-on de fenêtre « glissante » et non « sautante » ?",
      r: ["Elle avance d'un cran à chaque ACK, sans attendre que toute la fenêtre soit acquittée", "Elle saute directement au dernier segment", "Elle change de taille à chaque paquet", "Elle se déplace entre émetteur et récepteur"],
      e: "Glissante : chaque ACK fait avancer la fenêtre d'une position." },
    { s: "pipeline", d: 82, q: "Lequel de ces points est un INCONVÉNIENT des protocoles à anticipation ?",
      r: ["Le déséquencement possible des segments", "Une moins bonne utilisation du réseau", "La suppression des numéros de séquence", "L'impossibilité de retransmettre"],
      e: "Diapo 82 : meilleure utilisation, mais déséquencement, besoin de buffer, gamme de #séquence plus grande." },
    { s: "pipeline", d: 82, q: "Le buffer d'émission est-il nécessaire dans un protocole à anticipation ?",
      r: ["Oui, pour sauvegarder les segments en cas de retransmission", "Non, jamais", "Seulement en Go-Back-N", "Seulement avec UDP"],
      e: "Diapo 82 : buffer émission → oui, pour sauvegarder les segments en cas de retransmission." },
    { s: "pipeline", d: 82, q: "Le buffer de réception est-il nécessaire dans un protocole à anticipation ?",
      r: ["Non, mais il permet de sauvegarder les segments déséquencés", "Oui, toujours, sinon rien ne fonctionne", "Oui, pour calculer la somme de contrôle", "Non, et il est interdit"],
      e: "Diapo 82 : non mais peut sauvegarder les segments déséquencés (c'est le rejet sélectif)." },
    { s: "pipeline", d: 83, q: "Le « Selective Repeat » correspond à :",
      r: ["Le rejet sélectif : un buffer par connexion garde les paquets déséquencés", "Le rejet simple : aucun buffer, seuls les paquets en ordre sont acceptés", "Le send and wait", "Le contrôle de congestion"],
      e: "Rejet sélectif = Selective Repeat = avec buffer de reséquencement." },
    { s: "pipeline", d: 83, q: "Le « Go-Back-N » correspond à :",
      r: ["Le rejet simple : pas de buffer, seuls les paquets bien séquencés sont acceptés", "Le rejet sélectif : les paquets déséquencés sont gardés en buffer", "Une retransmission sélective d'un seul paquet", "Un protocole de routage"],
      e: "Rejet simple = Go-Back-N = pas de buffer côté transport du récepteur." },
    { s: "pipeline", d: 83, q: "En rejet simple (Go-Back-N), le récepteur attend le segment 3 et reçoit le segment 4. Que fait-il ?",
      r: ["Il rejette le segment 4", "Il garde le 4 en buffer en attendant le 3", "Il livre le 4 à l'application", "Il envoie un NAK pour le 5"],
      e: "Sans buffer, seuls les paquets bien séquencés sont acceptés : le 4 est rejeté et devra être réémis." },
    { s: "pipeline", d: 83, q: "En rejet sélectif, les segments arrivent dans l'ordre 1, 2, 4, 3. Quand le segment 4 est-il livré à l'application ?",
      r: ["Juste après le segment 3, une fois celui-ci arrivé", "Immédiatement à son arrivée, avant le 3", "Jamais, il est rejeté", "Après un timeout"],
      e: "Le 4 attend dans le buffer ; dès que le 3 arrive, on livre 3 puis 4, dans l'ordre." },

    /* --- congestion --- */
    { s: "congestion", d: 85, q: "Qu'est-ce qui provoque une congestion ?",
      r: ["Un trafic soumis (charge) trop important par rapport aux ressources du réseau", "Un délai de propagation trop long", "Une somme de contrôle erronée", "L'utilisation d'UDP uniquement"],
      e: "Diapo 85 : ressources limitées + charge trop importante → files, retards, pertes = congestion." },
    { s: "congestion", d: 86, q: "Comment TCP détecte-t-il une congestion ?",
      r: ["Par la perte de paquets, détectée par un timeout ou 3 ACK identiques", "Grâce à un message explicite envoyé par les routeurs", "En mesurant la taille des buffers des routeurs", "Par une alerte du serveur DNS"],
      e: "Diapo 86 : sans assistance du réseau, uniquement depuis les terminaux, via les pertes (timeout ou 3 ACK identiques)." },
    { s: "congestion", d: 86, q: "Une perte de paquet est-elle toujours due à une congestion ?",
      r: ["Non, les pertes ne sont pas toujours dues à une congestion", "Oui, toujours", "Oui, sauf sur la fibre optique", "Non, une perte n'est jamais due à une congestion"],
      e: "Hypothèse : congestion ⇒ pertes. L'inverse est faux (ex. erreurs sur un lien radio)." },
    { s: "congestion", d: 87, q: "Comment TCP réduit-il son débit lorsqu'il détecte une congestion ?",
      r: ["En réduisant la taille de sa fenêtre d'anticipation", "En augmentant la taille de ses segments", "En passant en UDP", "En changeant de port source"],
      e: "Diapo 87 : détection → réduction de la fenêtre d'anticipation → réduction du débit." },
    { s: "congestion", d: 88, q: "Sur un lien de capacité C partagé avec du trafic concurrent, quel débit une source TCP devrait-elle viser ?",
      r: ["La capacité résiduelle (disponible)", "La capacité C entière", "C divisé par 2", "Le débit du flux concurrent"],
      e: "Diapo 88 : lien partagé → capacité résiduelle, une quantité inconnue et dynamique." },
    { s: "congestion", d: 89, q: "Que signifie AIMD ?",
      r: ["Additive Increase Multiplicative Decrease", "Automatic Internet Message Delivery", "Adaptive Increase Maximum Delay", "Acknowledged Input Multiple Data"],
      e: "Hausse additive, baisse multiplicative." },
    { s: "congestion", d: 89, q: "Dans AIMD, que fait TCP lors d'une perte (baisse multiplicative) ?",
      r: ["Il divise la taille de sa fenêtre par 2", "Il remet sa fenêtre à 1", "Il retire 1 segment à sa fenêtre", "Il double sa fenêtre"],
      e: "Diapo 89 : baisse multiplicative = diviser la taille de la fenêtre d'anticipation par 2." },
    { s: "congestion", d: 89, q: "Selon le CM, comment se fait la hausse additive ?",
      r: ["La fenêtre augmente d'1 segment après chaque ACK reçu", "La fenêtre double après chaque ACK", "La fenêtre augmente de 2 segments par timeout", "La fenêtre augmente de 50 % par RTT"],
      e: "Diapo 89 : augmenter la taille de la fenêtre d'1 segment après chaque ACK reçu." },
    { s: "congestion", d: 89, q: "Comment évolue la taille de la fenêtre TCP avec AIMD au cours du temps ?",
      r: ["En dents de scie", "De façon constante", "En croissance exponentielle infinie", "En escalier qui ne redescend jamais"],
      e: "Montée progressive, chute par 2 à chaque perte, puis remontée : dents de scie." },
    { s: "congestion", d: 89, q: "Comment TCP sait-il qu'il a atteint le débit maximum supporté par le chemin ?",
      r: ["Une perte se produit", "Le routeur lui envoie la capacité disponible", "Le destinataire lui indique la capacité du lien", "Le RTT devient nul"],
      e: "Diapo 89 : comment savoir qu'on a atteint le max ? Une perte se produit." },

    /* --- tcp --- */
    { s: "tcp", d: 90, q: "Que signifie « orienté connexion » pour TCP ?",
      r: ["Un échange d'informations (handshaking) a lieu au début pour fixer les paramètres du transfert", "Les paquets suivent tous un circuit réservé", "TCP ne fonctionne que sur des liens filaires", "Chaque segment est envoyé à plusieurs destinataires"],
      e: "Diapo 90 : handshaking au début, expéditeur et destinataire fixent les paramètres." },
    { s: "tcp", d: 90, q: "Que signifie « mode duplex » pour TCP ?",
      r: ["Les données peuvent circuler dans les deux sens", "Chaque segment est envoyé deux fois", "TCP utilise deux ports par connexion", "TCP fonctionne avec deux destinataires"],
      e: "Duplex : données dans les deux sens." },
    { s: "tcp", d: 90, q: "TCP est « point-à-point ». Cela signifie :",
      r: ["Une connexion relie un expéditeur et un destinataire", "Chaque routeur acquitte les segments", "Les segments sont diffusés à tout le réseau", "La connexion passe par un seul lien"],
      e: "Point-à-point : entre un expéditeur et un destinataire (pas de multicast)." },
    { s: "tcp", d: 90, q: "Que désigne le MSS ?",
      r: ["La taille maximale des données d'un segment, hors en-tête", "La taille maximale d'un segment, en-tête inclus", "Le délai maximum avant timeout", "La taille maximale de la fenêtre"],
      e: "MSS = Maximum Segment Size, hors en-tête." },
    { s: "tcp", d: 90, q: "Qu'est-ce que le contrôle de flux de TCP ?",
      r: ["Le destinataire indique le nombre d'octets qu'il peut recevoir sans surcharger son buffer", "TCP réduit sa fenêtre quand le réseau est congestionné", "Les routeurs limitent le débit de chaque flux", "TCP vérifie la somme de contrôle de chaque flux"],
      e: "Contrôle de flux = protéger le buffer du destinataire. (Réduire sa fenêtre face au réseau = contrôle de congestion.)" },
    { s: "tcp", d: 90, q: "Quelle est la différence entre contrôle de flux et contrôle de congestion ?",
      r: ["Le flux protège le destinataire, la congestion protège le réseau", "Le flux protège le réseau, la congestion protège le destinataire", "Ce sont deux noms pour le même mécanisme", "Le flux concerne UDP, la congestion TCP"],
      e: "Flux : le récepteur annonce sa capacité. Congestion : la source s'adapte à la capacité disponible du réseau." },
    { s: "tcp", d: 90, q: "Pourquoi dit-on que TCP est « pipeliné » ?",
      r: ["Parce qu'il utilise une fenêtre d'anticipation dynamique", "Parce que chaque segment passe par un tuyau dédié", "Parce qu'il fonctionne en send and wait", "Parce qu'il n'utilise pas d'ACK"],
      e: "Diapo 90 : pipeliné — la fenêtre d'anticipation est dynamique." },
    { s: "tcp", d: 91, q: "Dans l'exemple 3 (vidéo YouTube), dans quel type de segment la requête DNS est-elle transportée ?",
      r: ["Un segment UDP", "Un segment TCP", "Une trame Wi-Fi uniquement", "Un datagramme BGP"],
      e: "Diapo 91 : requête DNS : segment UDP ; requête HTTP : segment TCP." },
    { s: "tcp", d: 91, q: "Dans l'exemple 3, que se passe-t-il juste avant l'envoi de la requête HTTP ?",
      r: ["Une phase de négociation TCP", "Une requête DHCP", "Une annonce BGP", "Un calcul de Dijkstra par le client"],
      e: "TCP est orienté connexion : phase de négociation, puis requête HTTP dans un segment TCP." }
  ]
});
