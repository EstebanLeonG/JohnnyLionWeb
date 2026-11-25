import { categories, type Section } from '../data/projects'

interface Props {
  active: Section
  onChange: (section: Section) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <nav className="filters" aria-label="Secciones">
      {categories.map((c) => (
        <button
          key={c.key}
          type="button"
          className={active === c.key ? 'active' : ''}
          aria-current={active === c.key ? 'page' : undefined}
          onClick={() => onChange(c.key)}
        >
          {c.label}
        </button>
      ))}
    </nav>
  )
}
