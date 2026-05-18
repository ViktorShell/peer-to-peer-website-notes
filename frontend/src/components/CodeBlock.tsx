import { useEffect, useRef, useState } from 'react'

let highlighterPromise: Promise<{
  codeToHtml: (code: string, opts: { lang: string; theme: string }) => string
}> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(async (mod) => {
      const hl = await mod.createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: [
          'javascript',
          'typescript',
          'solidity',
          'python',
          'bash',
          'json',
          'rust',
          'go',
          'sql',
        ],
      })
      return {
        codeToHtml: (code: string, { lang, theme }: { lang: string; theme: string }) =>
          hl.codeToHtml(code, { lang, theme }),
      }
    })
  }
  return highlighterPromise
}

const FALLBACK_LANG = 'plaintext'
const KNOWN_LANGS = new Set([
  'javascript',
  'typescript',
  'js',
  'ts',
  'tsx',
  'jsx',
  'solidity',
  'sol',
  'python',
  'py',
  'bash',
  'sh',
  'shell',
  'json',
  'rust',
  'go',
  'sql',
])

type Props = {
  code: string
  lang?: string
}

export function CodeBlock({ code, lang }: Props) {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const normalizedLang = normalizeLang(lang)

  useEffect(() => {
    let cancelled = false
    const theme =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'github-dark'
        : 'github-light'
    if (normalizedLang === FALLBACK_LANG) return
    void getHighlighter().then((hl) => {
      if (cancelled) return
      try {
        setHtml(hl.codeToHtml(code, { lang: normalizedLang, theme }))
      } catch {
        setHtml(null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [code, normalizedLang])

  // Listen for theme changes to re-highlight.
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const theme =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'github-dark'
          : 'github-light'
      if (normalizedLang === FALLBACK_LANG) return
      void getHighlighter().then((hl) =>
        setHtml(hl.codeToHtml(code, { lang: normalizedLang, theme })),
      )
    })
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => obs.disconnect()
  }, [code, normalizedLang])

  function copy() {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      },
      () => undefined,
    )
  }

  return (
    <div className="codeblock" ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="icon-btn"
        onClick={copy}
        aria-label="Copia codice"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          fontSize: 12,
          height: 28,
          width: 'auto',
          padding: '0 10px',
          zIndex: 1,
        }}
      >
        {copied ? '✓ Copiato' : 'Copia'}
      </button>
      {html ? (
        <div
          // eslint-disable-next-line react/no-danger -- shiki renders sanitized HTML
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre>
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

function normalizeLang(lang: string | undefined): string {
  if (!lang) return FALLBACK_LANG
  const lower = lang.toLowerCase()
  if (!KNOWN_LANGS.has(lower)) return FALLBACK_LANG
  if (lower === 'js' || lower === 'jsx') return 'javascript'
  if (lower === 'ts' || lower === 'tsx') return 'typescript'
  if (lower === 'py') return 'python'
  if (lower === 'sh' || lower === 'shell') return 'bash'
  if (lower === 'sol') return 'solidity'
  return lower
}
