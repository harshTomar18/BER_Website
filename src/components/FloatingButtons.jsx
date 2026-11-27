import React from 'react';
import { company } from '../config/siteConfig';
import { WhatsAppIcon } from './SocialIcons';
import './FloatingButtons.css';

/**
 * Global Floating WhatsApp Action Widget
 * High-definition vector SVG with gentle pulsing wave animation.
 */
export default function FloatingButtons() {
  return (
    <aside className="fb-wrap" aria-label="Direct WhatsApp Contact">
      <a
        className="fb"
        href={company.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with BER Services on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <span className="fb__ripple" />
        <WhatsAppIcon size={28} className="fb__icon" color="#ffffff" />
        <span className="fb__tooltip">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
