import { Briefcase, Heart, Lock, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

// Placeholder profiles with blurred effect
const profiles = [
  {
    id: 1,
    name: "Sophie M.",
    age: 28,
    location: "Paris",
    profession: "Architecte",
    description: "Passionnée d'art et de voyages, je recherche une relation sincère et durable.",
  },
  {
    id: 2,
    name: "Thomas L.",
    age: 32,
    location: "Lyon",
    profession: "Médecin",
    description: "Attentionné et ambitieux, je souhaite construire une famille.",
  },
  {
    id: 3,
    name: "Amina K.",
    age: 26,
    location: "Marseille",
    profession: "Enseignante",
    description: "Douce et cultivée, à la recherche d'un partenaire partageant mes valeurs.",
  },
  {
    id: 4,
    name: "Marc D.",
    age: 35,
    location: "Bordeaux",
    profession: "Entrepreneur",
    description: "Entrepreneur passionné, je cherche une femme authentique et bienveillante.",
  },
  {
    id: 5,
    name: "Fatou S.",
    age: 29,
    location: "Toulouse",
    profession: "Pharmacienne",
    description: "Sérieuse et joviale, prête pour une belle histoire d'amour.",
  },
  {
    id: 6,
    name: "Jean-Pierre B.",
    age: 38,
    location: "Nice",
    profession: "Ingénieur",
    description: "Stable et attentif, je recherche une relation menant au mariage.",
  },
];

export const GallerySection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    // APPLICATION DU DÉGRADÉ IMMERSIF ICI
    <section id="galerie" className="py-20 md:py-32 bg-gradient-to-br from-[#FFF1F2] via-[#FFF1F2] to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
            Nos profils
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-medium mb-6 text-slate-900">
            Découvrez nos membres
          </h2>
          <p className="text-lg text-muted-foreground">
            Tous nos profils sont vérifiés et validés. Les photos sont floutées 
            pour protéger la vie privée de nos membres jusqu'au paiement.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-card hover-lift border border-white/50"
              onMouseEnter={() => setHoveredId(profile.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Blurred Photo Placeholder */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-secondary via-accent to-secondary overflow-hidden">
                <div className="absolute inset-0 blur-[20px]">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-rose-soft/50 rounded-full" />
                  <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-beige-warm/70 rounded-full" />
                  <div className="absolute bottom-1/4 left-1/3 w-2/5 h-2/5 bg-accent/60 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-2/5 bg-primary/20 rounded-full" />
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/10 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-card/95 shadow-elevated flex items-center justify-center mb-3">
                    <Lock size={28} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground/90">Photo protégée</p>
                  <p className="text-xs text-muted-foreground mt-1">Débloquez l'accès pour voir</p>
                </div>

                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Heart size={14} className="text-primary fill-primary" />
                  <span className="text-xs font-medium">Vérifié</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-medium text-slate-800">
                    {profile.name}, {profile.age}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin size={14} />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Briefcase size={14} />
                    <span>{profile.profession}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 italic">
                  "{profile.description}"
                </p>

                <Button 
                  variant="romantic" 
                  size="sm" 
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                >
                  Voir le profil complet
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Débloquez l'accès complet aux photos pour seulement <span className="text-primary font-semibold">50€</span>
          </p>
          <Button variant="romantic" size="lg" className="shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
            Accéder à la galerie complète
          </Button>
        </div>
      </div>
    </section>
  );
};