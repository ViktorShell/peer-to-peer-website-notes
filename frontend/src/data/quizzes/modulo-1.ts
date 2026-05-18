import type { Question } from './types'

export const MODULO_1_QUIZ: Question[] = [
  {
    kind: 'mc',
    question:
      'Quale di queste è una caratteristica esclusiva di Kademlia rispetto a Chord?',
    choices: [
      { id: 'a', text: 'Le finger table sono ordinate sull’anello' },
      {
        id: 'b',
        text: 'La metrica di routing (XOR) è simmetrica, quindi entrambi i peer apprendono dalla query',
      },
      { id: 'c', text: 'I peer scoprono la rete tramite un server centrale' },
      { id: 'd', text: 'Usa SHA-1 per assegnare le chiavi ai nodi' },
    ],
    correctId: 'b',
    explanation:
      'La simmetria di XOR — d(x,y)=d(y,x) — permette a entrambi i nodi di una richiesta di apprendere routing info. In Chord questo non vale.',
  },
  {
    kind: 'tf',
    question:
      'Nelle reti non strutturate come Gnutella, la ricerca per parola chiave è efficiente (O(log n)).',
    answer: false,
    explanation:
      'Senza struttura non c’è garanzia logaritmica: si usa flooding limitato dal TTL, e la query può non trovare il contenuto anche se esiste.',
  },
  {
    kind: 'mc',
    question: 'In una DHT con consistent hashing, aggiungere un nodo richiede di rimappare:',
    choices: [
      { id: 'a', text: 'tutte le chiavi' },
      { id: 'b', text: 'circa metà delle chiavi' },
      { id: 'c', text: 'in media K/N chiavi, dove K è il totale e N il numero di nodi' },
      { id: 'd', text: 'nessuna chiave' },
    ],
    correctId: 'c',
    explanation:
      'Il consistent hashing è progettato così: in media solo K/N chiavi si spostano quando un nodo entra o esce.',
  },
  {
    kind: 'mc',
    question:
      'In Kademlia, la routing table è organizzata in k-buckets dove ciascun bucket contiene:',
    choices: [
      { id: 'a', text: 'fino a k peer con distanza XOR in un intervallo [2^i, 2^(i+1))' },
      { id: 'b', text: 'i k vicini più vicini per id numerico' },
      { id: 'c', text: 'i peer che hanno fatto query nelle ultime k epoche' },
      { id: 'd', text: 'i peer randomicamente selezionati ad ogni ping' },
    ],
    correctId: 'a',
    explanation:
      'Ogni i-esimo bucket raccoglie peer la cui distanza XOR cade nell’intervallo [2^i, 2^(i+1)), fino a un massimo di k entry.',
  },
  {
    kind: 'tf',
    question:
      'La metrica XOR è una metrica formale (riflessività, simmetria, disuguaglianza triangolare).',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'Quale proprietà di un Merkle tree lo rende adatto alle prove di inclusione efficienti?',
    choices: [
      { id: 'a', text: 'È un albero rosso-nero auto-bilanciato' },
      { id: 'b', text: 'La proof di inclusione ha dimensione O(log n)' },
      { id: 'c', text: 'Ogni nodo memorizza la chiave del nodo successivo' },
      { id: 'd', text: 'L’hash della radice cambia in modo prevedibile' },
    ],
    correctId: 'b',
    explanation:
      'Per dimostrare che una foglia appartiene all’albero servono solo log(n) hash (quelli dei fratelli lungo il percorso fino alla radice).',
  },
  {
    kind: 'mc',
    question: 'Quale è il principale vantaggio del parallel routing in Kademlia?',
    choices: [
      { id: 'a', text: 'Riduce la dimensione della routing table' },
      { id: 'b', text: 'Tollera meglio nodi lenti o offline, riducendo timeout' },
      { id: 'c', text: 'Permette di evitare la replicazione dei dati' },
      { id: 'd', text: 'Garantisce ordine totale nelle scritture' },
    ],
    correctId: 'b',
    explanation:
      'Lanciando α (tipicamente 3) richieste in parallelo, basta che una risponda velocemente per progredire nella ricerca.',
  },
  {
    kind: 'tf',
    question:
      'La firma digitale RSA dimostra che il firmatario conosce la chiave pubblica corrispondente.',
    answer: false,
    explanation:
      'La firma dimostra il possesso della chiave **privata**. La chiave pubblica serve solo per verificarla.',
  },
  {
    kind: 'mc',
    question: 'Cosa è una funzione hash crittografica "preimage resistant"?',
    choices: [
      { id: 'a', text: 'Dato y è infattibile trovare x tale che H(x) = y' },
      { id: 'b', text: 'Dato x è infattibile trovare y tale che H(y) = H(x)' },
      { id: 'c', text: 'È infattibile trovare due input distinti con lo stesso hash' },
      { id: 'd', text: 'L’output è uniformemente distribuito' },
    ],
    correctId: 'a',
    explanation:
      'Preimage resistance = data l’uscita, trovare un input che la produca è infattibile. (b) è second-preimage; (c) è collision resistance.',
  },
  {
    kind: 'tf',
    question:
      'In Kademlia, due ricerche dello stesso identificatore convergono sempre allo stesso percorso, abilitando caching lungo la rotta.',
    answer: true,
    explanation:
      'Grazie alla unidirezionalità di XOR: per ogni nodo x e distanza Δ esiste un unico y con d(x,y)=Δ.',
  },
  {
    kind: 'mc',
    question:
      'In una rete P2P pura come BitTorrent originale, quale ruolo svolge il tracker?',
    choices: [
      { id: 'a', text: 'Memorizza tutti i file condivisi' },
      { id: 'b', text: 'Coordina la lista dei peer che stanno scaricando/seedando un torrent' },
      { id: 'c', text: 'Decifra i pacchetti tra peer' },
      { id: 'd', text: 'Esegue i protocolli di consenso' },
    ],
    correctId: 'b',
    explanation:
      'Il tracker tradizionale mantiene solo la lista dei peer attivi per ogni info_hash; il trasferimento dati avviene direttamente tra peer.',
  },
  {
    kind: 'tf',
    question:
      'Un Merkle DAG, come quello usato in IPFS, permette di rappresentare strutture arbitrariamente nidificate (file, directory, blocchi) mantenendo content addressing.',
    answer: true,
  },
]
