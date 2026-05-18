import { Link } from 'react-router-dom'
import { LABS_BY_SLUG } from '@/data/modules'

type Props = {
  slug: string
}

export function LabBanner({ slug }: Props) {
  const lab = LABS_BY_SLUG[slug]
  if (!lab) return null
  return (
    <div className="lab-banner">
      <span className="lab-banner__icon" aria-hidden="true">
        🧪
      </span>
      <div>
        <p className="lab-banner__title">Prova il lab: {lab.title}</p>
        <p className="lab-banner__desc">{lab.blurb}</p>
      </div>
      <Link to={`/lab/${lab.slug}`} className="btn btn--primary lab-banner__cta">
        Apri lab →
      </Link>
    </div>
  )
}
