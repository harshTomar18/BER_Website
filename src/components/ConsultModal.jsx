import { useConsult } from '../context/ConsultContext';
import { consult } from '../config/siteConfig';
import ContactForm from './ContactForm';
import './ConsultModal.css';
export default function ConsultModal() {
  const { open, closeModal } = useConsult();
  if (!open) return null;
  return (
    <div className="cm" onClick={closeModal}>
      <div className="cm__box" onClick={(e) => e.stopPropagation()}>
        <button className="cm__close" onClick={closeModal} aria-label="Close">✕</button>
        <h3 className="cm__title">{consult.title}</h3>
        <p className="cm__text">{consult.text}</p>
        <ContactForm />
      </div>
    </div>
  );
}
