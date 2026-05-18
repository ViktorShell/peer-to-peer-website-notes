import { useEffect, useMemo, useState } from 'react'
import { sha256Hex } from '@/utils/crypto'
import { useProgress } from '@/hooks/useProgress'

type TreeLevel = string[]

async function buildTree(leaves: string[]): Promise<TreeLevel[]> {
  const levels: TreeLevel[] = []
  let current = await Promise.all(leaves.map((l) => sha256Hex(l)))
  levels.push(current)
  while (current.length > 1) {
    const next: string[] = []
    for (let i = 0; i < current.length; i += 2) {
      const left = current[i]
      const right = current[i + 1] ?? left  // duplicate last if odd
      next.push(await sha256Hex(left + right))
    }
    current = next
    levels.push(current)
  }
  return levels
}

function proofFor(levels: TreeLevel[], leafIndex: number): { hash: string; side: 'L' | 'R' }[] {
  const proof: { hash: string; side: 'L' | 'R' }[] = []
  let idx = leafIndex
  for (let lvl = 0; lvl < levels.length - 1; lvl++) {
    const layer = levels[lvl]
    const sibling = idx % 2 === 0 ? idx + 1 : idx - 1
    const hash = layer[sibling] ?? layer[idx]
    proof.push({ hash, side: idx % 2 === 0 ? 'R' : 'L' })
    idx = Math.floor(idx / 2)
  }
  return proof
}

export function MerkleTreeLab() {
  const [leavesText, setLeavesText] = useState(
    ['tx1: Alice → Bob 10', 'tx2: Bob → Carol 4', 'tx3: Carol → Dave 1', 'tx4: Dave → Eve 8'].join('\n'),
  )
  const [tree, setTree] = useState<TreeLevel[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const { recordLabUse } = useProgress()

  const leaves = useMemo(
    () =>
      leavesText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 16),
    [leavesText],
  )

  useEffect(() => {
    let cancelled = false
    if (leaves.length === 0) {
      setTree([])
      return
    }
    void buildTree(leaves).then((t) => {
      if (!cancelled) setTree(t)
    })
    return () => {
      cancelled = true
    }
  }, [leaves])

  function shortHash(h: string): string {
    return `${h.slice(0, 6)}…${h.slice(-4)}`
  }

  function handleBuild() {
    recordLabUse('merkle', 'merkle-architect', 1)
  }

  const proof = selected !== null && tree.length > 0 ? proofFor(tree, selected) : []
  const proofHashes = new Set(proof.map((p) => p.hash))
  const root = tree[tree.length - 1]?.[0]

  return (
    <div className="lab">
      <div className="lab__intro">
        <h1 className="page-title">Merkle Tree builder</h1>
        <p className="page-subtitle">
          Inserisci una foglia per riga. Clicca su una foglia per evidenziare
          la sua proof of inclusion (gli hash necessari per verificare la
          radice).
        </p>
      </div>

      <div className="lab-shell">
        <div className="lab-controls">
          <div className="lab-control" style={{ flex: 1, minWidth: 280 }}>
            <label>Foglie (una per riga, max 16)</label>
            <textarea
              value={leavesText}
              onChange={(e) => setLeavesText(e.target.value)}
              rows={5}
              style={{
                fontFamily: 'var(--mono)',
                padding: 8,
                background: 'var(--bg-muted)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
                fontSize: 13,
              }}
            />
          </div>
          <div className="lab-control" style={{ justifyContent: 'flex-end' }}>
            <label>&nbsp;</label>
            <button type="button" className="btn btn--primary" onClick={handleBuild}>
              Costruisci albero
            </button>
          </div>
        </div>

        {tree.length > 0 && (
          <>
            <div className="lab-stats">
              <div className="lab-stat">
                <div className="lab-stat__label">Foglie</div>
                <div className="lab-stat__value">{leaves.length}</div>
              </div>
              <div className="lab-stat">
                <div className="lab-stat__label">Livelli</div>
                <div className="lab-stat__value">{tree.length}</div>
              </div>
              <div className="lab-stat">
                <div className="lab-stat__label">Proof size</div>
                <div className="lab-stat__value">
                  {selected !== null ? proof.length : '–'}
                </div>
              </div>
              <div className="lab-stat" style={{ gridColumn: 'span 2' }}>
                <div className="lab-stat__label">Root</div>
                <div className="lab-stat__value" title={root}>
                  {root ? shortHash(root) : '–'}
                </div>
              </div>
            </div>

            <div className="merkle-tree" style={{ marginTop: 16 }}>
              {[...tree].reverse().map((level, lvlFromTop) => {
                const lvl = tree.length - 1 - lvlFromTop
                return (
                  <div key={lvl} className="merkle-level">
                    {level.map((hash, i) => {
                      const isRoot = lvl === tree.length - 1
                      const isLeaf = lvl === 0
                      const isProof = proofHashes.has(hash)
                      const isSelected = isLeaf && selected === i
                      return (
                        <div
                          key={`${lvl}-${i}`}
                          className={`${isLeaf ? 'merkle-leaf' : 'merkle-hash'} ${
                            isRoot ? 'merkle-hash--root' : ''
                          } ${isProof ? 'merkle-hash--proof' : ''} ${
                            isSelected ? 'merkle-leaf--selected' : ''
                          }`}
                          onClick={() => {
                            if (isLeaf) setSelected(selected === i ? null : i)
                          }}
                          title={hash}
                        >
                          {isLeaf ? (
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 12 }}>
                                {leaves[i]}
                              </div>
                              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                                {shortHash(hash)}
                              </div>
                            </div>
                          ) : (
                            shortHash(hash)
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {selected !== null && (
              <div className="card" style={{ marginTop: 16 }}>
                <strong>Proof of inclusion per "{leaves[selected]}"</strong>
                <ol className="muted" style={{ fontSize: 13, marginTop: 8 }}>
                  {proof.map((p, i) => (
                    <li key={i} style={{ fontFamily: 'var(--mono)' }}>
                      Step {i + 1}: combina con <strong>{p.side}</strong>{' '}
                      hash {shortHash(p.hash)}
                    </li>
                  ))}
                  <li style={{ fontFamily: 'var(--mono)' }}>
                    Risultato finale = <strong>root {shortHash(root!)}</strong>
                  </li>
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
