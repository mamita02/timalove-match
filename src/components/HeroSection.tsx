import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { Button } from "./ui/button";
import heroImage from "@/assets/hero-romantic.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Couple romantique"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/40 to-background/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-fade-up">
            <Heart size={16} className="text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              Mise en relation sérieuse vers le mariage
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Trouvez l'amour{" "}
            <span className="text-gradient">authentique</span>
            <br />
            avec un accompagnement{" "}
            <span className="text-primary">humain</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            TimaLove vous accompagne dans votre recherche d'une relation sérieuse. 
            Chaque profil est validé manuellement pour garantir authenticité et sincérité.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="romantic" size="lg" className="group">
              Commencer mon inscription
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Découvrir le concept
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center gap-3 p-4 glass-card rounded-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield size={24} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Profils vérifiés</p>
                <p className="text-sm text-muted-foreground">Validation manuelle</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 p-4 glass-card rounded-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users size={24} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Accompagnement</p>
                <p className="text-sm text-muted-foreground">100% personnalisé</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 p-4 glass-card rounded-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart size={24} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Objectif mariage</p>
                <p className="text-sm text-muted-foreground">Relations sérieuses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};
