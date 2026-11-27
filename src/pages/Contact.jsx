import PageBanner from '../components/PageBanner';
import ContactSection from '../sections/ContactSection';
import FaqSection from '../sections/FaqSection';
import './Contact.css';
export default function Contact() {
  return (<>
    <PageBanner title="Contact Us" crumbs={[{ label: 'Contact Us' }]} />
    <ContactSection />
    <FaqSection title="Frequently Asked Questions Before You Inquire" />
  </>);
}
