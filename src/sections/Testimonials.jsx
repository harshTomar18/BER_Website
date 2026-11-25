import React, { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { showcaseApi } from '../api';
import './Testimonials.css';

/**
 * Testimonials - Client Feedback Showcase
 * 100% Dynamic from MongoDB Atlas via showcaseApi
 */
export default function Testimonials() {
  const [testimonialsData, setTestimonialsData] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchTestimonials = async () => {
      try {
        const res = await showcaseApi.getPublicShowcase();
        if (isMounted && res?.success && res?.data?.testimonials) {
          setTestimonialsData(res.data.testimonials);
        }
      } catch (err) {
        console.error('Failed to load Testimonials:', err);
      }
    };

    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const items = Array.isArray(testimonialsData?.items) ? testimonialsData.items : [];
  const perPage = 3;
  const pages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    if (pages <= 1) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pages), 5000);
    return () => clearInterval(t);
  }, [pages]);

  if (testimonialsData?.isActive === false || items.length === 0) {
    return null;
  }

  const visible = items.slice(page * perPage, page * perPage + perPage);
  const eyebrow = testimonialsData?.eyebrow || '';
  const title = testimonialsData?.title || '';
  const text = testimonialsData?.text || '';

  return (
    <section className="section section--alt">
      <div className="container">
        {(eyebrow || title || text) && (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            text={text}
          />
        )}
        <div className="tm__grid">
          {visible.map((t, idx) => {
            const initial = t.name ? t.name.trim().charAt(0).toUpperCase() : 'U';
            return (
              <div key={t._id || `${t.name}-${idx}`} className="tm__card">
                <div className="tm__quote">“</div>
                {t.text && <p>{t.text}</p>}
                <div className="tm__who">
                  <div className="tm__avatar">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name || ''}
                        className="tm__avatar-img"
                        loading="lazy"
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  <div>
                    {t.name && <strong>{t.name}</strong>}
                    {t.role && <span>{t.role}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {pages > 1 && (
          <div className="tm__dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                className={i === page ? 'on' : ''}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
