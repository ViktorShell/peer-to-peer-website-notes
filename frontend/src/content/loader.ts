// Loader for the markdown contents emitted by scripts/build-content.mjs.
// Files live in ./lessons/*.md and are imported as raw strings at build time.

const modules = import.meta.glob('./lessons/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const BY_SLUG: Record<string, string> = {}
for (const [path, content] of Object.entries(modules)) {
  const slug = path.replace(/^.*\/(.+)\.md$/, '$1')
  BY_SLUG[slug] = content
}

export function getLessonMarkdown(slug: string): string | null {
  return BY_SLUG[slug] ?? null
}

export function allLessonSlugs(): string[] {
  return Object.keys(BY_SLUG)
}
