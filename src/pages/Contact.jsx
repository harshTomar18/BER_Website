import PageBanner from '../components/PageBanner';
import ContactSection from '../sections/ContactSection';
import './Contact.css';
export default function Contact() {
  return (<>
    <PageBanner title="Contact Us" crumbs={[{ label: 'Contact Us' }]} />
    <ContactSection />
  </>);
}
