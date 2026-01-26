import { UserPlus, Search, Heart, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Inscription",
    description: "Remplissez notre formulaire détaillé. Chaque profil est examiné personnellement par notre équipe.",
  },
  {
    icon: Search,
    number: "02", 
    title: "Validation",
    description: "Nous vérifions l'authenticité et le sérieux de votre démarche. Seuls les profils sincères sont acceptés.",
  },
  {
    icon: Heart,
    number: "03",
    title: "Mise en relation",
    description: "Notre administratrice vous propose des profils compatibles, sélectionnés avec soin selon vos critères.",
  },
  {
    icon: MessageCircle,
    number: "04",
    title: "Accompagnement",
    description: "Nous vous guidons à chaque étape jusqu'à la rencontre. Un suivi humain et bienveillant.",
  },
];

export const ConceptSection = () => {
  return (
    <section id="concept" className="py-20 md:py-32 bg-gradient-soft">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
            Notre approche
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-medium mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Contrairement aux applications de rencontre classiques, TimaLove mise sur 
            l'humain. Chaque étape est accompagnée par notre équipe dédiée.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="relative bg-card p-8 rounded-2xl shadow-card hover-lift text-center">
                {/* Number Badge */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-romantic text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <step.icon size={28} className="text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Prêt(e) à commencer votre histoire ?
          </p>
          <a
            href="#inscription"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Découvrir nos profils
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
