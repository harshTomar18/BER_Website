import Hero from '../sections/Hero';
import ServicesSection from '../sections/ServicesSection';
import AboutSection from '../sections/AboutSection';
import TechSlider from '../sections/TechSlider';
import NextGen from '../sections/NextGen';
import Testimonials from '../sections/Testimonials';
import NewsSection from '../sections/NewsSection';
import Clients from '../sections/Clients';
import ContactSection from '../sections/ContactSection';
export default function Home() {
  return (<>
    <Hero /><ServicesSection isLanding={true} /><AboutSection /><TechSlider /><NextGen />
    <Testimonials /><NewsSection /><Clients /><ContactSection />
  </>);
}
