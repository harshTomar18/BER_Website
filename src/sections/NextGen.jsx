import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { showcaseApi } from '../api';
import './NextGen.css';

/**
 * NextGen - Next-Generation Engineering & Digital Solutions Partner
 * 100% Dynamic from MongoDB Atlas via showcaseApi
 */
export default function NextGen() {
  const [nextGenData, setNextGenData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNextGen = async () => {
      try {
        const res = await showcaseApi.getPublicShowcase();
        if (isMounted && res?.success && res?.data?.nextGen) {
          setNextGenData(res.data.nextGen);
        }
      } catch (err) {
        console.error('Failed to load NextGen section:', err);
      }
    };

    fetchNextGen();
    return () => {
      isMounted = false;
    };
  }, []);

  const paragraphs = Array.isArray(nextGenData?.paragraphs)
    ? nextGenData.paragraphs.filter((p) => p && p.trim() !== '')
    : [];

  if (nextGenData?.isActive === false || (!nextGenData?.title && paragraphs.length === 0)) {
    return null;
  }

  const eyebrow = nextGenData?.eyebrow || '';
  const title = nextGenData?.title || '';

  return (
    <section className="section ng">
      <div className="container ng__in">
        {(eyebrow || title) && (
          <SectionHeading light eyebrow={eyebrow} title={title} />
        )}
        {paragraphs.map((p, i) => (
          <p key={i} className="ng__p">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
