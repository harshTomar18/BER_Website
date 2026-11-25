import PageBanner from '../components/PageBanner';
import { legal } from '../config/siteConfig';
import './Legal.css';
export function Terms() { return <LegalPage title="Terms & Conditions" items={legal.terms} />; }
export function Privacy() { return <LegalPage title="Privacy Policy" items={legal.privacy} />; }
function LegalPage({ title, items }) {
  return (<>
    <PageBanner title={title} crumbs={[{ label: title }]} />
    <section className="section">
      <div className="container legal">
        <ol>{items.map((t, i) => <li key={i}>{t}</li>)}</ol>
      </div>
    </section>
  </>);
}
