# Ethereum: Account, Transazioni e Gas

## Smart Contracts: l'idea originale

Il concetto di **smart contract** non nasce con Ethereum. Fu Nick Szabo a formularne l'idea nel 1994, descrivendolo come un protocollo di transazione computerizzato che esegue i termini di un contratto, con l'obiettivo di soddisfare condizioni contrattuali comuni, minimizzare eccezioni (sia dolose che accidentali) e ridurre il bisogno di intermediari fiduciari.

> [!definition] Smart Contract
>
> Un programma informatico che automatizza la logica "se questo accade, allora fai quello" tipica dei contratti tradizionali. Il codice informatico si comporta in modo prevedibile ed è privo delle sfumature linguistiche del linguaggio naturale.

La novità fondamentale rispetto a un contratto cartaceo è triplice: il codice è **più funzionale**, può **ridurre i costi**, e soprattutto tende a **eliminare l'intermediario fiducioso** (banca, notaio, assicurazione). La crittografia e i meccanismi di sicurezza garantiscono che le relazioni algoritmicamente specificabili non possano essere violate.

### L'esempio dell'aeroporto

L'esempio didattico classico è quello assicurativo: Bob è in aeroporto e il suo volo subisce un ritardo. L'assicurazione ha caricato su una blockchain (per esempio Ethereum) uno smart contract che monitora i ritardi dei voli collegandosi al database della compagnia. Non appena la condizione "ritardo ≥ X ore" viene verificata, il contratto accredita automaticamente l'importo assicurato nel wallet di Bob.

Il meccanismo si articola in tre fasi distinte. Prima, il contratto viene **creato** con i termini e le condizioni, e registrato in un blocco della blockchain tenendo fermi i fondi della compagnia assicurativa finché la condizione non si avvera. Poi il contratto viene **eseguito** da tutti i nodi della rete P2P, che prelevano i dati dal database dei voli: tutti i nodi devono convergere allo stesso risultato. Infine, se la maggioranza dei nodi onesti valuta la condizione come vera, la compensazione viene trasferita automaticamente a Bob.

---

## Perché Bitcoin non basta: i limiti degli script

Prima di capire cosa fa Ethereum, è utile capire cosa non riesce a fare Bitcoin. Il linguaggio di scripting di Bitcoin presenta tre limitazioni strutturali:

- **Non è Turing-completo**: mancano i cicli, quindi i programmi esprimibili sono solo un sottoinsieme finito di computazioni.
- **Nessuna variabile di stato persistente**: gli script Bitcoin consumano i propri input per produrre un output, ma non lasciano alcuno stato residuo. Un contratto che ha bisogno di "ricordare" informazioni tra un'esecuzione e l'altra è impossibile da implementare.
- **Cecità verso la blockchain**: gli script non possono accedere ai valori degli header dei blocchi (nonce, timestamp, hash del blocco precedente).

> [!tip] Intuizione chiave
>
> Bitcoin è uno storage distribuito di transazioni. Ethereum estende questo modello trasformando la blockchain in un **computer distribuito**: non solo lo storage è replicato, ma anche la computazione. I nodi non si limitano a validare transazioni, eseguono codice.

---

## Ethereum in breve: il world computer

Ethereum è una piattaforma blockchain per la costruzione di **applicazioni decentralizzate** (*DApps*). Fu ideata da **Vitalik Buterin** (nato il 31 gennaio 1994) e lanciata nel 2015.

A differenza di Bitcoin, in Ethereum:
- il **codice** delle applicazioni e il loro **stato** sono memorizzati sulla blockchain,
- le **transazioni** non solo trasferiscono criptovaluta, ma possono innescare l'esecuzione di codice, aggiornare stato, emettere eventi e scrivere log,
- le **interfacce frontend** possono rispondere a eventi e leggere log dalla chain.

Le applicazioni di Ethereum vanno ben oltre il semplice trasferimento di valore: crowdfunding, token (ERC-20), DeFi, NFT, catene di approvvigionamento, IoT, voto, identità digitale sovrana (SSI). Tra gli esempi concreti: *Ethereum Name Service*, *Cryptokitties*, exchange decentralizzati.

> [!note] ICO (Initial Coin Offering)
>
> Un meccanismo basato sul token standard ERC-20 che consente a un'azienda di raccogliere fondi emettendo nuovi token. Negli anni 2017-2018 gli investimenti in ICO raggiunsero rispettivamente 7 e 12 miliardi di dollari.

### Ethereum come macchina a stati distribuita

Il modello formale di Ethereum è quello di una **macchina a stati deterministica distribuita**:

- lo **stato globale** è l'insieme degli stati di tutti gli smart contract,
- le **transazioni** sono gli eventi che cambiano lo stato globale,
- il **consenso** garantisce che tutti i nodi concordino sul risultato dell'esecuzione e aggiornino il proprio ledger in modo coerente.

Una proprietà cruciale è il **determinismo**: lo smart contract deve produrre lo stesso risultato su ogni nodo. Questo implica che la logica sia visibile a tutti (trasparenza), ma può creare problemi di privacy — risolvibili in alcuni casi con prove a conoscenza zero (*zero-knowledge proofs*).

---

## The Merge: da Proof of Work a Proof of Stake

Ethereum nacque con un meccanismo di consenso **Proof of Work**, identico per principio a quello di Bitcoin. Nel settembre 2022, con l'evento noto come **The Merge**, la rete è passata al **Proof of Stake**.

![Diagramma del Merge: Ethereum Mainnet e Beacon Chain](images/lezione-19-ethereum-accounts-transactions-gas-img-01.jpg)
*Fig. — The Merge (settembre 2022): la Ethereum Mainnet (PoW) converge con la Beacon Chain (PoS), attiva in parallelo dal 2020. Da quel momento, il consenso è gestito interamente da PoS.*

La transizione era stata preparata con la **Beacon Chain**, una chain parallela basata su PoS attiva dal 2020. Al momento del Merge, la Mainnet PoW si è "agganciata" alla Beacon Chain, che da allora gestisce il consenso.

---

## Da Bitcoin a Ethereum: il modello a stati

### Bitcoin come macchina a stati: UTXO

Prima di analizzare Ethereum, vale la pena fissare il modello di Bitcoin come termine di paragone.

![Diagramma della macchina a stati Bitcoin basata su UTXO](images/lezione-19-ethereum-accounts-transactions-gas-img-02.jpg)
*Fig. — In Bitcoin lo stato è l'insieme degli UTXO (Unspent Transaction Output). Una transazione consuma degli UTXO esistenti e ne crea di nuovi, generando la transizione S → S'.*

Il saldo disponibile di un utente Bitcoin è la somma dei suoi UTXO. Ogni UTXO esiste una sola volta e viene consumato dalla transazione che lo spende: questo rende impossibile il doppio utilizzo a livello strutturale.

### Ethereum: account-based

Ethereum usa invece un modello **account-based**, simile a quello bancario. Lo stato globale non è un insieme di output non spesi, ma un insieme di **account**, ognuno con il proprio saldo e, nel caso degli smart contract, con il proprio codice e storage.

> [!definition] Ethereum come macchina a stati
>
> Una macchina virtuale deterministica che applica cambiamenti allo stato globale replicato. A differenza di Bitcoin, chiunque può definire le proprie funzioni di transizione di stato tramite smart contract.

---

## Gli Account di Ethereum

Ogni account Ethereum è identificato da un indirizzo di **20 byte (160 bit)**. Esistono due tipi fondamentalmente diversi.

### Externally Owned Account (EOA)

Gli **EOA** sono gli account "personali", controllati da un'entità esterna (persona o organizzazione) tramite una **chiave privata**. Chi possiede la chiave privata può accedere ai fondi e invocare smart contract.

Un EOA contiene:
- **address**: l'indirizzo pubblico dell'account
- **Ether balance**: il saldo in Ether
- **nonce**: il numero totale di transazioni emesse da quell'account (da non confondere con il nonce PoW!)

Un EOA può inviare transazioni per trasferire Ether o per invocare uno smart contract.

### Contract Account

Gli account contratto sono controllati non da una chiave privata, ma dal **codice** associato. Contengono:
- **contract code**: il bytecode immutabile del contratto
- **persistent storage**: le variabili interne del contratto
- **Ether balance**: come gli EOA, possono ricevere e inviare Ether
- **nonce**: numero di messaggi inviati da questo account

Gli account contratto **non hanno chiave privata**: non possono iniziare autonomamente una transazione, ma solo rispondere a transazioni o messaggi ricevuti.

![Schema strutturale degli account Ethereum: EOA e Contract Account a confronto](images/lezione-19-ethereum-accounts-transactions-gas-img-03.jpg)
*Fig. — Confronto strutturale tra EOA e Contract Account. L'EOA usa una chiave privata per firmare transazioni e ne deriva l'indirizzo con Keccak-256; il Contract Account espone bytecode EVM e storage persistente. Entrambi condividono lo spazio di indirizzamento a 20 byte (160 bit).*

> [!warning] Generazione degli indirizzi
>
> Per un EOA: `EOA = Keccak-256(publicKey)[rightmost 20 bytes]`
> Per un Contract Account: `Contract = Keccak-256(RLP(sender, nonce))[rightmost 20 bytes]`

La tabella seguente riassume le differenze operative:

![Tabella di confronto tra EOA e Contract Account per caratteristiche](images/lezione-19-ethereum-accounts-transactions-gas-img-04.jpg)
*Fig. — Confronto delle capacità: solo gli EOA possono inviare transazioni firmate; solo i Contract Account hanno codice e storage. I contratti possono inviare messaggi (non transazioni firmate) ad altri contratti e crearne di nuovi.*

---

## Transazioni in Ethereum

Qualsiasi azione sulla blockchain Ethereum è sempre **avviata da una transazione proveniente da un EOA**. Gli EOA sono il ponte tra il mondo esterno e lo stato interno di Ethereum.

> [!definition] Transazione
>
> Un pacchetto dati firmato, serializzato e inviato da un EOA a un altro account. Può innescare messaggi successivi tra contratti, genera una modifica allo stato della blockchain se inclusa in un blocco, e può essere usata per creare nuovi contratti.

### Transazione EOA → EOA

La forma più semplice di transazione trasferisce Ether da un EOA a un altro, funzionalmente analoga a una transazione Bitcoin — ma basata su account, non su UTXO.

![Formato della transazione EOA-to-EOA: campi signature, to, amount](images/lezione-19-ethereum-accounts-transactions-gas-img-05.jpg)
*Fig. — Formato della transazione EOA→EOA. I campi principali: `signature` (firma ECDSA del mittente), `to` (indirizzo del destinatario a 20 byte), `amount` (valore in wei).*

### Il nonce della transazione

> [!definition] Transaction Nonce
>
> Un valore scalare uguale al numero di transazioni inviate da quell'indirizzo (per gli EOA) o al numero di contratti creati (per i contract account). È un attributo dell'account mittente, non della singola transazione.

Il nonce serve a due scopi: **registrare l'ordine delle transazioni** e **proteggere dal replay attack**.

#### Il replay attack

Il problema nasce dalla differenza strutturale tra Bitcoin ed Ethereum. In Bitcoin ogni UTXO può essere speso una sola volta: una volta consumato, sparisce. In Ethereum invece esiste un saldo di account, e la stessa transazione firmata potrebbe in principio essere ritrasmessa più volte sulla rete.

Il replay attack funziona così: Alice firma una transazione per inviare 10 ETH a Bob. Bob, dopo che la transazione è stata minata, può prendere la stessa transazione e ritrametterla ripetutamente, svuotando progressivamente il conto di Alice.

La soluzione di Ethereum è il nonce: ogni transazione deve includere il nonce corrente dell'account mittente, e la rete non accetta una seconda transazione con lo stesso nonce. Bob non può modificare il nonce perché questo invaliderebbe la firma di Alice.

> [!warning] Ordinamento obbligatorio
>
> Il nonce impone un ordine rigido. Una transazione con nonce 2 non può essere minata se la rete non ha già confermato quelle con nonce 0 e 1. Le transazioni devono essere in sequenza e non possono essere saltate.

---

## Transizioni di stato in Ethereum

### Transizione semplice EOA→EOA

![Esempio di transizione di stato tra EOA: Alice invia 10 ETH a Bob](images/lezione-19-ethereum-accounts-transactions-gas-img-06.jpg)
*Fig. — Transizione di stato EOA→EOA. Alice (50 ETH, nonce 5) invia 10 ETH a Bob (30 ETH). Lo stato S' vede Alice a 40 ETH (nonce 6) e Bob a 40 ETH. Se il saldo fosse insufficiente (es. Alice=50, Bob=30, send 70) la funzione APPLY restituisce ERROR.*

### Transizione con Smart Contract

![Esempio di transizione di stato con smart contract che aggiorna il proprio storage](images/lezione-19-ethereum-accounts-transactions-gas-img-07.jpg)
*Fig. — Transizione di stato con contract account. Il mittente invia una transazione con value 10 e data "CHARLIE" al contratto. Il contratto aggiorna il proprio storage (la lista diventa [ALICE, BOB, CHARLIE]) e i saldi vengono aggiornati di conseguenza.*

---

## Lifecycle degli Smart Contract

Uno smart contract attraversa tre fasi principali:

![Diagramma del ciclo di vita di uno smart contract: Creation, Interaction, Destruction](images/lezione-19-ethereum-accounts-transactions-gas-img-08.jpg)
*Fig. — Il lifecycle di uno smart contract è una progressione lineare: Creazione → Interazione → Distruzione (opzionale).*

### Creazione

Solo un EOA può creare (fare il *deploy* di) uno smart contract sulla blockchain. La creazione avviene tramite una transazione speciale in cui il campo `to` è **vuoto** (nessun indirizzo di destinazione finché il contratto non è deployato), e il campo `data` contiene il **bytecode compilato** del contratto.

![Formato della transazione di creazione contratto: campo to vuoto, data con bytecode](images/lezione-19-ethereum-accounts-transactions-gas-img-09.jpg)
*Fig. — Transazione di creazione: il campo `to` è vuoto (l'indirizzo del contratto viene generato al deploy), il campo `data` contiene il bytecode EVM del contratto.*

### Interazione

Una volta deployato, il contratto può essere invocato da:
- un **EOA** tramite una transazione che specifica l'indirizzo del contratto e il metodo da chiamare,
- un **altro contratto** tramite un messaggio interno (non una transazione firmata).

![Formato della transazione di interazione con un contratto: to=indirizzo contratto, data=metodo+parametri](images/lezione-19-ethereum-accounts-transactions-gas-img-10.jpg)
*Fig. — Transazione di interazione: `to` contiene l'indirizzo del contratto, `data` codifica il metodo da invocare tramite function selector (primi 4 byte del Keccak-256 del prototipo della funzione) + argomenti ABI-encoded.*

> [!note] Contract-to-Contract
>
> I contratti non possono avviare transazioni autonomamente, ma possono costruire percorsi di esecuzione complessi generando **messaggi** verso altri contratti come risposta a una transazione ricevuta da un EOA o da un altro contratto.

### Caratteristiche di esecuzione

Quando uno smart contract riceve una transazione o un messaggio, viene eseguito dall'**Ethereum Virtual Machine (EVM)**. Le azioni possibili includono:
- calcoli aritmetici/logici,
- scrittura sullo storage interno,
- invio di messaggi ad altri smart contract,
- creazione di nuovi contratti.

### Distruzione

Un contratto può essere eliminato dalla blockchain invocando l'operazione **`selfdestruct`**. La transazione di distruzione contiene nel campo `data` il nome del metodo che chiama `selfdestruct`, e nel campo `to` l'indirizzo del contratto. Dopo la distruzione, il contratto non è più eseguibile.

### Esempio Naive in Solidity

```solidity
pragma solidity ^0.8.0;

contract Crowdsale {
    mapping(address => uint256) public balances;
    uint256 public totalRaised;

    function contribute() public payable {
        require(msg.value > 0, "Contribution amount must be greater than zero");
        balances[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds available to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
```

Questo semplice contratto di crowdfunding mostra i meccanismi fondamentali di Solidity: un `mapping` per tenere traccia dei contributi, una funzione `payable` per ricevere Ether, e una funzione di prelievo con verifica del saldo e azzeramento prima del trasferimento (per prevenire reentrancy attack).

---

## Il Formato Completo della Transazione

Ogni transazione Ethereum include i seguenti campi, serializzati con lo schema **RLP** (*Recursive Length Prefix*):

![Schema UML del formato completo di una transazione Ethereum](images/lezione-19-ethereum-accounts-transactions-gas-img-11.jpg)
*Fig. — Struttura completa di una transazione Ethereum: nonce, gasLimit, gasPrice, to, value, i tre componenti della firma ECDSA (v, r, s), e data.*

| Campo | Descrizione |
|-------|-------------|
| `nonce` | Numero progressivo di transazioni dell'EOA mittente |
| `gasLimit` | Quantità massima di gas che il mittente è disposto a consumare |
| `gasPrice` | Prezzo in wei per unità di gas (scelto dal mittente) |
| `to` | Indirizzo destinatario (20 byte); vuoto per creazione contratto |
| `value` | Importo in wei da trasferire |
| `v`, `r`, `s` | Componenti della firma ECDSA; permettono di ricavare l'indirizzo del mittente |
| `data` | Payload: bytecode (creazione) o function selector + argomenti (interazione) |

### Il campo `to`

Il campo `to` accetta qualsiasi valore di 20 byte senza validazione: se l'indirizzo è errato o inesistente, l'Ether inviato viene **bruciato** (*burnt*). Rispetto a Bitcoin, Ethereum semplifica radicalmente il formato: un solo indirizzo di output, valore inserito direttamente (nessun riferimento a transazione precedente), nessuno script nel campo destinatario.

### I campi `value` e `data`

I due campi del payload possono essere combinati in modi diversi:

| `value` | `data` | Significato |
|---------|--------|-------------|
| valorizzato | vuoto | Pagamento puro in Ether |
| vuoto | valorizzato | Invocazione di funzione |
| entrambi valorizzati | entrambi valorizzati | Invocazione con trasferimento Ether |

Quando `data` è inviato a un contract account, i primi **4 byte** costituiscono il **function selector** (i primi 4 byte dell'hash Keccak-256 del prototipo della funzione), che identifica univocamente il metodo da invocare. I byte successivi codificano gli argomenti secondo l'ABI Ethereum.

---

## Il Problema dell'Halting e il Gas

Il prezzo della Turing-completezza è l'**halting problem**: non è possibile determinare staticamente se un programma terminerà o girerà all'infinito. Per verificarlo bisogna eseguirlo — ma eseguire codice che non termina su una rete di nodi significa un **denial of service** distribuito. Bitcoin non ha questo problema (il suo linguaggio non è Turing-completo), Ethereum sì.

```javascript
function foo() {
    while (true) { /* Loop forever! */ }
}
```

### La soluzione: il Gas

> [!definition] Gas
>
> Un'unità di misura del costo computazionale associato all'esecuzione di ogni istruzione EVM. Ogni transazione include un budget di gas; l'EVM si ferma (e la transazione fallisce) non appena il gas si esaurisce.

Il gas serve a tre scopi:
1. **Rendere costosi gli attacchi DoS**: chi vuole eseguire codice malevolo deve pagare per ogni ciclo.
2. **Compensare i miner/validatori**: le fee di esecuzione ricompensano chi convalida le transazioni.
3. **Definire il limite computazionale**: l'EVM è una macchina *quasi*-Turing-completa — può eseguire qualsiasi programma purché disponga di gas sufficiente.

### Gas Price e Gas Limit

La **gas price** è il prezzo in Ether per unità di gas, espresso in **gwei** (1 gwei = 10⁹ wei). È il mittente a sceglierla: alta priorità richiede alta gas price, poiché i miner preferiscono le transazioni più remunerative. Il prezzo è variabile e dipende dalla congestione della rete.

Il **gas limit** è la quantità massima di gas che il mittente è disposto a consumare. La fee massima pagabile è:

$$
\text{fee} = \text{gasPrice} \times \text{gasLimit}
$$

Se al termine dell'esecuzione rimane del gas inutilizzato, viene **rimborsato** al mittente. Se il gas si esaurisce prima del completamento, tutte le modifiche di stato vengono **revertite** (ma il gas consumato non viene restituito).

### Ether e le sue denominazioni

![Tabella delle denominazioni dell'Ether: da wei a Megaether](images/lezione-19-ethereum-accounts-transactions-gas-img-12.jpg)
*Fig. — Le denominazioni dell'Ether, ciascuna intitolata a un pioniere dell'informatica: wei (unità base), Babbage (10³), Lovelace (10⁶), Shannon (10⁹), Szabo (10¹²), Finney (10¹⁵), Ether (10¹⁸), Grand (10²¹), Megaether (10²⁴).*

L'unità base è il **wei**: 1 ETH = 10¹⁸ wei. Tutte le operazioni interne di Ethereum lavorano in wei.

### Il meccanismo del Gas: riepilogo

![Diagramma riepilogativo del meccanismo del gas: flusso da TX submission a success/out-of-gas](images/lezione-19-ethereum-accounts-transactions-gas-img-13.jpg)
*Fig. — Riepilogo del meccanismo gas. Il mittente specifica gasLimit e gasPrice (es. 100.000 gas × 20 Gwei = 0.002 ETH upfront). L'EVM esegue consumando gas. Se successo: gas non usato rimborsato. Se out-of-gas: tutte le modifiche revertite, gas consumato NON rimborsato (deterrente contro spam). In basso: tabella dei costi gas per le istruzioni principali.*

### Costi delle operazioni EVM

Il costo in gas di ogni istruzione è fisso e definito nel Yellow Paper di Ethereum. Le operazioni di storage sono di gran lunga le più costose.

![Tabella dei costi gas delle operazioni EVM di base](images/lezione-19-ethereum-accounts-transactions-gas-img-14.jpg)
*Fig. — Costi gas per operazioni di base: ADD/SUB (3 gas), MUL/DIV (5 gas), ADDMOD/MULMOD (8 gas), operazioni bitwise/confronto (3 gas), operazioni stack POP (2), PUSH/DUP/SWAP (3), MLOAD/MSTORE (3).*

![Tabella dei costi gas per operazioni avanzate: JUMP, storage, CREATE, CALL](images/lezione-19-ethereum-accounts-transactions-gas-img-15.jpg)
*Fig. — Costi gas per operazioni avanzate: JUMP (8), JUMPI (10), SLOAD (200), SSTORE (20.000), BALANCE (400), CREATE (32.000), CALL (25.000). Lo storage è deliberatamente costoso per scoraggiare l'uso eccessivo della chain come database.*

### Gas nei messaggi interni

I messaggi interni (da contratto a contratto) **non hanno un proprio gas limit** separato: il gas limit dell'intera catena di esecuzione è quello specificato nella transazione originale dell'EOA, e deve essere sufficiente a coprire tutte le sub-esecuzioni. Se un messaggio interno esaurisce il gas, quella specifica sub-esecuzione viene revertita, ma la transazione padre può continuare se ha gestito il caso d'errore.

---

## Ethereum e Bitcoin: confronto finale

![Tabella comparativa tra Ethereum e Bitcoin: caratteristiche principali](images/lezione-19-ethereum-accounts-transactions-gas-img-16.jpg)
*Fig. — Confronto sistematico tra Ethereum (2015, Vitalik Buterin) e Bitcoin (2009, Satoshi Nakamoto): use case, modello blockchain, consenso, supply, velocità, sicurezza e community.*

| Feature | Ethereum | Bitcoin |
|---------|----------|---------|
| Inception | 2015 | 2009 |
| Fondatore | Vitalik Buterin | Satoshi Nakamoto |
| Use case principale | Smart Contracts, DApps, DeFi | Store of value, p2p transactions |
| Tecnologia | Account-based, EVM | UTXO-based |
| Consenso | PoS (da settembre 2022) | PoW |
| Supply massima | Nessun limite fisso | 21 milioni di BTC |
| Linguaggio contratti | Solidity (Turing-completo) | Script (non Turing-completo) |
| P2P layer | Kademlia | Protocollo proprietario |

> [!note] Kademlia in Ethereum
>
> Ethereum usa [[Kademlia]] come protocollo P2P per la peer discovery, a differenza di Bitcoin che ha sviluppato il proprio protocollo di gossip. Kademlia era già stato studiato nelle lezioni precedenti come DHT efficiente.

---

## Cosa resta da discutere

> [!abstract] Prossimi argomenti
>
> - **Programmazione degli smart contract**: Solidity (laboratorio)
> - **Struttura dei blocchi Ethereum**: log, Merkle Patricia Tries
> - **Proof of Stake**: meccanismo di consenso attuale
> - **Ethereum Virtual Machine (EVM)**: architettura e bytecode

