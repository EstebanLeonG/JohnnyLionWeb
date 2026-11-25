import CategoryFilter from './CategoryFilter'
import type { Section } from '../data/projects'

interface Props {
  active: Section
  onChange: (section: Section) => void
}

export default function Header({ active, onChange }: Props) {
  return (
    <header className="header">
      <div className="header__brand">
        <h1>Johnny León</h1>
        <span>Cinematographer</span>
      </div>
      <CategoryFilter active={active} onChange={onChange} />
    </header>
  )
}
