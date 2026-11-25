import { company } from '../config/siteConfig';
import './FloatingButtons.css';
export default function FloatingButtons() {
  return (
    <a className="fb" href={company.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
  );
}
