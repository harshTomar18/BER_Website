import { useState } from 'react';
import PageBanner from '../components/PageBanner';
import { faqs } from '../config/siteConfig';
import './FAQ.css';
export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (<>
    <PageBanner title="Frequently Asked Questions" crumbs={[{ label: 'FAQ' }]} />
    <section className="section">
      <div className="container faq">
        {faqs.map((f, i) => (
          <div key={f.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
            <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<span>{open === i ? '−' : '+'}</span></button>
            {open === i && <p className="faq__a">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  </>);
}
