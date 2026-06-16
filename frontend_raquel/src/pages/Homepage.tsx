import Hero from "../components/Hero";
import BrokerSection from "../components/BrokerSection";
import PropertyCarousel from "../components/PropertyCarousel";
import Catalog from "../components/Catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrokerSection />
      <PropertyCarousel />
      <Catalog />
    </>
  );
}
