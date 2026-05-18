import type { Question } from './types'

export const MODULO_3_QUIZ: Question[] = [
  {
    kind: 'mc',
    question:
      'Quale è la differenza fondamentale tra il modello di stato di Bitcoin e quello di Ethereum?',
    choices: [
      { id: 'a', text: 'Bitcoin usa account, Ethereum usa UTXO' },
      { id: 'b', text: 'Bitcoin usa UTXO, Ethereum usa account-based state' },
      { id: 'c', text: 'Entrambi usano UTXO, ma con hash diversi' },
      { id: 'd', text: 'Entrambi usano account, ma con script diversi' },
    ],
    correctId: 'b',
  },
  {
    kind: 'mc',
    question:
      'In Ethereum, cosa rappresenta il "gas price" specificato in una transazione?',
    choices: [
      { id: 'a', text: 'Il prezzo in dollari del gas' },
      {
        id: 'b',
        text: 'Quanto ETH l’utente è disposto a pagare per unità di gas',
      },
      { id: 'c', text: 'Il numero di opcodes consumati dalla transazione' },
      { id: 'd', text: 'La velocità di propagazione della transazione' },
    ],
    correctId: 'b',
    explanation:
      'Il gas price è la "tariffa per unità di lavoro". Il costo totale è gas usati × gas price.',
  },
  {
    kind: 'tf',
    question:
      'In Solidity, lo storage di un contratto persiste tra le diverse chiamate al contratto.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'Quale standard ERC è progettato per token non fungibili come opere d’arte digitali?',
    choices: [
      { id: 'a', text: 'ERC-20' },
      { id: 'b', text: 'ERC-721' },
      { id: 'c', text: 'ERC-777' },
      { id: 'd', text: 'ERC-1820' },
    ],
    correctId: 'b',
    explanation:
      'ERC-721 è lo standard NFT: ogni token ha tokenId unico e metadati propri.',
  },
  {
    kind: 'mc',
    question:
      'Una reentrancy attack contro un contratto Solidity sfrutta principalmente:',
    choices: [
      { id: 'a', text: 'Un overflow dell’aritmetica intera' },
      {
        id: 'b',
        text: 'La possibilità di richiamare il contratto vittima prima che lo stato venga aggiornato',
      },
      { id: 'c', text: 'Una collisione di hash SHA-256' },
      { id: 'd', text: 'L’assenza di "private" sui campi del contratto' },
    ],
    correctId: 'b',
    explanation:
      'Pattern classico: il contratto vittima invia ETH prima di aggiornare il proprio stato; il chiamante (malevolo) ri-entra prelevando ancora prima dell’aggiornamento.',
  },
  {
    kind: 'tf',
    question:
      'L’attacco "the DAO" del 2016 fu una reentrancy attack che portò ad un hard fork di Ethereum.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'In Ethereum 2.0 (PoS), un validatore può essere "slashed" quando:',
    choices: [
      { id: 'a', text: 'Resta offline per un’epoca' },
      { id: 'b', text: 'Firma attestazioni o blocchi contraddittori' },
      { id: 'c', text: 'Ha uno stake inferiore a 1 ETH' },
      { id: 'd', text: 'Non risponde ad un beacon node entro 1 minuto' },
    ],
    correctId: 'b',
    explanation:
      'Slashing punisce comportamenti malevoli verificabili (double-vote, surround vote, blocchi conflittuali). L’inattività è penalizzata con un calo lento (inactivity leak), non lo slashing.',
  },
  {
    kind: 'mc',
    question:
      'Cosa cambia EIP-1559 nel modello di fee di Ethereum?',
    choices: [
      { id: 'a', text: 'Rende le fee gratuite' },
      {
        id: 'b',
        text: 'Introduce una base fee bruciata e una tip opzionale per il validatore',
      },
      { id: 'c', text: 'Permette di pagare in ERC-20 invece di ETH' },
      { id: 'd', text: 'Elimina il gas dalle transazioni' },
    ],
    correctId: 'b',
    explanation:
      'EIP-1559: base fee dinamica (bruciata, rendendo ETH deflazionario) + tip volontaria per il validatore. La fee totale è prevedibile.',
  },
  {
    kind: 'tf',
    question:
      'In Solidity, la keyword "view" indica che la funzione può modificare lo stato.',
    answer: false,
    explanation:
      '"view" garantisce che la funzione NON modifica lo stato (legge solo). "pure" è ancora più stretto: non legge nemmeno.',
  },
  {
    kind: 'mc',
    question:
      'Per aggiornare la logica di un contratto Ethereum mantenendone lo stato, il pattern usato tipicamente è:',
    choices: [
      { id: 'a', text: 'Modificare direttamente il bytecode on-chain' },
      {
        id: 'b',
        text: 'Proxy + implementation contract con DELEGATECALL',
      },
      { id: 'c', text: 'Migrare manualmente tutti gli account a un nuovo contratto' },
      { id: 'd', text: 'Rieseguire il deployment sul mainnet' },
    ],
    correctId: 'b',
    explanation:
      'Il pattern Proxy: il proxy mantiene lo storage e delega la logica all’implementazione corrente via DELEGATECALL. Sostituendo l’implementazione si aggiorna la logica preservando lo stato.',
  },
  {
    kind: 'mc',
    question:
      'In Ethereum, una Merkle-Patricia Trie viene usata per:',
    choices: [
      { id: 'a', text: 'Memorizzare la lista dei validatori' },
      {
        id: 'b',
        text: 'Indicizzare lo stato (accounts e storage) con proof di inclusione efficienti',
      },
      { id: 'c', text: 'Crittografare i wallet' },
      { id: 'd', text: 'Comprimere i log degli eventi' },
    ],
    correctId: 'b',
    explanation:
      'È una variante del trie usata per indicizzare lo stato globale. Ogni blocco contiene la root di questa trie (stateRoot), permettendo proof di inclusione succinct.',
  },
  {
    kind: 'tf',
    question:
      'Il bytecode di un contratto Ethereum, una volta deployato, è immutabile (a meno di SELFDESTRUCT).',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'Quale dei seguenti NON è un vantaggio della Proof of Stake rispetto alla Proof of Work?',
    choices: [
      { id: 'a', text: 'Consumo energetico drasticamente inferiore' },
      { id: 'b', text: 'Possibilità di slashing in caso di comportamento malevolo' },
      {
        id: 'c',
        text: 'Sicurezza basata sul lavoro fisico esterno al sistema',
      },
      { id: 'd', text: 'Minore latenza nella finalizzazione' },
    ],
    correctId: 'c',
    explanation:
      'PoS ricava sicurezza dal capitale a rischio (stake interno al sistema), non da risorse esterne come elettricità. Questa è una differenza, non un vantaggio: alcuni la considerano un trade-off.',
  },
  {
    kind: 'mc',
    question:
      'In Solidity, una "fallback function" viene chiamata quando:',
    choices: [
      { id: 'a', text: 'Un contratto ha un bug' },
      {
        id: 'b',
        text: 'Una chiamata non corrisponde a nessuna funzione definita, o riceve ETH senza dati',
      },
      { id: 'c', text: 'Una funzione restituisce un valore di tipo errato' },
      { id: 'd', text: 'Il gas si esaurisce' },
    ],
    correctId: 'b',
  },
]
