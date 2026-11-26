import { CONTACT_EMAIL } from '../data/projects'

export default function Contact() {
  return (
    <section className="contact" aria-label="Contact">
      <img className="contact__logo" src={`${import.meta.env.BASE_URL}logo.webp`} alt="Johnny León" width={340} height={192} />
      <a className="contact__email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      <span className="contact__copy">© {new Date().getFullYear()} Johnny Leon</span>
    </section>
  )
}
