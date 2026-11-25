import React, { useState, useEffect } from 'react';
import {
  Target,
  Compass,
  ShieldCheck,
  Users,
  CheckCircle2,
  Zap,
  Layers,
  Lock,
  Headphones,
  Check,
  ArrowRight
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import AboutSection from '../sections/AboutSection';
import NextGen from '../sections/NextGen';
import TechSlider from '../sections/TechSlider';
import Testimonials from '../sections/Testimonials';
import CtaBand from '../sections/CtaBand';
import { useConsult } from '../context/ConsultContext';
import { aboutApi } from '../api';
import './About.css';

export default function About() {
  const { openModal } = useConsult();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Dynamic About Page Configuration from Database
  useEffect(() => {
    let isMounted = true;
    const fetchAboutData = async () => {
      try {
        const res = await aboutApi.getPublicAbout();
        if (isMounted && res?.success && res?.data?.about) {
          setAboutData(res.data.about);
        } else if (isMounted) {
          setAboutData(null);
        }
      } catch (err) {
        console.error('Failed to load about details from API:', err);
        if (isMounted) setAboutData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  const missionVisionHeader = aboutData?.missionVisionHeader || {};
  const mission = aboutData?.mission || {};
  const vision = aboutData?.vision || {};
  const valuesHeader = aboutData?.valuesHeader || {};
  const values = Array.isArray(aboutData?.values) ? aboutData.values : [];
  const whyChooseUsHeader = aboutData?.whyChooseUsHeader || {};
  const whyChooseUs = Array.isArray(aboutData?.whyChooseUs) ? aboutData.whyChooseUs : [];
  const ctaBox = aboutData?.ctaBox || {};

  const renderValIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck size={26} strokeWidth={2.2} />;
      case 'Users':
        return <Users size={26} strokeWidth={2.2} />;
      case 'CheckCircle2':
        return <CheckCircle2 size={26} strokeWidth={2.2} />;
      case 'Zap':
        return <Zap size={26} strokeWidth={2.2} />;
      default:
        return <ShieldCheck size={26} strokeWidth={2.2} />;
    }
  };

  const renderWhyIcon = (icon) => {
    switch (icon) {
      case 'Layers':
        return <Layers size={24} strokeWidth={2.2} />;
      case 'Zap':
        return <Zap size={24} strokeWidth={2.2} />;
      case 'Lock':
        return <Lock size={24} strokeWidth={2.2} />;
      case 'Headphones':
        return <Headphones size={24} strokeWidth={2.2} />;
      default:
        return <Layers size={24} strokeWidth={2.2} />;
    }
  };

  return (
    <>
      <PageBanner
        title="About BER Services"
        crumbs={[{ label: 'About BER' }]}
      />

      {/* Hero Overview & 3D Artwork / Uploaded Artwork Section */}
      <AboutSection />

      {/* =====================================================
          MISSION & VISION SPOTLIGHT
          ===================================================== */}
      <section className="section ab-mv">
        <div className="container">
          {(missionVisionHeader.title || missionVisionHeader.titleAccent || missionVisionHeader.subtitle) && (
            <div className="ab-mv__header">
              <h2 className="ab-mv__title">
                {missionVisionHeader.title || ''}{' '}
                {missionVisionHeader.titleAccent ? (
                  <span className="ab-text-gradient">{missionVisionHeader.titleAccent}</span>
                ) : null}
              </h2>
              {missionVisionHeader.subtitle ? (
                <p className="ab-mv__subtitle">{missionVisionHeader.subtitle}</p>
              ) : null}
            </div>
          )}

          <div className="ab-mv__grid">
            {/* Mission Card */}
            {(mission.badge || mission.title || mission.description || (mission.pillars && mission.pillars.length > 0)) && (
              <div className="ab-mv__card ab-mv__card--mission">
                <div className="ab-mv__glow"></div>
                <div className="ab-mv__top">
                  <div className="ab-mv__icon-box ab-mv__icon-box--blue">
                    <Target size={28} strokeWidth={2.2} />
                  </div>
                  {mission.badge ? (
                    <span className="ab-mv__badge ab-mv__badge--blue">{mission.badge}</span>
                  ) : null}
                </div>

                {mission.title ? <h3 className="ab-mv__card-title">{mission.title}</h3> : null}
                {mission.tagline ? <p className="ab-mv__card-tagline">{mission.tagline}</p> : null}
                {mission.description ? <p className="ab-mv__card-desc">{mission.description}</p> : null}

                {mission.pillars && mission.pillars.length > 0 && (
                  <div className="ab-mv__pillars">
                    <h4 className="ab-mv__pillars-title">Key Mission Commitments:</h4>
                    <ul className="ab-mv__pillars-list">
                      {mission.pillars.map((pillar, i) => (
                        <li key={i} className="ab-mv__pillar-item">
                          <div className="ab-mv__check-circle ab-mv__check-circle--blue">
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <div className="ab-mv__pillar-text">
                            <strong>{pillar.title || ''}:</strong> {pillar.desc || ''}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Vision Card */}
            {(vision.badge || vision.title || vision.description || (vision.milestones && vision.milestones.length > 0)) && (
              <div className="ab-mv__card ab-mv__card--vision">
                <div className="ab-mv__glow"></div>
                <div className="ab-mv__top">
                  <div className="ab-mv__icon-box ab-mv__icon-box--orange">
                    <Compass size={28} strokeWidth={2.2} />
                  </div>
                  {vision.badge ? (
                    <span className="ab-mv__badge ab-mv__badge--orange">{vision.badge}</span>
                  ) : null}
                </div>

                {vision.title ? <h3 className="ab-mv__card-title">{vision.title}</h3> : null}
                {vision.tagline ? <p className="ab-mv__card-tagline">{vision.tagline}</p> : null}
                {vision.description ? <p className="ab-mv__card-desc">{vision.description}</p> : null}

                {vision.milestones && vision.milestones.length > 0 && (
                  <div className="ab-mv__pillars">
                    <h4 className="ab-mv__pillars-title">Strategic Horizons:</h4>
                    <ul className="ab-mv__pillars-list">
                      {vision.milestones.map((milestone, i) => (
                        <li key={i} className="ab-mv__pillar-item">
                          <div className="ab-mv__check-circle ab-mv__check-circle--orange">
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <div className="ab-mv__pillar-text">
                            <strong>{milestone.title || ''}:</strong> {milestone.desc || ''}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR CORE VALUES
          ===================================================== */}
      {(valuesHeader.badge || valuesHeader.title || values.length > 0) && (
        <section className="section ab-values-section">
          <div className="container">
            <div className="ab-values__header">
              {valuesHeader.badge ? (
                <div className="ab-pill">
                  <ShieldCheck size={14} className="ab-pill-icon" />
                  <span>{valuesHeader.badge}</span>
                </div>
              ) : null}

              {(valuesHeader.title || valuesHeader.titleAccent) && (
                <h2 className="ab-values__title">
                  {valuesHeader.title || ''}{' '}
                  {valuesHeader.titleAccent ? (
                    <span className="ab-text-gradient">{valuesHeader.titleAccent}</span>
                  ) : null}
                </h2>
              )}

              {valuesHeader.subtitle ? (
                <p className="ab-values__subtitle">{valuesHeader.subtitle}</p>
              ) : null}
            </div>

            {values.length > 0 && (
              <div className="ab-values__grid">
                {values.map((val, idx) => (
                  <div key={val.number || idx} className="ab-value-card">
                    <div className="ab-value-card__top">
                      <span className="ab-value-card__num">{val.number || ''}</span>
                      <div className="ab-value-card__icon">{renderValIcon(val.icon)}</div>
                    </div>
                    {val.title ? <h3 className="ab-value-card__title">{val.title}</h3> : null}
                    {val.desc ? <p className="ab-value-card__desc">{val.desc}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Company Narrative & Vision Statement */}
      <NextGen />

      {/* =====================================================
          WHY INDUSTRY LEADERS CHOOSE BER SERVICES
          ===================================================== */}
      {(whyChooseUsHeader.badge || whyChooseUsHeader.title || whyChooseUs.length > 0 || ctaBox.title) && (
        <section className="section ab-why-section">
          <div className="container">
            <div className="ab-why__header">
              {whyChooseUsHeader.badge ? (
                <div className="ab-pill">
                  <Zap size={14} className="ab-pill-icon" />
                  <span>{whyChooseUsHeader.badge}</span>
                </div>
              ) : null}

              {(whyChooseUsHeader.title || whyChooseUsHeader.titleAccent) && (
                <h2 className="ab-why__title">
                  {whyChooseUsHeader.title || ''}{' '}
                  {whyChooseUsHeader.titleAccent ? (
                    <span className="ab-text-gradient">{whyChooseUsHeader.titleAccent}</span>
                  ) : null}
                </h2>
              )}

              {whyChooseUsHeader.subtitle ? (
                <p className="ab-why__subtitle">{whyChooseUsHeader.subtitle}</p>
              ) : null}
            </div>

            {whyChooseUs.length > 0 && (
              <div className="ab-why__grid">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="ab-why-card">
                    <div className="ab-why-card__icon-wrapper">{renderWhyIcon(item.icon)}</div>
                    {item.title ? <h3 className="ab-why-card__title">{item.title}</h3> : null}
                    {item.desc ? <p className="ab-why-card__desc">{item.desc}</p> : null}
                  </div>
                ))}
              </div>
            )}

            {/* Consultation CTA Strip */}
            {(ctaBox.title || ctaBox.text || ctaBox.buttonText) && (
              <div className="ab-cta-box">
                <div className="ab-cta-box__content">
                  {ctaBox.title ? <h3 className="ab-cta-box__title">{ctaBox.title}</h3> : null}
                  {ctaBox.text ? <p className="ab-cta-box__text">{ctaBox.text}</p> : null}
                </div>
                {ctaBox.buttonText ? (
                  <button className="ab-cta-box__btn" onClick={openModal}>
                    <span>{ctaBox.buttonText}</span>
                    <ArrowRight size={18} />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Technologies Slider */}
      <TechSlider />

      {/* Testimonials */}
      <Testimonials />

      {/* Final Call to Action */}
      <CtaBand />
    </>
  );
}
