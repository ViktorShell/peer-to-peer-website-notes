---
tags:
  - università/peer-to-peer-systems-and-blockchain
  - ethereum
  - solidity
  - smart-contracts
  - laboratorio
data: 2026-04-14
lezione: "Lab 7 - Solidity (avanzato)"
professore: "Damiano Di Francesco Maesa"
---

# Lab 7 — Solidity (avanzato)

Questa lezione prosegue l'introduzione a Solidity approfondendo il sistema dei tipi, le funzioni, la gestione degli errori, i modifier e gli eventi. Si tratta del cuore del linguaggio: capire come Solidity gestisce i tipi, la mutabilità dello stato e il controllo degli accessi è fondamentale per scrivere contratti corretti e sicuri.

---

## Solidity: ripasso rapido

Solidity è un linguaggio **staticamente tipato**, **object-oriented**, compilato in bytecode EVM. Un contratto è modellato come una classe con stato (variabili di storage persistenti) e metodi (funzioni). La documentazione ufficiale è su `https://docs.soliditylang.org/en/latest/`.

Il primo contratto di riferimento è `Counter.sol`, da deployare su Remix IDE:

![Screenshot di Remix IDE con Counter.sol deployato e log delle transazioni](images/lezione-21-lab-solidity-avanzato-img-01.jpg)
*Fig. — Remix IDE: a sinistra il pannello di deploy, al centro l'editor con Counter.sol, in basso i log delle transazioni con hash, gas usato e valori restituiti.*

![Codice sorgente del contratto Counter.sol](images/lezione-21-lab-solidity-avanzato-img-02.jpg)
*Fig. — Counter.sol: variabile di stato `uint256 public count`, funzione `get()` con modificatore `view`, `inc()` e `dec()` pubbliche. La `dec()` fallisce per underflow se `count == 0`.*

---

## Il sistema dei tipi

Solidity distingue due grandi famiglie di tipi: **value types** e **reference types**. La dichiarazione segue la sintassi `tipo [modificatore] nome;`.

I **value types** non specificano un'area di memoria (il compilatore li colloca nello stack se efimeri, nello storage se variabili di stato). Possono avere qualificatori:
- `transient` — come lo storage ma valido solo per la durata di una singola transazione.
- `constant` — valore sostituito a tempo di compilazione.
- `immutable` — valore fissato a tempo di costruzione del contratto.

I **reference types** devono specificare esplicitamente l'area di memoria: `memory` (temporanea, per la durata della chiamata), `storage` (persistente, nel trie dell'account), o `calldata` (read-only, per i parametri di funzioni `external`).

### Value Types

**Booleano e interi:**

```solidity
bool flag;                  // true / false
int8 .. int256              // interi con segno (int == int256)
uint8 .. uint256            // interi senza segno (uint == uint256)
```

Le divisioni intere arrotondano sempre verso zero (troncamento). I numeri in virgola mobile esistono (`fixed`/`ufixed`) ma sono molto limitati nella versione attuale.

**Byte e stringhe:**

```solidity
bytes1, bytes2, ..., bytes32    // array di byte a dimensione fissa
string                          // sequenza di caratteri UTF-8
```

**Enum:** tipo enumerato con al massimo 256 membri. Internamente rappresentato come `uint8`. Quando esposto all'ABI esterna, la firma viene tradotta automaticamente in `uint8`.

```solidity
contract test {
    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
    ActionChoices choice;
    ActionChoices constant defaultChoice = ActionChoices.GoStraight;

    function setGoStraight() public {
        choice = ActionChoices.GoStraight;
    }
    // Per l'ABI esterna getChoice() diventa "getChoice() returns (uint8)"
    function getChoice() public view returns (ActionChoices) {
        return choice;
    }
}
```

### Il tipo `address`

Il tipo `address` è fondamentale in Solidity: rappresenta un indirizzo Ethereum a 20 byte. Esistono due varianti:

- `address` — solo lettura.
- `address payable` — può ricevere Ether (convertibile da `address` con `payable(...)`).

Gli indirizzi hex che superano il checksum EIP-55 sono letterali di tipo `address` (es. `0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF`). L'indirizzo zero è `address(0)`.

**Membri dell'address:**

| Membro | Tipo | Descrizione |
|---|---|---|
| `.balance` | `uint256` | Saldo in wei dell'indirizzo |
| `.code` | `bytes memory` | Bytecode all'indirizzo (vuoto per EOA) |
| `.codehash` | `bytes32` | Hash del bytecode |
| `.transfer(amount)` | — | Invia `amount` wei, **revert** on failure, 2300 gas stipend |
| `.send(amount)` | `bool` | Invia `amount` wei, **false** on failure, 2300 gas stipend |
| `.call(payload)` | `(bool, bytes)` | Low-level CALL, tutto il gas disponibile, ritorna bool + data |

> [!warning] `transfer` e `send` sono deprecati
>
> Il limite fisso di 2300 gas era pensato come protezione, ma è una scelta di design fragile: i costi del gas cambiano con gli hard fork e contratti che oggi funzionano potrebbero rompersi in futuro. La pratica corretta è usare `.call{value: amount}("")` con controllo esplicito del valore di ritorno.

**Uso di `call` con selettore di funzione:**

```solidity
(bool success, bytes memory returnData) = address(nameReg).call{
    gas: 1000000,
    value: 1 ether
}(abi.encodeWithSignature("register(string)", "MyName"));
require(success);
```

I primi 4 byte dell'encoding della firma (`abi.encodeWithSignature`) formano il **function selector**: Keccak-256 della firma troncato a 4 byte.

> [!note] `delegatecall` e `staticcall`
>
> - **`delegatecall`**: esegue il codice del contratto chiamato nel contesto del chiamante (stesso storage, stesso `msg.sender`, stesso `msg.value`). Usato nei proxy pattern.
> - **`staticcall`**: come `call` ma esegue un revert se la chiamata modifica lo stato. Corrisponde alle funzioni `view`/`pure`.

**Creazione di contratti e interazione via address type:**

```solidity
contract Created {
    uint public x;
    constructor(uint a) payable { x = a; }
    function increment() public { x += 1; }
    function get() public view returns (uint) { return x; }
}

contract Creator {
    Created innerContract;

    function createCreated(uint arg) public {
        Created newCreated = new Created(arg);   // deploy di un nuovo contratto
        innerContract = newCreated;
    }
    function overrideCreated(address arg) public {
        innerContract = Created(arg);            // cast da address a tipo contratto
    }
    function createAndEndowCreated(uint arg, uint amount) public payable {
        Created newCreated = new Created{value: amount}(arg); // deploy con ETH
        newCreated.x();
    }
}
```

> [!tip] I contratti possono deployare altri contratti
>
> Un account Contract non può *iniziare* transazioni (non ha chiave privata), ma può deployare nuovi contratti tramite `new`. L'indirizzo del contratto creato è il Keccak-256 di `(creator_address, nonce)`.

### La keyword `payable`

Una funzione contrassegnata `payable` può ricevere Ether. Quando un contratto riceve Ether senza specificare una funzione, il runtime EVM cerca nell'ordine:

1. la funzione **`receive()`** (se esiste ed è `payable`),
2. la funzione **`fallback()`** `payable` (se esiste).

```solidity
receive() external payable { ... }   // chiamata senza dati o via transfer/send
fallback() external payable { ... }  // funzione inesistente, o receive assente
```

Entrambe sono funzioni speciali: senza nome (al più una per contratto), senza parametri, senza return. `fallback` viene chiamata anche quando si chiama una funzione inesistente nel contratto.

### Reference Types

**Array:**

```solidity
uint[] storage arr;          // dinamico
uint[10] storage arr;        // statico (dimensione fissa)
// metodi: .length, .push(), .push(elem), .pop()
```

**Struct:**

```solidity
struct Campaign {
    address payable beneficiary;
    uint goal;
    uint amount;
}
```

**Mapping:**

```solidity
mapping(KeyType => ValueType) varName;
```

I mapping funzionano come hash table con tutti i valori inizializzati al default del tipo. La chiave può essere qualsiasi tipo value built-in, `bytes`, `string`, o tipo contratto/enum. Il valore può essere qualsiasi tipo, inclusi mapping annidati.

> [!warning] Limitazioni dei mapping
>
> - I dati della chiave non vengono salvati nello storage: non è possibile enumerare le chiavi.
> - Non hanno `.length`.
> - Possono risiedere solo in `storage` (non in `memory`).
> - **Non sono iterabili**: per iterare occorre mantenere una lista separata delle chiavi.

---

## Unità predefinite

Solidity supporta suffissi per valori monetari e temporali, convertiti a interi a compile time:

```solidity
// Ether
assert(1 wei   == 1);
assert(1 gwei  == 1e9);
assert(1 ether == 1e18);

// Tempo
1 == 1 seconds
1 minutes == 60 seconds
1 hours   == 60 minutes
1 days    == 24 hours
1 weeks   == 7 days
```

---

## Variabili globali

Solidity mette a disposizione variabili e funzioni globali per accedere al contesto di esecuzione:

**Blocco:**

| Variabile | Tipo | Descrizione |
|---|---|---|
| `blockhash(n)` | `bytes32` | Hash del blocco `n` (solo ultimi 256 blocchi) |
| `block.basefee` | `uint` | Base fee del blocco corrente (EIP-1559) |
| `block.chainid` | `uint` | Chain ID corrente |
| `block.coinbase` | `address payable` | Indirizzo del miner/validator del blocco |
| `block.gaslimit` | `uint` | Gas limit del blocco corrente |
| `block.number` | `uint` | Numero del blocco corrente |
| `block.timestamp` | `uint` | Timestamp Unix del blocco corrente (secondi) |
| `gasleft()` | `uint256` | Gas rimanente |

**Messaggio e transazione:**

| Variabile | Tipo | Descrizione |
|---|---|---|
| `msg.data` | `bytes calldata` | Calldata completa |
| `msg.sender` | `address` | Mittente del messaggio (della call corrente — cambia nelle sub-call!) |
| `msg.sig` | `bytes4` | Primi 4 byte della calldata (function selector) |
| `msg.value` | `uint` | Wei inviati con il messaggio |
| `tx.gasprice` | `uint` | Gas price della transazione |
| `tx.origin` | `address` | Mittente originale dell'intera catena di chiamate |

> [!warning] `msg.sender` vs `tx.origin`
>
> `msg.sender` è il mittente della chiamata *corrente* e cambia ad ogni sub-call. `tx.origin` è sempre l'EOA che ha firmato la transazione originale. Non usare `tx.origin` per autenticazione: è vulnerabile ad attacchi di phishing tramite contratti intermedi.

---

## Funzioni

### Constructor

Il `constructor` viene invocato **una sola volta**, durante la creazione del contratto, e non fa parte dell'ABI esterna:

```solidity
constructor() public {
    creator = msg.sender;
}
```

### Valori di ritorno multipli

Solidity supporta return multipli sia con assegnazione esplicita che con `return` inline:

```solidity
// Stile 1: assegnazione nelle named return variables (return implicito)
function arithmetic(uint a, uint b) public pure
    returns (uint sum, uint product)
{
    sum = a + b;
    product = a * b;
}

// Stile 2: return esplicito
function arithmetic(uint a, uint b) public pure
    returns (uint sum, uint product)
{
    return (a + b, a * b);
}
```

Le variabili di ritorno nominate sono inizializzate al valore di default del tipo. Non è possibile restituire mapping (o tipi compositi che li contengono).

### State Mutability

Il modificatore di mutabilità indica cosa può fare la funzione rispetto allo stato della blockchain:

| Modificatore | Può leggere lo stato? | Può modificarlo? |
|---|---|---|
| *(nessuno)* | sì | sì |
| `payable` | sì | sì (+ riceve Ether) |
| `view` | sì | **no** |
| `pure` | **no** | **no** |

**`view`** — vieta di modificare lo stato. Sono considerate modifiche: scrittura a variabili di storage, emissione di eventi, creazione di contratti, `selfdestruct`, invio di Ether, chiamata a funzioni non `view`/`pure`.

**`pure`** — vieta sia lettura che scrittura dello stato. Non può accedere a `block`, `tx`, `msg` (eccetto `msg.sig` e `msg.data`), né a `.balance`. Una funzione `pure` deve essere valutabile a compile-time dati solo i suoi input e `msg.data`.

---

## Errori

Solidity offre tre primitive per segnalare condizioni di errore:

```solidity
assert(bool condition)
// revert con Panic(uint256) se falso — per invarianti che non devono mai fallire

require(bool condition, string memory message)
// revert con Error(string) se falso — per validazione di input o precondizioni

revert(string memory reason)
// revert incondizionato con messaggio personalizzato
```

> [!definition] `Panic` vs `Error`
>
> `Panic` è riservato a errori che **non dovrebbero esistere in codice corretto** (overflow, accesso out-of-bounds, divisione per zero). `Error` è per violazioni di precondizioni o input non validi — condizioni che l'utente può legittimamente causare.

Il **try-catch** è disponibile solo per chiamate esterne — non per chiamate interne. Vedi `FeedConsumer.sol` come esempio.

---

## Function Modifiers

I **modifier** sono guard che si applicano a una funzione prima (e/o dopo) della sua esecuzione. Il simbolo `_` segnaposto indica dove viene inserito il corpo della funzione:

```solidity
contract owned {
    constructor() { owner = payable(msg.sender); }
    address payable owner;

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;   // <-- qui viene eseguito il corpo della funzione decorata
    }
}

contract myContract is owned {
    function doSomethingRestricted(uint n) public onlyOwner {
        // eseguito solo se msg.sender == owner
    }
}
```

Regole importanti dei modifier:

- Più modifier su una funzione vengono applicati **nell'ordine in cui sono elencati**.
- Non hanno accesso implicito agli argomenti o ai valori di ritorno della funzione decorata — devono essere passati esplicitamente.
- Il simbolo `_` può apparire più volte: ogni occorrenza sostituisce l'intero corpo della funzione.
- Un `return` esplicito in un modifier o nella funzione esce solo dal contesto corrente; il flusso riprende dall'`_` nel modifier precedente.
- I simboli introdotti nel modifier non sono visibili nella funzione e viceversa (eccetto quelli già nel contratto).

---

## Events

Gli eventi sono **log parametrizzati** emessi durante l'esecuzione, scritti nella receipt della transazione e ricercabili off-chain tramite topic, indirizzo del contratto e firma dell'evento. Non sono accessibili on-chain da altri contratti.

```solidity
pragma solidity >=0.4.21 <0.9.0;

contract ClientReceipt {
    event Deposit(
        address indexed from,   // topic 1 (nel Bloom filter)
        bytes32 indexed id,     // topic 2 (nel Bloom filter)
        uint value              // in data (non indicizzato)
    );

    function deposit(bytes32 id) public payable {
        emit Deposit(msg.sender, id, msg.value);
    }
}
```

Un evento può avere fino a **tre parametri `indexed`** (inclusi come topic nel Bloom filter per ricerche efficienti). I parametri non indicizzati vanno nel campo `data` della receipt in formato ABI-encoded.

---

## Selfdestruct

```solidity
selfdestruct(address payable recipient)
```

Nell'EVM pre-Cancun (≤ Shanghai): distrugge il contratto e invia tutti i fondi al `recipient`. Il contratto viene effettivamente rimosso dallo stato **alla fine della transazione** — eventuali revert possono annullare la distruzione. Fino alla fine, tutte le funzioni del contratto rimangono chiamabili.

> [!warning] `selfdestruct` post-Cancun
>
> Dall'hard fork **Cancun** in poi, `selfdestruct` invia i fondi al recipient ma **non distrugge il contratto**. L'unica eccezione è se `selfdestruct` viene chiamato nella stessa transazione che ha creato il contratto (comportamento pre-Cancun preservato).
>
> Per "disattivare" un contratto in modo portabile, è preferibile usare una variabile di stato booleana e far sì che tutte le funzioni facciano revert se il contratto è disattivato. In questo modo il contratto rimanda indietro l'Ether immediatamente.

---

## Proxy Contracts

Un problema fondamentale dei contratti Ethereum è l'**immutabilità**: una volta deployato, il bytecode non può essere modificato. Questo impedisce di correggere bug o aggiornare la logica.

Il pattern **proxy** risolve il problema separando:
- un contratto **proxy** (che non cambia mai) che detiene lo storage e delega le chiamate tramite `delegatecall`,
- uno o più contratti di **implementazione** (la logica) che possono essere aggiornati sostituendo il puntatore nel proxy.

Poiché `delegatecall` esegue il codice dell'implementazione nel contesto dello storage del proxy, lo storage e il mittente rimangono invariati dal punto di vista dell'implementazione.

Un'implementazione di riferimento: `OpenZeppelin/openzeppelin-contracts/blob/v4.8.2/contracts/proxy/Proxy.sol`.

> [!note] `virtual`, `override`, `abstract`
>
> - **`virtual`**: indica che un metodo (o parametro) può essere sovrascritto da contratti derivati.
> - **`override`**: segnala esplicitamente che un metodo sovrascrive quello del contratto padre.
> - **`abstract`**: analogo al concetto Java — contratto con funzioni non implementate che i derivati devono completare.

---

## Risorse

- `https://solidity-by-example.org/` — esempi pratici per tutti i costrutti Solidity
- `https://cryptozombies.io/course/` — corso interattivo gamificato

