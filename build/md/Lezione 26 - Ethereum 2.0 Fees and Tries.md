# Ethereum 2.0: Fees and Tries

Questa lezione affronta due macro-argomenti strettamente collegati: il **meccanismo di fee** di Ethereum — com'era prima del Merge e come è stato riformato dall'EIP-1559 — e le **strutture dati del Data Layer**, ossia i trie Merkle Patricia che Ethereum usa per rappresentare stato, transazioni, ricevute e storage dei contratti. Comprendere le fee significa capire l'economia di Ethereum; comprendere i trie significa capire come i dati vengono salvati, verificati e interrogati in modo efficiente.

---

## L'offerta di ETH: dalle origini alla supply pre-Merge

### L'ICO del 2014 e la distribuzione iniziale

Ethereum nacque attraverso un **Initial Coin Offering (ICO)** nel 2014, un evento di crowdfunding pubblico in cui i sostenitori precoci acquistarono ETH usando Bitcoin, prima ancora che la rete fosse operativa. Questa campagna fu cruciale per finanziare lo sviluppo e attirare talenti. Dalla distribuzione iniziale emersero **72 milioni di ETH**, ripartiti tra contribuenti precoci e la Ethereum Foundation.

### Supply dynamics pre-Merge

Prima della transizione al Proof of Stake (il cosiddetto Merge, avvenuto nel settembre 2022), Ethereum era basato sul Proof of Work. I miner ricevevano una **block reward** in ETH come incentivo alla sicurezza della rete, oltre alle gas fee delle transazioni incluse nel blocco. A differenza di Bitcoin — dove i dimezzamenti del reward avvengono automaticamente ogni 210.000 blocchi — in Ethereum la regolazione dell'emissione è **governance-driven**: le modifiche vengono decise dalla comunità attraverso Ethereum Improvement Proposals (EIP) e attivate tramite hard fork.

La progressione storica è la seguente:
- **2015 (genesis):** 5 ETH per blocco
- **2017 (Byzantium):** 3 ETH per blocco
- **2019 (Constantinople):** 2 ETH per blocco

Questa riduzione progressiva abbassò il tasso di inflazione della rete, ma in assenza di un meccanismo sistematico di rimozione dalla circolazione — a meno di perdite accidentali o distruzione volontaria — la supply continuava comunque a crescere.

---

## Il sistema di fee pre-Merge: il First Price Auction

### Come funzionava

Prima dell'EIP-1559, le fee di Ethereum seguivano il modello della **first-price auction**: per ogni blocco si apriva un'asta aperta in cui gli utenti dichiaravano il prezzo massimo che erano disposti a pagare per unità di gas (espresso in **gwei**, dove 1 gwei = 0,000000001 ETH). I miner includevano preferibilmente le transazioni con gas price più alto, perché incassavano l'intero importo dichiarato.

> [!definition] First Price Auction
>
> Modello d'asta in cui il vincitore paga esattamente quanto ha offerto, senza rimborso in caso di eccesso. Chi offre di più viene incluso prima.

Questo schema aveva un difetto strutturale: non esisteva un "prezzo giusto" determinato algoritmicamente. Gli utenti dovevano **indovinare** quant'era la domanda corrente, con due scenari negativi simmetrici:
- Se il bid era **troppo basso**, la transazione restava in attesa nel mempool senza essere inclusa.
- Se il bid era **troppo alto**, la transazione veniva inclusa rapidamente ma l'utente **overpagava** senza ricevere alcun rimborso.

> [!example] Bob e l'overpaying
>
> Bob vuole cogliere un'opportunità urgente su Ethereum. Stima competizione elevata e imposta un gas price di 100 gwei. In realtà, la transazione sarebbe stata inclusa con soli 50 gwei. Bob paga il doppio del necessario, poiché non ha strumenti affidabili per stimare il prezzo corretto.

---

## EIP-1559: la riforma del mercato delle fee

### Il London Hard Fork (agosto 2021)

L'EIP-1559, attivato con il London Hard Fork, ha completamente ridisegnato il meccanismo di fee introducendo quattro innovazioni fondamentali:

1. **Base fee algoritmica** — un prezzo minimo per unità di gas, calcolato dal protocollo e comune a tutte le transazioni del blocco, basato sulla congestione recente.
2. **Burn della base fee** — la base fee viene **bruciata**, cioè rimossa permanentemente dalla circolazione, anziché andare ai miner/validator.
3. **Priority fee (tip)** — un contributo volontario che l'utente aggiunge alla base fee per incentivare i validator a includere la propria transazione.
4. **Blocchi elastici** — la dimensione target di un blocco è fissa, ma i blocchi possono espandersi fino al **doppio del target** durante picchi di domanda.

> [!tip] Perché bruciare la base fee?
>
> Separare la base fee (bruciata) dal tip (ai validator) serve a disaccoppiare l'incentivo economico dei validator dal prezzo di mercato del gas. Se i validator ricevessero l'intera fee, avrebbero interesse a manipolare il mercato gonfiando artificialmente la domanda.

### baseFeePerGas: il prezzo di mercato algoritmico

La `baseFeePerGas` è un **parametro di protocollo a livello di blocco**, non un campo della transazione: viene calcolata automaticamente e applicata a tutte le transazioni del blocco. L'analogia con Bitcoin è quella dell'aggiustamento della difficoltà: è una forma di **auto-organizzazione del sistema**.

Il meccanismo di aggiustamento segue questa logica:
- Se il blocco precedente era **più che al 50%** della capienza → la base fee **aumenta**
- Se era **esattamente al 50%** → rimane invariata
- Se era **meno del 50%** → **diminuisce**

Il target è che i blocchi siano mediamente al 50% della loro capacità massima. La variazione è **cappata a ±12,5% per blocco**, il che impedisce oscillazioni brusche ma consente adattamento rapido a cambiamenti sostenuti della domanda. Poiché la base fee può cambiare mentre una transazione è ancora in attesa nel mempool, gli utenti specificano valori **massimi** per proteggersi da variazioni impreviste.

### maxPriorityFeePerGas e maxFeePerGas

In EIP-1559, una transazione include due parametri espliciti:

> [!definition] maxPriorityFeePerGas
>
> Il **tip massimo** che l'utente è disposto a pagare ai validator per prioritizzare l'inclusione. Il validator riceverà `min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas)`.

> [!definition] maxFeePerGas
>
> Il **limite massimo assoluto** che l'utente è disposto a pagare per unità di gas. Protegge l'utente da rincari della base fee nel tempo tra submission e inclusione. Deve essere ≥ baseFeePerGas + maxPriorityFeePerGas.

La fee effettivamente pagata sarà: `gas usato × (baseFeePerGas + tip effettivo)`, dove il tip effettivo è `min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas)`.

### Tre casi numerici

> [!example] Caso 1 — fee piena, nessun cap
>
> Transazione EOA→EOA di 1 ETH (21.000 gas). `baseFeePerGas = 100`, `maxPriorityFeePerGas = 20`, `maxFeePerGas = 200`.
>
> `maxFeePerGas > baseFeePerGas + maxPriorityFeePerGas` → nessun cap sul tip.
>
> - Fee totale: 21.000 × (100 + 20) = 2.520.000 gwei = **0,00252 ETH**
> - A paga: 1,00252 ETH; B riceve: 1 ETH
> - Validator ricevono: 0,00042 ETH (21.000 × 20 gwei)
> - Bruciati: 0,0021 ETH (21.000 × 100 gwei)

> [!example] Caso 2 — tip ridotto dal cap
>
> Stessa transazione. `baseFeePerGas = 100`, `maxPriorityFeePerGas = 20`, `maxFeePerGas = 110`.
>
> Tip effettivo = min(20, 110 − 100) = **10 gwei** (il cap abbassa il tip).
>
> - Fee totale: 21.000 × (100 + 20) = 2.310.000 gwei = **0,00231 ETH**
> - Validator ricevono: 0,00021 ETH; Bruciati: 0,0021 ETH
> - La transazione viene inclusa, solo il tip si riduce.

> [!example] Caso 3 — transazione bloccata
>
> `baseFeePerGas = 100`, `maxFeePerGas = 90`. L'utente non copre nemmeno la base fee.
>
> La transazione rimane **pending** nel mempool finché la `baseFeePerGas` non scende sotto 90, oppure viene eliminata.

### EIP-1559 e la pressione deflazionistica

L'EIP-1559 ha cambiato strutturalmente la politica di emissione di ETH attraverso due meccanismi congiunti:

1. **Riduzione dell'issuance**: i premi al mining sono stati sostituiti da premi allo staking, significativamente più bassi.
2. **Burn della base fee**: una parte del gas viene bruciata ad ogni transazione.

Quando la quantità di ETH bruciata supera quella emessa come ricompensa ai validator, la supply totale di ETH **diminuisce**: ETH diventa **deflazionario**. Questo fenomeno si osserva nei periodi di alta attività on-chain.

---

## L'architettura di Ethereum: i quattro livelli

Ethereum è organizzato in quattro strati funzionali:

![Diagramma Mermaid](images/mermaid-lezione-26-ethereum-2-0-fees-and-tries-01.png)
*Fig. — I quattro livelli dell'architettura Ethereum.*

Il **Data Layer** è il focus della seconda parte della lezione: comprende le strutture dati che rappresentano lo stato del sistema — account, transazioni, ricevute, storage dei contratti — attraverso strutture ad albero basate su Merkle Patricia Trie.

---

## Il Merkle Patricia Trie (MPT)

Il **Merkle Patricia Trie** è una struttura dati originale introdotta nel Yellow Paper di Ethereum, che combina due strutture classiche:

> [!definition] Merkle Patricia Trie
>
> Albero che unisce il **Patricia Trie** (raggruppamento di prefissi comuni delle chiavi per ricerca efficiente) con il **Merkle Tree** (ogni nodo è l'hash dei propri figli, garantendo integrità e verifica tamper-proof). È la struttura alla base di tutti i trie di Ethereum e della maggior parte delle blockchain EVM-compatibili.

Il Patricia Trie evita di memorizzare ripetutamente sotto-cammini comuni: nodi interni rappresentano prefissi condivisi, riducendo la profondità dell'albero e velocizzando la ricerca. La struttura Merkle garantisce che qualsiasi modifica a un dato foglia si propaghi cambiando gli hash lungo tutto il cammino fino alla radice, rendendo ogni manomissione immediatamente rilevabile.

---

## I due livelli di Ethereum 2.0

Dopo il Merge, Ethereum è strutturato in due livelli distinti che collaborano:

### Consensus Layer (Beacon Chain)

Il Consensus Layer gestisce il protocollo di consenso PoS e la validazione. Il suo blocco — il **Beacon Block** — non contiene direttamente transazioni o ricevute, ma include un riferimento al blocco dell'Execution Layer attraverso il campo `execution_payload_header`.

![Beacon Block Header — campi e tipi](images/lezione-26-ethereum-2-0-fees-and-tries-img-01.jpg)
*Fig. — Struttura del Beacon Block Header: gestisce slot, proposer, state root e il collegamento all'Execution Layer.*

### Execution Layer

L'Execution Layer gestisce le transazioni, i contratti intelligenti e i log. Il suo block header è ricco di radici Merkle che certificano lo stato del sistema:

![Execution Layer Block Header — campi e tipi](images/lezione-26-ethereum-2-0-fees-and-tries-img-02.jpg)
*Fig. — Struttura dell'Execution Layer Block Header: stateRoot, transactionsRoot, receiptsRoot e logsBloom sono le radici dei trie principali.*

I campi chiave per il Data Layer sono:
- `stateRoot` → radice del World State Trie
- `transactionsRoot` → radice del Transaction Trie
- `receiptsRoot` → radice del Receipts Trie
- `logsBloom` → Bloom filter aggregato di tutti i log del blocco

---

## I Trie dell'Execution Layer

La slide seguente mostra la relazione tra il blocco e i quattro trie principali:

![Diagramma dei trie dell'Execution Layer](images/lezione-26-ethereum-2-0-fees-and-tries-img-03.jpg)
*Fig. — Il blocco punta tramite radici hash al World State Trie, al Receipts Trie e al Transactions Trie. Il World State Trie punta all'Account Storage Trie per ogni contratto.*

![Diagramma Mermaid](images/mermaid-lezione-26-ethereum-2-0-fees-and-tries-02.png)
*Fig. — Relazione tra Block Header e i quattro trie dell'Execution Layer.*

> [!note] Quattro trie distinti
>
> - **World State Trie**: mappa ogni indirizzo → stato dell'account (nonce, balance, codeHash, storageRoot)
> - **Transaction Trie**: albero di tutte le transazioni del blocco; la radice è nel block header
> - **Receipts Trie**: albero delle ricevute di esecuzione (una per transazione)
> - **Account Storage Trie**: uno per ogni contratto, contiene le variabili di storage del contratto

---

## Il Transaction Trie

Il Transaction Trie è un MPT che indicizza tutte le transazioni di un blocco. Ogni transazione viene hashata, e gli hash vengono combinati fino a produrre un unico **root hash** incluso nel block header. Questo permette di:
- Rilevare qualsiasi modifica a una transazione (il root hash cambia)
- Dimostrare l'appartenenza di una transazione a un blocco senza scaricare il blocco completo (**Merkle proof**)
- Effettuare ricerche efficienti

---

## Logging e Transaction Receipt

### Perché i log

Consideriamo un contratto NFT. I dati di proprietà corrente dei token sono salvati nell'**account storage** — lo stato on-chain accessibile dal contratto. Ma altri tipi di informazione non richiedono di essere nello storage del contratto:

- La **storia delle proprietà** interessa analisti e investitori, ma il contratto non ne ha bisogno durante l'esecuzione.
- Le **notifiche al frontend** sono necessarie per confermare all'utente che un mint è avvenuto — ma le transazioni sono asincrone, quindi il contratto non può restituire un valore direttamente all'interfaccia.

La soluzione è che il contratto **emetta un evento** (`emit`), che viene scritto nei **log** della ricevuta di transazione. Il frontend può ascoltare questi log e reagire.

> [!tip] Log vs Storage
>
> Il log storage è **molto più economico** dell'account storage in termini di gas. È la scelta corretta per dati che non devono essere letti dal contratto stesso, ma solo da applicazioni esterne (DApp, analytics, indexer come The Graph).

### Struttura del Transaction Receipt

> [!definition] Transaction Receipt
>
> Struttura dati che registra l'esito dell'esecuzione di una transazione una volta inclusa in un blocco. Contiene:
> - **status**: 0 (fallita) o 1 (successo)
> - **cumulativeGasUsed**: gas consumato da tutte le transazioni precedenti nel blocco, inclusa quella corrente
> - **logs**: lista di log entries emesse dal contratto durante l'esecuzione
> - **logsBloom**: Bloom filter da 2048 bit costruito sulle log entries, per ricerca rapida

![Smart Contract → Transaction Receipt](images/lezione-26-ethereum-2-0-fees-and-tries-img-04.jpg)
*Fig. — Un contratto Solidity con evento Transfer emette il log quando viene chiamata send(); il log viene registrato nella ricevuta della transazione.*

### Status

Il campo `status` è 0 o 1. Poiché l'esecuzione è asincrona, il chiamante deve attendere che il blocco venga incluso per leggere lo status dalla ricevuta e determinare se la transazione ha avuto successo.

### cumulativeGasUsed

Il campo `gasUsed` nella ricevuta **non** è il gas consumato dalla singola transazione: è il **totale cumulativo** di tutto il gas utilizzato dalle transazioni dalla prima alla corrente nel blocco, inclusa quest'ultima.

![Schema gas cumulativo per transazione](images/lezione-26-ethereum-2-0-fees-and-tries-img-05.jpg)
*Fig. — Per la transazione N, gasUsed nella ricevuta e la somma del gas di tutte le transazioni da 1 a N. Nell'esempio, la ricevuta della tx 3 riporta 106.000 gwei = 21.000 + 50.000 + 35.000.*

---

## I parametri Indexed e la struttura dei Log

### Parametri indexed in Solidity

Nei contratti Solidity, i parametri di un evento possono essere dichiarati `indexed`. Questo indica che quei valori devono essere salvati nei **topics** del log (campi indicizzati), anziché nel campo `data` generico.

![Codice Solidity con parametri indexed](images/lezione-26-ethereum-2-0-fees-and-tries-img-06.jpg)
*Fig. — Nel contratto SimpleToken, from e to sono marcati indexed — vengono salvati nei topics della ricevuta per abilitare ricerche efficienti.*

I parametri `indexed` abilitano **ricerche e filtraggio efficienti**: per esempio, trovare tutti i trasferimenti di un token effettuati da un dato indirizzo, oppure tutti i token venduti da un utente. Sono salvati nei campi `topics` della ricevuta, mentre i parametri non-indexed finiscono nel campo `data`.

### La struttura completa di un evento loggato

![Evento Transfer — struttura completa nella ricevuta](images/lezione-26-ethereum-2-0-fees-and-tries-img-07.jpg)
*Fig. — A sinistra il contratto Token con l'evento Transfer; a destra la ricevuta con topics (event signature + from + to) e data (amount non-indexed).*

La struttura di un log entry nella ricevuta è:
- `address`: indirizzo del contratto che ha emesso l'evento
- `topics[0]`: keccak256 della firma dell'evento (es. `Transfer(address,address,uint256)`)
- `topics[1]`, `topics[2]`, ...: parametri `indexed` hashati
- `data`: parametri non-indexed codificati in ABI

---

## LogsBloom: filtraggio efficiente con Bloom Filter

Cercare tutte le transazioni di un blocco che coinvolgono un certo indirizzo richiederebbe di analizzare tutti i log di tutte le transazioni — un'operazione costosa. La soluzione è il **logsBloom**: un [[Bloom Filter]] da 2048 bit (256 byte) che riassume il contenuto dei log.

### LogsBloom nella ricevuta (livello transazione)

![LogsBloom nella ricevuta — Bloom Filter da 2048 bit](images/lezione-26-ethereum-2-0-fees-and-tries-img-08.jpg)
*Fig. — Per ogni transazione, logsBloom e un Bloom filter costruito sugli indirizzi e i topics dei log con keccak256 e 3 bit impostati nel vettore da 2048 bit.*

Il processo di costruzione:
1. Per ogni elemento (address o topic) nei log: calcola `keccak256(elemento)`
2. Deriva 3 posizioni nel vettore da 2048 bit usando 3 hash diversi
3. Imposta a 1 i 3 bit corrispondenti

### LogsBloom nel block header (livello blocco)

![LogsBloom nel Block Header — OR bitwise di tutti i receipt](images/lezione-26-ethereum-2-0-fees-and-tries-img-09.jpg)
*Fig. — Il logsBloom del block header e l'OR bitwise dei logsBloom di tutte le ricevute del blocco.*

Il `logsBloom` del block header è l'**OR bitwise** dei logsBloom di tutte le ricevute nel blocco. Questo permette una ricerca a due livelli:
1. Controlla il `logsBloom` del block header: se il bit cercato è 0, il blocco non contiene quell'evento (nessun falso negativo).
2. Solo se positivo, scendi a esaminare le singole ricevute.

> [!warning] Falsi positivi nel Bloom Filter
>
> Il Bloom Filter garantisce assenza di falsi negativi (se un elemento è nel set, il filtro lo conferma sempre), ma ammette **falsi positivi** (potrebbe indicare la presenza di un elemento che non c'è). Per questo motivo, dopo aver trovato un blocco candidato tramite il Bloom Filter, occorre verificare i dati effettivi.

---

## Il Transaction Receipt Trie e il Storage Trie

### Il Transaction Receipt Trie

![Transaction Receipt Trie — sequence diagram](images/lezione-26-ethereum-2-0-fees-and-tries-img-10.jpg)
*Fig. — Il Receipt Trie punta alle ricevute con Gas Used, Logs, Bloom Filter e Status Code. Il sequence diagram mostra l'interazione utente-World State Trie-Receipt Trie durante deploy multipli.*

Le ricevute di tutte le transazioni di un blocco sono indicizzate in un MPT. La radice di questo trie è il campo `receiptsRoot` del block header. Quando un utente vuole sapere se una transazione ha avuto successo o vuole recuperare gli eventi emessi, può richiedere una Merkle proof al nodo, senza dover scaricare l'intero blocco.

### Il Storage Trie

![Storage Trie — lettura/scrittura variabili contratto](images/lezione-26-ethereum-2-0-fees-and-tries-img-11.jpg)
*Fig. — Il campo storageRoot punta all'Account Storage Trie con uno slot per ogni contratto. Il sequence diagram mostra tre chiamate successive con lookup e aggiornamento del valore.*

Ogni account contratto ha il proprio **Account Storage Trie**, a cui si accede tramite il campo `storageRoot` dello World State Trie. Ogni variabile di stato del contratto occupa uno **slot** nell'albero. Ogni modifica di una variabile di storage aggiorna la radice del trie dell'account, che a sua volta aggiorna la radice dello World State Trie — propagazione tipica della struttura Merkle.

---

## Bitcoin vs. Ethereum: confronto finale

![Tabella comparativa Bitcoin vs Ethereum](images/lezione-26-ethereum-2-0-fees-and-tries-img-12.jpg)
*Fig. — Confronto su 14 dimensioni: anno di lancio, scopo, consenso, block time, supply model, transaction model, smart contracts, fees, use cases, state model e altro.*

> [!abstract] Differenze strutturali chiave
>
> - **Modello transazionale**: Bitcoin usa UTXO (Unspent Transaction Outputs), Ethereum usa un modello account-based con stato globale.
> - **Smart contract**: Bitcoin ha Script (limitato, non Turing-complete); Ethereum ha l'EVM con Solidity/Vyper (Turing-complete).
> - **Supply model**: Bitcoin ha un cap fisso di 21 milioni; Ethereum non ha cap fisso ma EIP-1559 introduce pressione deflazionistica tramite burn.
> - **Block time**: ~10 minuti per Bitcoin, ~12 secondi per Ethereum.
> - **Use cases**: Bitcoin è ottimizzato per pagamenti e riserva di valore ("digital gold"); Ethereum è una piattaforma programmabile per DeFi, NFT, DAO, dApp.

