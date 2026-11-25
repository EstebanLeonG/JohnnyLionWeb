import { CONTACT_EMAIL } from '../data/projects'

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer__logo" src="/logo.webp" alt="Johnny León" width={113} height={64} />
      <div className="footer__info">
        <span>© {new Date().getFullYear()} Johnny Leon</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
    </footer>
  )
}
