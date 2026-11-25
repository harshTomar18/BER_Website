import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { showcaseApi } from '../api';
import './Clients.css';

/**
 * Clients - Marquee of Client Logos
 * 100% Dynamic from MongoDB Atlas via showcaseApi
 */
export default function Clients() {
  const [clientsData, setClientsData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchClients = async () => {
      try {
        const res = await showcaseApi.getPublicShowcase();
        if (isMounted && res?.success && res?.data?.clients) {
          setClientsData(res.data.clients);
        }
      } catch (err) {
        console.error('Failed to load Clients marquee data:', err);
      }
    };

    fetchClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const items = Array.isArray(clientsData?.items) ? clientsData.items : [];
  if (clientsData?.isActive === false || items.length === 0) {
    return null;
  }

  // Duplicate array for seamless infinite marquee scroll
  const loopClients = [...items, ...items];
  const eyebrow = clientsData?.eyebrow || '';
  const title = clientsData?.title || '';
  const text = clientsData?.text || '';

  return (
    <section className="section clients-section" id="clients-section">
      {/* Background Soft Glows */}
      <div className="cl-bg-glow cl-bg-glow--left" aria-hidden="true" />
      <div className="cl-bg-glow cl-bg-glow--right" aria-hidden="true" />

      {(eyebrow || title || text) && (
        <div className="container cl-heading-wrap">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            text={text}
          />
        </div>
      )}

      {/* Marquee Track Container with Edge Gradient Fades */}
      <div className="cl-marquee-wrapper" aria-label="Our Trusted Clients">
        <div className="cl-marquee-track">
          {loopClients.map((client, idx) => {
            const cardContent = (
              <img
                src={client.logo || ''}
                alt={client.name ? `${client.name} logo` : ''}
                loading="lazy"
                className="cl-logo-img"
              />
            );

            return client.website ? (
              <a
                key={client._id || `${client.name}-${idx}`}
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="cl-logo-card"
                title={client.name || ''}
              >
                {cardContent}
              </a>
            ) : (
              <div
                key={client._id || `${client.name}-${idx}`}
                className="cl-logo-card"
                title={client.name || ''}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
