import React from 'react';
import PageBanner from '../components/PageBanner';
import FaqSection from '../sections/FaqSection';
import CtaBand from '../sections/CtaBand';

export default function FAQ() {
  return (
    <>
      <PageBanner
        title="Frequently Asked Questions"
        crumbs={[{ label: 'Home', path: '/' }, { label: 'FAQ' }]}
      />
      <FaqSection
        showSearch={true}
        showCategories={true}
        badgeText="Full Knowledge Base"
        title={
          <>
            Comprehensive Questions &{' '}
            <span className="faq-sec__gradient-text">Detailed Answers</span>
          </>
        }
        subtitle="Explore detailed answers regarding our custom software engineering, eCommerce platform builds, agile sprint milestones, IP ownership, and 24/7 SLA maintenance."
      />
      <CtaBand />
    </>
  );
}
