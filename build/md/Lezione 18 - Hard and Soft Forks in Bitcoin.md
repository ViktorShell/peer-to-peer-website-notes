# Hard and Soft Forks in Bitcoin

Un **fork** è, in senso generale, una modifica al protocollo e alle strutture dati di una rete blockchain. Nel mondo del software tradizionale si parla semplicemente di aggiornamenti; nel contesto delle criptovalute questi aggiornamenti assumono un nome e una rilevanza speciale, perché non avvengono su un sistema centralizzato ma su una rete distribuita di nodi che devono raggiungere il consenso sulle regole del gioco. I fork possono essere motivati dall'introduzione di nuove funzionalità, dalla correzione di vulnerabilità di sicurezza, dall'affrontare problemi di scalabilità, o dalla necessità di risolvere disaccordi profondi all'interno della comunità di sviluppatori e miner.

## Tipi di Fork

### Protocol Fork vs Chain Fork

È fondamentale distinguere due fenomeni che vengono entrambi chiamati "fork" ma hanno natura molto diversa.

Un **protocol fork** (*fork di protocollo*) nasce da un cambiamento deliberato nelle regole di consenso. È un aggiornamento intenzionale e coordinato: alcuni nodi adottano le nuove regole, altri no. Se i nodi seguono regole incompatibili, si crea una divisione permanente della blockchain in due catene separate, ognuna con la propria storia futura e i propri asset. I protocol fork si distinguono in due categorie — **soft fork** (compatibile con le versioni precedenti) e **hard fork** (non compatibile).

Un **chain fork** (*fork di catena*) è invece un fenomeno temporaneo e fisiologico. Accade quando due miner trovano un blocco valido quasi contemporaneamente, oppure a causa della latenza di rete o di un attacco. Si creano così più blocchi validi alla stessa altezza. La rete risolve l'ambiguità applicando la **longest chain rule** (la regola della catena con più lavoro cumulativo): uno dei rami diventa orfano e i suoi blocchi vengono scartati. Non cambia nessuna regola, non nasce nessun nuovo asset. È un evento normale nell'operatività quotidiana di Bitcoin.

![Confronto visivo Hard Fork vs Soft Fork: chain splits, backward compatibility](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-01.jpg)
*Fig. — Hard fork vs soft fork a confronto: il primo divide la rete in due catene separate, il secondo mantiene la rete unita con regole più restrittive.*

> [!tip] Intuizione chiave
>
> La distinzione chiave è: il protocol fork cambia le regole, il chain fork è una gara temporanea tra blocchi validi che si risolve automaticamente. Solo il primo può generare una divisione permanente della blockchain.

---

## Soft Fork

> [!definition] Soft Fork
>
> Un soft fork è una modifica all'implementazione di una blockchain che è **backward compatible** (retrocompatibile): i nodi non aggiornati possono continuare a interagire con quelli aggiornati. In generale, un soft fork introduce regole più restrittive rispetto a quelle precedenti.

L'esempio classico è la riduzione della dimensione massima dei blocchi: un nodo non aggiornato, programmato per accettare blocchi fino a 2 MB, accetterà senza problemi blocchi da 1 MB prodotti dai nodi aggiornati. Il vincolo nuovo è un sottoinsieme dei vincoli vecchi.

### Accettazione del Fork

Il meccanismo con cui un soft fork viene adottato è simile a un **voto distribuito**. Quando gli sviluppatori propongono un aggiornamento, stabiliscono una data futura per la sua attivazione. Nel frattempo, i miner possono segnalare il proprio supporto codificando un numero di versione aggiornato nei blocchi che minano. Gli altri nodi della rete osservano quante versioni aggiornate circolano e possono stimare quanta potenza di hashing ha già adottato il cambiamento.

Il processo funziona così: i miner consapevoli delle nuove regole segnalano supporto tramite i **version bits**, ma non le applicano ancora. Le nuove regole diventano attive solo quando la soglia di approvazione viene raggiunta. Il famoso BIP66 del 2015 — che modificava il formato delle firme digitali — ottenne il 95% della potenza di hashing prima di essere attivato.

> [!note] BIP (Bitcoin Improvement Proposal)
>
> I BIP sono il meccanismo formale attraverso cui vengono proposte modifiche al protocollo Bitcoin. Chiunque può aprire un BIP; la sua adozione dipende dall'accordo della comunità e dei miner.

### Come Muore la Vecchia Versione

Dopo un soft fork, se la maggioranza della potenza di hashing adotta le nuove regole, la versione legacy sparisce gradualmente. Il motivo è puramente economico: i blocchi prodotti dai nodi non aggiornati vengono rifiutati dalla maggioranza dei nodi aggiornati. I miner non vogliono sprecare potenza computazionale producendo blocchi che la rete scarterà, quindi migrano alla nuova versione per continuare a ricevere ricompense.

![Diagramma "Adapting to the New Consensus": i vecchi miner abbandonano la catena rifiutata e migrano a quella valida](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-02.jpg)
*Fig. — Come la vecchia versione muore: i blocchi dei nodi non aggiornati vengono rifiutati dalla catena dominante. I miner seguono "the chain that pays".*

I possibili esiti di un soft fork sono tre: tutti i miner accettano e il fork è semplicemente un aggiornamento software; la maggioranza accetta, la nuova versione si consolida e quella vecchia muore gradualmente; la maggioranza rifiuta e il fork non sopravvive.

---

## I Principali Soft Fork di Bitcoin

Prima di analizzare SegWit e Taproot nel dettaglio, è utile avere una visione d'insieme dei soft fork che hanno caratterizzato la storia di Bitcoin.

![Timeline dei principali soft fork Bitcoin: P2SH (2012), CSV (2015), SegWit (2017), CLTV (2017), Taproot (2021)](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-03.jpg)
*Fig. — Timeline dei soft fork principali di Bitcoin: da P2SH (2012) per il multisig, a SegWit (2017) per la scalabilità, fino a Taproot (2021) per la privacy.*

---

## SegWit — Agosto 2017

**SegWit** (*Segregated Witness*, testimone segregato) è il più importante soft fork della storia di Bitcoin, attivato nell'agosto 2017. Per capire cosa ha cambiato, è necessario partire dal problema che risolveva.

### Il Problema: Transaction Malleability

Prima di SegWit, una transazione Bitcoin conteneva tre componenti principali: gli **input** (da dove provengono i bitcoin), gli **output** (dove vanno), e le **firme** (la prova che il mittente ha autorizzato la transazione). Le firme erano incluse nei dati della transazione stessa. Questo creava una vulnerabilità nota come **transaction malleability** (*malleabilità delle transazioni*): un attaccante poteva modificare leggermente i dati della firma senza invalidare la transazione, ma cambiando così il **txid** (l'identificatore della transazione). Il txid cambiato rendeva impossibile per altri protocolli — come la Lightning Network — fare riferimento in modo affidabile a una transazione non ancora confermata.

### La Soluzione: Separare la Firma dai Dati

SegWit risolve il problema spostando i dati delle firme fuori dalla struttura principale della transazione, in una sezione separata chiamata **Witness** (*testimone*). Poiché il txid viene ora calcolato senza i dati della firma, non può più essere alterato dopo che la transazione è stata firmata.

![Struttura della transazione pre-SegWit vs post-SegWit: le firme vengono spostate nel Witness separato](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-04.jpg)
*Fig. — Confronto strutturale: nel blocco Pre-SegWit le firme sono embedded nella transazione; nel blocco SegWit la Witness Data è segregata e non influisce sul calcolo del txid.*

I benefici sono: eliminazione della manipolazione del txid, transazioni non confermate più sicure, e l'abilitazione della Lightning Network.

> [!warning] SegWit è davvero un soft fork?
>
> Apparentemente SegWit sembrerebbe incompatibile con i nodi vecchi, ma gli sviluppatori hanno usato un "trucco": le firme vengono spostate fuori dalla parte che i nodi vecchi contano per il calcolo del peso del blocco. I vecchi nodi non analizzano il Witness, vedono blocchi ≤ 1 MB e non violano nessuna regola. Accettano i nuovi blocchi senza sapere che contengono dati Witness.

### Block Weight e Aumento della Capacità

Anche se non era l'obiettivo primario, SegWit ha aumentato de facto la capacità di transazione. Prima di SegWit i blocchi erano limitati a 1 MB. SegWit introduce il concetto di **block weight** (*peso del blocco*): i byte normali di una transazione contano 4 unità di peso ciascuno, mentre i byte del Witness contano solo 1 unità di peso. Il limite massimo è 4 milioni di unità di peso. Questo significa che blocchi con molte transazioni SegWit possono contenere più dati totali, pur rimanendo entro il limite di peso — effettivamente aumentando il throughput.

![Confronto blocco legacy vs blocco SegWit: la Witness Area permette capacità extra separata dalla base data](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-05.jpg)
*Fig. — In un blocco SegWit la Witness Area (tratteggiata) contiene le firme a peso ridotto. La base data rimane ≤ 1 MB per i vecchi nodi, ma il blocco reale può superarla.*

### SegWit: Ricapitolazione

Il diagramma seguente riassume in modo completo il funzionamento di SegWit, evidenziando come i vecchi nodi vedano solo la parte base del blocco (≤ 1 MB) e ignorino la witness, mantenendo la retrocompatibilità.

![SegWit Recap: confronto Legacy Block vs SegWit Block con indicazione di cosa vedono i vecchi nodi e i nuovi nodi](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-06.jpg)
*Fig. — Ricapitolazione SegWit: il blocco legacy ha firme inline; il blocco SegWit le separa nel Witness. I vecchi nodi vedono solo la base data e rimangono sincronizzati.*

---

## Taproot — Novembre 2021

**Taproot** è il secondo grande soft fork di Bitcoin, attivato il 14 novembre 2021 con il supporto di oltre il 90% dei miner. Si basa su due tecniche crittografiche: le **Schnorr Signatures** e il **MAST** (*Merkelized Abstract Syntax Tree*). L'obiettivo è migliorare sia le capacità di scripting che la privacy della rete Bitcoin.

### Schnorr Signatures

> [!definition] Schnorr Signatures (Firme di Schnorr)
>
> Schema di firma digitale basato sul problema del logaritmo discreto. Alternativa alle firme ECDSA usate da Bitcoin, con proprietà crittografiche superiori.

Le Schnorr Signatures hanno cinque proprietà fondamentali:

**Privacy**: non è possibile distinguere firme individuali in un gruppo aggregato.

**Linearità**: consentono un metodo semplice ed efficiente per far sì che più parti collaboranti producano una firma valida per la somma delle loro chiavi pubbliche. Questo è il fondamento del **key aggregation** (*aggregazione di chiavi*) — più firmatari possono produrre una singola firma collettiva indistinguibile da quella di un singolo firmatario.

**Batch verification** (*verifica in batch*): con ECDSA, verificare tre firme richiede tre operazioni separate. Con Schnorr è possibile verificare tutte e tre insieme in una sola operazione: $\text{Ver}(\sigma_1 + \sigma_2 + \sigma_3) = 1\ \text{operazione}$, contro $\text{Ver}(\sigma_1) + \text{Ver}(\sigma_2) + \text{Ver}(\sigma_3) = 3\ \text{operazioni}$ con ECDSA.

**Non malleabilità**: le firme non possono essere modificate.

**Sicurezza dimostrabile**: la sicurezza è riducibile formalmente al problema del logaritmo discreto.

![Schema di aggregazione Schnorr: tre firmatari (P1, P2, P3) producono chiave e firma aggregate verificabili come una sola](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-07.jpg)
*Fig. — Key aggregation con Schnorr: P1, P2, P3 combinano chiavi e firme in un'unica $P_{agg}$ e $S_{agg}$. La verifica è identica a quella di un firmatario singolo.*

Le Schnorr Signatures producono una singola chiave pubblica e una singola firma, anche quando più firmatari cooperano. Il processo richiede cooperazione interattiva tra i firmatari, incluso lo scambio di chiavi pubbliche e la coordinazione del processo di firma.

### MAST — Merkelized Abstract Syntax Tree

> [!definition] MAST (Merkelized Abstract Syntax Tree)
>
> Struttura dati che combina un **Abstract Syntax Tree** (AST) con un **Merkle Tree** per rappresentare condizioni di spesa multiple in modo efficiente e privato.

Il problema che MAST risolve è il seguente: uno script Bitcoin può prevedere molteplici condizioni di spesa alternative. Senza MAST, tutte le condizioni devono essere incluse nella transazione quando si spende, rivelando tutte le clausole anche quelle non usate. MAST permette di includere nella transazione solo la condizione effettivamente eseguita, insieme alla Merkle proof che dimostra che quella condizione era nel set originale.

#### La Parte AST

L'**Abstract Syntax Tree** specifica come suddividere la logica di spesa in foglie. Le condizioni in relazione OR diventano foglie separate — se basta soddisfarne una, non ha senso includerle tutte. Le condizioni in relazione AND rimangono nella stessa foglia, perché devono essere soddisfatte insieme.

![Trasformazione da Abstract Syntax Tree (AST) a Merkelized AST (MAST): le condizioni OR diventano foglie separate, le AND rimangono nella stessa foglia](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-08.jpg)
*Fig. — Da AST a MAST: le condizioni OR (2-of-3 Multisig, Timelock) diventano foglie separate; le condizioni AND (Timelock AND Hash Preimage) rimangono nella stessa foglia.*

#### La Parte Merkle Tree

Una volta strutturate le condizioni come foglie, si costruisce un Merkle Tree su di esse. La radice del Merkle Tree impegna crittograficamente tutte le condizioni. Quando si spende, si rivela solo la foglia usata e il percorso di verifica (Merkle proof), non le altre condizioni.

![Struttura Merkle Tree del MAST con quattro condizioni di spesa: Hashlock, Timelock ≤3 mesi, 2-of-3 Multisig, Single Signature](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-09.jpg)
*Fig. — Il Merkle Tree del MAST: ogni condizione di spesa è una foglia. La MAST ROOT impegna tutte le condizioni. Al momento della spesa si rivela solo la foglia usata + il Merkle path.*

> [!example] MAST con 4 condizioni di spesa
>
> Supponiamo di avere:
> - Script 1: multisig 2-di-3 (Alice, Bob, Charlie)
> - Script 2: timelock di 1 anno
> - Script 3: hash preimage
> - Script 4: firma singola di Alice
>
> **Senza MAST**: tutti e 4 gli script sono inclusi nella transazione, rivelando tutte le clausole.
>
> **Con MAST**: solo lo script eseguito + la Merkle proof sono inclusi. Gli altri script rimangono nascosti.

### La Tweaked Public Key

Il meccanismo con cui Taproot unisce Schnorr Signatures e MAST è la **tweaked public key** (*chiave pubblica modificata*). Si parte da:
- una chiave pubblica $P$ (può essere singola o aggregata da più firmatari)
- la radice del Merkle tree degli script (MAST): $m$

Si calcola il **tweak** come:
$$
t = H(P \,\|\, m)
$$
dove $H$ è una funzione hash e $\|$ indica la concatenazione. Si applica poi il tweak alla chiave pubblica tramite operazione sulla curva ellittica:
$$
P' = P + t \cdot G
$$
Il risultato $P'$ è la **tweaked public key**: una nuova chiave pubblica che impegna crittograficamente sia la chiave interna $P$ che l'intero albero di script $m$.

![Schema concettuale tweaked key: Original Public Key + Secret Script producono una Tweaked Key che sembra normale ma ha condizioni nascoste](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-10.jpg)
*Fig. — La tweaked key: combina la chiave pubblica originale con lo script segreto (MAST root) in un'unica chiave che appare normale on-chain ma impegna crittograficamente le condizioni di spesa.*

> [!tip] Cosa viene scritto on-chain
>
> Sull'output della blockchain non viene scritta né la chiave pubblica separatamente né la radice MAST separatamente. Viene scritto solo il singolo valore $P'$ — la tweaked key. Questo valore è indistinguibile da una normale chiave pubblica Schnorr. Gli script sono invisibili, ma sono crittograficamente impegnati all'interno della chiave.

### Key Path vs Script Path Spending

Taproot prevede due modalità di spesa:

**Key path spending** (*spesa via chiave*): se tutte le parti coinvolte sono d'accordo, producono una firma Schnorr aggregata valida per $P'$. Nessuno script viene rivelato. Dall'esterno sembra una semplice transazione a firma singola, anche se in realtà ci sono molteplici condizioni possibili. Questo è il caso "felice" e più privato.

![Taproot key path spending: on-chain output con P' (tweaked), firma aggregata di Alice+Bob+Charlie, verifica come singola firma Schnorr](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-11.jpg)
*Fig. — Key path spending: tutti i partecipanti cooperano, producono una firma Schnorr aggregata. Il nodo verifica $\text{sig}$ rispetto a $P'$. Indistinguibile da una transazione standard.*

**Script path spending** (*spesa via script*): se le parti non possono usare la key path (es. una parte non è disponibile), si rivela la foglia dello script desiderato e la Merkle proof che dimostra che quella foglia era nell'albero. Le condizioni alternative rimangono nascoste.

![Taproot script path spending: reveal script + Merkle path, produzione firme matching lo script, verifica con controllo condizioni specifiche](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-12.jpg)
*Fig. — Script path spending: si rivela lo script specifico (tapleaf) e il Merkle path verso la root. Si producono le firme/dati richiesti dallo script. Le altre condizioni rimangono private.*

> [!abstract] Sintesi: Taproot
>
> Taproot unifica in modo elegante tre tecnologie: Schnorr Signatures (efficienza e aggregazione), MAST (script privati e compatti), e la tweaked key (un unico valore on-chain che impegna tutto). Il risultato è che transazioni Bitcoin complesse — multisig, timelock, contratti — appaiono on-chain identiche a transazioni semplici, migliorando sia la privacy degli utenti che l'efficienza della rete.

---

## Hard Fork

> [!definition] Hard Fork
>
> Un hard fork è una modifica alle regole di consenso **non retrocompatibile** che crea una divisione permanente della blockchain. I nodi non aggiornati rifiutano i blocchi prodotti dai nodi aggiornati, portando a due catene distinte.

Le caratteristiche chiave sono: i nodi devono aggiornarsi per seguire le nuove regole; i nodi vecchi rifiutano i nuovi blocchi, causando una divisione della catena; le due catene condividono la storia fino al punto di fork; il risultato è l'esistenza di due reti separate con asset separati.

### Bitcoin Cash — Agosto 2017

Il caso più celebre di hard fork di Bitcoin è **Bitcoin Cash**, nata nell'agosto 2017 dallo stesso giorno in cui veniva attivato SegWit. Il conflitto alla radice era la scalabilità: come rendere Bitcoin capace di gestire più transazioni al secondo?

Due visioni si scontrarono. **Bitcoin Core** sosteneva di mantenere blocchi piccoli (~1 MB) e di costruire soluzioni di secondo livello come SegWit e la Lightning Network. **Bitcoin Cash** optava per aumentare direttamente la dimensione dei blocchi a 8 MB e oltre.

L'hard fork ebbe un effetto immediato e interessante: chiunque avesse 10 BTC al momento del fork si ritrovò con 10 BTC e 10 BCH. La chiave privata Bitcoin funziona anche per Bitcoin Cash, perché le due blockchain condividono la storia fino al punto di scissione. Gli indirizzi dei wallet sono gli stessi. Gli UTXO esistenti al momento del fork sono validi su entrambe le catene, e spendere un UTXO su una catena non lo consuma sull'altra, perché le due catene sono indipendenti.

> [!note] Stato attuale di Bitcoin Cash
>
> Bitcoin Cash è ancora attiva. Fornisce circa 200 transazioni al secondo. Mantiene lo stesso algoritmo di mining di Bitcoin, quindi i miner possono minare entrambe le criptovalute. Il suo prezzo ha raggiunto un picco nella fase iniziale per poi calare significativamente rispetto a Bitcoin.

### Hard Fork come Strategia di Bootstrap

Gli hard fork sono diventati anche uno strumento strategico per lanciare nuove criptovalute. Anziché costruire una blockchain da zero — con la difficoltà di attirare utenti e sviluppatori — si crea un hard fork di Bitcoin e si annuncia agli utenti Bitcoin esistenti che riceveranno la stessa quantità della nuova criptovaluta. Questo abbassa la barriera all'adozione: chi aveva BTC si ritrova automaticamente con asset nella nuova rete.

Gli **Altcoin** sono nati così: alcune sono fork di Bitcoin fatte da comunità diverse che volevano seguire un percorso alternativo di sviluppo, altre sono fork nate esplicitamente per creare nuovi asset.

![Diagramma dei fork di Bitcoin nel 2017: Bitcoin Cash (hard fork), SegWit (soft fork), SegWit2x (hard fork), Bitcoin Gold (hard fork)](images/lezione-18-hard-and-soft-forks-in-bitcoin-img-13.jpg)
*Fig. — I fork di Bitcoin nel 2017: Bitcoin Cash e Bitcoin Gold sono hard fork che generano nuove catene (BCH, BTG); SegWit è il soft fork che mantiene la catena principale; SegWit2x è un tentativo di hard fork abortito (B2X).*

### Hard Fork per Vulnerabilità Crittografiche

Esistono scenari in cui un hard fork non è una scelta ma una necessità tecnica. Se viene scoperta una vulnerabilità critica nelle primitive crittografiche usate dalla blockchain, la risposta può richiedere un hard fork.

Un esempio concreto: se SHA-256 venisse compromesso, Bitcoin dovrebbe migrare a SHA-3. Aggiungere SHA-3 potrebbe essere un soft fork, ma rimuovere SHA-2 e sostituirlo completamente con SHA-3 richiede un hard fork — è una modifica non retrocompatibile.

Il caso più rilevante a lungo termine è quello dei **computer quantistici**: algoritmi come Shor possono rompere la crittografia a curva ellittica e le firme digitali — incluse le Schnorr Signatures. Se un computer quantistico sufficientemente potente diventasse disponibile, potrebbe derivare chiavi private dalle chiavi pubbliche e accedere ai fondi di chiunque. La risposta richiederebbe un hard fork per adottare algoritmi di firma **post-quantum** resistenti all'attacco quantistico.

