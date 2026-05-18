---
tags:
  - università/p2p-systems-blockchain
  - blockchain
  - smart-contracts
  - defi
  - supply-chain
  - nft
data: 2026-05-12
lezione: "Lezione 27"
professore: "Laura Ricci"
---
# Applicazioni Reali con Smart Contracts

Le criptovalute come Bitcoin, Ethereum e Solana rappresentano le applicazioni più note della blockchain, ma si tratta soltanto del punto di partenza. L'introduzione degli **smart contract** ha reso possibile il passaggio da semplici transazioni finanziarie a sistemi digitali completamente programmabili on-chain: supply chain, token fungibili e non fungibili, finanza decentralizzata (DeFi), organizzazioni governate da comunità (DAO) e identità digitale auto-sovrana (SSI). La chiave di questa espansione è la **composabilità**: diversi protocolli possono essere combinati tra loro come moduli software, creando ecosistemi di applicazioni interoperabili.

---

## Caso d'uso: Supply Chain

### Limiti dell'architettura classica

Il problema di partenza è concreto: un'azienda come Alpha Corporation progetta e fa produrre macchinari complessi, li spedisce in sedi remote, li sottopone a manutenzione periodica tramite terze parti autorizzate, ne trasferisce la proprietà tra aziende diverse, e infine li dismette. In un'architettura centralizzata classica, la sede centrale A1 gestisce un database che traccia componenti, attrezzature, posizioni, storici di manutenzione e ciclo di vita. Questo approccio presenta fragilità strutturali: un attacco di tipo denial of service o una compromissione del database può cancellare o alterare i record; i processi manuali dipendono dalla memoria e dall'intervento umano; la conformità normativa e l'auditing da parte di terzi sono difficili da garantire; le dispute legali successive risultano costose e complesse perché l'auditabilità del sistema non è garantita by design.

### Blockchain permissioned per la supply chain

La soluzione proposta è una **blockchain permissioned**: una rete P2P privata in cui solo i partecipanti autorizzati possono unirsi e aggiungere blocchi. A differenza di una blockchain pubblica come Ethereum, l'accesso è controllato da un'entità centralizzata — in questo caso Alpha — che gestisce le chiavi pubbliche dei partecipanti tramite un **Membership Service Provider (MSP)**.

![Diagramma Mermaid](images/mermaid-lezione-27-applicazioni-reali-con-smart-contracts-01.png)
*Fig. — Architettura di una blockchain permissioned: ogni organizzazione gestisce un peer node e condivide un ledger immutabile; l'accesso è mediato dal Membership Service Provider (MSP).*

Il processo di bootstrap avviene in questo modo:

1. **Alpha (A1)** avvia la blockchain creando il blocco genesi, che contiene la propria chiave pubblica. Questa chiave servirà ad autenticare tutti i dati registrati da A1 in futuro.
2. **A2** (la fabbrica) e **B** (l'azienda di manutenzione) generano coppie di chiavi pubblica/privata e inviano le chiavi pubbliche ad A1, che le annuncia sulla blockchain. Da questo momento A2 e B sono nodi della rete P2P, gestiscono il proprio nodo blockchain e possono aggiungere blocchi.
3. Nessun partecipante conosce le chiavi private degli altri: l'impersonificazione è impossibile per costruzione crittografica.

#### Identificazione dei componenti e IoT

Ogni componente prodotto da A2 riceve una propria coppia di chiavi: la chiave pubblica viene annunciata sulla blockchain insieme alla posizione iniziale (magazzino della fabbrica), mentre la chiave privata può essere fisicamente incorporata nel componente. A seconda del valore del componente, la comunicazione con la blockchain avviene in modo diverso:

- **Componenti economici**: codice QR con la chiave pubblica; lettori RFID leggono la chiave e inviano report alla blockchain per conto del componente.
- **Componenti costosi**: tag RFID attivo con connettività Bluetooth; il componente può autonomamente contattare dispositivi vicini e inviare report on-chain.
- **Macchinario completo**: dispositivo IoT completamente connesso con GPS integrato, eventualmente un nodo blockchain leggero, e un lettore RFID integrato che scansiona tutti i componenti interni e rileva eventuali sostituzioni.

#### Smart contract e automazione della manutenzione

Quando un componente viene registrato sulla blockchain, all'annuncio della sua chiave pubblica può essere allegato uno smart contract. Questo contratto può innescare automaticamente richieste di manutenzione, ordini di sostituzione o procedure di dismissione senza intervento umano.

![Diagramma Mermaid](images/mermaid-lezione-27-applicazioni-reali-con-smart-contracts-02.png)
*Fig. — Flusso di automazione: dal rilevamento della condizione critica (IoT) all'esecuzione dello smart contract, fino alla registrazione immutabile dell'intervento.*

#### Revoca delle certificazioni

Se un tecnico lascia l'azienda B, il responsabile pubblica un messaggio di revoca della chiave sul blocco, firmato con la propria chiave privata. Tutti i record precedenti al blocco di revoca rimangono validi e immutabili; i record successivi firmati con la chiave revocata non sono più considerati autentici.

#### Trasferimento di proprietà e decommissioning

Quando il macchinario cambia proprietario (dall'azienda X alla Y), l'evento viene registrato sulla blockchain, creando un registro immutabile di provenienza. Al termine del ciclo di vita, la dismissione viene certificata con la firma del produttore originale A, consentendo futuri audit ambientali e di conformità normativa. Al termine dell'intero processo esiste sulla blockchain un registro completo di tutti i partecipanti, componenti, posizioni, interventi e trasferimenti: i record non possono essere alterati né cancellati, e non esiste un single point of failure.

---

## Certificazione e Tracciabilità

Oltre alla supply chain industriale, la blockchain trova applicazione ovunque sia necessaria la **tracciabilità** di prodotti lungo l'intera catena di distribuzione e la **prova di autenticità** a prova di manomissione. I settori principali includono: alimentare e agricoltura, farmaceutica, manifattura industriale, edilizia e BIM (dove si tracciano materiali, certificazioni e dati del ciclo di vita dell'edificio), beni di lusso e diamanti.

> [!note] EU Digital Product Passport
>
> L'Unione Europea sta valutando il Digital Product Passport (DPP) per tracciare sostenibilità e provenienza dei prodotti. I pilot attuali esplorano blockchain, Decentralized Identifiers (DID), Verifiable Credentials e smart contract. Lo scenario più realistico prevede architetture ibride: database centralizzati con prove su blockchain, reti DLT permissioned e standard di interoperabilità come EBSI.

---

## NFT: Arte Digitale e Proprietà

Un'opera d'arte digitale è banalmente copiabile: chiunque può farne screenshot o download. Ma **copiare non significa possedere**. In un sistema tradizionale, la proprietà resta all'artista o a chi detiene il copyright, indipendentemente da quante copie circolino. L'analogia fisica è la prima edizione di un libro: ha lo stesso contenuto di tutte le ristampe, ma vale di più.

Gli **NFT** (Non Fungible Token, token non fungibili) estendono questo concetto al digitale. Quando Beeple ha mintato il suo NFT per l'opera *Everydays: The First 5000 Days*, ha creato un token sulla blockchain contenente:
- Un **fingerprint unico** del file dell'opera (`8a5de7b183ecf2ec9f488`)
- Il nome del token: `Everydays: The First 5000 Days`
- Il simbolo: `EF5000D`

La transazione sulla blockchain registra che "il token `8a5de7b183ecf2ec9f488` è creato da Beeple, che ne è il proprietario." L'opera stessa **non è nel blocco**: l'NFT contiene solo un link al file archiviato su un file system distribuito (IPFS o equivalente). Ciò che si acquista è il certificato di proprietà, non il file — esattamente come comprare la chitarra di Elvis Presley: chiunque può comprare una chitarra identica, ma solo una ha quel certificato di autenticità.

---

## DeFi — Finanza Decentralizzata

La **DeFi** (Decentralized Finance) è l'insieme di applicazioni finanziarie costruite su blockchain che eliminano intermediari tradizionali come banche, broker e exchange, sostituendoli con smart contract e protocolli automatizzati.

### Stable Coin

Le criptovalute tradizionali sono altamente volatili. Una **stable coin** è progettata per mantenere un valore stabile, tipicamente agganciato a una valuta fiat (1 coin = 1 USD). Questo permette di integrare valute reali nelle applicazioni on-chain e offre a persone in paesi con alta inflazione un'alternativa digitale al dollaro senza necessitare di un conto bancario statunitense.

> [!definition] Tipi di Stable Coin
>
> | Tipo | Backing | Custodia | Esempi |
> |------|---------|----------|--------|
> | **Fiat-Collateralized** | Valute fiat 1:1 in riserva presso un ente | Custodial | USDC, USDT, BUSD |
> | **Commodity-Backed** | Materie prime fisiche (oro, argento) | Custodial | PAXG, XAUT |
> | **Crypto-Collateralized** | Crypto bloccate in smart contract (over-collateralized) | Non-custodial | DAI, LUSD |
> | **Algorithmic** | Algoritmi + incentivi di mercato | Non-custodial | FRAX, AMPL |

#### Fiat-Backed: ciclo di vita completo

Il ciclo di vita di una stable coin fiat-backed si articola in tre operazioni governate da uno smart contract **ERC-20**:

**Minting** — Bob deposita 100 USD e Alice 35 USD presso il custodian (la banca). Il custodian chiama `mint(Bob, 100)` e `mint(Alice, 35)` sul contratto ERC-20. Il contratto aggiorna il mapping `_balances` on-chain. La riserva del custodian ammonta a 135 USD.

**Transfer** — Bob paga 15 USDC a Carol chiamando `transfer(Bob → Carol, 15)` sul contratto (pagando la gas fee). Il trasferimento avviene completamente on-chain senza coinvolgere il custodian: i saldi diventano Bob: 85, Alice: 35, Carol: 15.

**Withdrawal** — Bob ritira 60 USD reali. Il custodian chiama `burn(Bob, 60)` sul contratto, distruggendo i token. Il saldo di Bob scende a 25 USDC, la riserva del custodian si riduce a 75 USD, e Bob riceve 60 USD fisici.

![Diagramma Mermaid](images/mermaid-lezione-27-applicazioni-reali-con-smart-contracts-03.png)
*Fig. — Ciclo completo di una stable coin fiat-backed: il minting e il withdrawal coinvolgono il custodian; il trasferimento è puramente on-chain.*

#### Stabilità tramite arbitraggio

Le stable coin fiat-backed mantengono il peg attraverso l'**arbitraggio**: se 1 USDC vale 1,02 USD sul mercato secondario, i trader acquistano USD dalla banca a 1:1 e vendono USDC sul mercato, spingendo il prezzo verso il basso. Il meccanismo inverso vale quando il prezzo scende sotto il peg.

#### Crypto-Collateralized

Le stable coin crypto-collateralized sono decentralizzate e non-custodial: il collaterale è bloccato in smart contract, non presso una banca. Poiché le criptovalute sono volatili, è richiesta la **over-collateralization**: per mintare 100 USD di stable coin occorre depositare 150 USD di ETH. Se il valore del collaterale scende sotto la soglia di sicurezza, la posizione viene liquidata automaticamente.

#### Algorithmic Stable Coin

Le stable coin algoritmiche mantengono il peg senza riserve complete, usando algoritmi, smart contract e meccanismi di arbitraggio. Un oracolo monitora il prezzo di mercato e lo invia on-chain: se il prezzo supera il peg, l'offerta aumenta; se scende al di sotto, l'offerta si riduce.

---

### Lending e Borrowing

I protocolli DeFi di lending replicano on-chain la funzione delle banche commerciali: chi ha liquidità la presta guadagnando interessi; chi ha asset ma non vuole venderli ottiene liquidità depositando collaterale. Il sistema coinvolge quattro attori: lender, borrower, price oracle e liquidator.

![Diagramma Mermaid](images/mermaid-lezione-27-applicazioni-reali-con-smart-contracts-04.png)
*Fig. — Modello generale del lending DeFi: il vault gestisce collaterale e debito; l'oracle fornisce prezzi; il liquidator interviene quando il Health Factor scende sotto 1.*

#### Il lender

Il lender deposita asset liquidi (es. 50.000 USDC) nel protocollo e riceve in cambio token di interesse. Nel tempo accumula rendimento proporzionale alla liquidità fornita e alla domanda di prestito.

#### Il borrower e l'over-collateralization

Il borrower deposita collaterale (es. 10 ETH a $3.000 = $30.000) e ottiene liquidità (es. 20.000 USDC) senza vendere i propri asset. La motivazione è strategica: Bob vede i suoi BTC o ETH come asset con potenziale di apprezzamento a lungo termine e preferisce ottenerci liquidità piuttosto che venderli. Il protocollo traccia il **Health Factor (HF)**:

$$HF = rac{	ext{Valore collaterale} 	imes 	ext{Liquidation threshold}}{	ext{Valore debito}}$$

Quando $HF < 1$, la posizione è sottocollateralizzata e diventa liquidabile.

#### Il liquidatore

Se il mercato crolla e il collaterale scende sotto soglia (es. ETH da $3.000 a $2.200, collaterale vale $22.000 ma debito è ancora $20.000), il protocollo consente a qualsiasi liquidatore di intervenire:

1. Alice (liquidator) rimborsa 5.000 USDC del debito di Bob.
2. Il protocollo dà ad Alice ETH per $5.500 (liquidation bonus del 10%).
3. Bob perde parte del collaterale, ma il suo debito si riduce; Alice guadagna il bonus; il protocollo rimane solvente.

> [!warning] Il ruolo critico dell'oracle
>
> Per calcolare il Health Factor in tempo reale, il protocollo deve conoscere il prezzo corrente dell'ETH. Ma una blockchain è un "database isolato" senza connessione a Internet. La soluzione sono i **blockchain oracle**: servizi che portano dati off-chain (prezzi di mercato, risultati sportivi, orari voli) on-chain in modo sicuro.

#### Blockchain Oracle — use case

| Use Case | Dato richiesto |
|----------|---------------|
| Lending/Borrowing | Prezzi in tempo reale per il calcolo del Health Factor e trigger di liquidazione |
| Mercati scommesse | Risultato finale di eventi sportivi |
| Assicurazione voli | Orari e ritardi per contratti di rimborso automatico |
| Stable coin algoritmiche | Prezzo di mercato della stable coin per regolare l'offerta |

---

### Flash Loan

> [!definition] Flash Loan
>
> Un **flash loan** è un prestito preso e rimborsato all'interno di una singola transazione atomica. Se il rimborso fallisce, l'intera transazione viene revertita automaticamente: zero rischio per il lender, zero collaterale necessario per il borrower — la garanzia è l'atomicità della transazione stessa.

La potenza dei flash loan risiede nel permettere accesso a capitali enormi per pochi secondi al fine di eseguire operazioni complesse come l'arbitraggio. Esempio concreto:

1. Borrow di 1.000.000 USDC dal protocollo di lending.
2. Acquisto di ~625 ETH su DEX A (prezzo più basso).
3. Vendita dei ~625 ETH su DEX B (prezzo più alto), ricevendo ~1.025.000 USDC.
4. Rimborso di 1.000.900 USDC (loan + fee) al protocollo.
5. Profitto netto: ~24.100 USDC.
6. Tutta la sequenza è un'unica transazione atomica: se un passo fallisce, tutto si reverte e il prestito non viene mai erogato.

![Diagramma Mermaid](images/mermaid-lezione-27-applicazioni-reali-con-smart-contracts-05.png)
*Fig. — Flash loan per arbitraggio: borrow → buy on DEX A → sell on DEX B → repay, tutto in un'unica transazione atomica.*

---

## Exchange: Centralizzati vs Decentralizzati

### CEX — Exchange Centralizzati

Un exchange centralizzato (CEX) funziona come un mercato finanziario tradizionale: gli utenti depositano fondi sulla piattaforma, che gestisce custodia, esecuzione e liquidità. Il meccanismo centrale è l'**order book**: i compratori specificano il prezzo massimo che sono disposti a pagare (*bid*), i venditori il prezzo minimo accettabile (*ask*). Quando bid e ask si incontrano, avviene la transazione e il prezzo dell'incrocio diventa il prezzo di mercato. Esempi: Binance, Coinbase, Kraken.

> [!example] Order Book BTC/USDT
>
> | BUY ORDERS (Bids) | | | SELL ORDERS (Asks) | |
> |---|---|---|---|---|
> | Price (USDT) | Qty (BTC) | | Price (USDT) | Qty (BTC) |
> | 66.350 | 0.4200 | | 66.450 | 0.6000 |
> | 66.300 | 1.2500 | | 66.500 | 1.0000 |
> | 66.250 | 0.7500 | | 66.550 | 0.8500 |
>
> **Best bid**: 66.350 USDT | **Best ask**: 66.450 USDT | **Spread**: 100 USDT | **Mid price**: 66.400 USDT

### DEX — Exchange Decentralizzati

Un exchange decentralizzato (DEX) consente agli utenti di scambiare token direttamente dal proprio wallet, senza depositare fondi su una piattaforma centralizzata. I token vengono acquistati da una **liquidity pool**: un deposito di coppia di token (es. USDC/WETH) fornito da utenti chiamati **Liquidity Provider (LP)**, che guadagnano le fee sulle transazioni. Il prezzo non emerge da ordini umani ma da una formula matematica eseguita dallo smart contract.

![Diagramma Mermaid](images/mermaid-lezione-27-applicazioni-reali-con-smart-contracts-06.png)
*Fig. — Struttura di un DEX: i liquidity provider alimentano la pool con entrambi i token della coppia; il trader swappa pagando una fee che va agli LP.*

### Automated Market Maker (AMM)

#### La Constant Product Formula

Il cuore matematico dell'AMM è la **constant product formula**:

> [!definition] Constant Product Formula
>
> $$x \cdot y = k$$
>
> dove $x$ = quantità del token X nella pool, $y$ = quantità del token Y, $k$ = costante. Il prodotto dei due saldi rimane costante dopo ogni swap.

![Constant Product Formula: iperbola xy=k con stato prima e dopo uno swap](images/lezione-27-applicazioni-reali-con-smart-contracts-img-01.jpg)
*Fig. — La curva iperbola $xy = k$: a sinistra lo stato iniziale ($x_0 = 10, y_0 = 30, k = 300$); a destra lo stato dopo uno swap ($x_1 = 15, y_1 = 20, k$ rimane 300). Il punto si muove lungo la curva mantenendo il prodotto costante.*

L'intuizione è immediata: più un asset diventa scarso nella pool (il suo $x$ o $y$ diminuisce), più il suo prezzo aumenta. Non c'è order book, non ci sono trader umani: solo matematica, liquidità e smart contract.

#### Il prezzo istantaneo

Per una curva $\psi(x, y) = \text{costante}$, il prezzo istantaneo di Y in termini di X si ricava come la pendenza della tangente alla curva nel punto corrente:

$$P_{Y/X} = \frac{dY}{dX} = \frac{y}{x}$$

![Prezzo istantaneo nell'AMM: slope della tangente alla curva xy=k](images/lezione-27-applicazioni-reali-con-smart-contracts-img-02.jpg)
*Fig. — Il prezzo istantaneo di Y è il rapporto $y/x$, ovvero la pendenza della tangente alla curva $\psi(x,y) = \text{costante}$ nel punto corrente.*

#### Variazioni di $k$

$k$ non è permanentemente fisso: aumenta quando i liquidity provider aggiungono liquidità o quando le fee di trading si accumulano nella pool; diminuisce quando la liquidità viene rimossa. Gli swap spostano il punto lungo la curva; le operazioni di liquidità spostano l'intera curva. In conclusione, in un CEX i prezzi emergono dalla competizione di ordini umani/automatici nel mercato; in un AMM i prezzi emergono automaticamente dalla formula matematica e dal bilanciamento degli asset nella pool.

---

## Tokenizzazione di Asset Reali (RWA)

I **Tokenized Real-World Assets (RWA)** sono asset fisici o finanziari tradizionali rappresentati digitalmente su blockchain. Un asset reale viene convertito in un token blockchain che può essere scambiato, trasferito o usato in applicazioni DeFi. Esempi: immobili, titoli di stato, azioni, materie prime (oro, petrolio), opere d'arte, crediti privati.

Il processo è concettualmente semplice: l'asset esiste off-chain, una struttura legale collega l'asset al token on-chain, e il token rappresenta proprietà o quote dell'asset. I vantaggi rispetto alla finanza tradizionale: **proprietà frazionata**, **liquidità aumentata**, **trading 24/7 globale**, **settlement più rapido**, **maggiore trasparenza** e **integrazione nativa con smart contract e DeFi**.

> [!example] Esempi reali
>
> - **BlackRock BUIDL**: fondo che investe in T-bill americani a breve termine; la proprietà è rappresentata da token blockchain.
> - **Maple Finance**: tokenizzazione di prestiti e prodotti di credito istituzionali.
> - Esperimenti di tokenizzazione immobiliare a Dubai, Singapore e Svizzera.

---

## Rischi Nascosti nel DeFi

La DeFi rimuove banche e intermediari sostituendoli con smart contract e transazioni blockchain pubbliche. Questa trasparenza apre però la porta a nuove forme di manipolazione del mercato basate sull'**ordinamento delle transazioni**.

Prima di essere confermate on-chain, le transazioni rimangono visibili nel **mempool pubblico**, dove i validatori (miner nel PoW, proposer nel PoS) possono osservarle e decidere l'ordine di inclusione nel blocco. Chi controlla l'ordinamento può influenzare gli outcome di mercato.

### Sandwich Attack

> [!warning] Sandwich Attack
>
> Un attaccante osserva una transazione profittevole della vittima nel mempool e la circonda con due proprie transazioni:
>
> 1. **Front-run** ($T_{A_1}$, gas price **più alto** di $T_V$): compra lo stesso asset prima della vittima, facendone salire il prezzo.
> 2. **Vittima** ($T_V$): acquista l'asset a prezzo ormai più alto, subendo slippage sfavorevole.
> 3. **Back-run** ($T_{A_2}$, gas price **più basso** di $T_V$): vende l'asset al prezzo gonfiato dalla transazione della vittima, intascando il profitto.

![Sandwich attack: T_A1 inserita prima di T_V, T_A2 inserita dopo nel blocco](images/lezione-27-applicazioni-reali-con-smart-contracts-img-03.jpg)
*Fig. — Il sandwich attack: $T_{A_1}$ (front-run) e $T_{A_2}$ (back-run) circondano $T_V$ (vittima) nel blocco proposto. I miner includono nell'ordine corretto grazie al differenziale di gas price.*

### MEV — Maximum Extractable Value

> [!definition] MEV
>
> Il **Maximum Extractable Value (MEV)** è il massimo profitto estraibile dal controllo dell'ordinamento e della selezione delle transazioni nella produzione di un blocco. Un miner o validatore può includere, escludere o riordinare arbitrariamente le transazioni.

Oggi la maggior parte dell'estrazione MEV proviene da **Bot Operator** che monitorano continuamente il mempool, identificano opportunità (sandwich attack, arbitraggio tra pool, liquidazioni) e le sfruttano automaticamente. Il MEV non è un bug accidentale: è una conseguenza strutturale della trasparenza del mempool e della discrezionalità sull'ordinamento.

### Prevenzione degli attacchi

Due meccanismi principali:

- **Limite sul gas price**: impedisce agli utenti di ottenere priorità tramite offerte più alte. Non funziona se i miner stessi sono gli attaccanti.
- **Commit-reveal scheme**: la transazione viene inviata con informazioni nascoste (hash dell'intenzione); solo dopo che la transazione è inclusa nel blocco l'utente rivela i dati in chiaro con una seconda transazione. L'attaccante nel mempool vede solo l'hash, non i dettagli dell'operazione, rendendo impossibile il front-running.

---

## Conclusione: Innovazioni Fondamentali della DeFi

> [!abstract] Core innovations
>
> - **Flash Loan**: accesso a capitale senza collaterale, rimborsato nella stessa transazione atomica; zero rischio per il lender.
> - **Automated Market Maker (AMM)**: pool di liquidità algoritmiche che eliminano l'order book; il prezzo è un output matematico deterministico.
> - **Finanza composabile**: i protocolli si combinano come moduli software, creando ecosistemi di applicazioni interoperabili.
> - **Accesso permissionless**: chiunque può usare i protocolli finanziari senza banche né intermediari.
> - **Logica finanziaria programmabile**: mercati, lending e governance diventano codice eseguibile on-chain.
> - **On-chain governance**: i protocolli sono gestiti collettivamente tramite token voting.
> - **Infrastruttura finanziaria aperta**: i sistemi finanziari diventano API pubbliche accessibili a qualsiasi sviluppatore.

