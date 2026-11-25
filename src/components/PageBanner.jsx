import { Link } from 'react-router-dom';
import { images } from '../config/images';
import './PageBanner.css';
export default function PageBanner({ title, crumbs = [] }) {
  return (
    <section className="pb" style={{ backgroundImage: `linear-gradient(rgba(32,40,91,.84), rgba(20,26,61,.92)), url(${images.banner})` }}>
      <div className="container">
        <h1 className="pb__title">{title}</h1>
        <div className="pb__crumbs">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}> / {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
