import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { sha256Hex } from '@/utils/crypto'
import { useProgress } from '@/hooks/useProgress'

const RING_SIZE = 360  // degrees on the ring
const RADIUS = 140

type Item = { id: string; pos: number; ownerId: string }
type Node = { id: string; pos: number; color: string }

const COLORS = ['#5b8def', '#f7931a', '#7b3ff2', '#22a06b', '#ef4444', '#0ea5e9', '#ec4899']

async function hashPos(input: string): Promise<number> {
  const h = await sha256Hex(input)
  // First 4 hex digits as integer → modulo RING_SIZE
  return parseInt(h.slice(0, 4), 16) % RING_SIZE
}

function ownerOf(nodes: Node[], pos: number): string {
  if (nodes.length === 0) return ''
  const sorted = [...nodes].sort((a, b) => a.pos - b.pos)
  for (const n of sorted) {
    if (pos <= n.pos) return n.id
  }
  return sorted[0].id  // wrap around
}

export function ConsistentHashing() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState('')
  const [newNode, setNewNode] = useState('')
  const [virtualNodes, setVirtualNodes] = useState(1)
  const { recordLabUse } = useProgress()

  // Recompute owners when nodes change
  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => ({ ...it, ownerId: ownerOf(nodes, it.pos) })),
    )
  }, [nodes])

  async function addNode(name?: string) {
    const id = (name && name.trim()) || `node-${nodes.length + 1}`
    if (nodes.some((n) => n.id === id)) return
    const color = COLORS[nodes.length % COLORS.length]
    const newNodes: Node[] = []
    for (let i = 0; i < virtualNodes; i++) {
      const pos = await hashPos(`${id}#${i}`)
      newNodes.push({ id: virtualNodes > 1 ? `${id}@${i}` : id, pos, color })
    }
    setNodes((prev) => [...prev, ...newNodes])
    setNewNode('')
    recordLabUse('hashing', 'hashing-pro', 1)
  }

  function removeNode(id: string) {
    const baseId = id.split('@')[0]
    setNodes((prev) => prev.filter((n) => !n.id.startsWith(baseId)))
  }

  async function addItem(rawKey: string) {
    const key = rawKey.trim()
    if (!key) return
    const pos = await hashPos(`key:${key}`)
    setItems((prev) => [
      ...prev,
      { id: key, pos, ownerId: ownerOf(nodes, pos) },
    ])
    setNewItem('')
  }

  function pointOnRing(pos: number, radius = RADIUS) {
    const angle = (pos / RING_SIZE) * Math.PI * 2 - Math.PI / 2
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  const summary = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const it of items) {
      const owner = it.ownerId.split('@')[0]
      counts[owner] = (counts[owner] ?? 0) + 1
    }
    return counts
  }, [items])

  return (
    <div className="lab">
      <div className="lab__intro">
        <h1 className="page-title">Consistent Hashing Ring</h1>
        <p className="page-subtitle">
          Posiziona nodi e chiavi sull’anello e osserva come l’aggiunta o
          rimozione di un nodo ridistribuisce le chiavi al successore.
        </p>
      </div>

      <div className="lab-shell">
        <div className="lab-controls">
          <div className="lab-control">
            <label>Aggiungi nodo</label>
            <div className="row" style={{ gap: 6 }}>
              <input
                value={newNode}
                onChange={(e) => setNewNode(e.target.value)}
                placeholder="nome opzionale"
              />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => addNode(newNode)}
              >
                +
              </button>
            </div>
          </div>
          <div className="lab-control">
            <label>Aggiungi chiave</label>
            <div className="row" style={{ gap: 6 }}>
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="es: foo.txt"
              />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => addItem(newItem)}
                disabled={nodes.length === 0}
              >
                +
              </button>
            </div>
          </div>
          <div className="lab-control">
            <label>Virtual nodes / nodo</label>
            <select
              value={virtualNodes}
              onChange={(e) => setVirtualNodes(Number(e.target.value))}
            >
              <option value={1}>1 (nessun virtual)</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>

        <div className="lab-vis">
          <svg
            viewBox="-180 -180 360 360"
            className="ring-svg"
            width="100%"
            height="360"
          >
            <circle r={RADIUS} fill="none" stroke="var(--border-strong)" strokeWidth={1.5} />
            {nodes.map((n) => {
              const p = pointOnRing(n.pos, RADIUS)
              return (
                <motion.g
                  key={n.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <circle cx={p.x} cy={p.y} r={9} fill={n.color} stroke="var(--bg-elevated)" strokeWidth={2} />
                  <text
                    x={p.x * 1.18}
                    y={p.y * 1.18}
                    fontSize={10}
                    fill="var(--text)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeNode(n.id)}
                  >
                    {n.id}
                  </text>
                </motion.g>
              )
            })}
            {items.map((it) => {
              const p = pointOnRing(it.pos, RADIUS - 22)
              const owner = nodes.find((n) => n.id === it.ownerId)
              return (
                <motion.g
                  key={it.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={(p.x / (RADIUS - 22)) * RADIUS}
                    y2={(p.y / (RADIUS - 22)) * RADIUS}
                    stroke={owner?.color ?? 'var(--text-muted)'}
                    strokeOpacity={0.4}
                    strokeWidth={1}
                  />
                  <rect
                    x={p.x - 5}
                    y={p.y - 5}
                    width={10}
                    height={10}
                    fill={owner?.color ?? '#999'}
                    stroke="var(--bg-elevated)"
                    strokeWidth={1}
                  />
                  <text
                    x={p.x * 0.7}
                    y={p.y * 0.7}
                    fontSize={9}
                    fill="var(--text-soft)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {it.id.length > 8 ? `${it.id.slice(0, 6)}…` : it.id}
                  </text>
                </motion.g>
              )
            })}
          </svg>
        </div>

        <div className="lab-stats">
          <div className="lab-stat">
            <div className="lab-stat__label">Nodi (fisici)</div>
            <div className="lab-stat__value">
              {new Set(nodes.map((n) => n.id.split('@')[0])).size}
            </div>
          </div>
          <div className="lab-stat">
            <div className="lab-stat__label">Punti sull’anello</div>
            <div className="lab-stat__value">{nodes.length}</div>
          </div>
          <div className="lab-stat">
            <div className="lab-stat__label">Chiavi</div>
            <div className="lab-stat__value">{items.length}</div>
          </div>
        </div>

        {Object.keys(summary).length > 0 && (
          <div style={{ marginTop: 14, fontSize: 14 }}>
            <strong>Distribuzione chiavi:</strong>{' '}
            {Object.entries(summary).map(([owner, count]) => (
              <span key={owner} style={{ marginRight: 12 }}>
                <code>{owner}</code>: {count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
