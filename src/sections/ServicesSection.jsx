import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Autoplay,
  EffectCoverflow,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import SectionHeading from '../components/SectionHeading';
import { homeServices } from '../config/siteConfig';
import { serviceApi } from '../api';
import './ServicesSection.css';

/**
 * ServicesSection - 3D Coverflow Smooth Auto Carousel
 * Matching Skiper49 / Carousel_003 3D Layout
 * 100% Dynamic from MongoDB Atlas via serviceApi
 * Smooth continuous auto-motion, no dots, no arrows, pause on hover
 */
export default function ServicesSection({
  showHeading = true,
  showButton = true,
  isLanding = true,
}) {
  const navigate = useNavigate();
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic services from database
  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const res = await serviceApi.getPublicServices();
        if (isMounted && res?.success && Array.isArray(res?.data?.services)) {
          setServicesList(res.data.services);
        }
      } catch (err) {
        console.error('Failed to load services for coverflow carousel:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const galleryItems = useMemo(() => {
    return servicesList.map((s) => ({
      _id: s._id || s.slug,
      image: s.galleryImage || s.image || s.heroImage || '',
      text: s.galleryLabel || s.title || '',
      slug: s.slug || '',
      title: s.title || '',
      short: s.short || '',
    })).filter((item) => item.image || item.title);
  }, [servicesList]);

  // Ensure plenty of slides for seamless continuous loop motion
  const displaySlides = useMemo(() => {
    if (galleryItems.length === 0) return [];
    let repeated = [...galleryItems];
    while (repeated.length < 12) {
      repeated = [...repeated, ...galleryItems];
    }
    return repeated;
  }, [galleryItems]);

  const handleItemClick = (slug) => {
    if (slug) {
      navigate(`/services-we-provide/${slug}`);
    }
  };

  return (
    <section className={`section svc-section ${isLanding ? 'svc-section--landing' : ''}`}>
      <div className="container">
        {showHeading && (
          <div className="svc-header-wrap">
            <SectionHeading {...homeServices} />
          </div>
        )}

        {/* 3D Coverflow Smooth Auto Carousel (No Dots, No Arrows) */}
        {displaySlides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.2,
            }}
            className="svc-carousel-wrapper"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Swiper
                effect="coverflow"
                grabCursor={true}
                slidesPerView="auto"
                centeredSlides={true}
                loop={true}
                spaceBetween={20}
                speed={2400}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                coverflowEffect={{
                  rotate: 40,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                modules={[EffectCoverflow, Autoplay]}
                className="Carousal_003"
              >
                {displaySlides.map((item, index) => (
                  <SwiperSlide
                    key={`${item._id || item.slug}-${index}`}
                    className="svc-swiper-slide"
                  >
                    <div
                      className="svc-card-inner"
                      onClick={() => handleItemClick(item.slug)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="svc-card-img-box">
                        {item.image ? (
                          <img
                            className="h-full w-full object-cover svc-card-img"
                            src={item.image}
                            alt={item.text || item.title || ''}
                            loading="lazy"
                            decoding="async"
                            width="450"
                            height="280"
                          />
                        ) : (
                          <div className="svc-card-placeholder" />
                        )}
                        <div className="svc-card-overlay" />
                      </div>
                      {item.text || item.title ? (
                        <h3 className="svc-card-label">{item.text || item.title}</h3>
                      ) : null}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </motion.div>
        )}

        {showButton && (
          <div className="svc__btn">
            <Link to="/services-we-provide" className="btn">
              Explore All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
