import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ConceptSection } from "@/components/ConceptSection";
import { GallerySection } from "@/components/GallerySection";
import { RegistrationSection } from "@/components/RegistrationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ConceptSection />
        <GallerySection />
        <RegistrationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;