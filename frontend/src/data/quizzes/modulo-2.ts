import type { Question } from './types'

export const MODULO_2_QUIZ: Question[] = [
  {
    kind: 'mc',
    question: 'In Bitcoin, cosa rappresenta esattamente uno UTXO?',
    choices: [
      { id: 'a', text: 'Il saldo totale di un wallet' },
      { id: 'b', text: 'Un output di transazione non ancora speso, riscattabile solo soddisfacendo il suo script' },
      { id: 'c', text: 'Un blocco non ancora confermato' },
      { id: 'd', text: 'La chiave privata di un account' },
    ],
    correctId: 'b',
    explanation:
      'UTXO = "Unspent Transaction Output": è un output di una transazione passata che può essere speso solo da chi fornisce dati che soddisfano il suo script di blocco.',
  },
  {
    kind: 'tf',
    question:
      'In Bitcoin la difficulty viene aggiornata ogni 2016 blocchi per puntare a un tempo medio di 10 minuti per blocco.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'Quale è la conseguenza pratica di un attacco del 51% con potere di hash maggioritario?',
    choices: [
      { id: 'a', text: 'L’attaccante può forgiare firme di altri utenti' },
      { id: 'b', text: 'L’attaccante può eseguire double spending e censurare transazioni' },
      { id: 'c', text: 'L’attaccante può modificare transazioni storiche di anni fa senza costi' },
      { id: 'd', text: 'L’attaccante può aumentare arbitrariamente la quantità di Bitcoin totale' },
    ],
    correctId: 'b',
    explanation:
      'Un attaccante 51% può riorganizzare le code recenti (double spend) e censurare nuove transazioni, ma non può falsificare firme né cambiare il supply totale (limitato dal protocollo).',
  },
  {
    kind: 'mc',
    question: 'Cosa significa che Bitcoin Script è "non Turing-completo"?',
    choices: [
      { id: 'a', text: 'Non supporta operazioni aritmetiche' },
      { id: 'b', text: 'Non ha loop né ricorsione, garantendo terminazione' },
      { id: 'c', text: 'Non supporta firme digitali' },
      { id: 'd', text: 'È più lento di Solidity' },
    ],
    correctId: 'b',
    explanation:
      'L’assenza di loop e ricorsione previene programmi infiniti, mantenendo prevedibile il costo di validazione.',
  },
  {
    kind: 'tf',
    question:
      'Le transazioni Lightning sono registrate on-chain singolarmente, ognuna nel suo blocco.',
    answer: false,
    explanation:
      'Lightning sfrutta payment channel off-chain: solo l’apertura e la chiusura del canale finiscono on-chain. I pagamenti intermedi sono off-chain.',
  },
  {
    kind: 'mc',
    question: 'Cosa rappresenta un blocco "stale" (orphan) in Bitcoin?',
    choices: [
      { id: 'a', text: 'Un blocco con timestamp invalido' },
      { id: 'b', text: 'Un blocco valido che però non fa parte della chain più lunga' },
      { id: 'c', text: 'Un blocco prodotto da un miner non autorizzato' },
      { id: 'd', text: 'Un blocco senza transazioni' },
    ],
    correctId: 'b',
    explanation:
      'Quando due miner trovano un blocco quasi simultaneamente, solo uno verrà incluso nella longest chain; l’altro diventa stale.',
  },
  {
    kind: 'mc',
    question:
      'Un soft fork è considerato compatibile con i client non aggiornati perché:',
    choices: [
      { id: 'a', text: 'aggiunge nuove regole più permissive' },
      { id: 'b', text: 'aggiunge nuove regole più restrittive che mantengono valide le vecchie' },
      { id: 'c', text: 'cambia il consenso a Proof of Stake' },
      { id: 'd', text: 'non modifica il protocollo' },
    ],
    correctId: 'b',
    explanation:
      'Soft fork = restringimento delle regole. I vecchi client accettano i nuovi blocchi (perché sono validi anche secondo le vecchie regole), ma non ne produrrebbero di equivalenti.',
  },
  {
    kind: 'tf',
    question:
      'Un wallet SPV scarica e verifica tutte le transazioni della blockchain.',
    answer: false,
    explanation:
      'Un SPV (Simplified Payment Verification) scarica solo gli header dei blocchi e verifica le sue transazioni tramite Merkle proof.',
  },
  {
    kind: 'mc',
    question:
      'Quale tecnica viene usata per migliorare l’anonimato in Bitcoin in modo decentralizzato?',
    choices: [
      { id: 'a', text: 'CoinJoin' },
      { id: 'b', text: 'KYC obbligatorio' },
      { id: 'c', text: 'Cifratura simmetrica del wallet' },
      { id: 'd', text: 'Whitelisting degli indirizzi' },
    ],
    correctId: 'a',
    explanation:
      'CoinJoin aggrega input/output di più utenti in un’unica transazione, rendendo difficile collegare singoli input ai singoli output.',
  },
  {
    kind: 'mc',
    question: 'In Bitcoin la coinbase transaction:',
    choices: [
      { id: 'a', text: 'è la transazione che crea nuovi bitcoin come reward del miner' },
      { id: 'b', text: 'è la prima transazione mai effettuata da Satoshi' },
      { id: 'c', text: 'è una transazione gestita dall’exchange Coinbase' },
      { id: 'd', text: 'è una transazione di prelievo da un wallet' },
    ],
    correctId: 'a',
    explanation:
      'È la prima tx di ogni blocco e ha un input speciale (senza UTXO da spendere): assegna al miner il block reward + le fee.',
  },
  {
    kind: 'tf',
    question:
      'I multisig P2SH in Bitcoin permettono di richiedere n firme su m chiavi per spendere un UTXO.',
    answer: true,
  },
  {
    kind: 'mc',
    question:
      'Lightning Network risolve il problema della scalabilità Bitcoin perché:',
    choices: [
      { id: 'a', text: 'aumenta la dimensione del blocco' },
      { id: 'b', text: 'sposta i pagamenti su canali off-chain con possibilità di routing multi-hop' },
      { id: 'c', text: 'sostituisce PoW con PoS' },
      { id: 'd', text: 'comprime le transazioni con zk-SNARK' },
    ],
    correctId: 'b',
  },
  {
    kind: 'mc',
    question:
      'Nel modello di sicurezza di Bitcoin, perché un miner razionale non riscrive blocchi vecchi?',
    choices: [
      { id: 'a', text: 'Perché il software glielo impedisce' },
      { id: 'b', text: 'Perché il costo computazionale di rifare la PoW supera enormemente i guadagni attesi' },
      { id: 'c', text: 'Perché la rete blocca il suo IP' },
      { id: 'd', text: 'Perché le transazioni sono cifrate' },
    ],
    correctId: 'b',
    explanation:
      'Per riorganizzare blocchi profondi serve potere di hash > resto della rete per molti blocchi consecutivi. Il costo (energia, hardware, costo opportunità del reward) supera i guadagni attesi.',
  },
  {
    kind: 'tf',
    question:
      'Una hard fork può rendere obsoleti i nodi non aggiornati, dividendo la rete in due chain.',
    answer: true,
  },
]
