# Fungible e Non Fungible Tokens: Standard ERC

La tokenizzazione rappresenta una delle applicazioni più trasformative della blockchain. Insieme a criptovalute, DeFi (*Decentralized Finance*), supply chain e identità digitale, i token costituiscono le cosiddette **killer application** delle blockchain. Questa lezione analizza la distinzione fondamentale tra token fungibili e non fungibili, i meccanismi contrattuali che li implementano su Ethereum, e gli standard ERC che ne garantiscono l'interoperabilità.

---

## Coins e Token: una distinzione fondamentale

Prima di entrare nel merito degli standard, è necessario chiarire la differenza tra due termini spesso usati come sinonimi ma che indicano concetti distinti.

Un **digital coin** (*moneta digitale*) è un asset nativo della propria blockchain: bitcoin su Bitcoin, ether su Ethereum, ADA su Cardano, BNB su Binance, SOL su Solana. I coin svolgono le tre funzioni della moneta: mezzo di scambio, riserva di valore e unità di conto. Vengono inoltre utilizzati per ricompensare i nodi che garantiscono il funzionamento della rete.

Un **digital token** (*token digitale*), al contrario, è un asset non nativo creato sopra una blockchain esistente tramite smart contract. Questa dipendenza da un contratto spiega perché la stragrande maggioranza dei token sia implementata su Ethereum, che offre il runtime necessario. I token ereditano le proprietà di sicurezza e tracciabilità della blockchain sottostante, e la loro ragione d'esistenza è quasi sempre legata a un'applicazione decentralizzata specifica — una Dapp — all'interno del cui ecosistema assumono significato e valore.

Storicamente, i token hanno preceduto la blockchain: erano oggetti pseudo-monetari privi di framework legale, emessi da entità private per usi specifici. I gettoni dei casinò o le monete create dalle mining companies per i propri negozi aziendali (*company store*) ne sono esempi emblematici: avevano valore all'interno della comunità che ne accettava l'uso, ma nessuno al di fuori.

---

## Token Fungibili

> [!definition] Fungibilità
>
> Un asset è **fungibile** quando le sue unità sono identiche in natura e funzione: non esiste alcuna caratteristica distintiva tra un'unità e l'altra dello stesso tipo.

Le proprietà fondamentali dei token fungibili sono tre. L'**interscambiabilità** implica che ogni token sia sostituibile con qualsiasi altro token della stessa specie: il tuo biglietto da 20€ e il mio hanno lo stesso valore, così come un lingotto d'oro da 1 kg equivale a qualsiasi altro da 1 kg. Per le criptovalute questa proprietà è generalmente vera, ma con una sfumatura importante: ogni bitcoin ha la propria storia di transazioni on-chain, il che apre interrogativi sulla sua fungibilità assoluta. La **fusione** (*merging*) consente di sommare unità per ottenere valori aggregati. La **divisibilità** permette di trasferire frazioni di token, proprietà essenziale per le criptovalute dove si opera spesso con millesimi o microfraction.

### Applicazioni dei token fungibili

I token fungibili trovano impiego in scenari economici diversi. Nelle **ICO** (*Initial Coin Offering*), le aziende emettono token per raccogliere fondi dagli investitori, garantendo che la standardizzazione li renda negoziabili. Nella **DeFi**, i token fungibili fungono da collaterale su piattaforme di lending e borrowing, da strumento di voto e governance nelle **DAO** (*Decentralized Autonomous Organization*), e da mezzo di scambio generico. Nell'industria **gaming**, sono usati come valuta in-game e per rappresentare attributi dei personaggi, permettendo economie interne alle piattaforme. Sulle piattaforme social, modellano sistemi di reputazione e incentivi.

---

## Token Non Fungibili (NFT)

> [!definition] Non Fungibilità
>
> Un **NFT** (*Non-Fungible Token*) è un asset unico: contiene informazioni o attributi che lo rendono impossibile da sostituire con un altro token della stessa categoria. Ogni NFT rappresenta un'entità intera, non frazionabile.

La distinzione visiva tra fungibile e non fungibile è immediata: due palline da baseball identiche prodotte in serie sono fungibili; una pallina firmata da Babe Ruth è non fungibile, perché quella firma la rende unica e irreplicabile. Analogamente, la Gioconda è non fungibile (un originale), mentre una maglietta con la stampa della Gioconda è fungibile (producibile in mille copie).

![Diagramma Mermaid](images/mermaid-lezione-22-fungible-e-non-fungible-tokens-erc-standards-01.png)
*Fig. — Tassonomia degli asset secondo fungibilità e tangibilità: i token intangibili fungibili includono criptovalute e carbon credit, quelli non fungibili includono arte digitale e copyright.*

Un NFT può rappresentare oggetti digitali unici come opere d'arte, oggetti in-game, domini .eth; asset fisici come immobili o opere d'arte reali (la tokenizzazione rende il trasferimento di proprietà più efficiente riducendo il rischio di frodi); oppure certificati di proprietà e identità. Il fenomeno dei **Beanie Babies** negli anni '90 anticipa molte dinamiche degli NFT: produzione limitata, ritiro deliberato di edizioni per creare scarsità, difetti intenzionali che generano edizioni ultra-rare. La psicologia del collezionismo è la stessa.

---

## Cryptographic Tokens e Standard ERC

I token crittografici implementati come smart contract ereditano le proprietà di tracciabilità, sicurezza e impossibilità di falsificazione della blockchain. Il settore è in piena espansione: i **colored coins** furono i primi cryptotoken sviluppati su Bitcoin; Ethereum rimane la piattaforma dominante per via degli smart contract, ma esistono ora piattaforme alternative specializzate.

### Perché uno standard?

> [!tip] Il valore di uno standard
>
> Uno standard ERC garantisce ai developer che gli asset si comporteranno in modo prevedibile, e alle aziende che i propri token saranno compatibili con l'infrastruttura Ethereum esistente: wallet, exchange, marketplace.

**ERC** (*Ethereum Request for Comment*, o *Ethereum Request for Improvements*) è il formato con cui si propongono e approvano le specifiche degli smart contract. Uno standard ERC per i token definisce l'interfaccia che un contratto deve implementare: come vengono creati, trasferiti, mutati e distrutti i token. I tre standard principali sono:

| Standard | Tipo | Caso d'uso principale |
|---|---|---|
| **ERC-20** | Token fungibili | Criptovalute, governance, DeFi |
| **ERC-721** | Token non fungibili (NFT) | Arte digitale, oggetti da collezione, immobili |
| **ERC-1155** | Multi-token (FT + NFT) | Gaming, piattaforme con asset eterogenei |

---

## ERC-20: Standard per Token Fungibili

Lo standard ERC-20 fu proposto dal co-fondatore di Ethereum Vitalik Buterin nel novembre 2015. Definisce un insieme comune di funzioni che ogni token fungibile su Ethereum deve implementare, così da garantire l'interoperabilità con wallet, contratti e marketplace.

### Struttura interna: il balance map

Il contratto ERC-20 mantiene internamente una struttura dati fondamentale: un mapping da indirizzi a saldi.

```
balanceOf: address → uint256
```

Il saldo di un indirizzo non è un numero astratto: dipende dal contratto specifico e può rappresentare unità fisiche, diritti, valori monetari o qualsiasi altra quantità che il contratto decida di modellare.

### Funzioni obbligatorie

Le sei funzioni obbligatorie dello standard sono:

| Funzione | Descrizione |
|---|---|
| `totalSupply()` | Restituisce il totale di token attualmente esistenti nel contratto. Può essere fisso o variabile. |
| `balanceOf(address)` | Restituisce il saldo di token di un indirizzo specifico. |
| `transfer(address _to, uint256 _value)` | Trasferisce token dall'indirizzo del chiamante a `_to`. |
| `approve(address _spender, uint256 _value)` | Autorizza `_spender` a spendere al massimo `_value` token per conto del chiamante. |
| `allowance(address _owner, address _spender)` | Restituisce la quota corrente approvata da `_owner` per `_spender`. |
| `transferFrom(address _from, address _to, uint256 _value)` | Trasferisce token da `_from` a `_to` per conto di un delegato autorizzato. |

Oltre alle funzioni, lo standard definisce due **eventi** che devono essere emessi:
- `Transfer(address _from, address _to, uint256 _value)` — emesso a ogni trasferimento
- `Approval(address _owner, address _spender, uint256 _value)` — emesso a ogni approvazione

### Campi opzionali

I tre campi opzionali migliorano l'usabilità del token:

- `name()`: nome human-readable, ad es. `"US Dollars"`
- `symbol()`: simbolo leggibile, ad es. `"USD"`
- `decimals()`: numero di cifre decimali per la rappresentazione visiva. Solidity non supporta i numeri decimali — lavora solo con interi — per cui si rappresenta un valore con moltiplicatori. Con `decimals = 18`, il valore `1000000000000000000` corrisponde a `1.0` token a schermo.

### Meccanismo di trasferimento diretto

La funzione `transfer` implementa una transazione diretta in un solo passo: il proprietario del wallet invia token a un altro indirizzo, esattamente come una transazione cryptocurrency convenzionale.

> [!example] Transfer: Alice invia 10 token a Bob
>
> 1. Il wallet di Alice invia una transazione al contratto token, chiamando `transfer(BobAddress, 10)`
> 2. Il contratto aggiorna: `balanceOf[Alice] -= 10` e `balanceOf[Bob] += 10`
> 3. Viene emesso l'evento `Transfer(Alice, Bob, 10)` on-chain, utile per il logging

### Meccanismo di delega (Allowance)

Il meccanismo di **allowance** risolve un problema pratico: in molti scenari (pagamenti ricorrenti, marketplace, DeFi) è necessario che una terza parte esegua transazioni per conto del proprietario, senza che il proprietario debba approvare ogni singola operazione.

![Diagramma Mermaid](images/mermaid-lezione-22-fungible-e-non-fungible-tokens-erc-standards-02.png)
*Fig. — Flusso del meccanismo allowance: il proprietario approva una quota, il delegato la utilizza con transferFrom.*

Il mapping interno che traccia le allowance è una struttura a due livelli:

```solidity
mapping(address => mapping(address => uint256)) public allowance;
```

La prima chiave è il proprietario, la seconda è lo spender autorizzato, il valore è la quota massima. In altri termini: `allowance[owner][spender]` = quanto lo spender può ancora spendere dal conto di owner.

> [!example] Esempio completo di allowance
>
> Alice ha 1000 token e vuole delegare Bob a spenderne al massimo 100.
> 1. Alice chiama `approve(Bob, 100)`
> 2. Bob verifica la quota con `allowance(Alice, Bob)` → restituisce 100
> 3. Bob preleva 50 token: `transferFrom(Alice, Bob, 50)` → la allowance scende a 50
> 4. Bob può continuare a prelevare fino a esaurire la quota di 100 token totali

### L'interfaccia IERC20 e l'implementazione

L'interfaccia IERC20 formalizza in Solidity il contratto che ogni implementazione ERC-20 deve rispettare:

```solidity
// Funzioni opzionali
function name()     public view returns (string)  // optional
function symbol()   public view returns (string)  // optional
function decimals() public view returns (uint8)   // optional

// Funzioni obbligatorie
function totalSupply() public view returns (uint256)
function balanceOf(address _owner) public view returns (uint256 balance)
function transfer(address _to, uint256 _value) public returns (bool success)
function approve(address _spender, uint256 _value) public returns (bool success)
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)

// Eventi
event Transfer(address indexed _from, address indexed _to, uint256 _value)
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

Un'implementazione minimale del contratto ERC-20 è:

```solidity
pragma solidity ^0.8.7;
contract MyToken {
    string public name = "My Token";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint public totalSupply = 100_000 * 10**decimals;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function transfer(address _to, uint256 _value) public returns (bool success) {
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)
            public returns (bool success) {
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        allowance[_from][msg.sender] -= _value;
        return true;
    }
}
```

> [!warning] Bug nella slide originale
>
> Il codice presentato a lezione per `transferFrom` contiene un errore: `balanceOf[_from] += _value` invece di `-= _value`. La versione corretta sottrae il valore dal saldo del mittente e lo aggiunge al destinatario.

---

## Implementare i Token in Solidity

### Contratti come classi, istanze e deployment

In Solidity, un contratto è concettualmente equivalente a una classe in un linguaggio orientato agli oggetti. Il codice del contratto definisce la struttura; l'**istanza** viene creata quando il contratto viene deployato sulla blockchain tramite una transazione, a un determinato indirizzo. Il creator può essere sia un external account che un altro contratto (come mostrato nel pattern *Fabric* che istanzia token dinamicamente).

Una volta che un contratto crea un'istanza di un altro contratto tramite `new`, l'istanza risultante può essere usata per invocare le funzioni pubbliche dell'altro contratto:

```solidity
Token token = new Token(_name);   // deployment + riferimento
token.name();                     // invocazione funzione pubblica
```

### Ereditarietà

Solidity supporta l'ereditarietà in stile OOP. Un contratto figlio eredita tutte le variabili di stato e le funzioni non dichiarate `private` dal contratto padre. Le variabili e funzioni `internal` sono accessibili nel contratto e nei derivati; quelle `private` restano confinate al contratto in cui sono dichiarate, rafforzando l'incapsulamento.

Le funzioni dichiarate `virtual` nel padre possono essere sovrascritte nel figlio con `override`:

```solidity
contract Foo {
    function calculate(uint x, uint y) public virtual pure returns (uint) {
        return x + y;
    }
}
contract Bar is Foo {
    function calculate(uint x, uint y) public override pure returns (uint) {
        return x - y;
    }
}
```

### Interfacce

Le **interfacce** in Solidity sono blueprints puri: dichiarano le firme delle funzioni senza implementarle e senza variabili di stato. Sono lo strumento naturale per descrivere standard come ERC-20 ed ERC-721, e possono ereditare da altre interfacce.

### OpenZeppelin: non reinventare la ruota

> [!tip] OpenZeppelin
>
> OpenZeppelin (https://openzeppelin.com) è un SDK open source per lo sviluppo sicuro di smart contract. Il codice è sottoposto ad auditing continuo dalla community e usato in circa 3000 progetti blockchain. Fornisce template pronti per ERC-20, ERC-721 ed ERC-1155 importabili direttamente.

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000);
    }
}
```

`MyToken` è un contratto figlio di `ERC20` di OpenZeppelin, ne eredita tutte le funzioni. Il costruttore del padre richiede nome e simbolo del token, che devono essere trasmessi dal figlio. La funzione `_mint` crea token dal nulla e li assegna all'indirizzo specificato, incrementando di conseguenza il `totalSupply`.

---

## ERC-721: Standard per NFT

Lo standard ERC-721 fu proposto nel gennaio 2018. La differenza architetturale rispetto a ERC-20 è fondamentale: mentre ERC-20 mappa **indirizzi → quantità**, ERC-721 mappa **ID unici → proprietari**.

> [!definition] tokenId in ERC-721
>
> Ogni NFT è identificato da un `uint256 tokenId`. La coppia `(contract address, tokenId)` deve essere **globalmente unica**: il tokenId è univoco all'interno di un contratto. Due contratti ERC-721 diversi possono avere token con lo stesso ID numerico, ma non rappresentano lo stesso asset.

L'interfaccia ERC-721 offre funzionalità analoghe a ERC-20 ma adattate alla gestione di token unici:

```solidity
function balanceOf(address _owner) external view returns (uint256);
function ownerOf(uint256 _tokenId) external view returns (address);
function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
function approve(address _approved, uint256 _tokenId) external payable;
function setApprovalForAll(address _operator, bool _approved) external;
function getApproved(uint256 _tokenId) external view returns (address);
function isApprovedForAll(address _owner, address _operator) external view returns (bool);
```

### safeTransferFrom: perché esiste

La funzione `transferFrom` standard presenta un problema critico: trasferisce il token senza verificare se il contratto destinatario sia in grado di gestire NFT. Se l'indirizzo `_to` è uno smart contract che non implementa il supporto ERC-721, il token viene inviato e si blocca permanentemente, irrecuperabile.

Per questo motivo esiste `safeTransferFrom`, che aggiunge un controllo:
1. Se `_to` è un contratto, chiama `onERC721Received(...)` su di esso
2. Se il contratto non implementa correttamente questa funzione (cioè non "riconosce" il token ricevuto), la transazione viene revertita
3. Il trasferimento avviene solo se il destinatario dimostra di saper gestire NFT

> [!warning] Gli NFT sono preziosi
>
> Usare `transferFrom` invece di `safeTransferFrom` verso un contratto sconosciuto è rischioso: se il contratto destinatario non supporta ERC-721, l'NFT va perso per sempre. Preferire sempre `safeTransferFrom` quando il destinatario potrebbe essere un contratto.

---

## Metadata degli NFT

Un NFT non è solo un ID on-chain: il suo valore deriva dai **metadata** associati, ovvero le informazioni che descrivono cosa rappresenta.

### La struttura dei metadata

I metadati tipici di un NFT includono:

| Campo | Significato |
|---|---|
| `name` | Nome dell'NFT (es. "Cool Ape #123") |
| `description` | Descrizione testuale |
| `image` | Link all'immagine (IPFS o HTTP) |
| `attributes` | Array di trait_type/value per caratteristiche specifiche |
| `unlockable_content` | Contenuto accessibile solo al proprietario |
| `royalty` | Percentuale di royalty per rivendite future |
| `supply` | Quasi sempre 1 per gli NFT |

### tokenURI: il collegamento tra on-chain e metadata

La funzione `tokenURI(uint256 tokenId)` è il punto di accesso ai metadata: dato un tokenId, restituisce un URI che punta a un file JSON. Questo URI può essere un URL HTTP (`https://my-nft-site.com/metadata/123.json`) oppure un link IPFS (`ipfs://Qm.../123.json`). Il file JSON contiene a sua volta ulteriori link, tra cui il link all'immagine vera e propria.

![Schema del flusso NFT Image → JSON Metadata → Traits & Attributes](images/lezione-22-fungible-e-non-fungible-tokens-erc-standards-img-01.jpg)
*Fig. — Il flusso dei metadata di un NFT: la `tokenURI` punta al JSON, che contiene il link IPFS all'immagine e l'array di attributi usati da marketplace e sistemi per filtrare e calcolare la rarità.*

### Perché gli attributi se c'è l'immagine?

L'immagine è per gli umani; gli attributi sono per le macchine. I marketplace come OpenSea usano gli attributi per permettere il **filtro** (*"solo NFT con fur dorata"*), il **calcolo della rarità** (*se solo l'1% ha "Laser Eyes", quell'attributo è molto raro e aumenta il valore*) e la **logica di gioco** (*uno Strength di 85 può influenzare il gameplay*). Senza attributi strutturati, un marketplace potrebbe solo mostrare le immagini, non filtrarle.

### On-chain vs Off-chain: dove archiviare i metadata?

Archiviare i metadata direttamente on-chain è possibile ma costosissimo e raramente raccomandato. Si fa solo quando:
- L'informazione deve persistere indipendentemente dall'esistenza del sito originale (arte digitale destinata a durare secoli)
- La logica del contratto deve accedere ai metadata (es. l'età dei CryptoKitties influenza la velocità di riproduzione)

La soluzione off-chain prevalente è l'**IPFS** (*InterPlanetary File System*), una rete peer-to-peer decentralizzata dove i contenuti sono distribuiti su più nodi e indirizzati per contenuto (non per posizione). L'alternativa cloud (AWS, Google Cloud) esiste ma contraddice lo spirito decentralizzato della blockchain.

### Royalties

Le royalties permettono all'autore originale di un NFT di ricevere una percentuale automatica su ogni rivendita futura, senza dover fare nulla. Il contratto traccia la percentuale scelta dall'artista e, ogni volta che l'NFT cambia mano, invia automaticamente la quota al wallet del creatore.

![Infografica sulle ongoing royalties con NFT](images/lezione-22-fungible-e-non-fungible-tokens-erc-standards-img-02.jpg)
*Fig. — Il meccanismo delle royalties: Alice crea e vende NFT #123 per 1 ETH con royalty del 5%. Ad ogni rivendita futura (10 ETH, 10 ETH, 20 ETH), Alice riceve automaticamente il 5% — rispettivamente 0.05, 0.5, 0.5, 1 ETH — senza alcuna azione da parte sua.*

### Unlockable Content

L'*unlockable content* è contenuto visibile o accessibile solo al proprietario corrente dell'NFT: video esclusivi, documenti privati, codici di attivazione, access key per community ristrette. L'accesso si sposta automaticamente con il token quando viene trasferito.

Il flusso di verifica che una piattaforma deve implementare è:

![Diagramma Mermaid](images/mermaid-lezione-22-fungible-e-non-fungible-tokens-erc-standards-03.png)
*Fig. — Flusso di verifica per l'unlockable content: la piattaforma chiama `ownerOf(tokenId)` on-chain e confronta il risultato con il wallet connesso dall'utente.*

---

## ERC-20 vs ERC-721: il confronto strutturale

La differenza architetturale tra i due standard si riassume in come viene organizzato il registro interno:

![Diagramma Mermaid](images/mermaid-lezione-22-fungible-e-non-fungible-tokens-erc-standards-04.png)
*Fig. — ERC-20 mappa indirizzi a quantità (fungibile); ERC-721 mappa ID unici a proprietari (non fungibile).*

---

## ERC-1155: Multi-Token Standard

Lo standard ERC-1155 fu proposto dal CTO di Enjin nel 2018 con un obiettivo preciso: **ridurre il volume di transazioni e i costi** combinando in un unico contratto le funzionalità di ERC-20 e ERC-721.

> [!definition] ERC-1155
>
> Un singolo contratto ERC-1155 può gestire contemporaneamente token fungibili (come ERC-20) e token non fungibili (come ERC-721), supportando il **batch transfer** (trasferimento di più token in una sola transazione) e includendo meccanismi di safe transfer per prevenire perdite.

Il confronto tra ERC-721 ed ERC-1155 evidenzia i vantaggi di quest'ultimo:

| Caratteristica | ERC-721 | ERC-1155 |
|---|---|---|
| Tipi di token supportati | Solo NFT | FT e NFT |
| Smart contract richiesti | Uno per ogni tipo di token | Uno solo per tutti i tipi |
| Batch transfer | Non supportato | Supportato (meno gas, meno transazioni) |
| Safe transfer | No recovery se indirizzo sbagliato | Verifica + possibilità di recovery |

### Applicazioni di ERC-1155

Il gaming è il caso d'uso principale. **Enjin Platform** usa ERC-1155 per creare asset di gioco — armi, scudi, oggetti — gestibili in un unico contratto condiviso tra più giochi. **The Sandbox** usa ERC-1155 per terreni, edifici e attrezzature nel suo metaverso. **Rarible** lo usa per supportare sia FT che NFT sulla stessa piattaforma, aumentando la flessibilità per artisti e collezionisti.

---

## La "giungla" degli standard ERC

> [!note] Un ecosistema in espansione
>
> ERC-20, ERC-721 ed ERC-1155 sono i principali standard, ma l'ecosistema Ethereum ne conta molti altri: ERC-777 (valuta Ethereum-based), ERC-827 (trasferimento a terze parti), ERC-884 (stock tokenization), ERC-1400/1404 (security token), ERC-725 (identità digitale), ERC-223 (European Research Council standard). La proliferazione di standard riflette la ricchezza e complessità degli use case che la tokenizzazione rende possibili.

