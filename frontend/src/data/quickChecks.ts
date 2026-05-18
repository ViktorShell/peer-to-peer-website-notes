// Quick true/false checks shown at the bottom of each lesson page.
// Keyed by lesson slug. Lessons without entries simply hide the check section.

export type TFItem = {
  statement: string
  answer: boolean
  explanation?: string
}

export const QUICK_CHECKS: Record<string, TFItem[]> = {
  'lezione-02': [
    {
      statement:
        'In Gnutella i peer formano una rete strutturata in cui ogni nodo conosce la posizione esatta di ogni contenuto.',
      answer: false,
      explanation:
        'Gnutella è un overlay non strutturato: la ricerca avviene via flooding, non con una struttura deterministica come una DHT.',
    },
    {
      statement:
        'Il flooding con TTL serve a limitare la propagazione delle query e ridurre il traffico nella rete.',
      answer: true,
    },
    {
      statement:
        'BitTorrent richiede sempre un tracker centralizzato per funzionare.',
      answer: false,
      explanation:
        'Le versioni moderne di BitTorrent supportano DHT (Mainline) e PEX, che permettono di scoprire peer senza tracker.',
    },
  ],
  'lezione-03': [
    {
      statement:
        'Il consistent hashing minimizza il numero di chiavi da rimappare quando un nodo entra o esce dalla rete.',
      answer: true,
    },
    {
      statement:
        'In una DHT con hashing classico (modulo N), aggiungere un nodo costringe a rimappare circa 1/N delle chiavi.',
      answer: false,
      explanation:
        'Con il modulo N tradizionale, aggiungere un nodo cambia il modulo e quasi tutte le chiavi devono essere rimappate. Per questo si usa consistent hashing.',
    },
    {
      statement:
        'I virtual node servono a migliorare il bilanciamento del carico tra peer.',
      answer: true,
    },
  ],
  'lezione-04': [
    {
      statement:
        'La distanza XOR è simmetrica: d(x,y) = d(y,x).',
      answer: true,
    },
    {
      statement:
        'In Kademlia due nodi numericamente vicini sono sempre vicini anche secondo la distanza XOR.',
      answer: false,
      explanation:
        'XOR si basa sull’albero binario dei prefissi: 1000 e 0111 sono vicini numericamente ma a distanza XOR massima (1111 = 15).',
    },
    {
      statement:
        'Le informazioni di routing in Kademlia si diffondono come effetto collaterale dei lookup, senza messaggi dedicati.',
      answer: true,
    },
  ],
  'lezione-06': [
    {
      statement:
        'Una funzione di hash crittografica deve essere resistente alle collisioni.',
      answer: true,
    },
    {
      statement:
        'Una firma digitale dimostra che chi firma conosce la chiave pubblica corrispondente.',
      answer: false,
      explanation:
        'Una firma dimostra il possesso della chiave **privata**; la chiave pubblica è ciò che permette a chiunque di verificare la firma.',
    },
  ],
  'lezione-07': [
    {
      statement:
        'In un Merkle tree, modificare una singola foglia richiede di ricalcolare solo i nodi lungo il percorso fino alla radice.',
      answer: true,
    },
    {
      statement:
        'La proof of inclusion in un Merkle tree ha dimensione O(n).',
      answer: false,
      explanation:
        'La proof ha dimensione O(log n): sono necessari solo gli hash dei fratelli lungo il percorso alla radice.',
    },
  ],
  'lezione-09': [
    {
      statement:
        'In Bitcoin lo stato di un wallet è memorizzato esplicitamente come "saldo" in un database.',
      answer: false,
      explanation:
        'Bitcoin usa il modello UTXO: il saldo di un wallet è la somma degli output non spesi (UTXO) che ne accettano la chiave.',
    },
    {
      statement:
        'Una transazione Bitcoin spende interamente uno o più UTXO; eventuali resti tornano al mittente come nuovo UTXO.',
      answer: true,
    },
  ],
  'lezione-12': [
    {
      statement:
        'Aumentare la difficulty di 1 zero leading raddoppia il lavoro medio richiesto per trovare un blocco.',
      answer: false,
      explanation:
        'Ogni zero hex aggiuntivo richiede in media 16× più tentativi (4 bit di entropia in più). Un singolo bit raddoppia, una cifra hex moltiplica per 16.',
    },
    {
      statement:
        'Il nonce è un valore che il miner modifica per cercare un hash che soddisfi la difficulty.',
      answer: true,
    },
    {
      statement:
        'In Bitcoin la difficulty viene aggiornata ogni blocco.',
      answer: false,
      explanation:
        'La difficulty si aggiorna ogni 2016 blocchi (~2 settimane) per puntare a un tempo medio di 10 minuti per blocco.',
    },
  ],
  'lezione-14': [
    {
      statement:
        'Un attacco del 51% permette a chi lo conduce di spendere due volte le proprie monete.',
      answer: true,
    },
    {
      statement:
        'Un attaccante con il 51% del potere di hash può inventare transazioni da wallet altrui.',
      answer: false,
      explanation:
        'Non può forgiare firme: le transazioni devono comunque essere firmate con la chiave privata del proprietario.',
    },
  ],
  'lezione-19': [
    {
      statement:
        'In Ethereum esistono due tipi di account: Externally Owned Accounts (EOA) e Contract Accounts.',
      answer: true,
    },
    {
      statement:
        'Il gas in Ethereum serve a misurare il tempo di esecuzione di un contratto in secondi.',
      answer: false,
      explanation:
        'Il gas misura il costo computazionale (numero di opcodes pesati), non il tempo reale.',
    },
  ],
  'lezione-22': [
    {
      statement:
        'ERC-20 è lo standard per i token fungibili in Ethereum.',
      answer: true,
    },
    {
      statement:
        'Ogni NFT ERC-721 è interscambiabile con qualsiasi altro NFT dello stesso contratto.',
      answer: false,
      explanation:
        'Per definizione gli NFT sono non fungibili: ognuno ha un tokenId distinto e attributi propri.',
    },
  ],
  'lezione-24': [
    {
      statement:
        'IPFS utilizza il content addressing: il nome di un file dipende dal suo contenuto.',
      answer: true,
    },
    {
      statement:
        'Spostare un file su un altro nodo IPFS ne cambia il CID.',
      answer: false,
      explanation:
        'Il CID dipende solo dal contenuto del file, non da dove è memorizzato.',
    },
  ],
  'lezione-25': [
    {
      statement:
        'In Proof of Stake un validatore che attesta dati conflittuali può essere "slashed" (perdere parte dello stake).',
      answer: true,
    },
    {
      statement:
        'PoS richiede lo stesso consumo energetico di PoW.',
      answer: false,
      explanation:
        'PoS riduce drasticamente i consumi (non serve risolvere puzzle computazionali).',
    },
  ],
}
