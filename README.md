# BER Services – React Website

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in /dist

## Change things in ONE place
- Colors / fonts / spacing / radius  -> src/theme/theme.css
- All text, menus, services, news, contact info -> src/config/siteConfig.js
- All images -> src/config/images.js (files live in /public/images)

## Structure
- src/components : Header, Footer, ConsultModal, ContactForm, PageBanner ... (each .jsx has its own .css)
- src/sections   : Hero, ServicesSection, AboutSection, TechSlider, Testimonials, NewsSection, Clients, ContactSection ...
- src/pages      : Home, About, Services, ServiceDetail, News, NewsDetail, Contact, FAQ, Legal (Terms/Privacy), NotFound

## Routes
/ , /about-us , /services-we-provide , /services-we-provide/:slug , /news-and-article ,
/news-and-article/:slug , /contact-us , /faq , /terms-conditions , /privacy-policy

## Notes
- Forms log to console; connect to your backend / EmailJS / Formspree in src/components/ContactForm.jsx.
- Images are placeholders: replace files in /public/images (same names) with your own.
