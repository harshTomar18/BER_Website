import './SectionHeading.css';
export default function SectionHeading({ eyebrow, title, text, align = 'center', light = false }) {
  return (
    <div className={`sh sh--${align} ${light ? 'sh--light' : ''}`}>
      {eyebrow && <h6 className="sh__eyebrow">{eyebrow}</h6>}
      <h2 className="sh__title">{title}</h2>
      {text && <p className="sh__text">{text}</p>}
    </div>
  );
}
