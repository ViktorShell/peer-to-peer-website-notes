> [!info] Prerequisiti
>
> Questo lab presuppone il modello account-based di Ethereum (EOA vs Contract, i quattro campi `nonce`/`balance`/`codeHash`/`storageRoot`, l'indirizzo come ultimi 160 bit di Keccak-256 della chiave pubblica). Per il dettaglio vedi **Lezione 19 — Ethereum: Account, Transazioni e Gas**.

---

## Lo stato di Ethereum

Lo stato globale di Ethereum è strutturato come una gerarchia di **Merkle Patricia Trie**. Ogni blocco contiene nel suo header tre radici di trie:

- **stateRoot** — la radice del World State Trie, che mappa ogni indirizzo ai quattro campi dell'account.
- **transactionsRoot** — la radice del Transactions Trie, dove la chiave è l'indice della transazione nel blocco (da 0).
- **receiptsRoot** — la radice del Receipts Trie, che contiene i risultati dell'esecuzione di ogni transazione.

![Struttura del World State Trie con Account State e Account Storage Trie collegati al Block Header](images/lezione-20-lab-solidity-img-02.jpg)
*Fig. — Il block header punta via hash a tre trie: World State, Receipts e Transactions. L'Account State contiene nonce, balance, storageRoot e codeHash; lo storageRoot punta a sua volta all'Account Storage Trie.*

La struttura si replica su blocchi successivi: ogni nuovo blocco N+1 condivide i nodi immutati con il blocco N (persistent data structure) e crea nuovi nodi solo per gli account modificati.

![Struttura completa di due blocchi consecutivi con State, Transaction e Receipt Trie condivisi](images/lezione-20-lab-solidity-img-03.jpg)
*Fig. — I blocchi N e N+1 mostrano come i Merkle Patricia Trie si propaghino tra blocchi: le foglie gialle rappresentano gli account modificati, i nodi condivisi rimangono inalterati.*

### Receipt e Bloom filter

Per ogni transazione viene generata una **receipt** contenente:

- `medstate` — root del state trie dopo l'elaborazione della transazione.
- `gas_used` — gas consumato cumulativo dopo la transazione.
- `logs` — lista di voci della forma `[address, [topic1, topic2...], data]`, generate dagli opcode `LOG0`…`LOG4` durante l'esecuzione (incluse le sub-call). L'indirizzo è quello del contratto che ha emesso il log, i topic sono fino a 4 valori da 32 byte.
- `logBloom` — **Bloom filter** costruito su indirizzi e topic di tutti i log della transazione.

L'OR bit a bit di tutti i `logBloom` delle receipt viene inserito nell'header del blocco. Questo permette a client leggeri di verificare rapidamente se un blocco contiene log rilevanti senza scaricare l'intero stato.

> [!definition] Bloom filter
>
> Struttura dati probabilistica che permette di verificare l'appartenenza di un elemento a un insieme in tempo costante. Può restituire falsi positivi ma mai falsi negativi. Nel contesto Ethereum, consente di filtrare efficientemente i blocchi rilevanti per una query su eventi.

### Log ed eventi in Solidity

I log risiedono **sopra** lo stato EVM interno e non sono visibili ai contratti durante l'esecuzione. Sono pensati per applicazioni esterne, che possono sottoscriversi a specifici tipi di log senza dover rieseguire tutte le transazioni o mantenere lo stato.

In Solidity i log si usano tramite gli **eventi**:

```solidity
event moneySent(address indexed _from, address _to, uint _amount);

function sendMoney(address _to, uint _amount) public returns (bool) {
    require(Balance[msg.sender] >= _amount, "Not enough value");
    moneyBalance[msg.sender] -= _amount;
    moneyBalance[_to] += _amount;
    emit moneySent(msg.sender, _to, _amount);
    return true;
}
```

Il parametro `indexed` su `_from` significa che il topic corrispondente viene incluso nel Bloom filter, rendendo le query per mittente molto efficienti.

> [!note] Smart contract e source code
>
> Nello stato EVM è conservato solo il **bytecode** compilato, non il sorgente Solidity. I sorgenti visibili su explorer come Etherscan sono caricati volontariamente dagli sviluppatori e verificati dall'explorer tramite compilazione.

---

## Gas

Il **gas** è il meccanismo che risolve due problemi fondamentali dell'EVM, resa Turing-completa dagli smart contract:

1. **Anti-DDoS**: senza un costo per l'esecuzione, un attaccante potrebbe inviare transazioni con loop infiniti bloccando la rete.
2. **Utilizzo equo delle risorse**: ogni operazione ha un costo in gas proporzionale al lavoro computazionale richiesto.

Il gas viene pagato per l'**esecuzione** (opcode EVM) e per lo **storage** (scrittura nello stato). Aspetto importante: il gas viene pagato anche per transazioni che falliscono o che esauriscono il gas — il lavoro già fatto deve essere compensato.

> [!warning] gaslimit a livello di transazione
>
> Il mittente specifica un `gaslimit` nella transazione: se il contratto consuma più gas del limite, l'esecuzione si interrompe con un **revert** (lo stato viene ripristinato) ma il gas già consumato viene comunque pagato. Questo protegge da comportamenti inattesi, incluse sub-call a contratti esterni.

Il `gaslimit` a livello di blocco (analogo alla block size di Bitcoin) limita il tempo di validazione di un blocco e quindi la quantità di computazione per blocco.

I costi in gas per operazione sono **hardcodati** nell'Appendice G del Yellow Paper di Ethereum. Esiste inoltre un insieme speciale di indirizzi (da `0x01` a `0x0a`) che contengono **precompiled contracts**: contratti il cui comportamento non è definito da bytecode EVM ma è implementato direttamente nell'esecuzione environment (Appendice E del Yellow Paper). Si chiamano come contratti normali ma il loro gas consumption è anch'esso predefinito.

---

## Solidity

**Solidity** è il linguaggio di programmazione ad alto livello per smart contract su Ethereum. Si compila in bytecode EVM.

Caratteristiche principali:
- **Staticamente tipato**: i tipi vengono verificati a tempo di compilazione.
- **Object Oriented**: un contratto si modella come un'istanza di classe, con stato (variabili di stato) e metodi (funzioni).
- **In continuo sviluppo**: la documentazione ufficiale è su `https://docs.soliditylang.org/en/latest/`.

### Remix IDE

Lo strumento standard per sviluppare e testare contratti Solidity è **Remix IDE**, accessibile via browser.

![Screenshot di Remix IDE con il contratto Counter deployato e i log delle transazioni](images/lezione-20-lab-solidity-img-04.jpg)
*Fig. — Remix IDE: pannello di deploy a sinistra, editor con Counter.sol al centro, log delle transazioni in basso. Si vedono le chiamate a `inc`, `dec`, `get` con i rispettivi hash e gas usato.*

### Primo contratto: Counter

Il contratto `Counter` è l'esempio introduttivo classico. Il workflow su Remix:

1. Creare un nuovo file `Counter.sol`
2. Copiare il codice
3. Compilare
4. Deploy su VM (ambiente locale simulato)
5. Chiamare i metodi
6. Ispezionare le receipt delle transazioni

![Codice del contratto Counter.sol in Solidity](images/lezione-20-lab-solidity-img-05.jpg)
*Fig. — Il contratto Counter: variabile di stato `uint256 public count`, funzioni `get()` (view), `inc()` e `dec()` (public). La funzione `dec()` fallisce se `count = 0` per underflow aritmetico.*

### Pragma e versioning

La direttiva `pragma` specifica la versione del compilatore Solidity richiesta. La semantica del versioning segue regole precise:

| Direttiva | Significato |
|---|---|
| `pragma solidity 0.4.16` | Esattamente la versione 0.4.16 |
| `pragma solidity >=0.4.16 <0.7.1` | Dalla 0.4.16 (inclusa) alla 0.7.1 (esclusa) |
| `pragma solidity ^0.4.16` | Dalla 0.4.16 alla 0.5.0 (esclusa) |

La versione `x.y.*` introduce breaking change rispetto a `x-1.*.*` o `x.y-1.*`.

### Import

Solidity supporta diversi meccanismi di import per la modularizzazione del codice:

```solidity
import "lib/util.sol";                        // import diretto
import "../token.sol";                         // import relativo
import * as tokenLibrary from "lib/token.sol"; // rinomina namespace
// uso: tokenLibrary.varName1
```

### Costrutti principali

Un contratto Solidity è composto da quattro categorie di costrutti:

- **State Variables** — variabili persistenti nello storage del contratto.
- **Functions** — le operazioni che il contratto espone o usa internamente.
- **Errors e Modifiers** — meccanismi di validazione e pattern guard.
- **Events** — log emessi durante l'esecuzione, visibili alle applicazioni esterne.

### Visibility Modifiers

La visibilità controlla chi può accedere a variabili e funzioni.

**Variabili di stato:**

| Modificatore | Comportamento |
|---|---|
| `public` | Visibile internamente + getter automatico con visibilità esterna (`view`) |
| `internal` | *Default.* Visibile nel contratto e nei contratti derivati |
| `private` | Solo nel contratto corrente, non nei derivati |

**Funzioni:**

| Modificatore | Comportamento |
|---|---|
| `external` | Chiamabile solo da transazioni/messaggi esterni (internamente via `this.fun()`) |
| `public` | Chiamabile sia da esterno che internamente |
| `internal` | Solo dal contratto corrente o derivati — non fa parte dell'ABI |
| `private` | Solo dal contratto corrente — non fa parte dell'ABI |

> [!warning] `private` non significa segreto
>
> Una variabile `private` non è accessibile via chiamate Solidity, ma il suo valore è comunque leggibile direttamente dallo storage on-chain da chiunque. In Ethereum non esiste vera riservatezza dei dati in-chain.

> [!tip] ABI e visibilità esterna
>
> L'**ABI** (*Application Binary Interface*) è l'interfaccia pubblica del contratto: descrive le funzioni e gli eventi visibili dall'esterno. Solo le funzioni `external` e `public` fanno parte dell'ABI e possono essere chiamate da transazioni o da altri contratti tramite call standard.

