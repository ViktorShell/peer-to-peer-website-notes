import type { ModuleId } from '@/content/manifest'

export type ModuleMeta = {
  id: ModuleId
  num: number
  title: string
  subtitle: string
  description: string
  color: string
}

export const MODULES: readonly ModuleMeta[] = [
  {
    id: 'p2p-dht',
    num: 1,
    title: 'Reti P2P & DHT',
    subtitle: 'Overlay, routing e tabelle distribuite',
    description:
      'Le fondamenta del peer-to-peer: dalle reti non strutturate (Gnutella) alle DHT (Chord, Kademlia), con un focus sulle strutture dati che le rendono possibili.',
    color: '#5b8def',
  },
  {
    id: 'bitcoin',
    num: 2,
    title: 'Bitcoin',
    subtitle: 'Dalla blockchain al mining',
    description:
      'Il primo sistema decentralizzato di moneta elettronica: protocollo, script, mining, sicurezza, anonimato, Lightning Network e forks.',
    color: '#f7931a',
  },
  {
    id: 'ethereum',
    num: 3,
    title: 'Ethereum & Smart Contracts',
    subtitle: 'EVM, Solidity, PoS',
    description:
      'La blockchain programmabile: account, gas, Solidity di base e avanzato, token standards, vulnerabilità e transizione a Proof of Stake.',
    color: '#7b3ff2',
  },
  {
    id: 'apps',
    num: 4,
    title: 'IPFS, Applicazioni & Progetto',
    subtitle: 'Storage decentralizzato e casi d’uso',
    description:
      'Content addressing con IPFS, applicazioni reali di smart contract e il progetto di sintesi: un servizio di lending decentralizzato.',
    color: '#22a06b',
  },
] as const

export const MODULES_BY_ID: Record<ModuleId, ModuleMeta> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
) as Record<ModuleId, ModuleMeta>

export type LabMeta = {
  slug: 'kademlia' | 'hashing' | 'pow' | 'merkle'
  title: string
  blurb: string
  lessonSlug: string
}

export const LABS: readonly LabMeta[] = [
  {
    slug: 'hashing',
    title: 'Consistent Hashing Ring',
    blurb:
      'Aggiungi e rimuovi nodi dall’anello e osserva come le chiavi migrano verso il nuovo successore.',
    lessonSlug: 'lezione-03',
  },
  {
    slug: 'kademlia',
    title: 'Kademlia: distanza XOR & lookup',
    blurb:
      'Calcola la distanza XOR tra due ID e visualizza il percorso di lookup nell’albero binario.',
    lessonSlug: 'lezione-04',
  },
  {
    slug: 'merkle',
    title: 'Merkle Tree builder',
    blurb:
      'Inserisci foglie, costruisci l’albero, clicca su una foglia per vedere la proof of inclusion.',
    lessonSlug: 'lezione-07',
  },
  {
    slug: 'pow',
    title: 'Proof of Work simulator',
    blurb:
      'Scegli la difficulty e osserva il mining iterare il nonce finché SHA-256 produce abbastanza zeri.',
    lessonSlug: 'lezione-12',
  },
] as const

export const LABS_BY_SLUG: Record<string, LabMeta> = Object.fromEntries(
  LABS.map((l) => [l.slug, l]),
)
