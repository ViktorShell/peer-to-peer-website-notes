import { useEffect, useRef, useState } from 'react'
import { sha256Hex } from '@/utils/crypto'
import { useProgress } from '@/hooks/useProgress'

type Status = 'idle' | 'mining' | 'found' | 'cancelled'

export function PoWSimulator() {
  const [blockData, setBlockData] = useState('Hello Bitcoin, ciao UniPi!')
  const [difficulty, setDifficulty] = useState(4)
  const [nonce, setNonce] = useState(0)
  const [hash, setHash] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const cancelRef = useRef(false)
  const { recordLabUse } = useProgress()

  const target = '0'.repeat(difficulty)
  const expected = Math.pow(16, difficulty)

  // Update elapsed time during mining
  useEffect(() => {
    if (status !== 'mining' || !startedAt) return
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 100)
    return () => clearInterval(id)
  }, [status, startedAt])

  async function start() {
    cancelRef.current = false
    setStatus('mining')
    setNonce(0)
    setHash('')
    const start = Date.now()
    setStartedAt(start)
    setElapsed(0)
    let n = 0
    let lastUiUpdate = 0
    while (!cancelRef.current) {
      const candidate = `${blockData}|${n}`
      // Compute hash in inline loop; yield to UI every 200 hashes
      // (SubtleCrypto is async by design, so it inherently yields)
      const h = await sha256Hex(candidate)
      if (h.startsWith(target)) {
        setHash(h)
        setNonce(n)
        setStatus('found')
        if (difficulty >= 4) recordLabUse('pow', 'miner', 1)
        else recordLabUse('pow')
        return
      }
      n++
      if (n - lastUiUpdate > 200) {
        setNonce(n)
        setHash(h)
        lastUiUpdate = n
        // Give the UI a moment
        await new Promise((r) => setTimeout(r, 0))
      }
    }
    setStatus('cancelled')
  }

  function stop() {
    cancelRef.current = true
  }

  const hashesPerSec =
    elapsed > 0 ? Math.round((nonce / elapsed) * 1000).toLocaleString() : '0'

  return (
    <div className="lab">
      <div className="lab__intro">
        <h1 className="page-title">Proof of Work simulator</h1>
        <p className="page-subtitle">
          Aumenta la difficulty per richiedere più zeri iniziali nell’hash
          SHA-256. Ogni cifra hex aggiuntiva moltiplica il lavoro medio per ~16.
        </p>
      </div>

      <div className="lab-shell">
        <div className="lab-controls">
          <div className="lab-control" style={{ flex: 1, minWidth: 240 }}>
            <label>Dati del blocco</label>
            <input
              value={blockData}
              onChange={(e) => setBlockData(e.target.value)}
              disabled={status === 'mining'}
            />
          </div>
          <div className="lab-control">
            <label>Difficulty (zeri leading)</label>
            <input
              type="range"
              min={1}
              max={6}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              disabled={status === 'mining'}
            />
            <span className="muted" style={{ fontSize: 12 }}>
              {difficulty} zeri · ~{expected.toLocaleString()} hash attesi
            </span>
          </div>
          <div className="lab-control" style={{ justifyContent: 'flex-end' }}>
            <label>&nbsp;</label>
            {status === 'mining' ? (
              <button type="button" className="btn btn--ghost" onClick={stop}>
                Stop
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={start}>
                {status === 'found' ? '⛏ Mina di nuovo' : '⛏ Inizia mining'}
              </button>
            )}
          </div>
        </div>

        <div className="lab-stats">
          <div className="lab-stat">
            <div className="lab-stat__label">Nonce</div>
            <div className="lab-stat__value">{nonce.toLocaleString()}</div>
          </div>
          <div className="lab-stat">
            <div className="lab-stat__label">Tempo</div>
            <div className="lab-stat__value">
              {(elapsed / 1000).toFixed(1)}s
            </div>
          </div>
          <div className="lab-stat">
            <div className="lab-stat__label">Velocità</div>
            <div className="lab-stat__value">{hashesPerSec} H/s</div>
          </div>
          <div className="lab-stat">
            <div className="lab-stat__label">Stato</div>
            <div className="lab-stat__value">
              {status === 'mining' && '⛏ Mining…'}
              {status === 'found' && '✅ Trovato!'}
              {status === 'idle' && '—'}
              {status === 'cancelled' && '✋ Stoppato'}
            </div>
          </div>
        </div>

        <div className="pow-output" style={{ marginTop: 16 }}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
            Hash corrente (target: <code>{target}…</code>):
          </div>
          <div
            className={
              status === 'found' ? 'pow-output__hash--match' : undefined
            }
          >
            {hash ? (
              <>
                <span className="pow-zeros">{hash.slice(0, difficulty)}</span>
                {hash.slice(difficulty)}
              </>
            ) : (
              <span className="muted">— premi "Inizia mining" —</span>
            )}
          </div>
        </div>

        {status === 'found' && (
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-soft)' }}>
            🎉 Blocco trovato con nonce <strong>{nonce.toLocaleString()}</strong>.
            Hash atteso medio: <strong>{expected.toLocaleString()}</strong> ·
            Tu hai impiegato <strong>{nonce.toLocaleString()}</strong> tentativi
            ({(nonce / expected).toFixed(2)}× la media).
          </div>
        )}
      </div>
    </div>
  )
}
