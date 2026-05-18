import type { Question } from './types'

export const MODULO_4_QUIZ: Question[] = [
  {
    kind: 'mc',
    question:
      'Qual è la proprietà fondamentale del content addressing usato in IPFS?',
    choices: [
      {
        id: 'a',
        text: 'L’indirizzo (CID) di un file è derivato dal suo contenuto, non dalla sua posizione',
      },
      { id: 'b', text: 'I file sono indicizzati per nome utente' },
      { id: 'c', text: 'L’indirizzo cambia ogni volta che il file viene replicato' },
      { id: 'd', text: 'Solo i nodi autorizzati possono generare CID' },
    ],
    correctId: 'a',
    explanation:
      'Il CID è la rappresentazione del Merkle hash del contenuto. Qualsiasi modifica al contenuto produce un CID diverso, e copie identiche hanno lo stesso CID indipendentemente da dove risiedono.',
  },
  {
    kind: 'tf',
    question:
      'IPFS usa una variante di Kademlia (S/Kademlia) per il lookup dei content provider.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'In un Merkle DAG di IPFS, dividere un file in chunk produce:',
    choices: [
      { id: 'a', text: 'un unico CID che identifica l’intero file' },
      { id: 'b', text: 'più CID, uno per chunk, riferiti da un nodo "directory"' },
      { id: 'c', text: 'una blockchain interna a IPFS' },
      { id: 'd', text: 'una sequenza ordinata di transazioni' },
    ],
    correctId: 'b',
    explanation:
      'Ogni chunk ha il suo CID; un nodo aggregatore (root DAG node) riferisce i chunk in ordine. Il CID della root identifica l’intero file.',
  },
  {
    kind: 'mc',
    question:
      'Una stablecoin algoritmica come DAI mantiene il peg al dollaro principalmente tramite:',
    choices: [
      { id: 'a', text: 'Riserve in dollari custodite da una banca' },
      {
        id: 'b',
        text: 'Sovracollateralizzazione in altri asset crypto + meccanismi di liquidazione',
      },
      { id: 'c', text: 'Decisioni di una banca centrale on-chain' },
      { id: 'd', text: 'Bruciatura periodica del 50% dei token' },
    ],
    correctId: 'b',
    explanation:
      'DAI è collateralized via vault in ETH (e altri asset). Se il rapporto di collateralizzazione scende sotto la soglia, il vault viene liquidato per mantenere la sopravvalutazione del peg.',
  },
  {
    kind: 'tf',
    question:
      'Un "flash loan" è un prestito che deve essere restituito entro la stessa transazione, altrimenti la transazione viene revertita.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'In un servizio di lending decentralizzato (Aave-like), gli interessi pagati dai borrower:',
    choices: [
      { id: 'a', text: 'vanno al team di sviluppo del protocollo' },
      { id: 'b', text: 'vanno principalmente ai lender (depositanti dello stesso asset)' },
      { id: 'c', text: 'vengono bruciati' },
      { id: 'd', text: 'sono devoluti in beneficenza' },
    ],
    correctId: 'b',
    explanation:
      'I lender depositano in un pool e ricevono una quota proporzionale degli interessi versati dai borrower. Una piccola percentuale può andare a una treasury del protocollo.',
  },
  {
    kind: 'mc',
    question:
      'L’oracolo di un protocollo DeFi serve a:',
    choices: [
      { id: 'a', text: 'predire il prezzo futuro degli asset' },
      {
        id: 'b',
        text: 'portare on-chain dati esterni (es. prezzi di mercato) altrimenti non accessibili dagli smart contract',
      },
      { id: 'c', text: 'cifrare le chiavi private degli utenti' },
      { id: 'd', text: 'eseguire gli smart contract in modo deterministico' },
    ],
    correctId: 'b',
    explanation:
      'Gli oracoli risolvono il problema: gli smart contract sono deterministici e non possono accedere al mondo esterno. Es. Chainlink fornisce price feeds verificati.',
  },
  {
    kind: 'tf',
    question:
      'I CID di IPFS contengono il tipo di hash usato (multihash) e il codec dei dati, per essere estensibili.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'In un sistema di tracciabilità supply chain on-chain, l’uso della blockchain è giustificato principalmente quando:',
    choices: [
      { id: 'a', text: 'I dati devono essere veloci da scrivere' },
      {
        id: 'b',
        text: 'Più attori non fidati devono concordare su uno storico immutabile',
      },
      { id: 'c', text: 'Si vuole risparmiare in costi di storage' },
      { id: 'd', text: 'Non c’è connessione internet' },
    ],
    correctId: 'b',
    explanation:
      'Se gli attori non si fidano l’uno dell’altro ma necessitano di consenso sullo stato, la blockchain offre un registro condiviso senza autorità centrale.',
  },
  {
    kind: 'mc',
    question:
      'Una identità decentralizzata (DID) come quelle definite dal W3C:',
    choices: [
      { id: 'a', text: 'è un account creato da un governo' },
      {
        id: 'b',
        text: 'è un identificatore controllato dall’utente, non vincolato a un fornitore centrale',
      },
      { id: 'c', text: 'richiede sempre una blockchain pubblica' },
      { id: 'd', text: 'è uguale a un wallet Bitcoin' },
    ],
    correctId: 'b',
    explanation:
      'Un DID è un URI controllato dall’utente che risolve a un Document contenente metodi di verifica. Può vivere su varie infrastrutture, anche non blockchain.',
  },
]
