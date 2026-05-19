// Quick true/false checks shown at the bottom of every lesson page.
// Completing one marks the lesson as "completed" and contributes to module
// completion. Three items per lesson, focused on the core concepts of each.

export type TFItem = {
  statement: string
  answer: boolean
  explanation?: string
}

export const QUICK_CHECKS: Record<string, TFItem[]> = {
  // ─── Modulo 1 — Reti P2P & DHT ────────────────────────────────────────────
  'lezione-01': [
    {
      statement:
        'In una rete P2P pura, ogni peer è contemporaneamente fornitore e consumatore di risorse (funzionalità "servent").',
      answer: true,
    },
    {
      statement:
        'La blockchain è la scelta giusta ogni volta che serve un database con audit trail, anche tra parti fidate.',
      answer: false,
      explanation:
        'Se le parti si fidano, un database tradizionale con checksum crittografici (es. AWS QLDB) è più semplice ed efficiente. La blockchain ha senso quando ci sono più scrittori non fidati.',
    },
    {
      statement:
        'Il trilemma della blockchain afferma che è difficile ottenere contemporaneamente sicurezza, decentralizzazione e scalabilità.',
      answer: true,
    },
  ],

  'lezione-02': [
    {
      statement:
        'Negli overlay non strutturati come Gnutella, una query con TTL=0 viene immediatamente scartata.',
      answer: true,
    },
    {
      statement:
        'Il flooding garantisce sempre di trovare la risorsa se essa esiste nella rete.',
      answer: false,
      explanation:
        'Il flooding è una BFS limitata dal TTL: se la risorsa si trova oltre il TTL configurato, non verrà raggiunta. Sono possibili falsi negativi.',
    },
    {
      statement:
        'In un overlay strutturato (DHT), il lookup ha complessità O(log N) sia in spazio (dimensione della routing table) che in tempo (numero di hop).',
      answer: true,
    },
  ],

  'lezione-03': [
    {
      statement:
        'Con hash modulare classico (hash(k) mod N), aggiungere un nodo costringe a rimappare in media circa metà delle chiavi.',
      answer: false,
      explanation:
        'Con N che cambia, quasi TUTTE le chiavi vengono rimappate. È esattamente questo problema che il consistent hashing risolve, riducendo i ri-assegnamenti a K/N in media.',
    },
    {
      statement:
        'Il consistent hashing posiziona nodi e chiavi sullo stesso anello: ogni chiave è assegnata al nodo successore in senso orario.',
      answer: true,
    },
    {
      statement:
        'I virtual node servono a migliorare il bilanciamento del carico quando i nodi fisici si distribuiscono in modo non uniforme sull\'anello.',
      answer: true,
    },
  ],

  'lezione-04': [
    {
      statement:
        'La distanza XOR è simmetrica: d(x,y) = d(y,x), quindi se A vede B come vicino allora anche B vede A come vicino.',
      answer: true,
    },
    {
      statement:
        'Due nodi numericamente vicini (es. 0111 e 1000) hanno sempre piccola distanza XOR.',
      answer: false,
      explanation:
        '0111 ⊕ 1000 = 1111 — distanza XOR massima. La metrica XOR si basa sull\'albero binario dei prefissi, non sulla linea numerica.',
    },
    {
      statement:
        'In Kademlia le informazioni di routing si propagano come effetto collaterale dei lookup, senza messaggi di mantenimento dedicati.',
      answer: true,
    },
  ],

  'lezione-05': [
    {
      statement:
        'Bitcoin usa un overlay strutturato basato su Kademlia per il peer discovery.',
      answer: false,
      explanation:
        'Bitcoin usa un overlay NON strutturato basato su gossip; è Ethereum che usa Kademlia (su UDP per la discovery + TCP per la comunicazione cifrata).',
    },
    {
      statement:
        'Un nodo Bitcoin appena avviato usa DNS seed o una lista hardcoded per ottenere il primo set di peer (bootstrapping).',
      answer: true,
    },
    {
      statement:
        'In Ethereum, l\'identificatore di un nodo (enode) coincide con la sua chiave pubblica a 512 bit.',
      answer: true,
    },
  ],

  'lezione-06': [
    {
      statement:
        'Una funzione di hash crittografica è "preimage resistant" se, dato y, è infattibile trovare un x tale che H(x) = y.',
      answer: true,
    },
    {
      statement:
        'Per un hash a n bit, il paradosso del compleanno garantisce che bastano circa 2^(n/2) input casuali per trovare una collisione con alta probabilità.',
      answer: true,
    },
    {
      statement:
        'Una firma digitale RSA o ECDSA dimostra che chi firma conosce la chiave pubblica corrispondente.',
      answer: false,
      explanation:
        'La firma dimostra il possesso della chiave PRIVATA. La chiave pubblica serve invece a verificarla.',
    },
  ],

  'lezione-07': [
    {
      statement:
        'In un Merkle tree, la proof of inclusion di una foglia ha dimensione O(log n) negli hash dell\'albero.',
      answer: true,
    },
    {
      statement:
        'Modificare una sola foglia di un Merkle tree richiede di ricalcolare l\'intero albero da zero.',
      answer: false,
      explanation:
        'Solo i nodi lungo il percorso dalla foglia alla radice cambiano — circa log(n) hash. Il resto rimane uguale.',
    },
    {
      statement:
        'Un Bloom filter può produrre falsi positivi ma mai falsi negativi.',
      answer: true,
    },
  ],

  // ─── Modulo 2 — Bitcoin ───────────────────────────────────────────────────
  'lezione-08': [
    {
      statement:
        'In una blockchain Proof of Work, modificare un blocco passato è praticamente impossibile perché bisognerebbe rifare la PoW di tutti i blocchi successivi.',
      answer: true,
    },
    {
      statement:
        'Un attacco Sybil viene neutralizzato dalla Proof of Work perché il potere decisionale si basa sulla potenza di calcolo, non sul numero di identità.',
      answer: true,
    },
    {
      statement:
        'Le blockchain permissioned, come Hyperledger, usano tipicamente PoW per il consenso.',
      answer: false,
      explanation:
        'Le permissioned hanno partecipanti noti e identificati: usano protocolli più efficienti come PBFT (Practical Byzantine Fault Tolerance), non PoW.',
    },
  ],

  'lezione-09': [
    {
      statement:
        'In Bitcoin il saldo di un wallet è esplicitamente memorizzato in un campo "balance" nel database del nodo.',
      answer: false,
      explanation:
        'Bitcoin usa il modello UTXO: il saldo non esiste come campo esplicito, è la somma degli UTXO che la chiave dell\'utente può spendere. Calcolarlo richiede di scorrere l\'UTXO set.',
    },
    {
      statement:
        'Una transazione Bitcoin spende interamente uno o più UTXO; eventuali resti tornano al mittente come nuovo UTXO.',
      answer: true,
    },
    {
      statement:
        'Lo script di un output Bitcoin (scriptPubKey) definisce le condizioni che chi vuole spendere quell\'output deve soddisfare.',
      answer: true,
    },
  ],

  'lezione-10': [
    {
      statement:
        'Una stessa chiave ECDSA può generare indirizzi Bitcoin di tipi diversi (P2PKH, P2WPKH, ecc.) perché l\'indirizzo dipende anche dallo script type scelto.',
      answer: true,
    },
    {
      statement:
        'Il messaggio "Chancellor on brink of second bailout for banks" è inciso nel coinbase del genesis block di Bitcoin.',
      answer: true,
      explanation:
        'È il titolo del Times del 3 gennaio 2009. Dimostra che il blocco è stato minato non prima di quella data e ha valore simbolico.',
    },
    {
      statement:
        'Generare una vanity address con un prefisso lungo 10 caratteri ha un costo simile a generarne una con prefisso lungo 4 caratteri.',
      answer: false,
      explanation:
        'Il costo cresce esponenzialmente: ogni carattere Base58 aggiunto moltiplica i tentativi attesi per ~58. 10 caratteri richiedono hardware dedicato; 4 si trovano in secondi.',
    },
  ],

  'lezione-11': [
    {
      statement:
        'Nelle transazioni SegWit la firma è collocata in una sezione separata (witness data) anziché dentro lo scriptSig dell\'input.',
      answer: true,
    },
    {
      statement:
        'Una transazione coinbase ha un input speciale (hash tutto-zero, indice 0xFFFFFFFF) e crea i nuovi bitcoin del block reward.',
      answer: true,
    },
    {
      statement:
        'Il txId di una transazione SegWit cambia se viene modificata la firma (transaction malleability).',
      answer: false,
      explanation:
        'SegWit risolve proprio la malleability: il txId di una SegWit è l\'hash dei dati NON witness, quindi modificare la firma non lo altera.',
    },
  ],

  'lezione-12': [
    {
      statement:
        'In SHA-256 servono in media 16 volte più tentativi per trovare un hash con un zero esadecimale leading aggiuntivo (4 bit di entropia in più).',
      answer: true,
    },
    {
      statement:
        'La difficulty di Bitcoin viene aggiornata ad ogni nuovo blocco, in modo da mantenere costante il reward.',
      answer: false,
      explanation:
        'La difficulty viene ricalcolata ogni 2016 blocchi (~2 settimane) per puntare a un tempo medio di 10 minuti per blocco. Il reward è separato e dimezza ogni 210 000 blocchi.',
    },
    {
      statement:
        'Il nonce è il campo del block header che il miner modifica per cercare un hash che soddisfi il target di difficulty.',
      answer: true,
    },
  ],

  'lezione-13': [
    {
      statement:
        'Un output con OP_RETURN è marcato come "provably unspendable" e non viene incluso nell\'UTXO set dai full node.',
      answer: true,
    },
    {
      statement:
        'Per classificare il tipo di uno script Bitcoin (P2PKH, P2SH, P2WPKH, ...) si fa pattern matching sulla sequenza canonica di opcode.',
      answer: true,
    },
    {
      statement:
        'I file blk*.dat contengono le transazioni serializzate in formato testuale leggibile.',
      answer: false,
      explanation:
        'I blk.dat sono il formato binario interno di Bitcoin Core: ogni blocco è preceduto da una magic number, dalla sua dimensione e dai dati grezzi del blocco serializzato. Vanno parsati con una libreria adeguata.',
    },
  ],

  'lezione-14': [
    {
      statement:
        'Un attaccante con il 51% del potere di hash può eseguire double spending riorganizzando i blocchi recenti.',
      answer: true,
    },
    {
      statement:
        'Un attaccante con il 51% del potere di hash può anche forgiare firme e spendere bitcoin di wallet altrui.',
      answer: false,
      explanation:
        'Anche con il 100% del potere di hash non si può falsificare una firma ECDSA. Servirebbe rompere la crittografia (es. risolvere il discrete logarithm).',
    },
    {
      statement:
        'Più conferme accumulate sopra una transazione la rendono esponenzialmente più costosa da invertire per un attaccante.',
      answer: true,
    },
  ],

  'lezione-15': [
    {
      statement:
        'In un multisig M-of-N, qualsiasi M firme sulle N chiavi pubbliche pubblicate nel locking script sono sufficienti per spendere.',
      answer: true,
    },
    {
      statement:
        'Il P2SH (Pay-to-Script-Hash) sposta gli oneri di banda e fee dal mittente al destinatario al momento della spesa.',
      answer: true,
    },
    {
      statement:
        'Un client SPV deve scaricare l\'intera blockchain per poter verificare in autonomia le proprie transazioni.',
      answer: false,
      explanation:
        'L\'SPV scarica solo gli header dei blocchi e verifica le proprie transazioni tramite Merkle proof inviate dai full node. È il punto chiave dei "light client".',
    },
  ],

  'lezione-16': [
    {
      statement:
        'Una transazione Lightning intermedia (off-chain) viene comunque registrata in un blocco Bitcoin, separatamente.',
      answer: false,
      explanation:
        'Solo l\'apertura e la chiusura del canale finiscono on-chain. I pagamenti intermedi sono off-chain e firmati tra le due parti del canale, senza essere mai trasmessi alla rete Bitcoin.',
    },
    {
      statement:
        'Lightning Network usa HTLC (Hash-Time Locked Contracts) per consentire pagamenti multi-hop trustless attraverso una catena di canali.',
      answer: true,
    },
    {
      statement:
        'Se una controparte chiude un canale Lightning pubblicando uno stato VECCHIO (a lei più favorevole), l\'altra parte può "punirla" usando una revocation key e prendersi tutti i fondi.',
      answer: true,
    },
  ],

  'lezione-17': [
    {
      statement:
        'Bitcoin garantisce anonimato perfetto: gli indirizzi sono pseudonimi e non possono essere collegati a un\'identità reale.',
      answer: false,
      explanation:
        'Bitcoin è pseudonimo ma NON anonimo. La trasparenza del ledger consente analisi euristiche (common-input heuristic, change identification) che spesso permettono di clusterizzare indirizzi e collegarli a identità reali.',
    },
    {
      statement:
        'La common-input heuristic assume che tutti gli input di una stessa transazione siano controllati dalla stessa entità.',
      answer: true,
    },
    {
      statement:
        'CoinJoin migliora la privacy aggregando input/output di più utenti in un\'unica transazione, rendendo difficile collegare singoli input ai singoli output.',
      answer: true,
    },
  ],

  'lezione-18': [
    {
      statement:
        'Un soft fork introduce regole più restrittive: i blocchi prodotti dai nodi aggiornati sono ancora considerati validi dai client non aggiornati.',
      answer: true,
    },
    {
      statement:
        'Un hard fork è retro-compatibile: i nodi non aggiornati continuano a vedere la stessa chain dei nodi aggiornati.',
      answer: false,
      explanation:
        'L\'hard fork NON è retro-compatibile. I nodi non aggiornati rifiutano i nuovi blocchi e la rete può dividersi in due chain (es. Ethereum/Ethereum Classic dopo il DAO).',
    },
    {
      statement:
        'Bitcoin Cash è nata nel 2017 come hard fork di Bitcoin per aumentare la dimensione massima dei blocchi.',
      answer: true,
    },
  ],

  // ─── Modulo 3 — Ethereum & Smart Contracts ───────────────────────────────
  'lezione-19': [
    {
      statement:
        'In Ethereum esistono due tipi di account: Externally Owned Account (controllati da chiave privata) e Contract Account (codice EVM).',
      answer: true,
    },
    {
      statement:
        'Il gas misura il tempo di esecuzione di un contratto in secondi, e il gas price è il costo al secondo.',
      answer: false,
      explanation:
        'Il gas misura il COSTO COMPUTAZIONALE in termini di opcodes pesati, non il tempo reale. Il gas price è il prezzo per unità di gas che l\'utente è disposto a pagare.',
    },
    {
      statement:
        'Solo gli EOA possono iniziare una transazione: i contract account si attivano solo come reazione a una transazione ricevuta.',
      answer: true,
    },
  ],

  'lezione-20': [
    {
      statement:
        'In Solidity, una funzione marcata `view` può modificare lo stato del contratto.',
      answer: false,
      explanation:
        '`view` garantisce che la funzione NON modifica lo stato (legge soltanto). `pure` è ancora più stretto: non legge nemmeno lo stato.',
    },
    {
      statement:
        'Lo storage di un contratto Solidity persiste tra una chiamata e la successiva, mentre `memory` è temporanea (vive solo per la durata della chiamata).',
      answer: true,
    },
    {
      statement:
        'Remix IDE permette di scrivere, compilare e deployare contratti Solidity direttamente da browser, anche su reti pubbliche.',
      answer: true,
    },
  ],

  'lezione-21': [
    {
      statement:
        'In Solidity, una variabile dichiarata `immutable` può essere modificata in qualsiasi momento dopo il deployment.',
      answer: false,
      explanation:
        '`immutable` è fissata UNA volta nel costruttore e poi non può più cambiare. `constant` è fissata a tempo di compilazione.',
    },
    {
      statement:
        'I parametri `calldata` di una funzione `external` sono read-only e occupano meno gas rispetto a `memory`.',
      answer: true,
    },
    {
      statement:
        'Un `modifier` in Solidity permette di iniettare codice di controllo (es. onlyOwner) prima o dopo l\'esecuzione del corpo di una funzione.',
      answer: true,
    },
  ],

  'lezione-22': [
    {
      statement:
        'ERC-20 è lo standard per i token fungibili: tutti i token dello stesso contratto sono interscambiabili 1:1.',
      answer: true,
    },
    {
      statement:
        'Ogni NFT ERC-721 ha un tokenId univoco e può avere metadati distinti dagli altri token dello stesso contratto.',
      answer: true,
    },
    {
      statement:
        'Lo standard ERC-1155 è stato progettato per token NON fungibili soltanto, come alternativa più moderna a ERC-721.',
      answer: false,
      explanation:
        'ERC-1155 è uno standard "multi-token" che supporta in un solo contratto sia token fungibili che non fungibili, ed è particolarmente utile per i giochi (es. spade uniche + valuta in-game).',
    },
  ],

  'lezione-23': [
    {
      statement:
        'Una reentrancy attack sfrutta la possibilità di richiamare il contratto vittima prima che lo stato venga aggiornato.',
      answer: true,
    },
    {
      statement:
        'Il pattern "checks-effects-interactions" mitiga la reentrancy aggiornando lo stato PRIMA di fare la chiamata esterna.',
      answer: true,
    },
    {
      statement:
        'Una volta deployato, il bytecode di un contratto Solidity può essere modificato per correggere bug, senza ricorrere a pattern proxy.',
      answer: false,
      explanation:
        'Il bytecode è immutabile (a meno di SELFDESTRUCT, ora deprecato). Per aggiornare la logica preservando lo stato si usa il pattern Proxy + Implementation con DELEGATECALL.',
    },
  ],

  'lezione-25': [
    {
      statement:
        'In Proof of Stake un validatore che firma due blocchi conflittuali alla stessa altezza può essere "slashed" (parte del suo stake distrutto).',
      answer: true,
    },
    {
      statement:
        'Proof of Stake elimina completamente l\'attacco "nothing at stake" perché lo stake rappresenta un costo reale.',
      answer: true,
    },
    {
      statement:
        'Il consenso PoS di Ethereum (Gasper) raggiunge la finality probabilistica come Bitcoin, senza una vera finality definitiva.',
      answer: false,
      explanation:
        'Gasper (LMD GHOST + Casper FFG) raggiunge una finality DETERMINISTICA: dopo 2 epoche (~12 minuti) un blocco è "finalizzato" e invertirlo costerebbe almeno 1/3 dello stake totale slashato.',
    },
  ],

  'lezione-26': [
    {
      statement:
        'Con EIP-1559 la base fee delle transazioni Ethereum viene bruciata, riducendo la supply circolante di ETH.',
      answer: true,
    },
    {
      statement:
        'Lo stato globale di Ethereum è memorizzato in una struttura chiamata Merkle-Patricia Trie, una variante della trie che supporta proof di inclusione efficienti.',
      answer: true,
    },
    {
      statement:
        'Sotto EIP-1559, la "priority fee" (tip) è una tariffa minima obbligatoria che ogni transazione deve pagare al validatore.',
      answer: false,
      explanation:
        'La priority fee è VOLONTARIA: l\'utente la aggiunge per incentivare i validatori a includere la propria transazione prima di altre. La parte obbligatoria è la base fee (algoritmica e bruciata).',
    },
  ],

  // ─── Modulo 4 — IPFS & Applicazioni ──────────────────────────────────────
  'lezione-24': [
    {
      statement:
        'In IPFS il CID (Content Identifier) di un file è derivato dal suo contenuto: due copie identiche hanno lo stesso CID indipendentemente da dove sono memorizzate.',
      answer: true,
    },
    {
      statement:
        'IPFS usa una variante di Kademlia (S/Kademlia) per il lookup dei provider di un contenuto identificato dal CID.',
      answer: true,
    },
    {
      statement:
        'IPFS garantisce che un file caricato resti permanentemente disponibile sulla rete, anche se nessuno lo "pinna".',
      answer: false,
      explanation:
        'IPFS NON garantisce persistenza per default. Se nessun nodo pinna il contenuto, può scomparire dalla rete quando il garbage collector dei nodi lo rimuove. Servizi come Filecoin aggiungono incentivi economici per la persistenza.',
    },
  ],

  'lezione-27': [
    {
      statement:
        'In un protocollo DeFi di lending (Aave-like), i borrower depositano un collaterale e gli interessi vanno principalmente ai lender che hanno fornito liquidità.',
      answer: true,
    },
    {
      statement:
        'Un "flash loan" è un prestito che deve essere restituito entro la STESSA transazione, altrimenti la transazione viene revertita e il prestito è come se non fosse mai esistito.',
      answer: true,
    },
    {
      statement:
        'Uno smart contract può accedere autonomamente a dati esterni (es. il prezzo dell\'ETH su Binance) leggendo da un\'API HTTPS.',
      answer: false,
      explanation:
        'Gli smart contract sono deterministici e non possono fare chiamate esterne. Per portare dati off-chain on-chain servono ORACLE (es. Chainlink) che spingono i dati nel contratto.',
    },
  ],

}
