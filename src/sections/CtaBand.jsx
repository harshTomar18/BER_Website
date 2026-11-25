import { useConsult } from '../context/ConsultContext';
import './CtaBand.css';
export default function CtaBand({ title = 'Have a project in mind?', text = "Let's turn your idea into something real." }) {
  const { openModal } = useConsult();
  return (
    <section className="cta">
      <div className="container cta__in">
        <div><h2>{title}</h2><p>{text}</p></div>
        <button className="btn" onClick={openModal}>Get Free Consultation</button>
      </div>
    </section>
  );
}
